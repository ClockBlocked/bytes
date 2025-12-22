/**
 * API Client for server-side file storage
 * Provides interface to the PHP backend API for file and repository management
 * 
 * CREATED BY
 * William Hanson
 * Chevrolay@Outlook.com
 * m.me/Chevrolay
 */

const API_BASE = 'api/repos.php';

class StorageAPI {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || window.location.origin + '/' + API_BASE;
        this.timeout = options.timeout || 30000;
        this.onError = options.onError || null;
        this.onRequest = options.onRequest || null;
        this.onResponse = options.onResponse || null;
    }

    async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
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
                const error = new Error(data.error || data.message || 'Request failed');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data.data || data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                const timeoutError = new Error('Request timeout');
                timeoutError.status = 408;
                if (this.onError) this.onError(timeoutError);
                throw timeoutError;
            }

            if (this.onError) {
                this.onError(error);
            }

            throw error;
        }
    }

    // Repository operations
    async listRepositories(options = {}) {
        const params = new URLSearchParams();
        if (options.visibility) params.append('visibility', options.visibility);
        if (options.search) params.append('search', options.search);
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());

        const query = params.toString();
        const endpoint = query ? `?${query}` : '';
        return this.request(endpoint);
    }

    async getRepository(repoId, options = {}) {
        const params = new URLSearchParams();
        if (options.includeContent) params.append('includeContent', 'true');
        const query = params.toString();
        return this.request(`/${repoId}${query ? '?' + query : ''}`);
    }

    async createRepository(data) {
        return this.request('', {
            method: 'POST',
            body: data
        });
    }

    async updateRepository(repoId, data) {
        return this.request(`/${repoId}`, {
            method: 'PUT',
            body: data
        });
    }

    async deleteRepository(repoId) {
        return this.request(`/${repoId}`, {
            method: 'DELETE'
        });
    }

    // File operations
    async listFiles(repoId) {
        return this.request(`/${repoId}/files`);
    }

    async getFile(repoId, fileId, options = {}) {
        const params = new URLSearchParams();
        if (options.includeContent) params.append('includeContent', 'true');
        const query = params.toString();
        return this.request(`/${repoId}/files/${fileId}${query ? '?' + query : ''}`);
    }

    async getFileContent(repoId, fileId) {
        return this.request(`/${repoId}/content/${fileId}`);
    }

    async createFile(repoId, data) {
        return this.request(`/${repoId}/files`, {
            method: 'POST',
            body: data
        });
    }

    async updateFile(repoId, fileId, data) {
        return this.request(`/${repoId}/files/${fileId}`, {
            method: 'PUT',
            body: data
        });
    }

    async deleteFile(repoId, fileId) {
        return this.request(`/${repoId}/files/${fileId}`, {
            method: 'DELETE'
        });
    }

    // Star operations
    async starRepository(repoId) {
        return this.request(`/${repoId}/star`, {
            method: 'POST'
        });
    }

    async unstarRepository(repoId) {
        return this.request(`/${repoId}/star`, {
            method: 'DELETE'
        });
    }

    // View counter
    async incrementViews(repoId) {
        return this.request(`/${repoId}/view`, {
            method: 'POST'
        });
    }

    // Duplicate repository
    async duplicateRepository(repoId, newName = null) {
        return this.request(`/${repoId}/duplicate`, {
            method: 'POST',
            body: { name: newName }
        });
    }
}

// Create global instance
const storageAPI = new StorageAPI();

// Expose globally
window.StorageAPI = StorageAPI;
window.storageAPI = storageAPI;

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
