// Demo functions that will be available globally
window.demoModal = function() {
  const modal = window.builder.create('modal', {
    title: 'Welcome to Component System',
    content:  'This is a reusable modal component created with vanilla JavaScript! ',
    actions: [
      { id: 'close', label: 'Close', style: 'secondary' },
      {
        id: 'confirm',
        label:  'Confirm',
        style: 'primary',
        callback: () => window.showToast('Confirmed!', 'success')
      }
    ]
  });

  document.body.appendChild(modal.element);
  modal.mount();
};

window.demoDropdown = function() {
  const dropdown = window.builder.create('dropdown', {
    label: 'Actions',
    items: [
      { label: 'Edit', callback: () => window.showToast('Edit clicked') },
      { label: 'Delete', callback: () => window.showToast('Delete clicked', 'error') },
      { label:  'Share', callback: () => window.showToast('Share clicked', 'info') }
    ]
  });

  document.getElementById('dropdown-container').appendChild(dropdown.element);
  dropdown.mount();
};

window.demoTooltip = function() {
  const tooltip = window.builder.create('tooltip', {
    trigger: 'Hover over me →',
    content:  'This is a helpful tooltip!',
    position: 'top'
  });

  document.getElementById('tooltip-container').appendChild(tooltip.element);
  tooltip.mount();
};

window.showToast = function(message, type = 'info') {
  const toast = window.builder.create('toast', {
    message,
    type,
    icon: type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ',
    duration:  3000
  });

  document.body.appendChild(toast.element);
  toast.mount();
};

window.demoCodeViewer = function() {
  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // Output: 55`;

  const container = document.getElementById('code-viewer-container');
  
  // Clear any existing content
  container.innerHTML = '';

  // Use the unified CodeBlock component in 'viewer' mode
  const viewer = window.builder.create('codeBlock', {
    filename: 'fibonacci.js',
    language: 'javascript',
    code,
    mode: 'viewer'
  });

  container.appendChild(viewer.element);
  viewer.mount();
};

window.demoCodeEditor = function() {
  const container = document.getElementById('code-editor-container');
  
  // Clear any existing content
  container.innerHTML = '';

  // Use the unified CodeBlock component in 'editor' mode
  const editor = window.builder.create('codeBlock', {
    filename: 'my-script.js',
    language: 'javascript',
    code: '// Start typing your code here...',
    mode: 'editor',
    onSave: (code, meta) => {
      window.showToast(`Code saved! ${meta.filename} (${code.length} chars)`, 'success');
    }
  });

  container.appendChild(editor.element);
  editor.mount();
};

// New demo function to showcase mode switching
window.demoCodeBlock = function() {
  const code = `// Welcome to the unified CodeBlock component! 
// Click the "Edit" button in the header to switch to editor mode.
// Click "View" to switch back to viewer mode.

const greeting = (name) => {
  return \`Hello, \${name}!  Welcome to the demo.\`;
};

console.log(greeting('Developer'));`;

  const container = document.getElementById('code-block-container') || 
                    document.getElementById('code-viewer-container');
  
  if (!container) {
    console.error('No container found for CodeBlock demo');
    return;
  }
  
  // Clear any existing content
  container.innerHTML = '';

  const codeBlock = window.builder.create('codeBlock', {
    filename: 'demo.js',
    language: 'javascript',
    code,
    mode:  'viewer', // Start in viewer mode
    onSave: (code, meta) => {
      window.showToast(`Saved ${meta.filename} (${code.length} chars)`, 'success');
    }
  });

  container.appendChild(codeBlock.element);
  codeBlock.mount();
  
  window.showToast('CodeBlock loaded!  Try switching between View and Edit modes.', 'info');
};

window.demoBadges = function() {
  const container = document.getElementById('badge-container');
  container.innerHTML = ''; // Clear previous badges

  const badge1 = window.builder.create('badge', {
    label: 'v1.0.0',
    variant: 'primary'
  });

  const badge2 = window.builder.create('badge', {
    count: 5,
    variant: 'success'
  });

  const badge3 = window.builder.create('badge', {
    count: 199,
    variant:  'primary'
  });

  container.appendChild(badge1.element);
  container.appendChild(badge2.element);
  container.appendChild(badge3.element);
  
  // Mount all badges
  badge1.mount();
  badge2.mount();
  badge3.mount();
};

window.demoDialog = function() {
  const dialog = window.builder.create('dialog', {
    title: 'Confirm Action',
    content: 'Are you sure you want to continue?',
    onConfirm: () => window.showToast('Action confirmed!', 'success')
  });

  document.body.appendChild(dialog.element);
  dialog.mount();
};

window.createCustomComponent = function() {
  const CustomCard = {
    name: 'customCard',
    version: '1.0.0',

    template: (props) => {
      const card = document.createElement('div');
      card.className = 'custom-card';
      card.innerHTML = `
        <div class="custom-card-header">
          <h3>${props.title || 'Card'}</h3>
        </div>
        <div class="custom-card-body">
          ${props.content || ''}
        </div>
        <div class="custom-card-footer">
          <button class="btn btn-primary">Action</button>
        </div>
      `;
      return card;
    },

    lifecycle: {
      onMount: (element, props) => {
        console.log('Custom card mounted:', props.title);
      }
    }
  };

  window.builder.register(CustomCard);
  return window.builder.create('customCard', {
    title:  'My Custom Card',
    content:  '<p>This is a custom component!</p>'
  });
};

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Demo functions loaded successfully!');
  
  // Test that builder exists
  if (!window.builder) {
    console.error('Builder not found! Check script loading order.');
    return;
  }
  
  console.log('Builder is available:', typeof window.builder);
  
  // Log available components for debugging
  if (window.builder.list) {
    console.log('Registered components:', window.builder.list());
  }
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