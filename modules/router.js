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

function updateSelectedTags() {
  const container = document.getElementById('selectedTags');
  if (!container) return;
  container.innerHTML = currentState.selectedTags.map(tag => `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-github-accent-emphasis/20 border border-github-accent-emphasis/30 text-github-accent-fg">
      ${tag}
      <button onclick="removeTag('${tag}')" class="ml-1.5 w-3.5 h-3.5 rounded-full hover:bg-github-accent-emphasis/30 flex items-center justify-center">
        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>
      </button>
    </span>
  `).join('');
}

let lastScrollTop = 0;
let scrollTimeout = null;
const SCROLL_THRESHOLD = 10;

function initScrollBehavior() {
  const breadcrumb = document.getElementById('pathBreadcrumb');
  if (!breadcrumb) return;

  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(scrollTop - lastScrollTop) > SCROLL_THRESHOLD) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          breadcrumb.classList.add('hidden');
        } else {
          breadcrumb.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
      }
    }, 50);
  });
}

function updateBreadcrumb() {
  const breadcrumb = document.getElementById('pathBreadcrumb');
  if (!breadcrumb) return;

  const container = breadcrumb.querySelector('.breadCrumbContainer');
  if (!container) return;

  let html = `
    <span data-navigate="repo" class="breadCrumb">
      Repositories
    </span>
  `;

  if (currentState.repository) {
    html += `
      <div class="navDivider" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M6.22 13.72a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0 0-1.06L7.28 4.22a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L9.94 8l-3.72 3.72a.75.75 0 0 0 0 1.06Z"/>
        </svg>
      </div>
      <span data-navigate="explorer" class="breadCrumb">
        ${currentState.repository}
      </span>
    `;
  }

  if (currentState.path) {
    const segments = currentState.path.split('/');
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += (currentPath ? '/' : '') + segment;
      const isLast = index === segments.length - 1;
      
      html += `
        <div class="navDivider" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M6.22 13.72a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0 0-1.06L7.28 4.22a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L9.94 8l-3.72 3.72a.75.75 0 0 0 0 1.06Z"/>
          </svg>
        </div>
        <span 
           data-navigate-path="${currentPath}"
           class="breadCrumb ${isLast ? 'current' : ''}">
          ${segment}
        </span>
      `;
    });
  }

  container.innerHTML = html;
  
  setupBreadcrumbListeners();
}

function setupBreadcrumbListeners() {
  document.querySelectorAll('[data-navigate-path]').forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      const path = this.getAttribute('data-navigate-path');
      navigateToPath(path);
    });
  });
}

function updateEditorMode(editor, fileName) {
  if (!editor || !fileName) return;
  const ext = fileName.split('.').pop().toLowerCase();
  const modeMap = {
    'js': 'javascript', 'javascript': 'javascript', 'ts': 'javascript', 'typescript': 'javascript',
    'html': 'htmlmixed', 'htm': 'htmlmixed', 'xml': 'xml', 'css': 'css', 'scss': 'css', 'sass': 'css',
    'less': 'css', 'json': 'javascript', 'py': 'python', 'python': 'python', 'php': 'php', 'sql': 'sql',
    'md': 'markdown', 'markdown': 'markdown', 'yml': 'yaml', 'yaml': 'yaml'
  };
  const mode = modeMap[ext] || 'text';
  editor.setOption('mode', mode);
}

function updateCommitMessage() {
  if (!currentState.currentFile) return;
  const commitTitle = document.getElementById('commitTitle');
  if (commitTitle && !commitTitle.value.trim()) {
    commitTitle.value = `Update ${currentState.currentFile.name}`;
  }
}

function renderRepositoryList() {
  const repoList = document.getElementById('repoList');
  if (!repoList) return;
  repoList.innerHTML = '';
  if (currentState.repositories.length === 0) {
    repoList.innerHTML = `<div class="col-span-full text-center py-12"><svg class="w-12 h-12 mx-auto text-github-fg-muted mb-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg><h3 class="text-lg font-medium text-github-fg-default mb-2">No repositories yet</h3><p class="text-github-fg-muted mb-4">Create your first repository to get started</p><button onclick="showCreateRepoModal()" class="inline-flex items-center px-4 py-2 bg-github-btn-primary-bg hover:bg-github-btn-primary-hover text-white rounded-md text-sm font-medium transition-colors"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/></svg>Create repository</button></div>`;
    return;
  }
  currentState.repositories.forEach(repo => {
    const repoCard = document.createElement('div');
    repoCard.className = 'bg-github-canvas-overlay border border-github-border-default rounded-lg p-4 hover:border-github-accent-fg transition-colors cursor-pointer';
    repoCard.innerHTML = `<div class="flex items-start justify-between"><div class="flex-1"><h3 class="text-lg font-semibold text-github-accent-fg mb-1">${repo.name}</h3><p class="text-sm text-github-fg-muted mb-2">${repo.description || 'No description'}</p><div class="flex items-center space-x-4 text-xs text-github-fg-muted"><span>${formatDate(repo.created)}</span><span class="flex items-center space-x-1"><div class="w-3 h-3 rounded-full bg-github-accent-fg"></div><span>${repo.defaultBranch || 'main'}</span></span></div></div><button onclick="event.stopPropagation();deleteRepository('${repo.name}')" class="text-github-danger-fg hover:text-red-500 p-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/></svg></button></div>`;
    repoCard.addEventListener('click', () => window.openRepository(repo.name));
    repoList.appendChild(repoCard);
  });
}

async function renderFileList() {
  const tbody = document.getElementById('fileListBody');
  if (!tbody) return;
  
  tbody.innerHTML = `
  <tr>
    <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
      <div class="animate-pulse">Loading files...</div>
    </td>
  </tr>
  `;
  
  try {
    if (currentState.repository && currentState.repository.id) {
      await IndexedDBStorageManager.ensureInitialized();
      
      currentState.files = await IndexedDBStorageManager.listFiles(
        currentState.repository.id, 
        currentState.path || ''
      );
    } else {
      console.error('No repository selected or repository ID missing');
      currentState.files = [];
    }
    
    tbody.innerHTML = '';
    
    if (currentState.files.length === 0) {
      tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
          <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
          </svg>
          <p>No files in this directory</p>
          <button onclick="showCreateFileModal()" class="mt-2 text-github-accent-fg hover:underline text-sm">
            Create your first file
          </button>
        </td>
      </tr>
      `;
      return;
    }
    
    currentState.files.forEach(file => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-github-canvas-subtle cursor-pointer border-b border-github-border-default transition-colors group';
      
      const fileIconSVG = getFileIcon(file.name, file.type);
      
      row.innerHTML = `
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            ${fileIconSVG}
            <span class="text-github-fg-default font-mono" data-spa-navigate="explorer" href="#explorer">${escapeHTML(file.name)}</span>
          </div>
        </td>
        <td class="py-3 px-4 text-github-fg-muted text-sm">${escapeHTML(file.lastCommit || 'Initial commit')}</td>
        <td class="py-3 px-4 text-github-fg-muted text-sm">${formatDate(file.lastModified)}</td>
        <td class="py-3 px-4 text-right">
          <button 
            class="file-more-menu-btn opacity-0 group-hover:opacity-100 px-2 py-1 rounded transition-all hover:bg-github-canvas-subtle"
            onclick="fileMenuManager.showFileMenu('${escapeHTML(file.name)}', event)"
            data-tooltip="More options"
          >
            <svg class="w-4 h-4 text-github-fg-muted" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
          </button>
        </td>
      `;
      
      row.addEventListener('click', (e) => {
        if (!e.target.closest('.file-more-menu-btn')) {
          window.viewFile(file.name);
        }
      });
      
      row.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        window.showContextMenu(e.clientX, e.clientY, file.name, file.type);
      });
      
      tbody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Error loading files from IndexedDB:', error);
    tbody.innerHTML = `
    <tr>
      <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted text-red-500">
        <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <p>Error loading files</p>
        <p class="text-sm mt-1">${error.message}</p>
        <button onclick="renderFileList()" class="mt-2 text-github-accent-fg hover:underline text-sm">
          Retry
        </button>
      </td>
    </tr>
    `;
  }
}

async function refreshFileList() {
  if (typeof renderFileList === 'function') {
    await renderFileList();
  }
}

async function loadRepository(repoId) {
  const repo = await IndexedDBStorageManager.getRepository(repoId);
  currentState.repository = repo;
  currentState.path = '';
  await refreshFileList();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function displayFileContent(filename, fileData) {
    if (window.coderViewEdit && typeof coderViewEdit.displayFile === 'function') {
        coderViewEdit.displayFile(filename, fileData);
        showFileViewer();
        return;
    }
    
    const currentFileName = document.getElementById('currentFileName');
    const fileLinesCount = document.getElementById('fileLinesCount');
    const fileSize = document.getElementById('fileSize');
    const fileLanguageDisplay = document.getElementById('fileLanguageDisplay');
    const fileCategory = document.getElementById('fileCategory');
    const fileTags = document.getElementById('fileTags');
    
    if (currentFileName) currentFileName.textContent = filename;
    const content = fileData.content || '';
    const lines = content.split('\n');
    const lineCount = lines.length;
    
    if (fileLinesCount) fileLinesCount.textContent = `${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`;
    if (fileSize) fileSize.textContent = formatFileSize(content.length);
    
    const ext = filename.split('.').pop().toLowerCase();
    const language = getLanguageName(ext);
    const prismLang = getPrismLanguage(ext);
    
    if (fileLanguageDisplay) fileLanguageDisplay.textContent = language;
    
    const codeBlock = document.getElementById('codeBlock');
    const lineNumbers = document.getElementById('lineNumbers');
    
    if (codeBlock) {
        codeBlock.textContent = content;
        codeBlock.className = 'code-block';
        codeBlock.classList.add(`language-${prismLang}`);
    }
    
    if (lineNumbers) {
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line-number';
            lineDiv.textContent = i;
            lineNumbers.appendChild(lineDiv);
        }
    }
    
    setTimeout(() => {
        if (window.Prism && codeBlock) {
            try {
                Prism.highlightElement(codeBlock);
            } catch (error) {}
        }
    }, 50);
    
    if (fileCategory) fileCategory.textContent = fileData.category || 'General';
    
    if (fileTags) {
        if (fileData.tags && fileData.tags.length > 0) {
            fileTags.innerHTML = fileData.tags.map(tag => 
                `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-github-accent-emphasis/20 border border-github-accent-emphasis/30 text-github-accent-fg">${tag}</span>`
            ).join('');
        } else {
            fileTags.innerHTML = '<span class="text-github-fg-muted text-sm">No tags</span>';
        }
    }
}

function updateRecentFilesUI() {
  const recentFilesList = document.getElementById('recentFilesList');
  const recentFilesCount = document.getElementById('recentFilesCount');
  const topRecentFilesList = document.getElementById('topRecentFilesList');
  const topRecentFilesCount = document.getElementById('topRecentFilesCount');
  
  if (recentFilesList) {
    if (recentFiles.length === 0) {
      recentFilesList.innerHTML = `
        <div class="text-center py-4 text-github-fg-muted text-sm">
          No recent files
        </div>
      `;
    } else {
      recentFilesList.innerHTML = recentFiles.map(file => `
        <button onclick="openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')" 
                class="w-full flex items-center justify-between p-2 rounded hover:bg-github-canvas-subtle text-left group">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <svg class="w-3 h-3 text-github-fg-muted flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
              </svg>
              <span class="text-sm text-github-fg-default truncate">${file.fileName}</span>
            </div>
            <div class="text-xs text-github-fg-muted truncate mt-1">${file.repoName}</div>
          </div>
          <svg class="w-4 h-4 text-github-fg-muted opacity-0 group-hover:opacity-100 transition-opacity" 
               fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"/>
          </svg>
        </button>
      `).join('');
    }
  }
  
  if (topRecentFilesList) {
    if (recentFiles.length === 0) {
      topRecentFilesList.innerHTML = `
        <div class="text-center py-4 text-github-fg-muted text-sm">
          No recent files
        </div>
      `;
    } else {
      topRecentFilesList.innerHTML = recentFiles.map(file => `
        <button onclick="openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')" 
                class="w-full flex items-center justify-between p-2 rounded hover:bg-github-canvas-subtle text-left group">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <svg class="w-3 h-3 text-github-fg-muted flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
              </svg>
              <span class="text-sm text-github-fg-default truncate">${file.fileName}</span>
            </div>
            <div class="text-xs text-github-fg-muted truncate mt-1">${file.repoName}</div>
          </div>
          <svg class="w-4 h-4 text-github-fg-muted opacity-0 group-hover:opacity-100 transition-opacity" 
               fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"/>
          </svg>
        </button>
      `).join('');
    }
  }
  
  if (recentFilesCount) {
    recentFilesCount.textContent = recentFiles.length.toString();
  }
  if (topRecentFilesCount) {
    topRecentFilesCount.textContent = recentFiles.length.toString();
  }
}

function updateStats() {
  const statsText = document.getElementById('statsText');
  const topStatsText = document.getElementById('topStatsText');
  if ((statsText || topStatsText) && currentState.repository) {
    try {
      const files = LocalStorageManager.listFiles(currentState.repository, '');
      const totalFiles = files.filter(f => f.type === 'file').length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const sizeText = formatFileSize(totalSize);
      const displayText = `${totalFiles} files • ${sizeText}`;
      if (statsText) statsText.textContent = displayText;
      if (topStatsText) topStatsText.textContent = displayText;
    } catch (error) {
      if (statsText) statsText.textContent = '0 files';
      if (topStatsText) topStatsText.textContent = '0 files';
    }
  }
}

function setupEventListeners() {
  const tagInput = document.getElementById('tagInput');
  if (tagInput) tagInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); window.addTag(); }
  });
  const branchSelector = document.getElementById('branchSelector');
  if (branchSelector) branchSelector.addEventListener('click', function(e) {
    e.stopPropagation();
    const branchDropdown = document.getElementById('branchDropdown');
    if (branchDropdown) branchDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', function() {
    const branchDropdown = document.getElementById('branchDropdown');
    if (branchDropdown) branchDropdown.classList.add('hidden');
  });
  const newFileName = document.getElementById('newFileName');
  if (newFileName) newFileName.addEventListener('input', function(e) {
    const fileName = e.target.value;
    if (fileName && initialContentEditor) updateEditorMode(initialContentEditor, fileName);
  });
}

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
    
    if (PageRouter && PageRouter.navigateTo) {
        PageRouter.navigateTo('explorer');
    }
    
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
    
    if (PageRouter && PageRouter.navigateTo) {
        PageRouter.navigateTo('explorer');
    }
    
    const pathPrefix = path ? path + '/' : '';
    
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

document.addEventListener('pageNavigationComplete', function(e) {
  if (e.detail.to === 'explorer') {
    if (typeof updateBreadcrumb === 'function') {
      updateBreadcrumb();
    }
  } else if (e.detail.to === 'repo') {
    const breadcrumb = document.getElementById('pathBreadcrumb');
    if (breadcrumb) {
      const container = breadcrumb.querySelector('.breadCrumbContainer');
      if (container) {
        container.innerHTML = '<span data-navigate="repo" class="breadCrumb current">Repositories</span>';
      }
    }
  }
});

document.addEventListener('repositoryChanged', function(e) {
  if (typeof updateBreadcrumb === 'function') {
    updateBreadcrumb();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  initScrollBehavior();
  
  setTimeout(function() {
    if (typeof updateBreadcrumb === 'function') {
      updateBreadcrumb();
    }
  }, 100);
});

window.addEventListener('stateChanged', function() {
  if (typeof updateBreadcrumb === 'function') {
    updateBreadcrumb();
  }
});

$(function() {
    PageRouter.init();
});

window.refreshFileList = refreshFileList;
window.PageRouter = PageRouter;
window.ProgressLoader = ProgressLoader;
window.LoadingProgress = ProgressLoader;