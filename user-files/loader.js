const LoadingProgress = (() => {
  let progressElement = null;
  let fillElement = null;
  let hideTimeout = null;
  let progressInterval = null;
  let currentProgress = 0; 

  let config = {
    color: "#1c7eec",
    height: "2.5px",
    minimum: 0.08,
    maximum: 0.994,
    incrementPace: "realistic",
  };

  function init() {
    progressElement = document.createElement("div");
    progressElement.className = "gh-progress";

    fillElement = document.createElement("div");
    fillElement.className = "gh-progress-fill";

    progressElement.appendChild(fillElement);

    const styleElement = document.createElement("style");
    styleElement.innerHTML = loaderStyles;
    document.head.appendChild(styleElement);

    progressElement.style.height = config.height;
    fillElement.style.backgroundColor = config.color;

    document.body.appendChild(progressElement);
  }

  function show() {
    if (!progressElement) init();

    cleanup();
    currentProgress = 0;
    progressElement.classList.remove("hidden");
    progressElement.classList.add("visible");

    if (config.incrementPace === "realistic") {
      simulateRealisticLoad();
    } else if (config.incrementPace === "linear") {
      simulateLinearLoad();
    } else {
      fillElement.style.width = `${config.minimum * 100}%`;
    }
  }

  function hide() {
    if (!progressElement) return;

    currentProgress = 100;
    fillElement.style.width = "100%";

    hideTimeout = setTimeout(() => {
      progressElement.classList.remove("visible");
      setTimeout(cleanup, 300);
    }, 150);
  }

  function cleanup() {
    clearTimeout(hideTimeout);
    hideTimeout = null;

    clearInterval(progressInterval);
    progressInterval = null;

    progressElement.classList.add("hidden");
    progressElement.classList.remove("visible");

    fillElement.style.width = "0%";
    currentProgress = 0;
  }

  function simulateRealisticLoad() {
    const updateProgress = () => {
      if (currentProgress >= config.maximum * 100) {
        clearInterval(progressInterval);
        return;
      }

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
      fillElement.style.width = `${currentProgress}%`;

      clearInterval(progressInterval);
      progressInterval = setTimeout(updateProgress, delay);
    };

    updateProgress();
  }

  function simulateLinearLoad() {
    const updateProgress = () => {
      currentProgress += 1;
      fillElement.style.width = `${currentProgress}%`;

      if (currentProgress < config.maximum * 100) {
        setTimeout(updateProgress, 16);
      }
    };

    updateProgress();
  }

  function configOptions(options = {}) {
    config = { ...config, ...options };

    if (progressElement) {
      progressElement.style.height = config.height;
      fillElement.style.backgroundColor = config.color;
    }
  }

  function isVisible() {
    return progressElement && !progressElement.classList.contains("hidden");
  }

  return {
    config: configOptions,
    show,
    hide,
    isVisible,
  };
})();
