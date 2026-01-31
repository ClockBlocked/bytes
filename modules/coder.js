class FullscreenManager {
  constructor(containerSelector = ".editorContainer") {
    this.isFullscreen = false;
    this.container = $(containerSelector);
    this.editorCard = this.container.find('.editorCard');
    
    if (!this.editorCard.length) {
      console.error("FullscreenManager: EditorCard not found");
    }
    
    this.initializeListeners();
  }
  
  enter = () => {
    const elem = this.editorCard[0];
    
    if (!elem) {
      console.error("FullscreenManager: No editorCard to make fullscreen");
      this.fallbackFullscreen(true);
      return;
    }
    
    this.container.attr('data-fullscreen', 'true');
    
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
  };
  
  exit = () => {
    this.container.attr('data-fullscreen', 'false');
    
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
  };
  
  toggle = () => {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  };
  
  fallbackFullscreen = (enter) => {
    this.isFullscreen = enter;
    const value = enter ? 'true' : 'false';
    this.container.attr('data-fullscreen', value);
    
    if (enter) {
      $('body').css("overflow", "hidden");
      this.container.addClass("fullscreen");
      $(document).on("keydown.fullscreen", this.handleEscapeKey);
    } else {
      $('body').css("overflow", "");
      this.container.removeClass("fullscreen");
      $(document).off("keydown.fullscreen");
    }
    
    const event = new CustomEvent('fullscreenchange', { 
      detail: { 
        isFullscreen: enter,
        element: this.editorCard[0],
        timestamp: Date.now()
      } 
    });
    this.container[0]?.dispatchEvent(event);
    $(window).trigger('resize');
  };
  
  handleEscapeKey = (e) => {
    if (e.key === "Escape" && this.isFullscreen) {
      this.exit();
    }
  };
  
  initializeListeners = () => {
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
        this.container.attr('data-fullscreen', value);
        this.fallbackFullscreen(isInFullscreen);
      }
    };
    
    events.forEach(event => {
      $(document).on(event, handler);
    });
    
    // Store for cleanup
    this.eventHandlers = events.map(event => ({ event, handler }));
  };
  
  cleanup = () => {
    if (this.eventHandlers) {
      this.eventHandlers.forEach(({ event, handler }) => {
        $(document).off(event, handler);
      });
    }
    $(document).off("keydown.fullscreen");
  };
  
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
//    this.setupDragAndDrop();
  }
  
  init = () => {
    if (this.isInitialized) return;
    
    try {
      const filePage = $('.pages[data-page="file"]');
      if (!filePage.length) {
        console.warn("CodeViewEditor: File page not found, delaying initialization");
        setTimeout(() => this.init(), 500);
        return;
      }
      
      filePage.html(AppAssets.templates.editor());
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
  };
  
  getElement = (element) => {
  return element && element.length ? element : $();
};


  
  loadCodeMirrorDependencies = () => {
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
  };
  
  setupFallbackEditor = () => {
    const container = this.elements.codeMirrorContainer;
//  if (!container) return;
    if (!container || container.length === 0) return;
    
    container.html(`
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
    `);
    
    const textarea = container.find('.fallback-textarea');
    textarea.on('input', () => {
      this.updateStats();
      this.updateModifiedBadge();
    });
    
    this.fallbackEditor = textarea[0];
  };
  
  cacheElements = () => {
    const elementSelectors = {
      filePage: '.pages[data-page="file"]',
      fileNameInput: "#fileNameInput",
      fileExtensionBtn: "#fileExtensionBtn",
      fileExtensionLabel: "#fileExtensionLabel",
      modifiedIndicator: "#modifiedIndicator",
      languageDropdown: "#languageDropdown",
      languageList: "#languageList",
      editModeBtn: "#editModeBtn",
      viewModeBtn: "#viewModeBtn",
      undoBtn: "#undoBtn",
      redoBtn: "#redoBtn",
      searchBtn: "#searchBtn",
      wrapBtn: "#wrapBtn",
      copyBtn: "#copyBtn",
      downloadBtn: "#downloadBtn",
      uploadBtn: "#uploadBtn",
      themeBtn: "#themeBtn",
      themeIcon: "#themeIcon",
      fontDecreaseBtn: "#fontDecreaseBtn",
      fontIncreaseBtn: "#fontIncreaseBtn",
      fontSizeLabel: "#fontSizeLabel",
      fullscreenBtn: "#fullscreenBtn",
      fullscreenIcon: "#fullscreenIcon",
      moreOptionsBtn: "#moreOptionsBtn",
      moreOptionsDropdown: "#moreOptionsDropdown",
      formatBtn: "#formatBtn",
      foldAllBtn: "#foldAllBtn",
      unfoldAllBtn: "#unfoldAllBtn",
      showInvisiblesBtn: "#showInvisiblesBtn",
      editorBody: "#editorBody",
      codeMirrorContainer: "#codeMirrorContainer",
      loadingSpinner: "#loadingSpinner",
      searchPanel: "#searchPanel",
      searchInput: "#searchInput",
      searchMatches: "#searchMatches",
      searchPrevBtn: "#searchPrevBtn",
      searchNextBtn: "#searchNextBtn",
      closeSearchBtn: "#closeSearchBtn",
      replaceInput: "#replaceInput",
      replaceBtn: "#replaceBtn",
      replaceAllBtn: "#replaceAllBtn",
      cursorLine: "#cursorLine",
      cursorCol: "#cursorCol",
      lineCount: "#lineCount",
      charCount: "#charCount",
      fileSize: "#fileSize",
      statusIndicator: "#statusIndicator",
      lastSaved: "#lastSaved",
      languageBadge: "#languageBadge",
      languageBadgeSmall: "#languageBadgeSmall",
      fileUploadInput: "#fileUploadInput",
      editSaveButton: "#editSaveButton",
      editSaveLabel: "#editSaveLabel",
      popoverTitle: "#popoverTitle",
      popoverSubtitle: "#popoverSubtitle",
      commitMessage: "#commitMessage",
      commitCancelBtn: "#commitCancelBtn",
      commitSaveBtn: "#commitSaveBtn",
      headerScrollContainer: "#headerScrollContainer",
      headerScrollLeft: "#headerScrollLeft",
      headerScrollRight: "#headerScrollRight",
      stickyHeader: "#stickyHeader",
      breadCrumbsWrapper: "#breadCrumbsWrapper",
      breadCrumbsContainer: "#breadCrumbsContainer",
      coderToolBarWrapper: "#coderToolBarWrapper",
      coderToolBar: "#coderToolBar",
      newFileDropdown: "#newFileDropdown",
      newFileWithRepo: "#newFileWithRepo",
      newFileWithoutRepo: "#newFileWithoutRepo",
      tabSizeInput: "#tabSizeInput",
      indentUnitInput: "#indentUnitInput",
      autoCloseBracketsBtn: "#autoCloseBracketsBtn",
      lineNumbersBtn: "#lineNumbersBtn",
      matchBracketsBtn: "#matchBracketsBtn",
    };
 
/**   
    Object.entries(elementSelectors).forEach(([key, selector]) => {
      this.elements[key] = $(selector);
    });

    this.elements.pathBreadcrumb = $('#pathBreadcrumb');
**/


Object.entries(elementSelectors).forEach(([key, selector]) => {
    this.elements[key] = $(selector);
    
    // Initialize as empty jQuery object if not found
    if (!this.elements[key].length) {
      this.elements[key] = $();
    }
  });
  
  // Also for these:
  this.elements.pathBreadcrumb = $('#pathBreadcrumb');
  if (!this.elements.pathBreadcrumb.length) {
    this.elements.pathBreadcrumb = $();
  }


    this.populateLanguageDropdown();
  };
  
  bindElementEvents = () => {
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
    
    if (this.elements.newFileWithRepo.length) {
      this.bindEvent(this.elements.newFileWithRepo, "click", () => this.handleNewFileWithRepo());
    }
    
    if (this.elements.newFileWithoutRepo.length) {
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
        this.performSearch(this.elements.searchInput.val());
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
    if (this.elements.tabSizeInput.length) {
      this.bindEvent(this.elements.tabSizeInput, "change", (e) => {
        this.state.tabSize = parseInt($(e.target).val()) || 2;
        if (this.codeMirror) this.codeMirror.setOption("tabSize", this.state.tabSize);
        localStorage.setItem("editor_tabSize", this.state.tabSize);
      });
    }
    
    if (this.elements.indentUnitInput.length) {
      this.bindEvent(this.elements.indentUnitInput, "change", (e) => {
        this.state.indentUnit = parseInt($(e.target).val()) || 2;
        if (this.codeMirror) this.codeMirror.setOption("indentUnit", this.state.indentUnit);
        localStorage.setItem("editor_indentUnit", this.state.indentUnit);
      });
    }
    
    $(document).on("click", (e) => {
      const newFileButton = $('[data-action="new-file"], #newFileButton');
      const dropdown = this.elements.newFileDropdown;
      
      if (dropdown.length && !dropdown.is(e.target) && dropdown.has(e.target).length === 0 &&
          newFileButton.length && !newFileButton.is(e.target) && newFileButton.has(e.target).length === 0) {
        dropdown.addClass("hide");
      }
      
      if (this.elements.commitDropdown && !this.elements.commitDropdown.is(e.target) && 
          this.elements.commitDropdown.has(e.target).length === 0 && 
          !this.elements.editSaveButton.is(e.target) && 
          this.elements.editSaveButton.has(e.target).length === 0) {
        this.hideCommitPopup();
      }
      
      if (this.elements.languageDropdown && !this.elements.languageDropdown.is(e.target) && 
          this.elements.languageDropdown.has(e.target).length === 0 && 
          !this.elements.fileExtensionBtn.is(e.target) && 
          this.elements.fileExtensionBtn.has(e.target).length === 0) {
        this.hideLanguageDropdown();
      }
      
      if (this.elements.moreOptionsDropdown && !this.elements.moreOptionsDropdown.is(e.target) && 
          this.elements.moreOptionsDropdown.has(e.target).length === 0 && 
          !this.elements.moreOptionsBtn.is(e.target) && 
          this.elements.moreOptionsBtn.has(e.target).length === 0) {
        this.hideMoreOptionsDropdown();
      }
    });
    
    $(window).on("resize", () => {
      this.debounce('resize', () => {
        if (this.elements.commitDropdown && !this.elements.commitDropdown.hasClass("hide")) {
          this.calculateDropdownPosition();
        }
        this.updateHeaderScrollButtons();
        this.codeMirror?.refresh();
      }, 100);
    });
  };
  
  showMoreOptionsDropdown = (e) => {
  /**
    if (!this.elements.moreOptionsDropdown.length) {
      this.injectMoreOptionsDropdown();
    }
    
    const dropdown = this.elements.moreOptionsDropdown;
    if (!dropdown.length) return;
 **/
 
 
  if (!this.elements.moreOptionsDropdown || this.elements.moreOptionsDropdown.length === 0) {
    this.injectMoreOptionsDropdown();
  }
  
  const dropdown = this.elements.moreOptionsDropdown;
  if (!dropdown || dropdown.length === 0) return;
  
    
    
    const isHidden = dropdown.hasClass('hide');
    
    // Hide other dropdowns
    this.hideLanguageDropdown();
    this.hideNewFileDropdown();
    
    dropdown.toggleClass('hide', !isHidden);
    
    if (isHidden) {
      this.positionDropdown(dropdown, e?.currentTarget || this.elements.moreOptionsBtn[0]);
      
      // Update toggle states
      if (this.elements.showInvisiblesBtn.length) {
        this.elements.showInvisiblesBtn.toggleClass('active', this.state.showInvisibles);
      }
    }
  };
  
  hideLanguageDropdown = () => {
    if (this.elements.languageDropdown.length) {
      this.elements.languageDropdown.addClass('hide');
    }
  };
  
  hideMoreOptionsDropdown = () => {
    if (this.elements.moreOptionsDropdown.length) {
      this.elements.moreOptionsDropdown.addClass('hide');
    }
  };
  
  injectMoreOptionsDropdown = () => {
    const existing = $('#moreOptionsDropdown');
    if (existing.length) existing.remove();
    
    $('body').append(AppAssets.templates.moreOptionsDropdown());
    this.elements.moreOptionsDropdown = $('#moreOptionsDropdown');
    
    if (this.elements.moreOptionsDropdown.length) {
      this.elements.moreOptionsDropdown.addClass('hide');
      this.elements.formatBtn = $('#formatBtn');
      this.elements.foldAllBtn = $('#foldAllBtn');
      this.elements.unfoldAllBtn = $('#unfoldAllBtn');
      this.elements.showInvisiblesBtn = $('#showInvisiblesBtn');
      
      this.bindEvent(this.elements.formatBtn, 'click', () => this.formatCode());
      this.bindEvent(this.elements.foldAllBtn, 'click', () => this.foldAll());
      this.bindEvent(this.elements.unfoldAllBtn, 'click', () => this.unfoldAll());
      this.bindEvent(this.elements.showInvisiblesBtn, 'click', () => this.toggleInvisibles());
    }
  };
  
  injectLanguageDropdown = () => {
    const existing = $('#languageDropdown');
    if (existing.length) existing.remove();
    
    $('body').append(AppAssets.templates.languageDropdown());
    this.elements.languageDropdown = $('#languageDropdown');
    this.elements.languageList = $('#languageList');
    
    if (this.elements.languageDropdown.length) {
      this.elements.languageDropdown.addClass('hide');
    }
    
    this.populateLanguageDropdown();
  };
  
  populateLanguageDropdown = () => {
    if (!this.elements.languageList.length) return;
    
    this.elements.languageList.empty();
    
    this.languages.forEach((lang) => {
      const btn = $('<button>', {
        class: 'dropdown-item',
        html: `
          <span class="lang-name">${lang.label}</span>
          <span class="lang-ext">${lang.ext.join(', ')}</span>
        `,
        'data-value': lang.value
      });
      
      btn.on('click', () => {
        this.setLanguage(lang.value);
        this.hideLanguageDropdown();
      });
      
      this.elements.languageList.append(btn);
    });
  };
  
  showLanguageDropdown = (e) => {
    if (!this.elements.languageDropdown.length) {
      this.injectLanguageDropdown();
    }
    
    const dropdown = this.elements.languageDropdown;
    if (!dropdown.length) return;
    
    const isHidden = dropdown.hasClass('hide');
    
    this.hideNewFileDropdown();
    this.hideMoreOptionsDropdown();
    
    dropdown.toggleClass('hide', !isHidden);
    
    if (isHidden) {
      this.positionDropdown(dropdown, e?.currentTarget || this.elements.fileExtensionBtn[0]);
    }
  };
  
  positionDropdown = (dropdown, button) => {
    if (!button || !dropdown.length) return;
    
    const $button = $(button);
    const rect = button.getBoundingClientRect();
    const dropdownRect = dropdown[0].getBoundingClientRect();
    
    let top = rect.bottom + $(window).scrollTop() + 5;
    let left = rect.left + $(window).scrollLeft();
    
    const viewportWidth = $(window).width();
    const viewportHeight = $(window).height();
    
    // Adjust for viewport boundaries
    if (left + dropdownRect.width > viewportWidth) {
      left = viewportWidth - dropdownRect.width - 10;
    }
    
    if (left < 0) left = 10;
    
    if (top + dropdownRect.height > viewportHeight) {
      top = rect.top + $(window).scrollTop() - dropdownRect.height - 5;
    }
    
    if (top < 0) top = 10;
    
    dropdown.css({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '10000'
    });
  };
  
  setupNewFileButton = () => {
    const newFileButton = $('[data-action="new-file"], #newFileButton');
    
    if (newFileButton.length) {
      const newButton = newFileButton.clone(true);
      newFileButton.replaceWith(newButton);
      
      newButton.on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showNewFileDropdown(e);
      });
    }
  };
  
  injectNewFileDropdown = () => {
    const existing = $('#newFileDropdown');
    if (existing.length) existing.remove();
    
    $('body').append(AppAssets.templates.newFileDropdown());
    
    this.elements.newFileDropdown = $('#newFileDropdown');
    this.elements.newFileWithRepo = $('#newFileWithRepo');
    this.elements.newFileWithoutRepo = $('#newFileWithoutRepo');
  };
  
  showNewFileDropdown = (e) => {
    if (!this.elements.newFileDropdown.length) {
      this.injectNewFileDropdown();
    }
    
    const dropdown = this.elements.newFileDropdown;
    if (!dropdown.length) return;
    
    const isHidden = dropdown.hasClass('hide');
    
    this.hideLanguageDropdown();
    this.hideMoreOptionsDropdown();
    
    dropdown.toggleClass('hide', !isHidden);
    
    if (isHidden) {
      const button = e?.currentTarget || $('[data-action="new-file"], #newFileButton')[0];
      this.positionDropdown(dropdown, button);
    }
  };
  
  handleNewFileWithRepo = () => {
    if (typeof window.showCreateFileModal === 'function') {
      window.showCreateFileModal();
    }
    this.hideNewFileDropdown();
  };
  
  handleNewFileWithoutRepo = () => {
    this.createNewStandaloneFile();
    this.hideNewFileDropdown();
  };
  
  createNewStandaloneFile = () => {
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
    
    if (this.elements.fileNameInput.length) {
      this.elements.fileNameInput.val('untitled');
    }
    if (this.elements.fileExtensionLabel.length) {
      this.elements.fileExtensionLabel.text('.js');
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
  };
  
  getTemplateForLanguage = (language) => {
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
  };
  
  hideNewFileDropdown = () => {
    if (this.elements.newFileDropdown.length) {
      this.elements.newFileDropdown.addClass('hide');
    }
  };
  
  setupCodeMirror = () => {
    if (!this.elements.codeMirrorContainer.length) return;
    
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
      theme: isDark ? "dark-dimmed" : "default",
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
    
    this.codeMirror = CodeMirror(this.elements.codeMirrorContainer[0], config);
    
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
      this.elements.editorBody?.addClass("focused");
    });
    
    this.codeMirror.on("blur", () => {
      this.elements.editorBody?.removeClass("focused");
    });
    
    this.codeMirror.on("scroll", () => {
      this.updateScrollPosition();
    });
    
    this.codeMirror.on("gutterClick", (cm, line, gutter) => {
      if (gutter === "CodeMirror-foldgutter") {
        cm.foldCode(cm.getCursor());
      }
    });
  };
  
  setCodeMirrorMode = (langValue) => {
    if (!this.codeMirror) return;
    
    const mode = CODEMIRROR_MODES[langValue] || "text";
    this.codeMirror.setOption("mode", mode);
    
    // Try to load mode if not available
    if (typeof CodeMirror.modes[mode] === "undefined") {
      console.warn(`CodeMirror mode ${mode} not loaded, trying to load...`);
    }
  };
  
  setupGlobalEventListeners = () => {
    $(document).on("keydown", (e) => {
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
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem("editor_theme")) {
          const isDark = e.matches;
          this.updateThemeIcon(isDark);
          if (this.codeMirror) {
            this.codeMirror.setOption("theme", isDark ? "dark" : "default");
          }
        }
      });
    }
    
    // Handle page visibility
    $(document).on("visibilitychange", () => {
      if (document.hidden) {
        this.autoSave();
      }
    });
  };
  
  setupDragAndDrop = () => {
    const container = this.elements.editorBody;
    if (!container.length) return;
    
    container.on('dragover', (e) => {
      e.preventDefault();
      container.addClass('drag-over');
    });
    
    container.on('dragleave', () => {
      container.removeClass('drag-over');
    });
    
    container.on('drop', (e) => {
      e.preventDefault();
      container.removeClass('drag-over');
      
      const files = e.originalEvent.dataTransfer.files;
      if (files.length > 0) {
        this.handleDroppedFiles(files);
      }
    });
  };
  
  handleDroppedFiles = (files) => {
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
      
      if (this.elements.fileNameInput.length) {
        this.elements.fileNameInput.val(name);
      }
      if (this.elements.fileExtensionLabel.length) {
        this.elements.fileExtensionLabel.text(ext || ".txt");
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
  };
  
  setupAutoSave = () => {
    const autoSave = localStorage.getItem("editor_autoSave");
    this.state.autoSave = autoSave === "true";
    
    if (this.state.autoSave) {
      console.log("Auto-save enabled");
    }
  };
  
  handleAutoSave = () => {
    if (!this.state.autoSave || !this.isEditing) return;
    
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      if (this.isEditing && this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, 30000); // 30 seconds
  };
  
  autoSave = () => {
    if (!this.hasUnsavedChanges()) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : 
                   this.fallbackEditor ? this.fallbackEditor.value : "";
    
    if (content === this.originalContent) return;
    
    this.performSave("Auto-saved changes");
    showSuccessMessage?.("Auto-saved changes");
  };
  
  setLanguage = (langValue) => {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    
    this.currentLanguage = langValue;
    
    const ext = lang.ext[0];
    if (this.elements.fileExtensionLabel.length) {
      this.elements.fileExtensionLabel.text(`.${ext}`);
    }
    
    if (this.elements.languageBadge.length) {
      this.elements.languageBadge.html(AppAssets.icons.code(lang.label));
    }
    
    if (this.elements.languageBadgeSmall.length) {
      this.elements.languageBadgeSmall.text(lang.label);
    }
    
    this.hideLanguageDropdown();
    this.setCodeMirrorMode(langValue);
    
    // Update syntax highlighting
    if (this.codeMirror) {
      this.codeMirror.refresh();
    }
  };
  
  loadUserPreferences = () => {
    // Line wrapping
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapBtn?.toggleClass("active", this.state.wrapLines);
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
  };
  
  restoreEditorState = () => {
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
  };
  
  saveEditorState = () => {
    if (!this.codeMirror) return;
    
    const state = {
      content: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor(),
      selections: this.codeMirror.listSelections(),
      timestamp: Date.now(),
      file: this.currentFile
    };
    
    localStorage.setItem("editor_state", JSON.stringify(state));
  };
  
  detectLanguageFromExtension = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    
    // Check for special cases
    if (filename.toLowerCase() === 'dockerfile') return 'dockerfile';
    if (filename.toLowerCase() === 'makefile') return 'shell';
    
    return "javascript";
  };
  
  showCommitPopup = (e) => {
    if (!this.elements.commitDropdown.length) return;
    
    this.elements.commitDropdown.removeClass("hide");
    this.calculateDropdownPosition();
    
    if (this.elements.popoverTitle.length) {
      this.elements.popoverTitle.text(this.currentFile ? `Save ${this.currentFile}` : "Save File");
    }
    
    if (this.elements.popoverSubtitle.length) {
      this.elements.popoverSubtitle.text("Enter a commit message (optional)");
    }
    
    if (this.elements.commitMessage.length) {
      const defaultMessage = this.currentFile ? 
        `Update ${this.currentFile} - ${new Date().toLocaleDateString()}` : 
        "Save changes";
      this.elements.commitMessage.val(defaultMessage);
      this.elements.commitMessage.trigger('select');
    }
  };
  
  hideCommitPopup = () => {
    if (!this.elements.commitDropdown.length) return;
    
    this.elements.commitDropdown.addClass("hide");
    if (this.elements.commitMessage.length) {
      this.elements.commitMessage.val("");
    }
  };
  
  injectPopover = () => {
    const existing = $("#commitDropdown");
    if (existing.length) existing.remove();
    
    $('body').append(AppAssets.templates.commitDropdown());
    this.elements.commitDropdown = $("#commitDropdown");
  };
  
  calculateDropdownPosition = () => {
    if (!this.elements.editSaveButton.length || !this.elements.commitDropdown.length) return;
    
    const buttonRect = this.elements.editSaveButton[0].getBoundingClientRect();
    const dropdown = this.elements.commitDropdown;
    const dropdownRect = dropdown[0].getBoundingClientRect();
    
    let top = buttonRect.bottom + $(window).scrollTop() + 8;
    let left = buttonRect.left + $(window).scrollLeft();
    
    // Adjust to fit viewport
    if (left + dropdownRect.width > $(window).width()) {
      left = $(window).width() - dropdownRect.width - 10;
    }
    
    if (top + dropdownRect.height > $(window).height()) {
      top = buttonRect.top + $(window).scrollTop() - dropdownRect.height - 8;
    }
    
    dropdown.css({
      top: `${top}px`,
      left: `${left}px`
    });
  };
  
  showLoadingSpinner = () => {
    this.isLoading = true;
    this.elements.loadingSpinner?.attr("data-active", "true");
  };
  
  hideLoadingSpinner = () => {
    this.isLoading = false;
    this.elements.loadingSpinner?.attr("data-active", "false");
  };
  
  coderLoading = (timer = 1500) => {
    this.showLoadingSpinner();
    
    setTimeout(() => {
      this.hideLoadingSpinner();
    }, timer);
  };
  
  displayFile = (filename, fileData, repoName = null, path = '') => {
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
    
    if (this.elements.fileNameInput.length) {
      this.elements.fileNameInput.val(name);
    }
    
    if (this.elements.fileExtensionLabel.length) {
      this.elements.fileExtensionLabel.text(ext || ".txt");
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
  };
  
  saveToRecentFiles = (filename, repoName, path) => {
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
  };
  
  updateBreadcrumbs = (repoName = null, path = '') => {
    const breadcrumb = this.elements.pathBreadcrumb;
    if (!breadcrumb.length) return;
    
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
    
    breadcrumb.html(html);
    
    breadcrumb.find('[data-action], [data-path]').on('click', (e) => {
      e.preventDefault();
      const action = $(e.currentTarget).attr('data-action');
      const path = $(e.currentTarget).attr('data-path');
      
      if (action === 'show-repo-selector') {
        window.showRepoSelector?.();
      } else if (action === 'show-explorer') {
        window.showExplorer?.();
      } else if (path) {
        window.navigateToPath?.(path);
      }
    });
  };
  
  performSave = (commitMessage) => {
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
        $(document).trigger(event);
        
      } catch (error) {
        console.error("Save failed:", error);
        showErrorMessage?.(`Save failed: ${error.message}`);
      }
    }, 300);
  };
  
  saveChanges = (withCommit = false) => {
    if (!this.currentFile || !this.fileData) {
      showErrorMessage?.("No file to save");
      return;
    }
    
    if (withCommit) {
      const commitMessage = this.elements.commitMessage?.val().trim();
      this.hideCommitPopup();
      this.performSave(commitMessage);
    } else {
      this.performSave("Saved changes");
    }
  };
  
  handleFileUpload = (e) => {
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
      
      if (this.elements.fileNameInput.length) {
        this.elements.fileNameInput.val(name);
      }
      if (this.elements.fileExtensionLabel.length) {
        this.elements.fileExtensionLabel.text(ext || ".txt");
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
  };
  
  show = () => {
    this.elements.filePage?.removeClass("hide");
    setTimeout(() => {
      this.codeMirror?.refresh();
      this.updateHeaderScrollButtons();
    }, 50);
  };
  
  hide = () => {
    this.elements.filePage?.addClass("hide");
  };
  
  enterEditMode = () => {
    if (!this.currentFile && !this.fallbackEditor) {
      this.createNewStandaloneFile();
      return;
    }
    
    this.coderLoading(500);
    
    this.isEditing = true;
    this.elements.editModeBtn?.addClass("active");
    this.elements.viewModeBtn?.removeClass("active");
    
    if (this.elements.editSaveLabel.length) {
      this.elements.editSaveLabel.text("Save");
    }
    
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
//    this.codeMirror.focus();
    } else if (this.fallbackEditor) {
      this.fallbackEditor.readOnly = false;
//    this.fallbackEditor.focus();
    }
    
    // Dispatch event
    const event = new CustomEvent('editModeEntered', {
      detail: { filename: this.currentFile, timestamp: Date.now() }
    });
    $(document).trigger(event);
  };
  
  exitEditMode = () => {
    if (!this.isEditing) return;
    
    this.coderLoading(500);
    
    this.isEditing = false;
    this.elements.editModeBtn?.removeClass("active");
    this.elements.viewModeBtn?.addClass("active");
    
    if (this.elements.editSaveLabel.length) {
      this.elements.editSaveLabel.text("Edit");
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
    $(document).trigger(event);
  };
  
  hasUnsavedChanges = () => {
    const currentContent = this.codeMirror ? this.codeMirror.getValue() : 
                         this.fallbackEditor ? this.fallbackEditor.value : "";
    return currentContent !== this.originalContent;
  };
  
  toggleFullscreen = () => {
    if (!this.fullscreenManager) {
      this.fullscreenManager = new FullscreenManager(".editorContainer");
    }
    
    this.fullscreenManager.toggle();
    
    setTimeout(() => {
      this.codeMirror?.refresh();
    }, 100);
  };
  
  copyCode = () => {
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
      const textArea = $('<textarea>').val(content).appendTo('body');
      textArea[0].select();
      document.execCommand('copy');
      textArea.remove();
      showSuccessMessage?.("Copied to clipboard");
    });
  };
  
  downloadFile = () => {
    if (!this.currentFile) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : 
                   this.fallbackEditor ? this.fallbackEditor.value : "";
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = $('<a>', {
      href: url,
      download: this.currentFile,
      css: { display: 'none' }
    }).appendTo('body');
    
    a[0].click();
    a.remove();
    URL.revokeObjectURL(url);
    
    showSuccessMessage?.(`Downloaded ${this.currentFile}`);
  };
  
  formatCode = () => {
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
  };
  
  autoIndent = (code) => {
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
  };
  
  formatHTML = (html) => {
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
  };
  
  formatCSS = (css) => {
    // Basic CSS formatting
    return css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/}\s*/g, '\n}\n\n')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  foldAll = () => {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode(CodeMirror.Pos(i, 0), null, "fold");
      }
    });
    
    this.hideMoreOptionsDropdown();
  };
  
  unfoldAll = () => {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode(CodeMirror.Pos(i, 0), null, "unfold");
      }
    });
    
    this.hideMoreOptionsDropdown();
  };
  
  undo = () => {
    if (this.codeMirror) {
      this.codeMirror.undo();
    } else if (this.fallbackEditor) {
      document.execCommand('undo');
    }
  };
  
  redo = () => {
    if (this.codeMirror) {
      this.codeMirror.redo();
    } else if (this.fallbackEditor) {
      document.execCommand('redo');
    }
  };
  
  openSearch = () => {
    if (!this.codeMirror && !this.fallbackEditor) return;
    
    this.searchActive = true;
    this.elements.searchPanel?.removeClass("hide");
    
    setTimeout(() => {
      this.elements.searchInput?.trigger('focus');
      this.elements.searchInput?.trigger('select');
    }, 50);
  };
  
  openReplace = () => {
    this.openSearch();
    // Show replace inputs if available
    const replaceInput = this.elements.replaceInput;
    if (replaceInput.length) {
      replaceInput.show();
      replaceInput.trigger('focus');
    }
  };
  
  closeSearch = () => {
    this.searchActive = false;
    this.elements.searchPanel?.addClass("hide");
    this.clearSearch();
    
    // Hide replace inputs
    const replaceInput = this.elements.replaceInput;
    if (replaceInput.length) {
      replaceInput.hide();
    }
  };
  
  clearSearch = () => {
    if (this.elements.searchInput.length) {
      this.elements.searchInput.val("");
    }
    if (this.elements.replaceInput.length) {
      this.elements.replaceInput.val("");
    }
    this.searchMatches = [];
    this.clearMarks();
  };
  
  clearMarks = () => {
    if (!this.codeMirror) return;
    this.marks.forEach(mark => mark.clear());
    this.marks = [];
  };
  
  performSearch = (query) => {
    if (!this.codeMirror) return;
    
    this.clearMarks();
    this.searchMatches = [];
    
    if (!query) {
      if (this.elements.searchMatches.length) {
        this.elements.searchMatches.text("0/0");
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
      
      if (this.elements.searchMatches.length) {
        this.elements.searchMatches.text(`1/${count}`);
      }
    } else {
      if (this.elements.searchMatches.length) {
        this.elements.searchMatches.text(`0/0`);
      }
    }
  };
  
  findPrevious = () => {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchMatches.length) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
    
    if (this.elements.searchMatches.length) {
      this.elements.searchMatches.text(`${this.currentSearchIndex + 1}/${this.searchMatches.length}`);
    }
  };
  
  findNext = () => {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
    
    if (this.elements.searchMatches.length) {
      this.elements.searchMatches.text(`${this.currentSearchIndex + 1}/${this.searchMatches.length}`);
    }
  };
  
  highlightMatch = (index) => {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    
    const match = this.searchMatches[index];
    
    this.codeMirror.setSelection(match.from, match.to);
    this.codeMirror.scrollIntoView({
      line: match.line,
      ch: match.ch
    }, 200);
  };
  
  setCodeMirrorFontSize = (size) => {
    if (!this.codeMirror) return;
    
    size = Math.max(8, Math.min(32, size));
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.state.fontSize = size;
    
    if (this.elements.fontSizeLabel.length) {
      this.elements.fontSizeLabel.text(`${size}px`);
    }
    
    localStorage.setItem("editor_fontsize", size);
    this.codeMirror.refresh();
  };
  
  adjustFontSize = (change) => {
    const newSize = Math.max(8, Math.min(32, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) {
      this.setCodeMirrorFontSize(newSize);
    }
  };
  
  updateThemeIcon = (isDark) => {
    if (!this.elements.themeIcon.length) return;
    
    this.elements.themeIcon.html(isDark ? AppAssets.icons.moon() : AppAssets.icons.sun());
  };
  
  toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("editor_theme", newTheme);
    this.updateThemeIcon(!isDark);
    
    if (this.codeMirror) {
      this.codeMirror.setOption("theme", isDark ? "default" : "dark-dimmed");
    }
  };
  
  toggleWrapLines = () => {
    if (!this.codeMirror) return;
    
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    this.elements.wrapBtn?.toggleClass("active", this.state.wrapLines);
    localStorage.setItem("editor_wrapLines", this.state.wrapLines);
  };
  
  toggleInvisibles = () => {
    this.state.showInvisibles = !this.state.showInvisibles;
    if (this.codeMirror) {
      this.codeMirror.setOption("showInvisibles", this.state.showInvisibles);
    }
    this.elements.showInvisiblesBtn?.toggleClass("active", this.state.showInvisibles);
  };
  
  updateStats = () => {
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
    
    if (this.elements.lineCount.length) {
      this.elements.lineCount.text(lines.toLocaleString());
    }
    
    if (this.elements.charCount.length) {
      this.elements.charCount.text(characters.toLocaleString());
    }
    
    if (this.elements.fileSize.length) {
      this.elements.fileSize.text(sizeStr);
    }
    
    // Update word count if element exists
    const wordCountElement = $('#wordCount');
    if (wordCountElement.length) {
      wordCountElement.text(words.toLocaleString());
    }
  };
  
  updateCursorPosition = () => {
    if (!this.codeMirror) return;
    
    const cursor = this.codeMirror.getCursor();
    
    if (this.elements.cursorLine.length) {
      this.elements.cursorLine.text((cursor.line + 1).toLocaleString());
    }
    
    if (this.elements.cursorCol.length) {
      this.elements.cursorCol.text((cursor.ch + 1).toLocaleString());
    }
  };
  
  updateSelectionInfo = () => {
    if (!this.codeMirror) return;
    
    const selections = this.codeMirror.listSelections();
    if (selections.length > 1) {
      // Multiple selections
      const selectionCountElement = $('#selectionCount');
      if (selectionCountElement.length) {
        selectionCountElement.text(`${selections.length} selections`);
        selectionCountElement.show();
      }
    } else {
      const selectionCountElement = $('#selectionCount');
      if (selectionCountElement.length) {
        selectionCountElement.hide();
      }
    }
  };
  
  updateScrollPosition = () => {
    if (!this.codeMirror) return;
    
    const scrollInfo = this.codeMirror.getScrollInfo();
    const scrollPercent = (scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight)) * 100;
    
    const scrollPositionElement = $('#scrollPosition');
    if (scrollPositionElement.length) {
      scrollPositionElement.text(`${Math.round(scrollPercent)}%`);
    }
  };
  
  updateModifiedBadge = () => {
    if (!this.codeMirror && !this.fallbackEditor) return;
    
    const currentContent = this.codeMirror ? this.codeMirror.getValue() : 
                         this.fallbackEditor ? this.fallbackEditor.value : "";
    const isModified = currentContent !== this.originalContent;
    this.elements.modifiedIndicator?.toggleClass("hide", !isModified);
    
    // Update document title
    if (this.currentFile) {
      document.title = `${this.currentFile}${isModified ? ' *' : ''} - Code Editor`;
    }
  };
  
  updateLastSaved = (saved) => {
    if (!this.elements.lastSaved.length) return;
    
    if (saved) {
      const now = new Date();
      this.elements.lastSaved.text(now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }));
      this.elements.lastSaved.attr('title', now.toLocaleString());
    } else {
      this.elements.lastSaved.text("Never");
      this.elements.lastSaved.attr('title', "Not saved yet");
    }
  };
  
  scrollHeader = (direction) => {
    const container = this.elements.headerScrollContainer;
    if (!container.length) return;
    
    const scrollAmount = 200;
    if (direction === 'left') {
      container[0].scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container[0].scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    // Update buttons after scrolling
    setTimeout(() => this.updateHeaderScrollButtons(), 300);
  };
  
  updateHeaderScrollButtons = () => {
    const container = this.elements.headerScrollContainer;
    const leftBtn = this.elements.headerScrollLeft;
    const rightBtn = this.elements.headerScrollRight;
    
    if (!container.length || !leftBtn.length || !rightBtn.length) return;
    
    // Check if scrolling is needed
    const needsScroll = container[0].scrollWidth > container[0].clientWidth;
    leftBtn.css('display', needsScroll ? 'flex' : 'none');
    rightBtn.css('display', needsScroll ? 'flex' : 'none');
    
    if (container[0].scrollLeft <= 5) {
      leftBtn.addClass('disabled');
    } else {
      leftBtn.removeClass('disabled');
    }
    
    if (container[0].scrollLeft + container[0].clientWidth >= container[0].scrollWidth - 5) {
      rightBtn.addClass('disabled');
    } else {
      rightBtn.removeClass('disabled');
    }
  };
  
  bindEvent = (element, event, handler) => {
//  if (!element.length) return;
    if (!element || element.length === 0) return;
    
    const key = `${event}-${Math.random().toString(36).substr(2, 9)}`;
    element.on(event, handler);
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, new Map());
    }
    this.eventListeners.get(element).set(key, { event, handler });
  };
  
  unbindEvent = (element, event, handler) => {
//  if (!element.length) return;
    if (!element || element.length === 0) return;
    
    element.off(event, handler);
    
    if (this.eventListeners.has(element)) {
      const elementListeners = this.eventListeners.get(element);
      for (const [key, listener] of elementListeners) {
        if (listener.event === event && listener.handler === handler) {
          elementListeners.delete(key);
          break;
        }
      }
    }
  };
  
  debounce = (id, func, delay) => {
    if (this.debounceTimers[id]) {
      clearTimeout(this.debounceTimers[id]);
    }
    this.debounceTimers[id] = setTimeout(func, delay);
  };
  
  restoreSession = () => {
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
  };
  
  saveSession = () => {
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
  };
  
  destroy = () => {
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
        element.off(event, handler);
      });
    });
    this.eventListeners.clear();
    
    // Remove injected elements
    this.elements.commitDropdown?.remove();
    this.elements.newFileDropdown?.remove();
    this.elements.languageDropdown?.remove();
    this.elements.moreOptionsDropdown?.remove();
    
    this.isInitialized = false;
  };
}

window.CodeViewEditor = CodeViewEditor;
window.coderViewEdit = new CodeViewEditor();

// Enhanced initialization with error handling
$(document).ready(() => {
  try {
    if ($('.pages[data-page="file"]').length) {
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
$(window).on('beforeunload', (e) => {
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