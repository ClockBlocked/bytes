/**
 * IndexedDBStorageManager - Uses IndexedDB for local file storage
 * 
 * CREATED BY
 * William Hanson
 * Chevrolay@Outlook.com
 * m.me/Chevrolay
 */

const IndexedDBStorageManager = {
    DB_NAME: 'code-editor-storage',
    DB_VERSION: 1,
    STORE_REPOSITORIES: 'repositories',
    STORE_FILES: 'files',
    STORE_FILE_CONTENTS: 'file_contents',
    
    db: null,
    
    // Initialize the database
    async initialize() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }
            
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onerror = (event) => {
                console.error('IndexedDB initialization failed:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create repositories store
                if (!db.objectStoreNames.contains(this.STORE_REPOSITORIES)) {
                    const repoStore = db.createObjectStore(this.STORE_REPOSITORIES, { keyPath: 'id' });
                    repoStore.createIndex('name', 'name', { unique: true });
                    repoStore.createIndex('created', 'created');
                }
                
                // Create files metadata store
                if (!db.objectStoreNames.contains(this.STORE_FILES)) {
                    const fileStore = db.createObjectStore(this.STORE_FILES, { keyPath: ['repoId', 'path'] });
                    fileStore.createIndex('repoId', 'repoId');
                    fileStore.createIndex('path', 'path');
                    fileStore.createIndex('lastModified', 'lastModified');
                    fileStore.createIndex('category', 'category');
                }
                
                // Create file contents store (blob storage)
                if (!db.objectStoreNames.contains(this.STORE_FILE_CONTENTS)) {
                    const contentStore = db.createObjectStore(this.STORE_FILE_CONTENTS, { keyPath: ['repoId', 'path'] });
                    contentStore.createIndex('repoId', 'repoId');
                }
                
                console.log('IndexedDB schema created/updated');
            };
        });
    },
    
    // Helper to ensure DB is initialized
    async ensureInitialized() {
        if (!this.db) {
            await this.initialize();
        }
    },
    
    // Helper method for transactions
    async transaction(storeNames, mode) {
        await this.ensureInitialized();
        const transaction = this.db.transaction(storeNames, mode);
        return {
            getStore: (storeName) => transaction.objectStore(storeName),
            complete: new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(event.target.error);
            })
        };
    },
    
    // ========== REPOSITORY METHODS ==========
    
    // Get all repositories
    async getRepositories() {
        const tx = await this.transaction([this.STORE_REPOSITORIES], 'readonly');
        const store = tx.getStore(this.STORE_REPOSITORIES);
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => reject(event.target.error);
        }).then(repos => repos.sort((a, b) => b.created - a.created));
    },
    
    // Get a single repository by ID or name
    async getRepository(idOrName) {
        const tx = await this.transaction([this.STORE_REPOSITORIES], 'readonly');
        const store = tx.getStore(this.STORE_REPOSITORIES);
        
        return new Promise((resolve, reject) => {
            // Try by ID first
            const request = store.get(idOrName);
            request.onsuccess = (event) => {
                if (event.target.result) {
                    resolve(event.target.result);
                } else {
                    // Try by name
                    const index = store.index('name');
                    const nameRequest = index.get(idOrName);
                    nameRequest.onsuccess = (e) => resolve(e.target.result || null);
                    nameRequest.onerror = (e) => reject(e.target.error);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Save/update a repository
    async saveRepository(repo) {
        if (!repo.id) {
            repo.id = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        if (!repo.created) {
            repo.created = Date.now();
        }
        repo.lastModified = Date.now();
        
        const tx = await this.transaction([this.STORE_REPOSITORIES], 'readwrite');
        const store = tx.getStore(this.STORE_REPOSITORIES);
        
        return new Promise((resolve, reject) => {
            const request = store.put(repo);
            request.onsuccess = (event) => {
                console.log('Repository saved:', repo.name);
                resolve(repo);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Delete a repository and all its files
    async deleteRepository(repoId) {
        const tx = await this.transaction([
            this.STORE_REPOSITORIES,
            this.STORE_FILES,
            this.STORE_FILE_CONTENTS
        ], 'readwrite');
        
        const repoStore = tx.getStore(this.STORE_REPOSITORIES);
        const fileStore = tx.getStore(this.STORE_FILES);
        const contentStore = tx.getStore(this.STORE_FILE_CONTENTS);
        
        // Delete repository
        repoStore.delete(repoId);
        
        // Delete all files metadata
        const fileIndex = fileStore.index('repoId');
        const fileRequest = fileIndex.openCursor(IDBKeyRange.only(repoId));
        
        fileRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        // Delete all file contents
        const contentIndex = contentStore.index('repoId');
        const contentRequest = contentIndex.openCursor(IDBKeyRange.only(repoId));
        
        contentRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        await tx.complete;
        console.log('Repository deleted:', repoId);
    },
    
    // ========== FILE METHODS ==========
    
    // Get file metadata
    async getFile(repoId, filePath) {
        const tx = await this.transaction([this.STORE_FILES], 'readonly');
        const store = tx.getStore(this.STORE_FILES);
        
        return new Promise((resolve, reject) => {
            const request = store.get([repoId, filePath]);
            request.onsuccess = (event) => resolve(event.target.result || null);
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Get file content
    async getFileContent(repoId, filePath) {
        const tx = await this.transaction([this.STORE_FILE_CONTENTS], 'readonly');
        const store = tx.getStore(this.STORE_FILE_CONTENTS);
        
        return new Promise((resolve, reject) => {
            const request = store.get([repoId, filePath]);
            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result && result.content) {
                    // Handle both Blob and string content
                    if (result.content instanceof Blob) {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = (e) => reject(e.target.error);
                        reader.readAsText(result.content);
                    } else {
                        resolve(result.content);
                    }
                } else {
                    resolve('');
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Save file with metadata and content
    async saveFile(repoId, filePath, fileData) {
        const now = Date.now();
        const fileMeta = {
            repoId,
            path: filePath,
            name: filePath.split('/').pop(),
            size: fileData.content ? fileData.content.length : 0,
            type: 'file',
            category: fileData.category || 'General',
            tags: fileData.tags || [],
            lastModified: now,
            created: fileData.created || now
        };
        
        const fileContent = {
            repoId,
            path: filePath,
            content: fileData.content || ''
        };
        
        const tx = await this.transaction([
            this.STORE_FILES,
            this.STORE_FILE_CONTENTS
        ], 'readwrite');
        
        const fileStore = tx.getStore(this.STORE_FILES);
        const contentStore = tx.getStore(this.STORE_FILE_CONTENTS);
        
        // Save metadata
        fileStore.put(fileMeta);
        
        // Save content
        contentStore.put(fileContent);
        
        await tx.complete;
        console.log('File saved:', filePath);
        
        return fileMeta;
    },
    
    // Delete a file
    async deleteFile(repoId, filePath) {
        const tx = await this.transaction([
            this.STORE_FILES,
            this.STORE_FILE_CONTENTS
        ], 'readwrite');
        
        const fileStore = tx.getStore(this.STORE_FILES);
        const contentStore = tx.getStore(this.STORE_FILE_CONTENTS);
        
        fileStore.delete([repoId, filePath]);
        contentStore.delete([repoId, filePath]);
        
        await tx.complete;
        console.log('File deleted:', filePath);
    },
    
    // List files in a repository (with optional path prefix)
    async listFiles(repoId, pathPrefix = '') {
        const tx = await this.transaction([this.STORE_FILES], 'readonly');
        const store = tx.getStore(this.STORE_FILES);
        
        return new Promise((resolve, reject) => {
            const results = [];
            const index = store.index('repoId');
            const request = index.openCursor(IDBKeyRange.only(repoId));
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const file = cursor.value;
                    
                    // Check if it matches the path prefix
                    if (!pathPrefix || file.path.startsWith(pathPrefix)) {
                        // Check if it's a direct child (not in subdirectory unless pathPrefix specifies it)
                        const relativePath = pathPrefix ? 
                            file.path.substring(pathPrefix.length) : file.path;
                        
                        if (!pathPrefix || 
                            (relativePath.indexOf('/') === -1) || 
                            (relativePath.startsWith('/') && relativePath.substring(1).indexOf('/') === -1)) {
                            
                            results.push({
                                ...file,
                                type: 'file'
                            });
                        }
                    }
                    cursor.continue();
                } else {
                    // Sort: folders first, then by name
                    results.sort((a, b) => {
                        if (a.type !== b.type) {
                            return a.type === 'folder' ? -1 : 1;
                        }
                        return a.name.localeCompare(b.name);
                    });
                    resolve(results);
                }
            };
            
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Search files by content or metadata
    async searchFiles(repoId, query) {
        const allFiles = await this.listFiles(repoId);
        const results = [];
        
        for (const file of allFiles) {
            let matches = false;
            
            // Search in file name
            if (file.name.toLowerCase().includes(query.toLowerCase())) {
                matches = true;
            }
            
            // Search in content if needed
            if (!matches && file.content) {
                const content = await this.getFileContent(repoId, file.path);
                if (content.toLowerCase().includes(query.toLowerCase())) {
                    matches = true;
                }
            }
            
            if (matches) {
                results.push(file);
            }
        }
        
        return results;
    },
    
    // Get repository statistics
    async getRepositoryStats(repoId) {
        const [files, repo] = await Promise.all([
            this.listFiles(repoId),
            this.getRepository(repoId)
        ]);
        
        let totalSize = 0;
        let fileCount = 0;
        let folderCount = 0;
        
        files.forEach(file => {
            if (file.type === 'file') {
                totalSize += file.size || 0;
                fileCount++;
            } else {
                folderCount++;
            }
        });
        
        return {
            repoName: repo ? repo.name : 'Unknown',
            fileCount,
            folderCount,
            totalSize,
            totalItems: fileCount + folderCount,
            lastModified: repo ? repo.lastModified : null
        };
    },
    
    // Export repository data for backup
    async exportRepository(repoId) {
        const [repo, files] = await Promise.all([
            this.getRepository(repoId),
            this.listFiles(repoId)
        ]);
        
        const exportData = {
            repository: repo,
            files: [],
            exportDate: new Date().toISOString(),
            version: 1
        };
        
        // Get content for each file
        for (const file of files) {
            if (file.type === 'file') {
                const content = await this.getFileContent(repoId, file.path);
                exportData.files.push({
                    metadata: file,
                    content: content
                });
            }
        }
        
        return exportData;
    },
    
    // Import repository from backup
    async importRepository(exportData) {
        const repo = exportData.repository;
        repo.id = `repo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        repo.created = Date.now();
        repo.lastModified = Date.now();
        
        // Save repository
        await this.saveRepository(repo);
        
        // Save files
        for (const fileData of exportData.files) {
            await this.saveFile(repo.id, fileData.metadata.path, {
                content: fileData.content,
                category: fileData.metadata.category,
                tags: fileData.metadata.tags,
                created: fileData.metadata.created
            });
        }
        
        return repo;
    },
    
    // Clear all data (use with caution!)
    async clearAllData() {
        const tx = await this.transaction([
            this.STORE_REPOSITORIES,
            this.STORE_FILES,
            this.STORE_FILE_CONTENTS
        ], 'readwrite');
        
        tx.getStore(this.STORE_REPOSITORIES).clear();
        tx.getStore(this.STORE_FILES).clear();
        tx.getStore(this.STORE_FILE_CONTENTS).clear();
        
        await tx.complete;
        console.log('All data cleared from IndexedDB');
    },
    
    // Check storage usage
    async getStorageUsage() {
        if (!navigator.storage || !navigator.storage.estimate) {
            return null;
        }
        
        try {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentage: estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0
            };
        } catch (error) {
            console.warn('Could not estimate storage:', error);
            return null;
        }
    },
    
    // Migration function to create default repository if none exists
    async ensureDefaultRepository() {
        const repos = await this.getRepositories();
        if (repos.length === 0) {
            const defaultRepo = {
                id: 'default_repo',
                name: 'My Files',
                description: 'Default repository for your files',
                visibility: 'private',
                created: Date.now(),
                lastModified: Date.now(),
                defaultBranch: 'main',
                branches: ['main']
            };
            
            await this.saveRepository(defaultRepo);
            console.log('Created default repository');
            return defaultRepo;
        }
        return repos[0];
    },
    
    // Refresh/Reinitialize
    async refresh() {
        await this.ensureInitialized();
        return this.getRepositories();
    }
};

// Auto-initialize on load
IndexedDBStorageManager.initialize().catch(console.error);

// For backward compatibility with your existing code
const LocalStorageManager = IndexedDBStorageManager;

/**
 * 
 *  C R E A T E D  B Y
 * 
 *  William Hanson 
 * 
 *  Chevrolay@Outlook.com
 * 
 *  m.me/Chevrolay
 * 
 */
