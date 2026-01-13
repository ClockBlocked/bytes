/**
 * MAIN INDEX.JS
 * Central export file for the entire component system
 * 
 * Usage:
 * import { builder, Modal, Toast, CodeViewer } from './modules/index.js';
 */

// Core Registry
export { builder, builderClass } from './setup.js';

// Overlays
export { Modal, Dropdown, Tooltip, Dialog, Popover } from './overlays.js';

// Notifications
export { Toast, Alert, Badge } from './notify.js';

// Code Editor/Viewer
export { CodeViewer, CodeEditor } from './coder.js';

// Future modules (placeholders for structure)
// export { ... } from './forms.js';
// export { ... } from './media.js';
// export { ... } from './interactions.js';

/**
 * Pre-registered component set
 * Import this if you want all components already registered
 */
import { builder } from './setup.js';
import { Modal, Dropdown, Tooltip, Dialog, Popover } from './overlays.js';
import { Toast, Alert, Badge } from './notify.js';
import { CodeViewer, CodeEditor } from './coder.js';

// Auto-register all components
export function initializeComponents() {
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
  
  return builder;
}

export default builder;
