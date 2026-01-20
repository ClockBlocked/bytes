(function() {
    const SCRIPT_REGISTRY = new Map();
    const SCRIPT_MANIFEST = [
        { id: "dependencies", url: "https://clockblocked.github.io/bytes/modules/dependencies.js", category: "Primary", priority: 2, critical: true },
        { id: "api", url: "https://clockblocked.github.io/bytes/modules/api.js", category: "Service", priority: 3, critical: true },
        { id: "storage", url: "https://clockblocked.github.io/bytes/modules/storage.js", category: "Service", priority: 4, critical: true },
        { id: "router", url: "https://clockblocked.github.io/bytes/modules/router.js", category: "Primary", priority: 5, critical: true },
        { id: "pageUpdates", url: "https://clockblocked.github.io/bytes/modules/pageUpdates.js", category: "UI", priority: 6, critical: false },
        { id: "overlays", url: "https://clockblocked.github.io/bytes/modules/overlays.js", category: "UI", priority: 7, critical: false },
        { id: "ui", url: "https://clockblocked.github.io/bytes/modules/ui.js", category: "Helper", priority: 8, critical: false },
        { id: "core", url: "https://clockblocked.github.io/bytes/modules/core.js", category: "Primary", priority: 9, critical: true },
        { id: "listeners", url: "https://clockblocked.github.io/bytes/modules/listeners.js", category: "Helper", priority: 10, critical: false },
        { id: "search", url: "https://clockblocked.github.io/bytes/modules/search.js", category: "Feature", priority: 11, critical: false },
        { id: "fileUpload", url: "https://clockblocked.github.io/bytes/modules/fileUpload.js", category: "Feature", priority: 12, critical: false },
        { id: "importExport", url: "https://clockblocked.github.io/bytes/modules/importExport.js", category: "Feature", priority: 13, critical: false },
        { id: "fileMenu", url: "https://clockblocked.github.io/bytes/modules/fileMenu.js", category: "UI", priority: 14, critical: false },
        { id: "assets", url: "https://clockblocked.github.io/bytes/modules/assets.js", category: "UI", priority: 15, critical: false },
        { id: "coder", url: "https://clockblocked.github.io/bytes/modules/coder.js", category: "Feature", priority: 16, critical: false }
    ];
    const LOAD_ORDER = [];
    const EXPORT_MAP = new Map([
        ["elements", ["isElement", "isNodeList", "isHTMLCollection", "toArray", "ElementUtils"]],
        ["dependencies", ["DependencyManager", "loadDependency"]],
        ["api", ["StorageAPI", "storageAPI"]],
        ["storage", ["LocalStorageManager", "storageCache", "initializeStorage"]],
        ["router", ["Router", "navigate", "getCurrentRoute"]],
        ["pageUpdates", ["PageUpdater", "refreshContent"]],
        ["overlays", ["OverlayManager", "Modal", "Toast", "Notification"]],
        ["ui", ["UIComponents"]],
        ["core", ["App", "initializeApp", "SidebarManager"]],
        ["listeners", ["EventListenersManager", "eventListeners", "setupEventListeners"]],
        ["search", ["SearchManager", "performSearch"]],
        ["fileUpload", ["FileUploader", "uploadFile"]],
        ["importExport", ["ImportExport", "exportData", "importData"]],
        ["fileMenu", ["FileMenu", "ContextMenu"]],
        ["assets", ["AppAssets"]],
        ["coder", ["coderViewEdit", "FileManager", "SearchManager", "PopoverManager", "EditorStateManager"]]
    ]);
    const generateCacheBuster = () => `v=${Date.now()}`;
    const extractExports = id => EXPORT_MAP.get(id) || [];
    const autoExposeGlobals = id => extractExports(id).filter(name => window[name] !== undefined);
    const loadScript = manifest => new Promise((resolve, reject) => {
        const scriptData = {
            id: manifest.id,
            status: "Pending",
            startTime: performance.now(),
            endTime: null,
            duration: null,
            retryCount: 0,
            maxRetries: 3,
            exports: [],
            error: null
        };
        SCRIPT_REGISTRY.set(manifest.id, scriptData);
        const script = document.createElement("script");
        script.src = `${manifest.url}?${generateCacheBuster()}`;
        script.async = false;
        script.dataset.scriptId = manifest.id;
        script.onload = () => {
            scriptData.endTime = performance.now();
            scriptData.duration = scriptData.endTime - scriptData.startTime;
            scriptData.status = "Loaded";
            scriptData.exports = autoExposeGlobals(manifest.id);
            LOAD_ORDER.push(manifest.id);
            resolve(scriptData);
        };
        script.onerror = error => {
            scriptData.status = "Failed";
            scriptData.error = error;
            scriptData.endTime = performance.now();
            scriptData.duration = scriptData.endTime - scriptData.startTime;
            reject(scriptData);
        };
        document.head.appendChild(script);
    });
    const retryScript = scriptId => {
        const scriptData = SCRIPT_REGISTRY.get(scriptId);
        if (!scriptData) return Promise.reject(new Error("Script not found"));
        if (scriptData.retryCount >= scriptData.maxRetries) return Promise.reject(new Error("Max retries reached"));
        scriptData.retryCount++;
        scriptData.status = "Retrying";
        document.querySelector(`script[data-script-id="${scriptId}"]`)?.remove();
        return loadScript(SCRIPT_MANIFEST.find(m => m.id === scriptId));
    };
    const loadAllScripts = async () => {
        const sortedManifest = [...SCRIPT_MANIFEST].sort((a, b) => a.priority - b.priority);
        for (const manifest of sortedManifest) {
            try {
                await loadScript(manifest);
            } catch (error) {
                if (manifest.critical) throw new Error(`Critical script "${manifest.id}" failed to load`);
            }
        }
        setTimeout(() => {
            if (typeof SidebarManager !== "undefined" && SidebarManager.init) SidebarManager.init();
            if (typeof initializeApp === "function") initializeApp();
            window.dispatchEvent(new CustomEvent("gitDevReady"));
        }, 50);
    };
    window.gitDevLoader = {
        retry: scriptId => retryScript(scriptId),
        retryAll: () => Promise.all(
            Array.from(SCRIPT_REGISTRY.entries())
                .filter(([_, data]) => data.status === "Failed")
                .map(([id]) => retryScript(id).catch(() => null))
        ),
        reload: scriptId => {
            const scriptData = SCRIPT_REGISTRY.get(scriptId);
            if (!scriptData) return Promise.reject(new Error("Script not found"));
            document.querySelector(`script[data-script-id="${scriptId}"]`)?.remove();
            SCRIPT_REGISTRY.delete(scriptId);
            const manifest = SCRIPT_MANIFEST.find(m => m.id === scriptId);
            return loadScript(manifest);
        },
        list: () => Array.from(SCRIPT_REGISTRY.entries()).flatMap(([id, data]) => 
            data.exports.map(exp => ({ Module: id, Export: exp, Type: typeof window[exp] }))
        ),
        get manifest() { return SCRIPT_MANIFEST; },
        get registry() { return Object.fromEntries(SCRIPT_REGISTRY); },
        getScript: scriptId => SCRIPT_REGISTRY.get(scriptId),
        isLoaded: scriptId => SCRIPT_REGISTRY.get(scriptId)?.status === "Loaded",
        whenReady: callback => {
            if (SCRIPT_REGISTRY.size === SCRIPT_MANIFEST.length) {
                const allLoaded = Array.from(SCRIPT_REGISTRY.values()).every(s => s.status === "Loaded" || s.status === "Failed");
                if (allLoaded) return callback();
            }
            window.addEventListener("gitDevReady", callback, { once: true });
        },
        addScript: config => {
            const newManifest = {
                id: config.id,
                url: config.url,
                category: config.category || "Custom",
                priority: config.priority || SCRIPT_MANIFEST.length + 1,
                critical: config.critical || false
            };
            SCRIPT_MANIFEST.push(newManifest);
            return loadScript(newManifest);
        }
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadAllScripts);
    else loadAllScripts();
})();
