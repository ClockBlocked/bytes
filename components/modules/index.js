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
