/**
 * GitHubStorageManager - Uses GitHub API to store files directly in a GitHub repository
 * 
 * CREATED BY
 * William Hanson
 * Chevrolay@Outlook.com
 * m.me/Chevrolay
 */

const GITHUB_API_BASE = 'https://api.github.com';

// GitHub API configuration - set these to your repository details
const GITHUB_CONFIG = {
  owner: 'ClockBlocked',      // GitHub username or organization
  repo: 'bytes',              // Repository name
  branch: 'main',             // Branch to commit to
  storagePath: 'user-files'   // Folder in repo where files are stored
};

// Cache for repositories and files
const storageCache = {
  repositories: [],
  repositoryFiles: {},
  repositoryData: {},
  initialized: false,
  token: null
};

// Get stored GitHub token
function getStoredToken() {
  try {
    return localStorage.getItem('github_clone_token');
  } catch (e) {
    console.warn('Failed to read token from localStorage:', e);
    return null;
  }
}

// Store GitHub token
function storeToken(token) {
  try {
    localStorage.setItem('github_clone_token', token);
  } catch (e) {
    console.warn('Failed to store token in localStorage:', e);
  }
}

// Clear stored token
function clearToken() {
  storageCache.token = null;
  try {
    localStorage.removeItem('github_clone_token');
  } catch (e) {
    console.warn('Failed to clear token from localStorage:', e);
  }
}

// Show token prompt modal
async function showTokenPromptModal() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.id = 'github-token-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    modal.innerHTML = `
      <div style="
        background: #22272e;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 1px solid #444c56;
        color: #adbac7;
      ">
        <h2 style="margin-top: 0; color: #adbac7;">GitHub Authentication Required</h2>
        <p style="color: #768390; margin-bottom: 20px;">
          This application needs a GitHub Personal Access Token to save files to your repository.
        </p>
        <div style="background: #2d333b; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #444c56;">
          <h4 style="margin-top: 0; color: #adbac7;">How to get a token:</h4>
          <ol style="margin: 10px 0; padding-left: 20px; color: #768390;">
            <li>Go to <a href="https://github.com/settings/tokens" target="_blank" style="color: #539bf5;">GitHub Token Settings</a></li>
            <li>Click "Generate new token (classic)"</li>
            <li>Select these scopes: <code style="background: #1c2128; padding: 2px 6px; border-radius: 3px;">repo</code></li>
            <li>Click "Generate token" and copy it</li>
          </ol>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #adbac7;">
            Your GitHub Token:
          </label>
          <input type="password"
                 id="github-token-input"
                 placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                 style="
                   width: 100%;
                   padding: 10px;
                   border: 2px solid #444c56;
                   border-radius: 5px;
                   font-family: monospace;
                   box-sizing: border-box;
                   background: #1c2128;
                   color: #adbac7;
                 ">
          <div style="font-size: 12px; color: #636e7b; margin-top: 5px;">
            Your token is stored locally in your browser.
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="token-cancel-btn" style="
            padding: 10px 20px;
            background: #373e47;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            color: #adbac7;
          ">Cancel</button>
          <button id="token-submit-btn" style="
            padding: 10px 20px;
            background: #347d39;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          ">Save Token</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#github-token-input');
    const cancelBtn = modal.querySelector('#token-cancel-btn');
    const submitBtn = modal.querySelector('#token-submit-btn');

    input.focus();

    const cleanup = () => {
      if (modal.parentNode) {
        document.body.removeChild(modal);
      }
    };

    const submit = () => {
      const token = input.value.trim();
      if (token) {
        resolve(token);
        cleanup();
      } else {
        input.style.borderColor = '#c93c37';
        input.focus();
      }
    };

    cancelBtn.onclick = () => {
      resolve(null);
      cleanup();
    };

    submitBtn.onclick = submit;

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        submit();
      } else if (e.key === 'Escape') {
        resolve(null);
        cleanup();
      }
    };
  });
}

// Prompt for token if not available
async function promptForToken() {
  const storedToken = getStoredToken();
  if (storedToken) {
    storageCache.token = storedToken;
    return storedToken;
  }

  const token = await showTokenPromptModal();
  if (token) {
    storageCache.token = token;
    storeToken(token);
    return token;
  }
  return null;
}

// Make GitHub API request
async function githubRequest(endpoint, options = {}) {
  if (!storageCache.token) {
    await promptForToken();
  }
  
  if (!storageCache.token) {
    throw new Error('GitHub token is required');
  }

  const url = `${GITHUB_API_BASE}${endpoint}`;
  const config = {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${storageCache.token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  if (options.body && config.method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      clearToken();
      throw new Error('Invalid GitHub token. Please try again.');
    }
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'GitHub API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('GitHub API request failed:', error);
    throw error;
  }
}

// Initialize storage
async function initializeStorage() {
  if (storageCache.initialized) return;
  
  // Load token from storage
  storageCache.token = getStoredToken();
  
  // Create a default local repository entry
  storageCache.repositories = [{
    id: 'github-repo',
    name: GITHUB_CONFIG.repo,
    description: 'Files stored in GitHub repository',
    visibility: 'public',
    created: Date.now(),
    lastModified: Date.now(),
    defaultBranch: GITHUB_CONFIG.branch,
    branches: [GITHUB_CONFIG.branch]
  }];
  
  storageCache.initialized = true;
}

// Initialize storage and store the promise for awaiting
let initPromise = null;

// Ensure initialization is complete before using storage
async function ensureInitialized() {
  if (storageCache.initialized) return;
  if (!initPromise) {
    initPromise = initializeStorage();
  }
  await initPromise;
}

// Call initialize on load
initPromise = initializeStorage();

const LocalStorageManager = {
  // Get all repositories from cache
  getRepositories: function() {
    return storageCache.repositories;
  },

  // Save repositories (updates cache)
  saveRepositories: function(repositories) {
    storageCache.repositories = repositories;
  },

  // Get a single repository by name
  getRepository: function(repoName) {
    const repos = this.getRepositories();
    return repos.find(r => r.name === repoName);
  },

  // Save/update a repository (not used for GitHub - repos managed externally)
  saveRepository: async function(repo) {
    // For GitHub integration, we just update the local cache
    const existingIndex = storageCache.repositories.findIndex(r => r.name === repo.name);
    if (existingIndex !== -1) {
      storageCache.repositories[existingIndex] = { ...storageCache.repositories[existingIndex], ...repo };
    } else {
      storageCache.repositories.push(repo);
    }
  },

  // Delete a repository (not supported for GitHub - repos managed externally)
  deleteRepository: async function(repoName) {
    storageCache.repositories = storageCache.repositories.filter(r => r.name !== repoName);
    delete storageCache.repositoryFiles[repoName];
    delete storageCache.repositoryData[repoName];
  },

  // Get repository files from cache
  getRepositoryFiles: function(repoName) {
    return storageCache.repositoryFiles[repoName] || {};
  },

  // Save repository files to cache
  saveRepositoryFiles: function(repoName, files) {
    storageCache.repositoryFiles[repoName] = files;
  },

  // Get a specific file from cache
  getFile: function(repoName, filePath) {
    const repoData = this.getRepositoryFiles(repoName);
    return repoData[filePath] || null;
  },

  // Save a file to GitHub repository
  saveFile: async function(repoName, filePath, fileData) {
    try {
      const fullPath = `${GITHUB_CONFIG.storagePath}/${filePath}`;
      // Use TextEncoder for proper Unicode handling
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(fileData.content || '');
      const content = btoa(String.fromCharCode.apply(null, uint8Array));
      
      // Check if file exists to get SHA for update
      let sha = null;
      try {
        const existingFile = await githubRequest(
          `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${fullPath}?ref=${GITHUB_CONFIG.branch}`
        );
        sha = existingFile.sha;
      } catch (e) {
        // File doesn't exist, will create new
      }
      
      const body = {
        message: fileData.lastCommit || `Create/Update ${filePath}`,
        content: content,
        branch: GITHUB_CONFIG.branch
      };
      
      if (sha) {
        body.sha = sha;
      }
      
      await githubRequest(
        `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${fullPath}`,
        {
          method: 'PUT',
          body: body
        }
      );
      
      // Update local cache
      const repoData = this.getRepositoryFiles(repoName);
      repoData[filePath] = fileData;
      this.saveRepositoryFiles(repoName, repoData);
      
    } catch (error) {
      console.error('Failed to save file to GitHub:', error);
      throw error;
    }
  },

  // Delete a file from GitHub repository
  deleteFile: async function(repoName, filePath) {
    try {
      const fullPath = `${GITHUB_CONFIG.storagePath}/${filePath}`;
      
      // Get file SHA (required for deletion)
      const existingFile = await githubRequest(
        `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${fullPath}?ref=${GITHUB_CONFIG.branch}`
      );
      
      await githubRequest(
        `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${fullPath}`,
        {
          method: 'DELETE',
          body: {
            message: `Delete ${filePath}`,
            sha: existingFile.sha,
            branch: GITHUB_CONFIG.branch
          }
        }
      );
      
      // Remove from local cache
      const repoData = this.getRepositoryFiles(repoName);
      delete repoData[filePath];
      this.saveRepositoryFiles(repoName, repoData);
      
    } catch (error) {
      console.error('Failed to delete file from GitHub:', error);
      throw error;
    }
  },

  // List files from GitHub repository
  listFiles: async function(repoName, pathPrefix = '') {
    try {
      const fullPath = pathPrefix 
        ? `${GITHUB_CONFIG.storagePath}/${pathPrefix}`
        : GITHUB_CONFIG.storagePath;
      
      let contents = [];
      try {
        contents = await githubRequest(
          `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${fullPath}?ref=${GITHUB_CONFIG.branch}`
        );
      } catch (e) {
        // Directory doesn't exist yet
        return [];
      }
      
      if (!Array.isArray(contents)) {
        contents = [contents];
      }
      
      const files = [];
      
      for (const item of contents) {
        if (item.type === 'file') {
          // Get relative path by removing storage path prefix
          const relativePath = item.path.replace(`${GITHUB_CONFIG.storagePath}/`, '');
          
          files.push({
            name: item.name,
            type: 'file',
            path: relativePath,
            sha: item.sha,
            size: item.size || 0,
            lastModified: Date.now(),
            lastCommit: 'GitHub file'
          });
          
          // Fetch and cache file content
          try {
            const fileContent = await githubRequest(
              `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${item.path}?ref=${GITHUB_CONFIG.branch}`
            );
            
            let content = '';
            if (fileContent.content) {
              // Use TextDecoder for proper Unicode handling
              const binaryString = atob(fileContent.content.replace(/\n/g, ''));
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const decoder = new TextDecoder();
              content = decoder.decode(bytes);
            }
            
            const repoData = this.getRepositoryFiles(repoName);
            repoData[relativePath] = {
              content: content,
              size: item.size || 0,
              lastModified: Date.now(),
              lastCommit: 'GitHub file',
              category: 'General',
              tags: []
            };
            this.saveRepositoryFiles(repoName, repoData);
          } catch (e) {
            console.warn('Failed to fetch file content:', e);
          }
          
        } else if (item.type === 'dir') {
          files.push({
            name: item.name,
            type: 'folder',
            path: item.path.replace(`${GITHUB_CONFIG.storagePath}/`, '') + '/',
            lastModified: Date.now(),
            lastCommit: 'Folder'
          });
        }
      }
      
      return files.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
    } catch (error) {
      console.error('Failed to list files from GitHub:', error);
      return [];
    }
  },
  
  // Refresh data
  refresh: async function() {
    storageCache.initialized = false;
    await initializeStorage();
    return storageCache.repositories;
  }
};
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