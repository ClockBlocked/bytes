const ProgressLoader = (() => {
    let container = null;
    let fill = null;
    let hideTimer = null;
    let animationTimer = null;
    let progress = 0;
    let isRunning = false;

    let settings = {
        color: "#1c7eec",
        height: "2.5px",
        minimum: 0.08,
        maximum: 0.994,
        animationStyle: "realistic",
        hideDelay: 150,
        fadeOutDuration: 300,
        containerId: "pageProgress",
        fillSelector: ".progress-fill"
    };

    const easing = {
        easeOutQuad: (t) => t * (2 - t),
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    };

    function init() {
        container = document.getElementById(settings.containerId);
        if (!container) {
            container = document.createElement("div");
            container.id = settings.containerId;
            container.className = "page-progress";

            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";

            fill = document.createElement("div");
            fill.className = "progress-fill";

            progressBar.appendChild(fill);
            container.appendChild(progressBar);
            document.body.insertBefore(container, document.body.firstChild);
        } else {
            fill = container.querySelector(settings.fillSelector);
        }

        if (fill) {
            fill.style.backgroundColor = settings.color;
        }
        if (container) {
            container.style.height = settings.height;
        }

        return Boolean(container && fill);
    }

    function cleanup() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        if (animationTimer) {
            clearTimeout(animationTimer);
            animationTimer = null;
        }

        isRunning = false;
    }

    function reset() {
        cleanup();

        if (container) {
            container.classList.add("hidden");
            container.classList.remove("visible");
        }

        if (fill) {
            fill.style.width = "0%";
            fill.style.transition = "none";
        }

        progress = 0;
    }

    function show() {
        if (!container || !fill) {
            if (!init()) return;
        }

        reset();
        isRunning = true;

        requestAnimationFrame(() => {
            if (fill) {
                fill.style.transition = "width 0.1s ease-out";
            }

            container.classList.remove("hidden");
            container.classList.add("visible");

            switch (settings.animationStyle) {
                case "realistic":
                    animateRealistic();
                    break;
                case "linear":
                    animateLinear();
                    break;
                case "smooth":
                    animateSmoothWrapper();
                    break;
                default:
                    setProgress(settings.minimum * 100);
            }
        });
    }

    function hide() {
        if (!container || !fill) return;

        cleanup();
        isRunning = false;

        fill.style.transition = "width 0.2s ease-out";
        progress = 100;
        fill.style.width = "100%";

        hideTimer = setTimeout(() => {
            container.classList.remove("visible");

            setTimeout(() => {
                reset();
            }, settings.fadeOutDuration);
        }, settings.hideDelay);
    }

    function setProgress(value) {
        if (!fill) return;

        progress = Math.max(0, Math.min(value, settings.maximum * 100));
        fill.style.width = `${progress}%`;
    }

    function increment(amount) {
        if (!isRunning) return;

        const newProgress = Math.min(progress + amount, settings.maximum * 100);
        setProgress(newProgress);
    }

    function animateRealistic() {
        if (!isRunning || progress >= settings.maximum * 100) {
            return;
        }

        let incrementValue;
        let delay;

        if (progress < 20) {
            incrementValue = Math.random() * 8 + 5;
            delay = Math.random() * 40 + 20;
        } else if (progress < 50) {
            incrementValue = Math.random() * 5 + 3;
            delay = Math.random() * 80 + 40;
        } else if (progress < 80) {
            incrementValue = Math.random() * 2 + 1;
            delay = Math.random() * 200 + 100;
        } else if (progress < 90) {
            incrementValue = Math.random() * 0.8 + 0.3;
            delay = Math.random() * 400 + 200;
        } else {
            incrementValue = Math.random() * 0.3 + 0.1;
            delay = Math.random() * 800 + 400;
        }

        increment(incrementValue);

        animationTimer = setTimeout(() => {
            animateRealistic();
        }, delay);
    }

    function animateLinear() {
        if (!isRunning || progress >= settings.maximum * 100) {
            return;
        }

        const targetProgress = settings.maximum * 100;
        const remainingProgress = targetProgress - progress;
        const incrementValue = Math.max(0.5, remainingProgress * 0.02);

        increment(incrementValue);

        animationTimer = setTimeout(() => {
            animateLinear();
        }, 16);
    }

    let animationStartTime = 0;

    function animateSmooth() {
        if (!isRunning || progress >= settings.maximum * 100) {
            return;
        }

        const elapsed = Date.now() - animationStartTime;
        const duration = 10000;
        const t = Math.min(elapsed / duration, 1);
        const easedProgress = easing.easeOutExpo(t) * settings.maximum * 100;

        setProgress(easedProgress);

        if (t < 1 && isRunning) {
            animationTimer = setTimeout(() => {
                animateSmooth();
            }, 16);
        }
    }

    function animateSmoothWrapper() {
        animationStartTime = Date.now();
        animateSmooth();
    }

    function configure(options = {}) {
        settings = { ...settings, ...options };

        if (container) {
            container.style.height = settings.height;
        }

        if (fill) {
            fill.style.backgroundColor = settings.color;
        }

        return settings;
    }

    function isActive() {
        return isRunning && container && container.classList.contains("visible");
    }

    function getProgress() {
        return progress;
    }

    function getSettings() {
        return { ...settings };
    }

    function done() {
        hide();
    }

    function start() {
        show();
    }

    function set(value) {
        if (!isRunning) {
            show();
        }
        setProgress(value);
    }

    function trickle() {
        if (!isRunning) return;

        const amount = (settings.maximum * 100 - progress) * 0.1 * Math.random();
        increment(amount);
    }

    return {
        init,
        show,
        hide,
        start,
        done,
        set,
        increment,
        trickle,
        configure,
        isActive,
        getProgress,
        getSettings,
        reset
    };
})();

const PageRouter = {
    pages: {},
    
    currentPage: null,
    
    transitionDuration: 400,
    
    minLoadingTime: 600,
    
    isTransitioning: false,

    init() {
        ProgressLoader.init();
        this.cachePageElements();
        this.setupEventListeners();
        this.showInitialPage();
    },

    cachePageElements() {
        const allPages = document.querySelectorAll('.pages[data-page]');
        
        allPages.forEach(page => {
            const pageName = page.getAttribute('data-page');
            if (pageName) {
                this.pages[pageName] = page;
                page.classList.remove('hidden', 'spa-hidden', 'spa-page', 'active', 'exit', 'show');
                page.classList.add('hide');
            }
        });
    },

    setupEventListeners() {
        window.addEventListener('popstate', (e) => {
            const page = window.location.hash.slice(1) || 'repo';
            this.navigateTo(page, false);
        });

        document.addEventListener('click', (e) => {
            const navElement = e.target.closest('[data-navigate]');
            if (navElement && !this.isTransitioning) {
                e.preventDefault();
                const targetPage = navElement.getAttribute('data-navigate');
                this.navigateTo(targetPage, true);
            }
        });
    },

    showInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';
        
        Object.values(this.pages).forEach(page => {
            if (page) {
                page.classList.remove('show');
                page.classList.add('hide');
            }
        });
        
        ProgressLoader.start();
        
        setTimeout(() => {
            if (this.pages[initialPage]) {
                this.pages[initialPage].classList.remove('hide');
                this.pages[initialPage].classList.add('show');
                this.currentPage = initialPage;
                this.updatePageTitle(initialPage);
            }
            ProgressLoader.done();
        }, this.minLoadingTime);
    },

    async navigateTo(pageName, updateHistory = true) {
        if (!this.pages[pageName]) {
            console.warn('Page "' + pageName + '" not found');
            return;
        }

        if (this.isTransitioning || this.currentPage === pageName) {
            return;
        }

        this.isTransitioning = true;
        
        ProgressLoader.start();
        
        const startTime = Date.now();

        if (updateHistory && window.location.hash !== '#' + pageName) {
            window.history.pushState({ page: pageName }, '', '#' + pageName);
        }

        document.dispatchEvent(new CustomEvent('pageNavigationStart', {
            detail: { from: this.currentPage, to: pageName }
        }));

        if (this.currentPage && this.pages[this.currentPage]) {
            this.pages[this.currentPage].classList.remove('show');
            this.pages[this.currentPage].classList.add('hide');
        }

        await this.delay(this.transitionDuration);
        
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, this.minLoadingTime - elapsed);
        
        if (remainingDelay > 0) {
            await this.delay(remainingDelay);
        }

        window.scrollTo(0, 0);

        this.pages[pageName].classList.remove('hide');
        
        void this.pages[pageName].offsetWidth;
        
        this.pages[pageName].classList.add('show');

        const previousPage = this.currentPage;
        this.currentPage = pageName;

        this.updatePageTitle(pageName);

        ProgressLoader.done();

        await this.delay(this.transitionDuration);

        document.dispatchEvent(new CustomEvent('pageNavigationComplete', {
            detail: { from: previousPage, to: pageName }
        }));

        this.isTransitioning = false;
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        return page ? page.classList.contains('show') : false;
    }
};

window.showRepoSelector = function() {
    PageRouter.navigateTo('repo');
};

window.showExplorer = function() {
    if (!window.currentState || !window.currentState.repository) {
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

window.navigateToRoot = function() {
    if (!window.currentState) return;
    
    window.currentState.path = '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, '').then(function(files) {
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
    var pathPrefix = path ? path + '/' : '';
    
    if (typeof LocalStorageManager !== 'undefined') {
        LocalStorageManager.listFiles(window.currentState.repository, pathPrefix).then(function(files) {
            window.currentState.files = files;
            if (typeof renderFileList === 'function') renderFileList();
            if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
        });
    }
};

window.navigateToFolder = function(folderName) {
    if (!window.currentState) return;
    
    var newPath = window.currentState.path 
        ? window.currentState.path + '/' + folderName 
        : folderName;
    
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        PageRouter.init();
    });
} else {
    PageRouter.init();
}

window.PageRouter = PageRouter;
window.ProgressLoader = ProgressLoader;
window.LoadingProgress = ProgressLoader;