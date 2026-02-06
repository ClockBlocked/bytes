/**
 * GitDev Page Router
 * 
 * Simple, clean page navigation using data-page attributes
 * and CSS-based animations with .show/.hide classes
 * 
 * Created by William Hanson
 * Chevrolay@Outlook.com
 */

const PageRouter = {
    // Page element references
    pages: {
        repo: null,
        explorer: null,
        file: null
    },
    
    // Current active page
    currentPage: null,
    
    // Transition duration in ms (should match CSS)
    transitionDuration: 400,
    
    // Minimum loading bar display time
    minLoadingTime: 600,
    
    // Loading bar element
    loadingBar: null,
    
    // Loading bar animation interval
    loadingInterval: null,
    
    // Prevent rapid navigation
    isTransitioning: false,

    /**
     * Initialize the router
     */
    init() {
        this.cachePageElements();
        this.createLoadingBar();
        this.setupEventListeners();
        this.showInitialPage();
    },

    /**
     * Cache all page elements using data-page attribute
     */
    cachePageElements() {
        const allPages = document.querySelectorAll('.pages[data-page]');
        
        allPages.forEach(page => {
            const pageName = page.getAttribute('data-page');
            if (pageName) {
                this.pages[pageName] = page;
                
                // Remove any legacy classes and set initial hidden state
                page.classList.remove('hidden', 'spa-hidden', 'spa-page', 'active', 'exit', 'show');
                page.classList.add('hide');
            }
        });
    },

    /**
     * Create the loading bar element
     */
    createLoadingBar() {
        // Remove any existing loading bars
        document.querySelectorAll('.page-loading-bar').forEach(el => el.remove());
        
        this.loadingBar = document.createElement('div');
        this.loadingBar.className = 'page-loading-bar';
        this.loadingBar.innerHTML = '<div class="bar-fill"></div>';
        document.body.appendChild(this.loadingBar);
    },

    /**
     * Setup navigation event listeners
     */
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'repo';
            this.navigateTo(page, false);
        });

        // Handle clicks on elements with data-navigate attribute
        document.addEventListener('click', (e) => {
            const navElement = e.target.closest('[data-navigate]');
            if (navElement && ! this.isTransitioning) {
                e.preventDefault();
                const targetPage = navElement.getAttribute('data-navigate');
                this.navigateTo(targetPage, true);
            }
        });
    },

    /**
     * Show the initial page based on URL hash or default to 'repo'
     */
    showInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';
        
        // Ensure all pages start hidden
        Object.values(this.pages).forEach(page => {
            if (page) {
                page.classList.remove('show');
                page.classList.add('hide');
            }
        });
        
        // Show initial page without full animation sequence
        // but still show a brief loading bar for visual consistency
        this.showLoadingBar();
        
        setTimeout(() => {
            if (this.pages[initialPage]) {
                this.pages[initialPage].classList.remove('hide');
                this.pages[initialPage].classList.add('show');
                this.currentPage = initialPage;
                this.updatePageTitle(initialPage);
            }
            this.completeLoadingBar();
        }, this.minLoadingTime);
    },

    /**
     * Navigate to a specific page
     * @param {string} pageName - The data-page value to navigate to
     * @param {boolean} updateHistory - Whether to push to browser history
     */
    async navigateTo(pageName, updateHistory = true) {
        // Validate page exists
        if (!this.pages[pageName]) {
            console.warn('Page "' + pageName + '" not found');
            return;
        }

        // Prevent navigation to current page or during transition
        if (this.isTransitioning || this.currentPage === pageName) {
            return;
        }

        this.isTransitioning = true;
        
        // Start loading bar immediately
        this.showLoadingBar();
        
        // Record start time to ensure minimum loading display
        const startTime = Date.now();

        // Update browser history
        if (updateHistory && window.location.hash !== '#' + pageName) {
            window.history.pushState({ page: pageName }, '', '#' + pageName);
        }

        // Dispatch navigation start event
        document.dispatchEvent(new CustomEvent('pageNavigationStart', {
            detail: { from: this.currentPage, to: pageName }
        }));

        // Hide current page with exit animation
        if (this.currentPage && this.pages[this.currentPage]) {
            this.pages[this.currentPage].classList.remove('show');
            this.pages[this.currentPage].classList.add('hide');
        }

        // Wait for exit animation to complete
        await this.delay(this.transitionDuration);
        
        // Calculate remaining time to meet minimum loading time
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, this.minLoadingTime - elapsed);
        
        // Wait for remaining time if needed
        if (remainingDelay > 0) {
            await this.delay(remainingDelay);
        }

        // Scroll to top before showing new page
        window.scrollTo(0, 0);

        // Show new page with entrance animation
        this.pages[pageName].classList.remove('hide');
        
        // Force reflow to ensure animation triggers
        void this.pages[pageName].offsetWidth;
        
        this.pages[pageName].classList.add('show');

        // Update current page reference
        const previousPage = this.currentPage;
        this.currentPage = pageName;

        // Update page title
        this.updatePageTitle(pageName);

        // Complete loading bar
        this.completeLoadingBar();

        // Wait for entrance animation
        await this.delay(this.transitionDuration);

        // Dispatch navigation complete event
        document.dispatchEvent(new CustomEvent('pageNavigationComplete', {
            detail: { from: previousPage, to: pageName }
        }));

        this.isTransitioning = false;
    },

    /**
     * Show the loading bar with animated progress
     */
    showLoadingBar() {
        if (! this.loadingBar) return;
        
        // Clear any existing animation
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
        
        const fill = this.loadingBar.querySelector('.bar-fill');
        if (fill) {
            fill.style.transition = 'none';
            fill.style.width = '0%';
            
            // Force reflow
            void fill.offsetWidth;
            
            fill.style.transition = 'width 0.15s ease-out';
        }
        
        this.loadingBar.classList.add('active');
        
        // Animate progress incrementally
        let progress = 0;
        this.loadingInterval = setInterval(() => {
            if (progress < 85) {
                // Random increment between 5 and 15
                progress += Math.random() * 10 + 5;
                progress = Math.min(progress, 85);
                if (fill) fill.style.width = progress + '%';
            }
        }, 100);
    },

    /**
     * Complete the loading bar animation
     */
    completeLoadingBar() {
        if (! this.loadingBar) return;
        
        // Clear progress animation
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
        
        const fill = this.loadingBar.querySelector('.bar-fill');
        if (fill) {
            fill.style.width = '100%';
        }
        
        // Hide after completion animation
        setTimeout(() => {
            this.loadingBar.classList.remove('active');
            
            // Reset for next use
            setTimeout(() => {
                if (fill) {
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                }
            }, 200);
        }, 200);
    },

    /**
     * Promise-based delay helper
     * @param {number} ms - Milliseconds to delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Update the page title based on current page
     * @param {string} pageName - The current page name
     */
    updatePageTitle(pageName) {
        const titles = {
            'repo': 'Repositories - GitDev',
            'explorer': 'File Explorer - GitDev',
            'file': 'File Editor - GitDev'
        };
        document.title = titles[pageName] || 'GitDev';
    },

    /**
     * Get a page element by name
     * @param {string} pageName - The page name
     * @returns {HTMLElement|null}
     */
    getPage(pageName) {
        return this.pages[pageName] || null;
    },

    /**
     * Check if a page is currently visible
     * @param {string} pageName - The page name
     * @returns {boolean}
     */
    isPageVisible(pageName) {
        const page = this.pages[pageName];
        return page ?  page.classList.contains('show') : false;
    }
};

// Global navigation functions
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
    setTimeout(function() {
        if (window.coderViewEdit && typeof window.coderViewEdit.enableEditing === 'function') {
            window.coderViewEdit.enableEditing();
        }
    }, PageRouter.transitionDuration + 100);
};

window.navigateToPage = function(pageName) {
    PageRouter.navigateTo(pageName);
};

// Path navigation functions
window.navigateToRoot = function() {
    if (! window.currentState) return;
    
    window.currentState.path = '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, '').then(function(files) {
            window.currentState.files = files;
            if (typeof renderFileList === 'function') renderFileList();
            if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) window.breadCrumbs.update();
            if (typeof updateStats === 'function') updateStats();
        });
    }
};

window.navigateToPath = function(path) {
    if (! window.currentState) return;
    
    window.currentState.path = path;
    var pathPrefix = path ?  path + '/' : '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, pathPrefix).then(function(files) {
            window.currentState.files = files;
            if (typeof renderFileList === 'function') renderFileList();
            if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) window.breadCrumbs.update();
        });
    }
};

window.navigateToFolder = function(folderName) {
    if (!window.currentState) return;
    
    var newPath = window.currentState.path 
        ? window.currentState.path + '/' + folderName 
        :  folderName;
    
    window.navigateToPath(newPath);
};

window.navigateBack = function() {
    if (!window.currentState) return;
    
    var pathParts = window.currentState.path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
        pathParts.pop();
        window.navigateToPath(pathParts.join('/'));
    } else {
        window.navigateToRoot();
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        PageRouter.init();
    });
} else {
    PageRouter.init();
}

// Export for module usage
window.PageRouter = PageRouter;

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