function initializeComponents() {
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

initializeComponents();



window.initializeComponents = initializeComponents;
window.ComponentBuilder = builder;
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
