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
  
  enter() {
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
  }
  
  exit() {
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
  }
  
  toggle() {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  }
  
  fallbackFullscreen(enter) {
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
  }
  
  initializeListeners() {
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
  }
  
  get isActive() {
    return this.isFullscreen;
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

class PopoverManager {
  constructor(editor) {
    this.editor = editor;
    this.dropdowns = {};
  }

  injectLanguageDropdown() {
    const existing = document.getElementById('languageDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.languageDropdown());
    this.dropdowns.language = document.getElementById('languageDropdown');
    
    if (this.dropdowns.language) {
      this.dropdowns.language.classList.add('hide');
    }
    
    this.editor.elements.languageList = document.getElementById('languageList');
    this.populateLanguageDropdown();
  }

  populateLanguageDropdown() {
    if (!this.editor.elements.languageList) return;
    
    this.editor.elements.languageList.innerHTML = "";
    
    this.editor.languages.forEach((lang) => {
      const btn = document.createElement("button");
      btn.className = "dropdownItem";
      btn.textContent = lang.label;
      btn.dataset.value = lang.value;
      
      btn.addEventListener("click", () => {
        this.editor.setLanguage(lang.value);
        this.hideLanguageDropdown();
      });
      
      this.editor.elements.languageList.appendChild(btn);
    });
  }

  showLanguageDropdown(e) {
    if (!this.dropdowns.language) {
      this.injectLanguageDropdown();
    }
    
    const dropdown = this.dropdowns.language;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    
    this.hideNewFileDropdown();
    this.hideMoreOptionsDropdown();
    
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      const button = e?.currentTarget || this.editor.elements.fileExtensionBtn;
      this.positionDropdown(dropdown, button);
    }
  }

  hideLanguageDropdown() {
    if (this.dropdowns.language) {
      this.dropdowns.language.classList.add('hide');
    }
  }

  injectMoreOptionsDropdown() {
    const existing = document.getElementById('moreOptionsDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.moreOptionsDropdown());
    this.dropdowns.moreOptions = document.getElementById('moreOptionsDropdown');
    
    if (this.dropdowns.moreOptions) {
      this.dropdowns.moreOptions.classList.add('hide');
    }
    
    const bindEvent = (selector, handler) => {
      const element = this.dropdowns.moreOptions?.querySelector(selector);
      if (element) {
        element.addEventListener('click', handler);
      }
    };
    
    bindEvent('#formatBtn', () => this.editor.formatCode());
    bindEvent('#foldAllBtn', () => this.editor.foldAll());
    bindEvent('#unfoldAllBtn', () => this.editor.unfoldAll());
    bindEvent('#showInvisiblesBtn', () => this.editor.toggleInvisibles());
  }

  showMoreOptionsDropdown(e) {
    if (!this.dropdowns.moreOptions) {
      this.injectMoreOptionsDropdown();
    }
    
    const dropdown = this.dropdowns.moreOptions;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    dropdown.classList.toggle('hide', !isHidden);
    
    if (!isHidden) {
      const button = e?.currentTarget || this.editor.elements.moreOptionsBtn;
      this.positionDropdown(dropdown, button);
    }
  }

  hideMoreOptionsDropdown() {
    if (this.dropdowns.moreOptions) {
      this.dropdowns.moreOptions.classList.add('hide');
    }
  }

  injectPopover() {
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.commitDropdown());
    this.dropdowns.commit = document.getElementById("commitDropdown");
  }

  showCommitPopup() {
    if (!this.dropdowns.commit) return;
    
    this.dropdowns.commit.classList.remove("hide");
    this.calculateDropdownPosition();
    
    if (this.editor.elements.popoverTitle) {
      this.editor.elements.popoverTitle.textContent = "Add Commit & Save";
    }
    
    if (this.editor.elements.popoverSubtitle) {
      this.editor.elements.popoverSubtitle.textContent = "Enter a commit message before saving";
    }
    
    if (this.editor.elements.commitMessage) {
      this.editor.elements.commitMessage.value = `Update ${this.editor.currentFile}`;
    }
  }

  hideCommitPopup() {
    if (!this.dropdowns.commit) return;
    
    this.dropdowns.commit.classList.add("hide");
    if (this.editor.elements.commitMessage) {
      this.editor.elements.commitMessage.value = "";
    }
  }

  calculateDropdownPosition() {
    if (!this.editor.elements.editSaveButton || !this.dropdowns.commit) return;
    
    const buttonRect = this.editor.elements.editSaveButton.getBoundingClientRect();
    const dropdown = this.dropdowns.commit;
    const top = buttonRect.bottom + window.scrollY + 8;
    let left = buttonRect.right - dropdown.offsetWidth + window.scrollX;
    
    if (left < 10) left = 10;
    
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }

  injectNewFileDropdown() {
    const existing = document.getElementById('newFileDropdown');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.newFileDropdown());
    
    this.dropdowns.newFile = document.getElementById('newFileDropdown');
    this.editor.elements.newFileWithRepo = document.getElementById('newFileWithRepo');
    this.editor.elements.newFileWithoutRepo = document.getElementById('newFileWithoutRepo');
  }

  showNewFileDropdown(e) {
    if (!this.dropdowns.newFile) {
      this.injectNewFileDropdown();
    }
    
    const dropdown = this.dropdowns.newFile;
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hide');
    dropdown.classList.toggle('hide', !isHidden);
    
    if (isHidden) {
      const button = e?.currentTarget || document.querySelector('[data-action="new-file"], #newFileButton');
      this.positionDropdown(dropdown, button);
    }
  }

  hideNewFileDropdown() {
    if (this.dropdowns.newFile) {
      this.dropdowns.newFile.classList.add('hide');
    }
  }

  positionDropdown(dropdown, button) {
    if (!button) return;
    
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
    dropdown.style.zIndex = dropdown.id === 'newFileDropdown' ? '9999' : '10000';
  }
}

class EditorStateManager {
  constructor() {
    this.fontSize = 14;
    this.wrapLines = false;
    this.showInvisibles = false;
    this.highlightActiveLine = true;
    this.autoSave = false;
    this.autoSaveInterval = null;
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
    this.lastSaveTime = null;
    this.currentLanguage = "javascript";
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.marks = [];
  }

  loadUserPreferences() {
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.wrapLines = wrap === "true";
    }
    
    const fontSize = localStorage.getItem("editor_fontsize");
    if (fontSize) {
      this.fontSize = parseInt(fontSize);
    }
  }

  saveUserPreferences() {
    localStorage.setItem("editor_wrapLines", this.wrapLines);
    localStorage.setItem("editor_fontsize", this.fontSize);
  }

  pushUndoState(content) {
    this.undoHistory.push(content);
    if (this.undoHistory.length > 50) {
      this.undoHistory.shift();
    }
  }

  pushRedoState(content) {
    this.redoHistory.push(content);
    if (this.redoHistory.length > 50) {
      this.redoHistory.shift();
    }
  }

  clearSearch() {
    this.searchMatches = [];
    this.currentSearchIndex = 0;
  }
}

class FileManager {
  constructor(editor) {
    this.editor = editor;
    this.currentFile = null;
    this.fileData = null;
    this.originalContent = "";
  }

  displayFile(filename, fileData, repoName = null, path = '') {
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

    if (this.editor.elements.fileNameInput) {
      this.editor.elements.fileNameInput.value = name;
    }
    
    if (this.editor.elements.fileExtensionLabel) {
      this.editor.elements.fileExtensionLabel.textContent = ext || ".txt";
    }
    
    const detectedLang = this.editor.detectLanguageFromExtension(filename);
    this.editor.setLanguage(detectedLang);
    
    this.editor.updateBreadcrumbs(repoName, path);
    
    if (!this.editor.codeMirror) {
      this.editor.setupCodeMirror();
      setTimeout(() => {
        if (this.editor.codeMirror) {
          this.editor.codeMirror.setValue(this.originalContent);
          this.editor.codeMirror.refresh();
          this.editor.updateStats();
          this.editor.updateLastSaved(true);
        }
      }, 100);
    } else {
      this.editor.codeMirror.setValue(this.originalContent);
      this.editor.codeMirror.refresh();
      this.editor.updateStats();
      this.editor.updateLastSaved(true);
    }
    
    this.editor.exitEditMode();
    this.editor.updateModifiedBadge();
    this.editor.show();
    this.editor.updateHeaderScrollButtons();
  }

  createNewStandaloneFile() {
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
    
    if (this.editor.elements.fileNameInput) {
      this.editor.elements.fileNameInput.value = 'untitled';
    }
    if (this.editor.elements.fileExtensionLabel) {
      this.editor.elements.fileExtensionLabel.textContent = '.js';
    }
    
    if (this.editor.codeMirror) {
      this.editor.codeMirror.setValue(this.fileData.content);
      this.editor.codeMirror.refresh();
    } else {
      this.editor.setupCodeMirror();
    }
    
    this.editor.setLanguage('javascript');
    this.editor.updateStats();
    this.editor.updateModifiedBadge();
    this.editor.enterEditMode();
    this.editor.show();
  }

  saveChanges(withCommit = false, commitMessage = "") {
    if (!this.currentFile || !this.fileData) return;
    
    this.editor.coderLoading(1500);
    
    if (withCommit && !commitMessage) {
      if (typeof showErrorMessage === "function") {
        showErrorMessage("Please enter a commit message");
      }
      return;
    }
    
    this.performSave(withCommit ? commitMessage : "Saved changes");
  }

  performSave(commitMessage) {
    setTimeout(() => {
      try {
        const newContent = this.editor.codeMirror ? this.editor.codeMirror.getValue() : "";
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
        
        this.editor.updateLastSaved(true);
        this.editor.updateModifiedBadge();
        this.editor.exitEditMode();
      } catch (error) {
        if (typeof showErrorMessage === "function") {
          showErrorMessage(`Save failed: ${error.message}`);
        }
      }
    }, 300);
  }

  handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      this.editor.coderLoading(3500);
      
      const content = event.target?.result;
      if (this.editor.codeMirror) {
        this.editor.codeMirror.setValue(content);
        this.currentFile = file.name;
        
        const lastDotIndex = file.name.lastIndexOf('.');
        let name = file.name;
        let ext = "";
        if (lastDotIndex !== -1) {
          name = file.name.substring(0, lastDotIndex);
          ext = file.name.substring(lastDotIndex);
        }
        
        if (this.editor.elements.fileNameInput) {
          this.editor.elements.fileNameInput.value = name;
        }
        if (this.editor.elements.fileExtensionLabel) {
          this.editor.elements.fileExtensionLabel.textContent = ext || ".txt";
        }
        
        this.editor.setLanguage(this.editor.detectLanguageFromExtension(file.name));
        this.originalContent = content;
        this.editor.updateStats();
        this.editor.updateModifiedBadge();
      }
    };
    reader.readAsText(file);
  }
}

class SearchManager {
  constructor(editor) {
    this.editor = editor;
    this.active = false;
    this.matches = [];
    this.currentIndex = 0;
    this.marks = [];
  }

  open() {
    if (!this.editor.codeMirror) return;
    
    this.active = true;
    this.editor.elements.searchPanel?.classList.remove("hide");
    
    setTimeout(() => {
      this.editor.elements.searchInput?.focus();
      this.editor.elements.searchInput?.select();
    }, 50);
  }

  close() {
    this.active = false;
    this.editor.elements.searchPanel?.classList.add("hide");
    this.clear();
  }

  clear() {
    if (this.editor.elements.searchInput) {
      this.editor.elements.searchInput.value = "";
    }
    this.matches = [];
    this.currentIndex = 0;
    this.clearMarks();
  }

  clearMarks() {
    if (!this.editor.codeMirror) return;
    this.marks.forEach(mark => mark.clear());
    this.marks = [];
  }

  perform(query) {
    if (!this.editor.codeMirror || !query) return;
    
    this.clearMarks();
    this.matches = [];
    
    const cursor = this.editor.codeMirror.getSearchCursor(query);
    while (cursor.findNext()) {
      const from = cursor.from();
      const to = cursor.to();
      
      this.matches.push({
        from: from,
        to: to,
        line: from.line,
        ch: from.ch
      });
      
      this.marks.push(this.editor.codeMirror.markText(from, to, {
        className: "search-highlight"
      }));
    }
    
    if (this.matches.length > 0) {
      this.currentIndex = 0;
      this.highlightMatch(0);
      
      if (this.editor.elements.searchMatches) {
        this.editor.elements.searchMatches.textContent = `1/${this.matches.length}`;
      }
    } else {
      if (this.editor.elements.searchMatches) {
        this.editor.elements.searchMatches.textContent = `0/0`;
      }
    }
  }

  highlightMatch(index) {
    if (!this.editor.codeMirror || index < 0 || index >= this.matches.length) return;
    
    const match = this.matches[index];
    
    this.editor.codeMirror.setSelection(match.from, match.to);
    
    this.editor.codeMirror.scrollIntoView({
      line: match.line,
      ch: match.ch
    }, 200);
  }

  findPrevious() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.matches.length) % this.matches.length;
    this.highlightMatch(this.currentIndex);
    
    if (this.editor.elements.searchMatches) {
      this.editor.elements.searchMatches.textContent = `${this.currentIndex + 1}/${this.matches.length}`;
    }
  }

  findNext() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.matches.length;
    this.highlightMatch(this.currentIndex);
    
    if (this.editor.elements.searchMatches) {
      this.editor.elements.searchMatches.textContent = `${this.currentIndex + 1}/${this.matches.length}`;
    }
  }
}

class CodeViewEditor {
  constructor() {
    this.isEditing = false;
    this.isLoading = false;
    this.isInitialized = false;
    this.codeMirror = null;
    this.elements = {};
    this.fullscreenManager = null;
    
    this.languages = SUPPORTED_LANGUAGES;
    
    this.stateManager = new EditorStateManager();
    this.fileManager = new FileManager(this);
    this.popoverManager = new PopoverManager(this);
    this.searchManager = new SearchManager(this);
    
    this.boundEventHandlers = {};
    
    this.setupGlobalEventListeners();
  }
  
  init() {
    if (this.isInitialized) return;
    
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) return;
    
    filePage.innerHTML = AppAssets.templates.editor();
    this.popoverManager.injectPopover();
    this.popoverManager.injectNewFileDropdown();
    this.cacheElements();
    this.bindElementEvents();
    this.setupNewFileButton();
    
    this.fullscreenManager = new FullscreenManager(".editorContainer");
    
    if (typeof CodeMirror !== "undefined") {
      this.setupCodeMirror();
    } else {
      setTimeout(() => this.setupCodeMirror(), 100);
    }
    
    this.stateManager.loadUserPreferences();
    this.setupAutoSave();
    this.isInitialized = true;
  }
  
  cacheElements() {
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
  }
  
  bindElementEvents() {
    this.bindEvent(this.elements.editModeBtn, "click", () => this.enterEditMode());
    this.bindEvent(this.elements.viewModeBtn, "click", () => this.exitEditMode());
    this.bindEvent(this.elements.undoBtn, "click", () => this.undo());
    this.bindEvent(this.elements.redoBtn, "click", () => this.redo());
    this.bindEvent(this.elements.searchBtn, "click", () => this.searchManager.open());
    this.bindEvent(this.elements.wrapBtn, "click", () => this.toggleWrapLines());
    this.bindEvent(this.elements.copyBtn, "click", () => this.copyCode());
    this.bindEvent(this.elements.downloadBtn, "click", () => this.downloadFile());
    this.bindEvent(this.elements.uploadBtn, "click", () => this.elements.fileUploadInput?.click());
    this.bindEvent(this.elements.themeBtn, "click", () => this.toggleTheme());
    this.bindEvent(this.elements.fontDecreaseBtn, "click", () => this.adjustFontSize(-2));
    this.bindEvent(this.elements.fontIncreaseBtn, "click", () => this.adjustFontSize(2));
    this.bindEvent(this.elements.fullscreenBtn, "click", () => this.toggleFullscreen());
    this.bindEvent(this.elements.fileUploadInput, "change", (e) => this.fileManager.handleFileUpload(e));
    this.bindEvent(this.elements.searchPrevBtn, "click", () => this.searchManager.findPrevious());
    this.bindEvent(this.elements.searchNextBtn, "click", () => this.searchManager.findNext());
    this.bindEvent(this.elements.closeSearchBtn, "click", () => this.searchManager.close());
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
      this.popoverManager.showLanguageDropdown(e);
    });
    
    this.bindEvent(this.elements.moreOptionsBtn, "click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.popoverManager.showMoreOptionsDropdown(e);
    });
    
    this.bindEvent(this.elements.editSaveButton, "click", (e) => {
      e.stopPropagation();
      if (!this.isEditing) {
        this.enterEditMode();
      } else {
        this.popoverManager.showCommitPopup();
      }
    });
    
    this.bindEvent(this.elements.commitCancelBtn, "click", () => this.popoverManager.hideCommitPopup());
    this.bindEvent(this.elements.commitSaveBtn, "click", () => {
      const commitMessage = this.elements.commitMessage?.value.trim();
      this.fileManager.saveChanges(true, commitMessage);
      this.popoverManager.hideCommitPopup();
    });
    
    this.bindEvent(this.elements.searchInput, "input", () => 
      this.searchManager.perform(this.elements.searchInput.value));
    
    this.bindEvent(this.elements.searchInput, "keydown", (e) => {
      if (e.key === "Escape") this.searchManager.close();
      else if (e.key === "Enter" && e.shiftKey) this.searchManager.findPrevious();
      else if (e.key === "Enter") this.searchManager.findNext();
    });
    
    this.bindEvent(this.elements.commitMessage, "keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const commitMessage = this.elements.commitMessage?.value.trim();
        this.fileManager.saveChanges(true, commitMessage);
        this.popoverManager.hideCommitPopup();
      }
    });
    
    document.addEventListener("click", (e) => {
      const newFileButton = document.querySelector('[data-action="new-file"], #newFileButton');
      const dropdown = this.elements.newFileDropdown;
      
      if (dropdown && !dropdown.contains(e.target) && newFileButton && !newFileButton.contains(e.target)) {
        this.popoverManager.hideNewFileDropdown();
      }
      
      if (this.popoverManager.dropdowns.commit && 
          !this.popoverManager.dropdowns.commit.contains(e.target) && 
          !this.elements.editSaveButton.contains(e.target)) {
        this.popoverManager.hideCommitPopup();
      }
      
      if (this.popoverManager.dropdowns.language && 
          !this.popoverManager.dropdowns.language.contains(e.target) && 
          !this.elements.fileExtensionBtn.contains(e.target)) {
        this.popoverManager.hideLanguageDropdown();
      }
      
      if (this.popoverManager.dropdowns.moreOptions && 
          !this.popoverManager.dropdowns.moreOptions.contains(e.target) && 
          !this.elements.moreOptionsBtn.contains(e.target)) {
        this.popoverManager.hideMoreOptionsDropdown();
      }
    });
    
    window.addEventListener("resize", () => {
      if (this.popoverManager.dropdowns.commit && 
          !this.popoverManager.dropdowns.commit.classList.contains("hide")) {
        this.popoverManager.calculateDropdownPosition();
      }
      this.updateHeaderScrollButtons();
    });
  }
  
  bindEvent(element, event, handler) {
    if (!element) return;
    element.addEventListener(event, handler);
  }
  
  setupNewFileButton() {
    const newFileButton = document.querySelector('[data-action="new-file"], #newFileButton');
    
    if (newFileButton) {
      const newButton = newFileButton.cloneNode(true);
      newFileButton.parentNode.replaceChild(newButton, newFileButton);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.popoverManager.showNewFileDropdown(e);
      });
    }
  }
  
  setupCodeMirror() {
    if (!this.fullscreenManager) {
      this.fullscreenManager = new FullscreenManager(".editorContainer");
    }
    
    if (typeof CodeMirror === "undefined") {
      setTimeout(() => this.setupCodeMirror(), 100);
      return;
    }
    
    if (!this.elements.codeMirrorContainer || this.codeMirror) return;
    
    const fontSize = this.stateManager.fontSize;
    const savedTheme = localStorage.getItem("editor_theme");
    const isDark = savedTheme === "dark" || (!savedTheme && document.documentElement.getAttribute("data-theme") === "dark");
    
    this.codeMirror = CodeMirror(this.elements.codeMirrorContainer, {
      value: "",
      mode: "javascript",
      theme: isDark ? "one-dark" : "default",
      lineNumbers: true,
      lineWrapping: this.stateManager.wrapLines,
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
      styleActiveLine: this.stateManager.highlightActiveLine,
      highlightSelectionMatches: { showToken: /\w/ },
      extraKeys: {
        "Ctrl-S": () => { if (this.isEditing) this.popoverManager.showCommitPopup(); },
        "Cmd-S": () => { if (this.isEditing) this.popoverManager.showCommitPopup(); },
        "Ctrl-F": () => this.searchManager.open(),
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
  }
  
  setCodeMirrorMode(langValue) {
    if (!this.codeMirror) return;
    this.codeMirror.setOption("mode", CODEMIRROR_MODES[langValue] || "text");
  }
  
  setupGlobalEventListeners() {
    document.addEventListener("keydown", (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        this.popoverManager.showCommitPopup();
      }
      
      if (e.key === "Escape") {
        if (this.searchManager.active) this.searchManager.close();
        else if (this.fullscreenManager.isActive) this.toggleFullscreen();
        else this.popoverManager.hideCommitPopup();
      }
      
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.searchManager.open();
      }
    });
  }
  
  setupAutoSave() {
    if (this.stateManager.autoSave) {
      this.stateManager.autoSaveInterval = setInterval(() => {
        if (this.isEditing && this.codeMirror && this.codeMirror.getValue() !== this.fileManager.originalContent) {
          this.autoSave();
        }
      }, 30000);
    }
  }
  
  setLanguage(langValue) {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    
    this.stateManager.currentLanguage = langValue;
    
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
    
    this.popoverManager.hideLanguageDropdown();
    this.setCodeMirrorMode(langValue);
  }
  
  detectLanguageFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    
    return "javascript";
  }
  
  showLoadingSpinner() {
    this.elements.loadingSpinner?.setAttribute("data-active", "true");
  }
  
  hideLoadingSpinner() {
    this.elements.loadingSpinner?.setAttribute("data-active", "false");
  }
  
  show() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => this.codeMirror?.refresh(), 50);
  }
  
  hide() {
    this.elements.filePage?.classList.add("hide");
  }
  
  enterEditMode() {
    if (!this.fileManager.currentFile) return;
    
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
  }
  
  exitEditMode() {
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
    
    this.popoverManager.hideCommitPopup();
  }
  
  coderLoading(timer = 1500) {
    this.showLoadingSpinner();
    
    setTimeout(() => {
      this.hideLoadingSpinner();
    }, timer);
  }
  
  updateBreadcrumbs(repoName = null, path = '') {
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
    
    html += `<span class="breadCrumb current">${this.fileManager.currentFile || 'untitled.js'}</span>`;
    
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
  }
  
  updateStats() {
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
  }
  
  updateCursorPosition() {
    if (!this.codeMirror) return;
    
    const cursor = this.codeMirror.getCursor();
    
    if (this.elements.cursorLine) {
      this.elements.cursorLine.textContent = cursor.line + 1;
    }
    
    if (this.elements.cursorCol) {
      this.elements.cursorCol.textContent = cursor.ch + 1;
    }
  }
  
  updateModifiedBadge() {
    if (!this.codeMirror) return;
    
    const isModified = this.codeMirror.getValue() !== this.fileManager.originalContent;
    this.elements.modifiedIndicator?.classList.toggle("hide", !isModified);
  }
  
  updateLastSaved(saved) {
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
  }
  
  updateHeaderScrollButtons() {
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
  }
  
  updateThemeIcon(isDark) {
    if (!this.elements.themeIcon) return;
    
    this.elements.themeIcon.innerHTML = isDark ? AppAssets.icons.moon() : AppAssets.icons.sun();
  }
  
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    this.updateThemeIcon(!isDark);
    this.codeMirror?.setOption("theme", isDark ? "default" : "one-dark");
  }
  
  toggleWrapLines() {
    if (!this.codeMirror) return;
    
    this.stateManager.wrapLines = !this.stateManager.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.stateManager.wrapLines);
    this.elements.wrapBtn?.classList.toggle("active", this.stateManager.wrapLines);
    this.stateManager.saveUserPreferences();
  }
  
  toggleInvisibles() {
    this.stateManager.showInvisibles = !this.stateManager.showInvisibles;
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.stateManager.showInvisibles);
  }
  
  handleNewFileWithRepo() {
    if (typeof window.showCreateFileModal === 'function') {
      window.showCreateFileModal();
    }
    this.popoverManager.hideNewFileDropdown();
  }
  
  handleNewFileWithoutRepo() {
    this.fileManager.createNewStandaloneFile();
    this.popoverManager.hideNewFileDropdown();
  }
  
  toggleFullscreen() {
    this.fullscreenManager.toggle();
    
    setTimeout(() => {
      if (this.codeMirror && typeof this.codeMirror.refresh === 'function') {
        this.codeMirror.refresh();
      }
    }, 100);
  }
  
  copyCode() {
    if (!this.codeMirror) return;
    
    const content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    navigator.clipboard.writeText(content).then(() => {
      if (typeof showSuccessMessage === "function") {
        showSuccessMessage("Copied to clipboard");
      }
    });
  }
  
  downloadFile() {
    if (!this.fileManager.currentFile) return;
    
    const content = this.codeMirror ? this.codeMirror.getValue() : "";
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = this.fileManager.currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  formatCode() {
    if (!this.codeMirror || !this.isEditing) return;
    
    const content = this.codeMirror.getValue();
    try {
      const formatted = JSON.stringify(JSON.parse(content), null, 2);
      this.codeMirror.setValue(formatted);
    } catch (e) {
    }
  }
  
  foldAll() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({
          line: i,
          ch: 0
        }, null, "fold");
      }
    });
  }
  
  unfoldAll() {
    if (!this.codeMirror) return;
    
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({
          line: i,
          ch: 0
        }, null, "unfold");
      }
    });
  }
  
  undo() {
    this.codeMirror?.undo();
  }
  
  redo() {
    this.codeMirror?.redo();
  }
  
  setCodeMirrorFontSize(size) {
    if (!this.codeMirror) return;
    
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.stateManager.fontSize = size;
    
    if (this.elements.fontSizeLabel) {
      this.elements.fontSizeLabel.textContent = `${size}px`;
    }
    
    this.stateManager.saveUserPreferences();
    this.codeMirror.refresh();
  }
  
  adjustFontSize(change) {
    const newSize = Math.max(10, Math.min(24, this.stateManager.fontSize + change));
    if (newSize !== this.stateManager.fontSize) {
      this.setCodeMirrorFontSize(newSize);
    }
  }
  
  scrollHeader(direction) {
    const container = this.elements.headerScrollContainer;
    if (!container) return;
    
    const scrollAmount = 150;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
  
  destroy() {
    if (this.stateManager.autoSaveInterval) {
      clearInterval(this.stateManager.autoSaveInterval);
    }
    
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
    
    this.isInitialized = false;
    
    Object.values(this.popoverManager.dropdowns).forEach(dropdown => {
      if (dropdown) dropdown.remove();
    });
  }
  
  autoSave() {
    this.fileManager.performSave("Auto-saved changes");
  }
}

window.CodeViewEditor = CodeViewEditor;
window.coderViewEdit = new CodeViewEditor();

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) {
    window.coderViewEdit.init();
  }
});