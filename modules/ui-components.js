/**
 * UI Component Utilities
 * Factory functions for creating reusable UI components
 */

// Prevent namespace conflicts
if (typeof window.UIComponents !== 'undefined') {
  console.warn('UIComponents already exists on window. Skipping re-initialization.');
} else {
  window.UIComponents = {
  
  /**
   * Whitelist of allowed SVG tags for icons
   * @private
   */
  _allowedSVGTags: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'use'],
  
  /**
   * Check if content is a trusted icon (SVG or known safe HTML)
   * @private
   * @param {string} content - Content to check
   * @returns {boolean}
   */
  _isTrustedIcon(content) {
    if (typeof content !== 'string') return false;
    
    // Check if it's an SVG (safest for icons)
    if (content.trim().startsWith('<svg')) {
      // Verify it only contains allowed SVG tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) return false;
      
      // Check all elements are in whitelist
      const allElements = doc.getElementsByTagName('*');
      for (let elem of allElements) {
        if (!this._allowedSVGTags.includes(elem.tagName.toLowerCase())) {
          return false;
        }
      }
      return true;
    }
    
    // Check if it's a simple, safe HTML entity or character
    if (/^[&][a-zA-Z0-9#]+[;]$/.test(content.trim()) || 
        /^[^<>]+$/.test(content.trim())) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Safely create an element from trusted HTML string
   * @private
   * @param {string} html - HTML string (must be trusted)
   * @returns {HTMLElement|null}
   */
  _createElementFromHTML(html) {
    if (!this._isTrustedIcon(html)) {
      console.error('UIComponents: Attempted to create element from untrusted HTML');
      return null;
    }
    
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  },
  
  /**
   * Safely set icon content (only allows trusted SVG or safe text)
   * @private
   * @param {HTMLElement} element - Element to set icon in
   * @param {string} icon - Icon content (SVG or text)
   */
  _setIconSafely(element, icon) {
    if (!icon || typeof icon !== 'string') return;
    
    // Check if it's trusted SVG or safe HTML
    if (this._isTrustedIcon(icon)) {
      try {
        if (icon.trim().startsWith('<svg')) {
          const svgElement = this._createElementFromHTML(icon);
          if (svgElement) {
            element.appendChild(svgElement);
          } else {
            // Fallback to text if SVG parsing failed
            element.textContent = '⚠️';
          }
        } else {
          element.innerHTML = icon; // Safe for HTML entities
        }
      } catch (e) {
        console.error('UIComponents: Failed to set icon safely', e);
        element.textContent = '⚠️';
      }
    } else {
      // Not trusted - use as text only
      element.textContent = icon;
    }
  },
  
  /**
   * Create a button element with consistent styling
   * @param {Object} options - Button configuration
   * @returns {HTMLElement}
   */
  createButton({
    id = '',
    className = 'headerButton',
    title = '',
    ariaLabel = '',
    icon = '',
    text = '',
    onClick = null,
    disabled = false
  } = {}) {
    const button = document.createElement('button');
    
    if (id) button.id = id;
    button.className = className;
    if (title) button.title = title;
    if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
    if (disabled) button.disabled = true;
    
    if (icon) {
      const iconSpan = document.createElement('span');
      this._setIconSafely(iconSpan, icon);
      button.appendChild(iconSpan);
    }
    
    if (text) {
      const textSpan = document.createElement('span');
      textSpan.textContent = text; // Always use textContent for text
      button.appendChild(textSpan);
    }
    
    if (onClick && typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    
    return button;
  },
  
  /**
   * Create a button group with separator
   * @param {Array} buttons - Array of button configurations
   * @param {boolean} withSeparator - Add separator after group
   * @returns {HTMLElement}
   */
  createButtonGroup(buttons = [], withSeparator = false) {
    const group = document.createElement('div');
    group.className = 'hGroup';
    
    buttons.forEach(buttonConfig => {
      const button = this.createButton(buttonConfig);
      group.appendChild(button);
    });
    
    return group;
  },
  
  /**
   * Create a separator element
   * @param {string} className - CSS class for separator
   * @returns {HTMLElement}
   */
  createSeparator(className = 'headerSeparator') {
    const separator = document.createElement('div');
    separator.className = className;
    separator.setAttribute('role', 'separator');
    separator.setAttribute('aria-orientation', 'vertical');
    return separator;
  },
  
  /**
   * Create an input field with wrapper
   * @param {Object} options - Input configuration
   * @returns {HTMLElement}
   */
  createInput({
    id = '',
    type = 'text',
    placeholder = '',
    value = '',
    className = '',
    wrapperClass = '',
    label = '',
    ariaLabel = ''
  } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClass || 'input-wrapper';
    
    if (label) {
      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      if (id) labelEl.setAttribute('for', id);
      wrapper.appendChild(labelEl);
    }
    
    const input = document.createElement('input');
    if (id) input.id = id;
    input.type = type;
    if (placeholder) input.placeholder = placeholder;
    if (value) input.value = value;
    if (className) input.className = className;
    if (ariaLabel) input.setAttribute('aria-label', ariaLabel);
    
    wrapper.appendChild(input);
    return wrapper;
  },
  
  /**
   * Create a badge/pill element
   * @param {Object} options - Badge configuration
   * @returns {HTMLElement}
   */
  createBadge({
    text = '',
    className = 'badge',
    variant = 'default', // default, success, warning, danger, info
    icon = ''
  } = {}) {
    const badge = document.createElement('span');
    badge.className = `${className} badge-${variant}`;
    
    if (icon) {
      const iconSpan = document.createElement('span');
      this._setIconSafely(iconSpan, icon);
      badge.appendChild(iconSpan);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text; // Always use textContent for safety
    badge.appendChild(textSpan);
    
    return badge;
  },
  
  /**
   * Create a dropdown menu
   * @param {Object} options - Dropdown configuration
   * @returns {HTMLElement}
   */
  createDropdown({
    id = '',
    className = 'dropdown',
    items = [],
    position = 'right' // left, right, center
  } = {}) {
    const dropdown = document.createElement('div');
    if (id) dropdown.id = id;
    dropdown.className = `${className} ${position === 'right' ? 'dropdownRight' : ''}`;
    dropdown.classList.add('hide');
    
    const content = document.createElement('div');
    content.className = 'dropdownContent';
    
    items.forEach((item, index) => {
      if (item.type === 'divider') {
        const divider = document.createElement('div');
        divider.className = 'dropdownDivider';
        content.appendChild(divider);
      } else {
        const button = document.createElement('button');
        button.className = 'dropdownItem';
        if (item.active) button.classList.add('active');
        
        if (item.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'dropdownIcon';
          this._setIconSafely(iconSpan, item.icon);
          button.appendChild(iconSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = item.text || ''; // Use textContent for safety
        button.appendChild(textSpan);
        
        if (item.onClick && typeof item.onClick === 'function') {
          button.addEventListener('click', (e) => {
            item.onClick(e);
            dropdown.classList.add('hide');
          });
        }
        
        content.appendChild(button);
      }
    });
    
    dropdown.appendChild(content);
    return dropdown;
  },
  
  /**
   * Create a modal dialog
   * @param {Object} options - Modal configuration
   * @returns {HTMLElement}
   */
  createModal({
    id = '',
    title = '',
    content = '',
    footer = null,
    className = '',
    closeButton = true,
    onClose = null
  } = {}) {
    const modal = document.createElement('div');
    if (id) modal.id = id;
    modal.className = `modal-overlay ${className}`;
    modal.classList.add('hide');
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title; // Use textContent for safety
    header.appendChild(titleEl);
    
    if (closeButton) {
      const closeBtn = this.createButton({
        className: 'modal-close',
        ariaLabel: 'Close modal',
        text: '×', // Use text instead of icon for close button
        onClick: () => {
          this.closeModal(modal);
          if (onClose) onClose();
        }
      });
      header.appendChild(closeBtn);
    }
    
    modalContent.appendChild(header);
    
    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    if (typeof content === 'string') {
      // For safety, use textContent unless content is an HTMLElement
      body.textContent = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
    modalContent.appendChild(body);
    
    // Footer
    if (footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'modal-footer';
      if (typeof footer === 'string') {
        footerEl.textContent = footer; // Use textContent for safety
      } else if (footer instanceof HTMLElement) {
        footerEl.appendChild(footer);
      }
      modalContent.appendChild(footerEl);
    }
    
    modal.appendChild(modalContent);
    return modal;
  },
  
  /**
   * Show a modal
   * @param {HTMLElement} modal - Modal element to show
   */
  showModal(modal) {
    if (modal) {
      modal.classList.remove('hide');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  },
  
  /**
   * Close a modal
   * @param {HTMLElement} modal - Modal element to close
   */
  closeModal(modal) {
    if (modal) {
      modal.classList.add('hide');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  },
  
  /**
   * Create a loading spinner
   * @param {Object} options - Spinner configuration
   * @returns {HTMLElement}
   */
  createSpinner({
    size = 'medium', // small, medium, large
    className = ''
  } = {}) {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size} ${className}`;
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', 'Loading');
    
    const spinnerInner = document.createElement('div');
    spinnerInner.className = 'spinner-inner';
    spinner.appendChild(spinnerInner);
    
    return spinner;
  },
  
  /**
   * Create a toast notification
   * @param {Object} options - Toast configuration
   * @returns {HTMLElement}
   */
  createToast({
    message = '',
    type = 'info', // success, error, warning, info
    duration = 3000,
    position = 'top-right' // top-left, top-right, bottom-left, bottom-right
  } = {}) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-${position}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
    
    return toast;
  },
  
  /**
   * Debounce function for performance
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function}
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Throttle function for performance
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit time in ms
   * @returns {Function}
   */
  throttle(func, limit = 250) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Close the conditional block
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIComponents;
}
