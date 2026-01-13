// Main entry point - registers all components and makes everything global

// Function to initialize all components
window.initializeComponents = function() {
  console.log('Initializing components...');
  
  // Check if builder exists
  if (!window.builder) {
    console.error('Builder not found. Make sure setup.js loads first!');
    return null;
  }
  
  // Check if components exist
  if (!window.Modal) {
    console.error('Modal component not found. Make sure overlays.js loads!');
    return null;
  }
  
  // Register all components
  const builder = window.builder;
  
  // Register overlays
  if (window.Modal) builder.register(window.Modal);
  if (window.Tooltip) builder.register(window.Tooltip);
  if (window.Dropdown) builder.register(window.Dropdown);
  if (window.Dialog) builder.register(window.Dialog);
  if (window.Popover) builder.register(window.Popover);
  
  // Register notifications
  if (window.Toast) builder.register(window.Toast);
  if (window.Alert) builder.register(window.Alert);
  if (window.Badge) builder.register(window.Badge);
  
  if (window.CodeBlock) builder.register(CodeBlock);

  // Register code components
//  if (window.CodeViewer) builder.register(window.CodeViewer);
//  if (window.CodeEditor) builder.register(window.CodeEditor);
  
  console.log('Components registered successfully!');
  console.log('Available components:', builder.getAll());
  
  return builder;
};

// Make builder globally accessible
window.ComponentBuilder = window.builder;

// Auto-initialize when all scripts are loaded
window.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure all scripts are loaded
  setTimeout(() => {
    if (window.builder && window.Modal) {
      window.initializeComponents();
      
      // Show a welcome toast
      if (window.showToast) {
        setTimeout(() => {
          window.showToast('👋 Component System Ready! Click buttons to demo.', 'success');
        }, 1000);
      }
    } else {
      console.warn('Components not ready yet. Call initializeComponents() manually.');
    }
  }, 100);
});
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
