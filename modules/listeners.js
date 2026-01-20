
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
            "hide-delete-file-modal":  () => this.handleHideDeleteFileModal()
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
        if (!this.currentState.repository) {
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
        // Use new architecture if available
        if (window.coderViewEdit && typeof window.coderViewEdit.toggleTheme === "function") {
            window.coderViewEdit.toggleTheme();
        } else if (window.coderViewEdit && window.fileManager && typeof window.coderViewEdit.toggleTheme === "function") {
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
            if (e.key === "Escape") {
                this.handleHideCreateRepoModal();
                this.handleHideCreateFileModal();
                this.handleHideDeleteFileModal();
                if (typeof window.hideContextMenu === "function") {
                    window.hideContextMenu();
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "n" && !e.shiftKey) {
                e.preventDefault();
                this.handleShowCreateFile();
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "n") {
                e.preventDefault();
                this.handleShowCreateRepo();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                // Use new architecture if available
                if (window.coderViewEdit && window.fileManager && typeof window.fileManager.saveChanges === "function") {
                    window.fileManager.saveChanges();
                } else if (typeof window.saveFile === "function") {
                    window.saveFile();
                }
            }

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

        document.addEventListener("click", e => {
            if (branchDropdown && !branchDropdown.contains(e.target) && e.target !== branchSelector) {
                branchDropdown.classList.remove("show");
                branchDropdown.classList.add("hide");
            }
        });

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

        const overlay = document.getElementById("overlay");
        if (overlay) {
            overlay.addEventListener("click", () => {
                if (!this.sidebarManager) return;
                if (typeof this.sidebarManager.closeLeftSidebar === "function") {
                    this.sidebarManager.closeLeftSidebar();
                }
                if (typeof this.sidebarManager.closeRightSidebar === "function") {
                    this.sidebarManager.closeRightSidebar();
                }
            });
        }
    }

    setupGlobalEventDelegation() {
        document.addEventListener("click", e => {
            const repoCard = e.target.closest(".bg-github-canvas-overlay.border");
            if (repoCard && repoCard.querySelector("h3.text-github-accent-fg")) {
                const repoName = repoCard.querySelector("h3").textContent;
                if (repoName && typeof window.openRepository === "function") {
                    e.preventDefault();
                    window.openRepository(repoName);
                }
                return;
            }

            const repoItem = e.target.closest(".repo-item");
            if (repoItem) {
                const repoName = repoItem.querySelector("span: not(.text-github-fg-muted)")?.textContent;
                if (repoName && typeof window.openRepository === "function") {
                    e.preventDefault();
                    window.openRepository(repoName);
                }
                return;
            }

            const recentFileItem = e.target.closest(".recent-file-item");
            if (recentFileItem) {
                const fileName = recentFileItem.querySelector(".text-github-fg-default")?.textContent;
                const repoName = recentFileItem.querySelector(".text-github-fg-muted")?.textContent;
                if (fileName && repoName && typeof window.openRecentFile === "function") {
                    e.preventDefault();
                    window.openRecentFile(repoName, "", fileName);
                }
                return;
            }

            const fileRow = e.target.closest("tbody tr");
            if (fileRow && fileRow.parentElement && fileRow.parentElement.id === "fileListBody") {
                if (e.target.closest(".file-more-menu-btn")) return;
                
                const fileName = fileRow.querySelector("td:first-child span")?.textContent;
                if (fileName && typeof window.viewFile === "function") {
                    e.preventDefault();
                    window.viewFile(fileName);
                }
                return;
            }

            const breadcrumbLink = e.target.closest("#pathBreadcrumb a");
            if (breadcrumbLink) {
                e.preventDefault();
                const text = breadcrumbLink.textContent.trim();
                
                const navigateTo = breadcrumbLink.getAttribute("data-navigate");
                if (navigateTo && window.PageRouter) {
                    PageRouter.navigateTo(navigateTo);
                    return;
                }
                
                if (text === "Repositories") {
                    this.handleShowRepoSelector();
                } else if (text === this.currentState.repository) {
                    this.handleNavigateRoot();
                } else {
                    const pathSegment = breadcrumbLink.getAttribute("data-path");
                    if (pathSegment && typeof window.navigateToPath === "function") {
                        window.navigateToPath(pathSegment);
                    }
                }
                return;
            }

            const editBtn = e.target.closest("#editToggleBtn, .edit-btn");
            if (editBtn) {
                e.preventDefault();
                // Use new architecture if available
                if (window.coderViewEdit && window.fileManager && typeof window.fileManager.enterEditMode === "function") {
                    window.fileManager.enterEditMode();
                } else if (window.coderViewEdit && typeof window.coderViewEdit.enterEditMode === "function") {
                    window.coderViewEdit.enterEditMode();
                }
                return;
            }

            const saveBtn = e.target.closest("#saveChangesBtn, .commit-btn");
            if (saveBtn) {
                e.preventDefault();
                // Use new architecture if available
                if (window.coderViewEdit && window.fileManager && typeof window.fileManager.saveChanges === "function") {
                    window.fileManager.saveChanges();
                } else if (window.coderViewEdit && typeof window.coderViewEdit.saveChanges === "function") {
                    window.coderViewEdit.saveChanges();
                }
                return;
            }

            const cancelBtn = e.target.closest("#cancelEditBtn, .cancel-btn");
            if (cancelBtn) {
                e.preventDefault();
                // Use new architecture if available
                if (window.coderViewEdit && window.fileManager && typeof window.fileManager.cancelEdit === "function") {
                    window.fileManager.cancelEdit();
                } else if (window.coderViewEdit && typeof window.coderViewEdit.cancelEdit === "function") {
                    window.coderViewEdit.cancelEdit();
                }
                return;
            }
        });

        document.addEventListener("click", () => {
            if (typeof window.hideContextMenu === "function") {
                window.hideContextMenu();
            }
        });
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

        notification.style.opacity = "0";
        notification.style.transform = "translateY(-10px)";
        notification.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateY(0)";
        });

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
}

window.EventListenersManager = EventListenersManager;
window.eventListeners = new EventListenersManager();
window.setupEventListeners = sidebarManager => window.eventListeners.init(sidebarManager);