



/*******
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
class coderViewEdit {
  constructor() {
    this.currentFile = null;
    this.fileData = null;
    this.codeMirror = null;
    this.isEditing = false;
    this.isLoading = false;
    this.originalContent = "";
    this.isInitialized = false;
    this.elements = {};
    this.boundEventHandlers = {};
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.state = {
      fontSize: 14,
      wrapLines: false,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
    };
    this.searchActive = false;
    this.lastSaveTime = null;
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
    this.languages = [{
        value: "javascript",
        label: "JavaScript",
        ext: ["js", "jsx"]
      },
      {
        value: "typescript",
        label: "TypeScript",
        ext: ["ts", "tsx"]
      },
      {
        value: "python",
        label: "Python",
        ext: ["py"]
      },
      {
        value: "html",
        label: "HTML",
        ext: ["html", "htm"]
      },
      {
        value: "css",
        label: "CSS",
        ext: ["css", "scss", "less"]
      },
      {
        value: "json",
        label: "JSON",
        ext: ["json"]
      },
      {
        value: "markdown",
        label: "Markdown",
        ext: ["md", "markdown"]
      },
      {
        value: "yaml",
        label: "YAML",
        ext: ["yml", "yaml"]
      },
      {
        value: "xml",
        label: "XML",
        ext: ["xml"]
      },
      {
        value: "sql",
        label: "SQL",
        ext: ["sql"]
      },
      {
        value: "shell",
        label: "Shell",
        ext: ["sh", "bash"]
      },
      {
        value: "ruby",
        label: "Ruby",
        ext: ["rb"]
      },
      {
        value: "go",
        label: "Go",
        ext: ["go"]
      },
      {
        value: "rust",
        label: "Rust",
        ext: ["rs"]
      },
      {
        value: "java",
        label: "Java",
        ext: ["java"]
      },
      {
        value: "cpp",
        label: "C++",
        ext: ["cpp", "c", "h"]
      },
      {
        value: "csharp",
        label: "C#",
        ext: ["cs"]
      },
      {
        value: "php",
        label: "PHP",
        ext: ["php"]
      },
      {
        value: "swift",
        label: "Swift",
        ext: ["swift"]
      },
    ];
    this.currentLanguage = "javascript";
    
    this.fullscreenManager = null;
    
  }
  
  // ===================================================================================================================
  // INITIALIZATION & SETUP
  // ===================================================================================================================

  init() {
    if (this.isInitialized) return;
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) return;
    filePage.innerHTML = AppAssets.templates.editor();
    this.injectPopover();
    this.cacheElements();
    this.bindEvents();
    this.setupEventListeners();
    
    this.fullscreenManager = new FullscreenManager(".editorContainer");

    
    if (typeof CodeMirror !== "undefined") this.setupCodeMirror();
    else setTimeout(() => this.setupCodeMirror(), 100);
    this.loadUserPreferences();
    this.setupAutoSave();
    this.isInitialized = true;
  }

  injectPopover() {
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.commitDropdown());
    this.elements.commitDropdown = document.getElementById("commitDropdown");
  }

  cacheElements() {
    this.elements = {
      ...this.elements,
      filePage: document.querySelector('.pages[data-page="file"]'),
      fileNameDisplay: document.getElementById("fileNameDisplay"),
      modifiedBadge: document.getElementById("modifiedBadge"),
      languageBtn: document.getElementById("languageBtn"),
      languageLabel: document.getElementById("languageLabel"),
      languageDropdown: document.getElementById("languageDropdown"),
      languageList: document.getElementById("languageList"),
      editModeBtn: document.getElementById("editModeBtn"),
      viewModeBtn: document.getElementById("viewModeBtn"),
      undoBtn: document.getElementById("undoBtn"),
      redoBtn: document.getElementById("redoBtn"),
      searchBtn: document.getElementById("searchBtn"),
      wrapBtn: document.getElementById("wrapBtn"),
      copyBtn: document.getElementById("copyBtn"),
      downloadBtn: document.getElementById("downloadBtn"),
      uploadBtn: document.getElementById("uploadBtn"),
      themeBtn: document.getElementById("themeBtn"),
      themeIcon: document.getElementById("themeIcon"),
      fontDecreaseBtn: document.getElementById("fontDecreaseBtn"),
      fontIncreaseBtn: document.getElementById("fontIncreaseBtn"),
      fontSizeLabel: document.getElementById("fontSizeLabel"),
      fullscreenBtn: document.getElementById("fullscreenBtn"),
      fullscreenIcon: document.getElementById("fullscreenIcon"),
      moreOptionsBtn: document.getElementById("moreOptionsBtn"),
      moreOptionsDropdown: document.getElementById("moreOptionsDropdown"),
      formatBtn: document.getElementById("formatBtn"),
      foldAllBtn: document.getElementById("foldAllBtn"),
      unfoldAllBtn: document.getElementById("unfoldAllBtn"),
      showInvisiblesBtn: document.getElementById("showInvisiblesBtn"),
      editorBody: document.getElementById("editorBody"),
      codeMirrorContainer: document.getElementById("codeMirrorContainer"),
      loadingSpinner: document.getElementById("loadingSpinner"),
      searchPanel: document.getElementById("searchPanel"),
      searchInput: document.getElementById("searchInput"),
      searchMatches: document.getElementById("searchMatches"),
      searchPrevBtn: document.getElementById("searchPrevBtn"),
      searchNextBtn: document.getElementById("searchNextBtn"),
      closeSearchBtn: document.getElementById("closeSearchBtn"),
      cursorLine: document.getElementById("cursorLine"),
      cursorCol: document.getElementById("cursorCol"),
      lineCount: document.getElementById("lineCount"),
      charCount: document.getElementById("charCount"),
      fileSize: document.getElementById("fileSize"),
      statusIndicator: document.getElementById("statusIndicator"),
      lastSaved: document.getElementById("lastSaved"),
      languageBadge: document.getElementById("languageBadge"),
      fileUploadInput: document.getElementById("fileUploadInput"),
      editSaveButton: document.getElementById("editSaveButton"),
      editSaveLabel: document.getElementById("editSaveLabel"),
      popoverTitle: document.getElementById("popoverTitle"),
      popoverSubtitle: document.getElementById("popoverSubtitle"),
      commitMessage: document.getElementById("commitMessage"),
      commitCancelBtn: document.getElementById("commitCancelBtn"),
      commitSaveBtn: document.getElementById("commitSaveBtn"),
    };
    this.populateLanguageDropdown();
  }

  bindEvents() {
    this.elements.editModeBtn?.addEventListener("click", () => this.enterEditMode());
    this.elements.viewModeBtn?.addEventListener("click", () => this.exitEditMode());
    this.elements.undoBtn?.addEventListener("click", () => this.undo());
    this.elements.redoBtn?.addEventListener("click", () => this.redo());
    this.elements.searchBtn?.addEventListener("click", () => this.openSearch());
    this.elements.wrapBtn?.addEventListener("click", () => this.toggleWrapLines());
    this.elements.copyBtn?.addEventListener("click", () => this.copyCode());
    this.elements.downloadBtn?.addEventListener("click", () => this.downloadFile());
    this.elements.uploadBtn?.addEventListener("click", () => this.elements.fileUploadInput?.click());
    this.elements.fileUploadInput?.addEventListener("change", (e) => this.handleFileUpload(e));
    this.elements.themeBtn?.addEventListener("click", () => this.toggleTheme());
    this.elements.fontDecreaseBtn?.addEventListener("click", () => this.adjustFontSize(-2));
    this.elements.fontIncreaseBtn?.addEventListener("click", () => this.adjustFontSize(2));
    this.elements.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
    this.elements.formatBtn?.addEventListener("click", () => this.formatCode());
    this.elements.foldAllBtn?.addEventListener("click", () => this.foldAll());
    this.elements.unfoldAllBtn?.addEventListener("click", () => this.unfoldAll());
    this.elements.showInvisiblesBtn?.addEventListener("click", () => this.toggleInvisibles());
    this.elements.searchPrevBtn?.addEventListener("click", () => this.findPrevious());
    this.elements.searchNextBtn?.addEventListener("click", () => this.findNext());
    this.elements.closeSearchBtn?.addEventListener("click", () => this.closeSearch());
    this.elements.searchInput?.addEventListener("input", () => this.performSearch(this.elements.searchInput.value));
    this.elements.searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeSearch();
      else if (e.key === "Enter" && e.shiftKey) this.findPrevious();
      else if (e.key === "Enter") this.findNext();
    });
    this.elements.languageBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.elements.languageDropdown?.classList.toggle("hide");
    });
    this.elements.moreOptionsBtn?.addEventListener("click", (e) => {
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
    this.elements.moreOptionsDropdown?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    this.elements.editSaveButton?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!this.isEditing) {
        this.enterEditMode();
      } else {
        this.showCommitPopup(e);
      }
    });
    this.elements.commitCancelBtn?.addEventListener("click", () => this.hideCommitPopup());
    this.elements.commitSaveBtn?.addEventListener("click", () => this.saveChanges(true));
    this.elements.commitMessage?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.saveChanges(true);
      }
    });
    document.addEventListener("click", (e) => {
      if (this.elements.commitDropdown &&
        !this.elements.commitDropdown.contains(e.target) &&
        !this.elements.editSaveButton.contains(e.target)) {
        this.hideCommitPopup();
      }
      this.elements.languageDropdown?.classList.add("hide");
      this.elements.moreOptionsDropdown?.classList.add("hide");
    });
    document.addEventListener("keydown", (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        this.showCommitPopup();
      }
      if (e.key === "Escape") {
        if (this.searchActive) this.closeSearch();
        else this.hideCommitPopup();
      }
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
    });
    window.addEventListener("resize", () => {
      if (this.elements.commitDropdown && !this.elements.commitDropdown.classList.contains("hide")) {
        this.calculateDropdownPosition();
      }
    });
  }

  setupEventListeners() {
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

    this.elements.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
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
      highlightSelectionMatches: {
        showToken: /\w/
      },
      extraKeys: {
        "Ctrl-S": () => {
          if (this.isEditing) this.showCommitPopup();
        },
        "Cmd-S": () => {
          if (this.isEditing) this.showCommitPopup();
        },
        "Ctrl-F": () => this.openSearch(),
        "Ctrl-/": "toggleComment",
        Tab: "indentMore",
        "Shift-Tab": "indentLess",
      },
    });
    this.elements.fontSizeLabel && (this.elements.fontSizeLabel.textContent = `${fontSize}px`);
    this.updateThemeIcon(isDark);
    this.setCodeMirrorFontSize(fontSize);
    this.codeMirror.on("change", () => {
      this.updateStats();
      this.updateModifiedBadge();
    });
    this.codeMirror.on("cursorActivity", () => this.updateCursorPosition());
  }

  loadUserPreferences() {
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
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

  // ===================================================================================================================
  // UI & DISPLAY
  // ===================================================================================================================

  show() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => this.codeMirror?.refresh(), 50);
  }

  hide() {
    this.elements.filePage?.classList.add("hide");
  }

  toggleFullscreen() {
    this.fullscreenManager.toggle();

    setTimeout(() => {
      if (this.codeMirror && typeof this.codeMirror.refresh === 'function') {
        this.codeMirror.refresh();
      }
    }, 100);
  }

  populateLanguageDropdown() {
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
  }

  updateThemeIcon(isDark) {
    if (!this.elements.themeIcon) return;
    this.elements.themeIcon.innerHTML = isDark ? AppAssets.icons.moon() : AppAssets.icons.sun();
  }

  showCommitPopup(e) {
    if (!this.elements.commitDropdown) return;
    this.elements.commitDropdown.classList.remove("hide");
    this.calculateDropdownPosition();
    if (this.elements.popoverTitle) this.elements.popoverTitle.textContent = "Add Commit & Save";
    if (this.elements.popoverSubtitle) this.elements.popoverSubtitle.textContent = "Enter a commit message before saving";
    if (this.elements.commitMessage) {
      this.elements.commitMessage.value = `Update ${this.currentFile}`;
    }
  }

  hideCommitPopup() {
    if (!this.elements.commitDropdown) return;
    this.elements.commitDropdown.classList.add("hide");
    if (this.elements.commitMessage) this.elements.commitMessage.value = "";
  }

  calculateDropdownPosition() {
    if (!this.elements.editSaveButton || !this.elements.commitDropdown) return;
    const buttonRect = this.elements.editSaveButton.getBoundingClientRect();
    const dropdown = this.elements.commitDropdown;
    const top = buttonRect.bottom + window.scrollY + 8;
    let left = buttonRect.right - dropdown.offsetWidth + window.scrollX;
    if (left < 10) left = 10;
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
  }

  showLoadingSpinner() {
    this.elements.loadingSpinner?.setAttribute("data-active", "true");
  }
  hideLoadingSpinner() {
    this.elements.loadingSpinner?.setAttribute("data-active", "false");
  }

  // ===================================================================================================================
  // STATE & DATA MANAGEMENT
  // ===================================================================================================================

  setLanguage(langValue) {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    this.currentLanguage = langValue;
    this.elements.languageLabel && (this.elements.languageLabel.textContent = lang.label);
    this.elements.languageBadge && (this.elements.languageBadge.innerHTML = AppAssets.icons.code(lang.label));
    this.elements.languageDropdown?.classList.add("hide");
    this.setCodeMirrorMode(langValue);
  }

  setCodeMirrorMode(langValue) {
    if (!this.codeMirror) return;
    const modes = {
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
    this.codeMirror.setOption("mode", modes[langValue] || "text");
  }

  detectLanguageFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    return "javascript";
  }

  updateStats() {
    if (!this.codeMirror) return;
    const content = this.codeMirror.getValue();
    const lines = content.split("\n").length;
    const bytes = new Blob([content]).size;
    let sizeStr = bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    this.elements.lineCount && (this.elements.lineCount.textContent = lines);
    this.elements.charCount && (this.elements.charCount.textContent = content.length.toLocaleString());
    this.elements.fileSize && (this.elements.fileSize.textContent = sizeStr);
  }

  updateCursorPosition() {
    if (!this.codeMirror) return;
    const cursor = this.codeMirror.getCursor();
    this.elements.cursorLine && (this.elements.cursorLine.textContent = cursor.line + 1);
    this.elements.cursorCol && (this.elements.cursorCol.textContent = cursor.ch + 1);
  }

  updateModifiedBadge() {
    if (!this.codeMirror) return;
    this.elements.modifiedBadge?.classList.toggle("hide", this.codeMirror.getValue() === this.originalContent);
  }

  updateLastSaved(saved) {
    if (!this.elements.lastSaved) return;
    if (saved) {
      const now = new Date();
      this.elements.lastSaved.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    else {
      this.elements.lastSaved.textContent = "Never";
    }
  }

  // ===================================================================================================================
  // USER ACTIONS & EVENT HANDLERS
  // ===================================================================================================================

  enterEditMode() {
    if (!this.currentFile) return;
    this.isEditing = true;
    this.elements.editModeBtn?.classList.add("active");
    this.elements.viewModeBtn?.classList.remove("active");
    if (this.elements.editSaveLabel) this.elements.editSaveLabel.textContent = "Save";
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", false);
      this.codeMirror.focus();
    }
  }

  exitEditMode() {
    this.isEditing = false;
    this.elements.editModeBtn?.classList.remove("active");
    this.elements.viewModeBtn?.classList.add("active");
    if (this.elements.editSaveLabel) this.elements.editSaveLabel.textContent = "Edit";
    if (this.codeMirror) this.codeMirror.setOption("readOnly", true);
    this.hideCommitPopup();
  }

  displayFile(filename, fileData) {
    if (!this.isInitialized) this.init();
    this.currentFile = filename;
    this.fileData = fileData;
    this.originalContent = fileData.content || "";
    this.elements.fileNameDisplay && (this.elements.fileNameDisplay.textContent = filename);
    const detectedLang = this.detectLanguageFromExtension(filename);
    this.setLanguage(detectedLang);
    if (!this.codeMirror) {
      this.setupCodeMirror();
      setTimeout(() => {
          if (this.codeMirror) {
            this.codeMirror.setValue(this.originalContent);
            this.codeMirror.refresh();
            this.updateStats();
            this.updateLastSaved(true);
          }
        },
        100);
    }
    else {
      this.codeMirror.setValue(this.originalContent);
      this.codeMirror.refresh();
      this.updateStats();
      this.updateLastSaved(true);
    }
    this.exitEditMode();
    this.updateModifiedBadge();
    this.show();
  }

  performSave(commitMessage) {
    this.showLoadingSpinner();
    setTimeout(() => {
        try {
          const newContent = this.codeMirror ? this.codeMirror.getValue() : "";
          this.fileData.content = newContent;
          this.fileData.lastModified = Date.now();
          this.fileData.lastCommit = commitMessage;
          this.fileData.size = new Blob([newContent]).size;
          const filePath = (window.currentState?.path ? window.currentState.path + "/" : "") + this.currentFile;
          if (typeof LocalStorageManager !== "undefined") LocalStorageManager.saveFile(window.currentState?.repository, filePath, this.fileData);
          this.originalContent = newContent;
          if (typeof showSuccessMessage === "function") showSuccessMessage(`Saved ${this.currentFile}`);
          this.updateLastSaved(true);
          this.updateModifiedBadge();
          this.exitEditMode();
          this.hideLoadingSpinner();
        }
        catch (error) {
          this.hideLoadingSpinner();
          if (typeof showErrorMessage === "function") showErrorMessage(`Save failed: ${error.message}`);
        }
      },
      300);
  }

  saveChanges(withCommit = false) {
    if (!this.currentFile || !this.fileData) return;
    if (withCommit) {
      const commitMessage = this.elements.commitMessage?.value.trim();
      if (!commitMessage) {
        if (typeof showErrorMessage === "function") showErrorMessage("Please enter a commit message");
        return;
      }
      this.hideCommitPopup();
      this.performSave(commitMessage);
    }
    else {
      this.performSave("Saved changes");
    }
  }

  copyCode() {
    if (!this.codeMirror) return;
    const content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    navigator.clipboard.writeText(content).then(() => {
      if (typeof showSuccessMessage === "function") showSuccessMessage("Copied to clipboard");
    });
  }

  downloadFile() {
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
  }

  handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (this.codeMirror) {
        this.codeMirror.setValue(content);
        this.currentFile = file.name;
        this.elements.fileNameDisplay && (this.elements.fileNameDisplay.textContent = file.name);
        this.setLanguage(this.detectLanguageFromExtension(file.name));
        this.originalContent = content;
        this.updateStats();
        this.updateModifiedBadge();
      }
    };
    reader.readAsText(file);
  }

  setCodeMirrorFontSize(size) {
    if (!this.codeMirror) return;
    this.codeMirror.getWrapperElement().style.fontSize = `${size}px`;
    this.state.fontSize = size;
    this.elements.fontSizeLabel && (this.elements.fontSizeLabel.textContent = `${size}px`);
    localStorage.setItem("editor_fontsize", size);
    this.codeMirror.refresh();
  }

  adjustFontSize(change) {
    const newSize = Math.max(10, Math.min(24, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) this.setCodeMirrorFontSize(newSize);
  }

  toggleWrapLines() {
    if (!this.codeMirror) return;
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
  }

  toggleInvisibles() {
    this.state.showInvisibles = !this.state.showInvisibles;
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
  }

  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    this.updateThemeIcon(!isDark);
    this.codeMirror?.setOption("theme", isDark ? "default" : "one-dark");
  }


  foldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) this.codeMirror.foldCode({
        line: i,
        ch: 0
      }, null, "fold");
    });
  }

  unfoldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) this.codeMirror.foldCode({
        line: i,
        ch: 0
      }, null, "unfold");
    });
  }

  formatCode() {
    if (!this.codeMirror || !this.isEditing) return;
    const content = this.codeMirror.getValue();
    try {
      const formatted = JSON.stringify(JSON.parse(content), null, 2);
      this.codeMirror.setValue(formatted);
    }
    catch (e) {}
  }

  undo() {
    this.codeMirror?.undo();
  }
  redo() {
    this.codeMirror?.redo();
  }

  // ===================================================================================================================
  // SEARCH
  // ===================================================================================================================

  openSearch() {
    if (!this.codeMirror) return;
    this.searchActive = true;
    this.elements.searchPanel?.classList.remove("hide");
    setTimeout(() => {
      this.elements.searchInput?.focus();
      this.elements.searchInput?.select();
    }, 50);
  }

  closeSearch() {
    this.searchActive = false;
    this.elements.searchPanel?.classList.add("hide");
    this.clearSearch();
  }

  clearSearch() {
    if (this.elements.searchInput) this.elements.searchInput.value = "";
    this.searchMatches = [];
  }

  performSearch(query) {
    if (!this.codeMirror || !query) return;
    const content = this.codeMirror.getValue();
    const lines = content.split("\n");
    this.searchMatches = [];
    lines.forEach((line, idx) => {
      let pos = 0;
      const lowerLine = line.toLowerCase();
      const lowerQuery = query.toLowerCase();
      while ((pos = lowerLine.indexOf(lowerQuery, pos)) !== -1) {
        this.searchMatches.push({
          line: idx,
          ch: pos,
          length: query.length
        });
        pos += 1;
      }
    });
    if (this.searchMatches.length > 0) this.highlightMatch(0);
  }

  highlightMatch(index) {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    const match = this.searchMatches[index];
    this.codeMirror.setSelection({
      line: match.line,
      ch: match.ch
    }, {
      line: match.line,
      ch: match.ch + match.length
    });
    this.codeMirror.scrollIntoView({
      line: match.line,
      ch: match.ch
    }, 200);
  }

  findNext() {
    if (!this.searchMatches.length) return;
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }

  findPrevious() {
    if (!this.searchMatches.length) return;
    this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchMatches.length) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }

  // ===================================================================================================================
  // LIFECYCLE
  // ===================================================================================================================

  destroy() {
    if (this.state.autoSaveInterval) clearInterval(this.state.autoSaveInterval);
    if (this.codeMirror) this.codeMirror.toTextArea();
    this.isInitialized = false;
    this.elements.commitDropdown?.remove();
  }
}
window.coderViewEdit = new coderViewEdit();
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) window.coderViewEdit.init();
});
********/













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


/**
 *  Languages  &  Modes
 */
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
    
    this.originalContent = "";
    this.languages = SUPPORTED_LANGUAGES;
    this.currentLanguage = "javascript";
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.elements = {};
    this.fullscreenManager = null;
    
    // State management
    this.state = {
      fontSize: 14,
      wrapLines: false,
      showInvisibles: false,
      highlightActiveLine: true,
      autoSave: false,
      autoSaveInterval: null,
    };
    
    // History management
    this.undoHistory = [];
    this.redoHistory = [];
    this.lastCursorPosition = null;
    this.lastSaveTime = null;
    
    this.boundEventHandlers = {};
    
    // Initialize global event listeners
    this.setupGlobalEventListeners();
  }
  
  /* ====================== */
  /* Initialization Methods */
  /* ====================== */
  
  init = function() {
    if (this.isInitialized) return;
    
    const filePage = document.querySelector('.pages[data-page="file"]');
    if (!filePage) return;
    
    filePage.innerHTML = AppAssets.templates.editor();
    this.injectPopover();
    this.cacheElements();
    this.bindElementEvents();
    
    this.fullscreenManager = new FullscreenManager(".editorContainer");
    
    if (typeof CodeMirror !== "undefined") {
      this.setupCodeMirror();
    } else {
      setTimeout(() => this.setupCodeMirror(), 100);
    }
    
    this.loadUserPreferences();
    this.setupAutoSave();
    this.isInitialized = true;
  }.bind(this);
  
  injectPopover = function() {
    document.body.insertAdjacentHTML('beforeend', AppAssets.templates.commitDropdown());
    this.elements.commitDropdown = document.getElementById("commitDropdown");
  }.bind(this);
  
  cacheElements = function() {
    const elementIds = {
      filePage: '.pages[data-page="file"]',
      fileNameDisplay: "fileNameDisplay",
      modifiedBadge: "modifiedBadge",
      languageBtn: "languageBtn",
      languageLabel: "languageLabel",
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
      fileUploadInput: "fileUploadInput",
      editSaveButton: "editSaveButton",
      editSaveLabel: "editSaveLabel",
      popoverTitle: "popoverTitle",
      popoverSubtitle: "popoverSubtitle",
      commitMessage: "commitMessage",
      commitCancelBtn: "commitCancelBtn",
      commitSaveBtn: "commitSaveBtn",
    };
    
    // Cache all elements
    Object.entries(elementIds).forEach(([key, id]) => {
      if (key === "filePage") {
        this.elements[key] = document.querySelector(id);
      } else {
        this.elements[key] = document.getElementById(id);
      }
    });
    
    this.populateLanguageDropdown();
  }.bind(this);
  
  /* ===================== */
  /* Event Handler Methods */
  /* ===================== */
  
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
  
  bindElementEvents = function() {
    // Editor mode controls
    this.bindEvent(this.elements.editModeBtn, "click", () => this.enterEditMode());
    this.bindEvent(this.elements.viewModeBtn, "click", () => this.exitEditMode());
    
    // Editing controls
    this.bindEvent(this.elements.undoBtn, "click", () => this.undo());
    this.bindEvent(this.elements.redoBtn, "click", () => this.redo());
    this.bindEvent(this.elements.formatBtn, "click", () => this.formatCode());
    this.bindEvent(this.elements.foldAllBtn, "click", () => this.foldAll());
    this.bindEvent(this.elements.unfoldAllBtn, "click", () => this.unfoldAll());
    
    // View controls
    this.bindEvent(this.elements.searchBtn, "click", () => this.openSearch());
    this.bindEvent(this.elements.wrapBtn, "click", () => this.toggleWrapLines());
    this.bindEvent(this.elements.copyBtn, "click", () => this.copyCode());
    this.bindEvent(this.elements.downloadBtn, "click", () => this.downloadFile());
    this.bindEvent(this.elements.uploadBtn, "click", () => this.elements.fileUploadInput?.click());
    this.bindEvent(this.elements.themeBtn, "click", () => this.toggleTheme());
    this.bindEvent(this.elements.showInvisiblesBtn, "click", () => this.toggleInvisibles());
    
    // Font size controls
    this.bindEvent(this.elements.fontDecreaseBtn, "click", () => this.adjustFontSize(-2));
    this.bindEvent(this.elements.fontIncreaseBtn, "click", () => this.adjustFontSize(2));
    
    // Fullscreen
    this.bindEvent(this.elements.fullscreenBtn, "click", () => this.toggleFullscreen());
    
    // File upload
    this.bindEvent(this.elements.fileUploadInput, "change", (e) => this.handleFileUpload(e));
    
    // Search controls
    this.bindEvent(this.elements.searchPrevBtn, "click", () => this.findPrevious());
    this.bindEvent(this.elements.searchNextBtn, "click", () => this.findNext());
    this.bindEvent(this.elements.closeSearchBtn, "click", () => this.closeSearch());
    
    // Language dropdown
    this.bindEvent(this.elements.languageBtn, "click", (e) => {
      e.stopPropagation();
      this.elements.languageDropdown?.classList.toggle("hide");
    });
    
    // More options dropdown
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
    
    // Commit/save controls
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
    
    // Search input events
    this.bindEvent(this.elements.searchInput, "input", 
      () => this.performSearch(this.elements.searchInput.value));
    
    this.bindEvent(this.elements.searchInput, "keydown", (e) => {
      if (e.key === "Escape") this.closeSearch();
      else if (e.key === "Enter" && e.shiftKey) this.findPrevious();
      else if (e.key === "Enter") this.findNext();
    });
    
    // Commit message input
    this.bindEvent(this.elements.commitMessage, "keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.saveChanges(true);
      }
    });
    
    // Global click handlers
    document.addEventListener("click", (e) => {
      if (this.elements.commitDropdown &&
        !this.elements.commitDropdown.contains(e.target) &&
        !this.elements.editSaveButton.contains(e.target)) {
        this.hideCommitPopup();
      }
      this.elements.languageDropdown?.classList.add("hide");
      this.elements.moreOptionsDropdown?.classList.add("hide");
    });
    
    // Window resize handler
    window.addEventListener("resize", () => {
      if (this.elements.commitDropdown && !this.elements.commitDropdown.classList.contains("hide")) {
        this.calculateDropdownPosition();
      }
    });
  }.bind(this);
  
  /* ================= */
  /* Editor UI Methods */
  /* ================= */
  
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
    const isDark = savedTheme === "dark" || (!savedTheme && 
      document.documentElement.getAttribute("data-theme") === "dark");
    
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
    
    // CodeMirror event handlers
    this.codeMirror.on("change", () => {
      this.updateStats();
      this.updateModifiedBadge();
    });
    
    this.codeMirror.on("cursorActivity", () => this.updateCursorPosition());
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
  
  /* =================== */
  /* Editor State Methods */
  /* =================== */
  
  loadUserPreferences = function() {
    const wrap = localStorage.getItem("editor_wrapLines");
    if (wrap !== null) {
      this.state.wrapLines = wrap === "true";
      this.codeMirror?.setOption("lineWrapping", this.state.wrapLines);
      this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
    }
  }.bind(this);
  
  setupAutoSave = function() {
    if (this.state.autoSave) {
      this.state.autoSaveInterval = setInterval(() => {
        if (this.isEditing && this.codeMirror && 
            this.codeMirror.getValue() !== this.originalContent) {
          this.autoSave();
        }
      }, 30000);
    }
  }.bind(this);
  
  setLanguage = function(langValue) {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    
    this.currentLanguage = langValue;
    
    if (this.elements.languageLabel) {
      this.elements.languageLabel.textContent = lang.label;
    }
    
    if (this.elements.languageBadge) {
      this.elements.languageBadge.innerHTML = AppAssets.icons.code(lang.label);
    }
    
    this.elements.languageDropdown?.classList.add("hide");
    this.setCodeMirrorMode(langValue);
  }.bind(this);
  
  setCodeMirrorMode = function(langValue) {
    if (!this.codeMirror) return;
    this.codeMirror.setOption("mode", CODEMIRROR_MODES[langValue] || "text");
  }.bind(this);
  
  detectLanguageFromExtension = function(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) return lang.value;
    }
    
    return "javascript";
  }.bind(this);
  
  /* ================== */
  /* File Operations */
  /* ================== */
  
  displayFile = function(filename, fileData) {
    if (!this.isInitialized) this.init();
    
    this.currentFile = filename;
    this.fileData = fileData;
    this.originalContent = fileData.content || "";
    
    if (this.elements.fileNameDisplay) {
      this.elements.fileNameDisplay.textContent = filename;
    }
    
    const detectedLang = this.detectLanguageFromExtension(filename);
    this.setLanguage(detectedLang);
    
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
  }.bind(this);
  
  performSave = function(commitMessage) {
    this.showLoadingSpinner();
    
    setTimeout(() => {
      try {
        const newContent = this.codeMirror ? this.codeMirror.getValue() : "";
        this.fileData.content = newContent;
        this.fileData.lastModified = Date.now();
        this.fileData.lastCommit = commitMessage;
        this.fileData.size = new Blob([newContent]).size;
        
        const filePath = (window.currentState?.path ? 
          window.currentState.path + "/" : "") + this.currentFile;
        
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
        this.hideLoadingSpinner();
      } catch (error) {
        this.hideLoadingSpinner();
        if (typeof showErrorMessage === "function") {
          showErrorMessage(`Save failed: ${error.message}`);
        }
      }
    }, 300);
  }.bind(this);
  
  saveChanges = function(withCommit = false) {
    if (!this.currentFile || !this.fileData) return;
    
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
      const content = event.target?.result;
      if (this.codeMirror) {
        this.codeMirror.setValue(content);
        this.currentFile = file.name;
        
        if (this.elements.fileNameDisplay) {
          this.elements.fileNameDisplay.textContent = file.name;
        }
        
        this.setLanguage(this.detectLanguageFromExtension(file.name));
        this.originalContent = content;
        this.updateStats();
        this.updateModifiedBadge();
      }
    };
    reader.readAsText(file);
  }.bind(this);
  
  /* ================== */
  /* View Control Methods */
  /* ================== */
  
  show = function() {
    this.elements.filePage?.classList.remove("hide");
    setTimeout(() => this.codeMirror?.refresh(), 50);
  }.bind(this);
  
  hide = function() {
    this.elements.filePage?.classList.add("hide");
  }.bind(this);
  
  enterEditMode = function() {
    if (!this.currentFile) return;
    
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
  
  /* ================== */
  /* Editor Content Methods */
  /* ================== */
  
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
      // Not JSON, could add other formatters here
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
  
  /* ================== */
  /* Search Methods */
  /* ================== */
  
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
  }.bind(this);
  
  performSearch = function(query) {
    if (!this.codeMirror || !query) return;
    
    const content = this.codeMirror.getValue();
    const lines = content.split("\n");
    this.searchMatches = [];
    
    lines.forEach((line, idx) => {
      let pos = 0;
      const lowerLine = line.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      while ((pos = lowerLine.indexOf(lowerQuery, pos)) !== -1) {
        this.searchMatches.push({
          line: idx,
          ch: pos,
          length: query.length
        });
        pos += 1;
      }
    });
    
    if (this.searchMatches.length > 0) {
      this.highlightMatch(0);
    }
  }.bind(this);
  
  findPrevious = function() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchMatches.length) % 
      this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }.bind(this);
  
  findNext = function() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }.bind(this);
  
  highlightMatch = function(index) {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    
    const match = this.searchMatches[index];
    this.codeMirror.setSelection({
      line: match.line,
      ch: match.ch
    }, {
      line: match.line,
      ch: match.ch + match.length
    });
    
    this.codeMirror.scrollIntoView({
      line: match.line,
      ch: match.ch
    }, 200);
  }.bind(this);
  
  /* ================== */
  /* Editor Settings Methods */
  /* ================== */
  
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
    
    this.elements.themeIcon.innerHTML = isDark ? 
      AppAssets.icons.moon() : 
      AppAssets.icons.sun();
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
  
  /* ================== */
  /* Status Update Methods */
  /* ================== */
  
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
    
    this.elements.modifiedBadge?.classList.toggle("hide", 
      this.codeMirror.getValue() === this.originalContent);
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
  
  /* ================== */
  /* Utility Methods */
  /* ================== */
  
  bindEvent = function(element, event, handler) {
    if (!element) return;
    element.addEventListener(event, handler);
  }.bind(this);
  
  showLoadingSpinner = function() {
    this.elements.loadingSpinner?.setAttribute("data-active", "true");
  }.bind(this);
  
  hideLoadingSpinner = function() {
    this.elements.loadingSpinner?.setAttribute("data-active", "false");
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
  }.bind(this);
}

window.CodeViewEditor = CodeViewEditor;
window.coderViewEdit = new CodeViewEditor();

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) {
    window.coderViewEdit.init();
  }
});