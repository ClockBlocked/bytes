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
    this.currentSearchIndex = 0;
    this.searchMatches = [];
    this.state = {
      fontSize: 10,
      wrapLines: false,
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
    filePage.innerHTML = AppAssets.templates.coderContainer();
    this.cacheElements();
    this.bindEvents();
    if (typeof CodeMirror !== "undefined") this.setupCodeMirror();
    else setTimeout(() => this.setupCodeMirror(), 100);
    this.loadUserPreferences();
    this.setupAutoSave();
    this.isInitialized = true;
  }

  cacheElements() {
    this.elements = {
      filePage: document.querySelector('.pages[data-page="file"]'),
      fileNameInput: document.querySelector('#fileName input') || document.getElementById("fileNameInput"),
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
      loadingSpinner: document.getElementById("loadingSpinner"),
      searchPanel: document.getElementById("searchPanel"),
      searchInput: document.getElementById("searchInput"),
      searchMatches: document.getElementById("searchMatches"),
      searchNextBtn: document.getElementById("searchNextBtn"),
      searchPrevBtn: document.getElementById("searchPrevBtn"),
      closeSearchBtn: document.getElementById("closeSearchBtn")
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
    this.elements.editSaveIcon.innerHTML = AppAssets.icons.save;
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
    this.elements.editSaveIcon.innerHTML = AppAssets.icons.edit;
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
    this.elements.themeIcon.innerHTML = isDark ? AppAssets.icons.moon : AppAssets.icons.sun;
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
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML = AppAssets.icons.fullscreenExit);
    } else {
      this.elements.coderWrapper.classList.remove("fullscreen");
      document.body.style.overflow = "";
      this.elements.fullscreenIcon && (this.elements.fullscreenIcon.innerHTML = AppAssets.icons.fullscreen);
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

  openSearch() {
    if (!this.codeMirror) return;
    
    this.searchActive = true;
    if (this.elements.searchPanel) {
      this.elements.searchPanel.classList.remove("hide");
    }
    
    if (this.elements.searchInput) {
      setTimeout(() => {
        this.elements.searchInput.focus();
        this.elements.searchInput.select();
      }, 50);
    }
    
    this.setupSearchListeners();
  }

  setupSearchListeners() {
    if (!this.elements.searchInput) return;
    
    const handleSearch = () => {
      const query = this.elements.searchInput.value;
      if (!query) {
        this.clearSearch();
        return;
      }
      this.performSearch(query);
    };
    
    this.boundEventHandlers.handleSearch = handleSearch;
    this.boundEventHandlers.searchKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeSearch();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        this.findPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.findNext();
      }
    };
    
    this.elements.searchInput.addEventListener('input', this.boundEventHandlers.handleSearch);
    this.elements.searchInput.addEventListener('keydown', this.boundEventHandlers.searchKeydown);
    
    if (this.elements.searchNextBtn) {
      this.elements.searchNextBtn.addEventListener('click', () => this.findNext());
    }
    if (this.elements.searchPrevBtn) {
      this.elements.searchPrevBtn.addEventListener('click', () => this.findPrevious());
    }
    if (this.elements.closeSearchBtn) {
      this.elements.closeSearchBtn.addEventListener('click', () => this.closeSearch());
    }
  }

  closeSearch() {
    this.searchActive = false;
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
    this.searchMatches = [];
    this.currentSearchIndex = 0;
    
    if (this.codeMirror) {
      this.codeMirror.clearSearch?.();
    }
  }

  performSearch(query) {
    if (!this.codeMirror || !query) return;
    
    const content = this.codeMirror.getValue();
    const lines = content.split('\n');
    this.searchMatches = [];
    
    lines.forEach((line, lineIndex) => {
      let pos = 0;
      while ((pos = line.indexOf(query, pos)) !== -1) {
        this.searchMatches.push({
          line: lineIndex,
          ch: pos,
          length: query.length
        });
        pos += 1;
      }
    });
    
    this.currentSearchIndex = 0;
    
    if (this.elements.searchMatches) {
      if (this.searchMatches.length > 0) {
        this.elements.searchMatches.textContent = `1/${this.searchMatches.length}`;
        this.highlightMatch(0);
      } else {
        this.elements.searchMatches.textContent = `0/0`;
      }
    }
  }

  highlightMatch(index) {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    
    const match = this.searchMatches[index];
    this.codeMirror.setSelection(
      { line: match.line, ch: match.ch },
      { line: match.line, ch: match.ch + match.length }
    );
    
    this.codeMirror.scrollIntoView(
      { line: match.line, ch: match.ch },
      200
    );
    
    if (this.elements.searchMatches) {
      this.elements.searchMatches.textContent = `${index + 1}/${this.searchMatches.length}`;
    }
  }

  findNext() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }

  findPrevious() {
    if (this.searchMatches.length === 0) return;
    
    this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchMatches.length) % this.searchMatches.length;
    this.highlightMatch(this.currentSearchIndex);
  }
}

window.coderViewEdit = new coderViewEdit();
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) window.coderViewEdit.init();
});