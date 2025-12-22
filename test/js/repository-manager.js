class RepositoryManager {
    constructor(api) {
        this.api = api || githubAPI;
        this.currentRepo = null;
        this.currentFile = null;
        this.listeners = new Map();
        this.pendingChanges = new Map();
        this.autoSaveInterval = null;
        this.autoSaveDelay = 5000;
    }

    on(event, callback) {
        if (!this. listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners. get(event).push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (! this.listeners.has(event)) return;
        const callbacks = this.listeners. get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (! this.listeners.has(event)) return;
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
            const result = await this.api.listRepositories({
                type: options.type || 'owner',
                sort: options. sort || 'updated',
                direction:  options.direction || 'desc',
                per_page: options.per_page || 30,
                page:  options.page || 1,
                useCache: options.useCache
            });

            this.emit('repositoriesLoaded', result);
            return result;
        } catch (error) {
            this.emit('error', { type: 'loadRepositories', error });
            throw error;
        }
    }

    async loadRepository(owner, repo, options = {}) {
        this. emit('loading', { type: 'repository', owner, repo });

        try {
            const result = await this. api.getRepository(owner, repo, {
                useCache:  options.useCache
            });

            this.currentRepo = result;
            this.emit('repositoryLoaded', this.currentRepo);

            return this.currentRepo;
        } catch (error) {
            this.emit('error', { type: 'loadRepository', error, owner, repo });
            throw error;
        }
    }

async createRepository(data) {
    this.emit('saving', { type: 'createRepository' });

    try {
        const result = await this.api.createRepository({
            name: data.name,
            description: data.description || '',
            private: data.private || false
        });

        this.currentRepo = result;
        this.emit('repositoryCreated', this.currentRepo);
        return this.currentRepo;
    } catch (error) {
        console.error('Create repository failed:', {
            message: error.message,
            status: error.status,
            errors: error.errors
        });
        this.emit('error', { type: 'createRepository', error });
        throw error;
    }
}

    async updateRepository(owner, repo, data) {
        this.emit('saving', { type: 'updateRepository', owner, repo });

        try {
            const result = await this.api.updateRepository(owner, repo, {
                name: data.name,
                description: data.description,
                private: data.private
            });

            if (this.currentRepo && this.currentRepo. name === repo && this.currentRepo. owner.login === owner) {
                Object.assign(this. currentRepo, result);
            }

            this.emit('repositoryUpdated', result);
            return result;
        } catch (error) {
            this.emit('error', { type:  'updateRepository', error, owner, repo });
            throw error;
        }
    }

    async deleteRepository(owner, repo) {
        this.emit('saving', { type: 'deleteRepository', owner, repo });

        try {
            await this.api.deleteRepository(owner, repo);

            if (this.currentRepo && this.currentRepo.name === repo && this.currentRepo. owner.login === owner) {
                this.currentRepo = null;
                this.currentFile = null;
            }

            this. emit('repositoryDeleted', { owner, repo });
            return true;
        } catch (error) {
            this.emit('error', { type: 'deleteRepository', error, owner, repo });
            throw error;
        }
    }

    async loadRepositoryContents(owner, repo, path = '') {
        this.emit('loading', { type: 'repositoryContents', owner, repo, path });

        try {
            const result = await this.api.listRepositoryContents(owner, repo, path);
            this.emit('repositoryContentsLoaded', result);
            return result;
        } catch (error) {
            this.emit('error', { type: 'loadRepositoryContents', error, owner, repo, path });
            throw error;
        }
    }

    async selectFile(owner, repo, path) {
        this.emit('loading', { type:  'fileContent', owner, repo, path });

        try {
            const result = await this.api.getFileContent(owner, repo, path);

            let content = '';
            if (result.content) {
                content = atob(result.content);
            }

            this.currentFile = {
                path: result.path,
                name: result.name,
                size: result.size,
                content: content,
                sha: result.sha,
                url: result.html_url
            };

            this.emit('fileSelected', this.currentFile);
            return this.currentFile;
        } catch (error) {
            this.emit('error', { type: 'loadFileContent', error, owner, repo, path });
            throw error;
        }
    }

    async createFile(owner, repo, path, data) {
        this. emit('saving', { type: 'createFile', owner, repo, path });

        try {
            const result = await this.api.createFile(owner, repo, path, {
                content: data.content || '',
                message: data.message || `Create ${path}`
            });

            const fileData = result. content;
            const newFile = {
                path: fileData.path,
                name: fileData.name,
                size: fileData. size,
                content: data.content || '',
                sha: fileData.sha,
                url: fileData.html_url
            };

            this.currentFile = newFile;
            this.emit('fileCreated', newFile);
            return newFile;
        } catch (error) {
            this.emit('error', { type: 'createFile', error, owner, repo, path });
            throw error;
        }
    }

    async updateFile(owner, repo, path, data) {
        this.emit('saving', { type: 'updateFile', owner, repo, path });

        try {
            const result = await this.api.updateFile(owner, repo, path, {
                content:  data.content || '',
                message: data.message || `Update ${path}`
            });

            const fileData = result.content;
            const updatedFile = {
                path: fileData.path,
                name: fileData. name,
                size: fileData.size,
                content:  data.content || '',
                sha: fileData.sha,
                url: fileData.html_url
            };

            if (this.currentFile && this.currentFile.path === path) {
                this.currentFile = updatedFile;
            }

            this. pendingChanges.delete(path);
            this.emit('fileSaved', updatedFile);
            return updatedFile;
        } catch (error) {
            this.emit('error', { type: 'updateFile', error, owner, repo, path });
            throw error;
        }
    }

    async deleteFile(owner, repo, path) {
        this.emit('saving', { type: 'deleteFile', owner, repo, path });

        try {
            await this.api.deleteFile(owner, repo, path, {
                message:  `Delete ${path}`
            });

            if (this.currentFile && this.currentFile.path === path) {
                this. currentFile = null;
            }

            this. pendingChanges. delete(path);
            this.emit('fileDeleted', { owner, repo, path });
            return true;
        } catch (error) {
            this.emit('error', { type:  'deleteFile', error, owner, repo, path });
            throw error;
        }
    }

    markFileChanged(path, content) {
        this.pendingChanges.set(path, {
            content,
            timestamp: Date.now()
        });

        this.emit('fileChanged', { path, hasUnsavedChanges:  true });
    }

    hasUnsavedChanges(path = null) {
        if (path) {
            return this.pendingChanges.has(path);
        }
        return this.pendingChanges.size > 0;
    }

    async saveAllPendingChanges(owner, repo) {
        const promises = [];

        for (const [path, change] of this.pendingChanges) {
            promises.push(this. updateFile(owner, repo, path, { content: change.content }));
        }

        return Promise.all(promises);
    }

    startAutoSave(owner, repo, delay = null) {
        if (delay !== null) {
            this.autoSaveDelay = delay;
        }

        this.stopAutoSave();

        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges()) {
                this.saveAllPendingChanges(owner, repo).catch(error => {
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

    async searchRepositories(query, options = {}) {
        this.emit('loading', { type: 'search', query });

        try {
            const result = await this.api.searchRepositories(query, {
                sort: options.sort || 'stars',
                order: options.order || 'desc',
                per_page:  options.per_page || 30,
                page: options. page || 1
            });

            this.emit('searchCompleted', result);
            return result;
        } catch (error) {
            this.emit('error', { type: 'search', error });
            throw error;
        }
    }

    async getRateLimitStatus() {
        try {
            const result = await this.api.getRateLimitStatus();
            return result;
        } catch (error) {
            this.emit('error', { type: 'getRateLimit', error });
            throw error;
        }
    }

    async starRepository(owner, repo) {
        this.emit('saving', { type: 'starRepository', owner, repo });

        try {
            await this.api.starRepository(owner, repo);
            this.emit('repositoryStarred', { owner, repo });
            return true;
        } catch (error) {
            this.emit('error', { type: 'starRepository', error, owner, repo });
            throw error;
        }
    }

    async unstarRepository(owner, repo) {
        this.emit('saving', { type: 'unstarRepository', owner, repo });

        try {
            await this.api. unstarRepository(owner, repo);
            this.emit('repositoryUnstarred', { owner, repo });
            return true;
        } catch (error) {
            this.emit('error', { type: 'unstarRepository', error, owner, repo });
            throw error;
        }
    }

    async forkRepository(owner, repo, options = {}) {
        this.emit('saving', { type:  'forkRepository', owner, repo });

        try {
            const result = await this.api.forkRepository(owner, repo, options);
            this.emit('repositoryForked', result);
            return result;
        } catch (error) {
            this.emit('error', { type:  'forkRepository', error, owner, repo });
            throw error;
        }
    }

    getCurrentRepo() {
        return this.currentRepo;
    }

    getCurrentFile() {
        return this.currentFile;
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
