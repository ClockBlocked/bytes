const PageRouter = {
    pages: {
        repo: null,
        explorer:  null,
        file: null
    },
    
    currentPage: null,
    
    transitionDuration: 400,
    
    loadingBar: null,
    
    isTransitioning: false,

    init() {
        this.cachePageElements();
        this.createLoadingBar();
        this.setupEventListeners();
        this.showInitialPage();
    },

    cachePageElements() {
        const allPages = document.querySelectorAll('.pages[data-page]');
        
        allPages.forEach(page => {
            const pageName = page.getAttribute('data-page');
            if (pageName) {
                this.pages[pageName] = page;
                
                page.classList.remove('hidden', 'spa-hidden', 'spa-page', 'active', 'exit');
                page.classList.add('hide');
            }
        });
    },

    createLoadingBar() {
        document.querySelectorAll('.page-loading-bar').forEach(el => el.remove());
        
        this.loadingBar = document.createElement('div');
        this.loadingBar.className = 'page-loading-bar';
        this.loadingBar.innerHTML = '<div class="bar-fill"></div>';
        document.body.appendChild(this.loadingBar);
    },

    setupEventListeners() {
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'repo';
            this.navigateTo(page, false);
        });

        document.addEventListener('click', (e) => {
            const navElement = e.target.closest('[data-navigate]');
            if (navElement && ! this.isTransitioning) {
                e.preventDefault();
                const targetPage = navElement.getAttribute('data-navigate');
                this.navigateTo(targetPage, true);
            }
        });
    },

    showInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';
        
        if (this.pages[initialPage]) {
            this.pages[initialPage].classList.remove('hide');
            this.pages[initialPage].classList.add('show');
            this.currentPage = initialPage;
            this.updatePageTitle(initialPage);
        }
    },

    async navigateTo(pageName, updateHistory = true) {
        if (!this.pages[pageName]) {
            console.warn(`Page "${pageName}" not found`);
            return;
        }

        if (this.isTransitioning || this.currentPage === pageName) {
            return;
        }

        this.isTransitioning = true;
        this.showLoadingBar();

        if (updateHistory && window.location.hash !== `#${pageName}`) {
            window.history.pushState({ page: pageName }, '', `#${pageName}`);
        }

        document.dispatchEvent(new CustomEvent('pageNavigationStart', {
            detail: { from: this.currentPage, to: pageName }
        }));

        if (this.currentPage && this.pages[this.currentPage]) {
            await this.hidePage(this.currentPage);
        }

        await this.showPage(pageName);

        const previousPage = this.currentPage;
        this.currentPage = pageName;

        this.updatePageTitle(pageName);

        this.hideLoadingBar();

        document.dispatchEvent(new CustomEvent('pageNavigationComplete', {
            detail: { from: previousPage, to: pageName }
        }));

        this.isTransitioning = false;
    },

    hidePage(pageName) {
        return new Promise((resolve) => {
            const page = this.pages[pageName];
            if (! page) {
                resolve();
                return;
            }

            page.classList.remove('show');
            page.classList.add('hide');

            setTimeout(resolve, this.transitionDuration);
        });
    },

    showPage(pageName) {
        return new Promise((resolve) => {
            const page = this.pages[pageName];
            if (!page) {
                resolve();
                return;
            }

            page.classList.remove('hide');
            
            void page.offsetWidth;
            
            page.classList.add('show');

            setTimeout(resolve, this.transitionDuration);
        });
    },

    showLoadingBar() {
        if (! this.loadingBar) return;
        
        const fill = this.loadingBar.querySelector('.bar-fill');
        if (fill) fill.style.width = '0%';
        
        this.loadingBar.classList.add('active');
        
        setTimeout(() => {
            if (fill) fill.style.width = '17%';
        }, 220);
        
        setTimeout(() => {
            if (fill) fill.style.width = '63%';
        }, 354);
        
        setTimeout(() => {
            if (fill) fill.style.width = '78%';
        }, 749);
    },

    hideLoadingBar() {
        if (!this.loadingBar) return;
        
        const fill = this.loadingBar.querySelector('.bar-fill');
        if (fill) fill.style.width = '100%';
        
        setTimeout(() => {
            this.loadingBar.classList.remove('active');
            if (fill) fill.style.width = '0%';
        }, 200);
    },

    updatePageTitle(pageName) {
        const titles = {
            'repo': 'Repositories - GitDev',
            'explorer': 'File Explorer - GitDev',
            'file': 'File Editor - GitDev'
        };
        document.title = titles[pageName] || 'GitDev';
    },

    getPage(pageName) {
        return this.pages[pageName] || null;
    },

    isPageVisible(pageName) {
        const page = this.pages[pageName];
        return page ?  page.classList.contains('show') : false;
    }
};

window.showRepoSelector = function() {
    PageRouter.navigateTo('repo');
};

window.showExplorer = function() {
    if (! window.currentState || !window.currentState.repository) {
        console.warn('No repository selected');
        return;
    }
    PageRouter.navigateTo('explorer');
};

window.showFileViewer = function() {
    PageRouter.navigateTo('file');
};

window.showFileEditor = function() {
    PageRouter.navigateTo('file');
    setTimeout(() => {
        if (window.coderViewEdit && typeof window.coderViewEdit.enableEditing === 'function') {
            window.coderViewEdit.enableEditing();
        }
    }, PageRouter.transitionDuration + 100);
};

window.navigateToPage = function(pageName) {
    PageRouter.navigateTo(pageName);
};

window.navigateToRoot = function() {
    if (! window.currentState) return;
    
    window.currentState.path = '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, '').then(files => {
            window.currentState.files = files;
            if (typeof renderFileList === 'function') renderFileList();
            if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
            if (typeof updateStats === 'function') updateStats();
        });
    }
};

window.navigateToPath = function(path) {
    if (!window.currentState) return;
    
    window.currentState.path = path;
    const pathPrefix = path ?  path + '/' : '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, pathPrefix).then(files => {
            window.currentState.files = files;
            if (typeof renderFileList === 'function') renderFileList();
            if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
        });
    }
};

window.navigateToFolder = function(folderName) {
    if (!window.currentState) return;
    
    const newPath = window.currentState.path 
        ? window.currentState.path + '/' + folderName 
        : folderName;
    
    window.navigateToPath(newPath);
};

window.navigateBack = function() {
    if (! window.currentState) return;
    
    const pathParts = window.currentState.path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
        pathParts.pop();
        window.navigateToPath(pathParts.join('/'));
    } else {
        window.navigateToRoot();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PageRouter.init());
} else {
    PageRouter.init();
}

window.PageRouter = PageRouter;