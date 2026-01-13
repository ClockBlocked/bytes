/**
 * Component Registry System
 * Core factory and lifecycle management for vanilla JavaScript components
 */

class builder {
  constructor() {
    this.registry = new Map();
    this.instances = new Map();
    this.instanceCounter = 0;
  }

  /**
   * Register a component definition
   * @param {Object} definition - Component definition with name, template, styles, etc.
   * @returns {builder} - For chaining
   */
  register(definition) {
    if (!definition.name) {
      throw new Error('Component definition must have a name');
    }
    
    this.registry.set(definition.name, {
      ...definition,
      version: definition.version || '1.0.0',
      dependencies: definition.dependencies || [],
      props: definition.props || {},
      methods: definition.methods || {},
      lifecycle: definition.lifecycle || {}
    });
    
    return this;
  }

  /**
   * Create a component instance
   * @param {string} componentName - Registered component name
   * @param {Object} props - Properties to pass to component
   * @returns {ComponentInstance} - Instantiated component
   */
  create(componentName, props = {}) {
    const definition = this.registry.get(componentName);
    
    if (!definition) {
      throw new Error(`Component '${componentName}' not registered`);
    }

    const instanceId = `${componentName}-${++this.instanceCounter}`;
    const element = definition.template(props);
    
    const instance = {
      id: instanceId,
      name: componentName,
      element,
      props,
      definition,
      mounted: false,
      listeners: [],

      // Update component props and trigger lifecycle
      update(newProps) {
        this.props = { ...this.props, ...newProps };
        if (this.mounted && this.definition.lifecycle.onUpdate) {
          this.definition.lifecycle.onUpdate(this.element, this.props);
        }
        return this;
      },

      // Mount component to DOM and trigger lifecycle
      mount() {
        if (this.mounted) return this;
        
        if (this.definition.lifecycle.onMount) {
          this.definition.lifecycle.onMount(this.element, this.props);
        }
        
        this.mounted = true;
        return this;
      },

      // Unmount and cleanup
      destroy() {
        if (this.definition.lifecycle.onDestroy) {
          this.definition.lifecycle.onDestroy(this.element);
        }
        
        // Remove all event listeners
        this.listeners.forEach(({ target, event, handler }) => {
          target.removeEventListener(event, handler);
        });
        
        this.listeners = [];
        this.mounted = false;
        
        // Remove from DOM
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        
        this.instances.delete(this.id);
        return this;
      },

      // Attach event listener with automatic cleanup
      on(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ target: element, event, handler });
        return this;
      },

      // Call registered method
      call(methodName, ...args) {
        if (!this.definition.methods[methodName]) {
          throw new Error(`Method '${methodName}' not found on component '${this.name}'`);
        }
        return this.definition.methods[methodName].call(this, ...args);
      }
    };

    this.instances.set(instanceId, instance);
    return instance;
  }

  /**
   * Quickly mount a component to an existing element
   * @param {HTMLElement} container - DOM element to mount to
   * @param {string} componentName - Registered component name
   * @param {Object} props - Component props
   * @returns {ComponentInstance}
   */
  mount(container, componentName, props = {}) {
    const instance = this.create(componentName, props);
    container.appendChild(instance.element);
    instance.mount();
    return instance;
  }

  /**
   * Unmount a component from DOM and cleanup
   * @param {HTMLElement} element - Component element to unmount
   */
  unmount(element) {
    for (const [id, instance] of this.instances) {
      if (instance.element === element) {
        instance.destroy();
        break;
      }
    }
  }

  /**
   * Get registered component definition
   * @param {string} componentName
   * @returns {Object} - Component definition
   */
  get(componentName) {
    return this.registry.get(componentName);
  }

  /**
   * Check if component is registered
   * @param {string} componentName
   * @returns {boolean}
   */
  has(componentName) {
    return this.registry.has(componentName);
  }

  /**
   * Get all registered components
   * @returns {string[]} - Array of component names
   */
  getAll() {
    return Array.from(this.registry.keys());
  }

  /**
   * Destroy all instances
   */
  destroyAll() {
    for (const [id, instance] of this.instances) {
      instance.destroy();
    }
    this.instances.clear();
  }

  /**
   * Get instance by ID
   * @param {string} instanceId
   * @returns {ComponentInstance}
   */
  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }
}

// Create singleton instance
const globalRegistry = new builder();

export { globalRegistry as builder, builder as builderClass };