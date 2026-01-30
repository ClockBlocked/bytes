class OverlayManager {
    constructor() {
        this.tooltipElement = null;
        this.activeOverlay = null;
        this.overlayStack = [];
        this.initialize();
    }

    initialize() {
        this.createTooltipElement();
        this.bindGlobalEvents();
        this.injectStyles();
    }

    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'absolute z-50 px-3 py-2 text-sm rounded-lg pointer-events-none opacity-0 transition-opacity duration-200 bg-canvas-overlay border border-border-default text-fg-default shadow-lg';
        document.body.appendChild(this.tooltipElement);
    }

    bindGlobalEvents() {
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            [data-tooltip] { cursor: help; position: relative; }
            .overlay-visible { opacity: 1 !important; }
            .overlay-hidden { display: none !important; }
            .overlay-backdrop { backdrop-filter: blur(4px); }
            @keyframes overlaySlideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes overlaySlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    handleMouseOver(event) {
        const target = event.target;
        const tooltipText = target.dataset.tooltip || target.title;
        
        if (tooltipText && tooltipText.trim() !== '') {
            this.displayTooltip(tooltipText, event.clientX, event.clientY);
            target.addEventListener('mousemove', this.handleTooltipMove.bind(this));
            target.addEventListener('mouseout', this.handleTooltipOut.bind(this));
        }
    }

    handleDocumentClick(event) {
        if (!event.target.closest('[data-context-menu]') && !event.target.closest('.context-menu')) {
            this.destroyContextMenu();
        }
        
        if (!event.target.closest('[data-modal]') && !event.target.closest('.modal-container')) {
            this.closeTopmostModal();
        }
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            this.destroyContextMenu();
            this.hideTooltip();
            this.closeTopmostModal();
        }
    }

    handleContextMenu(event) {
        event.preventDefault();
        const target = event.target.closest('[data-context-target]');
        if (target) {
            this.displayContextMenu(event.clientX, event.clientY, target.dataset.contextTarget);
        }
    }

    displayTooltip(content, x, y) {
        if (!this.tooltipElement) return;
        
        this.tooltipElement.textContent = content;
        this.tooltipElement.classList.add('overlay-visible');
        
        this.positionElement(this.tooltipElement, x, y, 10);
    }

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('overlay-visible');
        }
    }

    handleTooltipMove(event) {
        this.displayTooltip(event.target.dataset.tooltip || event.target.title, event.clientX, event.clientY);
    }

    handleTooltipOut() {
        this.hideTooltip();
    }

    displayContextMenu(x, y, targetId) {
        this.destroyContextMenu();
        
        const menuContainer = document.createElement('div');
        menuContainer.className = 'fixed z-40 context-menu';
        menuContainer.style.left = `${x}px`;
        menuContainer.style.top = `${y}px`;
        
        const menuContent = this.buildContextMenuContent(targetId);
        menuContainer.innerHTML = menuContent;
        document.body.appendChild(menuContainer);
        
        this.positionElement(menuContainer, x, y, 0);
        this.activeOverlay = menuContainer;
    }

    buildContextMenuContent(targetId) {
        const actions = {
            file: ['view', 'edit', 'duplicate', 'download', 'rename', 'delete'],
            folder: ['open', 'rename', 'delete', 'compress'],
            image: ['view', 'download', 'edit', 'delete'],
            default: ['view', 'delete']
        };
        
        const targetType = this.determineTargetType(targetId);
        const availableActions = actions[targetType] || actions.default;
        
        return `
            <div class="bg-canvas-overlay border border-border-default rounded-lg shadow-2xl py-2 min-w-[180px]">
                ${availableActions.map(action => this.renderContextMenuItem(action, targetId)).join('')}
            </div>
        `;
    }

    determineTargetType(targetId) {
        if (targetId.includes('.')) {
            const extension = targetId.split('.').pop().toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
            return imageExtensions.includes(extension) ? 'image' : 'file';
        }
        return 'folder';
    }

    renderContextMenuItem(action, targetId) {
        const icons = {
            view: 'M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z',
            edit: 'M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z',
            download: 'M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z',
            delete: 'M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z',
            rename: 'M13.488 2.513a1.75 1.75 0 0 1 2.475 2.475L6.024 14.926a2.25 2.25 0 0 1-.956.586l-3.12.93a.75.75 0 0 1-.93-.93l.93-3.12a2.25 2.25 0 0 1 .586-.956L13.488 2.513Z',
            duplicate: 'M2.5 2.75a.25.25 0 0 1 .25-.25h6.5a.25.25 0 0 1 .25.25v6.5a.25.25 0 0 1-.25.25h-6.5a.25.25 0 0 1-.25-.25v-6.5ZM3.5 3.5v5h5v-5h-5ZM2.75 11a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5H.75a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 .75-.75ZM11 2.75a.25.25 0 0 1 .25-.25h6.5a.25.25 0 0 1 .25.25v6.5a.25.25 0 0 1-.25.25h-6.5a.25.25 0 0 1-.25-.25v-6.5ZM12 3.5v5h5v-5h-5Z',
            open: 'M2.22 2.22a.75.75 0 0 1 1.06 0L6.5 5.44V2.75a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1 0-1.5h2.69L2.22 3.28a.75.75 0 0 1 0-1.06Z',
            compress: 'M3.75 2.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5ZM3.75 6a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5ZM3 10.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM13.75 10.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z'
        };
        
        const labels = {
            view: 'View',
            edit: 'Edit',
            download: 'Download',
            delete: 'Delete',
            rename: 'Rename',
            duplicate: 'Duplicate',
            open: 'Open',
            compress: 'Compress'
        };
        
        return `
            <button onclick="overlayManager.executeAction('${action}', '${targetId}')" 
                    class="w-full text-left px-4 py-2.5 text-sm text-fg-default hover:bg-canvas-subtle flex items-center space-x-3 transition-colors duration-150">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="${icons[action]}"/>
                </svg>
                <span>${labels[action]}</span>
            </button>
        `;
    }

    executeAction(action, targetId) {
        const actionHandlers = {
            view: () => this.triggerEvent('file-view', { target: targetId }),
            edit: () => this.triggerEvent('file-edit', { target: targetId }),
            download: () => this.triggerEvent('file-download', { target: targetId }),
            delete: () => this.triggerEvent('file-delete', { target: targetId }),
            rename: () => this.triggerEvent('file-rename', { target: targetId }),
            duplicate: () => this.triggerEvent('file-duplicate', { target: targetId }),
            open: () => this.triggerEvent('folder-open', { target: targetId }),
            compress: () => this.triggerEvent('folder-compress', { target: targetId })
        };
        
        if (actionHandlers[action]) {
            actionHandlers[action]();
            this.destroyContextMenu();
        }
    }

    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail, bubbles: true });
        document.dispatchEvent(event);
    }

    destroyContextMenu() {
        if (this.activeOverlay && this.activeOverlay.classList.contains('context-menu')) {
            this.activeOverlay.remove();
            this.activeOverlay = null;
        }
    }

    displayModal(config) {
        const modalId = `modal-${Date.now()}`;
        const modalTemplate = this.buildModalTemplate(config, modalId);
        
        const modalContainer = document.createElement('div');
        modalContainer.id = modalId;
        modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modalContainer.innerHTML = modalTemplate;
        
        document.body.appendChild(modalContainer);
        this.overlayStack.push(modalId);
        this.activeOverlay = modalContainer;
        
        this.animateElement(modalContainer.querySelector('.modal-content'), 'overlaySlideDown');
    }

    buildModalTemplate(config, modalId) {
        return `
            <div class="absolute inset-0 bg-canvas-overlay/80 overlay-backdrop" onclick="overlayManager.closeModal('${modalId}')"></div>
            <div class="modal-content relative bg-canvas-default border border-border-default rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-overlaySlideDown">
                <div class="flex items-center justify-between p-6 border-b border-border-muted">
                    <h3 class="text-lg font-semibold text-fg-default">${config.title}</h3>
                    <button onclick="overlayManager.closeModal('${modalId}')" class="p-1.5 rounded-lg hover:bg-canvas-subtle transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
                        </svg>
                    </button>
                </div>
                <div class="p-6 text-fg-muted">${config.content}</div>
                ${config.actions ? this.buildModalActions(config.actions, modalId) : ''}
            </div>
        `;
    }

    buildModalActions(actions, modalId) {
        const actionButtons = actions.map(action => {
            const variantClasses = {
                primary: 'bg-accent-fg text-white hover:bg-accent-emphasis',
                secondary: 'bg-canvas-subtle text-fg-default hover:bg-canvas-muted border border-border-default',
                danger: 'bg-danger-fg text-white hover:bg-danger-emphasis'
            };
            
            return `
                <button onclick="${action.handler}; overlayManager.closeModal('${modalId}')"
                        class="px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 ${variantClasses[action.variant] || variantClasses.secondary}">
                    ${action.label}
                </button>
            `;
        }).join('');
        
        return `
            <div class="flex items-center justify-end gap-3 p-6 border-t border-border-muted">
                ${actionButtons}
            </div>
        `;
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.animateElement(modal.querySelector('.modal-content'), 'overlaySlideUp', () => {
                modal.remove();
                this.overlayStack = this.overlayStack.filter(id => id !== modalId);
                this.activeOverlay = this.overlayStack.length > 0 ? document.getElementById(this.overlayStack[this.overlayStack.length - 1]) : null;
            });
        }
    }

    closeTopmostModal() {
        if (this.overlayStack.length > 0) {
            this.closeModal(this.overlayStack[this.overlayStack.length - 1]);
        }
    }

    displayNotification(message, type = 'info') {
        const notificationId = `notification-${Date.now()}`;
        const icon = {
            success: 'M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z',
            error: 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646Z',
            info: 'M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM8 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1 7a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v4Z'
        };
        
        const colorClass = {
            success: 'bg-success-fg',
            error: 'bg-danger-fg',
            info: 'bg-accent-fg'
        };
        
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `fixed top-4 right-4 ${colorClass[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-overlaySlideDown`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="${icon[type]}"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            this.animateElement(notification, 'overlaySlideUp', () => {
                notification.remove();
            });
        }, type === 'error' ? 5000 : 3000);
    }

    positionElement(element, x, y, offset) {
        element.style.left = `${x + offset}px`;
        element.style.top = `${y + offset}px`;
        
        requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            if (rect.right > viewportWidth) {
                element.style.left = `${x - rect.width - offset}px`;
            }
            if (rect.bottom > viewportHeight) {
                element.style.top = `${y - rect.height - offset}px`;
            }
        });
    }

    animateElement(element, animationName, callback) {
        if (!element) return;
        
        element.style.animation = `${animationName} 0.3s ease forwards`;
        
        if (callback) {
            setTimeout(callback, 300);
        }
    }
}

const overlayManager = new OverlayManager();