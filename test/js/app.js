class GitHubCloneApp {
    constructor(options = {}) {
        this.options = {
            apiBaseUrl: options.apiBaseUrl || '/api',
            autoSave: options.autoSave !== false,
            autoSaveDelay: options.autoSaveDelay || 5000,
            checkMigration: options.checkMigration !== false,
            theme: options.theme || 'default',
            readOnly: options.readOnly || false,
            ...options
        };

        this.api = null;
        this.manager = null;
        this.bridge = null;
        this.ui = null;
        this.migration = null;
        this.initialized = false;
        this.currentView = 'list';
    }

    async init() {
        if (this.initialized) {
            console.warn('App already initialized');
            return this;
        }

        this.api = new StorageAPI({
            baseUrl: this.options.apiBaseUrl,
            timeout: 30000,
            onError: (error) => this.handleGlobalError(error)
        });

        this.manager = new RepositoryManager(this.api);

        this.bridge = new CodeMirrorBridge({
            manager: this.manager,
            container: this.options.editorContainer || '#code-editor',
            theme: this.options.theme,
            readOnly: this.options.readOnly
        });

        this.ui = new StorageUI({
            manager: this.manager,
            bridge: this.bridge,
            onAction: (action, data, event) => this.handleAction(action, data, event),
            ...this.options.uiSelectors
        });

        this.migration = new StorageMigration({
            api: this.api
        });

        this.ui.init();

        if (document.querySelector(this.options.editorContainer || '#code-editor')) {
            this.bridge.init();
        }

        if (this.options.autoSave) {
            this.manager.startAutoSave(this.options.autoSaveDelay);
        }

        this.setupRouting();
        this.setupKeyboardShortcuts();

        if (this.options.checkMigration) {
            await this.checkMigration();
        }

        await this.handleInitialRoute();

        this.initialized = true;
        console.log('GitHub Clone App initialized');

        return this;
    }

    async checkMigration() {
        const migrationUI = new MigrationUI(this.migration);
        await migrationUI.checkAndPrompt();
    }

    setupRouting() {
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, e.state);
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href') || link.dataset.route;
                this.navigate(path);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.bridge.saveCurrentFile();
                        break;
                    case 'n':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.ui.handleAction('create-repo');
                        }
                        break;
                    case 'o':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.toggleSidebar();
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    async handleInitialRoute() {
        const path = window.location.pathname;
        await this.handleRoute(path);
    }

    async handleRoute(path, state = null) {
        const segments = path.split('/').filter(Boolean);

        if (segments.length === 0 || segments[0] === 'repos') {
            if (segments.length >= 2) {
                const repoId = segments[1];

                if (segments.length >= 3 && segments[2] === 'files') {
                    const fileId = segments[3];
                    await this.loadRepoAndFile(repoId, fileId);
                } else {
                    await this.loadRepo(repoId);
                }
            } else {
                await this.loadRepoList();
            }
        } else if (segments[0] === 'search') {
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                await this.search(query);
            }
        } else if (segments[0] === 'new') {
            this.showCreateRepo();
        }
    }

    navigate(path, state = null) {
        window.history.pushState(state, '', path);
        this.handleRoute(path, state);
    }

    async loadRepoList() {
        this.currentView = 'list';
        this.updateViewClass('list');
        await this.manager.loadRepositories();
    }

    async loadRepo(repoId) {
        this.currentView = 'repo';
        this.updateViewClass('repo');
        await this.manager.loadRepository(repoId);
    }

    async loadRepoAndFile(repoId, fileId) {
        this.currentView = 'editor';
        this.updateViewClass('editor');

        const repo = this.manager.getCurrentRepo();

        if (!repo || repo.id !== repoId) {
            await this.manager.loadRepository(repoId);
        }

        if (fileId) {
            await this.manager.selectFile(fileId);
        }
    }

    async search(query) {
        this.currentView = 'search';
        this.updateViewClass('search');
        await this.manager.search(query);
    }

    showCreateRepo() {
        this.currentView = 'create';
        this.updateViewClass('create');
        this.ui.handleAction('create-repo');
    }

    updateViewClass(view) {
        document.body.className = document.body.className
            .replace(/view-\w+/g, '')
            .trim();
        document.body.classList.add(`view-${view}`);
    }

    async handleAction(action, data, event) {
        switch (action) {
            case 'navigate':
                if (data.path) {
                    this.navigate(data.path);
                    return false;
                }
                break;

            case 'load-repo':
                if (data.repoId) {
                    this.navigate(`/repos/${data.repoId}`);
                    return false;
                }
                break;

            case 'select-file':
                if (data.fileId) {
                    const repo = this.manager.getCurrentRepo();
                    if (repo) {
                        this.navigate(`/repos/${repo.id}/files/${data.fileId}`);
                        return false;
                    }
                }
                break;

            case 'back-to-list':
                this.navigate('/repos');
                return false;

            case 'toggle-theme':
                this.toggleTheme();
                return false;

            case 'export-all':
                await this.exportAllRepos();
                return false;

            case 'import-file':
                this.showImportDialog();
                return false;
        }

        return true;
    }

    handleGlobalError(error) {
        console.error('Global error:', error);

        if (error.isNetworkError && error.isNetworkError()) {
            this.ui.notify('Network error. Please check your connection.', 'error');
        } else if (error.isServerError && error.isServerError()) {
            this.ui.notify('Server error. Please try again later.', 'error');
        }
    }

    focusSearch() {
        const searchInput = document.querySelector(this.ui.selectors.searchInput);
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    toggleSidebar() {
        document.body.classList.toggle('sidebar-collapsed');
    }

    closeModals() {
        document.querySelectorAll('.modal.open').forEach(modal => {
            modal.classList.remove('open');
        });
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        const theme = isDark ? 'monokai' : 'default';

        this.bridge.setTheme(theme);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.bridge.setTheme('monokai');
        }
    }

    async exportAllRepos() {
        try {
            const result = await this.manager.loadRepositories({ limit: 1000 });
            const repos = result.data.repositories;

            const exportData = {
                exportedAt: new Date().toISOString(),
                version: '1.0.0',
                repositories: []
            };

            for (const repoSummary of repos) {
                const fullRepo = await this.api.getRepository(repoSummary.id, {
                    includeContent: true
                });
                exportData.repositories.push(fullRepo.data.repository);
            }

            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `all-repos-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.ui.notify(`Exported ${repos.length} repositories`, 'success');
        } catch (error) {
            this.ui.notify('Export failed: ' + error.message, 'error');
        }
    }

    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const results = await this.migration.importFromFile(file);
                this.ui.notify(`Imported ${results.imported} repositories`, 'success');
                await this.loadRepoList();
            } catch (error) {
                this.ui.notify('Import failed: ' + error.message, 'error');
            }
        };

        input.click();
    }

    getManager() {
        return this.manager;
    }

    getApi() {
        return this.api;
    }

    getBridge() {
        return this.bridge;
    }

    getUI() {
        return this.ui;
    }

    destroy() {
        this.manager.stopAutoSave();
        this.manager.reset();
        this.bridge.destroy();
        this.initialized = false;
    }
}

async function initApp(options = {}) {
    const app = new GitHubCloneApp(options);
    await app.init();
    window.githubCloneApp = app;
    return app;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GitHubCloneApp, initApp };
}
