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
    this.languages = [
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
    this.currentLanguage = "javascript";
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
<div class="editorContainer">
  <div class="editorToolbar">
    <div class="toolbarLeft">
      <div class="toolbarItem">
        <svg class="toolbarIcon" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5Zm7.5-.188V4.25c0 .138.112.25.25.25h2.688l-2.938-2.938ZM5.72 6.72a.75.75 0 0 0 0 1.06l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06l-2-2a.75.75 0 0 0-1.06 0ZM3.28 7.78a.75.75 0 0 0-1.06-1.06l-2 2a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06L1.81 9.25l1.47-1.47Z"/>
        </svg>
        <span id="fileNameDisplay" class="fileName">untitled.js</span>
        <span id="modifiedBadge" class="badge badgeSecondary hide">Modified</span>
      </div>
      <div class="toolbarSeparator"></div>
      <div class="languageSelector">
        <button id="languageBtn" class="toolbarButton languageBtn">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm5.03 3.47-3.5 3.5a.75.75 0 0 0 1.06 1.06l3.5-3.5a.75.75 0 0 0-1.06-1.06Zm2.44 0a.75.75 0 0 0 0 1.06l3.5 3.5a.75.75 0 0 0 1.06-1.06l3.5-3.5a.75.75 0 0 0-1.06 0Z"/>
          </svg>
          <span id="languageLabel">JavaScript</span>
          <svg class="chevronIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 10.896 2H4.604a.25.25 0 0 0-.177.427Z"/>
          </svg>
        </button>
        <div id="languageDropdown" class="dropdown hide">
          <div class="dropdownContent" id="languageList"></div>
        </div>
      </div>
    </div>
  <div class="toolbarRight">
      <div class="dropdown-trigger">
        <button id="editSaveButton" class="trigger-button" aria-haspopup="true" aria-expanded="false">
          <span id="editSaveLabel">Edit</span>
          <span class="btn-divider">|</span>
          <span class="more-btn">
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
              <path fill="currentColor" d="M207.5 103c9.4-9.4 24.6-9.4 33.9 0l200 200c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-183-183-183 183c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l200-200z"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Dropdown Menu placed outside of constrained containers -->
  <div id="commitDropdown" class="dropdown-menu hide" role="menu">
    <div class="dropdown-header">
      <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32">
        <path fill="currentColor" d="M64 48l112 0 0 88c0 39.8 32.2 72 72 72l88 0 0 240c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16zM224 67.9l92.1 92.1-68.1 0c-13.3 0-24-10.7-24-24l0-68.1zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-261.5c0-17-6.7-33.3-18.7-45.3L242.7 18.7C230.7 6.7 214.5 0 197.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/>
      </svg>
      <div class="save-info">
        <h4 class="save-title" id="popoverTitle">Add Commit & Save</h4>
        <p class="save-subtitle" id="popoverSubtitle">Enter a commit message before saving</p>
      </div>
    </div>
    
    <div class="commit-form">
      <div class="commit-input-group">
        <label for="commitMessage" class="commit-label">Commit Message</label>
        <textarea 
          id="commitMessage" 
          class="commit-textarea" 
          placeholder="Describe what you changed..."
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button id="commitCancelBtn" class="btn btn-secondary">Cancel</button>
        <button id="commitSaveBtn" class="btn btn-primary">Save Changes</button>
      </div>
    </div>
  
  
  
  
  <div class="editorCard">
    <div class="editorHeader">
      <div class="editorHeaderLeft">
        <button id="editModeBtn" class="headerButton active" title="Edit Mode">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
          </svg>
        </button>
        <button id="viewModeBtn" class="headerButton" title="View Mode">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.831.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
          </svg>
        </button>
        <div class="headerSeparator"></div>
        <button id="undoBtn" class="headerButton" title="Undo (Ctrl+Z)">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M2.5 5.724V2.75a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h5a.75.75 0 0 1 0-1.5H3.534L6.41 4.086A5.25 5.25 0 1 1 2.75 10.25a.75.75 0 0 0-1.5 0A6.75 6.75 0 1 0 7.058 2.85L2.5 5.724Z"/>
          </svg>
        </button>
        <button id="redoBtn" class="headerButton" title="Redo (Ctrl+Y)">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M13.5 5.724V2.75a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h3.216L9.59 4.086A5.25 5.25 0 1 0 13.25 10.25a.75.75 0 0 1 1.5 0A6.75 6.75 0 1 1 8.942 2.85l4.558 2.874Z"/>
          </svg>
        </button>
        <div class="headerSeparator"></div>
        <button id="searchBtn" class="headerButton" title="Search (Ctrl+F)">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
          </svg>
        </button>
        <button id="wrapBtn" class="headerButton" title="Toggle Word Wrap">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M2.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 14H2.75A1.75 1.75 0 0 1 1 12.25v-8.5A1.75 1.75 0 0 1 2.75 2Zm-9.5 5h3.75a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"/>
          </svg>
        </button>
        <div class="headerSeparator"></div>
        <button id="copyBtn" class="headerButton" title="Copy Code">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25ZM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
          </svg>
        </button>
        <button id="downloadBtn" class="headerButton" title="Download File">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm-1-6a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 1.75 8Z"/>
            <path d="M8 .75a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.5A.75.75 0 0 1 8 .75Z"/>
          </svg>
        </button>
        <button id="uploadBtn" class="headerButton" title="Upload File">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"/>
            <path d="M8.75 1.75V8.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75a.75.75 0 0 1 1.5 0Z" transform="rotate(180 8 5.5)"/>
          </svg>
        </button>
      </div>
      <div class="editorHeaderCenter"></div>
      <div class="editorHeaderRight">
        <button id="themeBtn" class="headerButton" title="Toggle Theme">
          <svg id="themeIcon" class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Zm-9.193-9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Z"/>
          </svg>
        </button>
        <div class="fontSizeControl">
          <button id="fontDecreaseBtn" class="fontBtn" title="Decrease Font Size">
            <svg class="tinyIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
              <path d="M2 7.75A.75.75 0 0 1 2.75 7h10a.75.75 0 0 1 0 1.5h-10A.75.75 0 0 1 2 7.75Z"/>
            </svg>
          </button>
          <span id="fontSizeLabel" class="fontSizeLabel">14px</span>
          <button id="fontIncreaseBtn" class="fontBtn" title="Increase Font Size">
            <svg class="tinyIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
              <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/>
            </svg>
          </button>
        </div>
        <button id="fullscreenBtn" class="headerButton" title="Toggle Fullscreen">
          <svg id="fullscreenIcon" class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M1.75 10a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 1 13.25v-2.5a.75.75 0 0 1 .75-.75Zm12.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 13.25 15h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75ZM2.75 1a1.75 1.75 0 0 0-1.75 1.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .25-.25h2.5a.75.75 0 0 0 0-1.5Zm8 0a.75.75 0 0 0 0 1.5h2.5a.25.25 0 0 1 .25.25v2.5a.75.75 0 0 0 1.5 0v-2.5A1.75 1.75 0 0 0 13.25 1Z"/>
          </svg>
        </button>
        <button id="moreOptionsBtn" class="headerButton" title="More Options">
          <svg class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
          </svg>
        </button>
        <div id="moreOptionsDropdown" class="dropdown dropdownRight hide">
          <div class="dropdownContent">
            <button class="dropdownItem" id="formatBtn">
              <svg class="dropdownIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
              </svg>
              Format Document
            </button>
            <button class="dropdownItem" id="foldAllBtn">
              <svg class="dropdownIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75ZM9.78 7.22a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L8.19 7.75 6.47 6.03a.75.75 0 0 1 1.06-1.06l2.25 2.25Z"/>
              </svg>
              Fold All
            </button>
            <button class="dropdownItem" id="unfoldAllBtn">
              <svg class="dropdownIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M5.427 2.573a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H6.354v2.208a.75.75 0 0 1-1.5 0V5.896H2.75a.25.25 0 0 1-.177-.427l2.854-2.896Zm5.146 10.854a.25.25 0 0 1-.354 0l-2.896-2.896a.25.25 0 0 1 .177-.427h2.146V7.896a.75.75 0 0 1 1.5 0v2.208h2.104a.25.25 0 0 1 .177.427Z"/>
              </svg>
              Unfold All
            </button>
            <div class="dropdownDivider"></div>
            <button class="dropdownItem" id="showInvisiblesBtn">
              <svg class="dropdownIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M2.75 4.5a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v6.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 12.25v-6.5A1.75 1.75 0 0 1 2.75 3Z"/>
              </svg>
              Show Invisibles
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="editorBody" class="editorBody">
      <div id="loadingSpinner" class="loadingSpinner" data-active="false">
        <div class="spinnerContainer">
          <svg class="spinnerSvg" viewBox="0 0 50 50">
            <circle class="spinnerTrack" cx="25" cy="25" r="20"></circle>
            <circle class="spinnerHead" cx="25" cy="25" r="20"></circle>
          </svg>
        </div>
      </div>
      <div id="codeMirrorContainer" class="codeMirrorContainer"></div>
      <div id="searchPanel" class="searchPanel hide">
        <div class="searchContainer">
          <input type="text" id="searchInput" class="searchInput" placeholder="Search..." autocomplete="off" spellcheck="false" />
          <div class="searchActions">
            <span id="searchMatches" class="searchCount">0/0</span>
            <button id="searchPrevBtn" class="searchNavBtn" title="Previous">
              <svg class="tinyIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"/>
              </svg>
            </button>
            <button id="searchNextBtn" class="searchNavBtn" title="Next">
              <svg class="tinyIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"/>
              </svg>
            </button>
            <button id="closeSearchBtn" class="searchNavBtn" title="Close">
              <svg class="tinyIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="editorFooter">
      <div class="editorFooterLeft">
        <div class="footerItem">
          <span class="footerLabel">Ln</span>
          <span id="cursorLine" class="footerValue">1</span>
          <span class="footerLabel">,</span>
          <span class="footerLabel">Col</span>
          <span id="cursorCol" class="footerValue">1</span>
        </div>
        <div class="footerDivider"></div>
        <div class="footerItem">
          <span id="lineCount" class="footerValue">0</span>
          <span class="footerLabel">lines</span>
          <span class="footerBullet">•</span>
          <span id="charCount" class="footerValue">0</span>
          <span class="footerLabel">chars</span>
        </div>
        <div class="footerDivider"></div>
        <div class="footerItem">
          <svg class="footerIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 9.5Zm0 8a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 11.5Z"/>
          </svg>
          <span id="fileSize" class="footerValue">0 B</span>
        </div>
      </div>
      <div class="editorFooterCenter">
        <div id="statusIndicator" class="statusIndicator statusOk">
          <svg class="statusIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
          </svg>
          <span>No Issues</span>
        </div>
      </div>
      <div class="editorFooterRight">
        <div class="footerItem">
          <svg class="footerIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.556 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
          </svg>
          <span id="lastSaved" class="footerValue">Never</span>
        </div>
        <div class="footerDivider"></div>
        <span class="footerBadge">UTF-8</span>
        <span class="footerBadge">LF</span>
        <span class="footerBadge">Spaces:  2</span>
        <span id="languageBadge" class="footerBadge footerBadgeAccent">
          <svg class="badgeIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
          </svg>
          JavaScript
        </span>
      </div>
    </div>
  </div>
  <input type="file" id="fileUploadInput" class="hide" accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt,.yml,.yaml,.xml,.sql,.sh,.rb,.go,.rs,.java,.cpp,.c,.h,.cs,.php,.swift" />
</div>
    `;
  }

  cacheElements() {
    this.elements = {
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
      
      commitDropdown: document.getElementById("commitDropdown"),
    };
    this.populateLanguageDropdown();
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


//////////////////////////////////////////////////
////////////////////////////  S E T U P //////////
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
      this.elements.moreOptionsDropdown?.classList.toggle("hide");
    });


//    this.elements.editSaveButton?.addEventListener("click", () => this.handleEditSaveClick());
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
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        this.saveChanges(true);
      }
    });



/**
 * 
 *    document.addEventListener("click", (e) => {
      if (!this.elements.editSaveButton?.contains(e.target)) {
        this.hideCommitPopup();
      }
      this.elements.languageDropdown?.classList.add("hide");
      this.elements.moreOptionsDropdown?.classList.add("hide");
    });
 **/   
    
// Update document click handler to close dropdown when clicking outside:
document.addEventListener("click", (e) => {
  if (this.elements.editSaveButton && 
      !this.elements.editSaveButton.contains(e.target) &&
      this.elements.commitDropdown &&
      !this.elements.commitDropdown.contains(e.target)) {
    this.hideCommitPopup();
  }
  this.elements.languageDropdown?.classList.add("hide");
  this.elements.moreOptionsDropdown?.classList.add("hide");
});
    

    document.addEventListener("keydown", (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s" && this.isEditing) {
        e.preventDefault();
        if (this.isEditing) {
          this.showCommitPopup();
        }
      }
      if (e.key === "Escape") {
        if (this.searchActive) this.closeSearch();
        else if (this.isFullscreen) this.toggleFullscreen();
        else this.hideCommitPopup();
      }
      if (ctrl && e.key === "f") {
        e.preventDefault();
        this.openSearch();
      }
      if (ctrl && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        this.adjustFontSize(2);
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        this.adjustFontSize(-2);
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        this.setCodeMirrorFontSize(14);
      }
      if (e.key === "F11") {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });

    window.addEventListener("beforeunload", (e) => {
      if (this.isEditing && this.codeMirror && this.codeMirror.getValue() !== this.originalContent) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }
  handleEditSaveClick() {
    if (!this.isEditing) {
      this.enterEditMode();
    } else {
      this.showCommitPopup();
    }
  }



// New position calculation method:
calculateDropdownPosition() {
  if (!this.elements.editSaveButton || !this.elements.commitDropdown) return;
  
  const buttonRect = this.elements.editSaveButton.getBoundingClientRect();
  const dropdown = this.elements.commitDropdown;
  
  // Position dropdown below the button
  dropdown.style.position = "fixed";
  dropdown.style.left = `${buttonRect.left}px`;
  dropdown.style.top = `${buttonRect.bottom + 8}px`;
  dropdown.style.zIndex = "10000";
}

// Updated showCommitPopup method:
showCommitPopup(e) {
  if (!this.elements.commitDropdown) return;
  
  this.calculateDropdownPosition();
  
  this.elements.commitDropdown.classList.remove("hide");
  this.elements.commitDropdown.style.display = "block";
  
  if (this.elements.popoverTitle) {
    this.elements.popoverTitle.textContent = "Add Commit & Save";
  }
  if (this.elements.popoverSubtitle) {
    this.elements.popoverSubtitle.textContent = "Enter a commit message before saving";
  }
  if (this.elements.commitMessage) {
    this.elements.commitMessage.value = `Update ${this.currentFile}`;
    setTimeout(() => this.elements.commitMessage?.focus(), 10);
  }
}

// Updated hideCommitPopup method:
hideCommitPopup() {
  if (!this.elements.commitDropdown) return;
  
  this.elements.commitDropdown.classList.add("hide");
  this.elements.commitDropdown.style.display = "none";
  
  if (this.elements.commitMessage) {
    this.elements.commitMessage.value = "";
  }
}


// Add resize handler to reposition dropdown on window resize:
window.addEventListener("resize", () => {
  if (this.elements.commitDropdown && !this.elements.commitDropdown.classList.contains("hide")) {
    this.calculateDropdownPosition();
  }
});


/**
  showCommitPopup() {
    const dropdown = this.elements.editSaveButton?.parentElement?.querySelector(".dropdown-menu");
    if (!dropdown) return;

    dropdown.classList.remove("hide");
    dropdown.style.display = "block";

    if (this.elements.popoverTitle) {
      this.elements.popoverTitle.textContent = "Add Commit & Save";
    }
    if (this.elements.popoverSubtitle) {
      this.elements.popoverSubtitle.textContent = "Enter a commit message before saving";
    }
    if (this.elements.commitMessage) {
      this.elements.commitMessage.value = `Update ${this.currentFile}`;
      setTimeout(() => this.elements.commitMessage?.focus(), 10);
    }
  }
  hideCommitPopup() {
    const dropdown = this.elements.editSaveButton?.parentElement?.querySelector(".dropdown-menu");
    if (!dropdown) return;

    dropdown.classList.add("hide");
    dropdown.style.display = "none";

    if (this.elements.commitMessage) {
      this.elements.commitMessage.value = "";
    }
  }
**/
  setupCodeMirror() {
    if (typeof CodeMirror === "undefined") {
      setTimeout(() => this.setupCodeMirror(), 100);
      return;
    }
    if (!this.elements.codeMirrorContainer || this.codeMirror) return;
    const fontSize = parseInt(localStorage.getItem("editor_fontsize")) || 14;
    const savedTheme = localStorage.getItem("editor_theme");
    const isDark =
      savedTheme === "dark" || (!savedTheme && document.documentElement.getAttribute("data-theme") === "dark");
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
    const invisibles = localStorage.getItem("editor_showInvisibles");
    if (invisibles !== null) {
      this.state.showInvisibles = invisibles === "true";
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
    this.elements.fontSizeLabel && (this.elements.fontSizeLabel.textContent = `${size}px`);
    localStorage.setItem("editor_fontsize", size);
    this.codeMirror.refresh();
  }
  setLanguage(langValue) {
    const lang = this.languages.find((l) => l.value === langValue);
    if (!lang) return;
    this.currentLanguage = langValue;
    this.elements.languageLabel && (this.elements.languageLabel.textContent = lang.label);
    this.elements.languageBadge &&
      (this.elements.languageBadge.innerHTML = `
      <svg class="badgeIcon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
        <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
      </svg>
      ${lang.label}
    `);
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
    const mode = modes[langValue] || "text";
    this.codeMirror.setOption("mode", mode);
  }

  detectLanguageFromExtension(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    for (const lang of this.languages) {
      if (lang.ext.includes(ext)) {
        return lang.value;
      }
    }
    return "javascript";
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
    if (this.codeMirror) {
      this.codeMirror.setOption("readOnly", true);
    }
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
    setTimeout(() => this.codeMirror?.refresh(), 200);
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
      if (typeof LocalStorageManager !== "undefined")
        LocalStorageManager.saveFile(window.currentState?.repository, filePath, this.fileData);
      this.originalContent = newContent;
      this.updateLastSaved(true);
      this.updateModifiedBadge();
    } catch (error) {}
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
        if (typeof LocalStorageManager !== "undefined")
          LocalStorageManager.saveFile(window.currentState?.repository, filePath, this.fileData);
        this.originalContent = newContent;
        if (typeof showSuccessMessage === "function") showSuccessMessage(`Saved ${this.currentFile}`);
        this.updateLastSaved(true);
        this.updateModifiedBadge();
        this.exitEditMode();
        this.hideLoadingSpinner();
      } catch (error) {
        this.hideLoadingSpinner();
        if (typeof showErrorMessage === "function") showErrorMessage(`Save failed: ${error.message}`);
      }
    }, 300);
  }

  
  
//////////////////////////////////////////////////
////////////////////////////  Actions  ///////////
  cancelEdit() {
    if (!this.codeMirror) return;
    if (this.codeMirror.getValue() !== this.originalContent && !confirm("Discard unsaved changes?")) return;
    this.codeMirror.setValue(this.originalContent);
    this.updateStats();
    this.exitEditMode();
    this.updateModifiedBadge();
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
    } else {
      this.performSave("Saved changes");
    }
  }
  copyCode() {
    if (!this.codeMirror) return;
    const content = this.codeMirror.getSelection() || this.codeMirror.getValue();
    navigator.clipboard
      .writeText(content)
      .then(() => {
        if (typeof showSuccessMessage === "function") showSuccessMessage("Copied to clipboard");
      })
      .catch(() => {
        if (typeof showErrorMessage === "function") showErrorMessage("Failed to copy");
      });
  }
  downloadFile() {
    if (!this.currentFile) return;
    const content = this.codeMirror ? this.codeMirror.getValue() : "";
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
        const detectedLang = this.detectLanguageFromExtension(file.name);
        this.setLanguage(detectedLang);
        this.originalContent = content;
        this.updateStats();
        this.updateModifiedBadge();
        if (typeof showSuccessMessage === "function") showSuccessMessage(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }


  adjustFontSize(change) {
    const newSize = Math.max(10, Math.min(24, this.state.fontSize + change));
    if (newSize !== this.state.fontSize) this.setCodeMirrorFontSize(newSize);
  }
  
  
  
//////////////////////////////////////////////////
////////////////////////////  Updates ////////////
  updateThemeIcon(isDark) {
    if (!this.elements.themeIcon) return;
    this.elements.themeIcon.innerHTML = isDark
      ? '<path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"/>'
      : '<path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Zm-9.193-9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Z"/>';
  }
  updateStats() {
    if (!this.codeMirror) return;
    const content = this.codeMirror.getValue();
    const lines = content.split("\n").length;
    const chars = content.length;
    const bytes = new Blob([content]).size;
    let sizeStr =
      bytes < 1024
        ? `${bytes} B`
        : bytes < 1024 * 1024
          ? `${(bytes / 1024).toFixed(1)} KB`
          : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    this.elements.lineCount && (this.elements.lineCount.textContent = lines);
    this.elements.charCount && (this.elements.charCount.textContent = chars.toLocaleString());
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
    const isModified = this.codeMirror.getValue() !== this.originalContent;
    this.elements.modifiedBadge?.classList.toggle("hide", !isModified);
  }
  updateLastSaved(saved) {
    if (!this.elements.lastSaved) return;
    if (saved) {
      const now = new Date();
      this.lastSaveTime = now;
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      this.elements.lastSaved.textContent = timeStr;
    } else {
      this.elements.lastSaved.textContent = "Never";
    }
  }



//////////////////////////////////////////////////
////////////////////////////  Find & Replace /////
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
    this.codeMirror?.focus();
  }
  clearSearch() {
    if (this.elements.searchInput) this.elements.searchInput.value = "";
    if (this.elements.searchMatches) this.elements.searchMatches.textContent = "0/0";
    this.searchMatches = [];
    this.currentSearchIndex = 0;
  }

  performSearch(query) {
    if (!this.codeMirror || !query) {
      if (this.elements.searchMatches) this.elements.searchMatches.textContent = "0/0";
      this.searchMatches = [];
      return;
    }
    const content = this.codeMirror.getValue();
    const lines = content.split("\n");
    this.searchMatches = [];
    lines.forEach((line, lineIndex) => {
      let pos = 0;
      const lowerLine = line.toLowerCase();
      const lowerQuery = query.toLowerCase();
      while ((pos = lowerLine.indexOf(lowerQuery, pos)) !== -1) {
        this.searchMatches.push({ line: lineIndex, ch: pos, length: query.length });
        pos += 1;
      }
    });
    this.currentSearchIndex = 0;
    if (this.elements.searchMatches) {
      if (this.searchMatches.length > 0) {
        this.elements.searchMatches.textContent = `1/${this.searchMatches.length}`;
        this.highlightMatch(0);
      } else {
        this.elements.searchMatches.textContent = "0/0";
      }
    }
  }

  highlightMatch(index) {
    if (!this.codeMirror || index < 0 || index >= this.searchMatches.length) return;
    const match = this.searchMatches[index];
    this.codeMirror.setSelection({ line: match.line, ch: match.ch }, { line: match.line, ch: match.ch + match.length });
    this.codeMirror.scrollIntoView({ line: match.line, ch: match.ch }, 200);
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


  toggleWrapLines() {
    if (!this.codeMirror) return;
    this.state.wrapLines = !this.state.wrapLines;
    this.codeMirror.setOption("lineWrapping", this.state.wrapLines);
    localStorage.setItem("editor_wrapLines", this.state.wrapLines);
    this.elements.wrapBtn?.classList.toggle("active", this.state.wrapLines);
  }
  toggleInvisibles() {
    if (!this.codeMirror) return;
    this.state.showInvisibles = !this.state.showInvisibles;
    localStorage.setItem("editor_showInvisibles", this.state.showInvisibles);
    this.elements.showInvisiblesBtn?.classList.toggle("active", this.state.showInvisibles);
    this.elements.moreOptionsDropdown?.classList.add("hide");
  }
  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("editor_theme", newTheme);
    this.updateThemeIcon(!isDark);
    this.codeMirror?.setOption("theme", isDark ? "default" : "one-dark");
  }
  toggleFullscreen() {
    if (!this.elements.editorBody) return;
    this.isFullscreen = !this.isFullscreen;
    const container = document.querySelector(".editorContainer");
    if (this.isFullscreen) {
      container?.classList.add("fullscreen");
      document.body.style.overflow = "hidden";
      this.elements.fullscreenIcon &&
        (this.elements.fullscreenIcon.innerHTML =
          '<path d="M5.5 2.75A.75.75 0 0 0 4.75 2h-1.5A1.75 1.75 0 0 0 1.5 3.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.25.25 0 0 1 .25-.25h1.5a.75.75 0 0 0 .75-.75Zm5 0a.75.75 0 0 0 .75.75h1.5a.25.25 0 0 1 .25.25v1.5a.75.75 0 0 0 1.5 0v-1.5A1.75 1.75 0 0 0 12.75 2h-1.5a.75.75 0 0 0-.75.75Zm5 10.5a.75.75 0 0 0-.75-.75h-1.5a.25.25 0 0 1-.25-.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 0 0 .75-.75Zm-10.5 0a.75.75 0 0 0 .75-.75v-1.5a.25.25 0 0 1 .25-.25h1.5a.75.75 0 0 0 0-1.5h-1.5A1.75 1.75 0 0 0 1.5 10.75v1.5a.75.75 0 0 0 .75.75Z"/>');
    } else {
      container?.classList.remove("fullscreen");
      document.body.style.overflow = "";
      this.elements.fullscreenIcon &&
        (this.elements.fullscreenIcon.innerHTML =
          '<path d="M1.75 10a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 1 13.25v-2.5a.75.75 0 0 1 .75-.75Zm12.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 13.25 15h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75ZM2.75 1a1.75 1.75 0 0 0-1.75 1.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .25-.25h2.5a.75.75 0 0 0 0-1.5Zm8 0a.75.75 0 0 0 0 1.5h2.5a.25.25 0 0 1 .25.25v2.5a.75.75 0 0 0 1.5 0v-2.5A1.75 1.75 0 0 0 13.25 1Z"/>');
    }
    setTimeout(() => this.codeMirror?.refresh(), 100);
  }

  foldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({ line: i, ch: 0 }, null, "fold");
      }
    });
    this.elements.moreOptionsDropdown?.classList.add("hide");
  }
  unfoldAll() {
    if (!this.codeMirror) return;
    this.codeMirror.operation(() => {
      for (let i = 0; i < this.codeMirror.lineCount(); i++) {
        this.codeMirror.foldCode({ line: i, ch: 0 }, null, "unfold");
      }
    });
    this.elements.moreOptionsDropdown?.classList.add("hide");
  }

  formatCode() {
    if (!this.codeMirror || !this.isEditing) return;
    const content = this.codeMirror.getValue();
    const mode = this.codeMirror.getOption("mode");
    let formatted = content;
    try {
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
      }
    } catch (error) {
      if (typeof showErrorMessage === "function") showErrorMessage("Formatting failed");
    }
    this.elements.moreOptionsDropdown?.classList.add("hide");
  }

  undo() {
    if (!this.codeMirror) return;
    this.codeMirror.undo();
  }
  redo() {
    if (!this.codeMirror) return;
    this.codeMirror.redo();
  }

  getValue() {
    return this.codeMirror ? this.codeMirror.getValue() : "";
  }
  setValue(content) {
    if (this.codeMirror) {
      this.codeMirror.setValue(content);
      this.updateStats();
    }
  }

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
    this.isInitialized = false;
    this.elements = {};
  }
}

window.coderViewEdit = new coderViewEdit();
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.pages[data-page="file"]')) window.coderViewEdit.init();
});
