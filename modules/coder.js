class coderViewEdit {
  constructor() {
    this.currentFile = null;
    this.fileData = null;
    this.codeMirror = null;
    this.isEditing = false;
    this.isLoading = false;
    this.originalContent = "";
    this.isInitialized = false;
    this.isFullscreen = false;
    this.elements = {};
    this.state = {
      fontSize: 12,
      wrapLines: true,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null
    };
  }
  init() {
    if (this.isInitialized) return;
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) return;
    filePage.innerHTML = this.getTemplate();
    this.cacheElements();
    this.bindEvents();
    if (typeof CodeMirror !== "undefined") this.setupCodeMirror();
    else setTimeout(() => this.setupCodeMirror(), 100);
    this.loadUserPreferences();
    this.isInitialized = true;
  }
  getTemplate() {
    return `
    <div class="code-viewer-wrapper">
      <!-- Improved Header -->
      <div class="code-viewer-header">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <button onclick="showExplorer()" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-github-fg-default bg-github-btn-secondary-bg hover:bg-github-btn-secondary-hover border border-github-border-default rounded-md transition-colors">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
            </svg>
            <span>${window.currentState?.repository || "Repository"}</span>
          </button>
          <span class="text-github-fg-muted">/</span>
          <input 
            type="text" 
            id="fileNameInput" 
            class="flex-1 min-w-0 px-3 py-1.5 text-sm font-mono text-github-fg-default bg-transparent border border-transparent rounded-md focus:border-github-border-default focus:bg-github-canvas-inset focus:outline-none transition-colors" 
            value="" 
            readonly 
          />
        </div>
        <div class="flex items-center gap-2">
          <button id="editBtn" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-github-btn-primary-bg hover:bg-github-btn-primary-hover rounded-md transition-colors" title="Edit file">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a1.75 1.75 0 0 1-.757.437l-3.26.88a.75.75 0 0 1-.918-.918l.88-3.26a1.75 1.75 0 0 1 .437-.757l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L11.26 3.3l1.44 1.44 1.113-1.113a.25.25 0 0 0 0-.354l-1.086-1.086Z"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button id="saveBtn" class="hidden inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-github-btn-primary-bg hover:bg-github-btn-primary-hover rounded-md transition-colors" title="Save changes">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
            <span>Save</span>
          </button>
          <button id="cancelBtn" class="hidden inline-flex items-center px-3 py-1.5 text-sm font-medium text-github-fg-default bg-github-btn-secondary-bg hover:bg-github-btn-secondary-hover border border-github-border-default rounded-md transition-colors" title="Cancel editing">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
            <span>Cancel</span>
          </button>
          <div class="h-6 w-px bg-github-border-default"></div>
          <button id="copyBtn" class="inline-flex items-center justify-center w-8 h-8 text-github-fg-muted hover:text-github-fg-default hover:bg-github-canvas-subtle rounded-md transition-colors" title="Copy content">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Zm5-5A1.75 1.75 0 0 0 3.25 3.5v7.5c0 .966.784 1.75 1.75 1.75h7.5A1.75 1.75 0 0 0 14.25 11V3.5A1.75 1.75 0 0 0 12.5 1.75h-7.5Zm.25 1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5Z"></path>
            </svg>
          </button>
          <button id="downloadBtn" class="inline-flex items-center justify-center w-8 h-8 text-github-fg-muted hover:text-github-fg-default hover:bg-github-canvas-subtle rounded-md transition-colors" title="Download file">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path>
              <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="code-viewer-toolbar">
        <div class="flex items-center gap-1">
          <button id="themeToggleBtn" class="toolbarButton" title="Toggle Theme">
            <svg id="themeIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
            </svg>
          </button>
          <div class="h-4 w-px bg-github-border-default mx-1"></div>
          <div data-toolbar="fontSize" class="fontSizeControl">
            <button id="decreaseFontBtn" class="fontButton">
              <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5Z"></path>
              </svg>
            </button>
            <span id="fontSizeDisplay" class="fontSizeDisplay">12px</span>
            <button id="increaseFontBtn" class="fontButton">
              <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.25 3.75a.75.75 0 0 1 1.5 0V7.25h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5Z"></path>
              </svg>
            </button>
          </div>
          <div class="h-4 w-px bg-github-border-default mx-1"></div>
          <button id="wrapLinesBtn" class="toolbarButton" title="Wrap Lines">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.75-1.5a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5Zm0 4a.75.75 0 0 0 0 1.5h5.5a1 1 0 1 1 0 2H9.56a.5.5 0 0 1-.374-.832l1.72-1.868a.75.75 0 1 0-1.112-1.008l-2.063 2.24a2 2 0 0 0 1.49 3.468h1.69a2.5 2.5 0 1 0 0-5Zm-3.75 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"></path>
            </svg>
          </button>
          <button id="searchBtn" class="toolbarButton" title="Search">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.28-2.28ZM6.5 11A4.5 4.5 0 1 0 6.5 2a4.5 4.5 0 0 0 0 9Z"></path>
            </svg>
          </button>
          <button id="fullscreenBtn" class="toolbarButton" title="Fullscreen">
            <svg id="fullscreenIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>
            </svg>
          </button>
          <button id="formatCodeBtn" class="toolbarButton hidden" title="Format">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L3.06 7l2.72 2.72a.75.75 0 1 1-1.06 1.06L1.94 7.94a1.25 1.25 0 0 1 0-1.88Zm6.56 0a.75.75 0 0 0-1.06 1.06L12.94 7l-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.78-2.78a1.25 1.25 0 0 0 0-1.88Z"></path>
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-3 text-xs text-github-fg-muted">
          <span id="fileLinesCount">0 lines</span>
          <span class="footerDivider">•</span>
          <span id="fileSize">0 KB</span>
          <span class="footerDivider">•</span>
          <span id="fileLanguageDisplay">Text</span>
        </div>
      </div>

      <!-- Code Editor -->
      <div id="coderWrapper">
        <div id="loadingSpinner" class="loading-spinner" data-active="false">
          <div class="spinner-overlay">
            <svg class="spinner-svg" viewBox="0 0 50 50">
              <circle class="spinner-track" cx="25" cy="25" r="20"></circle>
              <circle class="spinner-head" cx="25" cy="25" r="20"></circle>
            </svg>
          </div>
        </div>
        <div id="codeMirrorContainer"></div>
      </div>

      <!-- Footer -->
      <div class="fileFooter">
        <div class="footerStats">
          <span id="cursorPosition" class="cursorInfo">Ln 1, Col 1</span>
          <span class="footerDivider">•</span>
          <span id="selectionInfo" class="selectionInfo"></span>
        </div>
        <div class="footerRight">
          <span id="encodingDisplay" class="encodingInfo">UTF-8</span>
        </div>
      </div>
    </div>`;
  }
            <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.5 0a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v10.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25Z"></path>
          </svg>
        </button>
        <button id="fullscreenBtn" class="toolbarButton" title="Fullscreen">
          <svg id="fullscreenIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>
          </svg>
        </button>
        <button id="formatCodeBtn" class="toolbarButton hidden" title="Format">
          <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L3.06 7l2.72 2.72a.75.75 0 1 1-1.06 1.06L1.94 7.94a1.25 1.25 0 0 1 0-1.88Zm6.56 0a.75.75 0 0 0-1.06 1.06L12.94 7l-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.78-2.78a1.25 1.25 0 0 0 0-1.88Z"></path>
          </svg>
        </button>
      </div>
    </div>
    <div id="coderWrapper">
      <div id="loadingSpinner" class="loading-spinner" data-active="false">
        <div class="spinner-overlay">
          <svg class="spinner-svg" viewBox="0 0 50 50">
            <circle class="spinner-track" cx="25" cy="25" r="20"></circle>
            <circle class="spinner-head" cx="25" cy="25" r="20"></circle>
          </svg>
        </div>
      </div>
      <div id="codeMirrorContainer"></div>
    </div>
    <div class="fileFooter">
      <div class="footerStats">
        <span id="fileLinesCount">0 lines</span><span class="footerDivider">•</span>
        <span id="fileSize">0 KB</span><span class="footerDivider">•</span>
        <span id="fileLanguageDisplay">Text</span>
      </div>
      <div class="footerRight">
        <span id="cursorPosition" class="cursorInfo">Ln 1, Col 1</span><span class="footerDivider">•</span>
        <span id="selectionInfo" class="selectionInfo"></span>
        <span id="encodingDisplay" class="encodingInfo">UTF-8</span>
      </div>
    </div>
    <div id="commitPanel" class="commitPanel hidden">
      <h3 class="panelTitle">Commit changes</h3>
      <div class="panelContent">
        <div><input type="text" id="commitTitleInput" class="commitInput" placeholder="Update filename.ext"/></div>
        <div><textarea id="commitDescriptionInput" rows="4" class="commitTextarea" placeholder="Add an optional extended description..."></textarea></div>
        <div class="panelButtons">
          <button id="cancelEditBtn" class="secondaryButton">Cancel</button>
          <button id="saveChangesBtn" class="primaryButton">Commit changes</button>
        </div>
      </div>
    </div>`;
  }
  cacheElements() {
    this.elements = {
      filePage: document.querySelector('.pages[data-page="file"]'),
      fileNameInput: document.getElementById("fileNameInput"),
      editBtn: document.getElementById("editBtn"),
      saveBtn: document.getElementById("saveBtn"),
      cancelBtn: document.getElementById("cancelBtn"),
      copyBtn: document.getElementById("copyBtn"),
      downloadBtn: document.getElementById("downloadBtn"),
      fileLinesCount: document.getElementById("fileLinesCount"),
      fileSize: document.getElementById("fileSize"),
      fileLanguageDisplay: document.getElementById("fileLanguageDisplay"),
      cursorPosition: document.getElementById("cursorPosition"),
      selectionInfo: document.getElementById("selectionInfo"),
      coderWrapper: document.getElementById("coderWrapper"),
      codeMirrorContainer: document.getElementById("codeMirrorContainer"),
      themeToggleBtn: document.getElementById("themeToggleBtn"),
      themeIcon: document.getElementById("themeIcon"),
      decreaseFontBtn: document.getElementById("decreaseFontBtn"),
      increaseFontBtn: document.getElementById("increaseFontBtn"),
      fontSizeDisplay: document.getElementById("fontSizeDisplay"),
      wrapLinesBtn: document.getElementById("wrapLinesBtn"),
      searchBtn: document.getElementById("searchBtn"),
      fullscreenBtn: document.getElementById("fullscreenBtn"),
      fullscreenIcon: document.getElementById("fullscreenIcon"),
      formatCodeBtn: document.getElementById("formatCodeBtn")
    };
  }
  bindEvents() {
    this.elements.editBtn?.addEventListener("click", () => this.enterEditMode());
    this.elements.saveBtn?.addEventListener("click", () => this.showCommitModal());
    this.elements.cancelBtn?.addEventListener("click", () => this.cancelEdit());
    this.elements.decreaseFontBtn?.addEventListener("click", () => this.adjustFontSize(-1));
    this.elements.increaseFontBtn?.addEventListener("click", () => this.adjustFontSize(1));
    this.elements.themeToggleBtn?.addEventListener("click", () => this.toggleTheme());
    this.elements.wrapLinesBtn?.addEventListener("click", () => this.toggleWrapLines());
    this.elements.searchBtn?.addEventListener("click", () => this.openSearch());
    this.elements.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
    this.elements.formatCodeBtn?.addEventListener("click", () => this.formatCode());
    this.elements.copyBtn?.addEventListener("click", () => this.copyCode());
    this.elements.downloadBtn?.addEventListener("click", () => this.downloadFile());
    this.elements.fileNameInput?.addEventListener("dblclick", () => {
      if (this.isEditing) {
        this.elements.fileNameInput.readOnly = false;
        this.elements.fileNameInput.select();
      }
    });
    this.elements.fileNameInput?.addEventListener("blur", () => {
      this.elements.fileNameInput.readOnly = true;
    });
    this.elements.fileNameInput?.addEventListener("keydown", e => {
      if (e.key === "Enter") this.elements.fileNameInput.blur();
      if (e.key === "Escape") {
        this.elements.fileNameInput.value = this.currentFile;
        this.elements.fileNameInput.blur();
      }
    });
    document.addEventListener("keydown", e => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        this.saveChanges();
      }
      if (e.key === "Escape") {
        if (this.isFullscreen) this.toggleFullscreen();
        else if (this.isEditing) this.cancelEdit();
      }
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
      if (ctrl && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        this.adjustFontSize(1);
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        this.adjustFontSize(-1);
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        this.setCodeMirrorFontSize(12);
      }
      if (e.key === "F11") {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });
  }
  setupCodeMirror() {
    if (typeof CodeMirror === "undefined") {
      setTimeout(() => this.setupCodeMirror(), 100);
      return;
    }
    if (!this.elements.codeMirrorContainer || this.codeMirror) return;
    const fontSize = parseInt(localStorage.getItem("gitcodr_fontsize")) || 12;
    const savedTheme = localStorage.getItem("gitcodr_theme");
    const isDark = savedTheme === "dark" || (!savedTheme && document.documentElement.getAttribute("data-theme") === "dark");
    this.codeMirror = CodeMirror(this.elements.codeMirrorContainer, {
      value: "",
      mode: "javascript",
      theme: isDark ? "one-dark" : "default",
      lineNumbers: true,
      lineWrapping: this.state.wrapLines,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      readOnly: true,
      tabSize: 2,
      indentUnit: 2,
      smartIndent: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      scrollbarStyle: "native",
      viewportMargin: Infinity,
      styleActiveLine: this.state.highlightActiveLine,
      extraKeys: {
        "Ctrl-S": () => this.saveChanges(),
        "Cmd-S": () => this.saveChanges(),
        "Ctrl-F": "findPersistent",
        "Ctrl-/": "toggleComment"
      }
    });
    this.elements.fontSizeDisplay && (this.elements.fontSizeDisplay.textContent = `${fontSize}px`);
    this.updateThemeIcon(isDark);
    this.setCodeMirrorFontSize(fontSize);
    this.codeMirror.on("change", () => this.updateLineNumbers());
    this.codeMirror.on("cursorActivity", () => this.updateCursorPosition());
  }
  loadUserPreferences() {
    const wrap = localStorage.getItem("gitcodr_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapLinesBtn?.classList.toggle("active", this.state.wrapLines);
    }
  }
  setCodeMirrorFontSize(size) {
    if (!this.codeMirror) return;
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.state.fontSize = size;
    this.elements.fontSizeDisplay && (this.elements.fontSizeDisplay.textContent = `${size}px`);
    localStorage.setItem("gitcodr_fontsize", size);
    this.codeMirror.refresh();
  }
  setCodeMirrorMode(filename) {
    if (!this.codeMirror) return;
    const ext = filename.split(".").pop().toLowerCase();
    const modes = {
      js: "javascript",
      ts: "javascript",
      html: "htmlmixed",
      htm: "htmlmixed",
      css: "css",
      scss: "css",
      json: "application/json",
      md: "markdown",
      markdown: "markdown",
      py: "python",
      php: "php",
      java: "text/x-java",
      xml: "xml",
      sql: "sql",
      yml: "yaml",
      yaml: "yaml",
      sh: "shell"
    };
    this.codeMirror.setOption("mode", modes[ext] || "text");
  }
  show() {
    this.elements.filePage?.classList.remove("hidden");
  }
  hide() {
    this.elements.filePage?.classList.add("hidden");
  }
  enterEditMode() {
    if (!this.currentFile) return;
    if (typeof LoadingSpinner !== "undefined") LoadingSpinner.show();
    this.isEditing = true;
    
    // Toggle buttons
    this.elements.editBtn?.classList.add("hidden");
    this.elements.saveBtn?.classList.remove("hidden");
    this.elements.cancelBtn?.classList.remove("hidden");
    this.elements.formatCodeBtn?.classList.remove("hidden");
    
    // Enable editing
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      this.codeMirror.getWrapperElement().style.cursor = "text";
    }
    
    setTimeout(() => {
      if (typeof LoadingSpinner !== "undefined") LoadingSpinner.hide();
    }, 500);
  }
  exitEditMode() {
    this.isEditing = false;
    
    // Toggle buttons
    this.elements.editBtn?.classList.remove("hidden");
    this.elements.saveBtn?.classList.add("hidden");
    this.elements.cancelBtn?.classList.add("hidden");
    this.elements.formatCodeBtn?.classList.add("hidden");
    
    // Disable editing
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
      this.codeMirror.getWrapperElement().style.cursor = "default";
    }
  }
  cancelEdit() {
    if (!this.codeMirror) return;
    if (this.codeMirror.getValue() !== this.originalContent && !confirm("Discard unsaved changes?")) return;
    if (typeof LoadingSpinner !== "undefined") LoadingSpinner.show();
    this.codeMirror.setValue(this.originalContent);
    this.updateLineNumbers();
    setTimeout(() => {
      this.exitEditMode();
      if (typeof LoadingSpinner !== "undefined") LoadingSpinner.hide();
    }, 300);
  }
  displayFile(filename, fileData) {
    if (!this.isInitialized) this.init();
    this.currentFile = filename;
    this.fileData = fileData;
    this.originalContent = fileData.content || "";
    this.elements.fileNameInput && (this.elements.fileNameInput.value = filename);
    const ext = filename.split(".").pop().toLowerCase();
    const language = typeof getLanguageName === "function" ? getLanguageName(ext) : ext.toUpperCase();
    const size = typeof formatFileSize === "function" ? formatFileSize(new Blob([this.originalContent]).size) : `${(new Blob([this.originalContent]).size / 1024).toFixed(2)} KB`;
    const lines = this.originalContent.split("\n").length;
    this.elements.fileLanguageDisplay && (this.elements.fileLanguageDisplay.textContent = language);
    this.elements.fileLinesCount && (this.elements.fileLinesCount.textContent = `${lines} ${lines === 1 ? "line" : "lines"}`);
    this.elements.fileSize && (this.elements.fileSize.textContent = size);
    if (!this.codeMirror) {
      this.setupCodeMirror();
      setTimeout(() => {
        if (this.codeMirror) {
          this.codeMirror.setValue(this.originalContent);
          this.setCodeMirrorMode(filename);
          this.codeMirror.refresh();
        }
      }, 100);
    } else {
      this.codeMirror.setValue(this.originalContent);
      this.setCodeMirrorMode(filename);
      this.codeMirror.refresh();
    }
    this.exitEditMode();
    this.show();
    setTimeout(() => this.codeMirror?.refresh(), 200);
  }
  showCommitModal() {
    if (!this.currentFile) return;
    
    const modal = document.getElementById('commitModal');
    if (!modal) {
      console.error('Commit modal not found');
      return;
    }
    
    // Set default commit message
    const commitTitleInput = document.getElementById('commitTitle');
    if (commitTitleInput && !commitTitleInput.value.trim()) {
      commitTitleInput.value = `Update ${this.currentFile}`;
    }
    
    // Show changed file in modal
    const changedFiles = document.getElementById('changedFiles');
    if (changedFiles) {
      changedFiles.innerHTML = `
        <div class="flex items-center gap-2 text-sm text-github-fg-default">
          <svg class="w-3 h-3 text-github-warning-fg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
          </svg>
          <span class="font-mono">${this.currentFile}</span>
        </div>
      `;
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Setup modal event listeners
    const confirmBtn = modal.querySelector('[data-action="confirm-commit"]');
    const cancelBtn = modal.querySelector('[data-action="hide-commit-modal"]');
    
    const confirmHandler = () => this.saveChanges();
    const cancelHandler = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      confirmBtn?.removeEventListener('click', confirmHandler);
      cancelBtn?.removeEventListener('click', cancelHandler);
    };
    
    confirmBtn?.addEventListener('click', confirmHandler);
    cancelBtn?.addEventListener('click', cancelHandler);
  }
  updateCommitMessage() {
    if (!this.currentFile) return;
    const commitTitleInput = document.getElementById('commitTitle');
    if (commitTitleInput && !commitTitleInput.value.trim()) {
      commitTitleInput.value = `Update ${this.currentFile}`;
    }
  }
  updateLineNumbers() {
    if (!this.codeMirror) return;
    const lines = this.codeMirror.getValue().split("\n").length;
    this.elements.fileLinesCount && (this.elements.fileLinesCount.textContent = `${lines} ${lines === 1 ? "line" : "lines"}`);
  }
  updateCursorPosition() {
    if (!this.codeMirror || !this.elements.cursorPosition) return;
    const cursor = this.codeMirror.getCursor();
    this.elements.cursorPosition.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    const sel = this.codeMirror.getSelection();
    this.elements.selectionInfo && (this.elements.selectionInfo.textContent = sel ? `${sel.length} selected` : "");
  }
  saveChanges() {
    if (!this.currentFile || !this.fileData) return;
    
    // Get commit message from modal
    const commitTitleInput = document.getElementById('commitTitle');
    const commitTitle = commitTitleInput?.value.trim();
    
    if (!commitTitle) {
      if (typeof showErrorMessage === "function") showErrorMessage("Please enter a commit message");
      return;
    }
    
    // Hide modal
    const modal = document.getElementById('commitModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    
    if (typeof LoadingProgress !== "undefined") LoadingProgress.show();
    setTimeout(() => {
      try {
        const newContent = this.codeMirror ? this.codeMirror.getValue() : "";
        this.fileData.content = newContent;
        this.fileData.lastModified = Date.now();
        this.fileData.lastCommit = commitTitle;
        this.fileData.size = new Blob([newContent]).size;
        const filePath = (window.currentState?.path ? window.currentState.path + "/" : "") + this.currentFile;
        if (typeof LocalStorageManager !== "undefined") LocalStorageManager.saveFile(window.currentState?.repository, filePath, this.fileData);
        this.originalContent = newContent;
        if (typeof showSuccessMessage === "function") showSuccessMessage(`Saved ${this.currentFile}`);
        
        // Clear modal inputs
        if (commitTitleInput) commitTitleInput.value = "";
        const commitDescInput = document.getElementById('commitDescription');
        if (commitDescInput) commitDescInput.value = "";
        
        setTimeout(() => {
          this.exitEditMode();
          if (typeof LoadingProgress !== "undefined") LoadingProgress.hide();
        }, 500);
      } catch (error) {
        if (typeof LoadingProgress !== "undefined") LoadingProgress.hide();
        if (typeof showErrorMessage === "function") showErrorMessage(`Save failed: ${error.message}`);
      }
    }, 500);
  }
  copyCode() {
    if (!this.codeMirror) return;
    const content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    navigator.clipboard.writeText(content).then(() => {
      if (typeof showSuccessMessage === "function") showSuccessMessage("Copied to clipboard");
    }).catch(() => {
      if (typeof showErrorMessage === "function") showErrorMessage("Failed to copy");
    });
  }
  downloadFile() {
    if (!this.currentFile || !this.fileData) return;
    const content = this.codeMirror ? this.codeMirror.getValue() : this.fileData.content || "";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showSuccessMessage === "function") showSuccessMessage(`Downloaded ${this.currentFile}`);
  }
  toggleWrapLines() {
    if (!this.codeMirror) return;
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    localStorage.setItem("gitcodr_wrapLines", this.state.wrapLines);
    this.elements.wrapLinesBtn?.classList.toggle("active", this.state.wrapLines);
  }
  adjustFontSize(change) {
    const newSize = Math.max(8, Math.min(32, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) this.setCodeMirrorFontSize(newSize);
  }
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("gitcodr_theme", newTheme);
    this.updateThemeIcon(!isDark);
    this.codeMirror?.setOption("theme", isDark ? "default" : "one-dark");
  }
  updateThemeIcon(isDark) {
    if (!this.elements.themeIcon) return;
    this.elements.themeIcon.innerHTML = isDark
      ? '<path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"></path>'
      : '<path d="M8 1.75a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5H8.75v1.25a.75.75 0 0 1-1.5 0V5.25H6a.75.75 0 0 1 0-1.5h1.25V2.5A.75.75 0 0 1 8 1.75Zm0 3.5a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Zm0-1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Z"></path>';
  }
  openSearch() {
    if (!this.codeMirror) return;
    this.codeMirror.execCommand("findPersistent");
    setTimeout(() => {
      const input = document.querySelector(".CodeMirror-search-field");
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  }
  foldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) this.codeMirror.foldCode({ line: i, ch: 0 }, null, "fold");
    });
  }
  unfoldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) this.codeMirror.foldCode({ line: i, ch: 0 }, null, "unfold");
    });
  }
  toggleFullscreen() {
    if (!this.elements.coderWrapper) return;
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      this.elements.coderWrapper.classList.add("fullscreen");
      document.body.style.overflow = "hidden";
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML = '<path d="M5.5 2.75a.75.75 0 0 0-1.5 0v2.5H1.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 .75-.75v-3.25Zm5 0a.75.75 0 0 1 1.5 0v2.5h2.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75v-3.25Zm0 10.5v-2.5a.75.75 0 0 1 1.5 0v1.75h2.25a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm-5 0v-2.5a.75.75 0 0 0-1.5 0v1.75H1.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z"></path>');
    } else {
      this.elements.coderWrapper.classList.remove("fullscreen");
      document.body.style.overflow = "";
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML = '<path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2a1.75 1.75 0 0 1 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>');
    }
    setTimeout(() => this.codeMirror?.refresh(), 100);
  }
  formatCode() {
    if (!this.codeMirror || !this.isEditing) return;
    const content = this.codeMirror.getValue();
    const mode = this.codeMirror.getOption("mode");
    let formatted = content;
    try {
      if (mode === "javascript") {
        try {
          formatted = prettier.format(content, { parser: "babel", plugins: prettierPlugins });
        } catch (_) {
          formatted = content;
        }
      }
      if (mode === "application/json") {
        try {
          formatted = JSON.stringify(JSON.parse(content), null, 2);
        } catch (_) {
          formatted = content;
        }
      }
      if (formatted !== content) {
        const cursor = this.codeMirror.getCursor();
        this.codeMirror.setValue(formatted);
        this.codeMirror.setCursor(cursor);
        if (typeof showSuccessMessage === "function") showSuccessMessage("Code formatted");
      } else {
        if (typeof showInfoMessage === "function") showInfoMessage("No formatting changes");
      }
    } catch (error) {
      if (typeof showErrorMessage === "function") showErrorMessage("Formatting failed");
    }
  }
  setReadOnly(readOnly) {
    if (!this.codeMirror) return;
    this.codeMirror.setOption("readOnly", readOnly);
    this.codeMirror.getWrapperElement().style.cursor = readOnly ? "default" : "text";
  }
  getValue() {
    return this.codeMirror ? this.codeMirror.getValue() : "";
  }
  setValue(content) {
    if (this.codeMirror) {
      this.codeMirror.setValue(content);
      this.updateLineNumbers();
    }
  }
  destroy() {
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
      this.codeMirror = null;
    }
    document.getElementById("coderViewEditStyles")?.remove();
    this.isInitialized = false;
    this.elements = {};
  }
}
window.coderViewEdit = new coderViewEdit();
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) window.coderViewEdit.init();
});