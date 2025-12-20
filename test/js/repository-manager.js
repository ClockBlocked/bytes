class RepositoryManager {
    constructor(api) {
        this.api = api || storageAPI;
        this.currentRepo = null;
        this.currentFile = null;
        this.listeners = new Map();
        this.pendingChanges = new Map();
        this.autoSaveInterval = null;
        this.autoSaveDelay = 5000;
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    }

    async loadRepositories(options = {}) {
        this.emit('loading', { type: 'repositories' });
        
        try {
            const result = await this.api.listRepositories(options);
            this.emit('repositoriesLoaded', result);
            return result;
        } catch (error) {
            this.emit('error', { type: 'loadRepositories', error });
            throw error;
        }
    }

    async loadRepository(repoId, options = {}) {
        this.emit('loading', { type: 'repository', repoId });
        
        try {
            const result = await this.api.getRepository(repoId, {
                includeContent: options.includeContent !== false,
                useCache: options.useCache
            });
            
            this.currentRepo = result.data.repository;
            this.emit('repositoryLoaded', this.currentRepo);
            
            if (options.recordView !== false) {
                this.api.recordView(repoId).catch(() => {});
            }
            
            return this.currentRepo;
        } catch (error) {
            this.emit('error', { type: 'loadRepository', error, repoId });
            throw error;
        }
    }

    async createRepository(data) {
        this.emit('saving', { type: 'createRepository' });
        
        try {
            const result = await this.api.createRepository(data);
            this.currentRepo = result.data.repository;
            this.emit('repositoryCreated', this.currentRepo);
            return this.currentRepo;
        } catch (error) {
            this.emit('error', { type: 'createRepository', error });
            throw error;
        }
    }

    async updateRepository(repoId, data) {
        this.emit('saving', { type: 'updateRepository', repoId });
        
        try {
            const result = await this.api.updateRepository(repoId, data);
            
            if (this.currentRepo && this.currentRepo.id === repoId) {
                Object.assign(this.currentRepo, result.data.repository);
            }
            
            this.emit('repositoryUpdated', result.data.repository);
            return result.data.repository;
        } catch (error) {
            this.emit('error', { type: 'updateRepository', error, repoId });
            throw error;
        }
    }

    async deleteRepository(repoId) {
        this.emit('saving', { type: 'deleteRepository', repoId });
        
        try {
            await this.api.deleteRepository(repoId);
            
            if (this.currentRepo && this.currentRepo.id === repoId) {
                this.currentRepo = null;
                this.currentFile = null;
            }
            
            this.emit('repositoryDeleted', { id: repoId });
            return true;
        } catch (error) {
            this.emit('error', { type: 'deleteRepository', error, repoId });
            throw error;
        }
    }

    async duplicateRepository(repoId, newName = null) {
        this.emit('saving', { type: 'duplicateRepository', repoId });
        
        try {
            const result = await this.api.duplicateRepository(repoId, newName);
            this.emit('repositoryDuplicated', result.data.repository);
            return result.data.repository;
        } catch (error) {
            this.emit('error', { type: 'duplicateRepository', error, repoId });
            throw error;
        }
    }

    async selectFile(fileId) {
        if (!this.currentRepo) {
            throw new Error('No repository loaded');
        }

        const file = this.currentRepo.files.find(f => f.id === fileId);
        
        if (!file) {
            throw new Error('File not found');
        }

        if (!file.content && file.content !== '') {
            this.emit('loading', { type: 'fileContent', fileId });
            
            try {
                const result = await this.api.getFileContent(this.currentRepo.id, fileId);
                file.content = result.data.content;
            } catch (error) {
                this.emit('error', { type: 'loadFileContent', error, fileId });
                throw error;
            }
        }

        this.currentFile = file;
        this.emit('fileSelected', file);
        return file;
    }

    async createFile(data) {
        if (!this.currentRepo) {
            throw new Error('No repository loaded');
        }

        this.emit('saving', { type: 'createFile' });
        
        try {
            const result = await this.api.createFile(this.currentRepo.id, data);
            const newFile = result.data.file;
            newFile.content = data.content || '';
            
            this.currentRepo.files.push(newFile);
            this.currentFile = newFile;
            
            this.emit('fileCreated', newFile);
            return newFile;
        } catch (error) {
            this.emit('error', { type: 'createFile', error });
            throw error;
        }
    }

    async updateFile(fileId, data) {
        if (!this.currentRepo) {
            throw new Error('No repository loaded');
        }

        this.emit('saving', { type: 'updateFile', fileId });
        
        try {
            const result = await this.api.updateFile(this.currentRepo.id, fileId, data);
            const updatedFile = result.data.file;
            
            const index = this.currentRepo.files.findIndex(f => f.id === fileId);
            if (index > -1) {
                if (data.content !== undefined) {
                    updatedFile.content = data.content;
                } else {
                    updatedFile.content = this.currentRepo.files[index].content;
                }
                this.currentRepo.files[index] = updatedFile;
            }
            
            if (this.currentFile && this.currentFile.id === fileId) {
                this.currentFile = updatedFile;
            }
            
            this.pendingChanges.delete(fileId);
            this.emit('fileSaved', updatedFile);
            return updatedFile;
        } catch (error) {
            this.emit('error', { type: 'updateFile', error, fileId });
            throw error;
        }
    }

    async deleteFile(fileId) {
        if (!this.currentRepo) {
            throw new Error('No repository loaded');
        }

        this.emit('saving', { type: 'deleteFile', fileId });
        
        try {
            await this.api.deleteFile(this.currentRepo.id, fileId);
            
            const index = this.currentRepo.files.findIndex(f => f.id === fileId);
            if (index > -1) {
                this.currentRepo.files.splice(index, 1);
            }
            
            if (this.currentFile && this.currentFile.id === fileId) {
                this.currentFile = this.currentRepo.files[0] || null;
            }
            
            this.pendingChanges.delete(fileId);
            this.emit('fileDeleted', { id: fileId });
            return true;
        } catch (error) {
            this.emit('error', { type: 'deleteFile', error, fileId });
            throw error;
        }
    }

    markFileChanged(fileId, content) {
        this.pendingChanges.set(fileId, {
            content,
            timestamp: Date.now()
        });
        
        this.emit('fileChanged', { fileId, hasUnsavedChanges: true });
    }

    hasUnsavedChanges(fileId = null) {
        if (fileId) {
            return this.pendingChanges.has(fileId);
        }
        return this.pendingChanges.size > 0;
    }

    async saveAllPendingChanges() {
        const promises = [];
        
        for (const [fileId, change] of this.pendingChanges) {
            promises.push(this.updateFile(fileId, { content: change.content }));
        }
        
        return Promise.all(promises);
    }

    startAutoSave(delay = null) {
        if (delay !== null) {
            this.autoSaveDelay = delay;
        }
        
        this.stopAutoSave();
        
        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges()) {
                this.saveAllPendingChanges().catch(error => {
                    console.error('Auto-save failed:', error);
                });
            }
        }, this.autoSaveDelay);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    async search(query, options = {}) {
        this.emit('loading', { type: 'search', query });
        
        try {
            const result = await this.api.search(query, options);
            this.emit('searchCompleted', result);
            return result;
        } catch (error) {
            this.emit('error', { type: 'search', error });
            throw error;
        }
    }

    async getStats() {
        try {
            const result = await this.api.getStats();
            return result.data;
        } catch (error) {
            this.emit('error', { type: 'getStats', error });
            throw error;
        }
    }

    async exportRepository(repoId = null, format = 'json') {
        const id = repoId || (this.currentRepo ? this.currentRepo.id : null);
        
        if (!id) {
            throw new Error('No repository specified');
        }

        this.emit('exporting', { repoId: id, format });
        
        try {
            if (format === 'download') {
                this.api.downloadExport(id, 'zip');
                this.emit('exported', { repoId: id, format: 'zip' });
                return null;
            }
            
            const result = await this.api.exportRepository(id, format);
            this.emit('exported', { repoId: id, format, data: result });
            return result;
        } catch (error) {
            this.emit('error', { type: 'export', error, repoId: id });
            throw error;
        }
    }

    async importRepository(data, ownerId = null) {
        this.emit('importing', { name: data.name });
        
        try {
            const result = await this.api.importRepository(data, ownerId);
            this.emit('imported', result.data.repository);
            return result.data.repository;
        } catch (error) {
            this.emit('error', { type: 'import', error });
            throw error;
        }
    }

    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const repo = await this.importRepository(data);
                    resolve(repo);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    getCurrentRepo() {
        return this.currentRepo;
    }

    getCurrentFile() {
        return this.currentFile;
    }

    getFileById(fileId) {
        if (!this.currentRepo) return null;
        return this.currentRepo.files.find(f => f.id === fileId) || null;
    }

    getFileByName(filename) {
        if (!this.currentRepo) return null;
        return this.currentRepo.files.find(
            f => f.filename.toLowerCase() === filename.toLowerCase()
        ) || null;
    }

    reset() {
        this.stopAutoSave();
        this.currentRepo = null;
        this.currentFile = null;
        this.pendingChanges.clear();
        this.emit('reset');
    }
}

const repoManager = new RepositoryManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RepositoryManager, repoManager };
}
