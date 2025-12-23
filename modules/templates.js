/**
 * Template Loader Module
 * Handles loading and injecting HTML templates into the DOM
 */

class TemplateLoader {
  constructor() {
    this.templates = new Map();
    this.cache = new Map();
    this.loadPromises = new Map();
  }

  /**
   * Load a template from a file
   * @param {string} name - Template name
   * @param {string} url - Template file URL
   * @returns {Promise<void>}
   */
  async loadTemplate(name, url) {
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }

    if (this.loadPromises.has(name)) {
      return this.loadPromises.get(name);
    }

    const loadPromise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load template ${name}: ${response.statusText}`);
        }
        const html = await response.text();
        
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Extract all <template> elements
        const templateElements = tempDiv.querySelectorAll('template');
        templateElements.forEach(template => {
          const id = template.id;
          if (id) {
            this.templates.set(id, template.content.cloneNode(true));
          }
        });
        
        this.cache.set(name, html);
        return html;
      } catch (error) {
        console.error(`Error loading template ${name}:`, error);
        throw error;
      } finally {
        this.loadPromises.delete(name);
      }
    })();

    this.loadPromises.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * Load multiple templates
   * @param {Object} templateMap - Map of template names to URLs
   * @returns {Promise<void[]>}
   */
  async loadTemplates(templateMap) {
    const promises = Object.entries(templateMap).map(([name, url]) => 
      this.loadTemplate(name, url)
    );
    return Promise.all(promises);
  }

  /**
   * Get a template by ID
   * @param {string} templateId - Template ID
   * @returns {DocumentFragment|null}
   */
  getTemplate(templateId) {
    const template = this.templates.get(templateId);
    return template ? template.cloneNode(true) : null;
  }

  /**
   * Inject a template into a target element
   * @param {string} templateId - Template ID
   * @param {HTMLElement|string} target - Target element or selector
   * @param {boolean} replace - Whether to replace existing content
   * @returns {HTMLElement|null}
   */
  injectTemplate(templateId, target, replace = true) {
    const templateContent = this.getTemplate(templateId);
    if (!templateContent) {
      console.warn(`Template ${templateId} not found`);
      return null;
    }

    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (!targetElement) {
      console.warn(`Target element not found`);
      return null;
    }

    if (replace) {
      targetElement.innerHTML = '';
    }

    targetElement.appendChild(templateContent);
    
    // Return the first child element that was added
    return targetElement.lastElementChild;
  }

  /**
   * Check if a template is loaded
   * @param {string} templateId - Template ID
   * @returns {boolean}
   */
  hasTemplate(templateId) {
    return this.templates.has(templateId);
  }

  /**
   * Clear all cached templates
   */
  clearCache() {
    this.templates.clear();
    this.cache.clear();
  }
}

// Create global instance
window.templateLoader = new TemplateLoader();
