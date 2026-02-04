(function() {
    // ADD JQUERY FIRST - THIS IS CRITICAL
    const JQUERY_URL = "https://code.jquery.com/jquery-3.6.0.min.js";
    
    const SCRIPT_REGISTRY = new Map();
    const SCRIPT_MANIFEST = [
        { id: "jquery", url: JQUERY_URL, category: "Dependency", priority: 1, critical: true },
        { id: "dependencies", url: "https://clockblocked.github.io/bytes/modules/dependencies.js", category: "Primary", priority: 2, critical: true },
        { id: "api", url: "https://clockblocked.github.io/bytes/modules/api.js", category: "Service", priority: 3, critical: true },
        { id: "storage", url: "https://clockblocked.github.io/bytes/modules/storage.js", category: "Service", priority: 4, critical: true },
        { id: "router", url: "https://clockblocked.github.io/bytes/modules/router.js", category: "Primary", priority: 5, critical: true },
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
        ["jquery", ["jQuery", "$"]],  // ADD JQUERY EXPORTS
        ["dependencies", ["isElement", "isNodeList", "isHTMLCollection", "toArray", "ElementUtils"]],
        ["api", ["StorageAPI", "storageAPI"]],
        ["storage", ["LocalStorageManager", "storageCache", "initializeStorage"]],
        ["router", ["Router", "navigate", "getCurrentRoute"]],
        ["overlays", ["OverlayManager", "Modal", "Toast", "Notification"]],
        ["ui", ["UIComponents"]],
        ["core", ["App", "initializeApp", "SidebarManager"]],
        ["listeners", ["EventListenersManager", "eventListeners", "setupEventListeners"]],
        ["search", ["SearchManager", "performSearch"]],
        ["fileUpload", ["FileUploader", "uploadFile"]],
        ["importExport", ["ImportExport", "exportData", "importData"]],
        ["fileMenu", ["FileMenu", "ContextMenu"]],
        ["assets", ["AppAssets"]],
        ["coder", ["CodeViewEditor", "coderViewEdit", "FullscreenManager"]]  // ADD FULLSCREENMANAGER
    ]);
    
    const generateCacheBuster = () => `v=${Date.now()}`;
    
    const extractExports = id => EXPORT_MAP.get(id) || [];
    
    const autoExposeGlobals = id => {
        const exports = extractExports(id);
        // Special handling for jQuery
        if (id === "jquery") {
            return exports.filter(name => window[name] !== undefined);
        }
        return exports.filter(name => window[name] !== undefined);
    };
    
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
        
        // Special handling for jQuery - add integrity and crossorigin
        if (manifest.id === "jquery") {
            script.src = `${manifest.url}`;
            script.integrity = "sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=";
            script.crossOrigin = "anonymous";
        } else {
            script.src = `${manifest.url}?${generateCacheBuster()}`;
        }
        
        script.async = false;
        script.dataset.scriptId = manifest.id;
        
        script.onload = () => {
            scriptData.endTime = performance.now();
            scriptData.duration = scriptData.endTime - scriptData.startTime;
            scriptData.status = "Loaded";
            scriptData.exports = autoExposeGlobals(manifest.id);
            LOAD_ORDER.push(manifest.id);
            
            // Special logging for jQuery
            if (manifest.id === "jquery") {
                console.log(`✅ jQuery ${$.fn.jquery} loaded successfully`);
            }
            
            resolve(scriptData);
        };
        
        script.onerror = error => {
            scriptData.status = "Failed";
            scriptData.error = error;
            scriptData.endTime = performance.now();
            scriptData.duration = scriptData.endTime - scriptData.startTime;
            
            // Critical error for jQuery
            if (manifest.id === "jquery") {
                console.error("❌ CRITICAL: jQuery failed to load!", error);
            }
            
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
        
        // Load jQuery first and wait for it
        const jqueryManifest = sortedManifest.find(m => m.id === "jquery");
        if (jqueryManifest) {
            try {
                console.log("🚀 Loading jQuery...");
                await loadScript(jqueryManifest);
                console.log("✅ jQuery loaded, proceeding with other scripts");
            } catch (error) {
                console.error("❌ CRITICAL: jQuery failed to load. Aborting.");
                throw error;
            }
        }
        
        // Load the rest
        for (const manifest of sortedManifest) {
            if (manifest.id === "jquery") continue; // Already loaded
            
            try {
                console.log(`📦 Loading ${manifest.id}...`);
                await loadScript(manifest);
                console.log(`✅ ${manifest.id} loaded`);
            } catch (error) {
                if (manifest.critical) {
                    throw new Error(`Critical script "${manifest.id}" failed to load`);
                } else {
                    console.warn(`⚠️ Non-critical script "${manifest.id}" failed:`, error.error);
                }
            }
        }
        
        // Initialize everything after all scripts are loaded
        setTimeout(() => {
            console.log("🎯 All scripts loaded. Initializing app...");
            
            // Check jQuery is available
            if (typeof jQuery === 'undefined') {
                console.error("❌ jQuery is not available! App will not function properly.");
                return;
            }
            
            // Initialize with jQuery ready
            $(() => {
                if (typeof SidebarManager !== "undefined" && SidebarManager.init) {
                    console.log("🔄 Initializing SidebarManager...");
                    SidebarManager.init();
                }
                
                if (typeof initializeApp === "function") {
                    console.log("🚀 Initializing App...");
                    initializeApp();
                }
                
                console.log("✅ App ready!");
                window.dispatchEvent(new CustomEvent("gitDevReady"));
            });
        }, 100);
    };
    
    // Add jQuery helper methods to the loader
    window.gitDevLoader = {
        // jQuery helpers
        $: (selector) => {
            if (typeof jQuery === 'undefined') {
                console.warn("jQuery not loaded yet");
                return null;
            }
            return $(selector);
        },
        
        jQuery: () => {
            return typeof jQuery !== 'undefined' ? jQuery : null;
        },
        
        // Original methods
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
            data.exports.map(exp => ({ 
                Module: id, 
                Export: exp, 
                Type: typeof window[exp],
                Available: window[exp] !== undefined
            }))
        ),
        
        get manifest() { return SCRIPT_MANIFEST; },
        get registry() { return Object.fromEntries(SCRIPT_REGISTRY); },
        
        getScript: scriptId => SCRIPT_REGISTRY.get(scriptId),
        
        isLoaded: scriptId => SCRIPT_REGISTRY.get(scriptId)?.status === "Loaded",
        
        whenReady: callback => {
            // Use jQuery's document ready if jQuery is available
            if (typeof jQuery !== 'undefined') {
                $(() => {
                    if (SCRIPT_REGISTRY.size === SCRIPT_MANIFEST.length) {
                        const allLoaded = Array.from(SCRIPT_REGISTRY.values())
                            .every(s => s.status === "Loaded" || s.status === "Failed");
                        if (allLoaded) {
                            callback();
                            return;
                        }
                    }
                    
                    window.addEventListener("gitDevReady", callback, { once: true });
                });
            } else {
                // Fallback to vanilla JS
                window.addEventListener("gitDevReady", callback, { once: true });
            }
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
            
            // Sort by priority after adding
            SCRIPT_MANIFEST.sort((a, b) => a.priority - b.priority);
            
            return loadScript(newManifest);
        },
        
        // Debug helper
        debug: () => {
            console.log("=== Script Loader Debug ===");
            console.log("jQuery available:", typeof jQuery !== 'undefined');
            console.log("$ available:", typeof $ !== 'undefined');
            console.log("jQuery version:", typeof jQuery !== 'undefined' ? jQuery.fn.jquery : 'N/A');
            console.log("Load order:", LOAD_ORDER);
            console.log("Registry:", Object.fromEntries(SCRIPT_REGISTRY));
        }
    };
    
    // Load scripts
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            console.log("📄 DOM ready, starting script loading...");
            loadAllScripts().catch(error => {
                console.error("❌ Failed to load scripts:", error);
            });
        });
    } else {
        console.log("📄 DOM already ready, starting script loading...");
        loadAllScripts().catch(error => {
            console.error("❌ Failed to load scripts:", error);
        });
    }
    
    window.ensureJQuery = callback => { // jQuery 
        const checkJQuery = () => {
            if (typeof jQuery !== 'undefined') {
                $(callback);
            } else {
                console.warn("jQuery not loaded yet, waiting...");
                setTimeout(checkJQuery, 100);
            }
        };
        checkJQuery();
    };
})();
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