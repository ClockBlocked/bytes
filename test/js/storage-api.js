const GITHUB_TOKEN = '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';
const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
    constructor(options = {}) {
        this.token = options.token || GITHUB_TOKEN;
        this.timeout = options.timeout || 30000;
        this.headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
        this.onError = options.onError || null;
        this.onRequest = options.onRequest || null;
        this.onResponse = options.onResponse || null;
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 60000;
    }

    async request(endpoint, options = {}) {
        const url = `${GITHUB_API_BASE}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const config = {
            method: options.method || 'GET',
            headers: { ...this.headers, ...options. headers },
            signal: controller. signal
        };

        if (options.body && config.method !== 'GET') {
            config.body = JSON.stringify(options.body);
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
                this.onResponse({ url, status: response.status, data });
            }

            if (! response.ok) {
                throw new GitHubAPIError(
                    data.message || 'Request failed',
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
            
            if (this.onError) {
                this.onError(networkError);
            }
            
            throw networkError;
        }
    }

    getCached(key) {
        const cached = this.cache.get(key);
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
        if (!pattern) {
            this.cache.clear();
            return;
        }
        
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this. cache.delete(key);
            }
        }
    }

    async listRepositories(options = {}) {
        const params = new URLSearchParams();
        
        if (options.type) params.append('type', options.type);
        if (options.sort) params.append('sort', options.sort);
        if (options.direction) params.append('direction', options.direction);
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);

        const query = params.toString();
        const endpoint = `/user/repos${query ?  `?${query}` : ''}`;
        const cacheKey = `repos:${query}`;

        if (options.useCache !== false) {
            const cached = this.getCached(cacheKey);
            if (cached) return cached;
        }

        const result = await this.request(endpoint);
        this.setCache(cacheKey, result);
        return result;
    }

    async getRepository(owner, repo, options = {}) {
        const cacheKey = `repo:${owner}:${repo}`;

        if (options.useCache !== false) {
            const cached = this.getCached(cacheKey);
            if (cached) return cached;
        }

        const result = await this.request(`/repos/${owner}/${repo}`);
        this.setCache(cacheKey, result);
        return result;
    }

    async createRepository(data) {
        this.clearCache('repos');

        return this.request('/user/repos', {
            method:  'POST',
            body: {
                name: data.name,
                description: data.description || '',
                private: data.private || false,
                auto_init: true
            }
        });
    }

    async updateRepository(owner, repo, data) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache('repos');

        return this.request(`/repos/${owner}/${repo}`, {
            method: 'PATCH',
            body: {
                name: data.name || undefined,
                description: data. description || undefined,
                private:  data.private || undefined,
                has_wiki: data.has_wiki !== undefined ? data.has_wiki :  undefined,
                has_issues: data.has_issues !== undefined ? data.has_issues : undefined,
                has_projects: data.has_projects !== undefined ? data.has_projects : undefined
            }
        });
    }

    async deleteRepository(owner, repo) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache('repos');

        return this.request(`/repos/${owner}/${repo}`, {
            method: 'DELETE'
        });
    }

    async listRepositoryContents(owner, repo, path = '') {
        const cacheKey = `repo:${owner}:${repo}:contents: ${path}`;
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
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache(`repo:${owner}:${repo}:contents`);

        const message = data.message || `Create ${path}`;
        const content = btoa(unescape(encodeURIComponent(data.content || '')));

        return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            body: {
                message:  message,
                content: content,
                branch: data.branch || 'main'
            }
        });
    }

    async updateFile(owner, repo, path, data) {
        this.clearCache(`repo:${owner}:${repo}`);
        this.clearCache(`repo:${owner}:${repo}:contents`);
        this.clearCache(`repo:${owner}:${repo}: file:${path}`);

        const fileInfo = await this.getFileContent(owner, repo, path);
        const message = data.message || `Update ${path}`;
        const content = btoa(unescape(encodeURIComponent(data.content || '')));

        return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            body: {
                message: message,
                content:  content,
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
            body:  {
                message: message,
                sha: fileInfo.sha,
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
        this.clearCache(`repo:${owner}:${repo}`);

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

        const endpoint = `/search/repositories?${params.toString()}`;
        return this.request(endpoint);
    }

    async getRateLimitStatus() {
        return this.request('/rate_limit');
    }

    async forkRepository(owner, repo, data = {}) {
        return this.request(`/repos/${owner}/${repo}/forks`, {
            method: 'POST',
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

    isNotFound() {
        return this. status === 404;
    }

    isValidationError() {
        return this. status === 400 || this.status === 422;
    }

    isServerError() {
        return this. status >= 500;
    }

    isNetworkError() {
        return this.status === 0;
    }

    isTimeout() {
        return this.status === 408;
    }

    isUnauthorized() {
        return this.status === 401;
    }

    isForbidden() {
        return this.status === 403;
    }
}

const githubAPI = new GitHubAPI({
    token: GITHUB_TOKEN,
    timeout: 30000,
    onError: (error) => {
        console.error('[GitHub API Error]', error. message, error.status);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GitHubAPI, GitHubAPIError, githubAPI };
}
