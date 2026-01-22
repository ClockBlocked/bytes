class FullscreenManager {
  constructor(containerSelector = ".editorContainer") {
    this.isFullscreen = false;
    this.container = document.querySelector(containerSelector);
    this.editorCard = this.container?.querySelector('.editorCard');
    
    if (!this.editorCard) {
      console.error("FullscreenManager: EditorCard not found");
    }
    
    this.initializeListeners();
  }
  
  enter = function() {
    const elem = this.editorCard;
    
    if (!elem) {
      console.error("FullscreenManager: No editorCard to make fullscreen");
      this.fallbackFullscreen(true);
      return;
    }
    
    this.container?.setAttribute('data-fullscreen', 'true');
    
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else {
        throw new Error("Fullscreen API not supported");
      }
    } catch (error) {
      console.warn("Fullscreen API failed, using fallback:", error);
      this.fallbackFullscreen(true);
    }
  }.bind(this);
  
  exit = function() {
    this.container?.setAttribute('data-fullscreen', 'false');
    
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        throw new Error("Exit Fullscreen API not supported");
      }
    } catch (error) {
      console.warn("Exit Fullscreen API failed, using fallback:", error);
      this.fallbackFullscreen(false);
    }
  }.bind(this);
  
  toggle = function() {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  }.bind(this);
  
  fallbackFullscreen = function(enter) {
    this.isFullscreen = enter;
    const value = enter ? 'true' : 'false';
    this.container?.setAttribute('data-fullscreen', value);
    
    if (enter) {
      document.body.style.overflow = "hidden";
      this.container?.classList.add("fullscreen");
      document.addEventListener("keydown", this.handleEscapeKey);
    } else {
      document.body.style.overflow = "";
      this.container?.classList.remove("fullscreen");
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
    
    const event = new CustomEvent('fullscreenchange', { 
      detail: { 
        isFullscreen: enter,
        element: this.editorCard,
        timestamp: Date.now()
      } 
    });
    this.container?.dispatchEvent(event);
    window.dispatchEvent(new Event('resize'));
  }.bind(this);
  
  handleEscapeKey = function(e) {
    if (e.key === "Escape" && this.isFullscreen) {
      this.exit();
    }
  }.bind(this);
  
  initializeListeners = function() {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    const handler = () => {
      const isInFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      if (isInFullscreen !== this.isFullscreen) {
        this.isFullscreen = isInFullscreen;
        const value = isInFullscreen ? 'true' : 'false';
        this.container?.setAttribute('data-fullscreen', value);
        this.fallbackFullscreen(isInFullscreen);
      }
    };
    
    events.forEach(event => {
      document.addEventListener(event, handler);
    });
    
    // Store for cleanup
    this.eventHandlers = events.map(event => ({ event, handler }));
  }.bind(this);
  
  cleanup = function() {
    if (this.eventHandlers) {
      this.eventHandlers.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
    }
    document.removeEventListener("keydown", this.handleEscapeKey);
  }.bind(this);
  
  get isActive() {
    return this.isFullscreen;
  }
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript", ext: ["js", "jsx", "mjs"], mime: "text/javascript" },
  { value: "typescript", label: "TypeScript", ext: ["ts", "tsx"], mime: "text/typescript" },
  { value: "python", label: "Python", ext: ["py", "pyw"], mime: "text/x-python" },
  { value: "html", label: "HTML", ext: ["html", "htm"], mime: "text/html" },
  { value: "css", label: "CSS", ext: ["css", "scss", "less"], mime: "text/css" },
  { value: "json", label: "JSON", ext: ["json"], mime: "application/json" },
  { value: "markdown", label: "Markdown", ext: ["md", "markdown"], mime: "text/markdown" },
  { value: "yaml", label: "YAML", ext: ["yml", "yaml"], mime: "text/yaml" },
  { value: "xml", label: "XML", ext: ["xml"], mime: "text/xml" },
  { value: "sql", label: "SQL", ext: ["sql"], mime: "text/x-sql" },
  { value: "shell", label: "Shell", ext: ["sh", "bash", "zsh"], mime: "text/x-sh" },
  { value: "ruby", label: "Ruby", ext: ["rb"], mime: "text/x-ruby" },
  { value: "go", label: "Go", ext: ["go"], mime: "text/x-go" },
  { value: "rust", label: "Rust", ext: ["rs"], mime: "text/x-rustsrc" },
  { value: "java", label: "Java", ext: ["java"], mime: "text/x-java" },
  { value: "cpp", label: "C++", ext: ["cpp", "c", "h", "hpp", "cc"], mime: "text/x-c++src" },
  { value: "csharp", label: "C#", ext: ["cs"], mime: "text/x-csharp" },
  { value: "php", label: "PHP", ext: ["php", "php3", "php4", "php5"], mime: "text/x-php" },
  { value: "swift", label: "Swift", ext: ["swift"], mime: "text/x-swift" },
  { value: "kotlin", label: "Kotlin", ext: ["kt", "kts"], mime: "text/x-kotlin" },
  { value: "dart", label: "Dart", ext: ["dart"], mime: "application/dart" },
  { value: "vue", label: "Vue.js", ext: ["vue"], mime: "text/x-vue" },
  { value: "dockerfile", label: "Dockerfile", ext: ["dockerfile"], mime: "text/x-dockerfile" },
  { value: "toml", label: "TOML", ext: ["toml"], mime: "text/x-toml" },
  { value: "ini", label: "INI", ext: ["ini", "cfg", "conf"], mime: "text/x-ini" },
];

const CODEMIRROR_MODES = {
  javascript: "javascript",
  typescript: "javascript",
  python: "python",
  html: "htmlmixed",
  css: "css",
  json: "application/json",
  markdown: "markdown",
  yaml: "yaml",
  xml: "xml",
  sql: "sql",
  shell: "shell",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  java: "text/x-java",
  cpp: "text/x-c++src",
  csharp: "text/x-csharp",
  php: "php",
  swift: "swift",
  kotlin: "text/x-kotlin",
  dart: "dart",
  vue: "text/x-vue",
  dockerfile: "dockerfile",
  toml: "toml",
  ini: "text/x-ini",
};

class CodeViewEditor {
  constructor() {
    this.currentFile = null;
    this.fileData = null;
    this.codeMirror = null;
    this.isEditing = false;
    this.isLoading = false;
    this.isInitialized = false;
    this.searchActive = false;
    this.marks = [];
    this.debounceTimers = {};
    
    this.originalContent = "";
    this.languages = SUPPORTED_LANGUAGES;
    this.currentLanguage = "javascript";
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.elements = {};
    this.fullscreenManager = null;
    
    this.state = {
      fontSize: 14,
      wrapLines: false,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
      tabSize: 2,
      indentUnit: 2,
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      scrollPastEnd: true,
      dragDrop: true,
      allowDropFileTypes: ["text/plain", "text/html", "text/css", "text/javascript"],
    };
    
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
    this.lastSaveTime = null;
    this.autoSaveTimeout = null;
    
    this.boundEventHandlers = {};
    this.eventListeners = new Map();
    
    this.setupGlobalEventListeners();
    this.setupDragAndDrop();
  }
  
  init = function() {
    if (this.isInitialized) return;
    
    try {
      const filePage = document.querySelector('.pages[data-page="file"]');
      if (!filePage) {
        console.warn("CodeViewEditor: File page not found, delaying initialization");
        setTimeout(() => this.init(), 500);
        return;
      }
      
      filePage.innerHTML = AppAssets.templates.editor();
      this.injectPopover();
      this.injectNewFileDropdown();
      this.injectMoreOptionsDropdown();
      this.injectLanguageDropdown();
      this.cacheElements();
      this.bindElementEvents();
      this.setupNewFileButton();
      
      this.fullscreenManager = new FullscreenManager(".editorContainer");
      
      this.loadCodeMirrorDependencies().then(() => {
        this.setupCodeMirror();
        this.loadUserPreferences();
        this.setupAutoSave();
        this.isInitialized = true;
        
        // Check for file in URL or storage
        this.restoreSession();
      }).catch(error => {
        console.error("Failed to load CodeMirror:", error);
        this.setupFallbackEditor();
      });
      
    } catch (error) {
      console.error("CodeViewEditor initialization failed:", error);
    }
  }.bind(this);
  
  loadCodeMirrorDependencies = function() {
    return new Promise((resolve, reject) => {
      if (typeof CodeMirror !== "undefined") {
        resolve();
        return;
      }
      
      // Check multiple times for CodeMirror
      let attempts = 0;
      const checkInterval = setInterval(() => {
        if (typeof CodeMirror !== "undefined") {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts > 10) {
          clearInterval(checkInterval);
          reject(new Error("CodeMirror not loaded after 5 seconds"));
        }
        attempts++;
      }, 500);
    });
  }.bind(this);
  
  setupFallbackEditor = function() {
    const container = this.elements.codeMirrorContainer;
    if (!container) return;
    
    container.innerHTML = `
      <div class="fallback-editor">
        <textarea 
          class="fallback-textarea" 
          placeholder="CodeMirror not available. Using fallback text editor..."
          spellcheck="false"
        ></textarea>
        <div class="fallback-info">
          <small>Basic editor mode - install CodeMirror for full features</small>
        </div>
      </div>
    `;
    
    const textarea = container.querySelector('.fallback-textarea');
    textarea.addEventListener('input', () => {
      this.updateStats();
      this.updateModifiedBadge();
    });
    
    this.fallbackEditor = textarea;
  }.bind(this);
  
  cacheElements = function() {
    const elementIds = {
      filePage: '.pages[data-page="file"]',
      fileNameInput: "fileNameInput",
      fileExtensionBtn: "fileExtensionBtn",
      fileExtensionLabel: "fileExtensionLabel",
      modifiedIndicator: "modifiedIndicator",
      languageDropdown: "languageDropdown",
      languageList: "languageList",
      editModeBtn: "editModeBtn",
      viewModeBtn: "viewModeBtn",
      undoBtn: "undoBtn",
      redoBtn: "redoBtn",
      searchBtn: "searchBtn",
      wrapBtn: "wrapBtn",
      copyBtn: "copyBtn",
      downloadBtn: "downloadBtn",
      uploadBtn: "uploadBtn",
      themeBtn: "themeBtn",
      themeIcon: "themeIcon",
      fontDecreaseBtn: "fontDecreaseBtn",
      fontIncreaseBtn: "fontIncreaseBtn",
      fontSizeLabel: "fontSizeLabel",
      fullscreenBtn: "fullscreenBtn",
      fullscreenIcon: "fullscreenIcon",
      moreOptionsBtn: "moreOptionsBtn",
      moreOptionsDropdown: "moreOptionsDropdown",
      formatBtn: "formatBtn",
      foldAllBtn: "foldAllBtn",
      unfoldAllBtn: "unfoldAllBtn",
      showInvisiblesBtn: "showInvisiblesBtn",
      editorBody: "editorBody",
      codeMirrorContainer: "codeMirrorContainer",
      loadingSpinner: "loadingSpinner",
      searchPanel: "searchPanel",
      searchInput: "searchInput",
      searchMatches: "searchMatches",
      searchPrevBtn: "searchPrevBtn",
      searchNextBtn: "searchNextBtn",
      closeSearchBtn: "closeSearchBtn",
      replaceInput: "replaceInput",
      replaceBtn: "replaceBtn",
      replaceAllBtn: "replaceAllBtn",
      cursorLine: "cursorLine",
      cursorCol: "cursorCol",
      lineCount: "lineCount",
      charCount: "charCount",
      fileSize: "fileSize",
      statusIndicator: "statusIndicator",
      lastSaved: "lastSaved",
      languageBadge: "languageBadge",
      languageBadgeSmall: "languageBadgeSmall",
      fileUploadInput: "fileUploadInput",
      editSaveButton: "editSaveButton",
      editSaveLabel: "editSaveLabel",
      popoverTitle: "popoverTitle",
      popoverSubtitle: "popoverSubtitle",
      commitMessage: "commitMessage",
      commitCancelBtn: "commitCancelBtn",
      commitSaveBtn: "commitSaveBtn",
      headerScrollContainer: "headerScrollContainer",
      headerScrollLeft: "headerScrollLeft",
      headerScrollRight: "headerScrollRight",
      stickyHeader: "stickyHeader",
      breadCrumbsWrapper: "breadCrumbsWrapper",
      breadCrumbsContainer: "breadCrumbsContainer",
      coderToolBarWrapper: "coderToolBarWrapper",
      coderToolBar: "coderToolBar",
      newFileDropdown: "newFileDropdown",
      newFileWithRepo: "newFileWithRepo",
      newFileWithoutRepo: "newFileWithoutRepo",
      tabSizeInput: "tabSizeInput",
      indentUnitInput: "indentUnitInput",
      autoCloseBracketsBtn: "autoCloseBracketsBtn",
      lineNumbersBtn: "lineNumbersBtn",
      matchBracketsBtn: "matchBracketsBtn",
    };
    
    Object.entries(elementIds).forEach(([key, id]) => {
      if (key === "filePage") {
        this.elements[key] = document.querySelector(id);
      } else {
        this.elements[key] = document.getElementById(id);
      }
    });
    
    this.elements.pathBreadcrumb = document.getElementById('pathBreadcrumb');
    this.populateLanguageDropdown();
  }.bind(this);
  
  bindElementEvents = function() {
    this.bindEvent(this.elements.editModeBtn, "click", () => this.enterEditMode());
    this.bindEvent(this.elements.viewModeBtn, "click", () => this.exitEditMode());
    this.bindEvent(this.elements.undoBtn, "click", () => this.undo());
    this.bindEvent(this.elements.redoBtn, "click", () => this.redo());
    this.bindEvent(this.elements.searchBtn, "click", () => this.openSearch());
    this.bindEvent(this.elements.wrapBtn, "click", () => this.toggleWrapLines());
    this.bindEvent(this.elements.copyBtn, "click", () => this.copyCode());
    this.bindEvent(this.elements.downloadBtn, "click", () => this.downloadFile());
    this.bindEvent(this.elements.uploadBtn, "click", () => this.elements.fileUploadInput?.click());
    this.bindEvent(this.elements.themeBtn, "click", () => this.toggleTheme());
    this.bindEvent(this.elements.fontDecreaseBtn, "click", () => this.adjustFontSize(-1));
    this.bindEvent(this.elements.fontIncreaseBtn, "click", () => this.adjustFontSize(1));
    this.bindEvent(this.elements.fullscreenBtn, "click", () => this.toggleFullscreen());
    this.bindEvent(this.elements.fileUploadInput, "change", (e) => this.handleFileUpload(e));
    this.bindEvent(this.elements.searchPrevBtn, "click", () => this.findPrevious());
    this.bindEvent(this.elements.searchNextBtn, "click", () => this.findNext());
    this.bindEvent(this.elements.closeSearchBtn, "click", () => this.closeSearch());
    this.bindEvent(this.elements.headerScrollLeft, "click", () => this.scrollHeader('left'));
    this.bindEvent(this.elements.headerScrollRight, "click", () => this.scrollHeader('right'));
    this.bindEvent(this.elements.headerScrollContainer, "scroll", () => this.updateHeaderScrollButtons());
    
    if (this.elements.newFileWithRepo) {
      this.bindEvent(this.elements.newFileWithRepo, "click", () => this.handleNewFileWithRepo());
    }
    
    if (this.elements.newFileWithoutRepo) {
      this.bindEvent(this.elements.newFileWithoutRepo, "click", () => this.handleNewFileWithoutRepo());
    }
    
    this.bindEvent(this.elements.fileExtensionBtn, "click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.showLanguageDropdown(e);
    });
    
    this.bindEvent(this.elements.moreOptionsBtn, "click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.showMoreOptionsDropdown(e);
    });
    
    this.bindEvent(this.elements.editSaveButton, "click", (e) => {
      e.stopPropagation();
      if (!this.isEditing) {
        this.enterEditMode();
      } else {
        this.showCommitPopup(e);
      }
    });
    
    this.bindEvent(this.elements.commitCancelBtn, "click", () => this.hideCommitPopup());
    this.bindEvent(this.elements.commitSaveBtn, "click", () => this.saveChanges(true));
    
    this.bindEvent(this.elements.searchInput, "input", () => {
      this.debounce('search', () => {
        this.performSearch(this.elements.searchInput.value);
      }, 300);
    });
    
    this.bindEvent(this.elements.searchInput, "keydown", (e) => {
      if (e.key === "Escape") this.closeSearch();
      else if (e.key === "Enter" && e.shiftKey) this.findPrevious();
      else if (e.key === "Enter") this.findNext();
    });
    
    this.bindEvent(this.elements.commitMessage, "keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.saveChanges(true);
      }
    });
    
    // Advanced editor options
    if (this.elements.tabSizeInput) {
      this.bindEvent(this.elements.tabSizeInput, "change", (e) => {
        this.state.tabSize = parseInt(e.target.value) || 2;
        if (this.codeMirror) this.codeMirror.setOption("tabSize", this.state.tabSize);
        localStorage.setItem("editor_tabSize", this.state.tabSize);
      });
    }
    
    if (this.elements.indentUnitInput) {
      this.bindEvent(this.elements.indentUnitInput, "change", (e) => {
        this.state.indentUnit = parseInt(e.target.value) || 2;
        if (this.codeMirror) this.codeMirror.setOption("indentUnit", this.state.indentUnit);
        localStorage.setItem("editor_indentUnit", this.state.indentUnit);
      });
    }
    
    document.addEventListener("click", (e) => {
      const newFileButton = document.querySelector('[data-action="new-file"], #newFileButton');
      const dropdown = this.elements.newFileDropdown;
      
      if (dropdown && !dropdown.contains(e.target) && newFileButton && !newFileButton.contains(e.target)) {
        dropdown.classList.add("hide");
      }
      
      if (this.elements.commitDropdown && !this.elements.commitDropdown.contains(e.target) && !this.elements.editSaveButton.contains(e.target)) {
        this.hideCommitPopup();
      }
      
      if (this.elements.languageDropdown && !this.elements.languageDropdown.contains(e.target) && !this.elements.fileExtensionBtn.contains(e.target)) {
        this.hideLanguageDropdown();
      }
      
      if (this.elements.moreOptionsDropdown && !this.elements.moreOptionsDropdown.contains(e.target) && !this.elements.moreOptionsBtn.contains(e.target)) {
        this.hideMoreOptionsDropdown();
      }
    });
    
    window.addEventListener("resize", () => {
      this.debounce('resize', () => {
        if (this.elements.commitDropdown && !this.elements.commitDropdown.classList.contains("hide")) {
          this.calculateDropdownPosition();
        }
        this.updateHeaderScrollButtons();
        this.codeMirror?.refresh();
      }, 100);
    });
  }.bind(this);
  
  showMoreOptionsDropdown = function(e) {
    if (!this.elements.moreOptionsDropdown) {
      this.injectMoreOptionsDropdown();
    }
    
    const dropdown = this.elements.moreOptionsDropdown;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    
    // Hide other dropdowns
    this.hideLanguageDropdown();
    this.hideNewFileDropdown();
    
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      this.positionDropdown(dropdown, e?.currentTarget || this.elements.moreOptionsBtn);
      
      // Update toggle states
      if (this.elements.showInvisiblesBtn) {
        this.elements.showInvisiblesBtn.classList.toggle('active', this.state.showInvisibles);
      }
    }
  }.bind(this);
  
  hideLanguageDropdown = function() {
    if (this.elements.languageDropdown) {
      this.elements.languageDropdown.classList.add('hide');
    }
  }.bind(this);
  
  hideMoreOptionsDropdown = function() {
    if (this.elements.moreOptionsDropdown) {
      this.elements.moreOptionsDropdown.classList.add('hide');
    }
  }.bind(this);
  
  injectMoreOptionsDropdown = function() {
    const existing = document.getElementById('moreOptionsDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.moreOptionsDropdown());
    this.elements.moreOptionsDropdown = document.getElementById('moreOptionsDropdown');
    
    if (this.elements.moreOptionsDropdown) {
      this.elements.moreOptionsDropdown.classList.add('hide');
      this.elements.formatBtn = document.getElementById('formatBtn');
      this.elements.foldAllBtn = document.getElementById('foldAllBtn');
      this.elements.unfoldAllBtn = document.getElementById('unfoldAllBtn');
      this.elements.showInvisiblesBtn = document.getElementById('showInvisiblesBtn');
      
      this.bindEvent(this.elements.formatBtn, 'click', () => this.formatCode());
      this.bindEvent(this.elements.foldAllBtn, 'click', () => this.foldAll());
      this.bindEvent(this.elements.unfoldAllBtn, 'click', () => this.unfoldAll());
      this.bindEvent(this.elements.showInvisiblesBtn, 'click', () => this.toggleInvisibles());
    }
  }.bind(this);
  
  injectLanguageDropdown = function() {
    const existing = document.getElementById('languageDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.languageDropdown());
    this.elements.languageDropdown = document.getElementById('languageDropdown');
    this.elements.languageList = document.getElementById('languageList');
    
    if (this.elements.languageDropdown) {
      this.elements.languageDropdown.classList.add('hide');
    }
    
    this.populateLanguageDropdown();
  }.bind(this);
  
  populateLanguageDropdown = function() {
    if (!this.elements.languageList) return;
    
    this.elements.languageList.innerHTML = "";
    
    this.languages.forEach((lang) => {
      const btn = document.createElement("button");
      btn.className = "dropdown-item";
      btn.innerHTML = `
        <span class="lang-name">${lang.label}</span>
        <span class="lang-ext">${lang.ext.join(', ')}</span>
      `;
      btn.dataset.value = lang.value;
      
      btn.addEventListener("click", () => {
        this.setLanguage(lang.value);
        this.hideLanguageDropdown();
      });
      
      this.elements.languageList.appendChild(btn);
    });
  }.bind(this);
  
  showLanguageDropdown = function(e) {
    if (!this.elements.languageDropdown) {
      this.injectLanguageDropdown();
    }
    
    const dropdown = this.elements.languageDropdown;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    
    this.hideNewFileDropdown();
    this.hideMoreOptionsDropdown();
    
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      this.positionDropdown(dropdown, e?.currentTarget || this.elements.fileExtensionBtn);
    }
  }.bind(this);
  
  positionDropdown = function(dropdown, button) {
    if (!button || !dropdown) return;
    
    const rect = button.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust for viewport boundaries
    if (left + dropdownRect.width > viewportWidth) {
      left = viewportWidth - dropdownRect.width - 10;
    }
    
    if (left < 0) left = 10;
    
    if (top + dropdownRect.height > viewportHeight) {
      top = rect.top + window.scrollY - dropdownRect.height - 5;
    }
    
    if (top < 0) top = 10;
    
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.zIndex = '10000';
  }.bind(this);
  
  setupNewFileButton = function() {
    const newFileButton = document.querySelector('[data-action="new-file"], #newFileButton');
    
    if (newFileButton) {
      const newButton = newFileButton.cloneNode(true);
      newFileButton.parentNode.replaceChild(newButton, newFileButton);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showNewFileDropdown(e);
      });
    }
  }.bind(this);
  
  injectNewFileDropdown = function() {
    const existing = document.getElementById('newFileDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.newFileDropdown());
    
    this.elements.newFileDropdown = document.getElementById('newFileDropdown');
    this.elements.newFileWithRepo = document.getElementById('newFileWithRepo');
    this.elements.newFileWithoutRepo = document.getElementById('newFileWithoutRepo');
  }.bind(this);
  
  showNewFileDropdown = function(e) {
    if (!this.elements.newFileDropdown) {
      this.injectNewFileDropdown();
    }
    
    const dropdown = this.elements.newFileDropdown;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    
    this.hideLanguageDropdown();
    this.hideMoreOptionsDropdown();
    
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      const button = e?.currentTarget || document.querySelector('[data-action="new-file"], #newFileButton');
      this.positionDropdown(dropdown, button);
    }
  }.bind(this);
  
  handleNewFileWithRepo = function() {
    if (typeof window.showCreateFileModal === 'function') {
      window.showCreateFileModal();
    }
    this.hideNewFileDropdown();
  }.bind(this);
  
  handleNewFileWithoutRepo = function() {
    this.createNewStandaloneFile();
    this.hideNewFileDropdown();
  }.bind(this);
  
  createNewStandaloneFile = function() {
    const template = this.getTemplateForLanguage('javascript');
    this.currentFile = 'untitled.js';
    this.fileData = {
      content: template,
      category: 'General',
      tags: [],
      lastModified: Date.now(),
      lastCommit: 'Initial commit',
      size: new Blob([template]).size
    };
    this.originalContent = this.fileData.content;
    
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.value = 'untitled';
    }
    if (this.elements.fileExtensionLabel) {
      this.elements.fileExtensionLabel.textContent = '.js';
    }
    
    this.setLanguage('javascript');
    
    if (this.codeMirror) {
      this.codeMirror.setValue(this.fileData.content);
      this.codeMirror.refresh();
    } else if (this.fallbackEditor) {
      this.fallbackEditor.value = this.fileData.content;
    }
    
    this.updateStats();
    this.updateModifiedBadge();
    this.enterEditMode();
    this.show();
  }.bind(this);
  
  getTemplateForLanguage = function(language) {
    const templates = {
      javascript: `// New JavaScript file
// Created on ${new Date().toLocaleDateString()}

function main() {
  console.log("Hello, World!");
  // Start coding here...
}

main();`,
      typescript: `// New TypeScript file
// Created on ${new Date().toLocaleDateString()}

interface Example {
  message: string;
}

const example: Example = {
  message: "Hello, TypeScript!"
};

console.log(example.message);`,
      python: `# New Python file
# Created on ${new Date().toLocaleDateString()}

def main():
    print("Hello, World!")
    # Start coding here...

if __name__ == "__main__":
    main()`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML File</title>
    <style>
        /* Your CSS here */
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <!-- Your HTML here -->
    
    <script>
        // Your JavaScript here
    </script>
</body>
</html>`,
      css: `/* New CSS file */
/* Created on ${new Date().toLocaleDateString()} */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Your styles here */`,
      default: `// New file
// Created on ${new Date().toLocaleDateString()}

// Start coding here...`
    };
    
    return templates[language] || templates.default;
  }.bind(this);
  
  hideNewFileDropdown = function() {
    if (this.elements.newFileDropdown) {
      this.elements.newFileDropdown.classList.add('hide');
    }
  }.bind(this);
  
  setupCodeMirror = function() {
    if (!this.elements.codeMirrorContainer) return;
    
    if (typeof CodeMirror === "undefined") {
      console.warn("CodeMirror not available, using fallback editor");
      this.setupFallbackEditor();
      return;
    }
    
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
      this.codeMirror = null;
    }
    
    const fontSize = parseInt(localStorage.getItem("editor_fontsize")) || 14;
    const savedTheme = localStorage.getItem("editor_theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    
    const config = {
      value: "",
      mode: "javascript",
      theme: isDark ? "one-dark" : "default",
      lineNumbers: this.state.lineNumbers,
      lineWrapping: this.state.wrapLines,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
      readOnly: true,
      tabSize: this.state.tabSize,
      indentUnit: this.state.indentUnit,
      smartIndent: true,
      electricChars: true,
      matchBrackets: this.state.matchBrackets,
      autoCloseBrackets: this.state.autoCloseBrackets,
      scrollbarStyle: "native",
      viewportMargin: 10,
      styleActiveLine: this.state.highlightActiveLine,
      highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      lint: true,
      showCursorWhenSelecting: true,
      scrollPastEnd: this.state.scrollPastEnd,
      dragDrop: this.state.dragDrop,
      allowDropFileTypes: this.state.allowDropFileTypes,
      extraKeys: {
        "Ctrl-S": () => { if (this.isEditing) this.showCommitPopup(); },
        "Cmd-S": () => { if (this.isEditing) this.showCommitPopup(); },
        "Ctrl-F": () => this.openSearch(),
        "Ctrl-H": () => this.openReplace(),
        "Ctrl-/": "toggleComment",
        "Ctrl-Alt-/": "toggleComment",
        "Shift-Tab": "indentLess",
        "Ctrl-D": "selectNextOccurrence",
        "Ctrl-U": "undoSelection",
        "Ctrl-K Ctrl-D": "skipAndSelectNextOccurrence",
        "F11": () => this.toggleFullscreen(),
        "Esc": () => {
          if (this.searchActive) this.closeSearch();
          else if (this.fullscreenManager?.isActive) this.toggleFullscreen();
        }
      },
    };
    
    this.codeMirror = CodeMirror(this.elements.codeMirrorContainer, config);
    
    // Load saved font size
    const savedFontSize = localStorage.getItem("editor_fontsize");
    if (savedFontSize) {
      this.setCodeMirrorFontSize(parseInt(savedFontSize));
    }
    
    this.updateThemeIcon(isDark);
    
    // Setup event listeners
    this.codeMirror.on("change", () => {
      this.updateStats();
      this.updateModifiedBadge();
      this.handleAutoSave();
    });
    
    this.codeMirror.on("cursorActivity", () => {
      this.updateCursorPosition();
      this.updateSelectionInfo();
    });
    
    this.codeMirror.on("focus", () => {
      this.elements.editorBody?.classList.add("focused");
    });
    
    this.codeMirror.on("blur", () => {
      this.elements.editorBody?.classList.remove("focused");
    });
    
    this.codeMirror.on("scroll", () => {
      this.updateScrollPosition();
    });
    
    this.codeMirror.on("gutterClick", (cm, line, gutter) => {
      if (gutter === "CodeMirror-foldgutter") {
        cm.foldCode(cm.getCursor());
      }
    });
  }.bind(this);
  
  setCodeMirrorMode = function(langValue) {
    if (!this.codeMirror) return;
    
    const mode = CODEMIRROR_MODES[langValue] || "text";
    this.codeMirror.setOption("mode", mode);
    
    // Try to load mode if not available
    if (typeof CodeMirror.modes[mode] === "undefined") {
      console.warn(`CodeMirror mode ${mode} not loaded, trying to load...`);
    }
  }.bind(this);
  
  setupGlobalEventListeners = function() {
    document.addEventListener("keydown", (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const target = e.target;
      
      // Ignore if in input fields
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        this.showCommitPopup();
      }
      
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
      
      if (ctrl && e.key === "h") {
        e.preventDefault();
        this.openReplace();
      }
      
      if (e.key === "Escape") {
        if (this.searchActive) this.closeSearch();
        else if (this.fullscreenManager?.isActive) this.toggleFullscreen();
        else this.hideCommitPopup();
      }
    });
    
    // Handle system theme changes
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem("editor_theme")) {
        const isDark = e.matches;
        this.updateThemeIcon(isDark);
        if (this.codeMirror) {
          this.codeMirror.setOption("theme", isDark ? "one-dark" : "default");
        }
      }
    });
    
    // Handle page visibility
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.autoSave();
      }
    });
  }.bind(this);
  
  setupDragAndDrop = function() {
    const container = this.elements.editorBody;
    if (!container) return;
    
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('drag-over');
    });
    
    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleDroppedFiles(files);
      }
    });
  }.bind(this);
  
  handleDroppedFiles = function(files) {
    const file = files[0];
    if (!file.type.startsWith('text/') && !file.name.match(/\.(js|ts|py|html|css|json|md|txt)$/i)) {
      showErrorMessage?.("Only text files are supported");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.currentFile = file.name;
      
      const lastDotIndex = file.name.lastIndexOf('.');
      let name = file.name;
      let ext = "";
      if (lastDotIndex !== -1) {
        name = file.name.substring(0, lastDotIndex);
        ext = file.name.substring(lastDotIndex);
      }
      
      if (this.elements.fileNameInput) {
        this.elements.fileNameInput.value = name;
      }
      if (this.elements.fileExtensionLabel) {
        this.elements.fileExtensionLabel.textContent = ext || ".txt";
      }
      
      if (this.codeMirror) {
        this.codeMirror.setValue(content);
      } else if (this.fallbackEditor) {
        this.fallbackEditor.value = content;
      }
      
      this.setLanguage(this.detectLanguageFromExtension(file.name));
      this.originalContent = content;
      this.updateStats();
      this.updateModifiedBadge();
      this.enterEditMode();
      
      showSuccessMessage?.(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }.bind(this);
  
  setupAutoSave = function() {
    const autoSave = localStorage.getItem("editor_autoSave");
    this.state.autoSave = autoSave === "true";
    
    if (this.state.autoSave) {
      console.log("Auto-save enabled");
    }
  }.bind(this);
  
  handleAutoSave = function() {
    if (!this.state.autoSave || !this.isEditing) return;
    
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      if (this.isEditing && this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, 30000); // 30 seconds
  }.bind(this);
  
  autoSave = function() {
    if (!this.hasUnsavedChanges()) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : 
                   this.fallbackEditor ? this.fallbackEditor.value : "";
    
    if (content === this.originalContent) return;
    
    this.performSave("Auto-saved changes");
    showSuccessMessage?.("Auto-saved changes");
  }.bind(this);
  
  setLanguage = function(langValue) {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    
    this.currentLanguage = langValue;
    
    const ext = lang.ext[0];
    if (this.elements.fileExtensionLabel) {
      this.elements.fileExtensionLabel.textContent = `.${ext}`;
    }
    
    if (this.elements.languageBadge) {
      this.elements.languageBadge.innerHTML = AppAssets.icons.code(lang.label);
    }
    
    if (this.elements.languageBadgeSmall) {
      this.elements.languageBadgeSmall.textContent = lang.label;
    }
    
    this.hideLanguageDropdown();
    this.setCodeMirrorMode(langValue);
    
    // Update syntax highlighting
    if (this.codeMirror) {
      this.codeMirror.refresh();
    }
  }.bind(this);
  
  loadUserPreferences = function() {
    // Line wrapping
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
    }
    
    // Font size
    const fontSize = localStorage.getItem("editor_fontsize");
    if (fontSize) {
      this.setCodeMirrorFontSize(parseInt(fontSize));
    }
    
    // Tab size
    const tabSize = localStorage.getItem("editor_tabSize");
    if (tabSize) {
      this.state.tabSize = parseInt(tabSize);
      this.codeMirror?.setOption("tabSize", this.state.tabSize);
    }
    
    // Indent unit
    const indentUnit = localStorage.getItem("editor_indentUnit");
    if (indentUnit) {
      this.state.indentUnit = parseInt(indentUnit);
      this.codeMirror?.setOption("indentUnit", this.state.indentUnit);
    }
    
    // Load editor state
    this.restoreEditorState();
  }.bind(this);
  
  restoreEditorState = function() {
    const state = localStorage.getItem("editor_state");
    if (state && this.codeMirror) {
      try {
        const parsed = JSON.parse(state);
        this.codeMirror.setValue(parsed.content || "");
        if (parsed.cursor) {
          this.codeMirror.setCursor(parsed.cursor);
        }
        if (parsed.selections) {
          this.codeMirror.setSelections(parsed.selections);
        }
      } catch (e) {
        console.warn("Failed to restore editor state:", e);
      }
    }
  }.bind(this);
  
  saveEditorState = function() {
    if (!this.codeMirror) return;
    
    const state = {
      content: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor(),
      selections: this.codeMirror.listSelections(),
      timestamp: Date.now(),
      file: this.currentFile
    };
    
    localStorage.setItem("editor_state", JSON.stringify(state));
  }.bind(this);
  
  detectLanguageFromExtension = function(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    
    // Check for special cases
    if (filename.toLowerCase() === 'dockerfile') return 'dockerfile';
    if (filename.toLowerCase() === 'makefile') return 'shell';
    
    return "javascript";
  }.bind(this);
  
  showCommitPopup = function(e) {
    if (!this.elements.commitDropdown) return;
    
    this.elements.commitDropdown.classList.remove("hide");
    this.calculateDropdownPosition();
    
    if (this.elements.popoverTitle) {
      this.elements.popoverTitle.textContent = this.currentFile ? `Save ${this.currentFile}` : "Save File";
    }
    
    if (this.elements.popoverSubtitle) {
      this.elements.popoverSubtitle.textContent = "Enter a commit message (optional)";
    }
    
    if (this.elements.commitMessage) {
      const defaultMessage = this.currentFile ? 
        `Update ${this.currentFile} - ${new Date().toLocaleDateString()}` : 
        "Save changes";
      this.elements.commitMessage.value = defaultMessage;
      this.elements.commitMessage.select();
    }
  }.bind(this);
  
  hideCommitPopup = function() {
    if (!this.elements.commitDropdown) return;
    
    this.elements.commitDropdown.classList.add("hide");
    if (this.elements.commitMessage) {
      this.elements.commitMessage.value = "";
    }
  }.bind(this);
  
  injectPopover = function() {
    const existing = document.getElementById("commitDropdown");
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.commitDropdown());
    this.elements.commitDropdown = document.getElementById("commitDropdown");
  }.bind(this);
  
  calculateDropdownPosition = function() {
    if (!this.elements.editSaveButton || !this.elements.commitDropdown) return;
    
    const buttonRect = this.elements.editSaveButton.getBoundingClientRect();
    const dropdown = this.elements.commitDropdown;
    const dropdownRect = dropdown.getBoundingClientRect();
    
    let top = buttonRect.bottom + window.scrollY + 8;
    let left = buttonRect.left + window.scrollX;
    
    // Adjust to fit viewport
    if (left + dropdownRect.width > window.innerWidth) {
      left = window.innerWidth - dropdownRect.width - 10;
    }
    
    if (top + dropdownRect.height > window.innerHeight) {
      top = buttonRect.top + window.scrollY - dropdownRect.height - 8;
    }
    
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }.bind(this);
  
  showLoadingSpinner = function() {
    this.isLoading = true;
    this.elements.loadingSpinner?.setAttribute("data-active", "true");
  }.bind(this);
  
  hideLoadingSpinner = function() {
    this.isLoading = false;
    this.elements.loadingSpinner?.setAttribute("data-active", "false");
  }.bind(this);
  
  coderLoading = function(timer = 1500) {
    this.showLoadingSpinner();
    
    setTimeout(() => {
      this.hideLoadingSpinner();
    }, timer);
  }.bind(this);
  
  displayFile = function(filename, fileData, repoName = null, path = '') {
    if (!this.isInitialized) {
      this.init();
      setTimeout(() => this.displayFile(filename, fileData, repoName, path), 100);
      return;
    }
    
    this.currentFile = filename;
    this.fileData = fileData;
    this.originalContent = fileData.content || "";
    
    const lastDotIndex = filename.lastIndexOf('.');
    let name = filename;
    let ext = "";
    
    if (lastDotIndex !== -1) {
      name = filename.substring(0, lastDotIndex);
      ext = filename.substring(lastDotIndex);
    }
    
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.value = name;
    }
    
    if (this.elements.fileExtensionLabel) {
      this.elements.fileExtensionLabel.textContent = ext || ".txt";
    }
    
    const detectedLang = this.detectLanguageFromExtension(filename);
    this.setLanguage(detectedLang);
    
    this.updateBreadcrumbs(repoName, path);
    
    if (!this.codeMirror && !this.fallbackEditor) {
      this.setupCodeMirror();
      setTimeout(() => {
        if (this.codeMirror) {
          this.codeMirror.setValue(this.originalContent);
          this.codeMirror.clearHistory();
          this.codeMirror.refresh();
        } else if (this.fallbackEditor) {
          this.fallbackEditor.value = this.originalContent;
        }
        this.updateStats();
        this.updateLastSaved(true);
      }, 100);
    } else {
      if (this.codeMirror) {
        this.codeMirror.setValue(this.originalContent);
        this.codeMirror.clearHistory();
        this.codeMirror.refresh();
      } else if (this.fallbackEditor) {
        this.fallbackEditor.value = this.originalContent;
      }
      this.updateStats();
      this.updateLastSaved(true);
    }
    
    this.exitEditMode();
    this.updateModifiedBadge();
    this.show();
    this.updateHeaderScrollButtons();
    
    // Save to recent files
    this.saveToRecentFiles(filename, repoName, path);
  }.bind(this);
  
  saveToRecentFiles = function(filename, repoName, path) {
    try {
      const recentFiles = JSON.parse(localStorage.getItem("recent_files") || "[]");
      
      const fileEntry = {
        filename,
        repoName,
        path,
        timestamp: Date.now(),
        language: this.currentLanguage
      };
      
      // Remove if already exists
      const existingIndex = recentFiles.findIndex(f => 
        f.filename === filename && 
        f.repoName === repoName && 
        f.path === path
      );
      
      if (existingIndex !== -1) {
        recentFiles.splice(existingIndex, 1);
      }
      
      // Add to beginning
      recentFiles.unshift(fileEntry);
      
      // Keep only last 10
      if (recentFiles.length > 10) {
        recentFiles.pop();
      }
      
      localStorage.setItem("recent_files", JSON.stringify(recentFiles));
    } catch (e) {
      console.warn("Failed to save to recent files:", e);
    }
  }.bind(this);
  
  updateBreadcrumbs = function(repoName = null, path = '') {
    const breadcrumb = this.elements.pathBreadcrumb;
    if (!breadcrumb) return;
    
    let html = '';
    
    if (repoName) {
      html += `
        <a href="#" class="breadCrumb" data-action="show-repo-selector">Repositories</a>
        <span class="navDivider">/</span>
        <a href="#" class="breadCrumb" data-action="show-explorer">${repoName}</a>
      `;
      
      if (path) {
        const parts = path.split('/').filter(p => p);
        let currentPath = '';
        
        parts.forEach((part, index) => {
          currentPath += (currentPath ? '/' : '') + part;
          const isLast = index === parts.length - 1;
          html += `
            <span class="navDivider">/</span>
            <a href="#" class="breadCrumb ${isLast ? 'current' : ''}" data-path="${currentPath}">${part}</a>
          `;
        });
      }
    }
    
    if (!path || !repoName) {
      html += `<span class="breadCrumb current">${this.currentFile || 'untitled.js'}</span>`;
    }
    
    breadcrumb.innerHTML = html;
    
    breadcrumb.querySelectorAll('[data-action], [data-path]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const action = el.getAttribute('data-action');
        const path = el.getAttribute('data-path');
        
        if (action === 'show-repo-selector') {
          window.showRepoSelector?.();
        } else if (action === 'show-explorer') {
          window.showExplorer?.();
        } else if (path) {
          window.navigateToPath?.(path);
        }
      });
    });
  }.bind(this);
  
  performSave = function(commitMessage) {
    this.coderLoading(1000);
    
    setTimeout(() => {
      try {
        const newContent = this.codeMirror ? this.codeMirror.getValue() : 
                         this.fallbackEditor ? this.fallbackEditor.value : "";
        
        this.fileData.content = newContent;
        this.fileData.lastModified = Date.now();
        this.fileData.lastCommit = commitMessage || "Saved changes";
        this.fileData.size = new Blob([newContent]).size;
        
        const filePath = (window.currentState?.path ? window.currentState.path + "/" : "") + this.currentFile;
        
        if (typeof LocalStorageManager !== "undefined") {
          LocalStorageManager.saveFile(
            window.currentState?.repository, 
            filePath, 
            this.fileData
          );
        }
        
        this.originalContent = newContent;
        this.lastSaveTime = Date.now();
        
        showSuccessMessage?.(`Saved ${this.currentFile}`);
        
        this.updateLastSaved(true);
        this.updateModifiedBadge();
        this.exitEditMode();
        
        // Dispatch custom event
        const event = new CustomEvent('fileSaved', {
          detail: {
            filename: this.currentFile,
            content: newContent,
            commitMessage: commitMessage,
            timestamp: Date.now()
          }
        });
        document.dispatchEvent(event);
        
      } catch (error) {
        console.error("Save failed:", error);
        showErrorMessage?.(`Save failed: ${error.message}`);
      }
    }, 300);
  }.bind(this);
  
  saveChanges = function(withCommit = false) {
    if (!this.currentFile || !this.fileData) {
      showErrorMessage?.("No file to save");
      return;
    }
    
    if (withCommit) {
      const commitMessage = this.elements.commitMessage?.value.trim();
      this.hideCommitPopup();
      this.performSave(commitMessage);
    } else {
      this.performSave("Saved changes");
    }
  }.bind(this);
  
  handleFileUpload = function(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showErrorMessage?.("File size too large (max 10MB)");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      this.coderLoading(1500);
      
      const content = event.target?.result;
      if (this.codeMirror) {
        this.codeMirror.setValue(content);
      } else if (this.fallbackEditor) {
        this.fallbackEditor.value = content;
      }
      
      this.currentFile = file.name;
      
      const lastDotIndex = file.name.lastIndexOf('.');
      let name = file.name;
      let ext = "";
      if (lastDotIndex !== -1) {
        name = file.name.substring(0, lastDotIndex);
        ext = file.name.substring(lastDotIndex);
      }
      
      if (this.elements.fileNameInput) {
        this.elements.fileNameInput.value = name;
      }
      if (this.elements.fileExtensionLabel) {
        this.elements.fileExtensionLabel.textContent = ext || ".txt";
      }
      
      this.setLanguage(this.detectLanguageFromExtension(file.name));
      this.originalContent = content;
      this.updateStats();
      this.updateModifiedBadge();
      
      showSuccessMessage?.(`Uploaded ${file.name}`);
    };
    
    reader.onerror = () => {
      showErrorMessage?.("Failed to read file");
    };
    
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  }.bind(this);
  
  show = function() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => {
      this.codeMirror?.refresh();
      this.updateHeaderScrollButtons();
    }, 50);
  }.bind(this);
  
  hide = function() {
    this.elements.filePage?.classList.add("hide");
  }.bind(this);
  
  enterEditMode = function() {
    if (!this.currentFile && !this.fallbackEditor) {
      this.createNewStandaloneFile();
      return;
    }
    
    this.coderLoading(500);
    
    this.isEditing = true;
    this.elements.editModeBtn?.classList.add("active");
    this.elements.viewModeBtn?.classList.remove("active");
    
    if (this.elements.editSaveLabel) {
      this.elements.editSaveLabel.textContent = "Save";
    }
    
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      this.codeMirror.focus();
    } else if (this.fallbackEditor) {
      this.fallbackEditor.readOnly = false;
      this.fallbackEditor.focus();
    }
    
    // Dispatch event
    const event = new CustomEvent('editModeEntered', {
      detail: { filename: this.currentFile, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }.bind(this);
  
  exitEditMode = function() {
    if (!this.isEditing) return;
    
    this.coderLoading(500);
    
    this.isEditing = false;
    this.elements.editModeBtn?.classList.remove("active");
    this.elements.viewModeBtn?.classList.add("active");
    
    if (this.elements.editSaveLabel) {
      this.elements.editSaveLabel.textContent = "Edit";
    }
    
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
    } else if (this.fallbackEditor) {
      this.fallbackEditor.readOnly = true;
    }
    
    this.hideCommitPopup();
    
    // Auto-save if changes exist
    if (this.hasUnsavedChanges()) {
      this.saveChanges();
    }
    
    // Dispatch event
    const event = new CustomEvent('editModeExited', {
      detail: { filename: this.currentFile, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }.bind(this);
  
  hasUnsavedChanges = function() {
    const currentContent = this.codeMirror ? this.codeMirror.getValue() : 
                         this.fallbackEditor ? this.fallbackEditor.value : "";
    return currentContent !== this.originalContent;
  }.bind(this);
  
  toggleFullscreen = function() {
    if (!this.fullscreenManager) {
      this.fullscreenManager = new FullscreenManager(".editorContainer");
    }
    
    this.fullscreenManager.toggle();
    
    setTimeout(() => {
      this.codeMirror?.refresh();
    }, 100);
  }.bind(this);
  
  copyCode = function() {
    let content = "";
    
    if (this.codeMirror) {
      content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    } else if (this.fallbackEditor) {
      content = this.fallbackEditor.value;
    }
    
    if (!content) return;
    
    navigator.clipboard.writeText(content).then(() => {
      showSuccessMessage?.("Copied to clipboard");
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showSuccessMessage?.("Copied to clipboard");
    });
  }.bind(this);
  
  downloadFile = function() {
    if (!this.currentFile) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : 
                   this.fallbackEditor ? this.fallbackEditor.value : "";
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = this.currentFile;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage?.(`Downloaded ${this.currentFile}`);
  }.bind(this);
  
  formatCode = function() {
    if (!this.isEditing) return;
    
    if (this.codeMirror) {
      const content = this.codeMirror.getValue();
      const lang = this.currentLanguage;
      
      try {
        let formatted = content;
        
        switch (lang) {
          case 'json':
            formatted = JSON.stringify(JSON.parse(content), null, 2);
            break;
          case 'javascript':
          case 'typescript':
            // In a real implementation, you would use a formatter like Prettier
            // This is a basic indentation fix
            formatted = this.autoIndent(content);
            break;
          case 'html':
          case 'xml':
            formatted = this.formatHTML(content);
            break;
          case 'css':
            formatted = this.formatCSS(content);
            break;
        }
        
        if (formatted !== content) {
          this.codeMirror.setValue(formatted);
          showSuccessMessage?.("Code formatted");
        }
      } catch (e) {
        console.warn("Formatting failed:", e);
        showErrorMessage?.("Formatting failed - invalid syntax");
      }
    }
    
    this.hideMoreOptionsDropdown();
  }.bind(this);
  
  autoIndent = function(code) {
    // Basic auto-indent logic
    const lines = code.split('\n');
    let indentLevel = 0;
    const result = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Decrease indent for closing braces/brackets
      if (trimmed.endsWith('}') || trimmed.endsWith(']') || trimmed.endsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      result.push('  '.repeat(indentLevel) + trimmed);
      
      // Increase indent for opening braces/brackets
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
    }
    
    return result.join('\n');
  }.bind(this);
  
  formatHTML = function(html) {
    // Basic HTML formatting
    let formatted = '';
    let indent = 0;
    const lines = html.split(/>\s*</);
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (i === 0) line = line.trim();
      if (i === lines.length - 1) line = line.trim();
      
      if (line.match(/^\/\w/)) indent--;
      formatted += '  '.repeat(Math.max(0, indent)) + '<' + line + '>\n';
      if (line.match(/^<?\w[^>]*[^\/]$/) && !line.startsWith('!--')) indent++;
    }
    
    return formatted;
  }.bind(this);
  
  formatCSS = function(css) {
    // Basic CSS formatting
    return css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/}\s*/g, '\n}\n\n')
      .replace(/\s+/g, ' ')
      .trim();
  }.bind(this);
  
  foldAll = function() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode(CodeMirror.Pos(i, 0), null, "fold");
      }
    });
    
    this.hideMoreOptionsDropdown();
  }.bind(this);
  
  unfoldAll = function() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode(CodeMirror.Pos(i, 0), null, "unfold");
      }
    });
    
    this.hideMoreOptionsDropdown();
  }.bind(this);
  
  undo = function() {
    if (this.codeMirror) {
      this.codeMirror.undo();
    } else if (this.fallbackEditor) {
      document.execCommand('undo');
    }
  }.bind(this);
  
  redo = function() {
    if (this.codeMirror) {
      this.codeMirror.redo();
    } else if (this.fallbackEditor) {
      document.execCommand('redo');
    }
  }.bind(this);
  
  openSearch = function() {
    if (!this.codeMirror && !this.fallbackEditor) return;
    
    this.searchActive = true;
    this.elements.searchPanel?.classList.remove("hide");
    
    setTimeout(() => {
      this.elements.searchInput?.focus();
      this.elements.searchInput?.select();
    }, 50);
  }.bind(this);
  
  openReplace = function() {
    this.openSearch();
    // Show replace inputs if available
    const replaceInput = this.elements.replaceInput;
    if (replaceInput) {
      replaceInput.style.display = 'block';
      replaceInput.focus();
    }
  }.bind(this);
  
  closeSearch = function() {
    this.searchActive = false;
    this.elements.searchPanel?.classList.add("hide");
    this.clearSearch();
    
    // Hide replace inputs
    const replaceInput = this.elements.replaceInput;
    if (replaceInput) {
      replaceInput.style.display = 'none';
    }
  }.bind(this);
  
  clearSearch = function() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = "";
    }
    if (this.elements.replaceInput) {
      this.elements.replaceInput.value = "";
    }
    this.searchMatches = [];
    this.clearMarks();
  }.bind(this);
  
  clearMarks = function() {
    if (!this.codeMirror) return;
    this.marks.forEach(mark => mark.clear());
    this.marks = [];
  }.bind(this);
  
  performSearch = function(query) {
    if (!this.codeMirror) return;
    
    this.clearMarks();
    this.searchMatches = [];
    
    if (!query) {
      if (this.elements.searchMatches) {
        this.elements.searchMatches.textContent = "0/0";
      }
      return;
    }
    
    const cursor = this.codeMirror.getSearchCursor(query, null, {caseFold: false});
    let count = 0;
    
    while (cursor.findNext()) {
      const from = cursor.from();
      const to = cursor.to();
      
      this.searchMatches.push({
        from: from,
        to: to,
        line: from.line,
        ch: from.ch
      });
      
      this.marks.push(this.codeMirror.markText(from, to, {
        className: "search-highlight"
      }));
      
      count++;
    }
    
    if (count > 0) {
      this.currentSearchIndex = 0;
      this.highlightMatch(0);
      
      if (this.elements.searchMatches) {
        this.elements.searchMatches.textContent = `1/${count}`;
      }
    } else {
      if (this.elements.searchMatches) {
        this.elements.searchMatches.textContent = `0/0`;
      }
    }
  }.bind(this);
  
  findPrevious = function() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchMatches.length) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
    
    if (this.elements.searchMatches) {
      this.elements.searchMatches.textContent = `${this.currentSearchIndex + 1}/${this.searchMatches.length}`;
    }
  }.bind(this);
  
  findNext = function() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
    
    if (this.elements.searchMatches) {
      this.elements.searchMatches.textContent = `${this.currentSearchIndex + 1}/${this.searchMatches.length}`;
    }
  }.bind(this);
  
  highlightMatch = function(index) {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    
    const match = this.searchMatches[index];
    
    this.codeMirror.setSelection(match.from, match.to);
    this.codeMirror.scrollIntoView({
      line: match.line,
      ch: match.ch
    }, 200);
  }.bind(this);
  
  setCodeMirrorFontSize = function(size) {
    if (!this.codeMirror) return;
    
    size = Math.max(8, Math.min(32, size));
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.state.fontSize = size;
    
    if (this.elements.fontSizeLabel) {
      this.elements.fontSizeLabel.textContent = `${size}px`;
    }
    
    localStorage.setItem("editor_fontsize", size);
    this.codeMirror.refresh();
  }.bind(this);
  
  adjustFontSize = function(change) {
    const newSize = Math.max(8, Math.min(32, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) {
      this.setCodeMirrorFontSize(newSize);
    }
  }.bind(this);
  
  updateThemeIcon = function(isDark) {
    if (!this.elements.themeIcon) return;
    
    this.elements.themeIcon.innerHTML = isDark ? AppAssets.icons.moon() : AppAssets.icons.sun();
  }.bind(this);
  
  toggleTheme = function() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("editor_theme", newTheme);
    this.updateThemeIcon(!isDark);
    
    if (this.codeMirror) {
      this.codeMirror.setOption("theme", isDark ? "default" : "one-dark");
    }
  }.bind(this);
  
  toggleWrapLines = function() {
    if (!this.codeMirror) return;
    
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
    localStorage.setItem("editor_wrapLines", this.state.wrapLines);
  }.bind(this);
  
  toggleInvisibles = function() {
    this.state.showInvisibles = !this.state.showInvisibles;
    if (this.codeMirror) {
      this.codeMirror.setOption("showInvisibles", this.state.showInvisibles);
    }
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
  }.bind(this);
  
  updateStats = function() {
    let content = "";
    
    if (this.codeMirror) {
      content = this.codeMirror.getValue();
    } else if (this.fallbackEditor) {
      content = this.fallbackEditor.value;
    }
    
    const lines = content.split("\n").length;
    const characters = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const bytes = new Blob([content]).size;
    
    let sizeStr = bytes < 1024 ? `${bytes} B` : 
                 bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : 
                 `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    
    if (this.elements.lineCount) {
      this.elements.lineCount.textContent = lines.toLocaleString();
    }
    
    if (this.elements.charCount) {
      this.elements.charCount.textContent = characters.toLocaleString();
    }
    
    if (this.elements.fileSize) {
      this.elements.fileSize.textContent = sizeStr;
    }
    
    // Update word count if element exists
    const wordCountElement = document.getElementById('wordCount');
    if (wordCountElement) {
      wordCountElement.textContent = words.toLocaleString();
    }
  }.bind(this);
  
  updateCursorPosition = function() {
    if (!this.codeMirror) return;
    
    const cursor = this.codeMirror.getCursor();
    
    if (this.elements.cursorLine) {
      this.elements.cursorLine.textContent = (cursor.line + 1).toLocaleString();
    }
    
    if (this.elements.cursorCol) {
      this.elements.cursorCol.textContent = (cursor.ch + 1).toLocaleString();
    }
  }.bind(this);
  
  updateSelectionInfo = function() {
    if (!this.codeMirror) return;
    
    const selections = this.codeMirror.listSelections();
    if (selections.length > 1) {
      // Multiple selections
      const selectionCountElement = document.getElementById('selectionCount');
      if (selectionCountElement) {
        selectionCountElement.textContent = `${selections.length} selections`;
        selectionCountElement.style.display = 'inline';
      }
    } else {
      const selectionCountElement = document.getElementById('selectionCount');
      if (selectionCountElement) {
        selectionCountElement.style.display = 'none';
      }
    }
  }.bind(this);
  
  updateScrollPosition = function() {
    if (!this.codeMirror) return;
    
    const scrollInfo = this.codeMirror.getScrollInfo();
    const scrollPercent = (scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight)) * 100;
    
    const scrollPositionElement = document.getElementById('scrollPosition');
    if (scrollPositionElement) {
      scrollPositionElement.textContent = `${Math.round(scrollPercent)}%`;
    }
  }.bind(this);
  
  updateModifiedBadge = function() {
    if (!this.codeMirror && !this.fallbackEditor) return;
    
    const currentContent = this.codeMirror ? this.codeMirror.getValue() : 
                         this.fallbackEditor ? this.fallbackEditor.value : "";
    const isModified = currentContent !== this.originalContent;
    this.elements.modifiedIndicator?.classList.toggle("hide", !isModified);
    
    // Update document title
    if (this.currentFile) {
      document.title = `${this.currentFile}${isModified ? ' *' : ''} - Code Editor`;
    }
  }.bind(this);
  
  updateLastSaved = function(saved) {
    if (!this.elements.lastSaved) return;
    
    if (saved) {
      const now = new Date();
      this.elements.lastSaved.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      this.elements.lastSaved.title = now.toLocaleString();
    } else {
      this.elements.lastSaved.textContent = "Never";
      this.elements.lastSaved.title = "Not saved yet";
    }
  }.bind(this);
  
  scrollHeader = function(direction) {
    const container = this.elements.headerScrollContainer;
    if (!container) return;
    
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    // Update buttons after scrolling
    setTimeout(() => this.updateHeaderScrollButtons(), 300);
  }.bind(this);
  
  updateHeaderScrollButtons = function() {
    const container = this.elements.headerScrollContainer;
    const leftBtn = this.elements.headerScrollLeft;
    const rightBtn = this.elements.headerScrollRight;
    
    if (!container || !leftBtn || !rightBtn) return;
    
    // Check if scrolling is needed
    const needsScroll = container.scrollWidth > container.clientWidth;
    leftBtn.style.display = needsScroll ? 'flex' : 'none';
    rightBtn.style.display = needsScroll ? 'flex' : 'none';
    
    if (container.scrollLeft <= 5) {
      leftBtn.classList.add('disabled');
    } else {
      leftBtn.classList.remove('disabled');
    }
    
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
      rightBtn.classList.add('disabled');
    } else {
      rightBtn.classList.remove('disabled');
    }
  }.bind(this);
  
  bindEvent = function(element, event, handler) {
    if (!element) return;
    
    const key = `${event}-${Math.random().toString(36).substr(2, 9)}`;
    element.addEventListener(event, handler);
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, new Map());
    }
    this.eventListeners.get(element).set(key, { event, handler });
  }.bind(this);
  
  unbindEvent = function(element, event, handler) {
    if (!element) return;
    
    element.removeEventListener(event, handler);
    
    if (this.eventListeners.has(element)) {
      const elementListeners = this.eventListeners.get(element);
      for (const [key, listener] of elementListeners) {
        if (listener.event === event && listener.handler === handler) {
          elementListeners.delete(key);
          break;
        }
      }
    }
  }.bind(this);
  
  debounce = function(id, func, delay) {
    if (this.debounceTimers[id]) {
      clearTimeout(this.debounceTimers[id]);
    }
    this.debounceTimers[id] = setTimeout(func, delay);
  }.bind(this);
  
  restoreSession = function() {
    try {
      const session = localStorage.getItem("editor_session");
      if (session) {
        const { filename, content, language, cursor } = JSON.parse(session);
        if (filename && content) {
          this.currentFile = filename;
          this.fileData = { content };
          this.originalContent = content;
          
          if (this.codeMirror) {
            this.codeMirror.setValue(content);
            if (cursor) {
              this.codeMirror.setCursor(cursor);
            }
          }
          
          if (language) {
            this.setLanguage(language);
          }
          
          this.updateStats();
          this.updateModifiedBadge();
          this.show();
        }
      }
    } catch (e) {
      console.warn("Failed to restore session:", e);
    }
  }.bind(this);
  
  saveSession = function() {
    const content = this.codeMirror ? this.codeMirror.getValue() : 
                   this.fallbackEditor ? this.fallbackEditor.value : "";
    const cursor = this.codeMirror ? this.codeMirror.getCursor() : null;
    
    const session = {
      filename: this.currentFile,
      content: content,
      language: this.currentLanguage,
      cursor: cursor,
      timestamp: Date.now()
    };
    
    localStorage.setItem("editor_session", JSON.stringify(session));
  }.bind(this);
  
  destroy = function() {
    // Clear timers
    if (this.state.autoSaveInterval) {
      clearInterval(this.state.autoSaveInterval);
    }
    
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    for (const timerId in this.debounceTimers) {
      clearTimeout(this.debounceTimers[timerId]);
    }
    
    // Save session
    this.saveSession();
    
    // Clean up CodeMirror
    if (this.codeMirror) {
      try {
        this.codeMirror.toTextArea();
      } catch (e) {
        console.warn("Error cleaning up CodeMirror:", e);
      }
    }
    
    // Clean up fullscreen manager
    if (this.fullscreenManager) {
      this.fullscreenManager.cleanup();
    }
    
    // Remove event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.eventListeners.clear();
    
    // Remove injected elements
    this.elements.commitDropdown?.remove();
    this.elements.newFileDropdown?.remove();
    this.elements.languageDropdown?.remove();
    this.elements.moreOptionsDropdown?.remove();
    
    this.isInitialized = false;
  }.bind(this);
}

window.CodeViewEditor = CodeViewEditor;
window.coderViewEdit = new CodeViewEditor();

// Enhanced initialization with error handling
document.addEventListener("DOMContentLoaded", () => {
  try {
    if (document.querySelector('.pages[data-page="file"]')) {
      // Initialize with a small delay to ensure DOM is ready
      setTimeout(() => {
        if (!window.coderViewEdit.isInitialized) {
          window.coderViewEdit.init();
        }
      }, 100);
    }
  } catch (error) {
    console.error("Failed to initialize CodeViewEditor:", error);
  }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
  if (window.coderViewEdit?.hasUnsavedChanges()) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    return e.returnValue;
  }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CodeViewEditor, FullscreenManager };
}