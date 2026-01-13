window.CodeBlock = {
  name: 'codeBlock',
  version: '2.0.0',


/////////////////////  C O D E  Window  ///////////
///////////////////////////////////////////////////
  defaults: {
    mode: 'viewer',
    language: 'javascript',
    filename: 'code.js',
    code: '',
    theme: 'dark',
    transitionDuration: 2000
  },
  template: (props) => {
    const config = { ...window.CodeBlock.defaults, ... props };
    
    const container = document.createElement('div');
    container.className = `code-block-container code-block-${config.mode}`;
    container.setAttribute('data-language', config.language);
    container.setAttribute('data-mode', config.mode);

    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'code-block-loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-backdrop"></div>
      <div class="loading-spinner-container">
        <svg class="loading-spinner" viewBox="0 0 50 50" width="48" height="48">
          <circle 
            class="spinner-track" 
            cx="25" 
            cy="25" 
            r="20" 
            fill="none" 
            stroke-width="4"
          />
          <circle 
            class="spinner-head" 
            cx="25" 
            cy="25" 
            r="20" 
            fill="none" 
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
        <span class="loading-text">Switching modes...</span>
      </div>
    `;

    const header = document.createElement('div');
    header.className = 'code-block-header sticky-header';
    header.innerHTML = window.CodeBlock.renderHeader(config);

    const toolbar = document.createElement('div');
    toolbar.className = 'code-block-toolbar sticky-toolbar';
    toolbar.innerHTML = window.CodeBlock.renderToolbar(config);

    const content = document.createElement('div');
    content.className = 'code-block-content';
    content.innerHTML = config.mode === 'viewer' 
      ? window.CodeBlock.renderViewerContent(config)
      : window.CodeBlock.renderEditorContent(config);

    const statusBar = document.createElement('div');
    statusBar.className = 'code-block-status';
    statusBar.innerHTML = window.CodeBlock.renderStatusBar(config);

    container.appendChild(loadingOverlay);
    container.appendChild(header);
    container.appendChild(toolbar);
    container.appendChild(content);
    container.appendChild(statusBar);

    return container;
  },

  renderStatusBar: (config) => {
    return `
      <span class="status-item status-encoding">UTF-8</span>
      <span class="status-item status-language">${config.language}</span>
      <span class="status-item status-mode">${config.mode === 'viewer' ? 'Read Only' : 'Editing'}</span>
      <span class="status-item status-position">Ln 1, Col 1</span>
    `;
  },
  renderHeader: (config) => {
    if (config.mode === 'viewer') {
      return `
        <div class="code-block-file-info">
          <svg class="code-icon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9" fill="none" stroke="currentColor" stroke-width="1"/>
          </svg>
          <span class="code-filename">${config.filename}</span>
          <span class="code-language-badge">${config.language}</span>
        </div>
        <button class="mode-toggle-btn" data-target-mode="editor" title="Switch to Editor">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit
        </button>
      `;
    } else {
      return `
        <div class="code-block-file-info">
          <input type="text" class="editor-filename-input" placeholder="filename.js" value="${config.filename}">
          <select class="editor-language-select">
            <option value="javascript" ${config.language === 'javascript' ? 'selected' : ''}>JavaScript</option>
            <option value="html" ${config.language === 'html' ? 'selected' : ''}>HTML</option>
            <option value="css" ${config.language === 'css' ? 'selected' : ''}>CSS</option>
            <option value="python" ${config.language === 'python' ? 'selected' : ''}>Python</option>
            <option value="json" ${config.language === 'json' ? 'selected' : ''}>JSON</option>
            <option value="typescript" ${config.language === 'typescript' ? 'selected' : ''}>TypeScript</option>
          </select>
        </div>
        <button class="mode-toggle-btn" data-target-mode="viewer" title="Switch to Viewer">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          View
        </button>
      `;
    }
  },
  renderToolbar: (config) => {
    const lineCount = typeof config.code === 'string' ? config.code.split('\n').length : 0;
    const charCount = typeof config.code === 'string' ? config.code.length : 0;

    if (config.mode === 'viewer') {
      return `
        <div class="toolbar-left">
          <button class="toolbar-btn code-copy-btn" title="Copy code">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <span class="btn-text">Copy</span>
          </button>
          <button class="toolbar-btn code-download-btn" title="Download code">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span class="btn-text">Download</span>
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn code-theme-btn" title="Toggle theme">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M20.354 15.354A9 9 0 1 1 8.646 3.646 9 9 0 0 1 20.354 15.354z"/>
            </svg>
          </button>
          <span class="code-line-count">${lineCount} lines</span>
        </div>
      `;
    } else {
      return `
        <div class="toolbar-left">
          <button class="toolbar-btn editor-save-btn" title="Save (Ctrl+S)">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            <span class="btn-text">Save</span>
          </button>
          <button class="toolbar-btn editor-format-btn" title="Format code">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
            </svg>
            <span class="btn-text">Format</span>
          </button>
          <button class="toolbar-btn editor-undo-btn" title="Undo">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
            </svg>
          </button>
          <button class="toolbar-btn editor-redo-btn" title="Redo">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
            </svg>
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn code-theme-btn" title="Toggle theme">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M20.354 15.354A9 9 0 1 1 8.646 3.646 9 9 0 0 1 20.354 15.354z"/>
            </svg>
          </button>
          <span class="editor-char-count">${charCount} chars</span>
        </div>
      `;
    }
  },

  renderViewerContent: (config) => {
    const sourceCode = typeof config.code === 'string' ? config.code : '// Empty file';
    const lines = sourceCode.split('\n');
    const lineNumbersHTML = lines.map((_, i) => `<div class="line-number">${i + 1}</div>`).join('');
    const highlightedCode = window.CodeBlock.highlightSyntax(sourceCode, config.language);

    return `
      <div class="code-wrapper">
        <div class="line-numbers">${lineNumbersHTML}</div>
        <pre class="code-pre"><code class="code-element language-${config.language}">${highlightedCode}</code></pre>
      </div>
    `;
  },
  renderEditorContent: (config) => {
    const sourceCode = typeof config.code === 'string' ? config.code : '';
    const lines = sourceCode.split('\n');
    const lineNumbersHTML = lines.map((_, i) => `<div class="line-number">${i + 1}</div>`).join('');

    return `
      <div class="editor-wrapper">
        <div class="line-numbers">${lineNumbersHTML}</div>
        <textarea class="editor-textarea" spellcheck="false" autocapitalize="off" autocorrect="off" placeholder="Enter your code here...">${sourceCode}</textarea>
      </div>
    `;
  },

  highlightSyntax: (code, language) => {
    const escaped = window.CodeBlock.escapeHTML(code || '');
    
    const patterns = {
      javascript: [
        { regex: /(\/\/.*$)/gm, class: 'comment' },
        { regex: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, class: 'string' },
        { regex: /\b(function|const|let|var|if|else|return|class|async|await|import|export|default|from|new|this|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in|typeof|instanceof|void|delete|yield)\b/g, class: 'keyword' },
        { regex: /\b(true|false|null|undefined|NaN|Infinity)\b/g, class: 'literal' },
        { regex: /\b(\d+\.?\d*)\b/g, class: 'number' },
        { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, class: 'class-name' },
        { regex: /(\b\w+)(.?=\s*\()/g, class: 'function' }
      ],
      html: [
        { regex: /(&lt;! --[\s\S]*?--&gt;)/g, class: 'comment' },
        { regex: /(&lt;\/? )([\w-]+)/g, replace: '$1<span class="tag">$2</span>' },
        { regex: /([\w-]+)(=)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, replace: '<span class="attr-name">$1</span>$2<span class="string">$3</span>' }
      ],
      css: [
        { regex: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { regex: /([.#]?[\w-]+)(?=\s*\{)/g, class: 'selector' },
        { regex: /([\w-]+)(?=\s*:)/g, class: 'property' },
        { regex: /:\s*([^;{}]+)/g, replace: ': <span class="value">$1</span>' }
      ],
      python: [
        { regex: /(#.*$)/gm, class: 'comment' },
        { regex: /("""[\s\S]*? """|'''[\s\S]*?''')/g, class: 'string' },
        { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, class: 'string' },
        { regex: /\b(def|class|if|elif|else|return|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|for|while|in|is|not|and|or|True|False|None|self)\b/g, class: 'keyword' },
        { regex: /\b(\d+\.?\d*)\b/g, class: 'number' },
        { regex: /@(\w+)/g, class: 'decorator' }
      ],
      json: [
        { regex: /("(?:[^"\\]|\\.)*")(?=\s*:)/g, class: 'property' },
        { regex: /:\s*("(?:[^"\\]|\\.)*")/g, replace: ': <span class="string">$1</span>' },
        { regex: /:\s*(\d+\.?\d*)/g, replace: ': <span class="number">$1</span>' },
        { regex: /:\s*(true|false|null)\b/g, replace: ': <span class="literal">$1</span>' }
      ],
      typescript: [] // Will inherit from javascript
    };

    patterns.typescript = patterns.javascript;

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




///////////////////////  H I S T O R Y  ///////////
///////////////////////////////////////////////////
  state: {
    history: [],
    historyIndex: -1,
    maxHistory: 50
  },
  lifecycle: {
    onMount: (element, props) => {
      const config = { ...window.CodeBlock.defaults, ...props };
      
      element._codeBlockState = {
        mode: config.mode,
        code: config.code,
        filename: config.filename,
        language: config.language,
        history: [config.code],
        historyIndex: 0
      };

      if (config.mode === 'viewer') {
        window.CodeBlock.initViewerMode(element, config);
      } else {
        window.CodeBlock.initEditorMode(element, config);
      }

      window.CodeBlock.initThemeToggle(element);
      window.CodeBlock.initModeToggle(element, props);
      window.CodeBlock.restoreTheme(element);
    }
  },


  initViewerMode: (element, config) => {
    const copyBtn = element.querySelector('.code-copy-btn');
    const downloadBtn = element.querySelector('.code-download-btn');
    const codeElement = element.querySelector('.code-element');


    copyBtn?.addEventListener('click', async () => {
      const code = element._codeBlockState?.code || config.code || '';
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        const btnText = copyBtn.querySelector('.btn-text');
        if (btnText) {
          const original = btnText.textContent;
          btnText.textContent = 'Copied!';
          copyBtn.classList.add('success');
          setTimeout(() => {
            btnText.textContent = original;
            copyBtn.classList.remove('success');
          }, 2000);
        }
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });

    downloadBtn?.addEventListener('click', () => {
      const code = element._codeBlockState?.code || config.code || '';
      const filename = element._codeBlockState?.filename || config.filename || 'code.txt';
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });



    codeElement?.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        const pre = element.querySelector('.code-pre');
        if (pre) {
          preCaretRange.selectNodeContents(pre);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          const offset = preCaretRange.toString().length;
          window.CodeBlock.updateCursorPosition(element, offset);
        }
      }
    });
  },
  initEditorMode: (element, config) => {
    const textarea = element.querySelector('.editor-textarea');
    const lineNumbers = element.querySelector('.line-numbers');
    const charCount = element.querySelector('.editor-char-count');
    const saveBtn = element.querySelector('.editor-save-btn');
    const formatBtn = element.querySelector('.editor-format-btn');
    const undoBtn = element.querySelector('.editor-undo-btn');
    const redoBtn = element.querySelector('.editor-redo-btn');
    const filenameInput = element.querySelector('.editor-filename-input');
    const languageSelect = element.querySelector('.editor-language-select');

    const updateLineNumbers = () => {
      if (!textarea || !lineNumbers) return;
      const lines = textarea.value.split('\n');
      lineNumbers.innerHTML = lines.map((_, i) => `<div class="line-number">${i + 1}</div>`).join('');
      if (charCount) {
        charCount.textContent = `${textarea.value.length} chars`;
      }

      if (element._codeBlockState) {
        element._codeBlockState.code = textarea.value;
      }
    };

    const updateCursorPositionFromTextarea = () => {
      if (!textarea) return;
      const value = textarea.value.substring(0, textarea.selectionStart);
      const lines = value.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      const statusPos = element.querySelector('.status-position');
      if (statusPos) {
        statusPos.textContent = `Ln ${line}, Col ${col}`;
      }
    };

    const pushHistory = () => {
      if (!element._codeBlockState) return;
      const state = element._codeBlockState;
      // Remove any redo history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(textarea.value);
      if (state.history.length > 50) {
        state.history.shift();
      }
      state.historyIndex = state.history.length - 1;
    };

    // Scroll sync
    textarea?.addEventListener('scroll', () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    });

    // Input handling
    textarea?.addEventListener('input', () => {
      updateLineNumbers();
      pushHistory();
    });

    // Cursor position tracking
    textarea?.addEventListener('click', updateCursorPositionFromTextarea);
    textarea?.addEventListener('keyup', updateCursorPositionFromTextarea);

    // Tab handling
    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (e.shiftKey) {
          // Outdent
          const beforeCursor = textarea.value.substring(0, start);
          const lastNewline = beforeCursor.lastIndexOf('\n');
          const lineStart = lastNewline + 1;
          const lineContent = textarea.value.substring(lineStart, start);
          
          if (lineContent.startsWith('\t') || lineContent.startsWith('  ')) {
            const removeChars = lineContent.startsWith('\t') ? 1 : 2;
            textarea.value = textarea.value.substring(0, lineStart) + 
                            textarea.value.substring(lineStart + removeChars);
            textarea.selectionStart = textarea.selectionEnd = start - removeChars;
          }
        } else {
          // Indent
          textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
        updateLineNumbers();
        pushHistory();
      }

      // Keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          saveBtn?.click();
        } else if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undoBtn?.click();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redoBtn?.click();
        }
      }
    });

    // Save button
    saveBtn?.addEventListener('click', () => {
      if (config.onSave) {
        config.onSave(textarea.value, {
          filename: filenameInput?.value || config.filename,
          language: languageSelect?.value || config.language
        });
      }
      const btnText = saveBtn.querySelector('.btn-text');
      if (btnText) {
        const original = btnText.textContent;
        btnText.textContent = 'Saved!';
        saveBtn.classList.add('success');
        setTimeout(() => {
          btnText.textContent = original;
          saveBtn.classList.remove('success');
        }, 2000);
      }
    });

    // Format button
    formatBtn?.addEventListener('click', () => {
      if (!textarea) return;
      const lines = textarea.value.split('\n').map(line => line.trimEnd());
      let formatted = lines.join('\n').trimEnd();
      if (formatted && !formatted.endsWith('\n')) {
        formatted += '\n';
      }
      textarea.value = formatted;
      updateLineNumbers();
      pushHistory();
    });

    // Undo button
    undoBtn?.addEventListener('click', () => {
      if (!element._codeBlockState || !textarea) return;
      const state = element._codeBlockState;
      if (state.historyIndex > 0) {
        state.historyIndex--;
        textarea.value = state.history[state.historyIndex];
        updateLineNumbers();
      }
    });

    // Redo button
    redoBtn?.addEventListener('click', () => {
      if (!element._codeBlockState || !textarea) return;
      const state = element._codeBlockState;
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        textarea.value = state.history[state.historyIndex];
        updateLineNumbers();
      }
    });

    // Filename change
    filenameInput?.addEventListener('input', () => {
      if (element._codeBlockState) {
        element._codeBlockState.filename = filenameInput.value;
      }
    });

    // Language change
    languageSelect?.addEventListener('change', () => {
      if (element._codeBlockState) {
        element._codeBlockState.language = languageSelect.value;
      }
      element.setAttribute('data-language', languageSelect.value);
      const statusLang = element.querySelector('.status-language');
      if (statusLang) {
        statusLang.textContent = languageSelect.value;
      }
    });

    // Initial update
    updateLineNumbers();
    updateCursorPositionFromTextarea();
  },


  initModeToggle: (element, props) => {
    const modeBtn = element.querySelector('.mode-toggle-btn');
    
    modeBtn?.addEventListener('click', () => {
      const targetMode = modeBtn.getAttribute('data-target-mode');
      window.CodeBlock.switchMode(element, targetMode, props);
    });
  },
  switchMode: (element, targetMode, props) => {
    const overlay = element.querySelector('.code-block-loading-overlay');
    const state = element._codeBlockState;
    
    if (!overlay || !state) return;
    
    // Get current code from textarea if in editor mode
    const textarea = element.querySelector('.editor-textarea');
    if (textarea) {
      state.code = textarea.value;
    }
    
    // Get current filename and language from inputs
    const filenameInput = element.querySelector('.editor-filename-input');
    const languageSelect = element.querySelector('.editor-language-select');
    if (filenameInput) state.filename = filenameInput.value;
    if (languageSelect) state.language = languageSelect.value;

    // Show loading overlay with smooth animation
    overlay.classList.add('active');

    // Wait for transition, then switch content
    setTimeout(() => {
      // Update state
      state.mode = targetMode;
      element.setAttribute('data-mode', targetMode);
      element.classList.remove('code-block-viewer', 'code-block-editor');
      element.classList.add(`code-block-${targetMode}`);

      // Update header
      const header = element.querySelector('.code-block-header');
      if (header) {
        header.innerHTML = window.CodeBlock.renderHeader(state);
        window.CodeBlock.initModeToggle(element, props);
      }

      // Update toolbar
      const toolbar = element.querySelector('.code-block-toolbar');
      if (toolbar) {
        toolbar.innerHTML = window.CodeBlock.renderToolbar(state);
        window.CodeBlock.initThemeToggle(element);
      }

      // Update content
      const content = element.querySelector('.code-block-content');
      if (content) {
        content.innerHTML = targetMode === 'viewer'
          ? window.CodeBlock.renderViewerContent(state)
          : window.CodeBlock.renderEditorContent(state);
      }

      // Update status bar
      const statusBar = element.querySelector('.code-block-status');
      if (statusBar) {
        statusBar.innerHTML = window.CodeBlock.renderStatusBar(state);
      }

      // Reinitialize mode-specific functionality
      if (targetMode === 'viewer') {
        window.CodeBlock.initViewerMode(element, state);
      } else {
        window.CodeBlock.initEditorMode(element, { ...props, ...state });
      }

      // Restore theme
      window.CodeBlock.restoreTheme(element);

    }, 300); // Wait for blur to fully apply

    // Hide loading overlay after 2 seconds
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 2000);
  },
  restoreTheme: (element) => {
    const savedTheme = localStorage.getItem('codeBlockTheme');
    if (savedTheme === 'light') {
      element.classList.add('code-block-light');
    } else {
      element.classList.remove('code-block-light');
    }
  },
  updateCursorPosition: (element, offset) => {
    const codeElement = element.querySelector('.code-element');
    if (!codeElement) return;
    
    const text = codeElement.textContent || '';
    const lines = text.substring(0, offset).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    const statusPos = element.querySelector('.status-position');
    if (statusPos) {
      statusPos.textContent = `Ln ${line}, Col ${col}`;
    }
  }
  
  initThemeToggle: (element) => {
    const themeBtn = element.querySelector('.code-theme-btn');
    themeBtn?.addEventListener('click', () => {
      element.classList.toggle('code-block-light');
      const isLight = element.classList.contains('code-block-light');
      localStorage.setItem('codeBlockTheme', isLight ? 'light' : 'dark');
    });
  },

};




//////////////  Code Window S T A T E S ///////////
///////////////////////////////////////////////////
window.CodeViewer = {
  name: 'codeViewer',
  version: '1.0.0',

  template: (props) => {
    return window.CodeBlock.template({ ...props, mode: 'viewer' });
  },

  lifecycle: window.CodeBlock.lifecycle
};

window.CodeEditor = {
  name: 'codeEditor',
  version: '1.0.0',

  template: (props) => {
    return window.CodeBlock.template({ ...props, mode: 'editor' });
  },

  lifecycle: window.CodeBlock.lifecycle
};
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