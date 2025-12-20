class StorageUI {
    constructor(options = {}) {
        this.manager = options.manager || repoManager;
        this.bridge = options.bridge || cmBridge;
        this.selectors = {
            repoList: options.repoList || '#repository-list',
            fileList: options.fileList || '#file-list',
            repoName: options.repoName || '#repo-name',
            repoDescription: options.repoDescription || '#repo-description',
            fileName: options.fileName || '#file-name',
            fileInfo: options.fileInfo || '#file-info',
            searchInput: options.searchInput || '#search-input',
            loadingOverlay: options.loadingOverlay || '#loading-overlay',
            notification: options.notification || '#notification',
            userInfo: options.userInfo || '#user-info',
            ... options.selectors
        };
        this.templates = options.templates || {};
        this.onAction = options.onAction || null;
        this.initialized = false;
        this.currentOwner = null;
        this. currentRepo = null;
    }

    init() {
        this.setupEventListeners();
        this.setupManagerListeners();
        this.initialized = true;
        return this;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target. closest('[data-action]');
            if (target) {
                this. handleAction(target.dataset.action, target.dataset, e);
            }
        });

        const searchInput = document.querySelector(this.selectors.searchInput);
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.handleAction('save-file');
            }
        });
    }

    setupManagerListeners() {
        this.manager.on('loading', (data) => {
            this.showLoading(data. type);
        });

        this.manager.on('userLoaded', (user) => {
            this.renderUserInfo(user);
        });

        this.manager.on('repositoriesLoaded', (repositories) => {
            this.hideLoading();
            this.renderRepositoryList(repositories);
        });

        this.manager.on('repositoryLoaded', (repo) => {
            this.hideLoading();
            this.currentOwner = repo.owner. login;
            this.currentRepo = repo.name;
            this.renderRepositoryDetail(repo);
            this.loadRepositoryContents(repo.owner.login, repo.name);
        });

        this.manager. on('repositoryCreated', (repo) => {
            this.hideLoading();
            this.notify('Repository created successfully', 'success');
            this.currentOwner = repo.owner.login;
            this.currentRepo = repo.name;
            this.renderRepositoryDetail(repo);
            this.loadRepositoryContents(repo.owner.login, repo. name);
        });

        this.manager.on('repositoryUpdated', (repo) => {
            this.hideLoading();
            this.notify('Repository updated', 'success');
            this.renderRepositoryDetail(repo);
        });

        this.manager.on('repositoryDeleted', () => {
            this.hideLoading();
            this.notify('Repository deleted', 'success');
            this.clearRepositoryDetail();
            this.currentOwner = null;
            this.currentRepo = null;
        });

        this.manager.on('repositoryContentsLoaded', (contents) => {
            this.renderFileList(contents);
        });

        this.manager.on('fileSelected', (file) => {
            this.hideLoading();
            this.highlightActiveFile(file. path);
            this.updateFileInfo(file);
        });

        this.manager.on('fileCreated', (file) => {
            this.hideLoading();
            this.notify('File created', 'success');
            this.appendFileToList(file);
            this.highlightActiveFile(file.path);
        });

        this.manager.on('fileSaved', (file) => {
            this.hideLoading();
            this.notify('File saved', 'success');
            this.updateFileInList(file);
            this.updateFileInfo(file);
        });

        this.manager.on('fileDeleted', (data) => {
            this.hideLoading();
            this.notify('File deleted', 'success');
            this.removeFileFromList(data.path);
        });

        this.manager.on('fileChanged', (data) => {
            this.markFileUnsaved(data.path, data.hasUnsavedChanges);
        });

        this.manager. on('error', (data) => {
            this.hideLoading();
            const errorMessage = data.error. message || 'An error occurred';
            this.notify(errorMessage, 'error');
        });

        this.manager.on('searchCompleted', (data) => {
            this.hideLoading();
            this.renderRepositoryList(data.items);
        });
    }

    async handleAction(action, data = {}, event = null) {
        if (this.onAction) {
            const handled = await this.onAction(action, data, event);
            if (handled === false) return;
        }

        switch (action) {
            case 'load-user':
                await this.manager.loadUser();
                break;

            case 'load-repos':
                await this.manager. loadRepositories();
                break;

            case 'load-repo':
                if (data.owner && data.repo) {
                    await this.manager.loadRepository(data.owner, data.repo);
                }
                break;

            case 'create-repo':
                await this. showCreateRepoDialog();
                break;

            case 'edit-repo':
                await this. showEditRepoDialog();
                break;

            case 'delete-repo':
                await this.confirmDeleteRepo();
                break;

            case 'star-repo': 
                if (this.currentOwner && this.currentRepo) {
                    await this.manager.starRepository(this. currentOwner, this.currentRepo);
                }
                break;

            case 'unstar-repo':
                if (this. currentOwner && this.currentRepo) {
                    await this. manager.unstarRepository(this. currentOwner, this.currentRepo);
                }
                break;

            case 'fork-repo':
                if (this.currentOwner && this.currentRepo) {
                    await this.manager.forkRepository(this.currentOwner, this.currentRepo);
                }
                break;

            case 'select-file':
                if (data.path && this.currentOwner && this.currentRepo) {
                    await this.manager. selectFile(this.currentOwner, this.currentRepo, data. path);
                }
                break;

            case 'create-file':
                await this.showCreateFileDialog();
                break;

            case 'rename-file':
                if (data.path && this.currentOwner && this.currentRepo) {
                    await this.showRenameFileDialog(data. path);
                }
                break;

            case 'delete-file':
                if (data. path && this.currentOwner && this.currentRepo) {
                    await this.confirmDeleteFile(data.path);
                }
                break;

            case 'save-file': 
                if (this.currentOwner && this.currentRepo) {
                    await this.bridge.saveCurrentFile(this.currentOwner, this.currentRepo);
                }
                break;

            case 'save-all':
                if (this.currentOwner && this.currentRepo) {
                    await this.manager.saveAllPendingChanges(this.currentOwner, this.currentRepo);
                }
                break;

            default:
                console.warn('Unknown action:', action);
        }
    }

    async handleSearch(query) {
        if (!query || query.length < 2) {
            return;
        }
        await this.manager.searchRepositories(query);
    }

    renderUserInfo(user) {
        const container = document.querySelector(this.selectors.userInfo);
        if (!container) return;

        container.innerHTML = `
            <div class="user-info">
                <img src="${user.avatar_url}" alt="${user.login}" class="user-avatar">
                <div class="user-details">
                    <p class="user-name">${this.escapeHtml(user.name || user.login)}</p>
                    <p class="user-login">@${this.escapeHtml(user. login)}</p>
                </div>
            </div>
        `;
    }

    renderRepositoryList(repositories) {
        const container = document.querySelector(this.selectors.repoList);
        if (!container) return;

        if (! repositories || repositories.length === 0) {
            container.innerHTML = this.templates.emptyRepos || `
                <div class="empty-state">
                    <p>No repositories found</p>
                    <button data-action="create-repo" class="btn btn-primary">
                        Create your first repository
                    </button>
                </div>
            `;
            return;
        }

        const html = repositories.map(repo => this.renderRepoCard(repo)).join('');
        container.innerHTML = html;
    }

    renderRepoCard(repo) {
        if (this.templates.repoCard) {
            return this.templates.repoCard(repo);
        }

        const language = repo.language || 'Unknown';
        const updatedAt = this.formatDate(repo.updated_at);
        const owner = repo.owner.login;

        return `
            <div class="repo-card" data-action="load-repo" data-owner="${owner}" data-repo="${repo.name}">
                <div class="repo-card-header">
                    <h3 class="repo-name">${this.escapeHtml(repo.name)}</h3>
                    <span class="repo-visibility">${repo.private ? 'Private' :  'Public'}</span>
                </div>
                ${repo.description ? `<p class="repo-description">${this. escapeHtml(repo.description)}</p>` : ''}
                <div class="repo-card-footer">
                    <span class="repo-language">${language}</span>
                    <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                    <span class="repo-updated">${updatedAt}</span>
                </div>
            </div>
        `;
    }

    renderRepositoryDetail(repo) {
        const nameEl = document.querySelector(this.selectors.repoName);
        const descEl = document.querySelector(this.selectors.repoDescription);

        if (nameEl) nameEl.textContent = repo.name;
        if (descEl) descEl.textContent = repo.description || 'No description';
    }

    clearRepositoryDetail() {
        const nameEl = document.querySelector(this. selectors.repoName);
        const descEl = document.querySelector(this.selectors.repoDescription);

        if (nameEl) nameEl.textContent = '';
        if (descEl) descEl.textContent = '';

        this.clearFileList();
        this.bridge.clear();
    }

    renderFileList(files) {
        const container = document.querySelector(this. selectors.fileList);
        if (!container) return;

        if (!files || files.length === 0) {
            container. innerHTML = this.templates.emptyFiles || `
                <div class="empty-state">
                    <p>No files in this repository</p>
                    <button data-action="create-file" class="btn btn-sm">
                        Add a file
                    </button>
                </div>
            `;
            return;
        }

        const fileItems = files.filter(item => item.type === 'file');
        
        if (fileItems.length === 0) {
            container. innerHTML = this.templates.emptyFiles || `
                <div class="empty-state">
                    <p>No files in this repository</p>
                    <button data-action="create-file" class="btn btn-sm">
                        Add a file
                    </button>
                </div>
            `;
            return;
        }

        const html = fileItems.map(file => this.renderFileItem(file)).join('');
        container.innerHTML = html;
    }

    renderFileItem(file) {
        if (this.templates.fileItem) {
            return this.templates. fileItem(file);
        }

        const size = this.formatBytes(file.size);
        const ext = file.name.split('.').pop();
        const icon = this.getFileIcon(ext);

        return `
            <div class="file-item" data-path="${this.escapeHtml(file. path)}" data-action="select-file">
                <span class="file-icon">${icon}</span>
                <span class="file-name">${this.escapeHtml(file.name)}</span>
                <span class="file-size">${size}</span>
                <div class="file-actions">
                    <button data-action="rename-file" data-path="${this.escapeHtml(file.path)}" class="btn-icon" title="Rename">
                        ✏️
                    </button>
                    <button data-action="delete-file" data-path="${this.escapeHtml(file.path)}" class="btn-icon" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    appendFileToList(file) {
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        const emptyState = container.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        container.insertAdjacentHTML('beforeend', this.renderFileItem(file));
    }

    updateFileInList(file) {
        const container = document.querySelector(this. selectors.fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-path="${this.escapeHtml(file.path)}"]`);
        if (fileEl) {
            fileEl.outerHTML = this.renderFileItem(file);
        }
    }

    removeFileFromList(path) {
        const container = document.querySelector(this.selectors. fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-path="${this.escapeHtml(path)}"]`);
        if (fileEl) {
            fileEl.remove();
        }

        if (container.children.length === 0) {
            container.innerHTML = this.templates.emptyFiles || `
                <div class="empty-state">
                    <p>No files in this repository</p>
                    <button data-action="create-file" class="btn btn-sm">
                        Add a file
                    </button>
                </div>
            `;
        }
    }

    clearFileList() {
        const container = document.querySelector(this.selectors.fileList);
        if (container) {
            container.innerHTML = '';
        }
    }

    highlightActiveFile(path) {
        const container = document.querySelector(this.selectors. fileList);
        if (!container) return;

        container.querySelectorAll('. file-item').forEach(el => {
            el.classList. remove('active');
        });

        const activeEl = container.querySelector(`[data-path="${this.escapeHtml(path)}"]`);
        if (activeEl) {
            activeEl.classList.add('active');
        }
    }

    markFileUnsaved(path, unsaved) {
        const container = document.querySelector(this.selectors. fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-path="${this.escapeHtml(path)}"]`);
        if (fileEl) {
            fileEl.classList.toggle('unsaved', unsaved);
        }
    }

    updateFileInfo(file) {
        const infoEl = document.querySelector(this.selectors.fileInfo);
        if (! infoEl) return;

        const size = this.formatBytes(file. size);
        const ext = file.path.split('.').pop();

        infoEl.innerHTML = `
            <span class="info-type">${ext}</span>
            <span class="info-size">${size}</span>
            <span class="info-path">${this.escapeHtml(file.path)}</span>
        `;
    }

    async loadRepositoryContents(owner, repo) {
        try {
            await this.manager.loadRepositoryContents(owner, repo);
        } catch (error) {
            console.error('Failed to load repository contents:', error);
        }
    }

    async showCreateRepoDialog() {
        const name = prompt('Repository name:');
        if (!name) return;

        const description = prompt('Description (optional):') || '';
        const isPrivate = confirm('Make this repository private?');

        await this.manager.createRepository({
            name,
            description,
            private: isPrivate
        });
    }

    async showEditRepoDialog() {
        const repo = this.manager.getCurrentRepo();
        if (!repo) {
            this.notify('No repository selected', 'error');
            return;
        }

        const name = prompt('Repository name:', repo.name);
        if (!name) return;

        const description = prompt('Description:', repo.description) || '';

        await this.manager.updateRepository(repo.owner. login, repo.name, { name, description });
    }

    async confirmDeleteRepo() {
        const repo = this. manager.getCurrentRepo();
        if (!repo) {
            this. notify('No repository selected', 'error');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete "${repo.name}"?  This cannot be undone.`);
        if (confirmed) {
            await this. manager.deleteRepository(repo.owner.login, repo.name);
        }
    }

    async showCreateFileDialog() {
        if (! this.currentOwner || !this.currentRepo) {
            this.notify('No repository selected', 'error');
            return;
        }

        const filename = prompt('File name (with extension):');
        if (!filename) return;

        await this.manager.createFile(this.currentOwner, this.currentRepo, filename, {
            content: ''
        });
    }

    async showRenameFileDialog(oldPath) {
        if (!this.currentOwner || !this.currentRepo) {
            this.notify('No repository selected', 'error');
            return;
        }

        const oldName = oldPath.split('/').pop();
        const newName = prompt('New file name:', oldName);
        if (!newName || newName === oldName) return;

        const newPath = oldPath.replace(/[^/]*$/, newName);

        try {
            const file = await this.manager.selectFile(this.currentOwner, this.currentRepo, oldPath);
            await this.manager.createFile(this.currentOwner, this.currentRepo, newPath, {
                content: file.content,
                message: `Rename ${oldPath} to ${newPath}`
            });
            await this.manager.deleteFile(this.currentOwner, this.currentRepo, oldPath);
            this.notify('File renamed successfully', 'success');
            this.loadRepositoryContents(this.currentOwner, this.currentRepo);
        } catch (error) {
            this.notify('Failed to rename file: ' + error.message, 'error');
        }
    }

    async confirmDeleteFile(path) {
        const filename = path.split('/').pop();
        const confirmed = confirm(`Are you sure you want to delete "${filename}"?`);
        if (confirmed && this.currentOwner && this.currentRepo) {
            await this.manager. deleteFile(this.currentOwner, this.currentRepo, path);
        }
    }

    showLoading(type = '') {
        const overlay = document.querySelector(this.selectors.loadingOverlay);
        if (overlay) {
            overlay.classList.add('visible');
            overlay.dataset.loadingType = type;
        }
    }

    hideLoading() {
        const overlay = document. querySelector(this.selectors.loadingOverlay);
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }

    notify(message, type = 'info', duration = 3000) {
        const container = document.querySelector(this.selectors.notification);
        
        if (container) {
            container.textContent = message;
            container.className = `notification ${type} visible`;
            
            setTimeout(() => {
                container.classList.remove('visible');
            }, duration);
        } else {
            console.log(`[${type. toUpperCase()}] ${message}`);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        return date.toLocaleDateString();
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math. log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getFileIcon(extension) {
        const icons = {
            'js': '📜',
            'ts': '📘',
            'tsx': '📘',
            'jsx': '📜',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'json': '📋',
            'md': '📝',
            'py': '🐍',
            'php': '🐘',
            'rb': '💎',
            'java': '☕',
            'go': '🔵',
            'rs': '⚙️',
            'sh': '💻',
            'sql': '🗃️',
            'yml': '⚙️',
            'yaml': '⚙️',
            'txt': '📄'
        };

        return icons[extension] || '📄';
    }
}

const storageUI = new StorageUI();

if (typeof module !== 'undefined' && module. exports) {
    module.exports = { StorageUI, storageUI };
}
