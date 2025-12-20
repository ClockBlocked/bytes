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
$basePath = '/api/repos.php';
$pathInfo = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$pathInfo = trim($pathInfo, '/');
$pathParts = $pathInfo ? explode('/', $pathInfo) : [];

$repoId = $pathParts[0] ?? null;
$subResource = $pathParts[1] ?? null;
$subResourceId = $pathParts[2] ?? null;

try {
    if (!$repoId) {
        handleRepoCollection($method);
    } elseif (!$subResource) {
        handleSingleRepo($method, $repoId);
    } elseif ($subResource === 'files') {
        if (!$subResourceId) {
            handleFileCollection($method, $repoId);
        } else {
            handleSingleFile($method, $repoId, $subResourceId);
        }
    } elseif ($subResource === 'content' && $subResourceId) {
        handleFileContent($method, $repoId, $subResourceId);
    } elseif ($subResource === 'duplicate') {
        handleDuplicate($method, $repoId);
    } elseif ($subResource === 'star') {
        handleStar($method, $repoId);
    } elseif ($subResource === 'view') {
        handleView($method, $repoId);
    } else {
        errorResponse('Invalid endpoint', 404);
    }
} catch (Exception $e) {
    errorResponse($e->getMessage(), 500);
}

function handleRepoCollection(string $method): void {
    switch ($method) {
        case 'GET':
            listRepositories();
            break;
        case 'POST':
            createRepository();
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
}

function handleSingleRepo(string $method, string $repoId): void {
    switch ($method) {
        case 'GET':
            getRepository($repoId);
            break;
        case 'PUT':
        case 'PATCH':
            updateRepository($repoId);
            break;
        case 'DELETE':
            deleteRepository($repoId);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
}

function handleFileCollection(string $method, string $repoId): void {
    switch ($method) {
        case 'GET':
            listFiles($repoId);
            break;
        case 'POST':
            createFile($repoId);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
}

function handleSingleFile(string $method, string $repoId, string $fileId): void {
    switch ($method) {
        case 'GET':
            getFile($repoId, $fileId);
            break;
        case 'PUT':
        case 'PATCH':
            updateFile($repoId, $fileId);
            break;
        case 'DELETE':
            deleteFile($repoId, $fileId);
            break;
        default:
            errorResponse('Method not allowed', 405);
    }
}

function handleFileContent(string $method, string $repoId, string $fileId): void {
    if ($method !== 'GET') {
        errorResponse('Method not allowed', 405);
    }
    
    getFileContent($repoId, $fileId);
}

function handleDuplicate(string $method, string $repoId): void {
    if ($method !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    duplicateRepository($repoId);
}

function handleStar(string $method, string $repoId): void {
    if ($method !== 'POST' && $method !== 'DELETE') {
        errorResponse('Method not allowed', 405);
    }
    
    toggleStar($repoId, $method === 'POST');
}

function handleView(string $method, string $repoId): void {
    if ($method !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    incrementView($repoId);
}

function listRepositories(): void {
    $options = [
        'visibility' => getQueryParam('visibility'),
        'ownerId' => getQueryParam('ownerId'),
        'search' => getQueryParam('search'),
        'tags' => getQueryParam('tags') ? explode(',', getQueryParam('tags')) : [],
        'sortBy' => getQueryParam('sortBy', 'updatedAt'),
        'sortOrder' => getQueryParam('sortOrder', 'desc'),
        'limit' => getQueryParam('limit') ? (int)getQueryParam('limit') : null,
        'offset' => (int)getQueryParam('offset', 0)
    ];
    
    $repos = Repository::all($options);
    $total = Repository::count(arrayExcept($options, ['limit', 'offset']));
    
    $summaries = array_map(fn($repo) => $repo->toSummary(), $repos);
    
    successResponse([
        'repositories' => $summaries,
        'total' => $total,
        'limit' => $options['limit'],
        'offset' => $options['offset'],
        'hasMore' => $options['limit'] ? ($options['offset'] + count($repos)) < $total : false
    ], 'Repositories retrieved successfully');
}

function createRepository(): void {
    $body = getRequestBody();
    
    $name = requireBodyParam($body, 'name');
    
    $repo = Repository::create([
        'name' => $name,
        'description' => $body['description'] ?? '',
        'visibility' => $body['visibility'] ?? 'public',
        'tags' => $body['tags'] ?? [],
        'ownerId' => $body['ownerId'] ?? null
    ]);
    
    if (isset($body['files']) && is_array($body['files'])) {
        foreach ($body['files'] as $fileData) {
            if (isset($fileData['filename'])) {
                $repo->addFile([
                    'filename' => $fileData['filename'],
                    'content' => $fileData['content'] ?? ''
                ]);
            }
        }
        
        $repo = Repository::find($repo->getId());
    }
    
    successResponse([
        'repository' => $repo->toArray()
    ], 'Repository created successfully', 201);
}

function getRepository(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    
    $includeContent = getQueryParam('includeContent', 'false') === 'true';
    
    $data = $repo->toArray();
    
    if ($includeContent) {
        foreach ($data['files'] as &$file) {
            $content = $repo->getFileContent($file['id']);
            $file['content'] = $content ?? '';
        }
    }
    
    successResponse([
        'repository' => $data
    ], 'Repository retrieved successfully');
}

function updateRepository(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    $body = getRequestBody();
    
    $repo->update($body);
    
    successResponse([
        'repository' => $repo->toArray()
    ], 'Repository updated successfully');
}

function deleteRepository(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    
    $repo->delete();
    
    successResponse([
        'deleted' => true,
        'id' => $repoId
    ], 'Repository deleted successfully');
}

function duplicateRepository(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    $body = getRequestBody();
    
    $newName = $body['name'] ?? null;
    $newRepo = $repo->duplicate($newName);
    
    successResponse([
        'repository' => $newRepo->toArray()
    ], 'Repository duplicated successfully', 201);
}

function toggleStar(string $repoId, bool $star): void {
    $repo = Repository::findOrFail($repoId);
    
    if ($star) {
        $repo->incrementStars();
    } else {
        $repo->decrementStars();
    }
    
    successResponse([
        'stars' => $repo->getStars()
    ], $star ? 'Repository starred' : 'Repository unstarred');
}

function incrementView(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    
    $repo->incrementViews();
    
    successResponse([
        'views' => $repo->getViews()
    ], 'View recorded');
}

function listFiles(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    
    successResponse([
        'files' => $repo->getFiles(),
        'count' => count($repo->getFiles())
    ], 'Files retrieved successfully');
}

function createFile(string $repoId): void {
    $repo = Repository::findOrFail($repoId);
    $body = getRequestBody();
    
    $filename = requireBodyParam($body, 'filename');
    
    $file = $repo->addFile([
        'filename' => $filename,
        'content' => $body['content'] ?? ''
    ]);
    
    successResponse([
        'file' => $file
    ], 'File created successfully', 201);
}

function getFile(string $repoId, string $fileId): void {
    $repo = Repository::findOrFail($repoId);
    
    $file = $repo->getFile($fileId);
    
    if (!$file) {
        errorResponse('File not found', 404);
    }
    
    $includeContent = getQueryParam('includeContent', 'false') === 'true';
    
    if ($includeContent) {
        $file['content'] = $repo->getFileContent($fileId) ?? '';
    }
    
    successResponse([
        'file' => $file
    ], 'File retrieved successfully');
}

function updateFile(string $repoId, string $fileId): void {
    $repo = Repository::findOrFail($repoId);
    $body = getRequestBody();
    
    $file = $repo->updateFile($fileId, $body);
    
    successResponse([
        'file' => $file
    ], 'File updated successfully');
}

function deleteFile(string $repoId, string $fileId): void {
    $repo = Repository::findOrFail($repoId);
    
    $repo->deleteFile($fileId);
    
    successResponse([
        'deleted' => true,
        'id' => $fileId
    ], 'File deleted successfully');
}

function getFileContent(string $repoId, string $fileId): void {
    $repo = Repository::findOrFail($repoId);
    
    $file = $repo->getFile($fileId);
    
    if (!$file) {
        errorResponse('File not found', 404);
    }
    
    $content = $repo->getFileContent($fileId);
    
    if ($content === null) {
        errorResponse('File content not found', 404);
    }
    
    $asRaw = getQueryParam('raw', 'false') === 'true';
    
    if ($asRaw) {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: inline; filename="' . $file['filename'] . '"');
        corsHeaders();
        echo $content;
        exit;
    }
    
    successResponse([
        'file' => $file,
        'content' => $content
    ], 'File content retrieved successfully');
}
