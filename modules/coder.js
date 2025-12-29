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
    this.boundEventHandlers = {};
    this.debounceTimers = {};
    this.state = {
      fontSize: 12,
      wrapLines: true,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
      isDirty: false,
      lastSavedContent: "",
      undoHistory: [],
      redoHistory: [],
      maxUndoHistory: 100
    };
    this.modeMapping = {
      js: {
        mode: "javascript",
        mime: "text/javascript"
      },
      mjs: {
        mode: "javascript",
        mime: "text/javascript"
      },
      cjs: {
        mode: "javascript",
        mime: "text/javascript"
      },
      jsx: {
        mode: "jsx",
        mime: "text/jsx"
      },
      ts: {
        mode: "javascript",
        mime: "application/typescript"
      },
      tsx: {
        mode: "jsx",
        mime: "text/typescript-jsx"
      },
      html: {
        mode: "htmlmixed",
        mime: "text/html"
      },
      htm: {
        mode: "htmlmixed",
        mime: "text/html"
      },
      css: {
        mode: "css",
        mime: "text/css"
      },
      scss: {
        mode: "css",
        mime: "text/x-scss"
      },
      sass: {
        mode: "css",
        mime: "text/x-sass"
      },
      less: {
        mode: "css",
        mime: "text/x-less"
      },
      json: {
        mode: "javascript",
        mime: "application/json"
      },
      jsonc: {
        mode: "javascript",
        mime: "application/json"
      },
      md: {
        mode: "markdown",
        mime: "text/x-markdown"
      },
      markdown: {
        mode: "markdown",
        mime: "text/x-markdown"
      },
      py: {
        mode: "python",
        mime: "text/x-python"
      },
      python: {
        mode: "python",
        mime: "text/x-python"
      },
      php: {
        mode: "php",
        mime: "application/x-httpd-php"
      },
      java: {
        mode: "clike",
        mime: "text/x-java"
      },
      c: {
        mode: "clike",
        mime: "text/x-csrc"
      },
      cpp: {
        mode: "clike",
        mime: "text/x-c++src"
      },
      cs: {
        mode: "clike",
        mime: "text/x-csharp"
      },
      go: {
        mode: "go",
        mime: "text/x-go"
      },
      rust: {
        mode: "rust",
        mime: "text/x-rustsrc"
      },
      rs: {
        mode: "rust",
        mime: "text/x-rustsrc"
      },
      ruby: {
        mode: "ruby",
        mime: "text/x-ruby"
      },
      rb: {
        mode: "ruby",
        mime: "text/x-ruby"
      },
      xml: {
        mode: "xml",
        mime: "application/xml"
      },
      svg: {
        mode: "xml",
        mime: "image/svg+xml"
      },
      sql: {
        mode: "sql",
        mime: "text/x-sql"
      },
      yml: {
        mode: "yaml",
        mime: "text/x-yaml"
      },
      yaml: {
        mode: "yaml",
        mime: "text/x-yaml"
      },
      sh: {
        mode: "shell",
        mime: "text/x-sh"
      },
      bash: {
        mode: "shell",
        mime: "text/x-sh"
      },
      zsh: {
        mode: "shell",
        mime: "text/x-sh"
      },
      dockerfile: {
        mode: "dockerfile",
        mime: "text/x-dockerfile"
      },
      makefile: {
        mode: "shell",
        mime: "text/x-sh"
      },
      vue: {
        mode: "vue",
        mime: "text/x-vue"
      },
      svelte: {
        mode: "htmlmixed",
        mime: "text/html"
      },
      swift: {
        mode: "swift",
        mime: "text/x-swift"
      },
      kotlin: {
        mode: "clike",
        mime: "text/x-kotlin"
      },
      kt: {
        mode: "clike",
        mime: "text/x-kotlin"
      },
      scala: {
        mode: "clike",
        mime: "text/x-scala"
      },
      r: {
        mode: "r",
        mime: "text/x-rsrc"
      },
      lua: {
        mode: "lua",
        mime: "text/x-lua"
      },
      perl: {
        mode: "perl",
        mime: "text/x-perl"
      },
      pl: {
        mode: "perl",
        mime: "text/x-perl"
      },
      toml: {
        mode: "toml",
        mime: "text/x-toml"
      },
      ini: {
        mode: "properties",
        mime: "text/x-properties"
      },
      conf: {
        mode: "properties",
        mime: "text/x-properties"
      },
      diff: {
        mode: "diff",
        mime: "text/x-diff"
      },
      patch: {
        mode: "diff",
        mime: "text/x-diff"
      }
    };
  }

  init() {
    if (this.isInitialized) {
      return this;
    }
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) {
      return this;
    }
    filePage.innerHTML = this.getTemplate();
    this.cacheElements();
    this.bindEvents();
    this.initCodeMirrorWithRetry();
    this.loadUserPreferences();
    this.isInitialized = true;
    return this;
  }

  getTemplate() {
    return `

<!-- data-page="file" ---------------->
<div class="container">
  <div class="fileHeader">
    <!-- Header  -->

    <!-- Header  |  Left -->
    <div class="fileActions">
      <button id="editSaveBtn" class="actionButton" title="Edit">
        <svg id="editSaveIcon" class="icon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a1.75 1.75 0 0 1-.757.437l-3.26.88a.75.75 0 0 1-.918-.918l.88-3.26a1.75 1.75 0 0 1 .437-.757l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L11.26 3.3l1.44 1.44 1.113-1.113a.25.25 0 0 0 0-.354l-1.086-1.086Z"
          ></path>
        </svg>
      </button>
      <button id="cancelBtn" class="actionButton hide" title="Cancel">
        <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
          ></path>
        </svg>
      </button>
      <button id="copyBtn" class="actionButton" title="Copy">
        <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 15h-7.5A1.75 1.75 0 0 1 0 13.25v-6.5Zm5-5A1.75 1.75 0 0 0 3.25 3.5v6.5A1.75 1.75 0 0 0 5 11.75h7.5A1.75 1.75 0 0 0 14.25 10V3.5A1.75 1.75 0 0 0 12.5 1.75H5Zm.25 1.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25H5.25Z"
          ></path>
        </svg>
      </button>
      <button id="downloadBtn" class="actionButton" title="Download">
        <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14H2.75Zm3.5-5.75a.75.75 0 0 1 1.5 0v-6.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1 1.5 0l-2.25 2.5a.75.75 0 0 1-1.06 0l-2.24-2.5Z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Header  |  Right -->
    <div class="toolbarGroup">
      <button id="themeToggleBtn" class="toolbarButton" title="Toggle Theme">
        <svg id="themeIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
        </svg>
      </button>
      <div data-toolbar="fontSize" class="fontSizeControl">
        <button id="decreaseFontBtn" class="fontButton">
          <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5Z"></path>
          </svg>
        </button>
        <span id="fontSizeDisplay" class="fontSizeDisplay">12px</span>
        <button id="increaseFontBtn" class="fontButton">
          <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M7.25 3.75a.75.75 0 0 1 1.5 0V7.25h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5Z"
            ></path>
          </svg>
        </button>
      </div>
      <button id="wrapLinesBtn" class="toolbarButton" title="Wrap Lines">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M2 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.75-1.5a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5Zm0 4a.75.75 0 0 0 0 1.5h5.5a1 1 0 1 1 0 2H9.56a.5.5 0 0 1-.374-.832l1.72-1.868a.75.75 0 1 0-1.112-1.008l-2.063 2.24a2 2 0 0 0 1.49 3.468h1.69a2.5 2.5 0 1 0 0-5Zm-3.75 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
          ></path>
        </svg>
      </button>
      <button id="searchBtn" class="toolbarButton" title="Search">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M10.68 11.74a6 6 0 1 1 1.06-1.06l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.28-2.28ZM6.5 11A4.5 4.5 0 1 0 6.5 2a4.5 4.5 0 0 0 0 9Z"
          ></path>
        </svg>
      </button>
      <button id="foldAllBtn" class="toolbarButton" title="Fold All">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Z"
          ></path>
        </svg>
      </button>
      <button id="unfoldAllBtn" class="toolbarButton" title="Unfold All">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.5 0a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v10.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25Z"
          ></path>
        </svg>
      </button>
      <button id="fullscreenBtn" class="toolbarButton" title="Fullscreen">
        <svg id="fullscreenIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"
          ></path>
        </svg>
      </button>
      <button id="formatCodeBtn" class="toolbarButton hide" title="Format">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L3.06 7l2.72 2.72a.75.75 0 1 1-1.06 1.06L1.94 7.94a1.25 1.25 0 0 1 0-1.88Zm6.56 0a.75.75 0 0 0-1.06 1.06L12.94 7l-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.78-2.78a1.25 1.25 0 0 0 0-1.88Z"
          ></path>
        </svg>
      </button>
      <button id="showInvisiblesBtn" class="toolbarButton" title="Show Invisibles">
        <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M3.25 5.75a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 0 1.5ZM3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8Zm.75 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5Z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Coder  |  Component -->
<div id="coderWrapper">
  <div id="loadingSpinner" class="loading-spinner" data-active="false">
    <div class="spinner-overlay">
      <svg class="spinner-svg" viewBox="0 0 50 50">
        <circle class="spinner-track" cx="25" cy="25" r="20"></circle>
        <circle class="spinner-head" cx="25" cy="25" r="20"></circle>
      </svg>
    </div>
  </div>

  <!-- CodeMirror  |  Container -->
  <div id="codeMirrorContainer"></div>
</div>
<div class="fileFooter">
  <div class="footerStats">
    <span id="fileLinesCount">0 lines</span><span class="footerDivider">•</span> <span id="fileSize">0 KB</span
    ><span class="footerDivider">•</span>
    <span id="fileLanguageDisplay">Text</span>
  </div>

  <!-- Footer  |  Right -->
  <div class="footerRight">
    <span id="cursorPosition" class="cursorInfo">Ln 1, Col 1</span><span class="footerDivider">•</span>
    <span id="selectionInfo" class="selectionInfo"></span>
    <span id="encodingDisplay" class="encodingInfo">UTF-8</span>
  </div>
</div>

<!-- Commit  |  Save File -->
<div id="commitPanel" class="commitPanel hide">
  <h3 class="panelTitle">Commit changes</h3>
  <div class="panelContent">
    <div><input type="text" id="commitTitleInput" class="commitInput" placeholder="Update filename.ext" /></div>
    <div>
      <textarea
        id="commitDescriptionInput"
        rows="4"
        class="commitTextarea"
        placeholder="Add an optional extended description..."
      ></textarea>
    </div>
    <div class="panelButtons">
      <button id="cancelEditBtn" class="secondaryButton">Cancel</button>
      <button id="saveChangesBtn" class="primaryButton">Commit changes</button>
    </div>
  </div>
</div>
<!-- E N D -- E N D -- E N D ----------------------->


    `;
  }

  cacheElements() {
    const elementIds = [
      "fileNameInput",
      "editSaveBtn",
      "editSaveIcon",
      "cancelBtn",
      "copyBtn",
      "downloadBtn",
      "fileLinesCount",
      "fileSize",
      "fileLanguageDisplay",
      "cursorPosition",
      "selectionInfo",
      "coderWrapper",
      "codeMirrorContainer",
      "themeToggleBtn",
      "themeIcon",
      "decreaseFontBtn",
      "increaseFontBtn",
      "fontSizeDisplay",
      "wrapLinesBtn",
      "searchBtn",
      "foldAllBtn",
      "unfoldAllBtn",
      "fullscreenBtn",
      "fullscreenIcon",
      "formatCodeBtn",
      "showInvisiblesBtn",
      "commitPanel",
      "commitTitleInput",
      "commitDescriptionInput",
      "cancelEditBtn",
      "saveChangesBtn",
      "loadingSpinner"
    ];
    this.elements = {};
    elementIds.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });
    this.elements.filePage = document.querySelector('.pages[data-page="file"]');
  }

  debounce(func, wait, key) {
    return (...args) => {
      if (this.debounceTimers[key]) {
        clearTimeout(this.debounceTimers[key]);
      }
      this.debounceTimers[key] = setTimeout(() => {
        func.apply(this, args);
        delete this.debounceTimers[key];
      }, wait);
    };
  }

  throttle(func, limit, key) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  bindEvents() {
    this.boundEventHandlers.editSave = () => {
      if (this.isEditing) {
        this.saveChanges();
      } else {
        this.enterEditMode();
      }
    };
    this.boundEventHandlers.cancel = () => this.cancelEdit();
    this.boundEventHandlers.decreaseFont = () => this.adjustFontSize(-1);
    this.boundEventHandlers.increaseFont = () => this.adjustFontSize(1);
    this.boundEventHandlers.themeToggle = () => this.toggleTheme();
    this.boundEventHandlers.wrapLines = () => this.toggleWrapLines();
    this.boundEventHandlers.search = () => this.openSearch();
    this.boundEventHandlers.foldAll = () => this.foldAll();
    this.boundEventHandlers.unfoldAll = () => this.unfoldAll();
    this.boundEventHandlers.fullscreen = () => this.toggleFullscreen();
    this.boundEventHandlers.formatCode = () => this.formatCode();
    this.boundEventHandlers.showInvisibles = () => this.toggleInvisibles();
    this.boundEventHandlers.saveChanges = () => this.saveChanges();
    this.boundEventHandlers.cancelEdit = () => this.cancelEdit();
    this.boundEventHandlers.copy = () => this.copyCode();
    this.boundEventHandlers.download = () => this.downloadFile();

    this.safeAddEventListener(this.elements.editSaveBtn, "click", this.boundEventHandlers.editSave);
    this.safeAddEventListener(this.elements.cancelBtn, "click", this.boundEventHandlers.cancel);
    this.safeAddEventListener(this.elements.decreaseFontBtn, "click", this.boundEventHandlers.decreaseFont);
    this.safeAddEventListener(this.elements.increaseFontBtn, "click", this.boundEventHandlers.increaseFont);
    this.safeAddEventListener(this.elements.themeToggleBtn, "click", this.boundEventHandlers.themeToggle);
    this.safeAddEventListener(this.elements.wrapLinesBtn, "click", this.boundEventHandlers.wrapLines);
    this.safeAddEventListener(this.elements.searchBtn, "click", this.boundEventHandlers.search);
    this.safeAddEventListener(this.elements.foldAllBtn, "click", this.boundEventHandlers.foldAll);
    this.safeAddEventListener(this.elements.unfoldAllBtn, "click", this.boundEventHandlers.unfoldAll);
    this.safeAddEventListener(this.elements.fullscreenBtn, "click", this.boundEventHandlers.fullscreen);
    this.safeAddEventListener(this.elements.formatCodeBtn, "click", this.boundEventHandlers.formatCode);
    this.safeAddEventListener(this.elements.showInvisiblesBtn, "click", this.boundEventHandlers.showInvisibles);
    this.safeAddEventListener(this.elements.saveChangesBtn, "click", this.boundEventHandlers.saveChanges);
    this.safeAddEventListener(this.elements.cancelEditBtn, "click", this.boundEventHandlers.cancelEdit);
    this.safeAddEventListener(this.elements.copyBtn, "click", this.boundEventHandlers.copy);
    this.safeAddEventListener(this.elements.downloadBtn, "click", this.boundEventHandlers.download);

    if (this.elements.fileNameInput) {
      this.boundEventHandlers.fileNameDblClick = () => {
        if (this.isEditing) {
          this.elements.fileNameInput.readOnly = false;
          this.elements.fileNameInput.select();
        }
      };
      this.boundEventHandlers.fileNameBlur = () => {
        if (this.elements.fileNameInput) {
          this.elements.fileNameInput.readOnly = true;
        }
      };
      this.boundEventHandlers.fileNameKeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.elements.fileNameInput.blur();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          this.elements.fileNameInput.value = this.currentFile || "";
          this.elements.fileNameInput.blur();
        }
      };
      this.elements.fileNameInput.addEventListener("dblclick", this.boundEventHandlers.fileNameDblClick);
      this.elements.fileNameInput.addEventListener("blur", this.boundEventHandlers.fileNameBlur);
      this.elements.fileNameInput.addEventListener("keydown", this.boundEventHandlers.fileNameKeydown);
    }

    this.boundEventHandlers.keydown = (e) => this.handleGlobalKeydown(e);
    this.boundEventHandlers.beforeUnload = (e) => this.handleBeforeUnload(e);
    this.boundEventHandlers.visibilityChange = () => this.handleVisibilityChange();
    this.boundEventHandlers.resize = this.debounce(() => this.handleResize(), 150, "resize");

    document.addEventListener("keydown", this.boundEventHandlers.keydown);
    window.addEventListener("beforeunload", this.boundEventHandlers.beforeUnload);
    document.addEventListener("visibilitychange", this.boundEventHandlers.visibilityChange);
    window.addEventListener("resize", this.boundEventHandlers.resize);
  }

  safeAddEventListener(element, event, handler) {
    if (element && typeof handler === "function") {
      element.addEventListener(event, handler);
    }
  }

  safeRemoveEventListener(element, event, handler) {
    if (element && typeof handler === "function") {
      element.removeEventListener(event, handler);
    }
  }

  handleGlobalKeydown(e) {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key.toLowerCase() === "s" && this.isEditing) {
      e.preventDefault();
      this.saveChanges();
      return;
    }
    if (e.key === "Escape") {
      if (this.isFullscreen) {
        this.toggleFullscreen();
      } else if (this.isEditing) {
        this.cancelEdit();
      }
      return;
    }
    if (ctrl && e.key.toLowerCase() === "f") {
      e.preventDefault();
      this.openSearch();
      return;
    }
    if (ctrl && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      this.adjustFontSize(1);
      return;
    }
    if (ctrl && e.key === "-") {
      e.preventDefault();
      this.adjustFontSize(-1);
      return;
    }
    if (ctrl && e.key === "0") {
      e.preventDefault();
      this.setCodeMirrorFontSize(12);
      return;
    }
    if (e.key === "F11") {
      e.preventDefault();
      this.toggleFullscreen();
      return;
    }
  }

  handleBeforeUnload(e) {
    if (this.isEditing && this.hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      return e.returnValue;
    }
  }

  handleVisibilityChange() {
    if (document.visibilityState === "visible" && this.codeMirror) {
      requestAnimationFrame(() => {
        this.codeMirror.refresh();
      });
    }
  }

  handleResize() {
    if (this.codeMirror) {
      this.codeMirror.refresh();
    }
  }

  hasUnsavedChanges() {
    if (! this.codeMirror) {
      return false;
    }
    return this.codeMirror.getValue() !== this.originalContent;
  }

  initCodeMirrorWithRetry(attempts = 0) {
    const maxAttempts = 10;
    const retryDelay = 100;
    if (typeof CodeMirror !== "undefined") {
      this.setupCodeMirror();
      return;
    }
    if (attempts < maxAttempts) {
      setTimeout(() => {
        this.initCodeMirrorWithRetry(attempts + 1);
      }, retryDelay);
    }
  }

  setupCodeMirror() {
    if (typeof CodeMirror === "undefined") {
      return;
    }
    if (! this.elements.codeMirrorContainer) {
      return;
    }
    if (this.codeMirror) {
      return;
    }
    const fontSize = this.getSavedFontSize();
    const isDark = this.getIsDarkTheme();
    try {
      this.codeMirror = CodeMirror(this.elements.codeMirrorContainer, {
        value: "",
        mode: "javascript",
        theme: isDark ? "one-dark": "default",
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
        showInvisibles: this.state.showInvisibles,
        historyEventDelay: 250,
        extraKeys: {
          "Ctrl-S": () => {
            if (this.isEditing) {
              this.saveChanges();
            }
          },
          "Cmd-S": () => {
            if (this.isEditing) {
              this.saveChanges();
            }
          },
          "Ctrl-F": "findPersistent",
          "Cmd-F": "findPersistent",
          "Ctrl-/": "toggleComment",
          "Cmd-/": "toggleComment",
          "Ctrl-Z": () => {
            if (this.codeMirror) {
              this.codeMirror.undo();
            }
          },
          "Cmd-Z": () => {
            if (this.codeMirror) {
              this.codeMirror.undo();
            }
          },
          "Ctrl-Shift-Z": () => {
            if (this.codeMirror) {
              this.codeMirror.redo();
            }
          },
          "Cmd-Shift-Z": () => {
            if (this.codeMirror) {
              this.codeMirror.redo();
            }
          },
          "Ctrl-Y": () => {
            if (this.codeMirror) {
              this.codeMirror.redo();
            }
          }
        }
      });
      if (this.elements.fontSizeDisplay) {
        this.elements.fontSizeDisplay.textContent = `${fontSize}px`;
      }
      this.updateThemeIcon(isDark);
      this.setCodeMirrorFontSize(fontSize);
      this.codeMirror.on("change", this.debounce(() => {
        this.updateLineNumbers();
        this.state.isDirty = this.hasUnsavedChanges();
      }, 100, "change"));
      this.codeMirror.on("cursorActivity", this.throttle(() => {
        this.updateCursorPosition();
      }, 50, "cursor"));
      this.codeMirror.on("focus", () => {
        if (this.elements.coderWrapper) {
          this.elements.coderWrapper.classList.add("focused");
        }
      });
      this.codeMirror.on("blur",
        () => {
          if (this.elements.coderWrapper) {
            this.elements.coderWrapper.classList.remove("focused");
          }
        });
    } catch (error) {
      this.handleError("Failed to initialize code editor",
        error);
    }
  }

  getSavedFontSize() {
    const saved = localStorage.getItem("gitcodr_fontsize");
    const parsed = parseInt(saved,
      10);
    if (!isNaN(parsed) && parsed >= 8 && parsed <= 32) {
      return parsed;
    }
    return 12;
  }

  getIsDarkTheme() {
    const savedTheme = localStorage.getItem("gitcodr_theme");
    if (savedTheme === "dark") {
      return true;
    }
    if (savedTheme === "light") {
      return false;
    }
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  loadUserPreferences() {
    try {
      const wrap = localStorage.getItem("gitcodr_wrapLines");
      if (wrap !== null) {
        this.state.wrapLines = wrap === "true";
        if (this.codeMirror) {
          this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
        }
        if (this.elements.wrapLinesBtn) {
          this.elements.wrapLinesBtn.classList.toggle("active", this.state.wrapLines);
        }
      }
      const invisibles = localStorage.getItem("gitcodr_showInvisibles");
      if (invisibles !== null) {
        this.state.showInvisibles = invisibles === "true";
        if (this.codeMirror) {
          this.codeMirror.setOption("showInvisibles", this.state.showInvisibles);
        }
        if (this.elements.showInvisiblesBtn) {
          this.elements.showInvisiblesBtn.classList.toggle("active", this.state.showInvisibles);
        }
      }
      const highlightLine = localStorage.getItem("gitcodr_highlightActiveLine");
      if (highlightLine !== null) {
        this.state.highlightActiveLine = highlightLine === "true";
        if (this.codeMirror) {
          this.codeMirror.setOption("styleActiveLine", this.state.highlightActiveLine);
        }
      }
    } catch (error) {
      this.handleError("Failed to load user preferences", error);
    }
  }

  saveUserPreference(key, value) {
    try {
      localStorage.setItem(`gitcodr_${key}`, String(value));
    } catch (error) {
      this.handleError("Failed to save preference", error);
    }
  }

  setCodeMirrorFontSize(size) {
    if (! this.codeMirror) {
      return;
    }
    const clampedSize = Math.max(8, Math.min(32, size));
    const wrapper = this.codeMirror.getWrapperElement();
    if (wrapper) {
      wrapper.style.fontSize = `${clampedSize}px`;
    }
    this.state.fontSize = clampedSize;
    if (this.elements.fontSizeDisplay) {
      this.elements.fontSizeDisplay.textContent = `${clampedSize}px`;
    }
    this.saveUserPreference("fontsize", clampedSize);
    requestAnimationFrame(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
      }
    });
  }

  setCodeMirrorMode(filename) {
    if (!this.codeMirror || !filename) {
      return;
    }
    const ext = this.getFileExtension(filename);
    const modeInfo = this.modeMapping[ext];
    if (modeInfo) {
      this.codeMirror.setOption("mode", modeInfo.mime || modeInfo.mode);
    } else {
      this.codeMirror.setOption("mode", "text/plain");
    }
  }

  getFileExtension(filename) {
    if (!filename || typeof filename !== "string") {
      return "";
    }
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename === "dockerfile") {
      return "dockerfile";
    }
    if (lowerFilename === "makefile" || lowerFilename === "gnumakefile") {
      return "makefile";
    }
    const parts = filename.split(".");
    if (parts.length > 1) {
      return parts.pop().toLowerCase();
    }
    return "";
  }

  show() {
    if (this.elements.filePage) {
      this.elements.filePage.classList.remove("hide");
    }
  }

  hide() {
    if (this.elements.filePage) {
      this.elements.filePage.classList.add("hide");
    }
  }

  showLoading() {
    this.isLoading = true;
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.setAttribute("data-active", "true");
    }
    if (typeof LoadingSpinner !== "undefined" && LoadingSpinner.show) {
      LoadingSpinner.show();
    }
  }

  hideLoading() {
    this.isLoading = false;
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.setAttribute("data-active", "false");
    }
    if (typeof LoadingSpinner !== "undefined" && LoadingSpinner.hide) {
      LoadingSpinner.hide();
    }
  }

  enterEditMode() {
    if (!this.currentFile) {
      return;
    }
    if (this.isEditing) {
      return;
    }
    this.showLoading();
    this.isEditing = true;
    this.state.isDirty = false;
    if (this.elements.editSaveIcon) {
      this.elements.editSaveIcon.innerHTML = `<path d="M13.488 2.512a1.75 1.75 0 0 0-2.475 0L6.175 7.35a.75.75 0 0 0-.206.578l.242 2.62a.75.75 0 0 0 .826.826l2.62.242a.75.75 0 0 0 .578-.206l4.838-4.838a1.75 1.75 0 0 0 0-2.475l-1.143-1.143Zm-1.06 1.06a.25.25 0 0 1 .354 0l1.143 1.143a.25.25 0 0 1 0 .354l-4.587 4.587-1.849-.171-.17-1.85 4.587-4.586Z"></path><path d="M1.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V6a.75.75 0 0 1 1.5 0v7.75A1.75 1.75 0 0 1 14.25 15.5H1.75A1.75 1.75 0 0 1 0 13.75V1.75C0 .784.784 0 1.75 0h6a.75.75 0 0 1 0 1.5Z"></path>`;
    }
    if (this.elements.editSaveBtn) {
      this.elements.editSaveBtn.title = "Save";
      this.elements.editSaveBtn.setAttribute("aria-label", "Save changes");
    }
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.classList.remove("hide");
    }
    if (this.elements.formatCodeBtn) {
      this.elements.formatCodeBtn.classList.remove("hide");
    }
    if (this.elements.commitPanel) {
      this.elements.commitPanel.classList.remove("hide");
    }
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      const wrapper = this.codeMirror.getWrapperElement();
      if (wrapper) {
        wrapper.style.cursor = "text";
      }
      this.codeMirror.focus();
    }
    this.updateCommitMessage();
    requestAnimationFrame(() => {
      this.hideLoading();
    });
  }

  exitEditMode() {
    this.isEditing = false;
    this.state.isDirty = false;
    if (this.elements.editSaveIcon) {
      this.elements.editSaveIcon.innerHTML = `<path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a1.75 1.75 0 0 1-.757.437l-3.26.88a.75.75 0 0 1-.918-.918l.88-3.26a1.75 1.75 0 0 1 .437-.757l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L11.26 3.3l1.44 1.44 1.113-1.113a.25.25 0 0 0 0-.354l-1.086-1.086Z"></path>`;
    }
    if (this.elements.editSaveBtn) {
      this.elements.editSaveBtn.title = "Edit";
      this.elements.editSaveBtn.setAttribute("aria-label", "Edit file");
    }
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.classList.add("hide");
    }
    if (this.elements.formatCodeBtn) {
      this.elements.formatCodeBtn.classList.add("hide");
    }
    if (this.elements.commitPanel) {
      this.elements.commitPanel.classList.add("hide");
    }
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
      const wrapper = this.codeMirror.getWrapperElement();
      if (wrapper) {
        wrapper.style.cursor = "default";
      }
    }
  }

  cancelEdit() {
    if (! this.codeMirror) {
      return;
    }
    if (this.hasUnsavedChanges()) {
      if (! confirm("Discard unsaved changes?")) {
        return;
      }
    }
    this.showLoading();
    this.codeMirror.setValue(this.originalContent);
    this.codeMirror.clearHistory();
    this.updateLineNumbers();
    requestAnimationFrame(() => {
      this.exitEditMode();
      this.hideLoading();
    });
  }

  displayFile(filename, fileData) {
    if (!filename || ! fileData) {
      this.handleError("Invalid file data provided");
      return;
    }
    if (! this.isInitialized) {
      this.init();
    }
    this.showLoading();
    this.currentFile = filename;
    this.fileData = fileData;
    this.originalContent = fileData.content || "";
    this.state.lastSavedContent = this.originalContent;
    this.state.isDirty = false;
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.value = filename;
    }
    const ext = this.getFileExtension(filename);
    const language = typeof getLanguageName === "function" ? getLanguageName(ext): this.getLanguageDisplayName(ext);
    const contentBlob = new Blob([this.originalContent]);
    const size = typeof formatFileSize === "function" ? formatFileSize(contentBlob.size): this.formatBytes(contentBlob.size);
    const lines = this.countLines(this.originalContent);
    if (this.elements.fileLanguageDisplay) {
      this.elements.fileLanguageDisplay.textContent = language;
    }
    if (this.elements.fileLinesCount) {
      this.elements.fileLinesCount.textContent = `${lines} ${lines === 1 ? "line": "lines"}`;
    }
    if (this.elements.fileSize) {
      this.elements.fileSize.textContent = size;
    }
    if (! this.codeMirror) {
      this.setupCodeMirror();
      setTimeout(() => {
        this.setEditorContent(filename);
      }, 100);
    } else {
      this.setEditorContent(filename);
    }
    this.exitEditMode();
    this.show();
    requestAnimationFrame(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
        this.codeMirror.scrollTo(0, 0);
        this.codeMirror.setCursor(0, 0);
      }
      this.hideLoading();
    });
  }

  setEditorContent(filename) {
    if (this.codeMirror) {
      this.codeMirror.setValue(this.originalContent);
      this.setCodeMirrorMode(filename);
      this.codeMirror.clearHistory();
      this.codeMirror.refresh();
    }
  }

  countLines(content) {
    if (!content || typeof content !== "string") {
      return 0;
    }
    return content.split("\n").length;
  }

  getLanguageDisplayName(ext) {
    const languageNames = {
      js: "JavaScript",
      mjs: "JavaScript",
      cjs: "JavaScript",
      jsx: "JSX",
      ts: "TypeScript",
      tsx: "TSX",
      html: "HTML",
      htm: "HTML",
      css: "CSS",
      scss: "SCSS",
      sass: "Sass",
      less: "Less",
      json: "JSON",
      jsonc: "JSON",
      md: "Markdown",
      markdown: "Markdown",
      py: "Python",
      python: "Python",
      php: "PHP",
      java: "Java",
      c: "C",
      cpp: "C++",
      cs: "C#",
      go: "Go",
      rust: "Rust",
      rs: "Rust",
      ruby: "Ruby",
      rb: "Ruby",
      xml: "XML",
      svg: "SVG",
      sql: "SQL",
      yml: "YAML",
      yaml: "YAML",
      sh: "Shell",
      bash: "Bash",
      zsh: "Zsh",
      dockerfile: "Dockerfile",
      makefile: "Makefile",
      vue: "Vue",
      svelte: "Svelte",
      swift: "Swift",
      kotlin: "Kotlin",
      kt: "Kotlin",
      scala: "Scala",
      r: "R",
      lua: "Lua",
      perl: "Perl",
      pl: "Perl",
      toml: "TOML",
      ini: "INI",
      conf: "Config",
      diff: "Diff",
      patch: "Patch",
      txt: "Text"
    };
    return languageNames[ext] || ext.toUpperCase() || "Text";
  }

  formatBytes(bytes) {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024;
    const sizes = ["B",
      "KB",
      "MB",
      "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  }

  updateCommitMessage() {
    if (!this.currentFile || !this.elements.commitTitleInput) {
      return;
    }
    const currentValue = this.elements.commitTitleInput.value.trim();
    if (! currentValue) {
      this.elements.commitTitleInput.value = `Update ${this.currentFile}`;
    }
  }

  updateLineNumbers() {
    if (!this.codeMirror) {
      return;
    }
    const content = this.codeMirror.getValue();
    const lines = this.countLines(content);
    if (this.elements.fileLinesCount) {
      this.elements.fileLinesCount.textContent = `${lines} ${lines === 1 ? "line": "lines"}`;
    }
    const contentBlob = new Blob([content]);
    if (this.elements.fileSize) {
      const size = typeof formatFileSize === "function" ? formatFileSize(contentBlob.size): this.formatBytes(contentBlob.size);
      this.elements.fileSize.textContent = size;
    }
  }

  updateCursorPosition() {
    if (! this.codeMirror || !this.elements.cursorPosition) {
      return;
    }
    const cursor = this.codeMirror.getCursor();
    this.elements.cursorPosition.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    if (this.elements.selectionInfo) {
      const selections = this.codeMirror.getSelections();
      let totalLength = 0;
      let lineCount = 0;
      selections.forEach(sel => {
        totalLength += sel.length;
        if (sel.includes("\n")) {
          lineCount += sel.split("\n").length - 1;
        }
      });
      if (totalLength > 0) {
        let selText = `${totalLength} char${totalLength !== 1 ? "s": ""}`;
        if (lineCount > 0) {
          selText += `, ${lineCount + 1} line${lineCount !== 0 ? "s": ""}`;
        }
        this.elements.selectionInfo.textContent = selText;
      } else {
        this.elements.selectionInfo.textContent = "";
      }
    }
  }

  async saveChanges() {
    if (!this.currentFile || !this.fileData) {
      this.showMessage("error", "No file to save");
      return;
    }
    if (! this.isEditing) {
      return;
    }
    const commitTitle = this.elements.commitTitleInput?.value.trim();
    if (!commitTitle) {
      this.showMessage("error", "Please enter a commit message");
      if (this.elements.commitTitleInput) {
        this.elements.commitTitleInput.focus();
      }
      return;
    }
    this.showProgress();
    try {
      const newContent = this.codeMirror ? this.codeMirror.getValue(): "";
      const commitDescription = this.elements.commitDescriptionInput?.value.trim() || "";
      this.fileData.content = newContent;
      this.fileData.lastModified = Date.now();
      this.fileData.lastCommit = commitTitle;
      this.fileData.lastCommitDescription = commitDescription;
      this.fileData.size = new Blob([newContent]).size;
      const currentPath = window.currentState?.path || "";
      const filePath = currentPath ? `${currentPath}/${this.currentFile}`: this.currentFile;
      const repository = window.currentState?.repository;
      if (typeof LocalStorageManager !== "undefined" && LocalStorageManager.saveFile) {
        await Promise.resolve(LocalStorageManager.saveFile(repository, filePath, this.fileData));
      }
      this.originalContent = newContent;
      this.state.lastSavedContent = newContent;
      this.state.isDirty = false;
      this.showMessage("success", `Saved ${this.currentFile}`);
      requestAnimationFrame(() => {
        this.exitEditMode();
        this.hideProgress();
        if (this.elements.commitTitleInput) {
          this.elements.commitTitleInput.value = "";
        }
        if (this.elements.commitDescriptionInput) {
          this.elements.commitDescriptionInput.value = "";
        }
      });
    } catch (error) {
      this.hideProgress();
      this.handleError(`Save failed`,
        error);
    }
  }

  showProgress() {
    if (typeof LoadingProgress !== "undefined" && LoadingProgress.show) {
      LoadingProgress.show();
    }
  }

  hideProgress() {
    if (typeof LoadingProgress !== "undefined" && LoadingProgress.hide) {
      LoadingProgress.hide();
    }
  }

  showMessage(type, message) {
    const handlers = {
      success: typeof showSuccessMessage === "function" ? showSuccessMessage: null,
      error: typeof showErrorMessage === "function" ? showErrorMessage: null,
      info: typeof showInfoMessage === "function" ? showInfoMessage: null,
      warning: typeof showWarningMessage === "function" ? showWarningMessage: null
    };
    const handler = handlers[type];
    if (handler) {
      handler(message);
    }
  }

  handleError(message, error) {
    const errorMessage = error ? `${message}: ${error.message || error}`: message;
    this.showMessage("error", errorMessage);
  }

  async copyCode() {
    if (!this.codeMirror) {
      return;
    }
    const selection = this.codeMirror.getSelection();
    const content = selection || this.codeMirror.getValue();
    if (! content) {
      this.showMessage("info", "Nothing to copy");
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        this.showMessage("success", selection ? "Selection copied": "Copied to clipboard");
      } else {
        this.fallbackCopy(content);
      }
    } catch (error) {
      this.fallbackCopy(content);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        this.showMessage("success", "Copied to clipboard");
      } else {
        this.showMessage("error", "Failed to copy");
      }
    } catch (error) {
      this.showMessage("error", "Failed to copy");
    }
    document.body.removeChild(textArea);
  }

  downloadFile() {
    if (!this.currentFile) {
      this.showMessage("error", "No file to download");
      return;
    }
    const content = this.codeMirror ? this.codeMirror.getValue(): (this.fileData?.content || "");
    const mimeType = this.getMimeType(this.currentFile);
    try {
      const blob = new Blob([content], {
        type: `${mimeType};charset=utf-8`
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = this.currentFile;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      requestAnimationFrame(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      });
      this.showMessage("success", `Downloaded ${this.currentFile}`);
    } catch (error) {
      this.handleError("Download failed", error);
    }
  }

  getMimeType(filename) {
    const ext = this.getFileExtension(filename);
    const mimeTypes = {
      js: "text/javascript",
      mjs: "text/javascript",
      ts: "text/typescript",
      json: "application/json",
      html: "text/html",
      htm: "text/html",
      css: "text/css",
      xml: "application/xml",
      svg: "image/svg+xml",
      md: "text/markdown",
      txt: "text/plain"
    };
    return mimeTypes[ext] || "text/plain";
  }

  toggleWrapLines() {
    if (! this.codeMirror) {
      return;
    }
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    this.saveUserPreference("wrapLines", this.state.wrapLines);
    if (this.elements.wrapLinesBtn) {
      this.elements.wrapLinesBtn.classList.toggle("active", this.state.wrapLines);
      this.elements.wrapLinesBtn.setAttribute("aria-pressed", String(this.state.wrapLines));
    }
  }

  toggleInvisibles() {
    if (!this.codeMirror) {
      return;
    }
    this.state.showInvisibles = ! this.state.showInvisibles;
    this.codeMirror.setOption("showInvisibles", this.state.showInvisibles);
    this.saveUserPreference("showInvisibles", this.state.showInvisibles);
    if (this.elements.showInvisiblesBtn) {
      this.elements.showInvisiblesBtn.classList.toggle("active", this.state.showInvisibles);
      this.elements.showInvisiblesBtn.setAttribute("aria-pressed", String(this.state.showInvisibles));
    }
  }

  adjustFontSize(change) {
    const newSize = Math.max(8, Math.min(32, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) {
      this.setCodeMirrorFontSize(newSize);
    }
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const isDark = currentTheme === "dark";
    const newTheme = isDark ? "light": "dark";
    html.setAttribute("data-theme", newTheme);
    this.saveUserPreference("theme", newTheme);
    this.updateThemeIcon(! isDark);
    if (this.codeMirror) {
      this.codeMirror.setOption("theme", isDark ? "default": "one-dark");
    }
    this.dispatchThemeChangeEvent(newTheme);
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent("themechange", {
      detail: {
        theme: theme
      },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  updateThemeIcon(isDark) {
    if (! this.elements.themeIcon) {
      return;
    }
    if (isDark) {
      this.elements.themeIcon.innerHTML = '<path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"></path>';
    } else {
      this.elements.themeIcon.innerHTML = '<path d="M8 1.75a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5H8.75v1.25a.75.75 0 0 1-1.5 0V5.25H6a.75.75 0 0 1 0-1.5h1.25V2.5A.75.75 0 0 1 8 1.75Zm0 3.5a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Zm0-1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Z"></path>';
    }
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.setAttribute("aria-label", isDark ? "Switch to light theme": "Switch to dark theme");
    }
  }

  openSearch() {
    if (! this.codeMirror) {
      return;
    }
    try {
      this.codeMirror.execCommand("findPersistent");
      requestAnimationFrame(() => {
        const searchField = document.querySelector(".CodeMirror-search-field");
        if (searchField) {
          searchField.focus();
          if (searchField.select) {
            searchField.select();
          }
        }
      });
    } catch (error) {
      this.handleError("Search unavailable",
        error);
    }
  }

  foldAll() {
    if (!this.codeMirror) {
      return;
    }
    const lineCount = this.codeMirror.lineCount();
    this.codeMirror.operation(() => {
      for (let i = 0; i < lineCount; i++) {
        this.codeMirror.foldCode({
          line: i, ch: 0
        }, null, "fold");
      }
    });
  }

  unfoldAll() {
    if (!this.codeMirror) {
      return;
    }
    const lineCount = this.codeMirror.lineCount();
    this.codeMirror.operation(() => {
      for (let i = 0; i < lineCount; i++) {
        this.codeMirror.foldCode({
          line: i, ch: 0
        }, null, "unfold");
      }
    });
  }

  toggleFullscreen() {
    if (!this.elements.coderWrapper) {
      return;
    }
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
    requestAnimationFrame(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
        this.codeMirror.focus();
      }
    });
  }

  enterFullscreen() {
    this.elements.coderWrapper.classList.add("fullscreen");
    document.body.style.overflow = "hidden";
    if (this.elements.fullscreenIcon) {
      this.elements.fullscreenIcon.innerHTML = `<path d="M5.5 2.75a.75.75 0 0 0-1.5 0v2.5H1.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 .75-.75v-3.25Zm5 0a.75.75 0 0 1 1.5 0v2.5h2.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75v-3.25Zm0 10.5v-2.5a.75.75 0 0 1 1.5 0v1.75h2.25a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm-5 0v-2.5a.75.75 0 0 0-1.5 0v1.75H1.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z"></path>`;
    }
    if (this.elements.fullscreenBtn) {
      this.elements.fullscreenBtn.setAttribute("aria-label", "Exit fullscreen");
      this.elements.fullscreenBtn.setAttribute("aria-pressed", "true");
    }
  }

  exitFullscreen() {
    this.elements.coderWrapper.classList.remove("fullscreen");
    document.body.style.overflow = "";
    if (this.elements.fullscreenIcon) {
      this.elements.fullscreenIcon.innerHTML = `<path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>`;
    }
    if (this.elements.fullscreenBtn) {
      this.elements.fullscreenBtn.setAttribute("aria-label", "Enter fullscreen");
      this.elements.fullscreenBtn.setAttribute("aria-pressed", "false");
    }
  }

  formatCode() {
    if (! this.codeMirror || !this.isEditing) {
      return;
    }
    const content = this.codeMirror.getValue();
    const mode = this.codeMirror.getOption("mode");
    const cursor = this.codeMirror.getCursor();
    const scrollInfo = this.codeMirror.getScrollInfo();
    let formatted = content;
    let wasFormatted = false;
    try {
      if (mode === "javascript" || mode === "text/javascript" || mode === "application/typescript") {
        formatted = this.formatJavaScript(content);
        wasFormatted = formatted !== content;
      } else if (mode === "application/json") {
        formatted = this.formatJSON(content);
        wasFormatted = formatted !== content;
      } else if (mode === "text/html" || mode === "htmlmixed") {
        formatted = this.formatHTML(content);
        wasFormatted = formatted !== content;
      } else if (mode === "text/css" || mode === "css") {
        formatted = this.formatCSS(content);
        wasFormatted = formatted !== content;
      }
      if (wasFormatted) {
        this.codeMirror.operation(() => {
          this.codeMirror.setValue(formatted);
          this.codeMirror.setCursor(cursor);
          this.codeMirror.scrollTo(scrollInfo.left, scrollInfo.top);
        });
        this.showMessage("success", "Code formatted");
      } else {
        this.showMessage("info", "No formatting changes needed");
      }
    } catch (error) {
      this.handleError("Formatting failed", error);
    }
  }

  formatJavaScript(content) {
    if (typeof prettier !== "undefined" && typeof prettierPlugins !== "undefined") {
      try {
        return prettier.format(content, {
          parser: "babel",
          plugins: prettierPlugins,
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
          printWidth: 100
        });
      } catch (error) {
        return content;
      }
    }
    return content;
  }

  formatJSON(content) {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return content;
    }
  }

  formatHTML(content) {
    if (typeof prettier !== "undefined" && typeof prettierPlugins !== "undefined") {
      try {
        return prettier.format(content, {
          parser: "html",
          plugins: prettierPlugins,
          tabWidth: 2,
          useTabs: false,
          printWidth: 100
        });
      } catch (error) {
        return content;
      }
    }
    return content;
  }

  formatCSS(content) {
    if (typeof prettier !== "undefined" && typeof prettierPlugins !== "undefined") {
      try {
        return prettier.format(content, {
          parser: "css",
          plugins: prettierPlugins,
          tabWidth: 2,
          useTabs: false,
          printWidth: 100
        });
      } catch (error) {
        return content;
      }
    }
    return content;
  }

  setReadOnly(readOnly) {
    if (! this.codeMirror) {
      return;
    }
    this.codeMirror.setOption("readOnly", readOnly);
    const wrapper = this.codeMirror.getWrapperElement();
    if (wrapper) {
      wrapper.style.cursor = readOnly ? "default": "text";
    }
  }

  getValue() {
    if (this.codeMirror) {
      return this.codeMirror.getValue();
    }
    return this.originalContent || "";
  }

  setValue(content) {
    if (this.codeMirror) {
      this.codeMirror.setValue(content || "");
      this.updateLineNumbers();
    }
  }

  getSelection() {
    if (this.codeMirror) {
      return this.codeMirror.getSelection();
    }
    return "";
  }

  replaceSelection(text) {
    if (this.codeMirror && this.isEditing) {
      this.codeMirror.replaceSelection(text);
    }
  }

  getCursor() {
    if (this.codeMirror) {
      return this.codeMirror.getCursor();
    }
    return {
      line: 0,
      ch: 0
    };
  }

  setCursor(line, ch) {
    if (this.codeMirror) {
      this.codeMirror.setCursor(line, ch);
      this.codeMirror.focus();
    }
  }

  scrollToLine(line) {
    if (this.codeMirror) {
      const lineHeight = this.codeMirror.defaultTextHeight();
      const scrollInfo = this.codeMirror.getScrollInfo();
      const targetY = line * lineHeight - scrollInfo.clientHeight / 2;
      this.codeMirror.scrollTo(null, Math.max(0, targetY));
      this.codeMirror.setCursor(line, 0);
    }
  }

  highlightLine(line, className) {
    if (this.codeMirror) {
      return this.codeMirror.addLineClass(line, "background", className || "highlighted-line");
    }
    return null;
  }

  clearHighlight(lineHandle) {
    if (this.codeMirror && lineHandle) {
      this.codeMirror.removeLineClass(lineHandle, "background");
    }
  }

  getLineCount() {
    if (this.codeMirror) {
      return this.codeMirror.lineCount();
    }
    return 0;
  }

  getLine(n) {
    if (this.codeMirror) {
      return this.codeMirror.getLine(n);
    }
    return "";
  }

  refresh() {
    if (this.codeMirror) {
      requestAnimationFrame(() => {
        this.codeMirror.refresh();
      });
    }
  }

  focus() {
    if (this.codeMirror) {
      this.codeMirror.focus();
    }
  }

  blur() {
    if (this.codeMirror) {
      this.codeMirror.getInputField().blur();
    }
  }

  undo() {
    if (this.codeMirror && this.isEditing) {
      this.codeMirror.undo();
    }
  }

  redo() {
    if (this.codeMirror && this.isEditing) {
      this.codeMirror.redo();
    }
  }

  clearHistory() {
    if (this.codeMirror) {
      this.codeMirror.clearHistory();
    }
  }

  getHistory() {
    if (this.codeMirror) {
      return this.codeMirror.getHistory();
    }
    return null;
  }

  setHistory(history) {
    if (this.codeMirror && history) {
      this.codeMirror.setHistory(history);
    }
  }

  markText(from, to, options) {
    if (this.codeMirror) {
      return this.codeMirror.markText(from, to, options);
    }
    return null;
  }

  findMarks(from, to) {
    if (this.codeMirror) {
      return this.codeMirror.findMarks(from, to);
    }
    return [];
  }

  getAllMarks() {
    if (this.codeMirror) {
      return this.codeMirror.getAllMarks();
    }
    return [];
  }

  clearAllMarks() {
    if (this.codeMirror) {
      const marks = this.codeMirror.getAllMarks();
      marks.forEach(mark => mark.clear());
    }
  }

  on(event, callback) {
    if (this.codeMirror && typeof callback === "function") {
      this.codeMirror.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.codeMirror && typeof callback === "function") {
      this.codeMirror.off(event, callback);
    }
  }

  execCommand(command) {
    if (this.codeMirror) {
      this.codeMirror.execCommand(command);
    }
  }

  getOption(option) {
    if (this.codeMirror) {
      return this.codeMirror.getOption(option);
    }
    return null;
  }

  setOption(option, value) {
    if (this.codeMirror) {
      this.codeMirror.setOption(option, value);
    }
  }

  getWrapperElement() {
    if (this.codeMirror) {
      return this.codeMirror.getWrapperElement();
    }
    return null;
  }

  getScrollInfo() {
    if (this.codeMirror) {
      return this.codeMirror.getScrollInfo();
    }
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      clientWidth: 0,
      clientHeight: 0
    };
  }

  scrollTo(x, y) {
    if (this.codeMirror) {
      this.codeMirror.scrollTo(x, y);
    }
  }

  isClean() {
    return ! this.hasUnsavedChanges();
  }

  markClean() {
    if (this.codeMirror) {
      this.originalContent = this.codeMirror.getValue();
      this.state.lastSavedContent = this.originalContent;
      this.state.isDirty = false;
    }
  }

  getMode() {
    if (this.codeMirror) {
      return this.codeMirror.getOption("mode");
    }
    return null;
  }

  setMode(mode) {
    if (this.codeMirror) {
      this.codeMirror.setOption("mode", mode);
    }
  }

  getTheme() {
    if (this.codeMirror) {
      return this.codeMirror.getOption("theme");
    }
    return null;
  }

  setTheme(theme) {
    if (this.codeMirror) {
      this.codeMirror.setOption("theme", theme);
    }
  }

  getCurrentFile() {
    return this.currentFile;
  }

  getFileData() {
    return this.fileData;
  }

  getState() {
    return {
      currentFile: this.currentFile,
      isEditing: this.isEditing,
      isFullscreen: this.isFullscreen,
      isLoading: this.isLoading,
      isDirty: this.state.isDirty,
      fontSize: this.state.fontSize,
      wrapLines: this.state.wrapLines,
      showInvisibles: this.state.showInvisibles,
      hasUnsavedChanges: this.hasUnsavedChanges()
    };
  }

  destroy() {
    Object.keys(this.debounceTimers).forEach(key => {
      clearTimeout(this.debounceTimers[key]);
    });
    this.debounceTimers = {};
    if (this.state.autoSaveInterval) {
      clearInterval(this.state.autoSaveInterval);
      this.state.autoSaveInterval = null;
    }
    document.removeEventListener("keydown", this.boundEventHandlers.keydown);
    window.removeEventListener("beforeunload", this.boundEventHandlers.beforeUnload);
    document.removeEventListener("visibilitychange", this.boundEventHandlers.visibilityChange);
    window.removeEventListener("resize", this.boundEventHandlers.resize);
    if (this.elements.fileNameInput) {
      this.safeRemoveEventListener(this.elements.fileNameInput, "dblclick", this.boundEventHandlers.fileNameDblClick);
      this.safeRemoveEventListener(this.elements.fileNameInput, "blur", this.boundEventHandlers.fileNameBlur);
      this.safeRemoveEventListener(this.elements.fileNameInput, "keydown", this.boundEventHandlers.fileNameKeydown);
    }
    this.safeRemoveEventListener(this.elements.editSaveBtn, "click", this.boundEventHandlers.editSave);
    this.safeRemoveEventListener(this.elements.cancelBtn, "click", this.boundEventHandlers.cancel);
    this.safeRemoveEventListener(this.elements.decreaseFontBtn, "click", this.boundEventHandlers.decreaseFont);
    this.safeRemoveEventListener(this.elements.increaseFontBtn, "click", this.boundEventHandlers.increaseFont);
    this.safeRemoveEventListener(this.elements.themeToggleBtn, "click", this.boundEventHandlers.themeToggle);
    this.safeRemoveEventListener(this.elements.wrapLinesBtn, "click", this.boundEventHandlers.wrapLines);
    this.safeRemoveEventListener(this.elements.searchBtn, "click", this.boundEventHandlers.search);
    this.safeRemoveEventListener(this.elements.foldAllBtn, "click", this.boundEventHandlers.foldAll);
    this.safeRemoveEventListener(this.elements.unfoldAllBtn, "click", this.boundEventHandlers.unfoldAll);
    this.safeRemoveEventListener(this.elements.fullscreenBtn, "click", this.boundEventHandlers.fullscreen);
    this.safeRemoveEventListener(this.elements.formatCodeBtn, "click", this.boundEventHandlers.formatCode);
    this.safeRemoveEventListener(this.elements.showInvisiblesBtn, "click", this.boundEventHandlers.showInvisibles);
    this.safeRemoveEventListener(this.elements.saveChangesBtn, "click", this.boundEventHandlers.saveChanges);
    this.safeRemoveEventListener(this.elements.cancelEditBtn, "click", this.boundEventHandlers.cancelEdit);
    this.safeRemoveEventListener(this.elements.copyBtn, "click", this.boundEventHandlers.copy);
    this.safeRemoveEventListener(this.elements.downloadBtn, "click", this.boundEventHandlers.download);
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
      this.codeMirror = null;
    }
    const stylesElement = document.getElementById("coderViewEditStyles");
    if (stylesElement) {
      stylesElement.remove();
    }
    if (this.isFullscreen) {
      document.body.style.overflow = "";
    }
    this.currentFile = null;
    this.fileData = null;
    this.originalContent = "";
    this.isEditing = false;
    this.isLoading = false;
    this.isFullscreen = false;
    this.isInitialized = false;
    this.elements = {};
    this.boundEventHandlers = {};
    this.state = {
      fontSize: 12,
      wrapLines: true,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
      isDirty: false,
      lastSavedContent: "",
      undoHistory: [],
      redoHistory: [],
      maxUndoHistory: 100
    };
  }

  reset() {
    if (this.codeMirror) {
      this.codeMirror.setValue("");
      this.codeMirror.clearHistory();
    }
    this.currentFile = null;
    this.fileData = null;
    this.originalContent = "";
    this.state.isDirty = false;
    this.state.lastSavedContent = "";
    this.exitEditMode();
    this.updateLineNumbers();
    if (this.elements.fileLinesCount) {
      this.elements.fileLinesCount.textContent = "0 lines";
    }
    if (this.elements.fileSize) {
      this.elements.fileSize.textContent = "0 B";
    }
    if (this.elements.fileLanguageDisplay) {
      this.elements.fileLanguageDisplay.textContent = "Text";
    }
    if (this.elements.cursorPosition) {
      this.elements.cursorPosition.textContent = "Ln 1, Col 1";
    }
    if (this.elements.selectionInfo) {
      this.elements.selectionInfo.textContent = "";
    }
  }
}

window.coderViewEdit = new coderViewEdit();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.pages[data-page="file"]')) {
      window.coderViewEdit.init();
    }
  });
} else {
  if (document.querySelector('.pages[data-page="file"]')) {
    window.coderViewEdit.init();
  }
}
