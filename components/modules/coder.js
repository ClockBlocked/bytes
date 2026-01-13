// Code Viewer Component
window.CodeViewer = {
  name: 'codeViewer',
  version: '2.0.0',

  defaults: {
    mode: 'viewer',
    language: 'javascript',
    filename: 'code.js',
    code: '',
    theme: 'dark'
  },

  template: (props) => {
    const config = { ...window.CodeViewer.defaults, ...props };
    
    const container = document.createElement('div');
    container.className = `code-block-container code-block-${config.mode}`;
    container.setAttribute('data-language', config.language);
    container.setAttribute('data-mode', config.mode);

    // Header
    const header = document.createElement('div');
    header.className = 'code-block-header';
    header.innerHTML = `
      <div class="code-block-file-info">
        <svg class="code-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>
        <span class="code-filename">${config.filename}</span>
        <span class="code-language-badge">${config.language}</span>
      </div>
    `;

    // Content Area
    const content = document.createElement('div');
    content.className = 'code-block-content';
    
    const sourceCode = typeof config.code === 'string' ? config.code : '// Empty file';
    const lines = sourceCode.split('\n');
    const lineNumbersHTML = lines.map((_, i) => `<div class="line-number">${i + 1}</div>`).join('');
    const highlightedCode = window.CodeViewer.highlightSyntax(sourceCode, config.language);

    content.innerHTML = `
      <div class="code-wrapper">
        <div class="line-numbers">${lineNumbersHTML}</div>
        <pre class="code-pre"><code class="code-element language-${config.language}">${highlightedCode}</code></pre>
      </div>
    `;

    container.appendChild(header);
    container.appendChild(content);

    return container;
  },

  // Syntax Highlighting Helper
  highlightSyntax: (code, language) => {
    const escaped = window.CodeViewer.escapeHTML(code || '');
    
    const patterns = {
      javascript: [
        { regex: /(\/\/.*$)/gm, class: 'comment' },
        { regex: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, class: 'string' },
        { regex:  /\b(function|const|let|var|if|else|return|class|async|await|import|export|default|from|new|this|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in|typeof|instanceof|void|delete|yield)\b/g, class: 'keyword' },
        { regex: /\b(true|false|null|undefined|NaN|Infinity)\b/g, class: 'literal' },
        { regex: /\b(\d+\. ?\d*)\b/g, class: 'number' }
      ],
      html: [
        { regex: /(&lt;! --[\s\S]*?--&gt;)/g, class: 'comment' },
        { regex: /(&lt;\/? )([\w-]+)/g, replace: '$1<span class="tag">$2</span>' }
      ],
      css: [
        { regex: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { regex: /([. #]? [\w-]+)(.? =\s*\{)/g, class: 'selector' }
      ]
    };

    let result = escaped;
    const langPatterns = patterns[language] || patterns.javascript;

    langPatterns.forEach(pattern => {
      if (pattern.replace) {
        result = result.replace(pattern.regex, pattern.replace);
      } else {
        result = result.replace(pattern.regex, `<span class="${pattern.class}">$1</span>`);
      }
    });

    return result;
  },

  escapeHTML: (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  lifecycle: {
    onMount: (element, props) => {
      console.log('Code Viewer mounted:', props.filename);
    }
  }
};

// Code Editor Component (simplified)
window.CodeEditor = {
  name: 'codeEditor',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'code-editor-container';
    
    const textarea = document.createElement('textarea');
    textarea.className = 'code-editor-textarea';
    textarea.placeholder = props.placeholder || 'Enter your code here...';
    textarea.value = props.code || '';
    
    container.appendChild(textarea);
    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const textarea = element.querySelector('.code-editor-textarea');
      
      textarea.addEventListener('input', () => {
        if (props.onChange) {
          props.onChange(textarea.value);
        }
      });
      
      // Handle save callback
      if (props.onSave) {
        // Simulate save on Ctrl+S
        textarea.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            props.onSave(textarea.value);
          }
        });
      }
    }
  }
};

console.log('Code components loaded: CodeViewer, CodeEditor');
