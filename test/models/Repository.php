<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/utils.php';

class Repository {
    private string $id;
    private string $name;
    private string $slug;
    private string $description;
    private string $visibility;
    private string $createdAt;
    private string $updatedAt;
    private array $files;
    private array $tags;
    private int $stars;
    private int $views;
    private ?string $ownerId;
    
    private string $repoDir;
    private string $filesDir;
    private string $manifestPath;
    
    public function __construct(?string $id = null) {
        if ($id) {
            $this->id = $id;
            $this->repoDir = REPOS_DIR . '/' . $id;
            $this->filesDir = $this->repoDir . '/files';
            $this->manifestPath = $this->repoDir . '/manifest.json';
        }
    }
    
    public static function create(array $data): self {
        $repo = new self();
        
        $nameErrors = validateRepoName($data['name'] ?? '');
        if (!empty($nameErrors)) {
            errorResponse('Invalid repository name', 400, $nameErrors);
        }
        
        if (isset($data['description'])) {
            $descErrors = validateDescription($data['description']);
            if (!empty($descErrors)) {
                errorResponse('Invalid description', 400, $descErrors);
            }
        }
        
        $repo->id = generateId('repo');
        $repo->name = trim($data['name']);
        $repo->slug = generateSlug($repo->name);
        $repo->description = trim($data['description'] ?? '');
        $repo->visibility = in_array($data['visibility'] ?? 'public', ['public', 'private', 'unlisted']) 
            ? $data['visibility'] 
            : 'public';
        $repo->createdAt = getTimestamp();
        $repo->updatedAt = $repo->createdAt;
        $repo->files = [];
        $repo->tags = $data['tags'] ?? [];
        $repo->stars = 0;
        $repo->views = 0;
        $repo->ownerId = $data['ownerId'] ?? null;
        
        $repo->repoDir = REPOS_DIR . '/' . $repo->id;
        $repo->filesDir = $repo->repoDir . '/files';
        $repo->manifestPath = $repo->repoDir . '/manifest.json';
        
        if (!mkdir($repo->repoDir, 0755, true)) {
            errorResponse('Failed to create repository directory', 500);
        }
        
        if (!mkdir($repo->filesDir, 0755, true)) {
            errorResponse('Failed to create files directory', 500);
        }
        
        $repo->save();
        
        return $repo;
    }
    
    public static function find(string $id): ?self {
        $repoDir = REPOS_DIR . '/' . $id;
        $manifestPath = $repoDir . '/manifest.json';
        
        if (!file_exists($manifestPath)) {
            return null;
        }
        
        $data = readJsonFile($manifestPath);
        if (!$data) {
            return null;
        }
        
        return self::fromArray($data);
    }
    
    public static function findOrFail(string $id): self {
        $repo = self::find($id);
        
        if (!$repo) {
            errorResponse('Repository not found', 404);
        }
        
        return $repo;
    }
    
    public static function findBySlug(string $slug): ?self {
        $repos = self::all();
        
        foreach ($repos as $repo) {
            if ($repo->getSlug() === $slug) {
                return $repo;
            }
        }
        
        return null;
    }
    
    public static function all(array $options = []): array {
        $repos = [];
        
        if (!is_dir(REPOS_DIR)) {
            return $repos;
        }
        
        $visibility = $options['visibility'] ?? null;
        $ownerId = $options['ownerId'] ?? null;
        $search = $options['search'] ?? null;
        $tags = $options['tags'] ?? [];
        $sortBy = $options['sortBy'] ?? 'updatedAt';
        $sortOrder = $options['sortOrder'] ?? 'desc';
        $limit = $options['limit'] ?? null;
        $offset = $options['offset'] ?? 0;
        
        $dirs = array_filter(glob(REPOS_DIR . '/*'), 'is_dir');
        
        foreach ($dirs as $dir) {
            $id = basename($dir);
            $repo = self::find($id);
            
            if (!$repo) {
                continue;
            }
            
            if ($visibility && $repo->visibility !== $visibility) {
                continue;
            }
            
            if ($ownerId && $repo->ownerId !== $ownerId) {
                continue;
            }
            
            if ($search) {
                $searchLower = strtolower($search);
                $nameMatch = strpos(strtolower($repo->name), $searchLower) !== false;
                $descMatch = strpos(strtolower($repo->description), $searchLower) !== false;
                
                if (!$nameMatch && !$descMatch) {
                    continue;
                }
            }
            
            if (!empty($tags)) {
                $hasTag = false;
                foreach ($tags as $tag) {
                    if (in_array($tag, $repo->tags)) {
                        $hasTag = true;
                        break;
                    }
                }
                if (!$hasTag) {
                    continue;
                }
            }
            
            $repos[] = $repo;
        }
        
        usort($repos, function($a, $b) use ($sortBy, $sortOrder) {
            $aVal = match($sortBy) {
                'name' => strtolower($a->getName()),
                'createdAt' => $a->getCreatedAt(),
                'updatedAt' => $a->getUpdatedAt(),
                'stars' => $a->getStars(),
                'views' => $a->getViews(),
                default => $a->getUpdatedAt()
            };
            
            $bVal = match($sortBy) {
                'name' => strtolower($b->getName()),
                'createdAt' => $b->getCreatedAt(),
                'updatedAt' => $b->getUpdatedAt(),
                'stars' => $b->getStars(),
                'views' => $b->getViews(),
                default => $b->getUpdatedAt()
            };
            
            $comparison = $aVal <=> $bVal;
            return $sortOrder === 'desc' ? -$comparison : $comparison;
        });
        
        if ($offset > 0) {
            $repos = array_slice($repos, $offset);
        }
        
        if ($limit !== null) {
            $repos = array_slice($repos, 0, $limit);
        }
        
        return $repos;
    }
    
    public static function count(array $options = []): int {
        $options['limit'] = null;
        $options['offset'] = 0;
        return count(self::all($options));
    }
    
    private static function fromArray(array $data): self {
        $repo = new self($data['id']);
        
        $repo->id = $data['id'];
        $repo->name = $data['name'];
        $repo->slug = $data['slug'] ?? generateSlug($data['name']);
        $repo->description = $data['description'] ?? '';
        $repo->visibility = $data['visibility'] ?? 'public';
        $repo->createdAt = $data['createdAt'];
        $repo->updatedAt = $data['updatedAt'];
        $repo->files = $data['files'] ?? [];
        $repo->tags = $data['tags'] ?? [];
        $repo->stars = $data['stars'] ?? 0;
        $repo->views = $data['views'] ?? 0;
        $repo->ownerId = $data['ownerId'] ?? null;
        
        return $repo;
    }
    
    public function save(): bool {
        $this->updatedAt = getTimestamp();
        return writeJsonFile($this->manifestPath, $this->toArray());
    }
    
    public function update(array $data): self {
        if (isset($data['name'])) {
            $nameErrors = validateRepoName($data['name']);
            if (!empty($nameErrors)) {
                errorResponse('Invalid repository name', 400, $nameErrors);
            }
            $this->name = trim($data['name']);
            $this->slug = generateSlug($this->name);
        }
        
        if (isset($data['description'])) {
            $descErrors = validateDescription($data['description']);
            if (!empty($descErrors)) {
                errorResponse('Invalid description', 400, $descErrors);
            }
            $this->description = trim($data['description']);
        }
        
        if (isset($data['visibility']) && in_array($data['visibility'], ['public', 'private', 'unlisted'])) {
            $this->visibility = $data['visibility'];
        }
        
        if (isset($data['tags']) && is_array($data['tags'])) {
            $this->tags = array_values(array_unique($data['tags']));
        }
        
        $this->save();
        
        return $this;
    }
    
    public function delete(): bool {
        $trashDir = TRASH_DIR . '/' . $this->id . '_' . time();
        
        if (!rename($this->repoDir, $trashDir)) {
            return deleteDirectory($this->repoDir);
        }
        
        return true;
    }
    
    public function addFile(array $fileData): array {
        if (count($this->files) >= MAX_FILES_PER_REPO) {
            errorResponse('Maximum files per repository limit reached (' . MAX_FILES_PER_REPO . ')', 400);
        }
        
        $filename = sanitizeFilename($fileData['filename'] ?? 'untitled.txt');
        
        $filenameErrors = validateFilename($filename);
        if (!empty($filenameErrors)) {
            errorResponse('Invalid filename', 400, $filenameErrors);
        }
        
        foreach ($this->files as $existingFile) {
            if (strtolower($existingFile['filename']) === strtolower($filename)) {
                errorResponse('A file with this name already exists', 400);
            }
        }
        
        $content = $fileData['content'] ?? '';
        
        $contentErrors = validateFileContent($content);
        if (!empty($contentErrors)) {
            errorResponse('Invalid file content', 400, $contentErrors);
        }
        
        $fileId = generateId('file');
        $storedFilename = $fileId . '_' . $filename;
        $filePath = $this->filesDir . '/' . $storedFilename;
        
        if (file_put_contents($filePath, $content) === false) {
            errorResponse('Failed to save file content', 500);
        }
        
        $now = getTimestamp();
        
        $file = [
            'id' => $fileId,
            'filename' => $filename,
            'storedFilename' => $storedFilename,
            'language' => detectLanguage($filename),
            'size' => strlen($content),
            'lines' => countLines($content),
            'createdAt' => $now,
            'updatedAt' => $now,
            'path' => 'files/' . $storedFilename
        ];
        
        $this->files[] = $file;
        $this->save();
        
        return $file;
    }
    
    public function updateFile(string $fileId, array $fileData): array {
        $fileIndex = $this->findFileIndex($fileId);
        
        if ($fileIndex === -1) {
            errorResponse('File not found', 404);
        }
        
        $file = $this->files[$fileIndex];
        $oldStoredFilename = $file['storedFilename'];
        $oldFilePath = $this->filesDir . '/' . $oldStoredFilename;
        
        if (isset($fileData['filename'])) {
            $newFilename = sanitizeFilename($fileData['filename']);
            
            $filenameErrors = validateFilename($newFilename);
            if (!empty($filenameErrors)) {
                errorResponse('Invalid filename', 400, $filenameErrors);
            }
            
            if (strtolower($newFilename) !== strtolower($file['filename'])) {
                foreach ($this->files as $i => $existingFile) {
                    if ($i !== $fileIndex && strtolower($existingFile['filename']) === strtolower($newFilename)) {
                        errorResponse('A file with this name already exists', 400);
                    }
                }
            }
            
            $file['filename'] = $newFilename;
            $file['language'] = detectLanguage($newFilename);
            
            $newStoredFilename = $file['id'] . '_' . $newFilename;
            $newFilePath = $this->filesDir . '/' . $newStoredFilename;
            
            if ($oldStoredFilename !== $newStoredFilename) {
                rename($oldFilePath, $newFilePath);
                $file['storedFilename'] = $newStoredFilename;
                $file['path'] = 'files/' . $newStoredFilename;
                $oldFilePath = $newFilePath;
            }
        }
        
        if (isset($fileData['content'])) {
            $content = $fileData['content'];
            
            $contentErrors = validateFileContent($content);
            if (!empty($contentErrors)) {
                errorResponse('Invalid file content', 400, $contentErrors);
            }
            
            if (file_put_contents($oldFilePath, $content) === false) {
                errorResponse('Failed to save file content', 500);
            }
            
            $file['size'] = strlen($content);
            $file['lines'] = countLines($content);
        }
        
        $file['updatedAt'] = getTimestamp();
        $this->files[$fileIndex] = $file;
        $this->save();
        
        return $file;
    }
    
    public function deleteFile(string $fileId): bool {
        $fileIndex = $this->findFileIndex($fileId);
        
        if ($fileIndex === -1) {
            errorResponse('File not found', 404);
        }
        
        $file = $this->files[$fileIndex];
        $filePath = $this->filesDir . '/' . $file['storedFilename'];
        
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        array_splice($this->files, $fileIndex, 1);
        $this->save();
        
        return true;
    }
    
    public function getFile(string $fileId): ?array {
        $fileIndex = $this->findFileIndex($fileId);
        
        if ($fileIndex === -1) {
            return null;
        }
        
        return $this->files[$fileIndex];
    }
    
    public function getFileContent(string $fileId): ?string {
        $file = $this->getFile($fileId);
        
        if (!$file) {
            return null;
        }
        
        $filePath = $this->filesDir . '/' . $file['storedFilename'];
        
        if (!file_exists($filePath)) {
            return null;
        }
        
        return file_get_contents($filePath);
    }
    
    public function getFileByName(string $filename): ?array {
        foreach ($this->files as $file) {
            if (strtolower($file['filename']) === strtolower($filename)) {
                return $file;
            }
        }
        
        return null;
    }
    
    private function findFileIndex(string $fileId): int {
        foreach ($this->files as $index => $file) {
            if ($file['id'] === $fileId) {
                return $index;
            }
        }
        
        return -1;
    }
    
    public function incrementViews(): self {
        $this->views++;
        $this->save();
        return $this;
    }
    
    public function incrementStars(): self {
        $this->stars++;
        $this->save();
        return $this;
    }
    
    public function decrementStars(): self {
        if ($this->stars > 0) {
            $this->stars--;
            $this->save();
        }
        return $this;
    }
    
    public function duplicate(?string $newName = null): self {
        $data = [
            'name' => $newName ?? $this->name . ' (copy)',
            'description' => $this->description,
            'visibility' => $this->visibility,
            'tags' => $this->tags,
            'ownerId' => $this->ownerId
        ];
        
        $newRepo = self::create($data);
        
        foreach ($this->files as $file) {
            $content = $this->getFileContent($file['id']);
            
            if ($content !== null) {
                $newRepo->addFile([
                    'filename' => $file['filename'],
                    'content' => $content
                ]);
            }
        }
        
        return $newRepo;
    }
    
    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'visibility' => $this->visibility,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'files' => $this->files,
            'tags' => $this->tags,
            'stars' => $this->stars,
            'views' => $this->views,
            'ownerId' => $this->ownerId
        ];
    }
    
    public function toSummary(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => truncateText($this->description, 150),
            'visibility' => $this->visibility,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'fileCount' => count($this->files),
            'totalSize' => array_sum(array_column($this->files, 'size')),
            'languages' => array_values(array_unique(array_column($this->files, 'language'))),
            'tags' => $this->tags,
            'stars' => $this->stars,
            'views' => $this->views
        ];
    }
    
    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getSlug(): string { return $this->slug; }
    public function getDescription(): string { return $this->description; }
    public function getVisibility(): string { return $this->visibility; }
    public function getCreatedAt(): string { return $this->createdAt; }
    public function getUpdatedAt(): string { return $this->updatedAt; }
    public function getFiles(): array { return $this->files; }
    public function getTags(): array { return $this->tags; }
    public function getStars(): int { return $this->stars; }
    public function getViews(): int { return $this->views; }
    public function getOwnerId(): ?string { return $this->ownerId; }
    public function getRepoDir(): string { return $this->repoDir; }
    public function getFilesDir(): string { return $this->filesDir; }
}
