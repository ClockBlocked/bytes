/**
 * COMPLETE USAGE EXAMPLE
 * Demonstrates all components in the registry system
 */

import { builder } from './modules/components/setup.js';
import { Modal, Dropdown, Tooltip, Dialog, Popover } from './modules/components/overlays.js';
import { Toast, Alert, Badge } from './modules/components/notify.js';
import { CodeViewer, CodeEditor } from './modules/components/coder.js';

// ============= REGISTRATION =============

// Register all components
builder
  .register(Modal)
  .register(Dropdown)
  .register(Tooltip)
  .register(Dialog)
  .register(Popover)
  .register(Toast)
  .register(Alert)
  .register(Badge)
  .register(CodeViewer)
  .register(CodeEditor);

// ============= DEMO: SHOW MODAL =============
function demoModal() {
  const modal = builder.create('modal', {
    title: 'Welcome to Component System',
    content: 'This is a reusable modal component created with vanilla JavaScript!',
    actions: [
      { id: 'close', label: 'Close', style: 'secondary' },
      { id: 'confirm', label: 'Confirm', style: 'primary', 
        callback: () => showToast('Confirmed!', 'success') }
    ]
  });
  
  document.body.appendChild(modal.element);
  modal.mount();
}

// ============= DEMO: SHOW DROPDOWN =============
function demoDropdown() {
  const dropdown = builder.create('dropdown', {
    label: 'Actions',
    items: [
      { label: 'Edit', callback: () => showToast('Edit clicked') },
      { label: 'Delete', callback: () => showToast('Delete clicked', 'error') },
      { label: 'Share', callback: () => showToast('Share clicked', 'info') }
    ]
  });
  
  document.getElementById('dropdown-container').appendChild(dropdown.element);
  dropdown.mount();
}

// ============= DEMO: SHOW TOOLTIP =============
function demoTooltip() {
  const tooltip = builder.create('tooltip', {
    trigger: 'Hover over me â†’',
    content: 'This is a helpful tooltip!',
    position: 'top'
  });
  
  document.getElementById('tooltip-container').appendChild(tooltip.element);
  tooltip.mount();
}

// ============= DEMO: SHOW TOAST =============
function showToast(message, type = 'info') {
  const toast = builder.create('toast', {
    message,
    type,
    icon: type === 'success' ? 'âœ“' : type === 'error' ? 'âœ•' : 'â„¹',
    duration: 3000
  });
  
  document.body.appendChild(toast.element);
  toast.mount();
}

// ============= DEMO: CODE VIEWER =============
function demoCodeViewer() {
  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // Output: 55`;

  const viewer = builder.create('codeViewer', {
    filename: 'fibonacci.js',
    language: 'javascript',
    code
  });
  
  document.getElementById('code-viewer-container').appendChild(viewer.element);
  viewer.mount();
}

// ============= DEMO: CODE EDITOR =============
function demoCodeEditor() {
  const editor = builder.create('codeEditor', {
    filename: 'my-script.js',
    language: 'javascript',
    code: '// Start typing your code here...',
    onSave: (code) => {
      showToast('Code saved! Length: ' + code.length + ' chars', 'success');
    }
  });
  
  document.getElementById('code-editor-container').appendChild(editor.element);
  editor.mount();
}

// ============= DEMO: BADGE =============
function demoBadges() {
  const container = document.getElementById('badge-container');
  
  const badge1 = builder.create('badge', {
    label: 'v1.0.0',
    variant: 'primary'
  });
  
  const badge2 = builder.create('badge', {
    count: 5,
    variant: 'success'
  });
  
  const badge3 = builder.create('badge', {
    count: 199,
    variant: 'primary'
  });
  
  container.appendChild(badge1.element);
  container.appendChild(badge2.element);
  container.appendChild(badge3.element);
}

// ============= DEMO: DIALOG =============
function demoDialog() {
  const dialog = builder.create('dialog', {
    title: 'Confirm Action',
    content: 'Are you sure you want to continue?',
    onConfirm: () => showToast('Action confirmed!', 'success')
  });
  
  document.body.appendChild(dialog.element);
  dialog.mount();
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners for demo buttons
  const demoBtn = document.getElementById('demo-modal-btn');
  const dropdownBtn = document.getElementById('demo-dropdown-btn');
  const tooltipBtn = document.getElementById('demo-tooltip-btn');
  const viewerBtn = document.getElementById('demo-viewer-btn');
  const editorBtn = document.getElementById('demo-editor-btn');
  const badgeBtn = document.getElementById('demo-badge-btn');
  const dialogBtn = document.getElementById('demo-dialog-btn');
  
  demoBtn?.addEventListener('click', demoModal);
  dropdownBtn?.addEventListener('click', demoDropdown);
  tooltipBtn?.addEventListener('click', demoTooltip);
  viewerBtn?.addEventListener('click', demoCodeViewer);
  editorBtn?.addEventListener('click', demoCodeEditor);
  badgeBtn?.addEventListener('click', demoBadges);
  dialogBtn?.addEventListener('click', demoDialog);
  
  // Show welcome toast
  setTimeout(() => {
    showToast('Component System Ready! ðŸš€', 'success');
  }, 300);
});

// ============= ADVANCED: Create custom component =============
function createCustomComponent() {
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
  
  builder.register(CustomCard);
  return builder.create('customCard', {
    title: 'My Custom Card',
    content: '<p>This is a custom component!</p>'
  });
}

// Export for use in other modules
export {
  demoModal,
  demoDropdown,
  demoTooltip,
  showToast,
  demoCodeViewer,
  demoCodeEditor,
  demoBadges,
  demoDialog,
  createCustomComponent,
  builder
};