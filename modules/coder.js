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
    this.searchActive = false;
    this.lastSaveTime = null;
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
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
    this.setupAutoSave();
    this.isInitialized = true;
  }

getTemplate() {
  return `
<div class="coderContainer">
  <div class="coderHeader">
    <!-- Left: File Info and Actions -->
    <div class="coderHeaderLeft">
      <div class="fileNameDisplay">
        <input type="text" id="fileNameInput" class="fileNameInput" value="" readonly spellcheck="false" />
      </div>
      <div class="actionButtons">
        <button id="editSaveBtn" class="actionButton" title="Edit">
          <svg id="editSaveIcon" class="icon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a1.75 1.75 0 0 1-.757.437l-3.26.88a.75.75 0 0 1-.918-.918l.88-3.26a1.75 1.75 0 0 1 .437-.757l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L11.26 3.3l1.44 1.44 1.113-1.113a.25.25 0 0 0 0-.354l-1.086-1.086Z"></path>
          </svg>
        </button>
        <button id="cancelBtn" class="actionButton hide" title="Cancel">
          <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
          </svg>
        </button>
        <button id="copyBtn" class="actionButton" title="Copy">
          <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 15h-7.5A1.75 1.75 0 0 1 0 13.25v-6.5Zm5-5A1.75 1.75 0 0 0 3.25 3.5v6.5A1.75 1.75 0 0 0 5 11.75h7.5A1.75 1.75 0 0 0 14.25 10V3.5A1.75 1.75 0 0 0 12.5 1.75H5Zm.25 1.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25H5.25Z"></path>
          </svg>
        </button>
        <button id="downloadBtn" class="actionButton" title="Download">
          <svg class="icon" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14H2.75Zm3.5-5.75a.75.75 0 0 1 1.5 0v-6.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1 1.5 0l-2.25 2.5a.75.75 0 0 1-1.06 0l-2.24-2.5Z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Right: Toolbar (horizontally scrollable) -->
    <div class="coderHeaderRight">
      <div class="toolbarScroll">
        <div class="toolbarButtons">
          <button id="themeToggleBtn" class="toolbarButton" title="Toggle Theme">
            <svg id="themeIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
            </svg>
          </button>
          <div class="fontSizeControl">
            <button id="decreaseFontBtn" class="fontButton" title="Decrease Font Size">
              <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5Z"></path>
              </svg>
            </button>
            <span id="fontSizeDisplay" class="fontSizeDisplay">12px</span>
            <button id="increaseFontBtn" class="fontButton" title="Increase Font Size">
              <svg class="tinyIcon" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.25 3.75a.75.75 0 0 1 1.5 0V7.25h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5Z"></path>
              </svg>
            </button>
          </div>
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
          <button id="foldAllBtn" class="toolbarButton" title="Fold All">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Z"></path>
            </svg>
          </button>
          <button id="unfoldAllBtn" class="toolbarButton" title="Unfold All">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.5 0a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v10.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25Z"></path>
            </svg>
          </button>
          <button id="fullscreenBtn" class="toolbarButton" title="Fullscreen">
            <svg id="fullscreenIcon" class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>
            </svg>
          </button>
          <button id="formatCodeBtn" class="toolbarButton hide" title="Format">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L3.06 7l2.72 2.72a.75.75 0 1 1-1.06 1.06L1.94 7.94a1.25 1.25 0 0 1 0-1.88Zm6.56 0a.75.75 0 0 0-1.06 1.06L12.94 7l-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.78-2.78a1.25 1.25 0 0 0 0-1.88Z"></path>
            </svg>
          </button>
          <button id="showInvisiblesBtn" class="toolbarButton" title="Show Invisibles">
            <svg class="smallIcon" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.25 5.75a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 0 1.5ZM3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8Zm.75 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- BODY - Editor Area (DON'T RENAME) -->
  <div id="coderWrapper">
    <div id="loadingSpinner" class="loading-spinner" data-active="false">
      <div class="spinner-overlay">
        <svg class="spinner-svg" viewBox="0 0 50 50">
          <circle class="spinner-track" cx="25" cy="25" r="20"></circle>
          <circle class="spinner-head" cx="25" cy="25" r="20"></circle>
        </svg>
      </div>
    </div>
    
    <!-- CodeMirror Container -->
    <div id="codeMirrorContainer"></div>
    
    <!-- Search Panel (positioned inside the editor) -->
    <div id="searchPanel" class="searchPanel hide">
      <div class="searchContainer">
        <input type="text" id="searchInput" class="searchInput" placeholder="Search..." autocomplete="off" />
        <div class="searchActions">
          <span id="searchMatches" class="searchMatches">0/0</span>
          <button id="searchPrevBtn" class="searchActionButton" title="Previous match">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          <button id="searchNextBtn" class="searchActionButton" title="Next match">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <button id="closeSearchBtn" class="searchActionButton" title="Close search">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER - Stats and Info -->
  <div class="coderFooter">
    <div class="coderFooterLeft">
      <span id="fileLinesCount" class="footerStat">0 lines</span>
      <span class="footerDivider">•</span>
      <span id="fileSize" class="footerStat">0 B</span>
      <span class="footerDivider">•</span>
      <span id="fileLanguageDisplay" class="footerStat">Text</span>
    </div>
    
    <div class="coderFooterRight">
      <span id="cursorPosition" class="footerStat">Ln 1, Col 1</span>
      <span class="footerDivider">•</span>
      <span id="selectionInfo" class="footerStat"></span>
      <span id="encodingDisplay" class="footerStat">UTF-8</span>
    </div>
  </div>

  <!-- Commit Panel -->
  <div id="commitPanel" class="commitPanel hide">
    <h3 class="panelTitle">Commit changes</h3>
    <div class="panelContent">
      <div class="commitField">
        <input type="text" id="commitTitleInput" class="commitInput" placeholder="Update filename.ext" spellcheck="false" />
      </div>
      <div class="commitField">
        <textarea id="commitDescriptionInput" rows="4" class="commitTextarea" placeholder="Add an optional extended description..." spellcheck="false"></textarea>
      </div>
      <div class="panelButtons">
        <button id="cancelEditBtn" class="secondaryButton">Cancel</button>
        <button id="saveChangesBtn" class="primaryButton">Commit changes</button>
      </div>
    </div>
  </div>
</div>
  `;
}

  cacheElements() {
    this.elements = {
      filePage: document.querySelector('.pages[data-page="file"]'),
      fileNameInput: document.getElementById("fileNameInput"),
      editSaveBtn: document.getElementById("editSaveBtn"),
      editSaveIcon: document.getElementById("editSaveIcon"),
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
      foldAllBtn: document.getElementById("foldAllBtn"),
      unfoldAllBtn: document.getElementById("unfoldAllBtn"),
      fullscreenBtn: document.getElementById("fullscreenBtn"),
      fullscreenIcon: document.getElementById("fullscreenIcon"),
      formatCodeBtn: document.getElementById("formatCodeBtn"),
      showInvisiblesBtn: document.getElementById("showInvisiblesBtn"),
      commitPanel: document.getElementById("commitPanel"),
      commitTitleInput: document.getElementById("commitTitleInput"),
      commitDescriptionInput: document.getElementById("commitDescriptionInput"),
      cancelEditBtn: document.getElementById("cancelEditBtn"),
      saveChangesBtn: document.getElementById("saveChangesBtn"),
      lastSavedIndicator: document.getElementById("lastSavedIndicator"),
      loadingSpinner: document.getElementById("loadingSpinner")
    };
  }

  bindEvents() {
    this.elements.editSaveBtn?.addEventListener("click", () => this.isEditing ? this.saveChanges() : this.enterEditMode());
    this.elements.cancelBtn?.addEventListener("click", () => this.cancelEdit());
    this.elements.decreaseFontBtn?.addEventListener("click", () => this.adjustFontSize(-1));
    this.elements.increaseFontBtn?.addEventListener("click", () => this.adjustFontSize(1));
    this.elements.themeToggleBtn?.addEventListener("click", () => this.toggleTheme());
    this.elements.wrapLinesBtn?.addEventListener("click", () => this.toggleWrapLines());
    this.elements.searchBtn?.addEventListener("click", () => this.openSearch());
    this.elements.foldAllBtn?.addEventListener("click", () => this.foldAll());
    this.elements.unfoldAllBtn?.addEventListener("click", () => this.unfoldAll());
    this.elements.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
    this.elements.formatCodeBtn?.addEventListener("click", () => this.formatCode());
    this.elements.showInvisiblesBtn?.addEventListener("click", () => this.toggleInvisibles());
    this.elements.saveChangesBtn?.addEventListener("click", () => this.saveChanges());
    this.elements.cancelEditBtn?.addEventListener("click", () => this.cancelEdit());
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
      if (this.currentFile && this.elements.fileNameInput.value !== this.currentFile) {
        this.renameFile(this.elements.fileNameInput.value);
      }
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
        if (this.searchActive) this.closeSearch();
        else if (this.isFullscreen) this.toggleFullscreen();
        else if (this.isEditing) this.cancelEdit();
      }
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
      if (ctrl && e.key === "h") {
        e.preventDefault();
        this.openSearchReplace();
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
      if (ctrl && e.key === "z" && !e.shiftKey && this.isEditing) {
        e.preventDefault();
        this.undo();
      }
      if (ctrl && e.key === "y" || (ctrl && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        this.redo();
      }
    });

    window.addEventListener("beforeunload", (e) => {
      if (this.isEditing && this.codeMirror && this.codeMirror.getValue() !== this.originalContent) {
        e.preventDefault();
        e.returnValue = "";
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
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
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
      lint: true,
      highlightSelectionMatches: {showToken: /\w/},
      extraKeys: {
        "Ctrl-S": () => this.saveChanges(),
        "Cmd-S": () => this.saveChanges(),
        "Ctrl-F": "findPersistent",
        "Ctrl-H": "replace",
        "Ctrl-/": "toggleComment",
        "Ctrl-Z": () => this.undo(),
        "Ctrl-Y": () => this.redo(),
        "Shift-Ctrl-Z": () => this.redo(),
        "Tab": "indentMore",
        "Shift-Tab": "indentLess"
      }
    });
    this.elements.fontSizeDisplay && (this.elements.fontSizeDisplay.textContent = `${fontSize}px`);
    this.updateThemeIcon(isDark);
    this.setCodeMirrorFontSize(fontSize);
    this.codeMirror.on("change", (instance, change) => {
      this.updateLineNumbers();
      this.saveUndoState(change);
      this.updateFileSize();
      this.updateLastSavedIndicator(false);
    });
    this.codeMirror.on("cursorActivity", () => this.updateCursorPosition());
    this.codeMirror.on("focus", () => this.onEditorFocus());
    this.codeMirror.on("blur", () => this.onEditorBlur());
    this.codeMirror.on("scroll", () => this.onEditorScroll());
  }

  loadUserPreferences() {
    const wrap = localStorage.getItem("gitcodr_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapLinesBtn?.classList.toggle("active", this.state.wrapLines);
    }
    const invisibles = localStorage.getItem("gitcodr_showInvisibles");
    if (invisibles !== null) {
      this.state.showInvisibles = invisibles === "true";
      this.codeMirror?.setOption("showInvisibles", this.state.showInvisibles);
      this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
    }
    const autoSave = localStorage.getItem("gitcodr_autoSave");
    if (autoSave !== null) {
      this.state.autoSave = autoSave === "true";
    }
  }

  setupAutoSave() {
    if (this.state.autoSave) {
      this.state.autoSaveInterval = setInterval(() => {
        if (this.isEditing && this.codeMirror && this.codeMirror.getValue() !== this.originalContent) {
          this.autoSave();
        }
      }, 30000);
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
      jsx: "jsx",
      tsx: "jsx",
      html: "htmlmixed",
      htm: "htmlmixed",
      css: "css",
      scss: "css",
      less: "css",
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
      sh: "shell",
      bash: "shell",
      rb: "ruby",
      go: "go",
      rs: "rust",
      cpp: "text/x-c++src",
      c: "text/x-csrc",
      cs: "text/x-csharp",
      swift: "swift"
    };
    const mode = modes[ext] || "text";
    this.codeMirror.setOption("mode", mode);
    if (mode === "javascript" || mode === "jsx" || mode === "text/x-c++src" || mode === "text/x-csrc" || mode === "python" || mode === "php") {
      this.codeMirror.setOption("lint", true);
    } else {
      this.codeMirror.setOption("lint", false);
    }
  }

  show() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => this.codeMirror?.refresh(), 50);
  }

  hide() {
    this.elements.filePage?.classList.add("hide");
  }

  enterEditMode() {
    if (!this.currentFile) return;
    this.showLoadingSpinner();
    this.isEditing = true;
    this.elements.editSaveIcon.innerHTML = `<path d="M13.488 2.512a1.75 1.75 0 0 0-2.475 0L6.175 7.35a.75.75 0 0 0-.206.578l.242 2.62a.75.75 0 0 0 .826.826l2.62.242a.75.75 0 0 0 .578-.206l4.838-4.838a1.75 1.75 0 0 0 0-2.475l-1.143-1.143Zm-1.06 1.06a.25.25 0 0 1 .354 0l1.143 1.143a.25.25 0 0 1 0 .354l-4.587 4.587-1.849-.171-.17-1.85 4.587-4.586Z"></path><path d="M1.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V6a.75.75 0 0 1 1.5 0v7.75A1.75 1.75 0 0 1 14.25 15.5H1.75A1.75 1.75 0 0 1 0 13.75V1.75C0 .784.784 0 1.75 0h6a.75.75 0 0 1 0 1.5Z"></path>`;
    this.elements.editSaveBtn.title = "Save";
    this.elements.cancelBtn?.classList.remove("hide");
    this.elements.formatCodeBtn?.classList.remove("hide");
    this.elements.commitPanel?.classList.remove("hide");
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      this.codeMirror.getWrapperElement().style.cursor = "text";
      this.saveUndoState();
    }
    this.updateCommitMessage();
    this.hideLoadingSpinner();
  }

  exitEditMode() {
    this.isEditing = false;
    this.elements.editSaveIcon.innerHTML = `<path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61a1.75 1.75 0 0 1-.757.437l-3.26.88a.75.75 0 0 1-.918-.918l.88-3.26a1.75 1.75 0 0 1 .437-.757l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L11.26 3.3l1.44 1.44 1.113-1.113a.25.25 0 0 0 0-.354l-1.086-1.086Z"></path>`;
    this.elements.editSaveBtn.title = "Edit";
    this.elements.cancelBtn?.classList.add("hide");
    this.elements.formatCodeBtn?.classList.add("hide");
    this.elements.commitPanel?.classList.add("hide");
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
      this.codeMirror.getWrapperElement().style.cursor = "default";
      this.undoHistory = [];
      this.redoHistory = [];
    }
    this.updateLastSavedIndicator(true);
  }

  cancelEdit() {
    if (!this.codeMirror) return;
    if (this.codeMirror.getValue() !== this.originalContent && !confirm("Discard unsaved changes?")) return;
    this.showLoadingSpinner();
    this.codeMirror.setValue(this.originalContent);
    this.updateLineNumbers();
    this.updateFileSize();
    setTimeout(() => {
      this.exitEditMode();
      this.hideLoadingSpinner();
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
          this.updateLastSavedIndicator(true);
        }
      }, 100);
    } else {
      this.codeMirror.setValue(this.originalContent);
      this.setCodeMirrorMode(filename);
      this.codeMirror.refresh();
      this.updateLastSavedIndicator(true);
    }
    this.exitEditMode();
    this.show();
    setTimeout(() => this.codeMirror?.refresh(), 200);
  }

  updateCommitMessage() {
    if (!this.currentFile || !this.elements.commitTitleInput) return;
    if (!this.elements.commitTitleInput.value.trim()) this.elements.commitTitleInput.value = `Update ${this.currentFile}`;
  }

  updateLineNumbers() {
    if (!this.codeMirror) return;
    const lines = this.codeMirror.getValue().split("\n").length;
    this.elements.fileLinesCount && (this.elements.fileLinesCount.textContent = `${lines} ${lines === 1 ? "line" : "lines"}`);
  }

  updateFileSize() {
    if (!this.codeMirror || !this.elements.fileSize) return;
    const content = this.codeMirror.getValue();
    const size = typeof formatFileSize === "function" ? formatFileSize(new Blob([content]).size) : `${(new Blob([content]).size / 1024).toFixed(2)} KB`;
    this.elements.fileSize.textContent = size;
  }

  updateCursorPosition() {
    if (!this.codeMirror || !this.elements.cursorPosition) return;
    const cursor = this.codeMirror.getCursor();
    this.elements.cursorPosition.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    const sel = this.codeMirror.getSelection();
    this.elements.selectionInfo && (this.elements.selectionInfo.textContent = sel ? `${sel.length} selected` : "");
  }

  updateLastSavedIndicator(saved) {
    if (!this.elements.lastSavedIndicator) return;
    if (saved) {
      const now = new Date();
      this.lastSaveTime = now;
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.elements.lastSavedIndicator.textContent = `Saved ${timeStr}`;
      this.elements.lastSavedIndicator.classList.add("saved");
      setTimeout(() => {
        this.elements.lastSavedIndicator.classList.remove("saved");
      }, 3000);
    } else {
      this.elements.lastSavedIndicator.textContent = "Unsaved";
      this.elements.lastSavedIndicator.classList.remove("saved");
    }
  }

  saveChanges() {
    if (!this.currentFile || !this.fileData) return;
    const commitTitle = this.elements.commitTitleInput?.value.trim();
    if (!commitTitle) {
      if (typeof showErrorMessage === "function") showErrorMessage("Please enter a commit message");
      return;
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
        setTimeout(() => {
          this.exitEditMode();
          if (typeof LoadingProgress !== "undefined") LoadingProgress.hide();
          if (this.elements.commitTitleInput) this.elements.commitTitleInput.value = "";
          if (this.elements.commitDescriptionInput) this.elements.commitDescriptionInput.value = "";
          this.updateLastSavedIndicator(true);
        }, 500);
      } catch (error) {
        if (typeof LoadingProgress !== "undefined") LoadingProgress.hide();
        if (typeof showErrorMessage === "function") showErrorMessage(`Save failed: ${error.message}`);
      }
    }, 500);
  }

  autoSave() {
    if (!this.currentFile || !this.fileData || !this.isEditing) return;
    const newContent = this.codeMirror ? this.codeMirror.getValue() : "";
    if (newContent === this.originalContent) return;
    try {
      this.fileData.content = newContent;
      this.fileData.lastModified = Date.now();
      this.fileData.lastCommit = "Auto-save";
      this.fileData.size = new Blob([newContent]).size;
      const filePath = (window.currentState?.path ? window.currentState.path + "/" : "") + this.currentFile;
      if (typeof LocalStorageManager !== "undefined") LocalStorageManager.saveFile(window.currentState?.repository, filePath, this.fileData);
      this.originalContent = newContent;
      this.updateLastSavedIndicator(true);
    } catch (error) {}
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

  renameFile(newName) {
    if (!this.currentFile || !newName || newName === this.currentFile) return;
    if (!confirm(`Rename "${this.currentFile}" to "${newName}"?`)) {
      this.elements.fileNameInput.value = this.currentFile;
      return;
    }
    const oldPath = (window.currentState?.path ? window.currentState.path + "/" : "") + this.currentFile;
    const newPath = (window.currentState?.path ? window.currentState.path + "/" : "") + newName;
    if (typeof LocalStorageManager !== "undefined") {
      const success = LocalStorageManager.renameFile(window.currentState?.repository, oldPath, newPath);
      if (success) {
        this.currentFile = newName;
        if (typeof showSuccessMessage === "function") showSuccessMessage(`Renamed to ${newName}`);
      } else {
        this.elements.fileNameInput.value = this.currentFile;
        if (typeof showErrorMessage === "function") showErrorMessage("Rename failed");
      }
    }
  }

  toggleWrapLines() {
    if (!this.codeMirror) return;
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    localStorage.setItem("gitcodr_wrapLines", this.state.wrapLines);
    this.elements.wrapLinesBtn?.classList.toggle("active", this.state.wrapLines);
  }

  toggleInvisibles() {
    if (!this.codeMirror) return;
    this.state.showInvisibles = !this.state.showInvisibles;
    this.codeMirror.setOption("showInvisibles", this.state.showInvisibles);
    localStorage.setItem("gitcodr_showInvisibles", this.state.showInvisibles);
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
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
    this.searchActive = true;
    this.codeMirror.execCommand("findPersistent");
    setTimeout(() => {
      const input = document.querySelector(".CodeMirror-search-field");
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  }

  openSearchReplace() {
    if (!this.codeMirror) return;
    this.searchActive = true;
    this.codeMirror.execCommand("replace");
    setTimeout(() => {
      const input = document.querySelector(".CodeMirror-search-field");
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  }

  closeSearch() {
    this.searchActive = false;
    const searchBox = document.querySelector(".CodeMirror-search");
    if (searchBox) {
      searchBox.style.display = "none";
    }
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
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML =
      `
      <path d="M5.5 2.75a.75.75 0 0 0-1.5 0v2.5H1.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 .75-.75v-3.25Zm5 0a.75.75 0 0 1 1.5 0v2.5h2.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75v-3.25Zm0 10.5v-2.5a.75.75 0 0 1 1.5 0v1.75h2.25a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Zm-5 0v-2.5a.75.75 0 0 0-1.5 0v1.75H1.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z"></path>
      `);
    } else {
      this.elements.coderWrapper.classList.remove("fullscreen");
      document.body.style.overflow = "";
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML =
      `
      <path d="M3.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5C2 2.784 2.784 2 3.75 2Zm6.5 0h2c.966 0 1.75.784 1.75 1.75v2a.75.75 0 0 1-1.5 0v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1 0-1.5Zm-9 8.25a.75.75 0 0 1 .75.75v2a.25.25 0 0 0 .25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25v-2a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2c0 .966-.784 1.75-1.75 1.75h-2a.75.75 0 0 1 0-1.5h2a.25.25 0 0 0 .25-.25v-2a.25.25 0 0 0-.25-.25h-2a.75.75 0 0 1-.75-.75Z"></path>
      `);
    }
    setTimeout(() => this.codeMirror?.refresh(), 100);
  }

  formatCode() {
    if (!this.codeMirror || !this.isEditing) return;
    const content = this.codeMirror.getValue();
    const mode = this.codeMirror.getOption("mode");
    let formatted = content;
    try {
      if (mode === "javascript" || mode === "jsx") {
        try {
          if (typeof prettier !== "undefined" && typeof prettierPlugins !== "undefined") {
            formatted = prettier.format(content, { parser: "babel", plugins: prettierPlugins });
          }
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
      if (mode === "htmlmixed") {
        try {
          if (typeof html_beautify !== "undefined") {
            formatted = html_beautify(content, { indent_size: 2, wrap_line_length: 80 });
          }
        } catch (_) {
          formatted = content;
        }
      }
      if (mode === "css") {
        try {
          if (typeof css_beautify !== "undefined") {
            formatted = css_beautify(content, { indent_size: 2 });
          }
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

  saveUndoState(change) {
    if (!this.codeMirror || !this.isEditing) return;
    if (change && change.origin === "undo") return;
    this.undoHistory.push({
      value: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor()
    });
    if (this.undoHistory.length > 50) {
      this.undoHistory.shift();
    }
    this.redoHistory = [];
  }

  undo() {
    if (!this.codeMirror || !this.isEditing || this.undoHistory.length === 0) return;
    const currentState = {
      value: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor()
    };
    this.redoHistory.push(currentState);
    const prevState = this.undoHistory.pop();
    this.codeMirror.setValue(prevState.value);
    this.codeMirror.setCursor(prevState.cursor);
  }

  redo() {
    if (!this.codeMirror || !this.isEditing || this.redoHistory.length === 0) return;
    const currentState = {
      value: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor()
    };
    this.undoHistory.push(currentState);
    const nextState = this.redoHistory.pop();
    this.codeMirror.setValue(nextState.value);
    this.codeMirror.setCursor(nextState.cursor);
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
      this.updateFileSize();
    }
  }

  onEditorFocus() {
    this.elements.coderWrapper?.classList.add("focused");
  }

  onEditorBlur() {
    this.elements.coderWrapper?.classList.remove("focused");
  }

  onEditorScroll() {}

  showLoadingSpinner() {
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.setAttribute("data-active", "true");
    }
  }

  hideLoadingSpinner() {
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.setAttribute("data-active", "false");
    }
  }

  destroy() {
    if (this.state.autoSaveInterval) {
      clearInterval(this.state.autoSaveInterval);
      this.state.autoSaveInterval = null;
    }
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
      this.codeMirror = null;
    }
    document.getElementById("coderViewEditStyles")?.remove();
    this.isInitialized = false;
    this.elements = {};
    this.undoHistory = [];
    this.redoHistory = [];
  }
  
  
  // Add to your class methods:

openSearch() {
  if (!this.codeMirror) {
    return;
  }
  
  // Show search panel
  if (this.elements.searchPanel) {
    this.elements.searchPanel.classList.remove("hide");
  }
  
  // Focus search input
  if (this.elements.searchInput) {
    this.elements.searchInput.focus();
    this.elements.searchInput.select();
  }
  
  // Initialize search if CodeMirror has findPersistent
  if (this.codeMirror.execCommand("findPersistent")) {
    this.codeMirror.execCommand("findPersistent");
  }
  
  // Setup search event listeners
  this.setupSearchListeners();
}

setupSearchListeners() {
  if (!this.elements.searchInput) return;
  
  // Debounced search handler
  const handleSearch = () => {
    const query = this.elements.searchInput.value;
    if (!query) {
      this.clearSearch();
      return;
    }
    
    // Use CodeMirror's search or implement custom search
    if (typeof this.codeMirror.search !== 'undefined') {
      this.codeMirror.search(query);
    } else {
      // Fallback search implementation
      this.performSearch(query);
    }
  };
  
  // Remove existing listeners
  this.elements.searchInput.removeEventListener('input', handleSearch);
  this.elements.searchInput.removeEventListener('keydown', this.boundEventHandlers.searchKeydown);
  
  // Add new listeners
  this.boundEventHandlers.searchKeydown = (e) => {
    if (e.key === 'Escape') {
      this.closeSearch();
    } else if (e.key === 'Enter' && e.shiftKey) {
      this.findPrevious();
    } else if (e.key === 'Enter') {
      this.findNext();
    }
  };
  
  this.elements.searchInput.addEventListener('input', handleSearch);
  this.elements.searchInput.addEventListener('keydown', this.boundEventHandlers.searchKeydown);
  
  // Search button listeners
  if (this.elements.searchNextBtn) {
    this.elements.searchNextBtn.onclick = () => this.findNext();
  }
  if (this.elements.searchPrevBtn) {
    this.elements.searchPrevBtn.onclick = () => this.findPrevious();
  }
  if (this.elements.closeSearchBtn) {
    this.elements.closeSearchBtn.onclick = () => this.closeSearch();
  }
}

closeSearch() {
  if (this.elements.searchPanel) {
    this.elements.searchPanel.classList.add("hide");
  }
  this.clearSearch();
  if (this.codeMirror) {
    this.codeMirror.focus();
  }
}

clearSearch() {
  if (this.elements.searchInput) {
    this.elements.searchInput.value = "";
  }
  if (this.elements.searchMatches) {
    this.elements.searchMatches.textContent = "0/0";
  }
  // Clear any search highlights
  if (this.codeMirror && typeof this.codeMirror.clearSearch === 'function') {
    this.codeMirror.clearSearch();
  }
}

findNext() {
  if (!this.codeMirror) return;
  
  const query = this.elements.searchInput?.value;
  if (!query) return;
  
  // Use CodeMirror's searchNext or implement custom
  if (typeof this.codeMirror.searchNext === 'function') {
    this.codeMirror.searchNext();
  }
}

findPrevious() {
  if (!this.codeMirror) return;
  
  const query = this.elements.searchInput?.value;
  if (!query) return;
  
  if (typeof this.codeMirror.searchPrev === 'function') {
    this.codeMirror.searchPrev();
  }
}

performSearch(query) {
  // Basic search implementation
  if (!this.codeMirror || !query) return;
  
  const content = this.codeMirror.getValue();
  const lines = content.split('\n');
  let matches = [];
  
  lines.forEach((line, index) => {
    let pos = -1;
    while ((pos = line.indexOf(query, pos + 1)) !== -1) {
      matches.push({
        line: index,
        ch: pos,
        length: query.length
      });
    }
  });
  
  // Update match count
  if (this.elements.searchMatches) {
    this.elements.searchMatches.textContent = `0/${matches.length}`;
  }
}
}

window.coderViewEdit = new coderViewEdit();
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) window.coderViewEdit.init();
});