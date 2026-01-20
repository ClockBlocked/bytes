
let _loadingProgressInterval = null;
let _fallbackListenersInitialized = false;

// Fallback LoadingProgress if overlays.js fails to load from CDN
if (typeof LoadingProgress === 'undefined') {
  window.LoadingProgress = {
    show: function() {
      const progress = document.getElementById('pageProgress');
      if (progress) {
        progress.classList.add('visible');
        const fill = progress.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = '0%';
          let width = 0;
          // Clear any existing interval first
          if (_loadingProgressInterval) {
            clearInterval(_loadingProgressInterval);
          }
          _loadingProgressInterval = setInterval(() => {
            if (width >= 90) {
              clearInterval(_loadingProgressInterval);
              _loadingProgressInterval = null;
            } else {
              width += Math.random() * 10;
              fill.style.width = Math.min(width, 90) + '%';
            }
          }, 100);
        }
      }
    },
    hide: function() {
      const progress = document.getElementById('pageProgress');
      if (progress) {
        const fill = progress.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = '100%';
        }
        if (_loadingProgressInterval) {
          clearInterval(_loadingProgressInterval);
          _loadingProgressInterval = null;
        }
        setTimeout(() => {
          progress.classList.remove('visible');
          if (fill) fill.style.width = '0%';
        }, 200);
      }
    }
  };
}

// Fallback LoadingSpinner if overlays.js fails to load from CDN
if (typeof LoadingSpinner === 'undefined') {
  window.LoadingSpinner = {
    show: function() {
      const spinner = document.querySelector('.loading-spinner');
      if (spinner) spinner.dataset.active = 'true';
    },
    hide: function() {
      const spinner = document.querySelector('.loading-spinner');
      if (spinner) spinner.dataset.active = 'false';
    }
  };
}

// Fallback setupEventListeners if listeners.js fails to load from CDN
if (typeof setupEventListeners === 'undefined') {
  window.setupEventListeners = function(sidebarManager) {
    // Prevent adding duplicate listeners
    if (_fallbackListenersInitialized) {
      console.log('Fallback event listeners already initialized');
      return;
    }
    _fallbackListenersInitialized = true;
    
    // Basic event delegation for data-action buttons
    document.addEventListener('click', function(e) {
      const actionElement = e.target.closest('[data-action]');
      if (!actionElement) return;
      
      const action = actionElement.dataset.action;
      
      // Handle common actions
      switch(action) {
        case 'create-file':
          if (typeof showCreateFileModal === 'function') showCreateFileModal();
          break;
        case 'show-repo-selector':
          if (typeof showRepoSelector === 'function') showRepoSelector();
          break;
        case 'show-explorer':
          if (typeof showExplorer === 'function') showExplorer();
          break;
        case 'edit-file':
          if (typeof editCurrentFile === 'function') editCurrentFile();
          break;
        case 'save-file':
          if (typeof saveFile === 'function') saveFile();
          break;
        case 'download-file':
          if (typeof downloadCurrentFile === 'function') downloadCurrentFile();
          break;
        case 'delete-file':
          if (typeof showDeleteFileModal === 'function') showDeleteFileModal();
          break;
        case 'show-file-viewer':
          if (typeof showFileViewer === 'function') showFileViewer();
          break;
        case 'confirm-create-file':
          if (typeof createFile === 'function') createFile();
          break;
        case 'confirm-delete-file':
          if (typeof confirmDeleteFile === 'function') confirmDeleteFile();
          break;
        case 'hide-create-file-modal':
          if (typeof hideCreateFileModal === 'function') hideCreateFileModal();
          break;
        case 'hide-delete-file-modal':
          if (typeof hideDeleteFileModal === 'function') hideDeleteFileModal();
          break;
      }
    });
    
    console.log('Fallback event listeners initialized');
  };
}

let currentState = {
  repository: null,  // Now stores repository object with id
  branch: "main",
  path: "",
  currentFile: null,
  selectedTags: [],
  files: [],
  repositories: []
};
window.currentState = currentState;
let codeEditor = null;
let initialContentEditor = null;
let recentFiles = JSON.parse(localStorage.getItem("gitcodr_recent_files") || "[]");

function setupCodeEditors() {
  if (typeof CodeMirror === "undefined") return;
  const editorConfig = {
    lineNumbers: true,
    lineWrapping: false,
    theme: "one-dark",
    mode: "javascript",
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    smartIndent: true,
    viewportMargin: Infinity,
    cursorBlinkRate: 530,
    cursorScrollMargin: 12,
    cursorHeight: 1,
    showCursorWhenSelecting: true,
    scrollbarStyle: "native",
    autofocus: false,
    dragDrop: true,
    allowDropFileTypes: ["text/plain", "text/javascript", "text/css", "text/html"],
    undoDepth: 300,
    historyEventDelay: 1250,
    readOnly: false,
    styleActiveLine: {
      nonEmpty: true,
      className: "cm-active-line-highlight"
    },
    matchBrackets: true,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    autoCloseTags: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    lint: true,
    highlightSelectionMatches: {
      minChars: 2,
      showToken: /\w/,
      annotateScrollbar: true
    },
    placeholder: "Start typing your code...",
    lineHeight: 1,
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    extraKeys: {
      "Ctrl-S": cm => {
        const fileEditor = document.getElementById("fileEditor");
        if (fileEditor && !fileEditor.classList.contains("hidden")) saveFile();
      },
      "Ctrl-F": "findPersistent",
      "Ctrl-Space": "autocomplete",
      "Ctrl-D": cm => cm.execCommand("duplicateLine"),
      "Ctrl-/": "toggleComment",
      "Shift-Tab": "indentLess",
      "Tab": cm => {
        if (cm.somethingSelected()) cm.indentSelection("add");
        else cm.execCommand("insertSoftTab");
      }
    }
  };
  setTimeout(() => {
    const editorContainer = document.getElementById("codeEditorContainer");
    const initialContentContainer = document.getElementById("initialContentEditor");
    if (editorContainer) {
      codeEditor = CodeMirror(editorContainer, editorConfig);
      codeEditor.on("change", updateCommitMessage);
      setTimeout(() => {
        if (codeEditor) codeEditor.refresh();
      }, 100);
    }
    if (initialContentContainer) {
      initialContentEditor = CodeMirror(initialContentContainer, {
        ...editorConfig,
        lineNumbers: true,
        height: "100%",
        width: "100%"
      });
      initialContentEditor.on("change", () => {
        const fileName = document.getElementById("newFileName");
        if (fileName && fileName.value) updateEditorMode(initialContentEditor, fileName.value);
      });
    }
  }, 100);
}

function fetchData(operationName, callback) {
  return new Promise((resolve, reject) => {
    LoadingProgress.show();
    setTimeout(() => {
      try {
        const result = callback();
        LoadingProgress.hide();
        resolve(result);
      } catch (error) {
        LoadingProgress.hide();
        reject(error);
      }
    }, 100);
  });
}

function loadRepositories() {
  return fetchData("Loading repositories...", async () => {
    // Ensure storage is initialized
    await IndexedDBStorageManager.ensureInitialized();
    
    // Create default repository if none exists
    await IndexedDBStorageManager.ensureDefaultRepository();
    
    // Load repositories
    currentState.repositories = await IndexedDBStorageManager.getRepositories();
    renderRepositoryList();
    return currentState.repositories;
  }).catch(error => {
    showErrorMessage("Failed to load repositories: " + error.message);
  });
}

function createRepository(repoName, description = "", isPublic = false) {
  if (!repoName || !isValidFilename(repoName)) {
    showErrorMessage("Invalid repository name");
    return;
  }
  
  LoadingProgress.show();
  setTimeout(async () => {
    try {
      const newRepo = {
        name: repoName,
        description: description,
        visibility: isPublic ? 'public' : 'private',
        defaultBranch: 'main',
        branches: ['main']
      };
      
      await IndexedDBStorageManager.saveRepository(newRepo);
      await loadRepositories(); // Refresh the list
      showSuccessMessage(`Repository "${repoName}" created successfully!`);
      LoadingProgress.hide();
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to create repository: " + error.message);
    }
  }, 1500);
}

function deleteRepository(repoId) {
  if (!confirm(`Are you sure you want to delete this repository? This action cannot be undone.`)) return;
  
  LoadingProgress.show();
  setTimeout(async () => {
    try {
      await IndexedDBStorageManager.deleteRepository(repoId);
      currentState.repositories = currentState.repositories.filter(r => r.id !== repoId);
      
      // If current repository is deleted, clear it
      if (currentState.repository && currentState.repository.id === repoId) {
        currentState.repository = null;
        showRepoSelector();
      }
      
      renderRepositoryList();
      showSuccessMessage("Repository deleted successfully!");
      LoadingProgress.hide();
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to delete repository: " + error.message);
    }
  }, 1500);
}

function createFile() {
  const fileName = document.getElementById("newFileName").value.trim();
  const category = document.getElementById("fileCategoryInput").value.trim() || "General";
  const content = initialContentEditor ? initialContentEditor.getValue() : "";
  
  if (!fileName) {
    showErrorMessage("Please enter a file name");
    return;
  }
  
  if (!isValidFilename(fileName)) {
    showErrorMessage("Invalid file name. Please use only letters, numbers, dots, underscores and hyphens.");
    return;
  }
  
  if (!currentState.repository) {
    showErrorMessage("No repository selected");
    return;
  }
  
  LoadingProgress.show();
  setTimeout(async () => {
    try {
      const filePath = (currentState.path ? currentState.path + "/" : "") + fileName;
      
      // Check if file exists
      const existingFile = await IndexedDBStorageManager.getFile(currentState.repository.id, filePath);
      if (existingFile) throw new Error("File already exists");
      
      const fileContent = content || `// ${fileName}\n// Created on ${new Date().toLocaleDateString()}\n\n`;
      
      await IndexedDBStorageManager.saveFile(currentState.repository.id, filePath, {
        content: fileContent,
        category: category,
        tags: currentState.selectedTags
      });
      
      // Refresh file list
      currentState.files = await IndexedDBStorageManager.listFiles(currentState.repository.id, currentState.path);
      renderFileList();
      hideCreateFileModal();
      showSuccessMessage(`File "${fileName}" created successfully!`);
      LoadingProgress.hide();
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to create file: " + error.message);
    }
  }, 1500);
}

function confirmDeleteFile() {
  deleteCurrentFile();
  hideDeleteFileModal();
}

function deleteCurrentFile() {
  if (!currentState.currentFile || !currentState.repository) return;
  
  LoadingProgress.show();
  setTimeout(async () => {
    try {
      const filePath = currentState.currentFile.path || 
        ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);
      
      await IndexedDBStorageManager.deleteFile(currentState.repository.id, filePath);
      
      // Refresh file list
      currentState.files = await IndexedDBStorageManager.listFiles(currentState.repository.id, currentState.path);
      renderFileList();
      hideDeleteFileModal();
      showSuccessMessage(`File "${currentState.currentFile.name}" deleted successfully!`);
      LoadingProgress.hide();
      setTimeout(() => showExplorer(), 500);
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to delete file: " + error.message);
    }
  }, 1500);
}

function downloadCurrentFile() {
  if (!currentState.currentFile || !currentState.repository) return;
  
  try {
    const filePath = currentState.currentFile.path || 
      ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);
    
    IndexedDBStorageManager.getFileContent(currentState.repository.id, filePath)
      .then(content => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = currentState.currentFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccessMessage(`File "${currentState.currentFile.name}" downloaded successfully!`);
      })
      .catch(error => {
        showErrorMessage("Failed to download file: " + error.message);
      });
  } catch (error) {
    showErrorMessage("Failed to download file: " + error.message);
  }
}

function previewFile() {
  if (!codeEditor || !currentState.currentFile) return;
  const content = codeEditor.getValue();
  const ext = currentState.currentFile.name.split(".").pop().toLowerCase();
  
  if (ext === "md" || ext === "markdown") {
    const previewWindow = window.open("", "_blank");
    previewWindow.document.write(`<!DOCTYPE html><html><head><title>Preview: ${currentState.currentFile.name}</title><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px;line-height:1.6;background:#0d1117;color:#c9d1d9;}h1,h2,h3,h4,h5,h6{color:#58a6ff;}pre{background:#161b22;padding:12px;border-radius:8px;overflow:auto;}code{background:#161b22;padding:2px 4px;border-radius:4px;}a{color:#58a6ff;}</style></head><body>${marked.parse(content)}</body></html>`);
    previewWindow.document.close();
  } else {
    const previewWindow = window.open("", "_blank");
    previewWindow.document.write(`<!DOCTYPE html><html><head><title>Preview: ${currentState.currentFile.name}</title><meta charset="utf-8"><style>body{font-family:'JetBrains Mono',monospace;background:#0d1117;color:#c9d1d9;padding:24px;white-space:pre;}</style></head><body>${content.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</body></html>`);
    previewWindow.document.close();
  }
}

function addTag() {
  const input = document.getElementById("tagInput");
  const tag = input.value.trim();
  if (tag && !currentState.selectedTags.includes(tag)) {
    currentState.selectedTags.push(tag);
    updateSelectedTags();
    input.value = "";
  }
}

function removeTag(tag) {
  currentState.selectedTags = currentState.selectedTags.filter(t => t !== tag);
  updateSelectedTags();
}

function viewFileFromContext(fileName) {
  hideContextMenu();
  viewFile(fileName);
}

function editFileFromContext(fileName) {
  hideContextMenu();
  currentState.currentFile = currentState.files.find(f => f.name === fileName);
  editFile();
}

function downloadFileFromContext(fileName) {
  hideContextMenu();
  currentState.currentFile = currentState.files.find(f => f.name === fileName);
  downloadCurrentFile();
}

function deleteFileFromContext(fileName) {
  hideContextMenu();
  currentState.currentFile = currentState.files.find(f => f.name === fileName);
  showDeleteFileModal();
}

function addToRecentFiles(fileName, repoId, repoName, filePath) {
  const existingIndex = recentFiles.findIndex(f => f.filePath === filePath && f.repoId === repoId);
  if (existingIndex !== -1) recentFiles.splice(existingIndex, 1);
  
  recentFiles.unshift({ 
    fileName, 
    repoId, 
    repoName, 
    filePath, 
    timestamp: Date.now() 
  });
  
  if (recentFiles.length > 10) recentFiles = recentFiles.slice(0, 10);
  localStorage.setItem("gitcodr_recent_files", JSON.stringify(recentFiles));
  updateRecentFilesUI();
}

function openRecentFile(repoId, filePath, fileName) {
  LoadingProgress.show();
  
  setTimeout(async () => {
    try {
      // Get the repository
      const repo = await IndexedDBStorageManager.getRepository(repoId);
      if (!repo) {
        throw new Error("Repository not found");
      }
      
      currentState.repository = repo;
      
      // Extract path if file is in subdirectory
      const pathParts = filePath.split("/");
      if (pathParts.length > 1) {
        currentState.path = pathParts.slice(0, -1).join("/");
      } else {
        currentState.path = "";
      }
      
      // Load files for current path
      currentState.files = await IndexedDBStorageManager.listFiles(repoId, currentState.path);
      renderFileList();
      updateBreadcrumb();
      
      // Update UI
      const currentRepoName = document.getElementById("currentRepoName");
      const repoNameInViewer = document.getElementById("repoNameInViewer");
      const repoNameInEditor = document.getElementById("repoNameInEditor");
      
      if (currentRepoName) currentRepoName.textContent = repo.name;
      if (repoNameInViewer) repoNameInViewer.textContent = repo.name;
      if (repoNameInEditor) repoNameInEditor.textContent = repo.name;
      
      // View the file
      viewFile(fileName);
      LoadingProgress.hide();
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to open recent file: " + error.message);
    }
  }, 1500);
}

function viewFile(filename) {
  if (!currentState.repository) {
    showErrorMessage("No repository selected");
    return;
  }
  
  const file = currentState.files.find(f => f.name === filename);
  if (!file) {
    showErrorMessage(`File "${filename}" not found in current view`);
    return;
  }
  
  currentState.currentFile = file;
  LoadingProgress.show();
  LoadingSpinner.show();
  
  setTimeout(async () => {
    try {
      const filePath = file.path || ((currentState.path ? currentState.path + "/" : "") + filename);
      
      // Get file content from IndexedDB
      const content = await IndexedDBStorageManager.getFileContent(currentState.repository.id, filePath);
      
      if (!content && content !== '') {
        throw new Error(`File data not found for ${filePath}`);
      }
      
      // Add to recent files
      addToRecentFiles(filename, currentState.repository.id, currentState.repository.name, filePath);
      
      // Use the new file manager if available
      if (window.fileManager && window.fileManager && typeof window.fileManager.displayFile === "function") {
        const fileData = {
          content: content,
          category: file.category || "General",
          tags: file.tags || [],
          lastModified: file.lastModified,
          lastCommit: file.lastCommit || "Local file"
        };
        window.fileManager.displayFile(filename, fileData);
      } else {
        // Fallback to old method
        displayFileContent(filename, { content: content });
      }
      
      showFileViewer();
      updateStats();
      LoadingProgress.hide();
      LoadingSpinner.hide();
    } catch (error) {
      LoadingProgress.hide();
      LoadingSpinner.hide();
      showErrorMessage("Failed to load file: " + error.message);
    }
  }, 1500);
}

function editFile() {
  if (!currentState.currentFile || !currentState.repository) return;
  
  LoadingSpinner.show();
  
  setTimeout(async () => {
    try {
      const filePath = currentState.currentFile.path || 
        ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);
      
      // Get file content and metadata
      const [content, fileData] = await Promise.all([
        IndexedDBStorageManager.getFileContent(currentState.repository.id, filePath),
        IndexedDBStorageManager.getFile(currentState.repository.id, filePath)
      ]);
      
      if (!content && content !== '' && !fileData) {
        throw new Error("File not found");
      }
      
      // Update UI
      const editingFileName = document.getElementById("editingFileName");
      const commitTitle = document.getElementById("commitTitle");
      const fileCategoryInput = document.getElementById("fileCategoryInput");
      
      if (editingFileName) editingFileName.textContent = currentState.currentFile.name;
      if (commitTitle) commitTitle.value = `Update ${currentState.currentFile.name}`;
      
      // Use the new file manager if available
      if (window.fileManager && window.fileManager) {
        const fullFileData = {
          content: content,
          category: fileData?.category || "General",
          tags: fileData?.tags || [],
          lastModified: fileData?.lastModified || Date.now(),
          lastCommit: fileData?.lastCommit || "Local file"
        };
        
        if (typeof window.fileManager.displayFile === "function") {
          window.fileManager.displayFile(currentState.currentFile.name, fullFileData);
          
          setTimeout(() => {
            if (typeof window.fileManager.enterEditMode === "function") {
              window.fileManager.enterEditMode();
            } else {
              showFileViewer();
            }
            LoadingSpinner.hide();
          }, 100);
        }
      } else if (codeEditor) {
        // Fallback to old editor
        codeEditor.setValue(content);
        updateEditorMode(codeEditor, currentState.currentFile.name);
        showFileEditor();
        LoadingSpinner.hide();
      }
      
      // Set category and tags
      if (fileCategoryInput) fileCategoryInput.value = fileData?.category || "";
      currentState.selectedTags = fileData?.tags || [];
      updateSelectedTags();
      
    } catch (error) {
      LoadingSpinner.hide();
      showErrorMessage("Failed to load file for editing: " + error.message);
    }
  }, 1500);
}

function saveFile() {
  if (!currentState.currentFile || !currentState.repository) return;
  
  // Use new file manager if available
  if (window.fileManager && window.fileManager && typeof window.fileManager.saveChanges === "function") {
    window.fileManager.saveChanges();
    return;
  }
  
  // Fallback to old save method
  const commitTitle = document.getElementById("commitTitle");
  const commitDescription = document.getElementById("commitDescription");
  
  if (!commitTitle || !commitTitle.value.trim()) {
    showErrorMessage("Please enter a commit message");
    return;
  }
  
  LoadingProgress.show();
  
  setTimeout(async () => {
    try {
      const filePath = currentState.currentFile.path || 
        ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);
      
      const content = codeEditor ? codeEditor.getValue() : "";
      const fileCategoryInput = document.getElementById("fileCategoryInput");
      
      const fileData = {
        content: content,
        category: fileCategoryInput ? fileCategoryInput.value.trim() || "General" : "General",
        tags: currentState.selectedTags,
        lastCommit: commitTitle.value.trim()
      };
      
      await IndexedDBStorageManager.saveFile(currentState.repository.id, filePath, fileData);
      
      // Update file in current list
      const fileIndex = currentState.files.findIndex(f => f.name === currentState.currentFile.name);
      if (fileIndex !== -1) {
        currentState.files[fileIndex].lastModified = Date.now();
        currentState.files[fileIndex].lastCommit = fileData.lastCommit;
      }
      
      if (commitDescription) commitDescription.value = "";
      
      showSuccessMessage(`File "${currentState.currentFile.name}" saved successfully!`);
      
      setTimeout(() => {
        LoadingProgress.hide();
        viewFile(currentState.currentFile.name);
      }, 500);
      
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to save file: " + error.message);
    }
  }, 1500);
}

function openRepository(repoId) {
  LoadingProgress.show();
  
  setTimeout(async () => {
    try {
      const repo = await IndexedDBStorageManager.getRepository(repoId);
      if (!repo) {
        throw new Error("Repository not found");
      }
      
      currentState.repository = repo;
      currentState.path = "";
      
      // Load files
      currentState.files = await IndexedDBStorageManager.listFiles(repoId, "");
      renderFileList();
      updateBreadcrumb();
      
      // Update UI
      const currentRepoName = document.getElementById("currentRepoName");
      const repoNameInViewer = document.getElementById("repoNameInViewer");
      const repoNameInEditor = document.getElementById("repoNameInEditor");
      
      if (currentRepoName) currentRepoName.textContent = repo.name;
      if (repoNameInViewer) repoNameInViewer.textContent = repo.name;
      if (repoNameInEditor) repoNameInEditor.textContent = repo.name;
      
      // Update repository description if available
      const repoDescription = document.getElementById("repoDescription");
      if (repoDescription && repo.description) {
        repoDescription.textContent = repo.description;
      }
      
      showExplorer();
      updateStats();
      LoadingProgress.hide();
      
    } catch (error) {
      LoadingProgress.hide();
      showErrorMessage("Failed to open repository: " + error.message);
    }
  }, 1500);
}

function showCreateFileModal() {
  const modal = document.getElementById("createFileModal");
  if (modal) modal.classList.remove("hidden");
}

function hideCreateFileModal() {
  const modal = document.getElementById("createFileModal");
  if (modal) modal.classList.add("hidden");
}

function showDeleteFileModal() {
  const modal = document.getElementById("deleteFileModal");
  if (modal) modal.classList.remove("hidden");
}

function hideDeleteFileModal() {
  const modal = document.getElementById("deleteFileModal");
  if (modal) modal.classList.add("hidden");
}

function showCreateRepoModal() {
  const modal = document.getElementById("createRepoModal");
  if (modal) modal.classList.remove("hidden");
}

function hideCreateRepoModal() {
  const modal = document.getElementById("createRepoModal");
  if (modal) modal.classList.add("hidden");
}

function initializeApp() {
  setupEventListeners(SidebarManager || null);
  setupCodeEditors();
  updateRecentFilesUI();
  
  LoadingProgress.show();
  setTimeout(async () => {
    try {
      // Initialize IndexedDB
      await IndexedDBStorageManager.initialize();
      
      // Load repositories
      await loadRepositories();
      
      showSuccessMessage("Welcome to GitCodr (Local Mode)");
      LoadingProgress.hide();
    } catch (error) {
      LoadingProgress.hide();
      console.error("Initialization error:", error);
      showErrorMessage("Failed to initialize application: " + error.message);
    }
  }, 1500);
}

document.addEventListener("DOMContentLoaded", initializeApp);

// Helper function to display file content (fallback if coderViewEdit is not available)
function displayFileContent(filename, fileData) {
  const viewerContent = document.getElementById("viewerContent");
  if (!viewerContent) return;
  
  const ext = filename.split(".").pop().toLowerCase();
  let content = fileData.content || "";
  
  // Apply syntax highlighting based on file extension
  if (ext === "js" || ext === "jsx") {
    content = `<pre class="language-javascript"><code>${Prism.highlight(content, Prism.languages.javascript, 'javascript')}</code></pre>`;
  } else if (ext === "html") {
    content = `<pre class="language-html"><code>${Prism.highlight(content, Prism.languages.html, 'html')}</code></pre>`;
  } else if (ext === "css") {
    content = `<pre class="language-css"><code>${Prism.highlight(content, Prism.languages.css, 'css')}</code></pre>`;
  } else if (ext === "md" || ext === "markdown") {
    content = marked.parse(content);
  } else {
    content = `<pre><code>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  }
  
  viewerContent.innerHTML = content;
}

// Helper function to update editor mode based on filename
function updateEditorMode(editor, filename) {
  if (!editor || !filename) return;
  
  const ext = filename.split(".").pop().toLowerCase();
  let mode = "javascript";
  
  switch(ext) {
    case "js": case "jsx": mode = "javascript"; break;
    case "ts": case "tsx": mode = "typescript"; break;
    case "html": mode = "htmlmixed"; break;
    case "css": mode = "css"; break;
    case "json": mode = "application/json"; break;
    case "py": mode = "python"; break;
    case "java": mode = "text/x-java"; break;
    case "cpp": case "c++": case "cc": mode = "text/x-c++src"; break;
    case "c": mode = "text/x-csrc"; break;
    case "php": mode = "php"; break;
    case "md": mode = "markdown"; break;
    case "xml": mode = "xml"; break;
    case "sql": mode = "sql"; break;
    default: mode = "null"; break;
  }
  
  editor.setOption("mode", mode);
}

/**
 * 
 *  C R E A T E D  B Y
 * 
 *  William Hanson 
 * 
 *  Chevrolay@Outlook.com
 * 
 *  m.me/Chevrolay
 * 
 */