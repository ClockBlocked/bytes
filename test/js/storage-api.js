const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
    constructor(options = {}) {
        this.token = options.token || this.getStoredToken();
        this.timeout = options.timeout || 30000;
        this.headers = {
            'Authorization': this.token ? `token ${this.token}` : '',
            'Accept': 'application/vnd. github.v3+json',
            'Content-Type': 'application/json'
        };
        this.onError = options.onError || null;
        this. onRequest = options.onRequest || null;
        this.onResponse = options.onResponse || null;
        this.cache = new Map();
        this.cacheTimeout = options. cacheTimeout || 60000;
        this.initialized = false;
        this.initializing = false;
    }

    async initialize() {
        if (this.initialized) return true;
        if (this.initializing) {
            return new Promise(resolve => {
                const check = () => {
                    if (this.initialized) {
                        resolve(true);
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }
        
        this. initializing = true;
        
        try {
            if (! this.token) {
                await this. promptForToken();
            }
            
            if (!this. token) {
                throw new GitHubAPIError('GitHub token is required.  Please provide a valid token. ', 401);
            }
            
            const result = await this. requestWithoutInitialization('/rate_limit');
            console. log('Token validated, rate limit:', result);
            
            this.initialized = true;
            return true;
        } catch (error) {
            if (error.status === 401) {
                this.clearToken();
                throw new GitHubAPIError(
                    'Invalid GitHub token.  Please provide a valid token.',
                    401
                );
            }
            throw error;
        } finally {
            this. initializing = false;
        }
    }

    async promptForToken() {
        const storedToken = this. getStoredToken();
        if (storedToken) {
            this.setToken(storedToken);
            return;
        }

        const token = await this.showTokenPromptModal();
        
        if (token) {
            this. setToken(token);
            this.storeToken(token);
            return true;
        }
        
        return false;
    }

    async showTokenPromptModal() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top:  0;
                left: 0;
                width: 100%;
                height: 100%;
                background:  rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <h2 style="margin-top: 0; color: #333;">GitHub Authentication Required</h2>
                    
                    <p style="color: #666; margin-bottom: 20px;">
                        This application needs a GitHub Personal Access Token to access your repositories.
                    </p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius:  5px; margin-bottom: 20px;">
                        <h4 style="margin-top: 0; color: #333;">How to get a token:</h4>
                        <ol style="margin:  10px 0; padding-left: 20px; color: #666;">
                            <li>Go to <a href="https://github.com/settings/tokens" target="_blank" style="color: #0366d6;">GitHub Token Settings</a></li>
                            <li>Click "Generate new token (classic)"</li>
                            <li>Select these scopes: <code>repo</code>, <code>user</code></li>
                            <li>Click "Generate token" and copy it</li>
                        </ol>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom:  8px; font-weight: bold; color: #333;">
                            Your GitHub Token: 
                        </label>
                        <input type="password" 
                               id="github-token-input"
                               placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                               style="
                                   width: 100%;
                                   padding: 10px;
                                   border: 2px solid #ddd;
                                   border-radius: 5px;
                                   font-family: monospace;
                                   box-sizing: border-box;
                               ">
                        <div style="font-size: 12px; color: #999; margin-top:  5px;">
                            Your token is stored locally and never sent to our servers.
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap:  10px;">
                        <button id="cancel-btn" style="
                            padding: 10px 20px;
                            background: #f5f5f5;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            color: #666;
                        ">
                            Cancel
                        </button>
                        <button id="submit-btn" style="
                            padding:  10px 20px;
                            background: #28a745;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                            Save Token
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top:  1px solid #eee; font-size: 12px; color: #999;">
                        <strong>Note:</strong> This application runs entirely in your browser. 
                        Your token is only used to communicate with GitHub's API directly from your browser.
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const input = modal.querySelector('#github-token-input');
            const cancelBtn = modal.querySelector('#cancel-btn');
            const submitBtn = modal.querySelector('#submit-btn');
            
            input.focus();
            
            const cleanup = () => {
                document.body.removeChild(modal);
            };
            
            const submit = () => {
                const token = input.value.trim();
                if (token) {
                    resolve(token);
                    cleanup();
                } else {
                    input.style.borderColor = '#dc3545';
                    input.focus();
                }
            };
            
            cancelBtn. onclick = () => {
                resolve(null);
                cleanup();
            };
            
            submitBtn.onclick = submit;
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    submit();
                } else if (e. key === 'Escape') {
                    resolve(null);
                    cleanup();
                }
            };
        });
    }

    setToken(token) {
        this.token = token. trim();
        this.headers. Authorization = this.token ? `token ${this.token}` : '';
        this.cache.clear();
        this.initialized = false;
    }

    getStoredToken() {
        try {
            return localStorage.getItem('github_clone_token');
        } catch (e) {
            console.warn('Failed to read token from localStorage:', e);
            return null;
        }
    }

    storeToken(token) {
        try {
            localStorage.setItem('github_clone_token', token);
        } catch (e) {
            console.warn('Failed to store token in localStorage:', e);
        }
    }

    clearToken() {
        this.token = null;
        this.headers.Authorization = '';
        try {
            localStorage. removeItem('github_clone_token');
        } catch (e) {
            console.warn('Failed to clear token from localStorage:', e);
        }
        this.cache.clear();
        this.initialized = false;
    }

    async request(endpoint, options = {}) {
        if (! this.initialized && options.skipInitialization !== true) {
            await this.initialize();
        }
        
        const url = `${GITHUB_API_BASE}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const config = {
            method: options.method || 'GET',
            headers: { ...this.headers, ...options.headers },
            signal: controller.signal
        };

        if (options.body && config.method !== 'GET') {
            config.body = JSON. stringify(options.body);
        }

        if (this.onRequest) {
            this.onRequest({ url, ... config });
        }

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (this.onResponse) {
                this.onResponse({ url, status: response. status, data });
            }

            if (! response.ok) {
                throw new GitHubAPIError(
                    data. message || 'Request failed',
                    response.status,
                    data. errors || null
                );
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                const timeoutError = new GitHubAPIError('Request timeout', 408);
                if (this.onError) this.onError(timeoutError);
                throw timeoutError;
            }

            if (error instanceof GitHubAPIError) {
                throw error;
            }

            const networkError = new GitHubAPIError(
                error.message || 'Network error',
                0
            );
            
            if (this. onError) {
                this.onError(networkError);
            }
            
            throw networkError;
        }
    }

    async requestWithoutInitialization(endpoint, options = {}) {
        const url = `${GITHUB_API_BASE}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const config = {
            method: options. method || 'GET',
            headers:  { ...this.headers, ...options.headers },
            signal:  controller.signal
        };

        if (options.body && config.method !== 'GET') {
            config.body = JSON.stringify(options. body);
        }

        if (this.onRequest) {
            this.onRequest({ url, ... config });
        }

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            const contentType = response.headers. get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response. json();
            } else {
                data = await response.text();
            }

            if (this. onResponse) {
                this.onResponse({ url, status:  response.status, data });
            }

            if (!response. ok) {
                throw new GitHubAPIError(
                    data.message || 'Request failed',
                    response. status,
                    data.errors || null
                );
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                const timeoutError = new GitHubAPIError('Request timeout', 408);
                if (this.onError) this.onError(timeoutError);
                throw timeoutError;
            }

            if (error instanceof GitHubAPIError) {
                throw error;
            }

            const networkError = new GitHubAPIError(
                error.message || 'Network error',
                0
            );
            
            if (this. onError) {
                this.onError(networkError);
            }
            
            throw networkError;
        }
    }

    getCached(key) {
        const cached = this.cache. get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    clearCache(pattern = null) {
        if (! pattern) {
            this.cache.clear();
            return;
        }
        
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache. delete(key);
            }
        }
    }

    async listRepositories(options = {}) {
        const params = new URLSearchParams();
        
        if (options. type) params.append('type', options.type);
        if (options.sort) params.append('sort', options.sort);
        if (options. direction) params.append('direction', options.direction);
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);

        const query = params.toString();
        const endpoint = `/user/repos${query ? `?${query}` : ''}`;
        const cacheKey = `repos: ${query}`;

        if (options.useCache !== false) {
            const cached = this. getCached(cacheKey);
            if (cached) return cached;
        }

        const result = await this.request(endpoint);
        this.setCache(cacheKey, result);
        return result;
    }

    async getRepository(owner, repo, options = {}) {
        const cacheKey = `repo:${owner}: ${repo}`;

        if (options. useCache !== false) {
            const cached = this.getCached(cacheKey);
            if (cached) return cached;
        }

        const result = await this. request(`/repos/${owner}/${repo}`);
        this.setCache(cacheKey, result);
        return result;
    }

    async createRepository(data) {
        this.clearCache('repos');

        return this.request('/user/repos', {
            method: 'POST',
            body: {
                name: data.name,
                description: data.description || '',
                private: data.private || false,
                auto_init: true
            }
        });
    }

    async updateRepository(owner, repo, data) {
        this.clearCache(`repo:${owner}: ${repo}`);
        this.clearCache('repos');

        return this.request(`/repos/${owner}/${repo}`, {
            method:  'PATCH',
            body: {
                name: data.name || undefined,
                description:  data.description || undefined,
                private:  data.private || undefined,
                has_wiki: data.has_wiki !== undefined ? data.has_wiki : undefined,
                has_issues: data. has_issues !== undefined ? data.has_issues : undefined,
                has_projects:  data.has_projects !== undefined ? data. has_projects : undefined
            }
        });
    }

    async deleteRepository(owner, repo) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache('repos');

        return this. request(`/repos/${owner}/${repo}`, {
            method: 'DELETE'
        });
    }

    async listRepositoryContents(owner, repo, path = '') {
        const cacheKey = `repo:${owner}: ${repo}:contents: ${path}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const endpoint = path ? `/repos/${owner}/${repo}/contents/${path}` : `/repos/${owner}/${repo}/contents`;
        const result = await this.request(endpoint);
        this.setCache(cacheKey, result);
        return result;
    }

    async getFileContent(owner, repo, path) {
        const cacheKey = `repo:${owner}:${repo}:file:${path}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const result = await this.request(`/repos/${owner}/${repo}/contents/${path}`);
        this.setCache(cacheKey, result);
        return result;
    }

    async createFile(owner, repo, path, data) {
        this.clearCache(`repo:${owner}: ${repo}`);
        this.clearCache(`repo:${owner}:${repo}: contents`);

        const message = data.message || `Create ${path}`;
        const content = btoa(unescape(encodeURIComponent(data.content || '')));

        return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            body: {
                message: message,
                content: content,
                branch: data.branch || 'main'
            }
        });
    }

    async updateFile(owner, repo, path, data) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache(`repo:${owner}:${repo}:contents`);
        this.clearCache(`repo:${owner}:${repo}:file:${path}`);

        const fileInfo = await this.getFileContent(owner, repo, path);
        const message = data.message || `Update ${path}`;
        const content = btoa(unescape(encodeURIComponent(data.content || '')));

        return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            body: {
                message: message,
                content: content,
                sha: fileInfo.sha,
                branch: data.branch || 'main'
            }
        });
    }

    async deleteFile(owner, repo, path, data = {}) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache(`repo:${owner}:${repo}:contents`);
        this.clearCache(`repo:${owner}:${repo}:file:${path}`);

        const fileInfo = await this.getFileContent(owner, repo, path);
        const message = data.message || `Delete ${path}`;

        return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'DELETE',
            body: {
                message: message,
                sha:  fileInfo.sha,
                branch: data.branch || 'main'
            }
        });
    }

    async starRepository(owner, repo) {
        return this.request(`/user/starred/${owner}/${repo}`, {
            method: 'PUT'
        });
    }

    async unstarRepository(owner, repo) {
        this.clearCache(`repo:${owner}: ${repo}`);

        return this.request(`/user/starred/${owner}/${repo}`, {
            method: 'DELETE'
        });
    }

    async isRepositoryStarred(owner, repo) {
        try {
            await this.request(`/user/starred/${owner}/${repo}`);
            return true;
        } catch (error) {
            if (error.status === 404) {
                return false;
            }
            throw error;
        }
    }

    async searchRepositories(query, options = {}) {
        const params = new URLSearchParams({ q: query });
        
        if (options.sort) params.append('sort', options.sort);
        if (options.order) params.append('order', options.order);
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);

        const endpoint = `/search/repositories? ${params.toString()}`;
        return this.request(endpoint);
    }

    async getRateLimitStatus() {
        return this.requestWithoutInitialization('/rate_limit');
    }

    async forkRepository(owner, repo, data = {}) {
        return this.request(`/repos/${owner}/${repo}/forks`, {
            method:  'POST',
            body: {
                owner: data.owner || undefined,
                name: data.name || undefined,
                description: data.description || undefined
            }
        });
    }
}

class GitHubAPIError extends Error {
    constructor(message, status, errors = null) {
        super(message);
        this.name = 'GitHubAPIError';
        this.status = status;
        this.errors = errors;
    }
}

const githubAPI = new GitHubAPI({
    timeout: 30000,
    onError: (error) => {
        console.error('[GitHub API Error]', error. message, error.status);
        
        if (error.status === 401) {
            githubAPI.clearToken();
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right:  20px;
                background: #dc3545;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10001;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            notification.innerHTML = `
                <strong>Authentication Error</strong>
                <p>Your GitHub token is invalid or expired. Please enter a new token.</p>
                <button onclick="this.parentElement.remove(); githubAPI.promptForToken();" 
                        style="background: white; color: #dc3545; border:  none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">
                    Enter New Token
                </button>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }
    }
});

window.resetGitHubToken = function() {
    githubAPI.clearToken();
    githubAPI.promptForToken();
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GitHubAPI, GitHubAPIError, githubAPI };
}
