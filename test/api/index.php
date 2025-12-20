<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/utils.php';
require_once __DIR__ . '/../models/Repository.php';

corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$pathInfo = parse_url($requestUri, PHP_URL_PATH);
$pathInfo = str_replace($scriptName, '', $pathInfo);
$pathInfo = str_replace('/index.php', '', $pathInfo);
$pathInfo = trim($pathInfo, '/');

$segments = $pathInfo ? explode('/', $pathInfo) : [];

$routes = [
    'GET' => [
        'repos' => 'listRepos',
        'repos/{id}' => 'getRepo',
        'repos/{id}/files' => 'listFiles',
        'repos/{id}/files/{fileId}' => 'getFile',
        'repos/{id}/files/{fileId}/content' => 'getFileContent',
        'repos/{id}/raw/{fileId}' => 'getRawContent',
        'search' => 'searchRepos',
        'stats' => 'getStats'
    ],
    'POST' => [
        'repos' => 'createRepo',
        'repos/{id}/files' => 'createFile',
        'repos/{id}/duplicate' => 'duplicateRepo',
        'repos/{id}/star' => 'starRepo',
        'repos/{id}/view' => 'recordView',
        'import' => 'importRepo'
    ],
    'PUT' => [
        'repos/{id}' => 'updateRepo',
        'repos/{id}/files/{fileId}' => 'updateFile'
    ],
    'PATCH' => [
        'repos/{id}' => 'updateRepo',
        'repos/{id}/files/{fileId}' => 'updateFile'
    ],
    'DELETE' => [
        'repos/{id}' => 'deleteRepo',
        'repos/{id}/files/{fileId}' => 'deleteFile',
        'repos/{id}/star' => 'unstarRepo'
    ]
];

function matchRoute(array $segments, array $routes): ?array {
    $path = implode('/', $segments);
    
    if (isset($routes[$path])) {
        return ['handler' => $routes[$path], 'params' => []];
    }
    
    foreach ($routes as $pattern => $handler) {
        $patternSegments = explode('/', $pattern);
        
        if (count($patternSegments) !== count($segments)) {
            continue;
        }
        
        $params = [];
        $match = true;
        
        for ($i = 0; $i < count($patternSegments); $i++) {
            $patternPart = $patternSegments[$i];
            $segmentPart = $segments[$i];
            
            if (preg_match('/^\{(\w+)\}$/', $patternPart, $matches)) {
                $params[$matches[1]] = $segmentPart;
            } elseif ($patternPart !== $segmentPart) {
                $match = false;
                break;
            }
        }
        
        if ($match) {
            return ['handler' => $handler, 'params' => $params];
        }
    }
    
    return null;
}

try {
    if (!isset($routes[$method])) {
        errorResponse('Method not allowed', 405);
    }
    
    $matched = matchRoute($segments, $routes[$method]);
    
    if (!$matched) {
        errorResponse('Endpoint not found', 404);
    }
    
    $handler = $matched['handler'];
    $params = $matched['params'];
    
    call_user_func($handler, $params);
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 500);
}

function listRepos(array $params): void {
    $options = [
        'visibility' => getQueryParam('visibility'),
        'ownerId' => getQueryParam('ownerId'),
        'search' => getQueryParam('q'),
        'tags' => getQueryParam('tags') ? explode(',', getQueryParam('tags')) : [],
        'sortBy' => getQueryParam('sort', 'updatedAt'),
        'sortOrder' => getQueryParam('order', 'desc'),
        'limit' => getQueryParam('limit') ? (int)getQueryParam('limit') : 20,
        'offset' => (int)getQueryParam('offset', 0)
    ];
    
    $repos = Repository::all($options);
    $total = Repository::count(arrayExcept($options, ['limit', 'offset']));
    
    successResponse([
        'repositories' => array_map(fn($r) => $r->toSummary(), $repos),
        'pagination' => [
            'total' => $total,
            'limit' => $options['limit'],
            'offset' => $options['offset'],
            'hasMore' => ($options['offset'] + count($repos)) < $total
        ]
    ]);
}

function getRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    
    $withContent = getQueryParam('content', 'false') === 'true';
    $data = $repo->toArray();
    
    if ($withContent) {
        foreach ($data['files'] as &$file) {
            $file['content'] = $repo->getFileContent($file['id']) ?? '';
        }
    }
    
    successResponse(['repository' => $data]);
}

function createRepo(array $params): void {
    $body = getRequestBody();
    
    $repo = Repository::create([
        'name' => requireBodyParam($body, 'name'),
        'description' => $body['description'] ?? '',
        'visibility' => $body['visibility'] ?? 'public',
        'tags' => $body['tags'] ?? [],
        'ownerId' => $body['ownerId'] ?? null
    ]);
    
    if (!empty($body['files'])) {
        foreach ($body['files'] as $f) {
            if (isset($f['filename'])) {
                $repo->addFile([
                    'filename' => $f['filename'],
                    'content' => $f['content'] ?? ''
                ]);
            }
        }
        $repo = Repository::find($repo->getId());
    }
    
    successResponse(['repository' => $repo->toArray()], 'Created', 201);
}

function updateRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->update(getRequestBody());
    successResponse(['repository' => $repo->toArray()]);
}

function deleteRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->delete();
    successResponse(['deleted' => true, 'id' => $params['id']]);
}

function duplicateRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $body = getRequestBody();
    $newRepo = $repo->duplicate($body['name'] ?? null);
    successResponse(['repository' => $newRepo->toArray()], 'Duplicated', 201);
}

function starRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->incrementStars();
    successResponse(['stars' => $repo->getStars()]);
}

function unstarRepo(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->decrementStars();
    successResponse(['stars' => $repo->getStars()]);
}

function recordView(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->incrementViews();
    successResponse(['views' => $repo->getViews()]);
}

function listFiles(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    successResponse([
        'files' => $repo->getFiles(),
        'count' => count($repo->getFiles())
    ]);
}

function createFile(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $body = getRequestBody();
    
    $file = $repo->addFile([
        'filename' => requireBodyParam($body, 'filename'),
        'content' => $body['content'] ?? ''
    ]);
    
    successResponse(['file' => $file], 'Created', 201);
}

function getFile(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $file = $repo->getFile($params['fileId']);
    
    if (!$file) {
        errorResponse('File not found', 404);
    }
    
    if (getQueryParam('content', 'false') === 'true') {
        $file['content'] = $repo->getFileContent($params['fileId']) ?? '';
    }
    
    successResponse(['file' => $file]);
}

function updateFile(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $file = $repo->updateFile($params['fileId'], getRequestBody());
    successResponse(['file' => $file]);
}

function deleteFile(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $repo->deleteFile($params['fileId']);
    successResponse(['deleted' => true, 'id' => $params['fileId']]);
}

function getFileContent(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $file = $repo->getFile($params['fileId']);
    
    if (!$file) {
        errorResponse('File not found', 404);
    }
    
    $content = $repo->getFileContent($params['fileId']);
    
    if ($content === null) {
        errorResponse('Content not found', 404);
    }
    
    successResponse([
        'file' => $file,
        'content' => $content
    ]);
}

function getRawContent(array $params): void {
    $repo = Repository::findOrFail($params['id']);
    $file = $repo->getFile($params['fileId']);
    
    if (!$file) {
        errorResponse('File not found', 404);
    }
    
    $content = $repo->getFileContent($params['fileId']);
    
    if ($content === null) {
        errorResponse('Content not found', 404);
    }
    
    header('Content-Type: text/plain; charset=utf-8');
    header('Content-Disposition: inline; filename="' . $file['filename'] . '"');
    header('Cache-Control: no-cache');
    corsHeaders();
    echo $content;
    exit;
}

function searchRepos(array $params): void {
    $query = getQueryParam('q', '');
    
    if (empty($query)) {
        errorResponse('Search query required', 400);
    }
    
    $repos = Repository::all([
        'search' => $query,
        'visibility' => 'public',
        'limit' => (int)getQueryParam('limit', 20),
        'offset' => (int)getQueryParam('offset', 0)
    ]);
    
    successResponse([
        'query' => $query,
        'results' => array_map(fn($r) => $r->toSummary(), $repos),
        'count' => count($repos)
    ]);
}

function getStats(array $params): void {
    $allRepos = Repository::all();
    
    $totalFiles = 0;
    $totalSize = 0;
    $languages = [];
    
    foreach ($allRepos as $repo) {
        $files = $repo->getFiles();
        $totalFiles += count($files);
        
        foreach ($files as $file) {
            $totalSize += $file['size'];
            $lang = $file['language'];
            $languages[$lang] = ($languages[$lang] ?? 0) + 1;
        }
    }
    
    arsort($languages);
    
    successResponse([
        'totalRepositories' => count($allRepos),
        'totalFiles' => $totalFiles,
        'totalSize' => $totalSize,
        'totalSizeFormatted' => formatBytes($totalSize),
        'languageBreakdown' => $languages,
        'topLanguages' => array_slice(array_keys($languages), 0, 5)
    ]);
}

function importRepo(array $params): void {
    $body = getRequestBody();
    
    if (!isset($body['repository'])) {
        errorResponse('Repository data required', 400);
    }
    
    $importData = $body['repository'];
    
    $repo = Repository::create([
        'name' => $importData['name'] ?? 'Imported Repository',
        'description' => $importData['description'] ?? '',
        'visibility' => $importData['visibility'] ?? 'public',
        'tags' => $importData['tags'] ?? [],
        'ownerId' => $body['ownerId'] ?? null
    ]);
    
    if (!empty($importData['files'])) {
        foreach ($importData['files'] as $file) {
            $repo->addFile([
                'filename' => $file['filename'] ?? 'untitled.txt',
                'content' => $file['content'] ?? ''
            ]);
        }
        $repo = Repository::find($repo->getId());
    }
    
    successResponse(['repository' => $repo->toArray()], 'Imported', 201);
}
