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
            ...options.selectors
        };
        this.templates = options.templates || {};
        this.onAction = options.onAction || null;
        this.initialized = false;
    }

    init() {
        this.setupEventListeners();
        this.setupManagerListeners();
        this.initialized = true;
        return this;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (target) {
                this.handleAction(target.dataset.action, target.dataset, e);
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
            this.showLoading(data.type);
        });

        this.manager.on('repositoriesLoaded', (data) => {
            this.hideLoading();
            this.renderRepositoryList(data.data.repositories);
        });

        this.manager.on('repositoryLoaded', (repo) => {
            this.hideLoading();
            this.renderRepositoryDetail(repo);
            this.renderFileList(repo.files);
        });

        this.manager.on('repositoryCreated', (repo) => {
            this.hideLoading();
            this.notify('Repository created successfully', 'success');
            this.renderRepositoryDetail(repo);
            this.renderFileList(repo.files);
        });

        this.manager.on('repositoryUpdated', (repo) => {
            this.hideLoading();
            this.notify('Repository updated', 'success');
        });

        this.manager.on('repositoryDeleted', () => {
            this.hideLoading();
            this.notify('Repository deleted', 'success');
            this.clearRepositoryDetail();
        });

        this.manager.on('fileSelected', (file) => {
            this.hideLoading();
            this.highlightActiveFile(file.id);
            this.updateFileInfo(file);
        });

        this.manager.on('fileCreated', (file) => {
            this.hideLoading();
            this.notify('File created', 'success');
            this.appendFileToList(file);
            this.highlightActiveFile(file.id);
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
            this.removeFileFromList(data.id);
        });

        this.manager.on('fileChanged', (data) => {
            this.markFileUnsaved(data.fileId, data.hasUnsavedChanges);
        });

        this.manager.on('error', (data) => {
            this.hideLoading();
            this.notify(data.error.message || 'An error occurred', 'error');
        });

        this.manager.on('searchCompleted', (data) => {
            this.hideLoading();
            this.renderSearchResults(data.data.results);
        });
    }

    async handleAction(action, data = {}, event = null) {
        if (this.onAction) {
            const handled = await this.onAction(action, data, event);
            if (handled === false) return;
        }

        switch (action) {
            case 'load-repos':
                await this.manager.loadRepositories();
                break;

            case 'load-repo':
                if (data.repoId) {
                    await this.manager.loadRepository(data.repoId);
                }
                break;

            case 'create-repo':
                await this.showCreateRepoDialog();
                break;

            case 'edit-repo':
                await this.showEditRepoDialog();
                break;

            case 'delete-repo':
                await this.confirmDeleteRepo();
                break;

            case 'duplicate-repo':
                await this.duplicateCurrentRepo();
                break;

            case 'export-repo':
                this.manager.exportRepository(null, data.format || 'download');
                break;

            case 'select-file':
                if (data.fileId) {
                    await this.manager.selectFile(data.fileId);
                }
                break;

            case 'create-file':
                await this.showCreateFileDialog();
                break;

            case 'rename-file':
                if (data.fileId) {
                    await this.showRenameFileDialog(data.fileId);
                }
                break;

            case 'delete-file':
                if (data.fileId) {
                    await this.confirmDeleteFile(data.fileId);
                }
                break;

            case 'save-file':
                await this.bridge.saveCurrentFile();
                break;

            case 'save-all':
                await this.manager.saveAllPendingChanges();
                break;

            default:
                console.warn('Unknown action:', action);
        }
    }

    async handleSearch(query) {
        if (!query || query.length < 2) {
            return;
        }
        await this.manager.search(query);
    }

    renderRepositoryList(repositories) {
        const container = document.querySelector(this.selectors.repoList);
        if (!container) return;

        if (!repositories || repositories.length === 0) {
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

        const languages = repo.languages ? repo.languages.slice(0, 3).join(', ') : '';
        const updatedAt = this.formatDate(repo.updatedAt);

        return `
            <div class="repo-card" data-action="load-repo" data-repo-id="${repo.id}">
                <div class="repo-card-header">
                    <h3 class="repo-name">${this.escapeHtml(repo.name)}</h3>
                    <span class="repo-visibility">${repo.visibility}</span>
                </div>
                ${repo.description ? `<p class="repo-description">${this.escapeHtml(repo.description)}</p>` : ''}
                <div class="repo-card-footer">
                    <span class="repo-files">${repo.fileCount} file${repo.fileCount !== 1 ? 's' : ''}</span>
                    ${languages ? `<span class="repo-languages">${languages}</span>` : ''}
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
        const nameEl = document.querySelector(this.selectors.repoName);
        const descEl = document.querySelector(this.selectors.repoDescription);

        if (nameEl) nameEl.textContent = '';
        if (descEl) descEl.textContent = '';

        this.clearFileList();
        this.bridge.clear();
    }

    renderFileList(files) {
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        if (!files || files.length === 0) {
            container.innerHTML = this.templates.emptyFiles || `
                <div class="empty-state">
                    <p>No files in this repository</p>
                    <button data-action="create-file" class="btn btn-sm">
                        Add a file
                    </button>
                </div>
            `;
            return;
        }

        const html = files.map(file => this.renderFileItem(file)).join('');
        container.innerHTML = html;
    }

    renderFileItem(file) {
        if (this.templates.fileItem) {
            return this.templates.fileItem(file);
        }

        const size = this.formatBytes(file.size);
        const icon = this.getFileIcon(file.language);

        return `
            <div class="file-item" data-file-id="${file.id}" data-action="select-file">
                <span class="file-icon">${icon}</span>
                <span class="file-name">${this.escapeHtml(file.filename)}</span>
                <span class="file-size">${size}</span>
                <div class="file-actions">
                    <button data-action="rename-file" data-file-id="${file.id}" class="btn-icon" title="Rename">
                        ✏️
                    </button>
                    <button data-action="delete-file" data-file-id="${file.id}" class="btn-icon" title="Delete">
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
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-file-id="${file.id}"]`);
        if (fileEl) {
            fileEl.outerHTML = this.renderFileItem(file);
        }
    }

    removeFileFromList(fileId) {
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-file-id="${fileId}"]`);
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

    highlightActiveFile(fileId) {
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        container.querySelectorAll('.file-item').forEach(el => {
            el.classList.remove('active');
        });

        const activeEl = container.querySelector(`[data-file-id="${fileId}"]`);
        if (activeEl) {
            activeEl.classList.add('active');
        }
    }

    markFileUnsaved(fileId, unsaved) {
        const container = document.querySelector(this.selectors.fileList);
        if (!container) return;

        const fileEl = container.querySelector(`[data-file-id="${fileId}"]`);
        if (fileEl) {
            fileEl.classList.toggle('unsaved', unsaved);
        }
    }

    updateFileInfo(file) {
        const infoEl = document.querySelector(this.selectors.fileInfo);
        if (!infoEl) return;

        const size = this.formatBytes(file.size);
        const lines = file.lines || 0;
        const lang = file.language || 'plaintext';

        infoEl.innerHTML = `
            <span class="info-language">${lang}</span>
            <span class="info-lines">${lines} lines</span>
            <span class="info-size">${size}</span>
        `;
    }

    renderSearchResults(results) {
        const container = document.querySelector(this.selectors.repoList);
        if (!container) return;

        if (!results || results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No results found</p>
                </div>
            `;
            return;
        }

        const html = results.map(repo => this.renderRepoCard(repo)).join('');
        container.innerHTML = html;
    }

    async showCreateRepoDialog() {
        const name = prompt('Repository name:');
        if (!name) return;

        const description = prompt('Description (optional):') || '';

        await this.manager.createRepository({
            name,
            description,
            visibility: 'public'
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

        await this.manager.updateRepository(repo.id, { name, description });
    }

    async confirmDeleteRepo() {
        const repo = this.manager.getCurrentRepo();
        if (!repo) {
            this.notify('No repository selected', 'error');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete "${repo.name}"? This cannot be undone.`);
        if (confirmed) {
            await this.manager.deleteRepository(repo.id);
        }
    }

    async duplicateCurrentRepo() {
        const repo = this.manager.getCurrentRepo();
        if (!repo) {
            this.notify('No repository selected', 'error');
            return;
        }

        const name = prompt('Name for the copy:', `${repo.name} (copy)`);
        if (!name) return;

        await this.manager.duplicateRepository(repo.id, name);
    }

    async showCreateFileDialog() {
        const filename = prompt('File name (with extension):');
        if (!filename) return;

        await this.manager.createFile({
            filename,
            content: ''
        });
    }

    async showRenameFileDialog(fileId) {
        const file = this.manager.getFileById(fileId);
        if (!file) return;

        const filename = prompt('New file name:', file.filename);
        if (!filename || filename === file.filename) return;

        await this.manager.updateFile(fileId, { filename });
    }

    async confirmDeleteFile(fileId) {
        const file = this.manager.getFileById(fileId);
        if (!file) return;

        const confirmed = confirm(`Are you sure you want to delete "${file.filename}"?`);
        if (confirmed) {
            await this.manager.deleteFile(fileId);
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
        const overlay = document.querySelector(this.selectors.loadingOverlay);
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
            console.log(`[${type.toUpperCase()}] ${message}`);
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
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getFileIcon(language) {
        const icons = {
            'javascript': '📜',
            'typescript': '📘',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'markdown': '📝',
            'python': '🐍',
            'php': '🐘',
            'ruby': '💎',
            'java': '☕',
            'go': '🔵',
            'rust': '⚙️',
            'shell': '💻',
            'sql': '🗃️',
            'plaintext': '📄'
        };

        return icons[language] || '📄';
    }
}

const storageUI = new StorageUI();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageUI, storageUI };
}
