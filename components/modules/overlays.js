// ============= MODAL COMPONENT =============
window.Modal = {
  name: 'modal',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'modal-overlay';
    container.setAttribute('data-testid', 'modal');

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <h2 class="modal-title">${props.title || 'Modal'}</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    `;

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = props.content || '';

    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML =
      props.actions?.map(
        (action) =>
          `<button class="btn btn-${action.style || 'primary'}" data-action="${action.id}">${action.label}</button>`
      ).join('') || '<button class="btn btn-primary" data-action="close">Close</button>';

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    container.appendChild(modal);

    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const closeBtn = element.querySelector('.modal-close');
      const overlay = element;

      const closeOverlay = () => {
        overlay.classList.add('modal-closing');
        setTimeout(() => overlay.remove(), 300);
      };

      closeBtn?.addEventListener('click', closeOverlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOverlay();
        }
      });

      element.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const action = props.actions?.find((a) => a.id === e.target.dataset.action);
          if (action?.callback) action.callback();
          if (!props.persistent) closeOverlay();
        });
      });

      element.classList.add('modal-entering');
    }
  }
};

// ============= TOOLTIP COMPONENT =============
window.Tooltip = {
  name: 'tooltip',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'tooltip-wrapper';

    const trigger = document.createElement('span');
    trigger.className = 'tooltip-trigger';
    trigger.textContent = props.trigger || 'Hover me';

    const content = document.createElement('div');
    content.className = `tooltip tooltip-${props.position || 'top'}`;
    content.textContent = props.content || 'Tooltip content';
    content.setAttribute('role', 'tooltip');

    container.appendChild(trigger);
    container.appendChild(content);

    return container;
  },

  lifecycle: {
    onMount: (element) => {
      const trigger = element.querySelector('.tooltip-trigger');
      const tooltip = element.querySelector('.tooltip');

      trigger.addEventListener('mouseenter', () => {
        tooltip.classList.add('tooltip-visible');
      });

      trigger.addEventListener('mouseleave', () => {
        tooltip.classList.remove('tooltip-visible');
      });
    }
  }
};

// ============= DROPDOWN COMPONENT =============
window.Dropdown = {
  name: 'dropdown',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'dropdown';

    const toggle = document.createElement('button');
    toggle.className = 'dropdown-toggle';
    toggle.textContent = props.label || 'Dropdown';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');

    const menu = document.createElement('ul');
    menu.className = 'dropdown-menu';
    menu.innerHTML =
      props.items?.map(
        (item, i) => `<li><button class="dropdown-item" data-index="${i}">${item.label}</button></li>`
      ).join('') || '';

    container.appendChild(toggle);
    container.appendChild(menu);

    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const toggle = element.querySelector('.dropdown-toggle');
      const menu = element.querySelector('.dropdown-menu');
      let isOpen = false;

      const closeMenu = () => {
        isOpen = false;
        menu.classList.remove('dropdown-open');
        toggle.setAttribute('aria-expanded', 'false');
      };

      toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        menu.classList.toggle('dropdown-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      menu.querySelectorAll('.dropdown-item').forEach((item, i) => {
        item.addEventListener('click', () => {
          const action = props.items?.[i];
          if (action?.callback) action.callback();
          closeMenu();
        });
      });

      document.addEventListener('click', (e) => {
        if (!element.contains(e.target) && isOpen) {
          closeMenu();
        }
      });
    }
  }
};

// ============= DIALOG COMPONENT =============
window.Dialog = {
  name: 'dialog',
  version: '1.0.0',

  template: (props) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'dialog';
    dialog.setAttribute('aria-labelledby', 'dialog-title');

    const header = document.createElement('div');
    header.className = 'dialog-header';
    header.innerHTML = `<h2 id="dialog-title">${props.title || 'Dialog'}</h2>`;

    const body = document.createElement('div');
    body.className = 'dialog-body';
    body.innerHTML = props.content || '';

    const footer = document.createElement('div');
    footer.className = 'dialog-footer';
    footer.innerHTML = `
      <button class="btn btn-secondary" data-action="cancel">Cancel</button>
      <button class="btn btn-primary" data-action="confirm">Confirm</button>
    `;

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);

    return dialog;
  },

  lifecycle: {
    onMount: (element, props) => {
      element.showModal();

      element.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        element.close('cancelled');
      });

      element.querySelector('[data-action="confirm"]')?.addEventListener('click', () => {
        if (props.onConfirm) props.onConfirm();
        element.close('confirmed');
      });
    }
  }
};

// ============= POPOVER COMPONENT =============
window.Popover = {
  name: 'popover',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'popover-wrapper';

    const trigger = document.createElement('button');
    trigger.className = 'popover-trigger';
    trigger.textContent = props.trigger || 'Show Popover';

    const popover = document.createElement('div');
    popover.className = 'popover';

    const popoHeader = document.createElement('div');
    popoHeader.className = 'popover-header';
    popoHeader.innerHTML = `
      <h3>${props.title || 'Popover'}</h3>
      <button class="popover-close" aria-label="Close">&times;</button>
    `;

    const popoverBody = document.createElement('div');
    popoverBody.className = 'popover-body';
    popoverBody.innerHTML = props.content || '';

    popover.appendChild(popoHeader);
    popover.appendChild(popoverBody);
    container.appendChild(trigger);
    container.appendChild(popover);

    return container;
  },

  lifecycle: {
    onMount: (element) => {
      const trigger = element.querySelector('.popover-trigger');
      const popover = element.querySelector('.popover');
      const close = popover.querySelector('.popover-close');

      trigger.addEventListener('click', () => {
        popover.classList.toggle('popover-visible');
      });

      close.addEventListener('click', () => {
        popover.classList.remove('popover-visible');
      });

      document.addEventListener('click', (e) => {
        if (!element.contains(e.target)) {
          popover.classList.remove('popover-visible');
        }
      });
    }
  }
};

console.log('Overlay components loaded: Modal, Tooltip, Dropdown, Dialog, Popover');
