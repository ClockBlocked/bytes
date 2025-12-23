(function() {
    const SCRIPT_REGISTRY = {
        scripts: new Map(),
        loadOrder: [],
        startTime: performance.now()
    };

    const SCRIPT_MANIFEST = [
        { id: "elements", url: "https://clockblocked.github.io/gitDev/modules/utilities/elements.js", category: "Utility", priority: 1, critical: true },
        { id: "dependencies", url: "https://clockblocked.github.io/gitDev/modules/dependencies. js", category: "Primary", priority: 2, critical: true },
        { id:  "api", url: "modules/api.js", category: "Service", priority: 3, critical: true },
        { id: "storage", url: "modules/storage.js", category: "Service", priority: 4, critical: true },
        { id: "router", url: "https://clockblocked.github.io/gitDev/modules/router.js", category: "Primary", priority: 5, critical: true },
        { id: "pageUpdates", url: "https://clockblocked.github.io/gitDev/modules/pageUpdates.js", category: "UI", priority: 6, critical: false },
        { id: "overlays", url: "https://clockblocked.github.io/gitDev/modules/overlays.js", category: "UI", priority: 7, critical: false },
        { id: "core", url: "modules/core.js", category: "Primary", priority: 8, critical: true },
        { id: "listeners", url: "https://clockblocked.github.io/gitDev/modules/listeners.js", category: "Helper", priority: 9, critical: false },
        { id:  "search", url: "https://clockblocked.github.io/gitDev/modules/search.js", category: "Feature", priority: 10, critical: false },
        { id:  "fileUpload", url: "https://clockblocked.github.io/gitDev/modules/fileUpload.js", category: "Feature", priority: 11, critical: false },
        { id:  "importExport", url:  "https://clockblocked.github.io/gitDev/modules/importExport.js", category: "Feature", priority: 12, critical: false },
        { id:  "fileMenu", url: "modules/fileMenu.js", category: "UI", priority: 13, critical: false },
        { id:  "coder", url: "https://clockblocked.github.io/gitDev/modules/coder.js", category: "Feature", priority: 14, critical: false }
    ];

    function generateCacheBuster() {
        return `v=${Date.now()}`;
    }

    function extractExports(scriptId) {
        const knownExports = {
            elements: ["isElement", "isNodeList", "isHTMLCollection", "toArray", "ElementUtils"],
            dependencies:  ["DependencyManager", "loadDependency"],
            api: ["StorageAPI", "storageAPI"],
            storage: ["LocalStorageManager", "storageCache", "initializeStorage"],
            router: ["Router", "navigate", "getCurrentRoute"],
            pageUpdates: ["PageUpdater", "refreshContent"],
            overlays: ["OverlayManager", "Modal", "Toast", "Notification"],
            core: ["App", "initializeApp", "SidebarManager"],
            listeners: ["EventListenersManager", "eventListeners", "setupEventListeners"],
            search: ["SearchManager", "performSearch"],
            fileUpload: ["FileUploader", "uploadFile"],
            importExport: ["ImportExport", "exportData", "importData"],
            fileMenu: ["FileMenu", "ContextMenu"],
            coder:  ["coderViewEdit"]
        };
        return knownExports[scriptId] || [];
    }

    function autoExposeGlobals(scriptId) {
        const expectedExports = extractExports(scriptId);
        const exposed = [];
        expectedExports.forEach(name => {
            if (typeof window[name] !== "undefined") exposed.push(name);
        });
        return exposed;
    }

    function loadScript(manifest) {
        return new Promise((resolve, reject) => {
            const scriptData = {
                id: manifest.id,
                url: manifest.url,
                category:  manifest.category,
                priority: manifest. priority,
                critical: manifest.critical,
                status: "Pending",
                startTime: performance.now(),
                endTime: null,
                duration: null,
                size: null,
                retryCount: 0,
                maxRetries: 3,
                exports: [],
                error: null
            };

            SCRIPT_REGISTRY. scripts.set(manifest.id, scriptData);

            const script = document.createElement("script");
            script.src = `${manifest.url}?${generateCacheBuster()}`;
            script.async = false;
            script. dataset.scriptId = manifest.id;

            script.onload = () => {
                scriptData.endTime = performance.now();
                scriptData.duration = scriptData.endTime - scriptData. startTime;
                scriptData.status = "Loaded";
                scriptData. exports = autoExposeGlobals(manifest.id);
                SCRIPT_REGISTRY. loadOrder.push(manifest.id);

                fetch(manifest.url, { method: "HEAD" })
                    .then(response => {
                        const size = response.headers. get("content-length");
                        if (size) scriptData.size = parseInt(size, 10);
                    })
                    . catch(() => {});

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
    }

    function retryScript(scriptId) {
        const scriptData = SCRIPT_REGISTRY.scripts. get(scriptId);
        if (! scriptData) {
            return Promise.reject(new Error("Script not found"));
        }

        if (scriptData.retryCount >= scriptData.maxRetries) {
            return Promise.reject(new Error("Max retries reached"));
        }

        scriptData.retryCount++;
        scriptData.status = "Retrying";

        const existingScript = document. querySelector(`script[data-script-id="${scriptId}"]`);
        if (existingScript) existingScript.remove();

        const manifest = SCRIPT_MANIFEST.find(m => m.id === scriptId);
        return loadScript(manifest);
    }

    // ============================================================================
    // SIDEBAR MANAGER
    // ============================================================================
    const SidebarManager = {
        state: {
            isLeftSidebarOpen:  false,
            isRightSidebarOpen: false,
            isDarkTheme: true,
            currentRepository: null,
            recentFiles: [],
            repositories: []
        },

        init() {
            this. setupEventListeners();
            this.loadData();
            this.checkWindowSize();
            this.setupAutoRefresh();
            this.updateRecentFiles();
            this.updateRepositoryList();
            this.updateStats();
        },

        setupEventListeners() {
            const leftSidebarTrigger = document. getElementById('leftSidebarTrigger');
            const rightSidebarTrigger = document. getElementById('rightSidebarTrigger');
            const overlay = document.getElementById('overlay');

            if (leftSidebarTrigger) {
                leftSidebarTrigger. addEventListener('click', (e) => {
                    e.stopPropagation();
                    this. toggleLeftSidebar();
                });
            }

            if (rightSidebarTrigger) {
                rightSidebarTrigger. addEventListener('click', (e) => {
                    e.stopPropagation();
                    this. toggleRightSidebar();
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => {
                    if (this.state. isLeftSidebarOpen) {
                        this.closeLeftSidebar();
                    }
                    if (this.state.isRightSidebarOpen) {
                        this. closeRightSidebar();
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (window.innerWidth > 1200) return;

                const leftSidebar = document.getElementById('leftSidebar');
                const rightSidebar = document.getElementById('rightSidebar');
                const leftTrigger = document. getElementById('leftSidebarTrigger');
                const rightTrigger = document. getElementById('rightSidebarTrigger');

                const isClickOnLeftTrigger = e. target === leftTrigger || leftTrigger. contains(e.target);
                const isClickOnRightTrigger = e. target === rightTrigger || rightTrigger.contains(e.target);
                const isClickInLeftSidebar = leftSidebar. contains(e.target);
                const isClickInRightSidebar = rightSidebar.contains(e.target);

                if (this.state.isLeftSidebarOpen && !isClickInLeftSidebar && !isClickOnLeftTrigger) {
                    this. closeLeftSidebar();
                }

                if (this. state.isRightSidebarOpen && !isClickInRightSidebar && !isClickOnRightTrigger) {
                    this.closeRightSidebar();
                }
            });

            window.addEventListener('resize', () => {
                this.checkWindowSize();
            });
        },

        loadData() {
            try {
                this.state.recentFiles = JSON. parse(localStorage.getItem('gitcodr_recent_files') || '[]');
                this.state.repositories = JSON.parse(localStorage.getItem('gitcodr_repositories') || '[]');
            } catch (e) {
                this.state.recentFiles = [];
                this.state. repositories = [];
            }
        },

        toggleLeftSidebar() {
            if (window.innerWidth <= 1200) {
                if (this.state. isLeftSidebarOpen) {
                    this.closeLeftSidebar();
                } else {
                    this.openLeftSidebar();
                }
            }
        },

        toggleRightSidebar() {
            if (window. innerWidth <= 1200) {
                if (this.state.isRightSidebarOpen) {
                    this. closeRightSidebar();
                } else {
                    this.openRightSidebar();
                }
            }
        },

        openLeftSidebar() {
            const leftSidebar = document.getElementById('leftSidebar');
            const overlay = document.getElementById('overlay');

            this.closeRightSidebar();

            this.state.isLeftSidebarOpen = true;
            leftSidebar.classList.add('open');
            overlay. classList.add('active');
        },

        openRightSidebar() {
            const rightSidebar = document.getElementById('rightSidebar');
            const overlay = document.getElementById('overlay');

            this.closeLeftSidebar();

            this.state.isRightSidebarOpen = true;
            rightSidebar.classList. add('open');
            overlay.classList. add('active');
        },

        closeLeftSidebar() {
            const leftSidebar = document.getElementById('leftSidebar');
            const overlay = document. getElementById('overlay');

            this.state. isLeftSidebarOpen = false;
            leftSidebar.classList.remove('open');

            if (! this.state.isRightSidebarOpen) {
                overlay.classList.remove('active');
            }
        },

        closeRightSidebar() {
            const rightSidebar = document.getElementById('rightSidebar');
            const overlay = document.getElementById('overlay');

            this. state.isRightSidebarOpen = false;
            rightSidebar.classList.remove('open');

            if (!this.state.isLeftSidebarOpen) {
                overlay. classList.remove('active');
            }
        },

        checkWindowSize() {
            const leftSidebar = document.getElementById('leftSidebar');
            const rightSidebar = document.getElementById('rightSidebar');
            const overlay = document.getElementById('overlay');
            const mainContentWrapper = document.getElementById('mainArea');

            if (window.innerWidth <= 1200) {
                leftSidebar.classList.remove('open');
                rightSidebar.classList.remove('open');
                this.state.isLeftSidebarOpen = false;
                this.state.isRightSidebarOpen = false;
                overlay.classList.remove('active');

                if (mainContentWrapper) {
                    mainContentWrapper. style.marginLeft = '0';
                    mainContentWrapper.style.marginRight = '0';
                }
            } else {
                leftSidebar. classList.remove('open');
                rightSidebar. classList.remove('open');
                this. state.isLeftSidebarOpen = false;
                this. state.isRightSidebarOpen = false;
                overlay.classList.remove('active');

                if (mainContentWrapper) {
                    mainContentWrapper.style. marginLeft = 'var(--sidebar-width)';
                    mainContentWrapper.style.marginRight = 'var(--sidebar-width)';
                }
            }
        },

        toggleTheme() {
            const html = document.documentElement;
            const themeIcons = document.querySelectorAll('#themeIcon, #sidebarThemeIcon');

            this.state.isDarkTheme = !this.state.isDarkTheme;

            if (this.state.isDarkTheme) {
                html.setAttribute('data-theme', 'dark');
                themeIcons.forEach(icon => {
                    icon.className = 'fas fa-moon';
                });
            } else {
                html.setAttribute('data-theme', 'light');
                themeIcons. forEach(icon => {
                    icon. className = 'fas fa-sun';
                });
            }

            localStorage.setItem('gitcodr_theme', this. state.isDarkTheme ? 'dark' : 'light');
        },

        updateRecentFiles() {
            const recentFilesList = document.getElementById('recentFilesList');
            if (! recentFilesList) return;

            this.loadData();

            if (this.state. recentFiles.length === 0) {
                recentFilesList.innerHTML = '<div class="text-center py-4 text-github-fg-muted text-sm"><i class="fas fa-file text-lg mb-2 block"></i>No recent files</div>';
            } else {
                recentFilesList.innerHTML = this.state.recentFiles.slice(0, 5).map(file => `<div class="recent-file-item" onclick="SidebarManager.openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')"><i class="fas fa-file recent-file-icon"></i><div class="flex-1 min-w-0"><div class="text-sm text-github-fg-default truncate">${file. fileName}</div><div class="text-xs text-github-fg-muted truncate">${file.repoName}</div></div><div class="text-xs text-github-fg-muted">${this.formatTimeAgo(file.timestamp)}</div></div>`).join('');
            }
        },

        updateRepositoryList() {
            const repoListSidebar = document. getElementById('repoListSidebar');
            const repoCount = document.getElementById('repoCount');

            if (!repoListSidebar) return;

            this.loadData();

            if (this.state. repositories.length === 0) {
                repoListSidebar.innerHTML = '<div class="text-center py-2 text-sm text-github-fg-muted">No repositories yet</div>';
            } else {
                repoListSidebar.innerHTML = this.state. repositories.map(repo => `<div class="repo-item ${this.state.currentRepository === repo.name ? 'active' : ''}" onclick="SidebarManager.selectRepository('${repo. name}')"><i class="fas fa-folder repo-icon ${repo.visibility === 'public' ? 'public' : ''}"></i><span class="flex-1 truncate">${repo. name}</span><span class="text-xs text-github-fg-muted">${this.formatDate(repo.created)}</span></div>`).join('');
            }

            if (repoCount) {
                repoCount. textContent = this.state.repositories. length. toString();
            }
        },

        updateStats() {
            const totalFilesCount = document.getElementById('totalFilesCount');
            const totalStorage = document.getElementById('totalStorage');
            const currentRepoNameSidebar = document.getElementById('currentRepoNameSidebar');
            const currentRepoDesc = document.getElementById('currentRepoDesc');
            const currentRepoInfo = document.getElementById('currentRepoInfo');
            const statsFiles = document.getElementById('statsFiles');
            const statsCommits = document.getElementById('statsCommits');
            const statsBranches = document. getElementById('statsBranches');
            const statsIssues = document. getElementById('statsIssues');

            let totalFiles = 0;
            let totalSize = 0;

            this.state.repositories.forEach(repo => {
                try {
                    const repoData = JSON.parse(localStorage.getItem(`gitcodr_repo_${repo.name}`) || '{}');
                    const fileCount = Object.keys(repoData).length;
                    totalFiles += fileCount;

                    Object.values(repoData).forEach(file => {
                        totalSize += file. size || 0;
                    });
                } catch (e) {
                    // Silent fail for individual repo processing
                }
            });

            if (totalFilesCount) totalFilesCount.textContent = totalFiles.toString();
            if (totalStorage) totalStorage.textContent = this.formatFileSize(totalSize);
            if (statsFiles) statsFiles.textContent = totalFiles.toString();
            if (statsCommits) statsCommits.textContent = Math.floor(totalFiles * 1.5).toString();
            if (statsBranches) statsBranches.textContent = this.state.repositories.length.toString();
            if (statsIssues) statsIssues.textContent = '0';

            if (this.state.currentRepository) {
                const repo = this.state. repositories.find(r => r.name === this.state.currentRepository);
                if (repo) {
                    if (currentRepoNameSidebar) currentRepoNameSidebar.textContent = repo.name;
                    if (currentRepoDesc) currentRepoDesc.textContent = repo.description || 'No description';
                    if (currentRepoInfo) currentRepoInfo.classList.remove('hidden');
                }
            } else {
                if (currentRepoInfo) currentRepoInfo.classList.add('hidden');
            }
        },

        selectRepository(repoName) {
            this.state.currentRepository = repoName;
            this.updateRepositoryList();
            this.updateStats();

            if (typeof openRepository === 'function') {
                openRepository(repoName);
            }

            if (window.innerWidth <= 1200) {
                this.closeLeftSidebar();
            }
        },

        openRecentFile(repoName, filePath, fileName) {
            this.state.currentRepository = repoName;
            this. updateRepositoryList();
            this.updateStats();

            if (typeof openRecentFile === 'function') {
                openRecentFile(repoName, filePath, fileName);
            }

            if (window.innerWidth <= 1200) {
                this. closeRightSidebar();
            }
        },

        refreshRecentFiles() {
            this.loadData();
            this.updateRecentFiles();
        },

        addToRecentFiles(fileName, repoName, filePath) {
            const existingIndex = this.state. recentFiles.findIndex(f => f.filePath === filePath && f.repoName === repoName);

            if (existingIndex !== -1) {
                this. state.recentFiles.splice(existingIndex, 1);
            }

            this.state.recentFiles.unshift({
                fileName,
                repoName,
                filePath,
                timestamp:  Date.now()
            });

            if (this.state. recentFiles.length > 10) {
                this.state.recentFiles = this.state.recentFiles.slice(0, 10);
            }

            localStorage.setItem('gitcodr_recent_files', JSON.stringify(this.state. recentFiles));
            this.updateRecentFiles();
        },

        setupAutoRefresh() {
            setInterval(() => {
                this.loadData();
                this.updateRecentFiles();
                this.updateRepositoryList();
                this.updateStats();
            }, 30000);
        },

        formatDate(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleDateString();
        },

        formatTimeAgo(timestamp) {
            if (!timestamp) return '';
            const now = new Date();
            const date = new Date(timestamp);
            const diff = now - date;

            if (diff < 60000) return 'now';
            if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
            if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
            if (diff < 604800000) return Math.floor(diff / 86400000) + 'd';
            return Math.floor(diff / 604800000) + 'w';
        },

        formatFileSize(bytes) {
            if (typeof bytes !== 'number') return '0 KB';
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = parseInt(Math.floor(Math. log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        },

        updateAll() {
            this.loadData();
            this.updateRecentFiles();
            this.updateRepositoryList();
            this.updateStats();
        },

        setCurrentRepository(repoName) {
            this.state.currentRepository = repoName;
            this.updateRepositoryList();
            this.updateStats();
        }
    };

    // ============================================================================
    // SERVICE WORKER MANAGER
    // ============================================================================
    class ServiceWorkerManager {
        constructor() {
            this.registration = null;
        }

        async init() {
            if ('serviceWorker' in navigator) {
                await this.register();
                this.setupListeners();
            }
        }

        async register() {
            try {
                this.registration = await navigator.serviceWorker. register('https://clockblocked.github.io/gitDev/webApp/serviceWorker.js', {
                    scope: '/',
                    updateViaCache: 'all'
                });

                if (this.registration. waiting) {
                    this.showUpdateReady();
                }

                return this.registration;
            } catch (error) {
                return null;
            }
        }

        setupListeners() {
            this.registration. addEventListener('updatefound', () => {
                const newWorker = this. registration.installing;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker. controller) {
                            this.showUpdateReady();
                        }
                    }
                });
            });

            navigator.serviceWorker. addEventListener('controllerchange', () => {
                // New Service Worker controlling the page
            });

            navigator.serviceWorker.addEventListener('message', event => {
                this.handleMessage(event. data);
            });
        }

        showUpdateReady() {
            const updateDialog = document.createElement('div');
            updateDialog.style.cssText = `
                position: fixed;
                top:  20px;
                right: 20px;
                background: #238636;
                color:  white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
            `;

            updateDialog.innerHTML = `
                <span>🔄 New version available</span>
                <button style="
                    background: white;
                    color: #238636;
                    border:  none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">Update</button>
                <button style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                ">×</button>
            `;

            document.body.appendChild(updateDialog);

            const updateBtn = updateDialog.querySelector('button');
            const closeBtn = updateDialog. querySelector('button: last-child');

            updateBtn.addEventListener('click', () => {
                if (this.registration.waiting) {
                    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                window.location.reload();
            });

            closeBtn.addEventListener('click', () => {
                updateDialog.remove();
            });
        }

        handleMessage(data) {
            switch (data.type) {
                case 'CACHE_UPDATED':
                    break;
                case 'OFFLINE':
                    this.showOfflineWarning();
                    break;
            }
        }

        showOfflineWarning() {
            const indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #f0ad4e;
                color: white;
                padding:  0.5rem 1rem;
                border-radius:  4px;
                z-index: 9998;
            `;
            indicator.textContent = '⚠️ Offline';
            document.body. appendChild(indicator);

            setTimeout(() => indicator.remove(), 3000);
        }

        async checkForUpdates() {
            if (this.registration) {
                await this.registration.update();
            }
        }

        async unregister() {
            if (this. registration) {
                await this.registration. unregister();
            }
        }
    }

    // ============================================================================
    // SHARE HANDLER
    // ============================================================================
    const ShareHandler = {
        init() {
            if (window.location.search.includes('share')) {
                this. processSharedData();
            }
        },

        async processSharedData() {
            const formData = await this.getSharedData();
            if (formData) {
                this.handleSharedFiles(formData);
            }
        },

        async getSharedData() {
            // Process files shared via Web Share Target API
            return null;
        },

        handleSharedFiles(formData) {
            // Process and upload shared files
        }
    };

    // ============================================================================
    // PWA INSTALL HANDLER
    // ============================================================================
    const PWAInstallHandler = {
        deferredPrompt:  null,

        init() {
            this.createInstallButton();
            this.setupEventListeners();
        },

        createInstallButton() {
            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.innerHTML = '📱 Install App';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #58a6ff;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                z-index: 9997;
                display: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(installBtn);
        },

        setupEventListeners() {
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;

                const installBtn = document. getElementById('pwa-install-btn');
                if (installBtn) {
                    installBtn.style. display = 'block';

                    installBtn.addEventListener('click', async () => {
                        installBtn.style.display = 'none';

                        if (this.deferredPrompt) {
                            this. deferredPrompt.prompt();
                            const { outcome } = await this.deferredPrompt.userChoice;
                            this.deferredPrompt = null;
                        }
                    });
                }
            });

            window. addEventListener('appinstalled', () => {
                const installBtn = document.getElementById('pwa-install-btn');
                if (installBtn) installBtn.style.display = 'none';
            });
        }
    };

    // ============================================================================
    // DEBUGGER (ERUDA)
    // ============================================================================
    const DebuggerManager = {
        init() {
            this.loadEruda();
        },

        loadEruda() {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/eruda';
            script.onload = () => {
                if (typeof eruda !== 'undefined') {
                    eruda.init();
                }
            };
            document.head.appendChild(script);
        }
    };

    // ============================================================================
    // HELPER FUNCTIONS FOR SIDEBAR OPERATIONS
    // ============================================================================
    function updateSidebarAfterFileOperation(repoName, fileName, filePath) {
        if (window.SidebarManager) {
            window.SidebarManager.addToRecentFiles(fileName, repoName, filePath);
            window.SidebarManager.updateStats();
        }
    }

    function updateSidebarAfterRepoOperation() {
        if (window.SidebarManager) {
            window.SidebarManager.updateRepositoryList();
            window.SidebarManager.updateStats();
        }
    }

    // ============================================================================
    // MAIN SCRIPT LOADER
    // ============================================================================
    async function loadAllScripts() {
        const sortedManifest = [... SCRIPT_MANIFEST].sort((a, b) => a.priority - b.priority);

        for (const manifest of sortedManifest) {
            try {
                await loadScript(manifest);
            } catch (error) {
                // Script failed to load, continue with others
            }
        }

        setTimeout(() => {
            // Initialize SidebarManager
            if (typeof window.SidebarManager !== "undefined" && window.SidebarManager.init) {
                window. SidebarManager. init();
            }

            // Initialize app if available
            if (typeof initializeApp === "function") {
                initializeApp();
            }

            // Initialize Service Worker
            window.swManager = new ServiceWorkerManager();
            window.swManager.init();

            // Initialize Share Handler
            ShareHandler.init();

            // Initialize PWA Install Handler
            PWAInstallHandler.init();

            // Initialize Debugger
            DebuggerManager.init();

            // Apply saved theme
            const savedTheme = localStorage.getItem('gitcodr_theme');
            if (savedTheme === 'light' && window.SidebarManager) {
                window.SidebarManager.state.isDarkTheme = true;
                window.SidebarManager.toggleTheme();
            }

            // Dispatch ready event
            window.dispatchEvent(new CustomEvent("gitDevReady", {
                detail: {
                    loadedCount: Array.from(SCRIPT_REGISTRY.scripts.values()).filter(s => s.status === "Loaded").length,
                    failedCount: Array. from(SCRIPT_REGISTRY.scripts. values()).filter(s => s.status === "Failed").length,
                    totalTime: performance.now() - SCRIPT_REGISTRY. startTime
                }
            }));
        }, 50);
    }

    // ============================================================================
    // GLOBAL API
    // ============================================================================
    window.SidebarManager = SidebarManager;
    window.updateSidebarAfterFileOperation = updateSidebarAfterFileOperation;
    window.updateSidebarAfterRepoOperation = updateSidebarAfterRepoOperation;

    window.gitDevLoader = {
        retry: function(scriptId) {
            return retryScript(scriptId).catch(() => {});
        },

        retryAll: function() {
            const failed = Array.from(SCRIPT_REGISTRY.scripts.entries())
                .filter(([_, data]) => data.status === "Failed")
                .map(([id]) => id);

            if (failed.length === 0) {
                return Promise.resolve();
            }

            return Promise.all(failed. map(id => retryScript(id).catch(() => null)));
        },

        reload: function(scriptId) {
            const scriptData = SCRIPT_REGISTRY.scripts. get(scriptId);
            if (!scriptData) {
                return Promise. reject(new Error("Script not found"));
            }

            const existingScript = document. querySelector(`script[data-script-id="${scriptId}"]`);
            if (existingScript) existingScript.remove();

            SCRIPT_REGISTRY. scripts.delete(scriptId);

            const manifest = SCRIPT_MANIFEST. find(m => m.id === scriptId);
            return loadScript(manifest);
        },

        list: function() {
            const allExports = [];
            SCRIPT_REGISTRY. scripts.forEach((data, id) => {
                if (data.exports. length > 0) {
                    data.exports.forEach(exp => {
                        allExports.push({
                            Module: id,
                            Export: exp,
                            Type: typeof window[exp],
                            Available: typeof window[exp] !== "undefined"
                        });
                    });
                }
            });
            return allExports;
        },

        get manifest() {
            return SCRIPT_MANIFEST;
        },

        get registry() {
            return Object.fromEntries(SCRIPT_REGISTRY.scripts);
        },

        getScript:  function(scriptId) {
            return SCRIPT_REGISTRY.scripts.get(scriptId);
        },

        isLoaded: function(scriptId) {
            const data = SCRIPT_REGISTRY.scripts.get(scriptId);
            return data && data.status === "Loaded";
        },

        whenReady:  function(callback) {
            if (SCRIPT_REGISTRY.scripts.size === SCRIPT_MANIFEST. length) {
                const allLoaded = Array.from(SCRIPT_REGISTRY.scripts.values())
                    .every(s => s.status === "Loaded" || s.status === "Failed");
                if (allLoaded) {
                    callback();
                    return;
                }
            }
            window.addEventListener("gitDevReady", callback, { once: true });
        },

        addScript: function(config) {
            const newManifest = {
                id: config. id,
                url: config.url,
                category: config.category || "Custom",
                priority:  config.priority || SCRIPT_MANIFEST. length + 1,
                critical: config.critical || false
            };
            SCRIPT_MANIFEST.push(newManifest);
            return loadScript(newManifest);
        }
    };

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    if (document.readyState === "loading") {
        document. addEventListener("DOMContentLoaded", loadAllScripts);
    } else {
        loadAllScripts();
    }
})();

/**
 *
 *  C R E A T E D  B Y
 *
 *  William Hanson
 *
 *  Chevrolay@Outlook.com
 *
 *  m. me/Chevrolay
 *
 */