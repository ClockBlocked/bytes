

/**
import { formatDate, getFileIcon, getLanguageName, formatFileSize, getPrismLanguage, adjustCodeBlockHeight } from 'https://gitdev.wuaze.com/modules/dependencies.js';
import { currentState, recentFiles } from 'https://gitdev.wuaze.com/modules/core.js';
import { LocalStorageManager } from 'https://gitdev.wuaze.com/modules/storage.js';
**/




function updateSelectedTags() {
  console.log("updateSelectedTags called");
  console.log("updateSelectedTags called");
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


/**

let lastScrollTop = 0;
let scrollTimeout = null;
const SCROLL_THRESHOLD = 10;

function initScrollBehavior() {
  console.log("initScrollBehavior called");
  console.log("initScrollBehavior called");
  const breadcrumb = document.getElementById('pathBreadcrumb');
  if (!breadcrumb) return;

  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(scrollTop - lastScrollTop) > SCROLL_THRESHOLD) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          breadcrumb.classList.add('hidden');
        } else {
          breadcrumb.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
      }
    }, 50);
  });
}


window.navigateToRoot = function() {
  if (!window.currentState) return;
  
  window.currentState.path = '';
  
  if (PageRouter && PageRouter.navigateTo) {
    PageRouter.navigateTo('explorer');
  }
  
  if (typeof LocalStorageManager !== 'undefined') {
    LocalStorageManager.listFiles(window.currentState.repository, '').then(function(files) {
      window.currentState.files = files;
      if (typeof renderFileList === 'function') renderFileList();
      if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) window.breadCrumbs.update();
      if (typeof updateStats === 'function') updateStats();
    });
  }
};

window.navigateToPath = function(path) {
  if (!window.currentState) return;
  
  window.currentState.path = path;
  
  if (PageRouter && PageRouter.navigateTo) {
    PageRouter.navigateTo('explorer');
  }
  
  const pathPrefix = path ? path + '/' : '';
  
  if (typeof LocalStorageManager !== 'undefined') {
    LocalStorageManager.listFiles(window.currentState.repository, pathPrefix).then(function(files) {
      window.currentState.files = files;
      if (typeof renderFileList === 'function') renderFileList();
      if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) window.breadCrumbs.update();
    });
  }
};

document.addEventListener('pageNavigationComplete', function(e) {
  if (e.detail.to === 'explorer') {
    if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) {
      window.breadCrumbs.update();
    }
  } else if (e.detail.to === 'repo') {
    const breadcrumb = document.getElementById('pathBreadcrumb');
    if (breadcrumb) {
      const container = breadcrumb.querySelector('.breadCrumbContainer');
      if (container) {
        container.innerHTML = '<span data-navigate="repo" class="breadCrumb current">Repositories</span>';
      }
    }
  }
});

document.addEventListener('repositoryChanged', function(e) {
  if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) {
    window.breadCrumbs.update();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  initScrollBehavior();
  
  setTimeout(function() {
    if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) {
      window.breadCrumbs.update();
    }
  }, 100);
});

window.addEventListener('stateChanged', function() {
  if (typeof window.breadCrumbs !== 'undefined' && window.breadCrumbs.update) {
    window.breadCrumbs.update();
  }
});




function updateEditorMode(editor, fileName) {
  console.log("updateEditorMode called");
  if (!editor || !fileName) return;
  const ext = fileName.split('.').pop().toLowerCase();
  const modeMap = {
    'js': 'javascript', 'javascript': 'javascript', 'ts': 'javascript', 'typescript': 'javascript',
    'html': 'htmlmixed', 'htm': 'htmlmixed', 'xml': 'xml', 'css': 'css', 'scss': 'css', 'sass': 'css',
    'less': 'css', 'json': 'javascript', 'py': 'python', 'python': 'python', 'php': 'php', 'sql': 'sql',
    'md': 'markdown', 'markdown': 'markdown', 'yml': 'yaml', 'yaml': 'yaml'
  };
  const mode = modeMap[ext] || 'text';
  editor.setOption('mode', mode);
}

function updateCommitMessage() {
  console.log("updateCommitMessage called");
  console.log("updateCommitMessage called");
  if (!currentState.currentFile) return;
  const commitTitle = document.getElementById('commitTitle');
  if (commitTitle && !commitTitle.value.trim()) {
    commitTitle.value = `Update ${currentState.currentFile.name}`;
  }
}

function renderRepositoryList() {
  console.log("renderRepositoryList called");
  console.log("renderRepositoryList called");
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
    repoCard.innerHTML = `<div class="flex items-start justify-between"><div class="flex-1"><h3 class="text-lg font-semibold text-github-accent-fg mb-1">${repo.name}</h3><p class="text-sm text-github-fg-muted mb-2">${repo.description || 'No description'}</p><div class="flex items-center space-x-4 text-xs text-github-fg-muted"><span>${formatDate(repo.created)}</span><span class="flex items-center space-x-1"><div class="w-3 h-3 rounded-full bg-github-accent-fg"></div><span>${repo.defaultBranch || 'main'}</span></span></div></div><button onclick="event.stopPropagation();deleteRepository('${repo.name}')" class="text-github-danger-fg hover:text-red-500 p-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/></svg></button></div>`;
    repoCard.addEventListener('click', () => window.openRepository(repo.name));
    repoList.appendChild(repoCard);
  });
}



async function renderFileList() {
  console.log("renderFileList called");
  console.log("renderFileList called");
  const tbody = document.getElementById('fileListBody');
  if (!tbody) return;
  
  // Show loading state
  tbody.innerHTML = `
  <tr>
    <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
      <div class="animate-pulse">Loading files...</div>
    </td>
  </tr>
  `;
  
  try {
    // CRITICAL: Fetch files from IndexedDB
    if (currentState.repository && currentState.repository.id) {
      // Make sure IndexedDB is initialized
      await IndexedDBStorageManager.ensureInitialized();
      
      // Get files from the current repository and path
      currentState.files = await IndexedDBStorageManager.listFiles(
        currentState.repository.id, 
        currentState.path || ''
      );
    } else {
      console.error('No repository selected or repository ID missing');
      currentState.files = [];
    }
    
    // Clear the table
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
    
    // Render the file list
    currentState.files.forEach(file => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-github-canvas-subtle cursor-pointer border-b border-github-border-default transition-colors group';
      
      const fileIconSVG = getFileIcon(file.name, file.type);
      
      row.innerHTML = `
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            ${fileIconSVG}
            <span class="text-github-fg-default font-mono" data-spa-navigate="explorer" href="#explorer">${escapeHTML(file.name)}</span>
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
  console.log("refreshFileList called");
  console.log("refreshFileList called");
  if (typeof renderFileList === 'function') {
    await renderFileList();
  }
}

// Call this when navigating to a repository
async function loadRepository(repoId) {
  console.log("loadRepository called");
  const repo = await IndexedDBStorageManager.getRepository(repoId);
  currentState.repository = repo;
  currentState.path = '';
  await refreshFileList();
}


function escapeHTML(str) {
  console.log("escapeHTML called");
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function displayFileContent(filename, fileData) {
  console.log("displayFileContent called");
    if (window.coderViewEdit && typeof coderViewEdit.displayFile === 'function') {
        coderViewEdit.displayFile(filename, fileData);
        showFileViewer();
        return;
    }
    
    const currentFileName = document.getElementById('currentFileName');
    const fileLinesCount = document.getElementById('fileLinesCount');
    const fileSize = document.getElementById('fileSize');
    const fileLanguageDisplay = document.getElementById('fileLanguageDisplay');
    const fileCategory = document.getElementById('fileCategory');
    const fileTags = document.getElementById('fileTags');
    
    if (currentFileName) currentFileName.textContent = filename;
    const content = fileData.content || '';
    const lines = content.split('\n');
    const lineCount = lines.length;
    
    if (fileLinesCount) fileLinesCount.textContent = `${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`;
    if (fileSize) fileSize.textContent = formatFileSize(content.length);
    
    const ext = filename.split('.').pop().toLowerCase();
    const language = getLanguageName(ext);
    const prismLang = getPrismLanguage(ext);
    
    if (fileLanguageDisplay) fileLanguageDisplay.textContent = language;
    
    const codeBlock = document.getElementById('codeBlock');
    const lineNumbers = document.getElementById('lineNumbers');
    
    if (codeBlock) {
        codeBlock.textContent = content;
        codeBlock.className = 'code-block';
        codeBlock.classList.add(`language-${prismLang}`);
    }
    
    if (lineNumbers) {
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line-number';
            lineDiv.textContent = i;
            lineNumbers.appendChild(lineDiv);
        }
    }
    
    setTimeout(() => {
        if (window.Prism && codeBlock) {
            try {
                Prism.highlightElement(codeBlock);
            } catch (error) {}
        }
    }, 50);
    
    if (fileCategory) fileCategory.textContent = fileData.category || 'General';
    
    if (fileTags) {
        if (fileData.tags && fileData.tags.length > 0) {
            fileTags.innerHTML = fileData.tags.map(tag => 
                `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-github-accent-emphasis/20 border border-github-accent-emphasis/30 text-github-accent-fg">${tag}</span>`
            ).join('');
        } else {
            fileTags.innerHTML = '<span class="text-github-fg-muted text-sm">No tags</span>';
        }
    }
}

function updateRecentFilesUI() {
  console.log("updateRecentFilesUI called");
  console.log("updateRecentFilesUI called");
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
        <button onclick="openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')" 
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
        <button onclick="openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')" 
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
  console.log("updateStats called");
  console.log("updateStats called");
  const statsText = document.getElementById('statsText');
  const topStatsText = document.getElementById('topStatsText');
  if ((statsText || topStatsText) && currentState.repository) {
    try {
      const files = LocalStorageManager.listFiles(currentState.repository, '');
      const totalFiles = files.filter(f => f.type === 'file').length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const sizeText = formatFileSize(totalSize);
      const displayText = `${totalFiles} files • ${sizeText}`;
      if (statsText) statsText.textContent = displayText;
      if (topStatsText) topStatsText.textContent = displayText;
    } catch (error) {
      if (statsText) statsText.textContent = '0 files';
      if (topStatsText) topStatsText.textContent = '0 files';
    }
  }
}

function setupEventListeners() {
  console.log("setupEventListeners called");
  console.log("setupEventListeners called");
  const tagInput = document.getElementById('tagInput');
  if (tagInput) tagInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); window.addTag(); }
  });
  const branchSelector = document.getElementById('branchSelector');
  if (branchSelector) branchSelector.addEventListener('click', function(e) {
    e.stopPropagation();
    const branchDropdown = document.getElementById('branchDropdown');
    if (branchDropdown) branchDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', function() {
    const branchDropdown = document.getElementById('branchDropdown');
    if (branchDropdown) branchDropdown.classList.add('hidden');
  });
  const newFileName = document.getElementById('newFileName');
  if (newFileName) newFileName.addEventListener('input', function(e) {
    const fileName = e.target.value;
    if (fileName && initialContentEditor) updateEditorMode(initialContentEditor, fileName);
  });
}




window.refreshFileList = refreshFileList;
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
