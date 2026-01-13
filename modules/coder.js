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
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      this.fallbackFullscreen(true);
    }
  }.bind(this);
  
  exit = function() {
    this.container?.setAttribute('data-fullscreen', 'false');
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
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
    } else {
      document.body.style.overflow = "";
      this.container?.classList.remove("fullscreen");
    }
    
    const event = new CustomEvent('fullscreenchange', { 
      detail: { isFullscreen: enter } 
    });
    this.container?.dispatchEvent(event);
  }.bind(this);
  
  initializeListeners = function() {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
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
      });
    });
  }.bind(this);
  
  get isActive() {
    return this.isFullscreen;
  }
}

class StickyHeaderManager {
  constructor() {
    this.navbarHeight = 60;
    this.stickyHeader = document.getElementById('stickyHeader');
    this.breadcrumbs = document.getElementById('pathBreadcrumb');
    this.toolbar = document.getElementById('coderToolBarWrapper');
    this.lastScrollTop = 0;
    this.scrollThreshold = 100;
    this.isSticky = false;
    
    if (this.stickyHeader && this.breadcrumbs) {
      this.init();
    }
  }
  
  init() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      this.navbarHeight = navbar.offsetHeight;
    }
    
    this.updatePositions();
    
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.updatePositions());
  }
  
  updatePositions() {
    if (!this.stickyHeader || !this.toolbar) return;
    
    const headerRect = this.stickyHeader.getBoundingClientRect();
    const toolbarRect = this.toolbar.getBoundingClientRect();
    
    this.toolbar.style.top = `${headerRect.height}px`;
    
    document.documentElement.style.setProperty('--navbar-height', `${this.navbarHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerRect.height}px`);
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarRect.height}px`);
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = scrollTop - this.lastScrollTop;
    
    const breadcrumbs = document.getElementById('breadCrumbsContainer');
    const header = document.getElementById('stickyHeader');
    const toolbar = document.getElementById('coderToolBarWrapper');
    
    if (!breadcrumbs || !header || !toolbar) return;
    
    const breadcrumbsBottom = breadcrumbs.offsetTop + breadcrumbs.offsetHeight;
    
    if (scrollTop > breadcrumbsBottom - this.navbarHeight) {
      breadcrumbs.classList.add('hidden');
      document.body.classList.add('header-is-sticky');
      
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.zIndex = '100';
      
      toolbar.style.position = 'fixed';
      toolbar.style.top = `${header.offsetHeight}px`;
      toolbar.style.left = '0';
      toolbar.style.right = '0';
      toolbar.style.zIndex = '99';
      
      this.isSticky = true;
    } else {
      breadcrumbs.classList.remove('hidden');
      document.body.classList.remove('header-is-sticky');
      
      header.style.position = 'relative';
      toolbar.style.position = 'relative';
      toolbar.style.top = '0';
      
      this.isSticky = false;
    }
    
    if (Math.abs(scrollDelta) > 5) {
      if (scrollDelta > 0 && scrollTop > this.scrollThreshold) {
        if (this.isSticky) {
          header.style.transform = 'translateY(-100%)';
          toolbar.style.transform = 'translateY(-100%)';
        }
      } else {
        header.style.transform = 'translateY(0)';
        toolbar.style.transform = 'translateY(0)';
      }
    }
    
    this.lastScrollTop = scrollTop;
  }
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript", ext: ["js", "jsx"] },
  { value: "typescript", label: "TypeScript", ext: ["ts", "tsx"] },
  { value: "python", label: "Python", ext: ["py"] },
  { value: "html", label: "HTML", ext: ["html", "htm"] },
  { value: "css", label: "CSS", ext: ["css", "scss", "less"] },
  { value: "json", label: "JSON", ext: ["json"] },
  { value: "markdown", label: "Markdown", ext: ["md", "markdown"] },
  { value: "yaml", label: "YAML", ext: ["yml", "yaml"] },
  { value: "xml", label: "XML", ext: ["xml"] },
  { value: "sql", label: "SQL", ext: ["sql"] },
  { value: "shell", label: "Shell", ext: ["sh", "bash"] },
  { value: "ruby", label: "Ruby", ext: ["rb"] },
  { value: "go", label: "Go", ext: ["go"] },
  { value: "rust", label: "Rust", ext: ["rs"] },
  { value: "java", label: "Java", ext: ["java"] },
  { value: "cpp", label: "C++", ext: ["cpp", "c", "h"] },
  { value: "csharp", label: "C#", ext: ["cs"] },
  { value: "php", label: "PHP", ext: ["php"] },
  { value: "swift", label: "Swift", ext: ["swift"] },
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
    
    this.originalContent = "";
    this.languages = SUPPORTED_LANGUAGES;
    this.currentLanguage = "javascript";
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.elements = {};
    this.fullscreenManager = null;
    this.stickyHeaderManager = null;
    
    this.state = {
      fontSize: 10,
      wrapLines: false,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
    };
    
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
    this.lastSaveTime = null;
    
    this.boundEventHandlers = {};
    
    this.setupGlobalEventListeners();
    this.headerIntersectionObserver = null;
  }
  
  init = function() {
    if (this.isInitialized) return;
    
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) return;
    
    filePage.innerHTML = AppAssets.templates.editor();
    this.injectPopover();
    this.injectNewFileDropdown();
    this.cacheElements();
    this.bindElementEvents();
    this.setupNewFileButton();
    
    this.fullscreenManager = new FullscreenManager(".editorContainer");
    this.stickyHeaderManager = new StickyHeaderManager();
    
    if (typeof CodeMirror !== "undefined") {
      this.setupCodeMirror();
    } else {
      setTimeout(() => this.setupCodeMirror(), 100);
    }
    
    this.loadUserPreferences();
    this.setupAutoSave();
    this.isInitialized = true;
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
    this.bindEvent(this.elements.formatBtn, "click", () => this.formatCode());
    this.bindEvent(this.elements.foldAllBtn, "click", () => this.foldAll());
    this.bindEvent(this.elements.unfoldAllBtn, "click", () => this.unfoldAll());
    this.bindEvent(this.elements.searchBtn, "click", () => this.openSearch());
    this.bindEvent(this.elements.wrapBtn, "click", () => this.toggleWrapLines());
    this.bindEvent(this.elements.copyBtn, "click", () => this.copyCode());
    this.bindEvent(this.elements.downloadBtn, "click", () => this.downloadFile());
    this.bindEvent(this.elements.uploadBtn, "click", () => this.elements.fileUploadInput?.click());
    this.bindEvent(this.elements.themeBtn, "click", () => this.toggleTheme());
    this.bindEvent(this.elements.showInvisiblesBtn, "click", () => this.toggleInvisibles());
    this.bindEvent(this.elements.fontDecreaseBtn, "click", () => this.adjustFontSize(-2));
    this.bindEvent(this.elements.fontIncreaseBtn, "click", () => this.adjustFontSize(2));
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
      this.elements.languageDropdown?.classList.toggle("hide");
      
      if (!this.elements.languageDropdown.classList.contains("hide")) {
         const rect = this.elements.fileExtensionBtn.getBoundingClientRect();
         this.elements.languageDropdown.style.top = `${rect.bottom + 5}px`;
         this.elements.languageDropdown.style.left = `${rect.left}px`;
      }
    });
    
    this.bindEvent(this.elements.moreOptionsBtn, "click", (e) => {
      e.stopPropagation();
      const dropdown = this.elements.moreOptionsDropdown;
      if (!dropdown) return;
      
      if (dropdown.classList.contains("hide")) {
        const btnRect = e.currentTarget.getBoundingClientRect();
        dropdown.style.top = `${btnRect.bottom + window.scrollY}px`;
        dropdown.style.left = `${btnRect.left + window.scrollX}px`;
      }
      dropdown.classList.toggle("hide");
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
    
    this.bindEvent(this.elements.searchInput, "input", () => this.performSearch(this.elements.searchInput.value));
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
    
    document.addEventListener("click", (e) => {
      const newFileButton = document.querySelector('[data-action="new-file"], #newFileButton');
      const dropdown = this.elements.newFileDropdown;
      
      if (dropdown && !dropdown.contains(e.target) && newFileButton && !newFileButton.contains(e.target)) {
        dropdown.classList.add("hide");
      }
      
      if (this.elements.commitDropdown && !this.elements.commitDropdown.contains(e.target) && !this.elements.editSaveButton.contains(e.target)) {
        this.hideCommitPopup();
      }
      this.elements.languageDropdown?.classList.add("hide");
      this.elements.moreOptionsDropdown?.classList.add("hide");
    });
    
    window.addEventListener("resize", () => {
      if (this.elements.commitDropdown && !this.elements.commitDropdown.classList.contains("hide")) {
        this.calculateDropdownPosition();
      }
      this.updateHeaderScrollButtons();
    });
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
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      let button;
      
      if (e && e.currentTarget) {
        button = e.currentTarget;
      } else {
        button = document.querySelector('[data-action="new-file"], #newFileButton');
      }
      
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;
        
        if (left + dropdownRect.width > window.innerWidth) {
          left = window.innerWidth - dropdownRect.width - 10;
        }
        
        if (top + dropdownRect.height > window.innerHeight) {
          top = rect.top + window.scrollY - dropdownRect.height - 5;
        }
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
        dropdown.style.zIndex = '9999';
      }
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
    this.currentFile = 'untitled.js';
    this.fileData = {
      content: '// New file\n// Created on ' + new Date().toLocaleDateString() + '\n\n',
      category: 'General',
      tags: [],
      lastModified: Date.now(),
      lastCommit: 'Initial commit',
      size: 0
    };
    this.originalContent = this.fileData.content;
    
    if (this.elements.fileNameInput) {
      this.elements.fileNameInput.value = 'untitled';
    }
    if (this.elements.fileExtensionLabel) {
      this.elements.fileExtensionLabel.textContent = '.js';
    }
    
    if (this.codeMirror) {
      this.codeMirror.setValue(this.fileData.content);
      this.codeMirror.refresh();
    } else {
      this.setupCodeMirror();
    }
    
    this.setLanguage('javascript');
    this.updateStats();
    this.updateModifiedBadge();
    this.enterEditMode();
    this.show();
  }.bind(this);
  
  hideNewFileDropdown = function() {
    if (this.elements.newFileDropdown) {
      this.elements.newFileDropdown.classList.add('hide');
    }
  }.bind(this);
  
  setupCodeMirror = function() {
    if (!this.fullscreenManager) {
      this.fullscreenManager = new FullscreenManager(".editorContainer");
    }
    
    if (typeof CodeMirror === "undefined") {
      setTimeout(() => this.setupCodeMirror(), 100);
      return;
    }
    
    if (!this.elements.codeMirrorContainer || this.codeMirror) return;
    
    const fontSize = parseInt(localStorage.getItem("editor_fontsize")) || 14;
    const savedTheme = localStorage.getItem("editor_theme");
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
      highlightSelectionMatches: { showToken: /\w/ },
      extraKeys: {
        "Ctrl-S": () => { if (this.isEditing) this.showCommitPopup(); },
        "Cmd-S": () => { if (this.isEditing) this.showCommitPopup(); },
        "Ctrl-F": () => this.openSearch(),
        "Ctrl-/": "toggleComment",
        Tab: "indentMore",
        "Shift-Tab": "indentLess",
      },
    });
    
    if (this.elements.fontSizeLabel) {
      this.elements.fontSizeLabel.textContent = `${fontSize}px`;
    }
    
    this.updateThemeIcon(isDark);
    this.setCodeMirrorFontSize(fontSize);
    
    this.codeMirror.on("change", () => {
      this.updateStats();
      this.updateModifiedBadge();
    });
    
    this.codeMirror.on("cursorActivity", () => this.updateCursorPosition());
  }.bind(this);
  
  setCodeMirrorMode = function(langValue) {
    if (!this.codeMirror) return;
    this.codeMirror.setOption("mode", CODEMIRROR_MODES[langValue] || "text");
  }.bind(this);
  
  setupGlobalEventListeners = function() {
    document.addEventListener("keydown", (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        this.showCommitPopup();
      }
      
      if (e.key === "Escape") {
        if (this.searchActive) this.closeSearch();
        else if (this.fullscreenManager.isActive) this.toggleFullscreen();
        else this.hideCommitPopup();
      }
      
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
    });
  }.bind(this);
  
  setupAutoSave = function() {
    if (this.state.autoSave) {
      this.state.autoSaveInterval = setInterval(() => {
        if (this.isEditing && this.codeMirror && this.codeMirror.getValue() !== this.originalContent) {
          this.autoSave();
        }
      }, 30000);
    }
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
    
    this.elements.languageDropdown?.classList.add("hide");
    this.setCodeMirrorMode(langValue);
  }.bind(this);
  
  loadUserPreferences = function() {
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
    }
  }.bind(this);
  
  detectLanguageFromExtension = function(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    
    return "javascript";
  }.bind(this);
  
  showCommitPopup = function(e) {
    if (!this.elements.commitDropdown) return;
    
    this.elements.commitDropdown.classList.remove("hide");
    this.calculateDropdownPosition();
    
    if (this.elements.popoverTitle) {
      this.elements.popoverTitle.textContent = "Add Commit & Save";
    }
    
    if (this.elements.popoverSubtitle) {
      this.elements.popoverSubtitle.textContent = "Enter a commit message before saving";
    }
    
    if (this.elements.commitMessage) {
      this.elements.commitMessage.value = `Update ${this.currentFile}`;
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
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.commitDropdown());
    this.elements.commitDropdown = document.getElementById("commitDropdown");
  }.bind(this);
  
  populateLanguageDropdown = function() {
    if (!this.elements.languageList) return;
    
    this.elements.languageList.innerHTML = "";
    this.languages.forEach((lang) => {
      const btn = document.createElement("button");
      btn.className = "dropdownItem";
      btn.textContent = lang.label;
      btn.dataset.value = lang.value;
      btn.addEventListener("click", () => this.setLanguage(lang.value));
      this.elements.languageList.appendChild(btn);
    });
  }.bind(this);
  
  calculateDropdownPosition = function() {
    if (!this.elements.editSaveButton || !this.elements.commitDropdown) return;
    
    const buttonRect = this.elements.editSaveButton.getBoundingClientRect();
    const dropdown = this.elements.commitDropdown;
    const top = buttonRect.bottom + window.scrollY + 8;
    let left = buttonRect.right - dropdown.offsetWidth + window.scrollX;
    
    if (left < 10) left = 10;
    
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }.bind(this);
  
  showLoadingSpinner = function() {
    this.elements.loadingSpinner?.setAttribute("data-active", "true");
  }.bind(this);
  
  hideLoadingSpinner = function() {
    this.elements.loadingSpinner?.setAttribute("data-active", "false");
  }.bind(this);
  
  coderLoading = function(timer = 1500) {
    this.showLoadingSpinner();
  
    setTimeout(() => {
      this.hideLoadingSpinner();
   }, timer);
  }.bind(this);
  
  displayFile = function(filename, fileData, repoName = null, path = '') {
    if (!this.isInitialized) this.init();
    
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
    
    if (!this.codeMirror) {
      this.setupCodeMirror();
      setTimeout(() => {
        if (this.codeMirror) {
          this.codeMirror.setValue(this.originalContent);
          this.codeMirror.refresh();
          this.updateStats();
          this.updateLastSaved(true);
        }
      }, 100);
    } else {
      this.codeMirror.setValue(this.originalContent);
      this.codeMirror.refresh();
      this.updateStats();
      this.updateLastSaved(true);
    }
    
    this.exitEditMode();
    this.updateModifiedBadge();
    this.show();
    this.updateHeaderScrollButtons();
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
          html += `
            <span class="navDivider">/</span>
            <a href="#" class="breadCrumb" data-path="${currentPath}">${part}</a>
          `;
        });
      }
      
      html += `<span class="navDivider">/</span>`;
    }
    
    html += `<span class="breadCrumb current">${this.currentFile || 'untitled.js'}</span>`;
    
    breadcrumb.innerHTML = html;
    
    breadcrumb.querySelectorAll('[data-action], [data-path]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const action = el.getAttribute('data-action');
        const path = el.getAttribute('data-path');
        
        if (action === 'show-repo-selector') {
          if (typeof window.showRepoSelector === 'function') window.showRepoSelector();
        } else if (action === 'show-explorer') {
          if (typeof window.showExplorer === 'function') window.showExplorer();
        } else if (path) {
          if (typeof window.navigateToPath === 'function') window.navigateToPath(path);
        }
      });
    });
  }.bind(this);
  
  performSave = function(commitMessage) {
    this.coderLoading(1500);
    
    setTimeout(() => {
      try {
        const newContent = this.codeMirror ? this.codeMirror.getValue() : "";
        this.fileData.content = newContent;
        this.fileData.lastModified = Date.now();
        this.fileData.lastCommit = commitMessage;
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
        
        if (typeof showSuccessMessage === "function") {
          showSuccessMessage(`Saved ${this.currentFile}`);
        }
        
        this.updateLastSaved(true);
        this.updateModifiedBadge();
        this.exitEditMode();
      } catch (error) {
        if (typeof showErrorMessage === "function") {
          showErrorMessage(`Save failed: ${error.message}`);
        }
      }
    }, 300);
  }.bind(this);
  
  saveChanges = function(withCommit = false) {
    if (!this.currentFile || !this.fileData) return;
    
    this.coderLoading(1500);
    
    if (withCommit) {
      const commitMessage = this.elements.commitMessage?.value.trim();
      if (!commitMessage) {
        if (typeof showErrorMessage === "function") {
          showErrorMessage("Please enter a commit message");
        }
        return;
      }
      this.hideCommitPopup();
      this.performSave(commitMessage);
    } else {
      this.performSave("Saved changes");
    }
  }.bind(this);
  
  handleFileUpload = function(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      this.coderLoading(3500);
      
      const content = event.target?.result;
      if (this.codeMirror) {
        this.codeMirror.setValue(content);
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
      }
    };
    reader.readAsText(file);
  }.bind(this);
  
  show = function() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => this.codeMirror?.refresh(), 50);
  }.bind(this);
  
  hide = function() {
    this.elements.filePage?.classList.add("hide");
  }.bind(this);
  
  enterEditMode = function() {
    if (!this.currentFile) return;
    
    this.coderLoading(1500);
    
    this.isEditing = true;
    this.elements.editModeBtn?.classList.add("active");
    this.elements.viewModeBtn?.classList.remove("active");
    
    if (this.elements.editSaveLabel) {
      this.elements.editSaveLabel.textContent = "Save";
    }
    
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      this.codeMirror.focus();
    }
  }.bind(this);
  
  exitEditMode = function() {
    this.coderLoading(1500);
    
    this.isEditing = false;
    this.elements.editModeBtn?.classList.remove("active");
    this.elements.viewModeBtn?.classList.add("active");
    
    if (this.elements.editSaveLabel) {
      this.elements.editSaveLabel.textContent = "Edit";
    }
    
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
    }
    
    this.hideCommitPopup();
  }.bind(this);
  
  toggleFullscreen = function() {
    this.fullscreenManager.toggle();
    
    setTimeout(() => {
      if (this.codeMirror && typeof this.codeMirror.refresh === 'function') {
        this.codeMirror.refresh();
      }
    }, 100);
  }.bind(this);
  
  copyCode = function() {
    if (!this.codeMirror) return;
    
    const content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    navigator.clipboard.writeText(content).then(() => {
      if (typeof showSuccessMessage === "function") {
        showSuccessMessage("Copied to clipboard");
      }
    });
  }.bind(this);
  
  downloadFile = function() {
    if (!this.currentFile) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : "";
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = this.currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }.bind(this);
  
  formatCode = function() {
    if (!this.codeMirror || !this.isEditing) return;
    
    const content = this.codeMirror.getValue();
    try {
      const formatted = JSON.stringify(JSON.parse(content), null, 2);
      this.codeMirror.setValue(formatted);
    } catch (e) {
    }
  }.bind(this);
  
  foldAll = function() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({
          line: i,
          ch: 0
        }, null, "fold");
      }
    });
  }.bind(this);
  
  unfoldAll = function() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({
          line: i,
          ch: 0
        }, null, "unfold");
      }
    });
  }.bind(this);
  
  undo = function() {
    this.codeMirror?.undo();
  }.bind(this);
  
  redo = function() {
    this.codeMirror?.redo();
  }.bind(this);
  
  openSearch = function() {
    if (!this.codeMirror) return;
    
    this.searchActive = true;
    this.elements.searchPanel?.classList.remove("hide");
    
    setTimeout(() => {
      this.elements.searchInput?.focus();
      this.elements.searchInput?.select();
    }, 50);
  }.bind(this);
  
  closeSearch = function() {
    this.searchActive = false;
    this.elements.searchPanel?.classList.add("hide");
    this.clearSearch();
  }.bind(this);
  
  clearSearch = function() {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = "";
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
    if (!this.codeMirror || !query) return;
    
    this.clearMarks();
    this.searchMatches = [];
    
    const cursor = this.codeMirror.getSearchCursor(query);
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
    }
    
    if (this.searchMatches.length > 0) {
      this.currentSearchIndex = 0;
      this.highlightMatch(0);
      
      if (this.elements.searchMatches) {
         this.elements.searchMatches.textContent = `1/${this.searchMatches.length}`;
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
    
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.state.fontSize = size;
    
    if (this.elements.fontSizeLabel) {
      this.elements.fontSizeLabel.textContent = `${size}px`;
    }
    
    localStorage.setItem("editor_fontsize", size);
    this.codeMirror.refresh();
  }.bind(this);
  
  adjustFontSize = function(change) {
    const newSize = Math.max(10, Math.min(24, this.state.fontSize + change));
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
    this.updateThemeIcon(!isDark);
    this.codeMirror?.setOption("theme", isDark ? "default" : "one-dark");
  }.bind(this);
  
  toggleWrapLines = function() {
    if (!this.codeMirror) return;
    
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
  }.bind(this);
  
  toggleInvisibles = function() {
    this.state.showInvisibles = !this.state.showInvisibles;
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
  }.bind(this);
  
  updateStats = function() {
    if (!this.codeMirror) return;
    
    const content = this.codeMirror.getValue();
    const lines = content.split("\n").length;
    const bytes = new Blob([content]).size;
    
    let sizeStr = bytes < 1024 ? `${bytes} B` : 
                 bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : 
                 `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    
    if (this.elements.lineCount) {
      this.elements.lineCount.textContent = lines;
    }
    
    if (this.elements.charCount) {
      this.elements.charCount.textContent = content.length.toLocaleString();
    }
    
    if (this.elements.fileSize) {
      this.elements.fileSize.textContent = sizeStr;
    }
  }.bind(this);
  
  updateCursorPosition = function() {
    if (!this.codeMirror) return;
    
    const cursor = this.codeMirror.getCursor();
    
    if (this.elements.cursorLine) {
      this.elements.cursorLine.textContent = cursor.line + 1;
    }
    
    if (this.elements.cursorCol) {
      this.elements.cursorCol.textContent = cursor.ch + 1;
    }
  }.bind(this);
  
  updateModifiedBadge = function() {
    if (!this.codeMirror) return;
    
    const isModified = this.codeMirror.getValue() !== this.originalContent;
    this.elements.modifiedIndicator?.classList.toggle("hide", !isModified);
  }.bind(this);
  
  updateLastSaved = function(saved) {
    if (!this.elements.lastSaved) return;
    
    if (saved) {
      const now = new Date();
      this.elements.lastSaved.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else {
      this.elements.lastSaved.textContent = "Never";
    }
  }.bind(this);
  
  scrollHeader = function(direction) {
    const container = this.elements.headerScrollContainer;
    if (!container) return;
    
    const scrollAmount = 150;
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }.bind(this);
  
  updateHeaderScrollButtons = function() {
    const container = this.elements.headerScrollContainer;
    const leftBtn = this.elements.headerScrollLeft;
    const rightBtn = this.elements.headerScrollRight;
    
    if (!container || !leftBtn || !rightBtn) return;
    
    if (container.scrollLeft <= 0) {
        leftBtn.classList.add('disabled');
    } else {
        leftBtn.classList.remove('disabled');
    }
    
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
        rightBtn.classList.add('disabled');
    } else {
        rightBtn.classList.remove('disabled');
    }
  }.bind(this);
  
  bindEvent = function(element, event, handler) {
    if (!element) return;
    element.addEventListener(event, handler);
  }.bind(this);
  
  destroy = function() {
    if (this.state.autoSaveInterval) {
      clearInterval(this.state.autoSaveInterval);
    }
    
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
    
    this.isInitialized = false;
    this.elements.commitDropdown?.remove();
    this.elements.newFileDropdown?.remove();
  }.bind(this);
}

window.CodeViewEditor = CodeViewEditor;
window.coderViewEdit = new CodeViewEditor();

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) {
    window.coderViewEdit.init();
  }
});