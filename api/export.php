<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/utils.php';
require_once __DIR__ . '/../models/Repository.php';

corsHeaders();
requireMethod('GET');

$repoId = getQueryParam('id');
$format = getQueryParam('format', 'json');

if (!$repoId) {
    errorResponse('Repository ID required', 400);
}

$repo = Repository::findOrFail($repoId);

$exportData = $repo->toArray();

foreach ($exportData['files'] as &$file) {
    $content = $repo->getFileContent($file['id']);
    $file['content'] = $content ?? '';
}

$exportData['exportedAt'] = getTimestamp();
$exportData['version'] = API_VERSION;

switch ($format) {
    case 'json':
        exportAsJson($exportData, $repo->getSlug());
        break;
    case 'zip':
        exportAsZip($repo, $exportData);
        break;
    default:
        errorResponse('Invalid format. Supported: json, zip', 400);
}

function exportAsJson(array $data, string $slug): void {
    $filename = $slug . '_export_' . date('Y-m-d') . '.json';
    
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-cache, must-revalidate');
    
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function exportAsZip(Repository $repo, array $exportData): void {
    if (!class_exists('ZipArchive')) {
        errorResponse('ZIP extension not available', 500);
    }
    
    $slug = $repo->getSlug();
    $tempFile = sys_get_temp_dir() . '/' . $slug . '_' . uniqid() . '.zip';
    
    $zip = new ZipArchive();
    
    if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        errorResponse('Failed to create ZIP file', 500);
    }
    
    $zip->addEmptyDir($slug);
    
    foreach ($exportData['files'] as $file) {
        $zip->addFromString(
            $slug . '/' . $file['filename'],
            $file['content']
        );
    }
    
    $manifest = $exportData;
    foreach ($manifest['files'] as &$file) {
        unset($file['content']);
        unset($file['storedFilename']);
        unset($file['path']);
    }
    
    $zip->addFromString(
        $slug . '/manifest.json',
        json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );
    
    $readme = generateReadme($exportData);
    $zip->addFromString($slug . '/README.md', $readme);
    
    $zip->close();
    
    $filename = $slug . '_export_' . date('Y-m-d') . '.zip';
    
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($tempFile));
    header('Cache-Control: no-cache, must-revalidate');
    
    readfile($tempFile);
    unlink($tempFile);
    exit;
}

function generateReadme(array $data): string {
    $readme = "# " . $data['name'] . "\n\n";
    
    if (!empty($data['description'])) {
        $readme .= $data['description'] . "\n\n";
    }
    
    $readme .= "## Files\n\n";
    
    foreach ($data['files'] as $file) {
        $size = formatBytes($file['size']);
        $readme .= "- **{$file['filename']}** ({$file['language']}, {$size})\n";
    }
    
    $readme .= "\n## Metadata\n\n";
    $readme .= "- **Created:** {$data['createdAt']}\n";
    $readme .= "- **Last Updated:** {$data['updatedAt']}\n";
    $readme .= "- **Visibility:** {$data['visibility']}\n";
    
    if (!empty($data['tags'])) {
        $readme .= "- **Tags:** " . implode(', ', $data['tags']) . "\n";
    }
    
    $readme .= "\n---\n";
    $readme .= "*Exported on " . date('Y-m-d H:i:s') . " UTC*\n";
    
    return $readme;
}
