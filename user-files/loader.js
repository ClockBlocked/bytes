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
                    animateSmooth();
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

    let animationStartTime = 0;

    const originalAnimateSmooth = animateSmooth;
    function animateSmoothWrapper() {
        animationStartTime = Date.now();
        originalAnimateSmooth();
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

if (typeof window !== "undefined") {
    window.ProgressLoader = ProgressLoader;

    if (typeof window.LoadingProgress === "undefined") {
        window.LoadingProgress = ProgressLoader;
    }
}
