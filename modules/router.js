class GitDevSPA {
    constructor() {
        this.appContainer = document.getElementById('mainArea');
        this.loadingBar = null;
        this.currentPage = null;
        this.previousPage = null;
        this.pageElements = new Map();
        this.transitionDuration = 800;
        this.loadingBarDuration = 800;
        this.currentState = window.currentState || {};
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.createLoadingBar();
        this.cacheExistingPages();
        this.setupNavigation();
        this.setupEventListeners();
        this.setupGlobalErrorHandling();
        this.loadInitialPage();
    }
    cacheExistingPages() {
        // Cache all existing page elements
        const pages = {
            'repo': document.getElementById('repoSelectorView'),
            'explorer': document.getElementById('explorerView'),
            'file': document.querySelector('.pages[data-page="file"]')
        };
        
        Object.entries(pages).forEach(([name, element]) => {
            if (element) {
                // Store the original parent and position
                this.pageElements.set(name, {
                    element: element,
                    originalParent: element.parentNode,
                    originalDisplay: element.style.display || 'block'
                });
            }
        });
    }
    setupNavigation() {
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'repo';
            this.loadPage(page, true);
        });
    }
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const navigateElement = e.target.closest('[data-spa-navigate]');
            if (navigateElement && !this.isTransitioning) {
                e.preventDefault();
                const page = navigateElement.getAttribute('data-spa-navigate');
                const url = navigateElement.getAttribute('href') || `#${page}`;
                this.navigateTo(url, page);
            }
        });

        // Listen for existing app events
        document.addEventListener('viewTransitionStart', () => {
            this.showLoadingBar();
        });

        document.addEventListener('navigationStart', () => {
            this.showLoadingBar();
        });
    }
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.hideLoadingBar();
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.hideLoadingBar();
        });
    }

///////////////////////////////////////////////////
////////////////////////////////  Routes  /////////
    async navigateTo(url, page) {
        if (this.isTransitioning) return;
        
        if (url !== window.location.hash) {
            window.history.pushState({ page }, '', url);
        }
        
        await this.loadPage(page, true);
    }
    async loadPage(pageName, showTransition = true) {
        if (this.isTransitioning || this.currentPage === pageName) return;
        
        this.isTransitioning = true;
        const previousPage = this.currentPage;
        this.currentPage = pageName;
        
        // Dispatch start event
        document.dispatchEvent(new CustomEvent('spaNavigationStart', {
            detail: { from: previousPage, to: pageName }
        }));
        
        // Show loading bar
        this.showLoadingBar();
        
        try {
            // Hide previous page if exists
            if (previousPage && this.pageElements.has(previousPage)) {
                await this.hidePage(previousPage, showTransition);
            }
            
            // Simulate loading delay
            await this.simulateDelay(showTransition ? 300 : 50);
            
            // Show loading progress
            this.updateLoadingBar(60);
            
            // Show new page
            await this.showPage(pageName, showTransition);
            
            // Complete loading
            this.updateLoadingBar(100);
            
            // Update page title
            this.updatePageTitle(pageName);
            
            // Dispatch complete event
            document.dispatchEvent(new CustomEvent('spaNavigationComplete', {
                detail: { from: previousPage, to: pageName }
            }));
            
            // Update app state
            if (window.appState) {
                window.appState.currentView = pageName;
            }
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.updateLoadingBar(100);
        } finally {
            // Hide loading bar after delay
            setTimeout(() => {
                this.hideLoadingBar();
                this.isTransitioning = false;
            }, 300);
        }
    }
    async hidePage(pageName, animate = true) {
        const pageData = this.pageElements.get(pageName);
        if (!pageData) return;
        
        const page = pageData.element;
        
        return new Promise((resolve) => {
            if (animate) {
                page.classList.remove('active');
                page.classList.add('exit');
                
                setTimeout(() => {
                    // Move page back to original container and hide
                    if (pageData.originalParent && page.parentNode !== pageData.originalParent) {
                        pageData.originalParent.appendChild(page);
                    }
                    page.classList.add('spa-hidden');
                    page.classList.remove('exit');
                    resolve();
                }, this.transitionDuration);
            } else {
                // Move page back to original container and hide immediately
                if (pageData.originalParent && page.parentNode !== pageData.originalParent) {
                    pageData.originalParent.appendChild(page);
                }
                page.classList.add('spa-hidden');
                page.classList.remove('active', 'exit');
                resolve();
            }
        });
    }
    async showPage(pageName, animate = true) {
        const pageData = this.pageElements.get(pageName);
        if (!pageData) {
            console.error(`Page ${pageName} not found`);
            return;
        }
        
        const page = pageData.element;
        
        return new Promise((resolve) => {
            // Ensure page is in main container
            if (page.parentNode !== this.appContainer) {
                this.appContainer.appendChild(page);
            }
            
            // Remove hidden class
            page.classList.remove('spa-hidden');
            
            if (animate) {
                // Trigger reflow
                void page.offsetWidth;
                
                // Add active class for animation
                page.classList.add('active');
                
                setTimeout(() => {
                    resolve();
                }, this.transitionDuration);
            } else {
                // Show immediately
                page.classList.add('active');
                resolve();
            }
        });
    }

    loadInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';
        setTimeout(() => {
            this.loadPage(initialPage, false);
        }, 100);
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
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('editorModeActivated'));
            
            if (window.coderViewEdit && typeof window.coderViewEdit.enableEditing === 'function') {
                window.coderViewEdit.enableEditing();
            }
        }, this.transitionDuration + 100);
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
        if (!this.currentState || !this.currentPage) return;
        
        this.showLoadingBar();
        
        document.dispatchEvent(new CustomEvent('viewRefresh', {
            detail: { viewId: this.currentPage }
        }));
        
        setTimeout(() => {
            if (this.currentPage === 'explorer' && this.currentState.path !== undefined) {
                this.navigateToPath(this.currentState.path);
            } else if (this.currentPage === 'repo') {
                if (typeof refreshRepositories === 'function') {
                    refreshRepositories();
                }
            }
            
            setTimeout(() => this.hideLoadingBar(), 500);
        }, 300);
    }
    
    
    


/**
 *  Loading Animation
 */
    createLoadingBar() {
        // Remove existing loading bar if present
        const existingBar = document.querySelector('.spa-loading-bar');
        if (existingBar) existingBar.remove();
        
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
        const existingStyle = document.getElementById('spa-loading-styles');
        if (existingStyle) existingStyle.remove();
        
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
                background-size: 200% 100%;
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
            
            .spa-page {
                position: relative;
                min-height: 80vh;
                opacity: 0;
                transform: translateY(20px);
                filter: blur(10px);
                transition: all ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            
            .spa-page.active {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
                pointer-events: all;
            }
            
            .spa-page.exit {
                opacity: 0;
                transform: translateY(-20px);
                filter: blur(10px);
            }
            
            .spa-hidden {
                display: none !important;
            }
            
            [data-spa-navigate] {
                cursor: pointer;
                transition: opacity 0.2s ease;
            }
            
            [data-spa-navigate]:hover {
                opacity: 0.8;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'spa-loading-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    showLoadingBar() {
        if (!this.loadingBar) return;
        
        this.loadingBar.classList.add('visible');
        this.updateLoadingBar(10);
        
        // Buffer animation
        setTimeout(() => {
            const buffer = this.loadingBar.querySelector('.spa-loading-bar-buffer');
            if (buffer) buffer.style.width = '60%';
        }, 100);
        
        // Random progress increments for realistic feel
        const simulateProgress = () => {
            if (this.isTransitioning) {
                const progressBar = this.loadingBar.querySelector('.spa-loading-bar-progress');
                if (!progressBar) return;
                
                const currentWidth = parseInt(progressBar.style.width) || 10;
                if (currentWidth < 80) {
                    const increment = Math.random() * 8 + 2;
                    this.updateLoadingBar(currentWidth + increment);
                    setTimeout(simulateProgress, Math.random() * 150 + 50);
                }
            }
        };
        
        setTimeout(simulateProgress, 200);
    }
    updateLoadingBar(percentage) {
        if (!this.loadingBar) return;
        
        const progressBar = this.loadingBar.querySelector('.spa-loading-bar-progress');
        if (!progressBar) return;
        
        percentage = Math.min(100, Math.max(0, percentage));
        progressBar.style.width = `${percentage}%`;
    }
    hideLoadingBar() {
        if (!this.loadingBar) return;
        
        const buffer = this.loadingBar.querySelector('.spa-loading-bar-buffer');
        if (buffer) buffer.style.width = '0%';
        
        setTimeout(() => {
            this.loadingBar.classList.remove('visible');
            setTimeout(() => {
                const progressBar = this.loadingBar.querySelector('.spa-loading-bar-progress');
                if (progressBar) progressBar.style.width = '0%';
            }, 300);
        }, 300);
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



/**
 *  Helpers
 */
    updatePageTitle(pageName) {
        const titles = {
            'repo': 'Repositories - GitDev',
            'explorer': 'File Explorer - GitDev',
            'file': 'File Editor - GitDev'
        };
        
        document.title = titles[pageName] || 'GitDev';
    }
}

// Initialize the SPA
let spaInstance = null;

function initializeSPA() {
    spaInstance = new GitDevSPA();
    
    // Add data-spa-navigate attributes to existing navigation elements
    document.querySelectorAll('[onclick*="showRepoSelector"]').forEach(el => {
        el.setAttribute('data-spa-navigate', 'repo');
        el.setAttribute('href', '#repo');
    });
    
    document.querySelectorAll('[onclick*="showExplorer"]').forEach(el => {
        el.setAttribute('data-spa-navigate', 'explorer');
        el.setAttribute('href', '#explorer');
    });
    
    document.querySelectorAll('[onclick*="showFileViewer"], [onclick*="showFileEditor"]').forEach(el => {
        el.setAttribute('data-spa-navigate', 'file');
        el.setAttribute('href', '#file');
    });
    
    // Set global references
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
    
    // Initialize all pages as hidden initially
    setTimeout(() => {
        ['repo', 'explorer', 'file'].forEach(page => {
            const pageData = spaInstance.pageElements.get(page);
            if (pageData) {
                pageData.element.classList.add('spa-hidden');
                pageData.element.classList.add('spa-page');
            }
        });
        
        // Show initial page
        const initialPage = window.location.hash.slice(1) || 'repo';
        spaInstance.loadPage(initialPage, false);
    }, 100);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSPA);
} else {
    initializeSPA();
}