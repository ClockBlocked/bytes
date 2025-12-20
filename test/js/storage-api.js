class StorageAPI {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '/api';
        this.timeout = options.timeout || 30000;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };
        this.onError = options.onError || null;
        this.onRequest = options.onRequest || null;
        this.onResponse = options.onResponse || null;
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 60000;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const config = {
            method: options.method || 'GET',
            headers: { ...this.headers, ...options.headers },
            signal: controller.signal
        };

        if (options.body && config.method !== 'GET') {
            config.body = JSON.stringify(options.body);
        }

        if (this.onRequest) {
            this.onRequest({ url, ...config });
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

            if (!response.ok) {
                const error = new StorageAPIError(
                    data.error || data.message || 'Request failed',
                    response.status,
                    data.errors || null
                );
                
                if (this.onError) {
                    this.onError(error);
                }
                
                throw error;
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                const timeoutError = new StorageAPIError('Request timeout', 408);
                if (this.onError) this.onError(timeoutError);
                throw timeoutError;
            }

            if (error instanceof StorageAPIError) {
                throw error;
            }

            const networkError = new StorageAPIError(
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
                this.cache.delete(key);
            }
        }
    }

    async listRepositories(options = {}) {
        const params = new URLSearchParams();
        
        if (options.visibility) params.append('visibility', options.visibility);
        if (options.ownerId) params.append('ownerId', options.ownerId);
        if (options.search) params.append('q', options.search);
        if (options.tags) params.append('tags', options.tags.join(','));
        if (options.sort) params.append('sort', options.sort);
        if (options.order) params.append('order', options.order);
        if (options.limit) params.append('limit', options.limit);
        if (options.offset) params.append('offset', options.offset);

        const query = params.toString();
        const endpoint = `/repos${query ? `?${query}` : ''}`;

        return this.request(endpoint);
    }

    async getRepository(repoId, options = {}) {
        const params = new URLSearchParams();
        
        if (options.includeContent) {
            params.append('content', 'true');
        }

        const query = params.toString();
        const cacheKey = `repo:${repoId}:${query}`;

        if (options.useCache !== false) {
            const cached = this.getCached(cacheKey);
            if (cached) return cached;
        }

        const endpoint = `/repos/${repoId}${query ? `?${query}` : ''}`;
        const result = await this.request(endpoint);

        this.setCache(cacheKey, result);
        return result;
    }

    async createRepository(data) {
        this.clearCache('repo');
        
        return this.request('/repos', {
            method: 'POST',
            body: {
                name: data.name,
                description: data.description || '',
                visibility: data.visibility || 'public',
                tags: data.tags || [],
                ownerId: data.ownerId || null,
                files: data.files || []
            }
        });
    }

    async updateRepository(repoId, data) {
        this.clearCache(`repo:${repoId}`);
        
        return this.request(`/repos/${repoId}`, {
            method: 'PATCH',
            body: data
        });
    }

    async deleteRepository(repoId) {
        this.clearCache(`repo:${repoId}`);
        
        return this.request(`/repos/${repoId}`, {
            method: 'DELETE'
        });
    }

    async duplicateRepository(repoId, newName = null) {
        return this.request(`/repos/${repoId}/duplicate`, {
            method: 'POST',
            body: newName ? { name: newName } : {}
        });
    }

    async starRepository(repoId) {
        return this.request(`/repos/${repoId}/star`, {
            method: 'POST'
        });
    }

    async unstarRepository(repoId) {
        return this.request(`/repos/${repoId}/star`, {
            method: 'DELETE'
        });
    }

    async recordView(repoId) {
        return this.request(`/repos/${repoId}/view`, {
            method: 'POST'
        });
    }

    async listFiles(repoId) {
        return this.request(`/repos/${repoId}/files`);
    }

    async getFile(repoId, fileId, options = {}) {
        const params = new URLSearchParams();
        
        if (options.includeContent) {
            params.append('content', 'true');
        }

        const query = params.toString();
        const endpoint = `/repos/${repoId}/files/${fileId}${query ? `?${query}` : ''}`;

        return this.request(endpoint);
    }

    async getFileContent(repoId, fileId) {
        const endpoint = `/repos/${repoId}/files/${fileId}/content`;
        return this.request(endpoint);
    }

    async getRawContent(repoId, fileId) {
        const url = `${this.baseUrl}/repos/${repoId}/raw/${fileId}`;
        
        const response = await fetch(url, {
            headers: this.headers
        });

        if (!response.ok) {
            throw new StorageAPIError('Failed to fetch raw content', response.status);
        }

        return response.text();
    }

    async createFile(repoId, data) {
        this.clearCache(`repo:${repoId}`);
        
        return this.request(`/repos/${repoId}/files`, {
            method: 'POST',
            body: {
                filename: data.filename,
                content: data.content || ''
            }
        });
    }

    async updateFile(repoId, fileId, data) {
        this.clearCache(`repo:${repoId}`);
        
        return this.request(`/repos/${repoId}/files/${fileId}`, {
            method: 'PATCH',
            body: data
        });
    }

    async deleteFile(repoId, fileId) {
        this.clearCache(`repo:${repoId}`);
        
        return this.request(`/repos/${repoId}/files/${fileId}`, {
            method: 'DELETE'
        });
    }

    async search(query, options = {}) {
        const params = new URLSearchParams({ q: query });
        
        if (options.limit) params.append('limit', options.limit);
        if (options.offset) params.append('offset', options.offset);

        return this.request(`/search?${params.toString()}`);
    }

    async getStats() {
        return this.request('/stats');
    }

    async importRepository(repositoryData, ownerId = null) {
        return this.request('/import', {
            method: 'POST',
            body: {
                repository: repositoryData,
                ownerId
            }
        });
    }

    getExportUrl(repoId, format = 'json') {
        return `${this.baseUrl}/export.php?id=${repoId}&format=${format}`;
    }

    async exportRepository(repoId, format = 'json') {
        const url = this.getExportUrl(repoId, format);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new StorageAPIError('Export failed', response.status);
        }

        if (format === 'json') {
            return response.json();
        }

        return response.blob();
    }

    downloadExport(repoId, format = 'json') {
        const url = this.getExportUrl(repoId, format);
        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

class StorageAPIError extends Error {
    constructor(message, status, errors = null) {
        super(message);
        this.name = 'StorageAPIError';
        this.status = status;
        this.errors = errors;
    }

    isNotFound() {
        return this.status === 404;
    }

    isValidationError() {
        return this.status === 400;
    }

    isServerError() {
        return this.status >= 500;
    }

    isNetworkError() {
        return this.status === 0;
    }

    isTimeout() {
        return this.status === 408;
    }
}

const storageAPI = new StorageAPI({
    baseUrl: '/api',
    timeout: 30000,
    onError: (error) => {
        console.error('[StorageAPI Error]', error.message, error.status);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageAPI, StorageAPIError, storageAPI };
}
