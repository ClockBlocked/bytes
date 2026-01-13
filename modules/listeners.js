class EventListenersManager {
    constructor() {
        this.sidebarManager = null;
    }

    get currentState() {
        return window.currentState || {
            repository: null,
            branch: "main",
            path: "",
            currentFile: null,
            selectedTags: [],
            files: [],
            repositories: []
        };
    }

    init(sidebarManager) {
        this.sidebarManager = sidebarManager || null;
        this.setupAllEventListeners();
        this.setupGlobalEventDelegation();
    }

    setupAllEventListeners() {
        const actionHandlers = {
            "create-repo": () => this.handleCreateRepo(),
            "show-create-repo": () => this.handleShowCreateRepo(),
            "hide-create-repo-modal": () => this.handleHideCreateRepoModal(),
            "create-file":  () => this.handleCreateFile(),
            "show-create-file": () => this.handleShowCreateFile(),
            "hide-create-file-modal": () => this.handleHideCreateFileModal(),
            "edit-file": () => this.handleEditFile(),
            "download-file": () => this.handleDownloadFile(),
            "delete-file": () => this.handleDeleteFile(),
            "preview-file": () => this.handlePreviewFile(),
            "show-repo-selector": () => this.handleShowRepoSelector(),
            "navigate-root": () => this.handleNavigateRoot(),
            "show-explorer": () => this.handleShowExplorer(),
            "show-file-viewer": () => this.handleShowFileViewer(),
            "star-repo": () => this.handleStarRepo(),
            "fork-repo": () => this.handleForkRepo(),
            "toggle-theme": () => this.handleToggleTheme(),
            "add-tag": () => this.handleAddTag(),
            "confirm-delete-file": () => this.handleConfirmDeleteFile(),
            "hide-delete-file-modal":  () => this.handleHideDeleteFileModal(),
            
            "new-file": () => this.handleNewFile()

        };

        Object.keys(actionHandlers).forEach(action => {
            document.querySelectorAll(`[data-action="${action}"]`).forEach(element => {
                element.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    actionHandlers[action]();
                });
            });
        });

        this.setupKeyboardShortcuts();
        this.setupFormInteractions();
        this.setupModalInteractions();
        this.setupAdditionalListeners();
    }

    handleCreateRepo() {
        if (typeof window.createRepository === "function") {
            window.createRepository();
        }
    }

    handleShowCreateRepo() {
        if (typeof window.showCreateRepoModal === "function") {
            window.showCreateRepoModal();
        }
    }

    handleHideCreateRepoModal() {
        if (typeof window.hideCreateRepoModal === "function") {
            window.hideCreateRepoModal();
        }
    }

    handleCreateFile() {
        if (typeof window.createFile === "function") {
            window.createFile();
        }
    }

    handleShowCreateFile() {
        if (typeof window.showCreateFileModal === "function") {
            window.showCreateFileModal();
        }
    }

    handleHideCreateFileModal() {
        if (typeof window.hideCreateFileModal === "function") {
            window.hideCreateFileModal();
        }
    }

    handleEditFile() {
        if (typeof window.editFile === "function") {
            window.editFile();
        } else {
            this.handleShowFileViewer();
        }
    }

    handleDownloadFile() {
        if (typeof window.downloadCurrentFile === "function") {
            window.downloadCurrentFile();
        }
    }

    handleDeleteFile() {
        if (typeof window.showDeleteFileModal === "function") {
            window.showDeleteFileModal();
        }
    }

    handlePreviewFile() {
        if (typeof window.previewFile === "function") {
            window.previewFile();
        }
    }

    handleConfirmDeleteFile() {
        if (typeof window.confirmDeleteFile === "function") {
            window.confirmDeleteFile();
        }
    }

    handleHideDeleteFileModal() {
        if (typeof window.hideDeleteFileModal === "function") {
            window.hideDeleteFileModal();
        }
    }

    // Navigation actions - now using PageRouter
    handleShowRepoSelector() {
        if (window.PageRouter) {
            PageRouter.navigateTo('repo');
        } else if (typeof window.showRepoSelector === "function") {
            window.showRepoSelector();
        }
    }

    handleNavigateRoot() {
        if (typeof window.navigateToRoot === "function") {
            window.navigateToRoot();
        }
    }

    handleShowExplorer() {
        if (! this.currentState.repository) {
            console.warn('No repository selected');
            return;
        }
        
        if (window.PageRouter) {
            PageRouter.navigateTo('explorer');
        } else if (typeof window.showExplorer === "function") {
            window.showExplorer();
        }
    }

    handleShowFileViewer() {
        if (window.PageRouter) {
            PageRouter.navigateTo('file');
        } else if (typeof window.showFileViewer === "function") {
            window.showFileViewer();
        }
    }

    // Misc actions
    handleStarRepo() {
        if (this.currentState.repository) {
            this.showNotification(`Starred ${this.currentState.repository}`);
        }
    }

    handleForkRepo() {
        if (this.currentState.repository) {
            this.showNotification(`Forked ${this.currentState.repository}`);
        }
    }

    handleToggleTheme() {
        if (window.coderViewEdit && typeof window.coderViewEdit.toggleTheme === "function") {
            window.coderViewEdit.toggleTheme();
        } else {
            this.toggleThemeFallback();
        }
    }

    handleAddTag() {
        if (typeof window.addTag === "function") {
            window.addTag();
        }
    }

    toggleThemeFallback() {
        const html = document.documentElement;
        const themeIcons = document.querySelectorAll("#themeIcon, #sidebarThemeIcon");
        const isDarkTheme = html.getAttribute("data-theme") === "dark";

        if (isDarkTheme) {
            html.setAttribute("data-theme", "light");
            themeIcons.forEach(icon => icon.className = "fas fa-sun");
        } else {
            html.setAttribute("data-theme", "dark");
            themeIcons.forEach(icon => icon.className = "fas fa-moon");
        }

        localStorage.setItem("gitcodr_theme", isDarkTheme ? "light" : "dark");
    }

    setupKeyboardShortcuts() {
        document.addEventListener("keydown", e => {
            // Escape key - close all modals and menus
            if (e.key === "Escape") {
                this.handleHideCreateRepoModal();
                this.handleHideCreateFileModal();
                this.handleHideDeleteFileModal();
                if (typeof window.hideContextMenu === "function") {
                    window.hideContextMenu();
                }
            }

            // Ctrl/Cmd + N - New file
            if ((e.ctrlKey || e.metaKey) && e.key === "n" && !e.shiftKey) {
                e.preventDefault();
                this.handleShowCreateFile();
            }

            // Ctrl/Cmd + Shift + N - New repository
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "n") {
                e.preventDefault();
                this.handleShowCreateRepo();
            }

            // Ctrl/Cmd + S - Save file
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (typeof window.saveFile === "function") {
                    window.saveFile();
                }
            }

            // Ctrl/Cmd + K - Search (if you have search functionality)
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                if (typeof window.showSearchModal === "function") {
                    window.showSearchModal();
                }
            }
        });
    }

    setupFormInteractions() {
        const tagInput = document.getElementById("tagInput");
        if (tagInput) {
            tagInput.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    this.handleAddTag();
                }
            });
        }

        const newFileName = document.getElementById("newFileName");
        if (newFileName) {
            newFileName.addEventListener("focus", () => newFileName.select());
        }

        const newRepoName = document.getElementById("newRepoName");
        if (newRepoName) {
            newRepoName.addEventListener("focus", () => newRepoName.select());
        }
    }

    setupModalInteractions() {
        // Close modals when clicking outside content
        const modals = [
            { id: "createRepoModal", handler: () => this.handleHideCreateRepoModal() },
            { id: "createFileModal", handler: () => this.handleHideCreateFileModal() },
            { id: "deleteFileModal", handler: () => this.handleHideDeleteFileModal() }
        ];

        modals.forEach(({ id, handler }) => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener("click", e => {
                    if (e.target === modal) {
                        handler();
                    }
                });
            }
        });
    }

    setupAdditionalListeners() {
        // Branch selector dropdown
        const branchSelector = document.getElementById("branchSelector");
        const branchDropdown = document.getElementById("branchDropdown");

        if (branchSelector && branchDropdown) {
            branchSelector.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                branchDropdown.classList.toggle("hide");
                branchDropdown.classList.toggle("show");
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener("click", e => {
            if (branchDropdown && !branchDropdown.contains(e.target) && e.target !== branchSelector) {
                branchDropdown.classList.remove("show");
                branchDropdown.classList.add("hide");
            }
        });

        // Sidebar triggers
        const leftSidebarTrigger = document.getElementById("leftSidebarTrigger");
        if (leftSidebarTrigger) {
            leftSidebarTrigger.addEventListener("click", e => {
                e.stopPropagation();
                if (this.sidebarManager && typeof this.sidebarManager.toggleLeftSidebar === "function") {
                    this.sidebarManager.toggleLeftSidebar();
                }
            });
        }

        const rightSidebarTrigger = document.getElementById("rightSidebarTrigger");
        if (rightSidebarTrigger) {
            rightSidebarTrigger.addEventListener("click", e => {
                e.stopPropagation();
                if (this.sidebarManager && typeof this.sidebarManager.toggleRightSidebar === "function") {
                    this.sidebarManager.toggleRightSidebar();
                }
            });
        }

        // Overlay click closes sidebars
        const overlay = document.getElementById("overlay");
        if (overlay) {
            overlay.addEventListener("click", () => {
                if (! this.sidebarManager) return;
                if (typeof this.sidebarManager.closeLeftSidebar === "function") {
                    this.sidebarManager.closeLeftSidebar();
                }
                if (typeof this.sidebarManager.closeRightSidebar === "function") {
                    this.sidebarManager.closeRightSidebar();
                }
            });
        }
    }

    
  showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.className = "fixed top-4 right-4 bg-github-canvas-overlay border border-github-border-default rounded-lg p-4 shadow-lg z-50";
        
        const iconColor = type === "success" ? "text-github-success-fg" : 
                          type === "error" ? "text-github-danger-fg" : 
                          "text-github-accent-fg";
        
        const iconPath = type === "success" 
            ? "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
            : type === "error"
            ? "M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
            : "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z";

        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 ${iconColor}" fill="currentColor" viewBox="0 0 16 16">
                    <path d="${iconPath}"/>
                </svg>
                <span class="text-github-fg-default text-sm">${message}</span>
            </div>
        `;

        // Add entrance animation
        notification.style.opacity = "0";
        notification.style.transform = "translateY(-10px)";
        notification.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        
        document.body.appendChild(notification);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateY(0)";
        });

        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-10px)";
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }





    setupGlobalEventDelegation() {
        document.addEventListener("click", e => {
            const target = e.target;

            // 1. Repository card click
            const repoCard = target.closest(".bg-github-canvas-overlay.border");
            if (repoCard?.querySelector("h3.text-github-accent-fg")) {
                const repoName = repoCard.querySelector("h3").textContent;
                if (repoName && typeof window.openRepository === "function") {
                    e.preventDefault();
                    window.openRepository(repoName);
                }
                return;
            }

            // 2. Sidebar repository item click (Fixed spacing in :not)
            const repoItem = target.closest(".repo-item");
            if (repoItem) {
                const repoName = repoItem.querySelector("span:not(.text-github-fg-muted)")?.textContent;
                if (repoName && typeof window.openRepository === "function") {
                    e.preventDefault();
                    window.openRepository(repoName);
                }
                return;
            }

            // 3. File row click (Specific to the File Explorer body)
            const fileRow = target.closest("#fileListBody tr");
            if (fileRow && !target.closest(".file-more-menu-btn")) {
                const fileName = fileRow.querySelector("td:first-child span")?.textContent;
                if (fileName && typeof window.viewFile === "function") {
                    e.preventDefault();
                    window.viewFile(fileName);
                }
                return;
            }

            // 4. Breadcrumb navigation
            const breadcrumbLink = target.closest("#pathBreadcrumb a");
            if (breadcrumbLink) {
                e.preventDefault();
                this.handleBreadcrumbClick(breadcrumbLink);
                return;
            }

            // 5. New File Action (Fixed syntax and merged into main delegation)
            const newFileBtn = target.closest('[data-action="new-file"]');
            if (newFileBtn) {
                e.preventDefault();
                this.handleNewFile();
                return;
            }
            
            // Close context menu if clicking anywhere else
            if (typeof window.hideContextMenu === "function") {
                window.hideContextMenu();
            }
        });
    }

    handleBreadcrumbClick(link) {
        const text = link.textContent.trim();
        const navigateTo = link.getAttribute("data-navigate");
        
        if (navigateTo && window.PageRouter) {
            window.PageRouter.navigateTo(navigateTo);
        } else if (text === "Repositories") {
            this.handleShowRepoSelector();
        } else if (text === this.currentState.repository) {
            this.handleNavigateRoot();
        } else {
            const pathSegment = link.getAttribute("data-path");
            if (pathSegment && typeof window.navigateToPath === "function") {
                window.navigateToPath(pathSegment);
            }
        }
    }

    handleNewFile() {
        if (window.coderViewEdit?.showNewFileDropdown) {
            const button = document.querySelector('[data-action="new-file"]');
            window.coderViewEdit.showNewFileDropdown({ currentTarget: button });
        }
    }
}


window.EventListenersManager = EventListenersManager;
window.eventListeners = new EventListenersManager();
window.setupEventListeners = sidebarManager => window.eventListeners.init(sidebarManager);
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