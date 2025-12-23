

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


// Loading Progress Controller
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
    maximum: 0.994,
    minDisplayTime: 600,
    animationDuration: 300,
    fastIncrement: { min: 3, max: 8, delay: 20 },
    mediumIncrement: { min: 1, max: 3, delay: 150 },
    slowIncrement: { min: 0.3, max: 0.8, delay: 500 },
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
        height: 3px;
        z-index: 9999;
        background-color: transparent;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${config.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      #pageProgress.visible {
        opacity: 1;
      }
      .progress-bar-fill {
        display: block;
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #dc2626, #ef4444, #f87171);
        background-size: 200% 100%;
        box-shadow: 0 0 10px rgba(220, 38, 38, 0.5), 0 0 20px rgba(220, 38, 38, 0.3);
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: loadingShimmer 2s infinite linear;
      }
      @keyframes loadingShimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `;
    document.head.appendChild(style);

    progressElement = document.createElement("div");
    progressElement.id = "pageProgress";
    progressElement.setAttribute("aria-hidden", "true");

    fillElement = document.createElement("div");
    fillElement.className = "progress-bar-fill";
    progressElement.appendChild(fillElement);

    document.body.appendChild(progressElement);

    // Listen for system events
    document.addEventListener("viewTransitionStart", handleViewTransitionStart);
    document.addEventListener("viewTransitionEnd", handleViewTransitionEnd);
  }

  function handleViewTransitionStart() {
    if (isShowing) return;
    show();
  }

  function handleViewTransitionEnd() {
    if (!isShowing) return;
    hide();
  }

  function show() {
    if (!progressElement) init();
    if (isShowing) return;

    isShowing = true;
    clearTimeout(hideTimeout);
    clearInterval(progressInterval);

    currentProgress = config.minimum * 100;
    showTime = Date.now();

    // Reset animation
    fillElement.style.transition = "none";
    fillElement.style.width = "0%";
    void fillElement.offsetWidth; // Force reflow
    fillElement.style.transition = `width 0.3s cubic-bezier(0.4, 0, 0.2, 1)`;

    progressElement.classList.add("visible");
    fillElement.style.width = currentProgress + "%";

    simulateProgress();

    // Dispatch custom event
    const event = new CustomEvent("loadingProgressShow", { detail: { timestamp: Date.now() } });
    document.dispatchEvent(event);
  }

  function hide() {
    if (!progressElement || !isShowing) return;

    clearInterval(progressInterval);

    const elapsed = Date.now() - (showTime || 0);
    const remaining = Math.max(0, config.minDisplayTime - elapsed);

    hideTimeout = setTimeout(() => {
      // Complete to 100%
      fillElement.style.width = "100%";

      setTimeout(() => {
        progressElement.classList.remove("visible");

        setTimeout(() => {
          fillElement.style.width = "0%";
          currentProgress = 0;
          showTime = null;
          isShowing = false;

          // Dispatch custom event
          const event = new CustomEvent("loadingProgressHide", { detail: { timestamp: Date.now() } });
          document.dispatchEvent(event);
        }, config.animationDuration);
      }, 150);
    }, remaining);
  }

  function simulateProgress() {
    function update() {
      if (currentProgress >= config.maximum * 100 || !isShowing) return;

      let increment, delay;

      if (currentProgress < 60) {
        increment = Math.random() * (config.fastIncrement.max - config.fastIncrement.min) + config.fastIncrement.min;
        delay = Math.random() * 60 + config.fastIncrement.delay;
      } else if (currentProgress < 90) {
        increment =
          Math.random() * (config.mediumIncrement.max - config.mediumIncrement.min) + config.mediumIncrement.min;
        delay = Math.random() * 250 + config.mediumIncrement.delay;
      } else {
        increment = Math.random() * (config.slowIncrement.max - config.slowIncrement.min) + config.slowIncrement.min;
        delay = Math.random() * 500 + config.slowIncrement.delay;
      }

      currentProgress = Math.min(config.maximum * 100, currentProgress + increment);
      fillElement.style.width = currentProgress + "%";

      // Dispatch progress update event
      const event = new CustomEvent("loadingProgressUpdate", {
        detail: {
          progress: currentProgress,
          percentage: (currentProgress / 100).toFixed(2),
        },
      });
      document.dispatchEvent(event);

      progressInterval = setTimeout(update, delay);
    }

    update();
  }

  function setProgress(percentage) {
    if (!progressElement || !isShowing) return;

    clearInterval(progressInterval);
    currentProgress = Math.min(100, Math.max(0, percentage * 100));
    fillElement.style.width = currentProgress + "%";

    if (currentProgress >= config.maximum * 100) {
      setTimeout(() => hide(), 100);
    }
  }

  function reset() {
    clearTimeout(hideTimeout);
    clearInterval(progressInterval);

    if (progressElement) {
      progressElement.classList.remove("visible");
      fillElement.style.width = "0%";
    }

    currentProgress = 0;
    showTime = null;
    isShowing = false;
  }

  function isVisible() {
    return isShowing;
  }

  function getProgress() {
    return currentProgress / 100;
  }

  function configure(newConfig) {
    Object.assign(config, newConfig);
  }

  function destroy() {
    clearTimeout(hideTimeout);
    clearInterval(progressInterval);

    if (progressElement && progressElement.parentNode) {
      progressElement.parentNode.removeChild(progressElement);
    }

    const style = document.getElementById("loadingProgressStyles");
    if (style) style.remove();

    progressElement = null;
    fillElement = null;
    currentProgress = 0;
    showTime = null;
    isShowing = false;

    document.removeEventListener("viewTransitionStart", handleViewTransitionStart);
    document.removeEventListener("viewTransitionEnd", handleViewTransitionEnd);
  }

  return {
    init,
    show,
    hide,
    setProgress,
    reset,
    isVisible,
    getProgress,
    configure,
    destroy,
  };
})();

// Loading Spinner Controller
const LoadingSpinner = (() => {
  let spinnerElement = null;
  let hideTimeout = null;
  let isActive = false;
  let showTime = null;
  let spinnerStyle = null;

  const config = {
    fadeDuration: 300,
    minDisplayTime: 600,
    selector: "#loadingSpinner",
    spinnerColor: "#667eea",
    spinnerSize: 48,
  };

  function init(selector) {
    if (selector) config.selector = selector;

    spinnerElement = document.querySelector(config.selector);

    if (!spinnerElement) {
      createSpinnerElement();
    } else {
      injectStyles();
    }

    spinnerElement.setAttribute("aria-live", "polite");
    spinnerElement.setAttribute("aria-label", "Loading, please wait");

    // Listen for system events
    document.addEventListener("spinnerShow", handleSpinnerShow);
    document.addEventListener("spinnerHide", handleSpinnerHide);

    return !!spinnerElement;
  }

  function createSpinnerElement() {
    spinnerElement = document.createElement("div");
    spinnerElement.id = "loadingSpinner";
    spinnerElement.className = "loading-spinner";
    spinnerElement.innerHTML = `
      <div class="spinner-circle"></div>
      <span class="spinner-text">Loading...</span>
    `;

    document.body.appendChild(spinnerElement);
    injectStyles();
  }

  function injectStyles() {
    if (spinnerStyle) return;

    spinnerStyle = document.createElement("style");
    spinnerStyle.textContent = `
      #loadingSpinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        pointer-events: none;
        transition: opacity ${config.fadeDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      #loadingSpinner[data-active="true"] {
        opacity: 1;
      }
      .spinner-circle {
        width: ${config.spinnerSize}px;
        height: ${config.spinnerSize}px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-top-color: ${config.spinnerColor};
        border-radius: 50%;
        animation: spinnerRotate 1s linear infinite;
      }
      .spinner-text {
        color: #666;
        font-size: 0.875rem;
        font-weight: 500;
      }
      @keyframes spinnerRotate {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);
  }

  function handleSpinnerShow() {
    if (isActive) return;
    show();
  }

  function handleSpinnerHide() {
    if (!isActive) return;
    hide();
  }

  function show() {
    if (!spinnerElement && !init()) return;

    clearTimeout(hideTimeout);
    isActive = true;
    showTime = Date.now();

    spinnerElement.setAttribute("data-active", "true");

    // Dispatch custom event
    const event = new CustomEvent("loadingSpinnerShow", { detail: { timestamp: Date.now() } });
    document.dispatchEvent(event);
  }

  function hide() {
    if (!spinnerElement || !isActive) return;

    const elapsed = Date.now() - (showTime || 0);
    const remaining = Math.max(0, config.minDisplayTime - elapsed);

    hideTimeout = setTimeout(() => {
      isActive = false;
      showTime = null;
      spinnerElement.setAttribute("data-active", "false");

      // Dispatch custom event
      const event = new CustomEvent("loadingSpinnerHide", { detail: { timestamp: Date.now() } });
      document.dispatchEvent(event);
    }, remaining);
  }

  function toggle() {
    isActive ? hide() : show();
  }

  function isVisible() {
    return isActive;
  }

  function configure(options) {
    Object.assign(config, options);

    if (spinnerStyle && spinnerStyle.parentNode) {
      spinnerStyle.remove();
      spinnerStyle = null;
    }

    if (spinnerElement) {
      injectStyles();
    }
  }

  function setMessage(message) {
    if (!spinnerElement) return;

    const textElement = spinnerElement.querySelector(".spinner-text");
    if (textElement) {
      textElement.textContent = message;
    }
  }

  function destroy() {
    clearTimeout(hideTimeout);

    if (spinnerElement) {
      spinnerElement.setAttribute("data-active", "false");

      if (spinnerElement.parentNode && spinnerElement.id === "loadingSpinner") {
        spinnerElement.parentNode.removeChild(spinnerElement);
      }
    }

    if (spinnerStyle && spinnerStyle.parentNode) {
      spinnerStyle.remove();
    }

    spinnerElement = null;
    spinnerStyle = null;
    isActive = false;
    showTime = null;

    document.removeEventListener("spinnerShow", handleSpinnerShow);
    document.removeEventListener("spinnerHide", handleSpinnerHide);
  }

  return {
    init,
    show,
    hide,
    toggle,
    isVisible,
    configure,
    setMessage,
    destroy,
  };
})();

// View Transition Manager
const ViewManager = (() => {
  const views = new Map();
  let currentView = null;
  let transitionInProgress = false;

  const config = {
    animationDuration: 1200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    enableSmoothTransitions: true,
  };

  function registerView(viewId, element) {
    if (!element) {
      element = document.getElementById(viewId);
    }

    if (!element) {
      console.warn(`View element "${viewId}" not found`);
      return null;
    }

    views.set(viewId, element);

    // Add transition classes
    element.classList.add("transition-view");

    return {
      show: () => showView(viewId),
      hide: () => hideView(viewId),
      element: element,
    };
  }

  function showView(viewId, options = {}) {
    if (transitionInProgress) {
      console.warn("View transition already in progress");
      return Promise.reject("Transition in progress");
    }

    if (!views.has(viewId)) {
      const element = document.getElementById(viewId);
      if (!element) {
        console.error(`View "${viewId}" not found`);
        return Promise.reject("View not found");
      }
      registerView(viewId, element);
    }

    const targetView = views.get(viewId);

    // Start transition
    transitionInProgress = true;
    document.dispatchEvent(
      new CustomEvent("viewTransitionStart", {
        detail: { from: currentView, to: viewId },
      })
    );

    // Hide current view if exists
    const hidePromise = currentView ? hideView(currentView) : Promise.resolve();

    return hidePromise.then(() => {
      return new Promise((resolve) => {
        // Show target view
        targetView.classList.remove("hidden");
        targetView.classList.remove("blurOUT");

        if (config.enableSmoothTransitions) {
          targetView.classList.add("blurIN");

          setTimeout(() => {
            targetView.classList.remove("blurIN");
            currentView = viewId;
            transitionInProgress = false;

            document.dispatchEvent(
              new CustomEvent("viewTransitionEnd", {
                detail: { from: currentView, to: viewId },
              })
            );

            document.dispatchEvent(
              new CustomEvent("viewChanged", {
                detail: { viewId, element: targetView },
              })
            );

            // Focus management for accessibility
            manageFocus(targetView);

            resolve({ viewId, element: targetView });
          }, config.animationDuration);
        } else {
          targetView.style.opacity = "1";
          targetView.style.filter = "blur(0)";
          targetView.style.transform = "scale(1)";
          currentView = viewId;
          transitionInProgress = false;

          document.dispatchEvent(
            new CustomEvent("viewChanged", {
              detail: { viewId, element: targetView },
            })
          );

          manageFocus(targetView);
          resolve({ viewId, element: targetView });
        }
      });
    });
  }

  function hideView(viewId) {
    if (!views.has(viewId)) {
      console.warn(`View "${viewId}" not registered`);
      return Promise.resolve();
    }

    const view = views.get(viewId);

    return new Promise((resolve) => {
      if (config.enableSmoothTransitions) {
        view.classList.add("blurOUT");
        view.classList.remove("blurIN");

        setTimeout(() => {
          view.classList.add("hidden");
          view.classList.remove("blurOUT");
          resolve();
        }, config.animationDuration);
      } else {
        view.classList.add("hidden");
        resolve();
      }
    });
  }

  function manageFocus(element) {
    // Find first focusable element or set focus to main heading
    const focusable = element.querySelector('[autofocus], h1, [role="main"]');
    if (focusable) {
      focusable.setAttribute("tabindex", "-1");
      focusable.focus();
    }
  }

  function getCurrentView() {
    return currentView;
  }

  function getAllViews() {
    return Array.from(views.keys());
  }

  function isViewVisible(viewId) {
    const view = views.get(viewId);
    return view && !view.classList.contains("hidden");
  }

  function configure(newConfig) {
    Object.assign(config, newConfig);
  }

  function destroy() {
    views.clear();
    currentView = null;
    transitionInProgress = false;
  }

  return {
    registerView,
    showView,
    hideView,
    getCurrentView,
    getAllViews,
    isViewVisible,
    configure,
    destroy,
  };
})();

// Navigation Controller (Enhanced)
function showRepoSelector() {
  const explorerView = document.getElementById("explorerView");
  const fileView = document.getElementById("fileView");
  const repoSelector = document.getElementById("repoSelectorView");

  LoadingProgress.show();

  // Dispatch navigation events
  document.dispatchEvent(
    new CustomEvent("navigationStart", {
      detail: { from: "explorer/file", to: "repo" },
    })
  );

  const promises = [];

  if (explorerView && !explorerView.classList.contains("hidden")) {
    explorerView.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          explorerView.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (fileView && !fileView.classList.contains("hidden")) {
    fileView.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          fileView.classList.add("hidden");
          const filePages = fileView.querySelector('.pages[data-page="file"]');
          if (filePages) filePages.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (repoSelector) {
    repoSelector.classList.remove("hidden");
    repoSelector.classList.remove("blurOUT");
    repoSelector.classList.add("blurIN");
  }

  Promise.all(promises).then(() => {
    LoadingProgress.hide();

    document.dispatchEvent(
      new CustomEvent("navigationComplete", {
        detail: { view: "repo" },
      })
    );

    document.dispatchEvent(new CustomEvent("repoViewShown"));

    // Update state if exists
    if (window.appState) {
      window.appState.currentView = "repo";
    }
  });
}

function showExplorer() {
  if (!window.currentState || !window.currentState.repository) {
    console.warn("No repository selected");
    return;
  }

  const repoSelector = document.getElementById("repoSelectorView");
  const fileView = document.getElementById("fileView");
  const explorerView = document.getElementById("explorerView");

  LoadingProgress.show();

  document.dispatchEvent(
    new CustomEvent("navigationStart", {
      detail: { from: "repo/file", to: "explorer" },
    })
  );

  const promises = [];

  if (repoSelector && !repoSelector.classList.contains("hidden")) {
    repoSelector.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          repoSelector.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (fileView && !fileView.classList.contains("hidden")) {
    fileView.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          fileView.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (explorerView) {
    explorerView.classList.remove("hidden");
    explorerView.classList.remove("blurOUT");
    explorerView.classList.add("blurIN");

    // Ensure proper display
    setTimeout(() => {
      explorerView.style.opacity = "1";
      explorerView.style.pointerEvents = "all";
    }, 50);
  }

  Promise.all(promises).then(() => {
    LoadingProgress.hide();

    if (typeof updateStats === "function") updateStats();

    document.dispatchEvent(
      new CustomEvent("navigationComplete", {
        detail: { view: "explorer" },
      })
    );

    document.dispatchEvent(
      new CustomEvent("explorerViewShown", {
        detail: { repository: window.currentState.repository },
      })
    );

    // Update state
    if (window.appState) {
      window.appState.currentView = "explorer";
    }

    // Update breadcrumb if exists
    if (window.currentState && typeof updateBreadcrumb === "function") {
      updateBreadcrumb();
    }
  });
}

function showFileViewer() {
  const repoSelector = document.getElementById("repoSelectorView");
  const explorerView = document.getElementById("explorerView");
  const fileView = document.getElementById("fileView");

  LoadingProgress.show();

  document.dispatchEvent(
    new CustomEvent("navigationStart", {
      detail: { from: "repo/explorer", to: "file" },
    })
  );

  const promises = [];

  if (repoSelector && !repoSelector.classList.contains("hidden")) {
    repoSelector.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          repoSelector.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (explorerView && !explorerView.classList.contains("hidden")) {
    explorerView.classList.add("blurOUT");
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          explorerView.classList.add("hidden");
          resolve();
        }, 1200);
      })
    );
  }

  if (fileView) {
    fileView.classList.remove("hidden");
    fileView.classList.remove("blurOUT");
    fileView.classList.add("blurIN");

    // Show file pages
    const filePages = fileView.querySelector('.pages[data-page="file"]');
    if (filePages) filePages.classList.remove("hidden");
  }

  Promise.all(promises).then(() => {
    LoadingProgress.hide();

    // Initialize editor if needed
    if (window.coderViewEdit && typeof window.coderViewEdit.init === "function") {
      if (!window.coderViewEdit.isInitialized) {
        window.coderViewEdit.init();
      }
    }

    document.dispatchEvent(
      new CustomEvent("navigationComplete", {
        detail: { view: "file" },
      })
    );

    document.dispatchEvent(new CustomEvent("fileViewShown"));

    // Update state
    if (window.appState) {
      window.appState.currentView = "file";
    }
  });
}

function showFileEditor() {
  showFileViewer();

  // Additional editor-specific logic
  document.dispatchEvent(new CustomEvent("editorModeActivated"));

  if (window.coderViewEdit && typeof window.coderViewEdit.enableEditing === "function") {
    window.coderViewEdit.enableEditing();
  }
}

// Navigation Functions (Enhanced)
function navigateToRoot() {
  if (!window.currentState) {
    console.error("No current state available");
    return;
  }

  window.currentState.path = "";

  // Show loading indicator
  LoadingSpinner.show();
  LoadingSpinner.setMessage("Loading repository root...");

  // Dispatch event
  document.dispatchEvent(
    new CustomEvent("navigationPathChange", {
      detail: { path: "", type: "root" },
    })
  );

  setTimeout(() => {
    try {
      if (typeof LocalStorageManager !== "undefined") {
        window.currentState.files = LocalStorageManager.listFiles(window.currentState.repository, "");
      }

      // Update UI
      if (typeof renderFileList === "function") renderFileList();
      if (typeof updateBreadcrumb === "function") updateBreadcrumb();
      if (typeof updateStats === "function") updateStats();

      // Dispatch completion event
      document.dispatchEvent(
        new CustomEvent("navigationPathComplete", {
          detail: { path: "", fileCount: window.currentState.files?.length || 0 },
        })
      );
    } catch (error) {
      console.error("Error navigating to root:", error);
      document.dispatchEvent(
        new CustomEvent("navigationError", {
          detail: { error, path: "", operation: "navigateToRoot" },
        })
      );
    } finally {
      LoadingSpinner.hide();
    }
  }, 150);
}

function navigateToPath(path) {
  if (!window.currentState) {
    console.error("No current state available");
    return;
  }

  window.currentState.path = path;

  // Show loading indicator
  LoadingSpinner.show();
  LoadingSpinner.setMessage("Loading directory...");

  document.dispatchEvent(
    new CustomEvent("navigationPathChange", {
      detail: { path, type: "directory" },
    })
  );

  setTimeout(() => {
    try {
      const pathPrefix = path ? path + "/" : "";

      if (typeof LocalStorageManager !== "undefined") {
        window.currentState.files = LocalStorageManager.listFiles(window.currentState.repository, pathPrefix);
      }

      // Update UI
      if (typeof renderFileList === "function") renderFileList();
      if (typeof updateBreadcrumb === "function") updateBreadcrumb();

      document.dispatchEvent(
        new CustomEvent("navigationPathComplete", {
          detail: { path, fileCount: window.currentState.files?.length || 0 },
        })
      );
    } catch (error) {
      console.error("Error navigating to path:", error);
      document.dispatchEvent(
        new CustomEvent("navigationError", {
          detail: { error, path, operation: "navigateToPath" },
        })
      );
    } finally {
      LoadingSpinner.hide();
    }
  }, 150);
}

function navigateToFolder(folderName) {
  if (!window.currentState) {
    console.error("No current state available");
    return;
  }

  const newPath = window.currentState.path ? window.currentState.path + "/" + folderName : folderName;

  document.dispatchEvent(
    new CustomEvent("folderNavigation", {
      detail: { folderName, fromPath: window.currentState.path, toPath: newPath },
    })
  );

  navigateToPath(newPath);
}

// Back Navigation
function navigateBack() {
  if (!window.currentState) return;

  const pathParts = window.currentState.path.split("/").filter(Boolean);
  if (pathParts.length > 0) {
    pathParts.pop();
    const newPath = pathParts.join("/");
    navigateToPath(newPath);

    document.dispatchEvent(
      new CustomEvent("navigationBack", {
        detail: { from: window.currentState.path, to: newPath },
      })
    );
  } else {
    navigateToRoot();
  }
}

// Refresh current view
function refreshCurrentView() {
  if (!window.currentState) return;

  const currentView = document.querySelector(".view:not(.hidden)");
  if (!currentView) return;

  LoadingProgress.show();

  document.dispatchEvent(
    new CustomEvent("viewRefresh", {
      detail: { viewId: currentView.id },
    })
  );

  setTimeout(() => {
    if (currentView.id === "explorerView" && window.currentState.path !== undefined) {
      navigateToPath(window.currentState.path);
    } else if (currentView.id === "repoSelectorView") {
      // Refresh repository list if needed
      if (typeof refreshRepositories === "function") {
        refreshRepositories();
      }
    }

    LoadingProgress.hide();
  }, 300);
}

// Initialize all components
function initializeAppComponents() {
  // Initialize loading components
  LoadingProgress.init();
  LoadingSpinner.init();

  // Initialize ViewManager and register views
  ViewManager.registerView("repoSelectorView");
  ViewManager.registerView("explorerView");
  ViewManager.registerView("fileView");

  // Set up global error handling
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handlePromiseRejection);

  // Dispatch app initialized event
  document.dispatchEvent(new CustomEvent("appComponentsInitialized"));
}

// Error handling
function handleGlobalError(event) {
  console.error("Global error:", event.error);

  document.dispatchEvent(
    new CustomEvent("appError", {
      detail: {
        type: "global",
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  );
}

function handlePromiseRejection(event) {
  console.error("Unhandled promise rejection:", event.reason);

  document.dispatchEvent(
    new CustomEvent("appError", {
      detail: {
        type: "promise",
        error: event.reason,
        promise: event.promise,
      },
    })
  );
}

// Public API with all original functions plus enhancements
window.LoadingProgress = LoadingProgress;
window.LoadingSpinner = LoadingSpinner;
window.ViewManager = ViewManager;
window.showRepoSelector = showRepoSelector;
window.showExplorer = showExplorer;
window.showFileViewer = showFileViewer;
window.showFileEditor = showFileEditor;
window.navigateToRoot = navigateToRoot;
window.navigateToPath = navigateToPath;
window.navigateToFolder = navigateToFolder;
window.navigateBack = navigateBack;
window.refreshCurrentView = refreshCurrentView;
window.initializeAppComponents = initializeAppComponents;

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAppComponents);
} else {
  initializeAppComponents();
}
