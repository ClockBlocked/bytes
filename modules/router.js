class GitDevSPA {
    constructor() {
        this.appContainer = document.getElementById('mainArea');
        this.loadingBar = null;
        this.currentPage = null;
        this.previousPage = null;
        this.pageCache = new Map();
        this.transitionDuration = 1200;
        this.loadingBarDuration = 800;
        this.currentState = window.currentState || {};
        this.init();
    }

    init() {
        this.createLoadingBar();
        this.setupNavigation();
        this.loadInitialPage();
        this.setupEventListeners();
        this.setupGlobalErrorHandling();
    }

    createLoadingBar() {
        this.loadingBar = document.createElement('div');
        this.loadingBar.className = 'spa-loading-bar';
        this.loadingBar.innerHTML = `
            <div class="spa-loading-bar-progress"></div>
            <div class="spa-loading-bar-buffer"></div>
        `;
        document.body.appendChild(this.loadingBar);
        
        this.addStyles();
    }

    addStyles() {
        const styles = `
            .spa-loading-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: transparent;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .spa-loading-bar.visible {
                opacity: 1;
            }
            
            .spa-loading-bar-progress {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #dc2626, #ef4444, #f87171);
                transition: width 0.2s ease;
                animation: loadingBarColors 2s linear infinite;
            }
            
            .spa-loading-bar-buffer {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0%;
                background: rgba(220, 38, 38, 0.2);
                transition: width 0.4s ease;
            }
            
            @keyframes loadingBarColors {
                0% { background-position: 0% 0%; }
                100% { background-position: 200% 0%; }
            }
            
            .page-enter {
                animation: pageEnter ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            .page-exit {
                animation: pageExit ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            @keyframes pageEnter {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                    filter: blur(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }
            }
            
            @keyframes pageExit {
                from {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                    filter: blur(10px);
                }
            }
            
            .page-content {
                position: relative;
                min-height: 80vh;
            }
            
            [data-navigate] {
                cursor: pointer;
                transition: opacity 0.2s ease;
            }
            
            [data-navigate]:hover {
                opacity: 0.8;
            }
            
            .hidden {
                display: none !important;
            }
            
            .blurIN {
                animation: pageEnter ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            .blurOUT {
                animation: pageExit ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupNavigation() {
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'repo';
            this.loadPage(page, false);
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const navigateElement = e.target.closest('[data-navigate]');
            if (navigateElement) {
                e.preventDefault();
                const page = navigateElement.getAttribute('data-navigate');
                const url = navigateElement.getAttribute('href') || `#${page}`;
                this.navigateTo(url, page);
            }
        });

        document.addEventListener('viewTransitionStart', () => {
            this.showLoadingBar();
        });

        document.addEventListener('viewTransitionEnd', () => {
            this.updateLoadingBar(100);
            setTimeout(() => this.hideLoadingBar(), 200);
        });

        document.addEventListener('navigationStart', () => {
            this.showLoadingBar();
        });

        document.addEventListener('navigationComplete', () => {
            this.updateLoadingBar(100);
            setTimeout(() => this.hideLoadingBar(), 200);
        });
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            document.dispatchEvent(new CustomEvent('appError', {
                detail: {
                    type: 'global',
                    error: event.error,
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                },
            }));
        });

        window.addEventListener('unhandledrejection', (event) => {
            document.dispatchEvent(new CustomEvent('appError', {
                detail: {
                    type: 'promise',
                    error: event.reason,
                    promise: event.promise,
                },
            }));
        });
    }

    loadInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';
        this.loadPage(initialPage, false);
    }

    async navigateTo(url, page) {
        if (url !== window.location.hash) {
            window.history.pushState({ page }, '', url);
        }
        
        await this.loadPage(page, true);
    }

    async loadPage(pageName, showTransition = true) {
        if (this.currentPage === pageName) return;
        
        this.previousPage = this.currentPage;
        this.currentPage = pageName;
        
        document.dispatchEvent(new CustomEvent('viewTransitionStart', {
            detail: { from: this.previousPage, to: pageName }
        }));
        
        this.showLoadingBar();
        
        try {
            let pageContent;
            if (this.pageCache.has(pageName)) {
                pageContent = this.pageCache.get(pageName);
                await this.simulateDelay(150);
            } else {
                const delay = Math.random() * 300 + 200;
                await this.simulateDelay(delay);
                
                pageContent = this.getPageContent(pageName);
                
                if (pageContent) {
                    this.pageCache.set(pageName, pageContent);
                }
            }
            
            if (!pageContent) {
                console.error(`Page ${pageName} not found`);
                return;
            }
            
            this.updateLoadingBar(90);
            
            await this.renderPage(pageContent, showTransition);
            
            this.updateLoadingBar(100);
            
            setTimeout(() => {
                this.hideLoadingBar();
            }, 200);
            
            this.updatePageTitle(pageName);
            
            document.dispatchEvent(new CustomEvent('viewTransitionEnd', {
                detail: { from: this.previousPage, to: pageName }
            }));
            
            document.dispatchEvent(new CustomEvent('viewChanged', {
                detail: { viewId: pageName }
            }));
            
            if (window.appState) {
                window.appState.currentView = pageName;
            }
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.updateLoadingBar(100);
            setTimeout(() => this.hideLoadingBar(), 200);
        }
    }

    showLoadingBar() {
        this.loadingBar.classList.add('visible');
        this.updateLoadingBar(10);
        
        setTimeout(() => {
            const buffer = this.loadingBar.querySelector('.spa-loading-bar-buffer');
            buffer.style.width = '50%';
        }, 100);
        
        const randomIncrement = () => {
            if (parseInt(this.loadingBar.querySelector('.spa-loading-bar-progress').style.width) < 80) {
                const increment = Math.random() * 5 + 1;
                this.updateLoadingBar(
                    parseInt(this.loadingBar.querySelector('.spa-loading-bar-progress').style.width) + increment
                );
                setTimeout(randomIncrement, Math.random() * 200 + 100);
            }
        };
        
        setTimeout(randomIncrement, 300);
    }

    updateLoadingBar(percentage) {
        const progressBar = this.loadingBar.querySelector('.spa-loading-bar-progress');
        percentage = Math.min(100, Math.max(0, percentage));
        progressBar.style.width = `${percentage}%`;
        progressBar.style.backgroundSize = '200% 100%';
    }

    hideLoadingBar() {
        const progressBar = this.loadingBar.querySelector('.spa-loading-bar-progress');
        const buffer = this.loadingBar.querySelector('.spa-loading-bar-buffer');
        
        buffer.style.width = '0%';
        
        setTimeout(() => {
            this.loadingBar.classList.remove('visible');
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 300);
        }, 300);
    }

    async renderPage(content, showTransition = true) {
        return new Promise((resolve) => {
            if (showTransition && this.appContainer.children.length > 0) {
                const currentPage = this.appContainer.firstElementChild;
                currentPage.classList.add('page-exit');
                
                setTimeout(() => {
                    if (currentPage.parentNode) {
                        currentPage.remove();
                    }
                    this.insertNewPage(content, resolve);
                }, this.transitionDuration);
            } else {
                this.insertNewPage(content, resolve);
            }
        });
    }

    insertNewPage(content, resolve) {
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'page-content';
        pageWrapper.innerHTML = content;
        
        if (this.appContainer.children.length > 0) {
            this.appContainer.insertBefore(pageWrapper, this.appContainer.firstChild);
        } else {
            this.appContainer.appendChild(pageWrapper);
        }
        
        setTimeout(() => {
            pageWrapper.classList.add('page-enter');
            resolve();
        }, 10);
        
        window.dispatchEvent(new CustomEvent('pageChanged', {
            detail: { page: this.currentPage }
        }));
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updatePageTitle(pageName) {
        const titles = {
            'repo': 'Repositories - GitDev',
            'explorer': 'File Explorer - GitDev',
            'file': 'File Editor - GitDev'
        };
        
        document.title = titles[pageName] || 'GitDev';
    }

    getPageContent(pageName) {
        const pages = {
            'repo': () => {
                return document.getElementById('repoSelectorView').outerHTML;
            },
            'explorer': () => {
                return document.getElementById('explorerView').outerHTML;
            },
            'file': () => {
                const fileView = document.querySelector('.pages[data-page="file"]');
                return fileView ? fileView.outerHTML : '<div>File view not available</div>';
            }
        };
        
        const pageGetter = pages[pageName];
        return pageGetter ? pageGetter() : null;
    }

    showRepoSelector() {
        this.navigateTo('#repo', 'repo');
    }

    showExplorer() {
        if (!this.currentState.repository) {
            console.warn('No repository selected');
            return;
        }
        this.navigateTo('#explorer', 'explorer');
    }

    showFileViewer() {
        this.navigateTo('#file', 'file');
    }

    showFileEditor() {
        this.navigateTo('#file', 'file');
        document.dispatchEvent(new CustomEvent('editorModeActivated'));
        
        if (window.coderViewEdit && typeof window.coderViewEdit.enableEditing === 'function') {
            window.coderViewEdit.enableEditing();
        }
    }

    navigateToRoot() {
        if (!this.currentState) return;
        
        this.currentState.path = '';
        
        document.dispatchEvent(new CustomEvent('navigationPathChange', {
            detail: { path: '', type: 'root' }
        }));
        
        setTimeout(() => {
            try {
                if (typeof LocalStorageManager !== 'undefined') {
                    this.currentState.files = LocalStorageManager.listFiles(this.currentState.repository, '');
                }
                
                if (typeof renderFileList === 'function') renderFileList();
                if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
                if (typeof updateStats === 'function') updateStats();
                
                document.dispatchEvent(new CustomEvent('navigationPathComplete', {
                    detail: { path: '', fileCount: this.currentState.files?.length || 0 }
                }));
            } catch (error) {
                document.dispatchEvent(new CustomEvent('navigationError', {
                    detail: { error, path: '', operation: 'navigateToRoot' }
                }));
            }
        }, 150);
    }

    navigateToPath(path) {
        if (!this.currentState) return;
        
        this.currentState.path = path;
        
        document.dispatchEvent(new CustomEvent('navigationPathChange', {
            detail: { path, type: 'directory' }
        }));
        
        setTimeout(() => {
            try {
                const pathPrefix = path ? path + '/' : '';
                
                if (typeof LocalStorageManager !== 'undefined') {
                    this.currentState.files = LocalStorageManager.listFiles(this.currentState.repository, pathPrefix);
                }
                
                if (typeof renderFileList === 'function') renderFileList();
                if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
                
                document.dispatchEvent(new CustomEvent('navigationPathComplete', {
                    detail: { path, fileCount: this.currentState.files?.length || 0 }
                }));
            } catch (error) {
                document.dispatchEvent(new CustomEvent('navigationError', {
                    detail: { error, path, operation: 'navigateToPath' }
                }));
            }
        }, 150);
    }

    navigateToFolder(folderName) {
        if (!this.currentState) return;
        
        const newPath = this.currentState.path ? this.currentState.path + '/' + folderName : folderName;
        
        document.dispatchEvent(new CustomEvent('folderNavigation', {
            detail: { folderName, fromPath: this.currentState.path, toPath: newPath }
        }));
        
        this.navigateToPath(newPath);
    }

    navigateBack() {
        if (!this.currentState) return;
        
        const pathParts = this.currentState.path.split('/').filter(Boolean);
        if (pathParts.length > 0) {
            pathParts.pop();
            const newPath = pathParts.join('/');
            
            document.dispatchEvent(new CustomEvent('navigationBack', {
                detail: { from: this.currentState.path, to: newPath }
            }));
            
            this.navigateToPath(newPath);
        } else {
            this.navigateToRoot();
        }
    }

    refreshCurrentView() {
        if (!this.currentState) return;
        
        const currentView = this.currentPage;
        if (!currentView) return;
        
        this.showLoadingBar();
        
        document.dispatchEvent(new CustomEvent('viewRefresh', {
            detail: { viewId: currentView }
        }));
        
        setTimeout(() => {
            if (currentView === 'explorer' && this.currentState.path !== undefined) {
                this.navigateToPath(this.currentState.path);
            } else if (currentView === 'repo') {
                if (typeof refreshRepositories === 'function') {
                    refreshRepositories();
                }
            }
            
            this.hideLoadingBar();
        }, 300);
    }
}

let spaInstance = null;

function initializeApp() {
    spaInstance = new GitDevSPA();
    
    window.spa = spaInstance;
    window.showRepoSelector = () => spaInstance.showRepoSelector();
    window.showExplorer = () => spaInstance.showExplorer();
    window.showFileViewer = () => spaInstance.showFileViewer();
    window.showFileEditor = () => spaInstance.showFileEditor();
    window.navigateToRoot = () => spaInstance.navigateToRoot();
    window.navigateToPath = (path) => spaInstance.navigateToPath(path);
    window.navigateToFolder = (folderName) => spaInstance.navigateToFolder(folderName);
    window.navigateBack = () => spaInstance.navigateBack();
    window.refreshCurrentView = () => spaInstance.refreshCurrentView();
    
    document.dispatchEvent(new CustomEvent('appComponentsInitialized'));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}