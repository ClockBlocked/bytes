

/**
function showRepoSelector() {
  const explorerView = document.getElementById("explorerView");
  const fileView = document.getElementById("fileView");
  const repoSelector = document.getElementById("repoSelectorView");
  
  if (explorerView) {
    explorerView.classList.add("blurOUT");
  }
  
  if (fileView) {
    fileView.classList.add("hidden");
    // Also hide the inner pages element
    const filePages = fileView.querySelector('.pages[data-page="file"]');
    if (filePages) filePages.classList.add("hidden");
  }
  
  if (repoSelector) repoSelector.classList.remove("hidden");
  LoadingProgress.show();
  setTimeout(() => LoadingProgress.hide(), 400);
}

function showExplorer() {
  if (!window.currentState || !window.currentState.repository) return;
  const repoSelector = document.getElementById("repoSelectorView");
  const fileView = document.getElementById("fileView");
  const explorerView = document.getElementById("explorerView");
//if (repoSelector) repoSelector.classList.add("hidden");
  if (repoSelector) repoSelector.classList.add("blurOUT");
//if (fileView) fileView.classList.add("hidden");
  if (fileView) fileView.classList.add("blurOUT");
  if (explorerView) {
 // explorerView.classList.remove("hidden");
    explorerView.classList.add("blurIN");
    }
  
  if (typeof updateStats === "function") updateStats();
  LoadingProgress.show();
  setTimeout(() => LoadingProgress.hide(), 300);
}

function showFileViewer() {
  const repoSelector = document.getElementById("repoSelectorView");
  const explorerView = document.getElementById("explorerView");
  const fileView = document.getElementById("fileView");
  
//if (repoSelector) repoSelector.classList.add("hidden");
  if (repoSelector) repoSelector.classList.add("blurOUT");
  
  if (explorerView) {
//  explorerView.classList.add("hidden");
    explorerView.classList.add("blurOUT");
  }
  
  if (fileView) {
//  fileView.classList.remove("hidden");
    fileView.classList.remove("blurOUT");
    fileView.classList.add("blurIN");
    }
    if (window.coderViewEdit && typeof window.coderViewEdit.init === "function" && !window.coderViewEdit.isInitialized) {
      window.coderViewEdit.init();
    }

  LoadingProgress.show();
  setTimeout(() => LoadingProgress.hide(), 300);
}

function showFileEditor() {
  showFileViewer();
}

function navigateToRoot() {
  if (! window.currentState) return;
  window.currentState.path = "";
  if (typeof showLoading === "function") showLoading("Loading repository root...");
  setTimeout(() => {
    try {
      if (typeof LocalStorageManager !== "undefined") {
        window.currentState.files = LocalStorageManager.listFiles(window.currentState.repository, "");
      }
      if (typeof renderFileList === "function") renderFileList();
      if (typeof updateBreadcrumb === "function") updateBreadcrumb();
    } catch (error) {}
    if (typeof hideLoading === "function") hideLoading();
  }, 150);
}

function navigateToPath(path) {
  if (!window.currentState) return;
  window.currentState.path = path;
  if (typeof showLoading === "function") showLoading("Loading directory...");
  setTimeout(() => {
    try {
      const pathPrefix = path ?  path + "/" : "";
      if (typeof LocalStorageManager !== "undefined") {
        window.currentState.files = LocalStorageManager.listFiles(window.currentState.repository, pathPrefix);
      }
      if (typeof renderFileList === "function") renderFileList();
      if (typeof updateBreadcrumb === "function") updateBreadcrumb();
    } catch (error) {}
    if (typeof hideLoading === "function") hideLoading();
  }, 150);
}

function navigateToFolder(folderName) {
  if (!window.currentState) return;
  const newPath = window.currentState.path ?  window.currentState.path + "/" + folderName : folderName;
  navigateToPath(newPath);
}

const LoadingProgress = (() => {
  let progressElement = null;
  let fillElement = null;
  let hideTimeout = null;
  let progressInterval = null;
  let currentProgress = 0;
  let showTime = null;
  let isShowing = false;
  const config = {
    minimum: 0.08,
    maximum:  0.994,
    minDisplayTime: 600
  };
  function init() {
    if (progressElement) return;
    const style = document.createElement("style");
    style.id = "loadingProgressStyles";
    style.textContent = `
      #pageProgress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2.5px;
        z-index: 9999;
        background-color: transparent;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .progress-bar--visible {
        opacity: 1;
      }
      .progress-bar-fill {
        display: block;
        height: 100%;
        width: 0;
        background:  linear-gradient(90deg, #dc2626, #ef4444, #f87171);
        box-shadow: 0 0 10px rgba(220, 38, 38, 0.5), 0 0 20px rgba(220, 38, 38, 0.3);
        transition:  width 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    progressElement = document.createElement("div");
    progressElement.id = "pageProgress";
    fillElement = document.createElement("div");
    fillElement.className = "progress-bar-fill";
    progressElement.appendChild(fillElement);
    document.body.appendChild(progressElement);
  }
  function show() {
    if (! progressElement) init();
    if (isShowing) return;
    isShowing = true;
    clearTimeout(hideTimeout);
    clearTimeout(progressInterval);
    currentProgress = config.minimum * 100;
    showTime = Date.now();
    fillElement.style.transition = "none";
    fillElement.style.width = "0%";
    void fillElement.offsetWidth;
    fillElement.style.transition = "width 0.3s ease-out";
    progressElement.classList.add("gh-progress--visible");
    fillElement.style.width = currentProgress + "%";
    simulateProgress();
  }
  function hide() {
    if (! progressElement || !isShowing) return;
    clearTimeout(progressInterval);
    const elapsed = Date.now() - (showTime || 0);
    const remaining = Math.max(0, config.minDisplayTime - elapsed);
    hideTimeout = setTimeout(() => {
      fillElement.style.width = "100%";
      setTimeout(() => {
        progressElement.classList.remove("gh-progress--visible");
        setTimeout(() => {
          fillElement.style.width = "0%";
          currentProgress = 0;
          showTime = null;
          isShowing = false;
        }, 300);
      }, 150);
    }, remaining);
  }
  function simulateProgress() {
    function update() {
      if (currentProgress >= config.maximum * 100 || ! isShowing) return;
      let increment, delay;
      if (currentProgress < 60) {
        increment = Math.random() * 5 + 3;
        delay = Math.random() * 60 + 20;
      } else if (currentProgress < 90) {
        increment = Math.random() * 2 + 1;
        delay = Math.random() * 250 + 150;
      } else {
        increment = Math.random() * 0.5 + 0.3;
        delay = Math.random() * 500 + 500;
      }
      currentProgress = Math.min(config.maximum * 100, currentProgress + increment);
      fillElement.style.width = currentProgress + "%";
      progressInterval = setTimeout(update, delay);
    }
    update();
  }
  function isVisible() {
    return isShowing;
  }
  return { show, hide, isVisible };
})();

const LoadingSpinner = (() => {
  let spinnerElement = null;
  let hideTimeout = null;
  let isActive = false;
  let showTime = null;
  const config = {
    fadeDuration: 300,
    minDisplayTime: 600,
    selector: "#loadingSpinner"
  };
  function init(selector) {
    if (selector) config.selector = selector;
    spinnerElement = document.querySelector(config.selector);
    return !!spinnerElement;
  }
  function show() {
    if (!spinnerElement && !init()) return;
    clearTimeout(hideTimeout);
    isActive = true;
    showTime = Date.now();
    spinnerElement.setAttribute("data-active", "true");
  }
  function hide() {
    if (!spinnerElement || !isActive) return;
    const elapsed = Date.now() - (showTime || 0);
    const remaining = Math.max(0, config.minDisplayTime - elapsed);
    hideTimeout = setTimeout(() => {
      isActive = false;
      showTime = null;
      if (spinnerElement) spinnerElement.setAttribute("data-active", "false");
    }, remaining);
  }
  function toggle() {
    isActive ?  hide() : show();
  }
  function isVisible() {
    return isActive;
  }
  function configure(options) {
    Object.assign(config, options);
  }
  function destroy() {
    clearTimeout(hideTimeout);
    if (spinnerElement) spinnerElement.setAttribute("data-active", "false");
    spinnerElement = null;
    isActive = false;
    showTime = null;
  }
  return { init, show, hide, toggle, isVisible, configure, destroy };
})();

window.LoadingProgress = LoadingProgress;
window.LoadingSpinner = LoadingSpinner;
window.showRepoSelector = showRepoSelector;
window.showExplorer = showExplorer;
window.showFileViewer = showFileViewer;
window.showFileEditor = showFileEditor;
window.navigateToRoot = navigateToRoot;
window.navigateToPath = navigateToPath;
window.navigateToFolder = navigateToFolder;
**/



        // Modern JavaScript Module Pattern
        const AppState = (() => {
            let state = {
                currentView: 'repo',
                repository: null,
                path: '',
                files: [],
                history: []
            };

            const subscribers = new Set();

            const update = (newState) => {
                const oldState = { ...state };
                state = { ...state, ...newState };
                
                // Notify subscribers
                subscribers.forEach(callback => callback(state, oldState));
                
                return state;
            };

            const get = () => ({ ...state });

            const subscribe = (callback) => {
                subscribers.add(callback);
                return () => subscribers.delete(callback);
            };

            const pushHistory = (view) => {
                state.history.push(state.currentView);
                update({ currentView: view });
            };

            const popHistory = () => {
                if (state.history.length > 0) {
                    const previousView = state.history.pop();
                    update({ currentView: previousView });
                }
            };

            return {
                update,
                get,
                subscribe,
                pushHistory,
                popHistory
            };
        })();

        // View Manager
        const ViewManager = (() => {
            const views = new Map();
            let currentView = null;

            const register = (id, element) => {
                views.set(id, element);
                return {
                    show: () => transitionTo(id),
                    hide: () => hideView(id)
                };
            };

            const transitionTo = (viewId) => {
                if (!views.has(viewId)) {
                    console.error(`View "${viewId}" not found`);
                    return;
                }

                const targetView = views.get(viewId);
                
                // Exit current view
                if (currentView) {
                    currentView.classList.remove('view--active');
                    currentView.classList.add('view--exiting');
                    currentView.setAttribute('hidden', '');
                    
                    setTimeout(() => {
                        currentView.classList.remove('view--exiting');
                    }, 400);
                }

                // Enter target view
                targetView.classList.add('view--entering');
                targetView.removeAttribute('hidden');
                
                setTimeout(() => {
                    targetView.classList.remove('view--entering');
                    targetView.classList.add('view--active');
                    currentView = targetView;
                    
                    // Announce view change for screen readers
                    const viewName = targetView.getAttribute('aria-label') || 'View';
                    announce(`${viewName} loaded`);
                }, 50);
            };

            const hideView = (viewId) => {
                const view = views.get(viewId);
                if (view) {
                    view.classList.remove('view--active');
                    view.classList.add('view--exiting');
                    view.setAttribute('hidden', '');
                    
                    setTimeout(() => {
                        view.classList.remove('view--exiting');
                    }, 400);
                }
            };

            const getCurrentView = () => currentView?.id;

            return {
                register,
                transitionTo,
                hideView,
                getCurrentView
            };
        })();

        // Navigation Controller
        const Navigation = (() => {
            const navigate = (destination, data = {}) => {
                LoadingIndicator.show();
                AppState.pushHistory(destination);

                switch(destination) {
                    case 'repo':
                        showRepositoryView();
                        break;
                    case 'explorer':
                        showExplorerView(data.repository);
                        break;
                    case 'file':
                        showFileView(data.filePath);
                        break;
                    default:
                        console.error(`Unknown destination: ${destination}`);
                }

                setTimeout(() => LoadingIndicator.hide(), 300);
            };

            const navigateBack = () => {
                AppState.popHistory();
                const state = AppState.get();
                navigate(state.currentView);
            };

            const showRepositoryView = () => {
                ViewManager.transitionTo('repoView');
                // Additional repository view logic here
            };

            const showExplorerView = (repository) => {
                if (!repository) return;
                
                AppState.update({ repository, path: '' });
                ViewManager.transitionTo('explorerView');
                
                // Load and render file list
                setTimeout(() => {
                    const files = LocalStorageManager?.listFiles(repository, '') || [];
                    AppState.update({ files });
                    renderFileList();
                    updateBreadcrumb();
                }, 150);
            };

            const showFileView = (filePath) => {
                ViewManager.transitionTo('fileView');
                
                // Initialize editor if needed
                if (window.coderViewEdit && typeof window.coderViewEdit.init === 'function') {
                    window.coderViewEdit.init();
                }
            };

            const navigateToPath = (path) => {
                LoadingIndicator.show();
                
                setTimeout(() => {
                    const state = AppState.get();
                    const pathPrefix = path ? `${path}/` : '';
                    
                    try {
                        const files = LocalStorageManager?.listFiles(state.repository, pathPrefix) || [];
                        AppState.update({ path, files });
                        
                        if (typeof renderFileList === 'function') renderFileList();
                        if (typeof updateBreadcrumb === 'function') updateBreadcrumb();
                    } catch (error) {
                        console.error('Error loading path:', error);
                    } finally {
                        LoadingIndicator.hide();
                    }
                }, 150);
            };

            return {
                navigate,
                navigateBack,
                navigateToPath,
                navigateToFolder: (folderName) => {
                    const state = AppState.get();
                    const newPath = state.path ? `${state.path}/${folderName}` : folderName;
                    navigateToPath(newPath);
                },
                navigateToRoot: () => navigateToPath('')
            };
        })();

        // Loading Indicator
        const LoadingIndicator = (() => {
            let progressBar;
            let progressFill;
            let spinner;
            let progressInterval;
            let currentProgress = 0;
            let isVisible = false;
            
            const config = {
                minProgress: 0.1,
                maxProgress: 0.95,
                minDuration: 400,
                maxDuration: 2000,
                progressIncrement: 0.03,
                spinnerDelay: 100
            };

            const init = () => {
                progressBar = document.getElementById('loadingProgress');
                progressFill = progressBar.querySelector('.loading-progress__fill');
                spinner = document.getElementById('loadingOverlay');
            };

            const show = () => {
                if (!progressBar) init();
                if (isVisible) return;

                isVisible = true;
                currentProgress = config.minProgress;
                
                // Show progress bar
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
                void progressFill.offsetWidth; // Force reflow
                progressFill.style.transition = '';
                
                progressBar.classList.add('loading-progress--visible');
                progressFill.style.width = `${currentProgress * 100}%`;
                
                // Simulate progress
                simulateProgress();
                
                // Show spinner after delay
                setTimeout(() => {
                    if (isVisible) {
                        spinner.classList.add('loading-spinner--visible');
                    }
                }, config.spinnerDelay);
            };

            const hide = () => {
                if (!isVisible) return;
                
                clearInterval(progressInterval);
                
                // Complete progress
                progressFill.style.width = '100%';
                
                // Hide after animation completes
                setTimeout(() => {
                    progressBar.classList.remove('loading-progress--visible');
                    spinner.classList.remove('loading-spinner--visible');
                    
                    setTimeout(() => {
                        progressFill.style.width = '0%';
                        currentProgress = 0;
                        isVisible = false;
                    }, 300);
                }, 150);
            };

            const simulateProgress = () => {
                clearInterval(progressInterval);
                
                progressInterval = setInterval(() => {
                    if (currentProgress >= config.maxProgress) {
                        clearInterval(progressInterval);
                        return;
                    }
                    
                    // Slow down as we approach max
                    const remaining = config.maxProgress - currentProgress;
                    const increment = Math.min(config.progressIncrement, remaining * 0.5);
                    
                    currentProgress += increment;
                    progressFill.style.width = `${currentProgress * 100}%`;
                }, 50);
            };

            return { show, hide };
        })();

        // Accessibility Utilities
        const Accessibility = (() => {
            const announce = (message, priority = 'polite') => {
                const announcer = document.getElementById('live-announcer') || createAnnouncer();
                announcer.setAttribute('aria-live', priority);
                announcer.textContent = message;
                
                // Clear message after announcement
                setTimeout(() => {
                    announcer.textContent = '';
                }, 1000);
            };

            const createAnnouncer = () => {
                const announcer = document.createElement('div');
                announcer.id = 'live-announcer';
                announcer.className = 'visually-hidden';
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                document.body.appendChild(announcer);
                return announcer;
            };

            const focusViewHeader = (viewId) => {
                const view = document.getElementById(viewId);
                const header = view?.querySelector('h1');
                if (header) {
                    header.setAttribute('tabindex', '-1');
                    header.focus();
                }
            };

            return { announce, focusViewHeader };
        })();

        // Initialize Application
        document.addEventListener('DOMContentLoaded', () => {
            // Register views
            ViewManager.register('repoView', document.getElementById('repoView'));
            ViewManager.register('explorerView', document.getElementById('explorerView'));
            ViewManager.register('fileView', document.getElementById('fileView'));
            
            // Initialize loading indicator
            LoadingIndicator.show();
            
            // Simulate initial load
            setTimeout(() => {
                LoadingIndicator.hide();
                Accessibility.announce('Application ready');
            }, 800);
            
            // Set up state subscriptions
            AppState.subscribe((state, oldState) => {
                if (state.currentView !== oldState.currentView) {
                    Accessibility.focusViewHeader(`${state.currentView}View`);
                }
            });
        });

        // Public API
        window.App = {
            State: AppState,
            Navigation,
            ViewManager,
            LoadingIndicator,
            Accessibility
        };

        // Legacy API compatibility (optional - can be phased out)
        window.showRepoSelector = () => Navigation.navigate('repo');
        window.showExplorer = () => Navigation.navigate('explorer');
        window.showFileViewer = () => Navigation.navigate('file');
        window.showFileEditor = window.showFileViewer;
        window.navigateToRoot = Navigation.navigateToRoot;
        window.navigateToPath = Navigation.navigateToPath;
        window.navigateToFolder = Navigation.navigateToFolder;
        window.LoadingProgress = LoadingIndicator;