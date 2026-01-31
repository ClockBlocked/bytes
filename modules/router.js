const ProgressLoader = (() => {
    let $container = null;
    let $fill = null;
    let hideTimer = null;
    let animationTimer = null;
    let rafId = null;
    let progress = 0;
    let isRunning = false;
    let isVisible = false;

    let settings = {
        color: "#1c7eec",
        height: "2.5px",
        minimum: 0.08,
        maximum: 0.994,
        animationStyle: "realistic",
        hideDelay: 150,
        fadeOutDuration: 300,
        containerId: "pageProgress",
        fillSelector: ".progress-fill",
        reducedMotionStyle: "linear"
    };

    const easing = {
        easeOutQuad: (t) => t * (2 - t),
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    };

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function init() {
        $container = $(`#${settings.containerId}`);
        if (!$container.length) {
            $container = $('<div>', {
                id: settings.containerId,
                class: "page-progress",
                role: "progressbar",
                "aria-live": "polite",
                "aria-valuemin": "0",
                "aria-valuemax": "100"
            });

            const $progressBar = $('<div>', {
                class: "progress-bar"
            });

            $fill = $('<div>', {
                class: "progress-fill"
            });

            $progressBar.append($fill);
            $container.append($progressBar);
            $('body').prepend($container);
        } else {
            $fill = $container.find(settings.fillSelector);
        }

        if ($fill.length) {
            $fill.css('backgroundColor', settings.color);
        }
        if ($container.length) {
            $container.css('height', settings.height);
        }

        return Boolean($container.length && $fill.length);
    }

    function clearTimers() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        if (animationTimer) {
            clearTimeout(animationTimer);
            animationTimer = null;
        }
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function cleanup() {
        clearTimers();
        isRunning = false;
    }

    function reset() {
        cleanup();

        if ($container.length) {
            $container.addClass("hidden").removeClass("visible");
        }

        if ($fill.length) {
            $fill.css({
                width: "0%",
                transition: "none"
            });
            $fill.attr("aria-valuenow", "0");
        }

        progress = 0;
        isVisible = false;
    }

    function show() {
        if (!$container || !$fill.length) {
            if (!init()) return;
        }

        if (isRunning && isVisible) {
            return;
        }

        reset();
        isRunning = true;
        isVisible = true;

        rafId = requestAnimationFrame(() => {
            if ($fill.length) {
                $fill.css('transition', 'width 0.1s ease-out');
            }

            $container.removeClass("hidden").addClass("visible");

            const motionStyle = prefersReducedMotion() ? settings.reducedMotionStyle : settings.animationStyle;

            switch (motionStyle) {
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
        if (!$container || !$fill.length) return;

        clearTimers();
        isRunning = false;

        $fill.css('transition', 'width 0.2s ease-out');
        progress = 100;
        $fill.css('width', '100%');
        $fill.attr("aria-valuenow", "100");

        hideTimer = setTimeout(() => {
            $container.removeClass("visible");

            setTimeout(() => {
                reset();
            }, settings.fadeOutDuration);
        }, settings.hideDelay);
    }

    function setProgress(value) {
        if (!$fill.length) return;

        progress = Math.max(0, Math.min(value, settings.maximum * 100));
        $fill.css('width', `${progress}%`);
        $fill.attr("aria-valuenow", Math.round(progress).toString());
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

        if ($container.length) {
            $container.css('height', settings.height);
        }

        if ($fill.length) {
            $fill.css('backgroundColor', settings.color);
        }

        return settings;
    }

    function isActive() {
        return isRunning && $container.length && $container.hasClass("visible");
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

    function destroy() {
        cleanup();
        if ($container && $container.length) {
            $container.remove();
        }
        $container = null;
        $fill = null;
        progress = 0;
        isVisible = false;
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
        reset,
        destroy
    };
})();

const PageRouter = {
    pages: {},
    pageConfig: {},
    currentPage: null,
    transitionDuration: 400,
    minLoadingTime: 600,
    isTransitioning: false,
    queuedNavigation: null,
    pendingTimers: [],

    init() {
        ProgressLoader.init();
        this.cacheGlobals();
        this.cachePageElements();
        this.setupEventListeners();
        this.showInitialPage();
    },

    cacheGlobals() {
        this.$window = $(window);
        this.$document = $(document);
        this.$body = $('body');
    },

    cachePageElements() {
        const $allPages = $('.pages[data-page]');

        $allPages.each((_, page) => {
            const $page = $(page);
            const pageName = $page.attr('data-page');
            if (pageName) {
                this.pages[pageName] = $page;
                this.pageConfig[pageName] = {
                    title: $page.attr('data-title') || this.getDefaultTitle(pageName)
                };
                $page.removeClass('hidden spa-hidden spa-page active exit show')
                    .addClass('hide');
            }
        });
    },

    setupEventListeners() {
        this.$window.on('popstate', () => {
            const page = window.location.hash.slice(1) || 'repo';
            this.navigateTo(page, false, { reason: 'popstate' });
        });

        this.$document.on('click', '[data-navigate]', (e) => {
            if (this.isTransitioning) {
                e.preventDefault();
                const targetPage = $(e.currentTarget).attr('data-navigate');
                this.queueNavigation(targetPage, { reason: 'click' });
                return;
            }
            e.preventDefault();
            const targetPage = $(e.currentTarget).attr('data-navigate');
            this.navigateTo(targetPage, true, { reason: 'click' });
        });
    },

    showInitialPage() {
        const initialPage = window.location.hash.slice(1) || 'repo';

        $.each(this.pages, (_, $page) => {
            if ($page) {
                $page.removeClass('show').addClass('hide');
            }
        });

        ProgressLoader.start();

        this.delay(this.minLoadingTime).then(() => {
            const $targetPage = this.pages[initialPage] || this.pages['repo'];
            if ($targetPage && $targetPage.length) {
                $targetPage.removeClass('hide').addClass('show');
                this.currentPage = initialPage in this.pages ? initialPage : 'repo';
                this.updatePageTitle(this.currentPage);
            }
            ProgressLoader.done();
        });
    },

    queueNavigation(pageName, meta) {
        this.queuedNavigation = { pageName, meta };
    },

    cancelPendingTimers() {
        this.pendingTimers.forEach((timer) => clearTimeout(timer));
        this.pendingTimers = [];
    },

    async navigateTo(pageName, updateHistory = true, meta = {}) {
        const $targetPage = this.pages[pageName];
        if (!$targetPage || !$targetPage.length) {
            this.navigateToFallback(pageName, meta);
            return;
        }

        if (this.isTransitioning || this.currentPage === pageName) {
            return;
        }

        const startEvent = $.Event('pageNavigationStart');
        const startDetail = {
            from: this.currentPage,
            to: pageName,
            timestamp: Date.now(),
            reason: meta.reason || 'programmatic'
        };

        this.$document.trigger(startEvent, { detail: startDetail });
        if (startEvent.isDefaultPrevented()) {
            return;
        }

        this.isTransitioning = true;
        this.cancelPendingTimers();
        ProgressLoader.start();

        const startTime = Date.now();

        if (updateHistory && window.location.hash !== '#' + pageName) {
            window.history.pushState({ page: pageName }, '', '#' + pageName);
        }

        const $currentPage = this.pages[this.currentPage];
        if ($currentPage && $currentPage.length) {
            $currentPage.removeClass('show').addClass('hide');
        }

        await this.delay(this.transitionDuration);

        const elapsed = Date.now() - startTime;
        const minimum = this.computeMinimumLoadingTime();
        const remainingDelay = Math.max(0, minimum - elapsed);

        if (remainingDelay > 0) {
            await this.delay(remainingDelay);
        }

        this.$window.scrollTop(0);

        $targetPage.removeClass('hide');
        $targetPage[0].offsetHeight;
        $targetPage.addClass('show');

        const previousPage = this.currentPage;
        this.currentPage = pageName;

        this.updatePageTitle(pageName);

        ProgressLoader.done();

        await this.delay(this.transitionDuration);

        this.$document.trigger('pageNavigationComplete', {
            detail: {
                from: previousPage,
                to: pageName,
                timestamp: Date.now(),
                reason: meta.reason || 'programmatic'
            }
        });

        this.isTransitioning = false;

        if (this.queuedNavigation) {
            const next = this.queuedNavigation;
            this.queuedNavigation = null;
            this.navigateTo(next.pageName, true, next.meta);
        }
    },

    navigateToFallback(requestedPage, meta = {}) {
        const fallback = this.pages['repo'] ? 'repo' : Object.keys(this.pages)[0];
        if (!fallback) {
            console.warn(`Page "${requestedPage}" not found and no fallback available`);
            return;
        }
        this.navigateTo(fallback, true, { ...meta, reason: meta.reason || 'fallback' });
    },

    computeMinimumLoadingTime() {
        return Math.max(this.minLoadingTime, this.transitionDuration);
    },

    delay(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                resolve();
            }, ms);
            this.pendingTimers.push(timer);
        });
    },

    updatePageTitle(pageName) {
        const config = this.pageConfig[pageName];
        document.title = (config && config.title) ? config.title : 'GitDev';
    },

    getDefaultTitle(pageName) {
        const titles = {
            'repo': 'Repositories - GitDev',
            'explorer': 'File Explorer - GitDev',
            'file': 'File Editor - GitDev'
        };
        return titles[pageName] || 'GitDev';
    },

    getPage(pageName) {
        return this.pages[pageName] || null;
    },

    isPageVisible(pageName) {
        const $page = this.pages[pageName];
        return $page ? $page.hasClass('show') : false;
    }
};

const SpaDom = {
    show($el) {
        $el.removeClass('hide').addClass('show');
    },
    hide($el) {
        $el.removeClass('show').addClass('hide');
    }
};

$.fn.spaShow = function(speed = 400, easing = 'swing', callback) {
    return this.each(function() {
        const $this = $(this);
        $this.stop(true, true).css({ opacity: 0, display: 'block' })
            .animate({ opacity: 1 }, speed, easing, callback);
    });
};

$.fn.spaHide = function(speed = 400, easing = 'swing', callback) {
    return this.each(function() {
        const $this = $(this);
        $this.stop(true, true).animate({ opacity: 0 }, speed, easing, function() {
            $this.css('display', 'none');
            if (callback) callback.call(this);
        });
    });
};

$.fn.spaTransition = function(direction = 'forward', speed = 400) {
    return this.each(function() {
        const $this = $(this);
        const offset = direction === 'forward' ? '100%' : '-100%';
        $this.css({
            transform: `translateX(${offset})`,
            opacity: 0,
            display: 'block',
            transition: `all ${speed}ms ease-in-out`
        });

        setTimeout(() => {
            $this.css({
                transform: 'translateX(0)',
                opacity: 1
            });
        }, 50);
    });
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

$(function() {
    PageRouter.init();
});

window.PageRouter = PageRouter;
window.ProgressLoader = ProgressLoader;
window.LoadingProgress = ProgressLoader;
