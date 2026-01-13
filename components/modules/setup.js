class builder {
  constructor() {
    this.registry = new Map();
    this.instances = new Map();
    this.instanceCounter = 0;
  }
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



  
  create(componentName, props = {}) { // Creation
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

      // Where to display it
      update(newProps) { // Update existing component
        this.props = { ...this.props, ...newProps };
        if (this.mounted && this.definition.lifecycle.onUpdate) {
          this.definition.lifecycle.onUpdate(this.element, this.props);
        }
        return this;
      },

      mount() { // Attach it to an element
        if (this.mounted) return this;
        
        if (this.definition.lifecycle.onMount) {
          this.definition.lifecycle.onMount(this.element, this.props);
        }
        
        this.mounted = true;
        return this;
      },

      destroy() { // Remove it cleanly
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
        
        this.instances.delete(this.id);
        return this;
      },

      // What to apply to it
      on(element, event, handler) { // Event listener
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


  
  mount(container, componentName, props = {}) {
    const instance = this.create(componentName, props);
    container.appendChild(instance.element);
    instance.mount();
    return instance;
  }
  unmount(element) {
    for (const [id, instance] of this.instances) {
      if (instance.element === element) {
        instance.destroy();
        break;
      }
    }
  }


 /**
  *
   *  Global Control & Info
  *
**/
  get(componentName) { // Get type
    return this.registry.get(componentName);
  }
  has(componentName) { // Get location
    return this.registry.has(componentName);
  }
  getAll() { // Locate all
    return Array.from(this.registry.keys());
  }
  destroyAll() { // Cleanly remove all
    for (const [id, instance] of this.instances) {
      instance.destroy();
    }
    this.instances.clear();
  }
  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }
}





// const globalRegistry = new builder();
// export { globalRegistry as builder, builder as builderClass };




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
