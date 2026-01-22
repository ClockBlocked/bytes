const IndexedDBStorageManager = {
    DB_NAME: 'code-editor-storage',
    DB_VERSION: 1,
    STORE_REPOSITORIES: 'repositories',
    STORE_FILES: 'files',
    STORE_FILE_CONTENTS: 'file_contents',
    
    db: null,
    
// Initialize
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
            
            request.onupgradeneeded = (event) => { // Create
                const db = event.target.result;
                
                // repositories
                if (!db.objectStoreNames.contains(this.STORE_REPOSITORIES)) {
                    const repoStore = db.createObjectStore(this.STORE_REPOSITORIES, { keyPath: 'id' });
                    repoStore.createIndex('name', 'name', { unique: true });
                    repoStore.createIndex('created', 'created');
                }
                
                // files metadata
                if (!db.objectStoreNames.contains(this.STORE_FILES)) {
                    const fileStore = db.createObjectStore(this.STORE_FILES, { keyPath: ['repoId', 'path'] });
                    fileStore.createIndex('repoId', 'repoId');
                    fileStore.createIndex('path', 'path');
                    fileStore.createIndex('lastModified', 'lastModified');
                    fileStore.createIndex('category', 'category');
                }
                
                // file contents
                if (!db.objectStoreNames.contains(this.STORE_FILE_CONTENTS)) {
                    const contentStore = db.createObjectStore(this.STORE_FILE_CONTENTS, { keyPath: ['repoId', 'path'] });
                    contentStore.createIndex('repoId', 'repoId');
                }
                
                console.log('IndexedDB schema created/updated');
            };
        });
    },


  

/////////////////////  H E L P E R S ///////////
////////////////////////////////////////////////
    async ensureInitialized() { // Initialize
        if (!this.db) {
            await this.initialize();
        }
    },

    async transaction(storeNames, mode) { // Actions
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
    
    // Creates default repository if needed
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
    
    // Refresh / Reinitialize
    async refresh() {
        await this.ensureInitialized();
        return this.getRepositories();
    },



//////////////  R E P O S I T O R I E S  ///////
////////////////////////////////////////////////
    async getRepositories() { // Get all repositories
        const tx = await this.transaction([this.STORE_REPOSITORIES], 'readonly');
        const store = tx.getStore(this.STORE_REPOSITORIES);
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => reject(event.target.error);
        }).then(repos => repos.sort((a, b) => b.created - a.created));
    },
    
    async getRepository(idOrName) { // get repository
        const tx = await this.transaction([this.STORE_REPOSITORIES], 'readonly');
        const store = tx.getStore(this.STORE_REPOSITORIES);
        
        return new Promise((resolve, reject) => {
            // by ID ( primary )
            const request = store.get(idOrName);
            request.onsuccess = (event) => {
                if (event.target.result) {
                    resolve(event.target.result);
                } else {
                    // by Name ( secondary )
                    const index = store.index('name');
                    const nameRequest = index.get(idOrName);
                    nameRequest.onsuccess = (e) => resolve(e.target.result || null);
                    nameRequest.onerror = (e) => reject(e.target.error);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Save / Update
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
    
    // Delete ( & it's files )
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





    // Deletes all data
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



////////////////////////  F I L E S ////////////
////////////////////////////////////////////////
    // Get ( & it's metadata )
    async getFile(repoId, filePath) {
        const tx = await this.transaction([this.STORE_FILES], 'readonly');
        const store = tx.getStore(this.STORE_FILES);
        
        return new Promise((resolve, reject) => {
            const request = store.get([repoId, filePath]);
            request.onsuccess = (event) => resolve(event.target.result || null);
            request.onerror = (event) => reject(event.target.error);
        });
    },
    
    // Get ( a file's ) content
    async getFileContent(repoId, filePath) {
        const tx = await this.transaction([this.STORE_FILE_CONTENTS], 'readonly');
        const store = tx.getStore(this.STORE_FILE_CONTENTS);
        
        return new Promise((resolve, reject) => {
            const request = store.get([repoId, filePath]);
            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result && result.content) {
                    // Handles blob & string
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
    
    // Save ( metadata & content )
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
    
    // Delete
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
    
    // List in a repository ( path prefix )
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
                    
                    // Matches path prefix?
                    if (!pathPrefix || file.path.startsWith(pathPrefix)) {
                        // Check if it's a direct child
                        // not in subdirectory - unless pathPrefix specifies it
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
                    // Sort ( by Name ) - folders first
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
    
    // Search:  content or metadata
    async searchFiles(repoId, query) {
        const allFiles = await this.listFiles(repoId);
        const results = [];
        
        for (const file of allFiles) {
            let matches = false;
            
            // File name / Metadata
            if (file.name.toLowerCase().includes(query.toLowerCase())) {
                matches = true;
            }
            
            // Content
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
    }
};




IndexedDBStorageManager.initialize().catch(console.error);

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