let _ProgressLoaderInterval = null;
let _fallbackListenersInitialized = false;

if (typeof ProgressLoader === 'undefined') {
    window.ProgressLoader = {
        show: function() {
            const progress = document.getElementById('pageProgress');
            if (progress) {
                progress.classList.add('visible');
                const fill = progress.querySelector('.progress-fill');
                if (fill) {
                    fill.style.width = '0%';
                    let width = 0;
                    if (_ProgressLoaderInterval) {
                        clearInterval(_ProgressLoaderInterval);
                    }
                    _ProgressLoaderInterval = setInterval(() => {
                        if (width >= 90) {
                            clearInterval(_ProgressLoaderInterval);
                            _ProgressLoaderInterval = null;
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
                if (_ProgressLoaderInterval) {
                    clearInterval(_ProgressLoaderInterval);
                    _ProgressLoaderInterval = null;
                }
                setTimeout(() => {
                    progress.classList.remove('visible');
                    if (fill) fill.style.width = '0%';
                }, 200);
            }
        }
    };
}

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

if (typeof setupEventListeners === 'undefined') {
    window.setupEventListeners = function(sidebarManager) {
        if (_fallbackListenersInitialized) {
            console.log('Fallback event listeners already initialized');
            return;
        }
        _fallbackListenersInitialized = true;

        document.addEventListener('click', function(e) {
            const actionElement = e.target.closest('[data-action]');
            if (!actionElement) return;

            const action = actionElement.dataset.action;

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
    repository: null,
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
        theme: "dark-dimmed",
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
        ProgressLoader.show();
        setTimeout(() => {
            try {
                const result = callback();
                ProgressLoader.hide();
                resolve(result);
            } catch (error) {
                ProgressLoader.hide();
                reject(error);
            }
        }, 100);
    });
}

function loadRepositories() {
    return fetchData("Loading repositories...", async () => {
        await IndexedDBStorageManager.ensureInitialized();
        await IndexedDBStorageManager.ensureDefaultRepository();
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

    ProgressLoader.show();
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
            await loadRepositories();
            showSuccessMessage(`Repository "${repoName}" created successfully!`);
            ProgressLoader.hide();
        } catch (error) {
            ProgressLoader.hide();
            showErrorMessage("Failed to create repository: " + error.message);
        }
    }, 1500);
}

function deleteRepository(repoId) {
    if (!confirm(`Are you sure you want to delete this repository? This action cannot be undone.`)) return;

    ProgressLoader.show();
    setTimeout(async () => {
        try {
            await IndexedDBStorageManager.deleteRepository(repoId);
            currentState.repositories = currentState.repositories.filter(r => r.id !== repoId);

            if (currentState.repository && currentState.repository.id === repoId) {
                currentState.repository = null;
                showRepoSelector();
            }

            renderRepositoryList();
            showSuccessMessage("Repository deleted successfully!");
            ProgressLoader.hide();
        } catch (error) {
            ProgressLoader.hide();
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

    ProgressLoader.show();
    setTimeout(async () => {
        try {
            const filePath = (currentState.path ? currentState.path + "/" : "") + fileName;

            const existingFile = await IndexedDBStorageManager.getFile(currentState.repository.id, filePath);
            if (existingFile) throw new Error("File already exists");

            const fileContent = content || `// ${fileName}\n// Created on ${new Date().toLocaleDateString()}\n\n`;

            await IndexedDBStorageManager.saveFile(currentState.repository.id, filePath, {
                content: fileContent,
                category: category,
                tags: currentState.selectedTags
            });

            currentState.files = await IndexedDBStorageManager.listFiles(currentState.repository.id, currentState.path);
            renderFileList();
            hideCreateFileModal();
            showSuccessMessage(`File "${fileName}" created successfully!`);
            ProgressLoader.hide();
        } catch (error) {
            ProgressLoader.hide();
            showErrorMessage("Failed to create file: " + error.message);
        }
    }, 1500);
}

function createFileWithoutRepository() {
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

    const fileContent = content || `// ${fileName}\n// Created on ${new Date().toLocaleDateString()}\n\n`;

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    hideCreateFileModal();
    showSuccessMessage(`File "${fileName}" created and downloaded successfully!`);
}

function confirmDeleteFile() {
    deleteCurrentFile();
    hideDeleteFileModal();
}

function deleteCurrentFile() {
    if (!currentState.currentFile || !currentState.repository) return;

    ProgressLoader.show();
    setTimeout(async () => {
        try {
            const filePath = currentState.currentFile.path ||
                ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);

            await IndexedDBStorageManager.deleteFile(currentState.repository.id, filePath);

            currentState.files = await IndexedDBStorageManager.listFiles(currentState.repository.id, currentState.path);
            renderFileList();
            hideDeleteFileModal();
            showSuccessMessage(`File "${currentState.currentFile.name}" deleted successfully!`);
            ProgressLoader.hide();
            setTimeout(() => showExplorer(), 500);
        } catch (error) {
            ProgressLoader.hide();
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
        previewWindow.document.write(`<!DOCTYPE html><html><head><title>Preview: ${currentState.currentFile.name}</title><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#0d1117;color:#c9d1d9}a{color:#58a6ff}code{background:#161b22;padding:2px 6px;border-radius:3px}pre{background:#161b22;padding:16px;border-radius:6px;overflow-x:auto}</style></head><body>${marked.parse(content)}</body></html>`);
        previewWindow.document.close();
    } else {
        const previewWindow = window.open("", "_blank");
        previewWindow.document.write(`<!DOCTYPE html><html><head><title>Preview: ${currentState.currentFile.name}</title><meta charset="utf-8"><style>body{font-family:'JetBrains Mono',monospace;background:#0d1117;color:#c9d1d9;padding:20px;margin:0}pre{white-space:pre-wrap;word-wrap:break-word}</style></head><body><pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
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
    ProgressLoader.show();

    setTimeout(async () => {
        try {
            const repo = await IndexedDBStorageManager.getRepository(repoId);
            if (!repo) {
                throw new Error("Repository not found");
            }

            currentState.repository = repo;

            const pathParts = filePath.split("/");
            if (pathParts.length > 1) {
                currentState.path = pathParts.slice(0, -1).join("/");
            } else {
                currentState.path = "";
            }

            currentState.files = await IndexedDBStorageManager.listFiles(repoId, currentState.path);
            renderFileList();
            updateBreadcrumb();

            const currentRepoName = document.getElementById("currentRepoName");
            const repoNameInViewer = document.getElementById("repoNameInViewer");
            const repoNameInEditor = document.getElementById("repoNameInEditor");

            if (currentRepoName) currentRepoName.textContent = repo.name;
            if (repoNameInViewer) repoNameInViewer.textContent = repo.name;
            if (repoNameInEditor) repoNameInEditor.textContent = repo.name;

            viewFile(fileName);
            ProgressLoader.hide();
        } catch (error) {
            ProgressLoader.hide();
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
    window.filePageMode = 'view';
    ProgressLoader.show();
    LoadingSpinner.show();

    setTimeout(async () => {
        try {
            const filePath = file.path || ((currentState.path ? currentState.path + "/" : "") + filename);

            const content = await IndexedDBStorageManager.getFileContent(currentState.repository.id, filePath);

            if (!content && content !== '') {
                throw new Error(`File data not found for ${filePath}`);
            }

            addToRecentFiles(filename, currentState.repository.id, currentState.repository.name, filePath);

            if (window.coderViewEdit && typeof window.coderViewEdit.displayFile === "function") {
                const fileData = {
                    content: content,
                    category: file.category || "General",
                    tags: file.tags || [],
                    lastModified: file.lastModified,
                    lastCommit: file.lastCommit || "Local file"
                };
                window.coderViewEdit.displayFile(filename, fileData);
            } else {
                displayFileContent(filename, { content: content });
            }

            showFileViewer();
            updateStats();
            ProgressLoader.hide();
            LoadingSpinner.hide();
        } catch (error) {
            ProgressLoader.hide();
            LoadingSpinner.hide();
            showErrorMessage("Failed to load file: " + error.message);
        }
    }, 1500);
}

function editFile() {
    if (!currentState.currentFile || !currentState.repository) return;

    window.filePageMode = 'edit';
    LoadingSpinner.show();

    setTimeout(async () => {
        try {
            const filePath = currentState.currentFile.path ||
                ((currentState.path ? currentState.path + "/" : "") + currentState.currentFile.name);

            const [content, fileData] = await Promise.all([
                IndexedDBStorageManager.getFileContent(currentState.repository.id, filePath),
                IndexedDBStorageManager.getFile(currentState.repository.id, filePath)
            ]);

            if (!content && content !== '' && !fileData) {
                throw new Error("File not found");
            }

            const editingFileName = document.getElementById("editingFileName");
            const commitTitle = document.getElementById("commitTitle");
            const fileCategoryInput = document.getElementById("fileCategoryInput");

            if (editingFileName) editingFileName.textContent = currentState.currentFile.name;
            if (commitTitle) commitTitle.value = `Update ${currentState.currentFile.name}`;

            if (window.coderViewEdit && typeof window.coderViewEdit.displayFile === "function") {
                const fullFileData = {
                    content: content,
                    category: fileData?.category || "General",
                    tags: fileData?.tags || [],
                    lastModified: fileData?.lastModified || Date.now(),
                    lastCommit: fileData?.lastCommit || "Local file"
                };

                window.coderViewEdit.displayFile(currentState.currentFile.name, fullFileData);

                setTimeout(() => {
                    if (window.coderViewEdit.enterEditMode && typeof window.coderViewEdit.enterEditMode === "function") {
                        window.coderViewEdit.enterEditMode();
                    } else {
                        showFileViewer();
                    }
                    LoadingSpinner.hide();
                }, 100);
            } else if (codeEditor) {
                codeEditor.setValue(content);
                updateEditorMode(codeEditor, currentState.currentFile.name);
                showFileEditor();
                LoadingSpinner.hide();
            }

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

    if (window.coderViewEdit && typeof window.coderViewEdit.saveChanges === "function") {
        window.coderViewEdit.saveChanges();
        return;
    }

    const commitTitle = document.getElementById("commitTitle");
    const commitDescription = document.getElementById("commitDescription");

    if (!commitTitle || !commitTitle.value.trim()) {
        showErrorMessage("Please enter a commit message");
        return;
    }

    ProgressLoader.show();

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

            const fileIndex = currentState.files.findIndex(f => f.name === currentState.currentFile.name);
            if (fileIndex !== -1) {
                currentState.files[fileIndex].lastModified = Date.now();
                currentState.files[fileIndex].lastCommit = fileData.lastCommit;
            }

            if (commitDescription) commitDescription.value = "";

            showSuccessMessage(`File "${currentState.currentFile.name}" saved successfully!`);

            setTimeout(() => {
                ProgressLoader.hide();
                viewFile(currentState.currentFile.name);
            }, 500);

        } catch (error) {
            ProgressLoader.hide();
            showErrorMessage("Failed to save file: " + error.message);
        }
    }, 1500);
}

function openRepository(repoId) {
    ProgressLoader.show();

    setTimeout(async () => {
        try {
            const repo = await IndexedDBStorageManager.getRepository(repoId);
            if (!repo) {
                throw new Error("Repository not found");
            }

            currentState.repository = repo;
            currentState.path = "";
            currentState.currentFile = null;
            window.filePageMode = 'view';

            currentState.files = await IndexedDBStorageManager.listFiles(repoId, "");
            renderFileList();

            $(document).trigger('repositoryChanged', { repository: repo });

            updateBreadcrumb();

            const currentRepoName = document.getElementById("currentRepoName");
            const repoNameInViewer = document.getElementById("repoNameInViewer");
            const repoNameInEditor = document.getElementById("repoNameInEditor");

            if (currentRepoName) currentRepoName.textContent = repo.name;
            if (repoNameInViewer) repoNameInViewer.textContent = repo.name;
            if (repoNameInEditor) repoNameInEditor.textContent = repo.name;

            const repoDescription = document.getElementById("repoDescription");
            if (repoDescription && repo.description) {
                repoDescription.textContent = repo.description;
            }

            showExplorer();
            updateStats();
            ProgressLoader.hide();

        } catch (error) {
            ProgressLoader.hide();
            showErrorMessage("Failed to open repository: " + error.message);
        }
    }, 1500);
}

function showCreateFileModal() {
    window.filePageMode = 'create';
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

    ProgressLoader.show();
    setTimeout(async () => {
        try {
            await IndexedDBStorageManager.initialize();
            await loadRepositories();
            showSuccessMessage("Welcome to GitCodr (Local Mode)");
            ProgressLoader.hide();
        } catch (error) {
            ProgressLoader.hide();
            console.error("Initialization error:", error);
            showErrorMessage("Failed to initialize application: " + error.message);
        }
    }, 1500);
}

document.addEventListener("DOMContentLoaded", initializeApp);

function displayFileContent(filename, fileData) {
    const viewerContent = document.getElementById("viewerContent");
    if (!viewerContent) return;

    const ext = filename.split(".").pop().toLowerCase();
    let content = fileData.content || "";

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

function updateSelectedTags() {
    const container = document.getElementById('selectedTags');
    if (!container) return;
    container.innerHTML = currentState.selectedTags.map(tag => `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-github-accent-emphasis/20 border border-github-accent-emphasis/30 text-github-accent-fg">
            ${tag}
            <button onclick="removeTag('${tag}')" class="ml-1.5 w-3.5 h-3.5 rounded-full hover:bg-github-accent-emphasis/30 flex items-center justify-center">
                <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>
            </button>
        </span>
    `).join('');
}

function updateCommitMessage() {
    if (!currentState.currentFile) return;
    const commitTitle = document.getElementById('commitTitle');
    if (commitTitle && !commitTitle.value.trim()) {
        commitTitle.value = `Update ${currentState.currentFile.name}`;
    }
}

function updateRecentFilesUI() {
    const recentFilesList = document.getElementById('recentFilesList');
    const recentFilesCount = document.getElementById('recentFilesCount');
    const topRecentFilesList = document.getElementById('topRecentFilesList');
    const topRecentFilesCount = document.getElementById('topRecentFilesCount');

    if (recentFilesList) {
        if (recentFiles.length === 0) {
            recentFilesList.innerHTML = `
                <div class="text-center py-4 text-github-fg-muted text-sm">
                    No recent files
                </div>
            `;
        } else {
            recentFilesList.innerHTML = recentFiles.map(file => `
                <button onclick="openRecentFile('${file.repoId}', '${file.filePath}', '${file.fileName}')"
                        class="w-full flex items-center justify-between p-2 rounded hover:bg-github-canvas-subtle text-left group">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                            <svg class="w-3 h-3 text-github-fg-muted flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                            </svg>
                            <span class="text-sm text-github-fg-default truncate">${file.fileName}</span>
                        </div>
                        <div class="text-xs text-github-fg-muted truncate mt-1">${file.repoName}</div>
                    </div>
                    <svg class="w-4 h-4 text-github-fg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                         fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"/>
                    </svg>
                </button>
            `).join('');
        }
    }

    if (topRecentFilesList) {
        if (recentFiles.length === 0) {
            topRecentFilesList.innerHTML = `
                <div class="text-center py-4 text-github-fg-muted text-sm">
                    No recent files
                </div>
            `;
        } else {
            topRecentFilesList.innerHTML = recentFiles.map(file => `
                <button onclick="openRecentFile('${file.repoId}', '${file.filePath}', '${file.fileName}')"
                        class="w-full flex items-center justify-between p-2 rounded hover:bg-github-canvas-subtle text-left group">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                            <svg class="w-3 h-3 text-github-fg-muted flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                            </svg>
                            <span class="text-sm text-github-fg-default truncate">${file.fileName}</span>
                        </div>
                        <div class="text-xs text-github-fg-muted truncate mt-1">${file.repoName}</div>
                    </div>
                    <svg class="w-4 h-4 text-github-fg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                         fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"/>
                    </svg>
                </button>
            `).join('');
        }
    }

    if (recentFilesCount) {
        recentFilesCount.textContent = recentFiles.length.toString();
    }
    if (topRecentFilesCount) {
        topRecentFilesCount.textContent = recentFiles.length.toString();
    }
}

function updateStats() {
    const statsText = document.getElementById('statsText');
    const topStatsText = document.getElementById('topStatsText');
    if ((statsText || topStatsText) && currentState.repository) {
        try {
            IndexedDBStorageManager.listFiles(currentState.repository.id, '').then(files => {
                const totalFiles = files.filter(f => f.type === 'file').length;
                const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
                const sizeText = formatFileSize(totalSize);
                const displayText = `${totalFiles} files • ${sizeText}`;
                if (statsText) statsText.textContent = displayText;
                if (topStatsText) topStatsText.textContent = displayText;
            }).catch(error => {
                if (statsText) statsText.textContent = '0 files';
                if (topStatsText) topStatsText.textContent = '0 files';
            });
        } catch (error) {
            if (statsText) statsText.textContent = '0 files';
            if (topStatsText) topStatsText.textContent = '0 files';
        }
    }
}

function renderRepositoryList() {
    const repoList = document.getElementById('repoList');
    if (!repoList) return;
    repoList.innerHTML = '';
    if (currentState.repositories.length === 0) {
        repoList.innerHTML = `<div class="col-span-full text-center py-12"><svg class="w-12 h-12 mx-auto text-github-fg-muted mb-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg><h3 class="text-lg font-medium text-github-fg-default mb-2">No repositories yet</h3><p class="text-github-fg-muted mb-4">Create your first repository to get started</p><button onclick="showCreateRepoModal()" class="inline-flex items-center px-4 py-2 bg-github-btn-primary-bg hover:bg-github-btn-primary-hover text-white rounded-md text-sm font-medium transition-colors"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/></svg>Create repository</button></div>`;
        return;
    }
    currentState.repositories.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'bg-github-canvas-overlay border border-github-border-default rounded-lg p-4 hover:border-github-accent-fg transition-colors cursor-pointer';
        repoCard.innerHTML = `<div class="flex items-start justify-between"><div class="flex-1"><h3 class="text-lg font-semibold text-github-accent-fg mb-1">${repo.name}</h3><p class="text-sm text-github-fg-muted mb-2">${repo.description || 'No description'}</p><div class="flex items-center space-x-4 text-xs text-github-fg-muted"><span>${formatDate(repo.created)}</span><span class="flex items-center space-x-1"><div class="w-3 h-3 rounded-full bg-github-accent-fg"></div><span>${repo.defaultBranch || 'main'}</span></span></div></div><button onclick="event.stopPropagation();deleteRepository('${repo.id}')" class="text-github-danger-fg hover:text-red-500 p-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/></svg></button></div>`;
        repoCard.addEventListener('click', () => window.openRepository(repo.id));
        repoList.appendChild(repoCard);
    });
}

async function renderFileList() {
    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;

    tbody.innerHTML = `
    <tr>
        <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
            <div class="animate-pulse">Loading files...</div>
        </td>
    </tr>
    `;

    try {
        if (currentState.repository && currentState.repository.id) {
            await IndexedDBStorageManager.ensureInitialized();

            currentState.files = await IndexedDBStorageManager.listFiles(
                currentState.repository.id,
                currentState.path || ''
            );
        } else {
            console.error('No repository selected or repository ID missing');
            currentState.files = [];
        }

        tbody.innerHTML = '';

        if (currentState.files.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
                    </svg>
                    <p>No files in this directory</p>
                    <button onclick="showCreateFileModal()" class="mt-2 text-github-accent-fg hover:underline text-sm">
                        Create your first file
                    </button>
                </td>
            </tr>
            `;
            return;
        }

        currentState.files.forEach(file => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-github-canvas-subtle cursor-pointer border-b border-github-border-default transition-colors group';

            const fileIconSVG = getFileIcon(file.name, file.type);

            row.innerHTML = `
                <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                        ${fileIconSVG}
                        <span class="text-github-fg-default font-mono">${escapeHTML(file.name)}</span>
                    </div>
                </td>
                <td class="py-3 px-4 text-github-fg-muted text-sm">${escapeHTML(file.lastCommit || 'Initial commit')}</td>
                <td class="py-3 px-4 text-github-fg-muted text-sm">${formatDate(file.lastModified)}</td>
                <td class="py-3 px-4 text-right">
                    <button
                        class="file-more-menu-btn opacity-0 group-hover:opacity-100 px-2 py-1 rounded transition-all hover:bg-github-canvas-subtle"
                        onclick="fileMenuManager.showFileMenu('${escapeHTML(file.name)}', event)"
                        data-tooltip="More options"
                    >
                        <svg class="w-4 h-4 text-github-fg-muted" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </button>
                </td>
            `;

            row.addEventListener('click', (e) => {
                if (!e.target.closest('.file-more-menu-btn')) {
                    window.viewFile(file.name);
                }
            });

            row.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                window.showContextMenu(e.clientX, e.clientY, file.name, file.type);
            });

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading files from IndexedDB:', error);
        tbody.innerHTML = `
        <tr>
            <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted text-red-500">
                <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <p>Error loading files</p>
                <p class="text-sm mt-1">${error.message}</p>
                <button onclick="renderFileList()" class="mt-2 text-github-accent-fg hover:underline text-sm">
                    Retry
                </button>
            </td>
        </tr>
        `;
    }
}

async function refreshFileList() {
    if (typeof renderFileList === 'function') {
        await renderFileList();
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

window.currentState = currentState;
window.codeEditor = codeEditor;
window.recentFiles = recentFiles;
window.openRepository = openRepository;
window.createRepository = createRepository;
window.deleteRepository = deleteRepository;
window.createFile = createFile;
window.createFileWithoutRepository = createFileWithoutRepository;
window.confirmDeleteFile = confirmDeleteFile;
window.deleteCurrentFile = deleteCurrentFile;
window.downloadCurrentFile = downloadCurrentFile;
window.previewFile = previewFile;
window.addTag = addTag;
window.removeTag = removeTag;
window.viewFile = viewFile;
window.editFile = editFile;
window.saveFile = saveFile;
window.viewFileFromContext = viewFileFromContext;
window.editFileFromContext = editFileFromContext;
window.downloadFileFromContext = downloadFileFromContext;
window.deleteFileFromContext = deleteFileFromContext;
window.addToRecentFiles = addToRecentFiles;
window.openRecentFile = openRecentFile;
window.showCreateFileModal = showCreateFileModal;
window.hideCreateFileModal = hideCreateFileModal;
window.showDeleteFileModal = showDeleteFileModal;
window.hideDeleteFileModal = hideDeleteFileModal;
window.showCreateRepoModal = showCreateRepoModal;
window.hideCreateRepoModal = hideCreateRepoModal;
window.loadRepositories = loadRepositories;
window.renderRepositoryList = renderRepositoryList;
window.renderFileList = renderFileList;
window.refreshFileList = refreshFileList;
window.updateStats = updateStats;
window.updateRecentFilesUI = updateRecentFilesUI;
window.updateSelectedTags = updateSelectedTags;
window.updateCommitMessage = updateCommitMessage;
window.updateEditorMode = updateEditorMode;
window.displayFileContent = displayFileContent;
window.escapeHTML = escapeHTML;