const Toast = {
  name: 'toast',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = `toast toast-${props.type || 'info'}`;
    container.setAttribute('role', 'alert');

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = props.icon || '✓';

    const message = document.createElement('span');
    message.className = 'toast-message';
    message.textContent = props.message || 'Notification';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';

    container.appendChild(icon);
    container.appendChild(message);
    container.appendChild(closeBtn);

    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const closeBtn = element.querySelector('.toast-close');

      const dismiss = () => {
        element.classList.add('toast-hiding');
        setTimeout(() => element.remove(), 300);
      };

      closeBtn.addEventListener('click', dismiss);

      if (props.duration !== false) {
        setTimeout(dismiss, props.duration || 3000);
      }
    }
  }
};

const Alert = {
  name: 'alert',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = `alert alert-${props.type || 'info'}`;
    container.setAttribute('role', 'alert');

    const title = document.createElement('div');
    title.className = 'alert-title';
    title.textContent = props.title || 'Alert';

    const message = document.createElement('div');
    message.className = 'alert-message';
    message.textContent = props.message || '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'alert-close';
    closeBtn.textContent = '×';

    container.appendChild(title);
    if (props.message) container.appendChild(message);
    container.appendChild(closeBtn);

    return container;
  },

  lifecycle: {
    onMount: (element) => {
      element.querySelector('.alert-close').addEventListener('click', () => {
        element.remove();
      });
    }
  }
};

const Badge = {
  name: 'badge',
  version: '1.0.0',

  template: (props) => {
    const badge = document.createElement('span');
    badge.className = `badge badge-${props.variant || 'primary'}`;
    badge.textContent = props.label || 'Badge';

    if (props.count !== undefined) {
      badge.textContent = props.count > 99 ? '99+' : props.count;
    }

    return badge;
  }
};



window.Toast = Toast;
window.Alert = Alert;
window.Badge = Badge;
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