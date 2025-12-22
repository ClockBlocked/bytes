<?php

declare(strict_types=1);

function generateId(string $prefix = ''): string {
    $timestamp = dechex((int)(microtime(true) * 1000));
    $random = bin2hex(random_bytes(8));
    return $prefix ? "{$prefix}_{$timestamp}{$random}" : "{$timestamp}{$random}";
}

function generateSlug(string $text, int $maxLength = 50): string {
    $slug = strtolower(trim($text));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');
    
    if (strlen($slug) > $maxLength) {
        $slug = substr($slug, 0, $maxLength);
        $slug = rtrim($slug, '-');
    }
    
    return $slug ?: 'untitled';
}

function sanitizeFilename(string $filename): string {
    $filename = basename($filename);
    $filename = preg_replace('/[^\w\-\.]/', '_', $filename);
    $filename = preg_replace('/_{2,}/', '_', $filename);
    $filename = trim($filename, '_');
    
    if (strlen($filename) > MAX_FILENAME_LENGTH) {
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        $name = pathinfo($filename, PATHINFO_FILENAME);
        $maxNameLength = MAX_FILENAME_LENGTH - strlen($ext) - 1;
        $filename = substr($name, 0, $maxNameLength) . '.' . $ext;
    }
    
    return $filename;
}

function getFileExtension(string $filename): string {
    return strtolower(pathinfo($filename, PATHINFO_EXTENSION));
}

function detectLanguage(string $filename): string {
    $ext = getFileExtension($filename);
    return LANGUAGE_MAP[$ext] ?? 'plaintext';
}

function isAllowedExtension(string $filename): bool {
    $ext = getFileExtension($filename);
    return in_array($ext, ALLOWED_EXTENSIONS, true) || $ext === '';
}

function formatBytes(int $bytes, int $precision = 2): string {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}

function getTimestamp(): string {
    return gmdate('Y-m-d\TH:i:s\Z');
}

function parseTimestamp(string $timestamp): ?int {
    $datetime = DateTime::createFromFormat('Y-m-d\TH:i:s\Z', $timestamp, new DateTimeZone('UTC'));
    return $datetime ? $datetime->getTimestamp() : null;
}

function readJsonFile(string $path): ?array {
    if (!file_exists($path)) {
        return null;
    }
    
    $content = file_get_contents($path);
    if ($content === false) {
        return null;
    }
    
    $data = json_decode($content, true);
    return is_array($data) ? $data : null;
}

function writeJsonFile(string $path, array $data): bool {
    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    $tempFile = $path . '.tmp';
    if (file_put_contents($tempFile, $json, LOCK_EX) === false) {
        return false;
    }
    
    return rename($tempFile, $path);
}

function deleteDirectory(string $dir): bool {
    if (!is_dir($dir)) {
        return false;
    }
    
    $files = array_diff(scandir($dir), ['.', '..']);
    
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            unlink($path);
        }
    }
    
    return rmdir($dir);
}

function copyDirectory(string $src, string $dst): bool {
    if (!is_dir($src)) {
        return false;
    }
    
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    
    $files = array_diff(scandir($src), ['.', '..']);
    
    foreach ($files as $file) {
        $srcPath = $src . '/' . $file;
        $dstPath = $dst . '/' . $file;
        
        if (is_dir($srcPath)) {
            copyDirectory($srcPath, $dstPath);
        } else {
            copy($srcPath, $dstPath);
        }
    }
    
    return true;
}

function getDirectorySize(string $dir): int {
    $size = 0;
    
    if (!is_dir($dir)) {
        return 0;
    }
    
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    
    return $size;
}

function validateRepoName(string $name): array {
    $errors = [];
    
    if (empty(trim($name))) {
        $errors[] = 'Repository name cannot be empty';
    }
    
    if (strlen($name) > MAX_REPO_NAME_LENGTH) {
        $errors[] = 'Repository name exceeds maximum length of ' . MAX_REPO_NAME_LENGTH . ' characters';
    }
    
    if (preg_match('/^[\.\-_]|[\.\-_]$/', $name)) {
        $errors[] = 'Repository name cannot start or end with special characters';
    }
    
    if (preg_match('/[<>:\"\/\\|?*\x00-\x1f]/', $name)) {
        $errors[] = 'Repository name contains invalid characters';
    }
    
    return $errors;
}

function validateDescription(string $description): array {
    $errors = [];
    
    if (strlen($description) > MAX_DESCRIPTION_LENGTH) {
        $errors[] = 'Description exceeds maximum length of ' . MAX_DESCRIPTION_LENGTH . ' characters';
    }
    
    return $errors;
}

function validateFileContent(string $content): array {
    $errors = [];
    
    $size = strlen($content);
    if ($size > MAX_FILE_SIZE) {
        $errors[] = 'File size (' . formatBytes($size) . ') exceeds maximum allowed size (' . formatBytes(MAX_FILE_SIZE) . ')';
    }
    
    return $errors;
}

function validateFilename(string $filename): array {
    $errors = [];
    
    if (empty(trim($filename))) {
        $errors[] = 'Filename cannot be empty';
    }
    
    if (strlen($filename) > MAX_FILENAME_LENGTH) {
        $errors[] = 'Filename exceeds maximum length of ' . MAX_FILENAME_LENGTH . ' characters';
    }
    
    if (!isAllowedExtension($filename)) {
        $errors[] = 'File extension is not allowed';
    }
    
    if (preg_match('/^\./', $filename) && !in_array($filename, ['.htaccess', '.gitignore', '.env'])) {
        $errors[] = 'Hidden files are not allowed (except .htaccess, .gitignore, .env)';
    }
    
    if (preg_match('/[<>:\"\/\\|?*\x00-\x1f]/', $filename)) {
        $errors[] = 'Filename contains invalid characters';
    }
    
    return $errors;
}

function corsHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

function jsonResponse(array $data, int $statusCode = 200): never {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    corsHeaders();
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function errorResponse(string $message, int $statusCode = 400, ?array $errors = null): never {
    $response = [
        'success' => false,
        'error' => $message,
        'timestamp' => getTimestamp()
    ];
    
    if ($errors !== null) {
        $response['errors'] = $errors;
    }
    
    jsonResponse($response, $statusCode);
}

function successResponse(array $data, string $message = 'Success', int $statusCode = 200): never {
    jsonResponse([
        'success' => true,
        'message' => $message,
        'data' => $data,
        'timestamp' => getTimestamp()
    ], $statusCode);
}

function getRequestBody(): array {
    $input = file_get_contents('php://input');
    
    if (empty($input)) {
        return [];
    }
    
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        errorResponse('Invalid JSON in request body', 400);
    }
    
    return $data ?? [];
}

function requireMethod(string ...$methods): void {
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    
    if ($requestMethod === 'OPTIONS') {
        corsHeaders();
        http_response_code(204);
        exit;
    }
    
    if (!in_array($requestMethod, $methods, true)) {
        errorResponse('Method not allowed. Allowed: ' . implode(', ', $methods), 405);
    }
}

function getQueryParam(string $key, mixed $default = null): mixed {
    return $_GET[$key] ?? $default;
}

function requireQueryParam(string $key): string {
    $value = getQueryParam($key);
    
    if ($value === null || $value === '') {
        errorResponse("Missing required parameter: {$key}", 400);
    }
    
    return $value;
}

function requireBodyParam(array $body, string $key): mixed {
    if (!isset($body[$key])) {
        errorResponse("Missing required field: {$key}", 400);
    }
    
    return $body[$key];
}

function countLines(string $content): int {
    if (empty($content)) {
        return 0;
    }
    return substr_count($content, "\n") + 1;
}

function truncateText(string $text, int $maxLength = 100, string $suffix = '...'): string {
    if (strlen($text) <= $maxLength) {
        return $text;
    }
    
    return substr($text, 0, $maxLength - strlen($suffix)) . $suffix;
}

function arrayOnly(array $array, array $keys): array {
    return array_intersect_key($array, array_flip($keys));
}

function arrayExcept(array $array, array $keys): array {
    return array_diff_key($array, array_flip($keys));
}
