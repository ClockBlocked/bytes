/**
 * ServerStorageManager - Uses PHP backend API to store files on server
 * Falls back to LocalStorageManager if API is unavailable
 * 
 * CREATED BY
 * William Hanson
 * Chevrolay@Outlook.com
 * m.me/Chevrolay
 */

const API_BASE_URL = 'api/repos.php';

// Cache for repositories and files (for synchronous compatibility)
const storageCache = {
  repositories: [],
  repositoryFiles: {},
  repositoryData: {},
  initialized: false
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  if (options.body && config.method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data.data || data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Initialize storage by loading data from server
async function initializeStorage() {
  if (storageCache.initialized) return;
  
  try {
    const response = await apiRequest('');
    if (response && response.repositories) {
      storageCache.repositories = response.repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        visibility: repo.visibility || 'public',
        created: new Date(repo.createdAt).getTime(),
        lastModified: new Date(repo.updatedAt).getTime(),
        defaultBranch: 'main',
        branches: ['main']
      }));
    }
    storageCache.initialized = true;
  } catch (error) {
    console.warn('Failed to initialize storage from server, using empty state:', error);
    storageCache.repositories = [];
    storageCache.initialized = true;
  }
}

// Call initialize on load
initializeStorage();

const LocalStorageManager = {
  // Get all repositories from server cache
  getRepositories: function() {
    return storageCache.repositories;
  },

  // Save repositories (updates cache, actual save happens per-operation)
  saveRepositories: function(repositories) {
    storageCache.repositories = repositories;
  },

  // Get a single repository by name
  getRepository: function(repoName) {
    const repos = this.getRepositories();
    return repos.find(r => r.name === repoName);
  },

  // Save/update a repository (async operation)
  saveRepository: async function(repo) {
    try {
      // Check if repo exists on server
      const existingRepo = storageCache.repositories.find(r => r.name === repo.name);
      
      if (existingRepo && existingRepo.id) {
        // Update existing repo
        const response = await apiRequest(`/${existingRepo.id}`, {
          method: 'PUT',
          body: {
            name: repo.name,
            description: repo.description,
            visibility: repo.visibility
          }
        });
        
        // Update cache
        const index = storageCache.repositories.findIndex(r => r.name === repo.name);
        if (index !== -1) {
          storageCache.repositories[index] = {
            ...storageCache.repositories[index],
            ...repo
          };
        }
      } else {
        // Create new repo
        const response = await apiRequest('', {
          method: 'POST',
          body: {
            name: repo.name,
            description: repo.description || '',
            visibility: repo.visibility || 'public'
          }
        });
        
        // Add to cache with server-assigned ID
        const newRepo = {
          id: response.repository.id,
          name: response.repository.name,
          description: response.repository.description,
          visibility: response.repository.visibility,
          created: new Date(response.repository.createdAt).getTime(),
          lastModified: new Date(response.repository.updatedAt).getTime(),
          defaultBranch: 'main',
          branches: ['main']
        };
        
        storageCache.repositories.push(newRepo);
      }
    } catch (error) {
      console.error('Failed to save repository:', error);
      throw error;
    }
  },

  // Delete a repository
  deleteRepository: async function(repoName) {
    try {
      const repo = storageCache.repositories.find(r => r.name === repoName);
      if (repo && repo.id) {
        await apiRequest(`/${repo.id}`, { method: 'DELETE' });
      }
      
      // Remove from cache
      storageCache.repositories = storageCache.repositories.filter(r => r.name !== repoName);
      delete storageCache.repositoryFiles[repoName];
      delete storageCache.repositoryData[repoName];
    } catch (error) {
      console.error('Failed to delete repository:', error);
      throw error;
    }
  },

  // Get repository files from cache
  getRepositoryFiles: function(repoName) {
    return storageCache.repositoryFiles[repoName] || {};
  },

  // Save repository files to cache
  saveRepositoryFiles: function(repoName, files) {
    storageCache.repositoryFiles[repoName] = files;
  },

  // Get a specific file
  getFile: function(repoName, filePath) {
    const repoData = this.getRepositoryFiles(repoName);
    return repoData[filePath] || null;
  },

  // Save a file (creates or updates)
  saveFile: async function(repoName, filePath, fileData) {
    try {
      const repo = storageCache.repositories.find(r => r.name === repoName);
      if (!repo || !repo.id) {
        throw new Error('Repository not found');
      }
      
      // Check if file exists
      const existingFiles = storageCache.repositoryData[repoName] || [];
      const existingFile = existingFiles.find(f => f.filename === filePath);
      
      if (existingFile && existingFile.id) {
        // Update existing file
        await apiRequest(`/${repo.id}/files/${existingFile.id}`, {
          method: 'PUT',
          body: {
            content: fileData.content
          }
        });
      } else {
        // Create new file
        const response = await apiRequest(`/${repo.id}/files`, {
          method: 'POST',
          body: {
            filename: filePath,
            content: fileData.content || ''
          }
        });
        
        // Update cache with file info
        if (!storageCache.repositoryData[repoName]) {
          storageCache.repositoryData[repoName] = [];
        }
        storageCache.repositoryData[repoName].push(response.file);
      }
      
      // Update local cache
      const repoData = this.getRepositoryFiles(repoName);
      repoData[filePath] = fileData;
      this.saveRepositoryFiles(repoName, repoData);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  },

  // Delete a file
  deleteFile: async function(repoName, filePath) {
    try {
      const repo = storageCache.repositories.find(r => r.name === repoName);
      if (!repo || !repo.id) {
        throw new Error('Repository not found');
      }
      
      // Find file ID
      const files = storageCache.repositoryData[repoName] || [];
      const file = files.find(f => f.filename === filePath);
      
      if (file && file.id) {
        await apiRequest(`/${repo.id}/files/${file.id}`, { method: 'DELETE' });
        
        // Remove from cache
        storageCache.repositoryData[repoName] = files.filter(f => f.id !== file.id);
      }
      
      // Remove from local cache
      const repoData = this.getRepositoryFiles(repoName);
      delete repoData[filePath];
      this.saveRepositoryFiles(repoName, repoData);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  },

  // List files in a repository (with folder support)
  listFiles: async function(repoName, pathPrefix = '') {
    try {
      const repo = storageCache.repositories.find(r => r.name === repoName);
      if (!repo || !repo.id) {
        return [];
      }
      
      // Fetch files from server
      const response = await apiRequest(`/${repo.id}/files`);
      const serverFiles = response.files || [];
      
      // Cache server file data
      storageCache.repositoryData[repoName] = serverFiles;
      
      // Also populate the local cache for getFile calls
      for (const file of serverFiles) {
        const contentResponse = await apiRequest(`/${repo.id}/content/${file.id}`);
        const repoData = this.getRepositoryFiles(repoName);
        repoData[file.filename] = {
          content: contentResponse.content || '',
          size: file.size || 0,
          lastModified: new Date(file.updatedAt).getTime(),
          lastCommit: 'Server file',
          category: 'General',
          tags: []
        };
        this.saveRepositoryFiles(repoName, repoData);
      }
      
      // Build file list structure
      const files = [];
      const folders = new Set();

      serverFiles.forEach(file => {
        const filePath = file.filename;
        
        if (pathPrefix === '') {
          const parts = filePath.split('/');
          if (parts.length === 1) {
            files.push({
              name: parts[0],
              type: 'file',
              path: filePath,
              id: file.id,
              lastModified: new Date(file.updatedAt).getTime(),
              lastCommit: 'Server file',
              size: file.size || 0
            });
          } else if (parts.length > 1) {
            folders.add(parts[0]);
          }
        } else {
          if (filePath.startsWith(pathPrefix)) {
            const relativePath = filePath.substring(pathPrefix.length);
            const parts = relativePath.split('/');
            
            if (parts.length === 1 && parts[0]) {
              files.push({
                name: parts[0],
                type: 'file',
                path: filePath,
                id: file.id,
                lastModified: new Date(file.updatedAt).getTime(),
                lastCommit: 'Server file',
                size: file.size || 0
              });
            } else if (parts.length > 1 && parts[0]) {
              folders.add(parts[0]);
            }
          }
        }
      });

      folders.forEach(folderName => {
        files.push({
          name: folderName,
          type: 'folder',
          path: pathPrefix + folderName + '/',
          lastModified: Date.now(),
          lastCommit: 'Folder'
        });
      });

      return files.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  },
  
  // Refresh data from server
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