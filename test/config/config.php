<?php

declare(strict_types=1);

define('STORAGE_ROOT', dirname(__DIR__) . '/storage');
define('REPOS_DIR', STORAGE_ROOT . '/repos');
define('USERS_DIR', STORAGE_ROOT . '/users');
define('TRASH_DIR', STORAGE_ROOT . '/trash');

define('MAX_FILE_SIZE', 5 * 1024 * 1024);
define('MAX_FILES_PER_REPO', 50);
define('MAX_FILENAME_LENGTH', 255);
define('MAX_REPO_NAME_LENGTH', 100);
define('MAX_DESCRIPTION_LENGTH', 500);

define('ALLOWED_EXTENSIONS', [
    'html', 'htm', 'css', 'scss', 'sass', 'less',
    'js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx',
    'json', 'xml', 'yaml', 'yml', 'toml',
    'php', 'py', 'rb', 'java', 'c', 'cpp', 'h', 'hpp',
    'go', 'rs', 'swift', 'kt', 'scala',
    'sql', 'graphql', 'gql',
    'md', 'markdown', 'txt', 'rtf',
    'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd',
    'env', 'gitignore', 'htaccess', 'dockerfile',
    'vue', 'svelte', 'astro',
    'csv', 'log', 'ini', 'cfg', 'conf'
]);

define('LANGUAGE_MAP', [
    'html' => 'html',
    'htm' => 'html',
    'css' => 'css',
    'scss' => 'scss',
    'sass' => 'sass',
    'less' => 'less',
    'js' => 'javascript',
    'mjs' => 'javascript',
    'cjs' => 'javascript',
    'ts' => 'typescript',
    'tsx' => 'tsx',
    'jsx' => 'jsx',
    'json' => 'json',
    'xml' => 'xml',
    'yaml' => 'yaml',
    'yml' => 'yaml',
    'toml' => 'toml',
    'php' => 'php',
    'py' => 'python',
    'rb' => 'ruby',
    'java' => 'java',
    'c' => 'c',
    'cpp' => 'cpp',
    'h' => 'c',
    'hpp' => 'cpp',
    'go' => 'go',
    'rs' => 'rust',
    'swift' => 'swift',
    'kt' => 'kotlin',
    'scala' => 'scala',
    'sql' => 'sql',
    'graphql' => 'graphql',
    'gql' => 'graphql',
    'md' => 'markdown',
    'markdown' => 'markdown',
    'txt' => 'plaintext',
    'sh' => 'shell',
    'bash' => 'shell',
    'zsh' => 'shell',
    'ps1' => 'powershell',
    'bat' => 'batch',
    'cmd' => 'batch',
    'vue' => 'vue',
    'svelte' => 'svelte',
    'astro' => 'astro',
    'dockerfile' => 'dockerfile',
    'env' => 'plaintext',
    'gitignore' => 'plaintext',
    'htaccess' => 'apache',
    'csv' => 'csv',
    'log' => 'plaintext',
    'ini' => 'ini',
    'cfg' => 'ini',
    'conf' => 'apache'
]);

define('API_VERSION', '1.0.0');

date_default_timezone_set('UTC');

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

function initializeStorage(): bool {
    $directories = [STORAGE_ROOT, REPOS_DIR, USERS_DIR, TRASH_DIR];
    
    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true)) {
                return false;
            }
        }
    }
    
    $htaccessContent = "Options -Indexes\n";
    $htaccessContent .= "Deny from all\n";
    $htaccessContent .= "<FilesMatch \"\\.(json)$\">\n";
    $htaccessContent .= "    Deny from all\n";
    $htaccessContent .= "</FilesMatch>\n";
    
    $htaccessPath = STORAGE_ROOT . '/.htaccess';
    if (!file_exists($htaccessPath)) {
        file_put_contents($htaccessPath, $htaccessContent);
    }
    
    return true;
}

initializeStorage();
