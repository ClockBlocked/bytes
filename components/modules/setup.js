class builder {
  constructor() {
    this.registry = new Map();
    this.instances = new Map();
    this.instanceCounter = 0;
  }

  //  Handling the components setups
  register(definition) {
    if (!definition || typeof definition !== 'object') {
      throw new Error('Component definition must be an object');
    }
    if (!definition.name) {
      throw new Error('Component definition must have a name');
    }
    if (this.registry.has(definition.name)) {
      console.warn(`Component '${definition.name}' is already registered. Skipping.`);
      return this;
    }
    if (typeof definition.template !== 'function') {
      throw new Error(`Component '${definition.name}' must provide a template function`);
    }

    this.registry.set(definition.name, {
      ...definition,
      version: definition.version || '1.0.0',
      dependencies: definition.dependencies || [],
      props: definition.props || {},
      methods: definition.methods || {},
      lifecycle: definition.lifecycle || {}
    });
    
    console.log(`Registered component: ${definition.name} v${definition.version || '1.0.0'}`);
    return this;
  }
  
  create(componentName, props = {}) { // Creation of instance
    const definition = this.registry.get(componentName);
    if (!definition) {
      throw new Error(`Component '${componentName}' not registered. Available: ${Array.from(this.registry.keys()).join(', ')}`);
    }

    const instanceId = `${componentName}-${++this.instanceCounter}`;
    const element = definition.template(props);
    if (!(element instanceof Element)) {
      throw new Error(
        `Component '${componentName}' template must return a DOM Element; got '${typeof element}'`
      );
    }

    const builderRef = this;

    const instance = {
      id: instanceId,
      name: componentName,
      element,
      props,
      definition,
      mounted: false,
      listeners: [],

      update(newProps) {
        this.props = { ...this.props, ...newProps };
        if (this.mounted && this.definition.lifecycle.onUpdate) {
          this.definition.lifecycle.onUpdate(this.element, this.props);
        }
        return this;
      },

      mount() {
        if (this.mounted) return this;
        if (this.definition.lifecycle.onMount) {
          this.definition.lifecycle.onMount(this.element, this.props);
        }
        this.mounted = true;
        return this;
      },

      destroy() {
        if (this.definition.lifecycle.onDestroy) {
          this.definition.lifecycle.onDestroy(this.element);
        }

        this.listeners.forEach(({ target, event, handler }) => {
          target.removeEventListener(event, handler);
        });

        this.listeners = [];
        this.mounted = false;

        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }

        builderRef.instances.delete(this.id);
        return this;
      },

      on(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ target: element, event, handler });
        return this;
      },

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
  
  mount(container, componentName, props = {}) { // Mount to DOM
    if (!container || typeof container.appendChild !== 'function') {
      throw new Error('Container must be a DOM node that supports appendChild');
    }
    const instance = this.create(componentName, props);
    container.appendChild(instance.element);
    instance.mount();
    return instance;
  }

  unmount(element) { // Unmount from DOM
    for (const [, instance] of this.instances) {
      if (instance.element === element) {
        instance.destroy();
        break;
      }
    }
  }

  get(componentName) { // Get component definition
    return this.registry.get(componentName);
  }

  has(componentName) { // Check if component is registered
    return this.registry.has(componentName);
  }

  getAll() { // Get all registered component names
    return Array.from(this.registry.keys());
  }

  destroyAll() { // Destroy all instances
    for (const [, instance] of this.instances) {
      instance.destroy();
    }
    this.instances.clear();
  }

  getInstance(instanceId) { // Get instance by ID
    return this.instances.get(instanceId);
  }
}

// Create global builder instance
const globalBuilder = new builder();

// Make everything globally accessible
window.builder = globalBuilder;
window.BuilderClass = builder; // Export the class itself

console.log('Component builder initialized!');
