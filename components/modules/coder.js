/**
 * CODEMIRROR MODULE
 * GitHub-style Code Viewer with Sticky Header and Toolbar
 * Features: Sticky header, sticky toolbar, dark dimmed theme, line numbers, syntax highlighting
 */

const CodeViewer = {
  name: 'codeViewer',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'code-viewer-container';
    container.setAttribute('data-language', props.language || 'javascript');

    // Sticky Header
    const header = document.createElement('div');
    header.className = 'code-viewer-header sticky-header';
    header.innerHTML = `
      <div class="code-viewer-file-info">
        <svg class="code-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        <span class="code-filename">${props.filename || 'code.js'}</span>
        <span class="code-language">${props.language || 'JavaScript'}</span>
      </div>
    `;

    // Sticky Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'code-viewer-toolbar sticky-toolbar';
    const lineCount = (typeof props.code === 'string' ? props.code.split('\n').length : 0);
    toolbar.innerHTML = `
      <div class="toolbar-left">
        <button class="toolbar-btn code-copy-btn" title="Copy code">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          Copy
        </button>
        <button class="toolbar-btn code-download-btn" title="Download code">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download
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

    // Code Content
    const content = document.createElement('div');
    content.className = 'code-viewer-content';

    const codeBlock = document.createElement('pre');
    codeBlock.className = 'code-block';

    const codeElement = document.createElement('code');
    codeElement.className = `language-${props.language || 'javascript'}`;

    const sourceCode = typeof props.code === 'string' ? props.code : '// Empty file';
    const lines = sourceCode.split('\n');
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'code-line-numbers';
    lineNumbers.innerHTML = lines.map((_, i) => `<div class="code-line-number">${i + 1}</div>`).join('');

    const highlightedCode = highlightSyntax(sourceCode, props.language || 'javascript');
    codeElement.innerHTML = highlightedCode;

    codeBlock.appendChild(codeElement);

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-wrapper';
    codeWrapper.appendChild(lineNumbers);
    codeWrapper.appendChild(codeBlock);

    content.appendChild(codeWrapper);

    // Status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'code-viewer-status';
    statusBar.innerHTML = `
      <span class="status-item">UTF-8</span>
      <span class="status-item">${props.language || 'JavaScript'}</span>
      <span class="status-item" id="code-cursor-pos">Line 1, Column 1</span>
    `;

    container.appendChild(header);
    container.appendChild(toolbar);
    container.appendChild(content);
    container.appendChild(statusBar);

    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const copyBtn = element.querySelector('.code-copy-btn');
      const downloadBtn = element.querySelector('.code-download-btn');
      const themeBtn = element.querySelector('.code-theme-btn');
      const codeBlock = element.querySelector('.code-block');

      // Copy to clipboard (with fallback)
      copyBtn?.addEventListener('click', async () => {
        const code = props.code || '';
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(code);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        } catch (err) {
          console.error('Copy failed', err);
        }
      });

      // Download code
      downloadBtn?.addEventListener('click', () => {
        const code = props.code || '';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props.filename || 'code.txt';
        a.click();
        window.URL.revokeObjectURL(url);
      });

      // Toggle theme (GitHub Dark Dimmed)
      themeBtn?.addEventListener('click', () => {
        element.classList.toggle('code-viewer-light');
        localStorage.setItem(
          'codeViewerTheme',
          element.classList.contains('code-viewer-light') ? 'light' : 'dark'
        );
      });

      // Track cursor position (approximate, text-content based)
      codeBlock?.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(codeBlock);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          const caretOffset = preCaretRange.toString().length;
          updateCursorPosition(element, caretOffset);
        }
      });

      // Restore theme preference
      const savedTheme = localStorage.getItem('codeViewerTheme');
      if (savedTheme === 'light') {
        element.classList.add('code-viewer-light');
      }
    }
  }
};

// ============= CODE EDITOR COMPONENT =============
const CodeEditor = {
  name: 'codeEditor',
  version: '1.0.0',

  template: (props) => {
    const container = document.createElement('div');
    container.className = 'code-editor-container';
    container.setAttribute('data-language', props.language || 'javascript');

    // Header
    const header = document.createElement('div');
    header.className = 'code-editor-header sticky-header';
    header.innerHTML = `
      <input type="text" class="editor-filename" placeholder="filename.js" value="${props.filename || 'untitled.js'}">
      <select class="editor-language">
        <option value="javascript">JavaScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="python">Python</option>
        <option value="json">JSON</option>
      </select>
    `;
    header.querySelector('.editor-language').value = props.language || 'javascript';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'code-editor-toolbar sticky-toolbar';
    toolbar.innerHTML = `
      <div class="toolbar-left">
        <button class="toolbar-btn editor-save-btn" title="Save (Ctrl+S)">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          Save
        </button>
        <button class="toolbar-btn editor-format-btn" title="Format code">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M10 10.5h8v2h-8zm0-4h12v2H10zm0 8h12v2H10zM3 9h8V7.5H3V9z"/>
          </svg>
          Format
        </button>
      </div>
      <div class="toolbar-right">
        <span class="editor-char-count">0 characters</span>
      </div>
    `;

    // Editor area
    const editorArea = document.createElement('div');
    editorArea.className = 'code-editor-area';

    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'editor-line-numbers';

    const textarea = document.createElement('textarea');
    textarea.className = 'editor-textarea';
    textarea.placeholder = 'Enter your code here...';
    textarea.value = props.code || '';
    textarea.spellcheck = false;
    textarea.autocapitalize = 'off';
    textarea.autocorrect = 'off';

    editorArea.appendChild(lineNumbers);
    editorArea.appendChild(textarea);

    container.appendChild(header);
    container.appendChild(toolbar);
    container.appendChild(editorArea);

    return container;
  },

  lifecycle: {
    onMount: (element, props) => {
      const textarea = element.querySelector('.editor-textarea');
      const lineNumbers = element.querySelector('.editor-line-numbers');
      const charCount = element.querySelector('.editor-char-count');
      const saveBtn = element.querySelector('.editor-save-btn');
      const formatBtn = element.querySelector('.editor-format-btn');
      const languageSelect = element.querySelector('.editor-language');

      const updateLineNumbers = () => {
        const lines = textarea.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) =>
          `<div class="editor-line-number">${i + 1}</div>`
        ).join('');
        charCount.textContent = `${textarea.value.length} characters`;
      };

      // Sync scroll
      textarea.addEventListener('scroll', () => {
        lineNumbers.scrollTop = textarea.scrollTop;
      });

      textarea.addEventListener('input', updateLineNumbers);

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value =
            textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          updateLineNumbers();
        }
      });

      saveBtn?.addEventListener('click', () => {
        if (props.onSave) {
          props.onSave(textarea.value, {
            filename: element.querySelector('.editor-filename').value,
            language: languageSelect.value
          });
        }
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
          saveBtn.textContent = 'Save';
        }, 2000);
      });

      // Basic formatter: trim trailing spaces, ensure newline at end
      formatBtn?.addEventListener('click', () => {
        const lines = textarea.value.split('\n').map((l) => l.replace(/\s+$/g, ''));
        const formatted = lines.join('\n').replace(/\s+$/g, '');
        textarea.value = formatted.endsWith('\n') ? formatted : formatted;
        updateLineNumbers();
      });

      updateLineNumbers();
    }
  }
};

// ============= HELPER: Syntax Highlighting =============
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightSyntax(code, language) {
  const safe = escapeHTML(code || '');
  if (language === 'javascript' || language === 'js') {
    return safe
      .replace(/"([^"]*)"/g, '<span class="string">"&quot;$1&quot;"</span>')
      .replace(/'([^']*)'/g, "<span class=\"string\">'$1'</span>")
      .replace(/\b(function|const|let|var|if|else|return|class|async|await|import|export|default)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(\s+)(\d+)/g, '$1<span class="number">$2</span>');
  }
  return safe;
}

function updateCursorPosition(element, offset) {
  const lines = element.querySelector('.code-block').textContent.split('\n');
  let currentOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    if (currentOffset + lines[i].length >= offset) {
      const column = offset - currentOffset + 1;
      element.querySelector('#code-cursor-pos').textContent = `Line ${i + 1}, Column ${column}`;
      break;
    }
    currentOffset += lines[i].length + 1;
  }
}



window.CodeViewer = CodeViewer;
window.CodeEditor = CodeEditor;
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