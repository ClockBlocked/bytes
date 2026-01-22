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
    constructor(...args) {

      console.log(`Method called: constructor`);

      console.log(`Method called: constructor with args:`, ...args);
        this.baseUrl = options.baseUrl || window.location.origin + '/' + API_BASE;
        this.timeout = options.timeout || 30000;
        this.onError = options.onError || null;
        this.onRequest = options.onRequest || null;
        this.onResponse = options.onResponse || null;
    }

    async request(...args) {
   console.log(`Method called: request`);
   console.log(`Method called: request with args:`, ...args);
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

        if(...args) {


          console.log(`Method called: if`);


          console.log(`Method called: if with args:`, ...args);
            config.body = JSON.stringify(options.body);
        }

        if(...args) {


          console.log(`Method called: if`);


          console.log(`Method called: if with args:`, ...args);
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

            if(...args) {


              console.log(`Method called: if`);


              console.log(`Method called: if with args:`, ...args);
                this.onResponse({ url, status: response.status, data });
            }

            if(...args) {


              console.log(`Method called: if`);


              console.log(`Method called: if with args:`, ...args);
                const error = new Error(data.error || data.message || 'Request failed');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data.data || data;
        } catch(...args) {
   console.log(`Method called: catch`);
   console.log(`Method called: catch with args:`, ...args);
            clearTimeout(timeoutId);

            if(...args) {


              console.log(`Method called: if`);


              console.log(`Method called: if with args:`, ...args);
                const timeoutError = new Error('Request timeout');
                timeoutError.status = 408;
                if (this.onError) this.onError(timeoutError);
                throw timeoutError;
            }

            if(...args) {


              console.log(`Method called: if`);


              console.log(`Method called: if with args:`, ...args);
                this.onError(error);
            }

            throw error;
        }
    }

    // Repository operations
    async listRepositories(...args) {
   console.log(`Method called: listRepositories`);
   console.log(`Method called: listRepositories with args:`, ...args);
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

    async getRepository(...args) {
   console.log(`Method called: getRepository`);
   console.log(`Method called: getRepository with args:`, ...args);
        const params = new URLSearchParams();
        if (options.includeContent) params.append('includeContent', 'true');
        const query = params.toString();
        return this.request(`/${repoId}${query ? '?' + query : ''}`);
    }

    async createRepository(...args) {
   console.log(`Method called: createRepository`);
   console.log(`Method called: createRepository with args:`, ...args);
        return this.request('', {
            method: 'POST',
            body: data
        });
    }

    async updateRepository(...args) {
   console.log(`Method called: updateRepository`);
   console.log(`Method called: updateRepository with args:`, ...args);
        return this.request(`/${repoId}`, {
            method: 'PUT',
            body: data
        });
    }

    async deleteRepository(...args) {
   console.log(`Method called: deleteRepository`);
   console.log(`Method called: deleteRepository with args:`, ...args);
        return this.request(`/${repoId}`, {
            method: 'DELETE'
        });
    }

    // File operations
    async listFiles(...args) {
   console.log(`Method called: listFiles`);
   console.log(`Method called: listFiles with args:`, ...args);
        return this.request(`/${repoId}/files`);
    }

    async getFile(...args) {
   console.log(`Method called: getFile`);
   console.log(`Method called: getFile with args:`, ...args);
        const params = new URLSearchParams();
        if (options.includeContent) params.append('includeContent', 'true');
        const query = params.toString();
        return this.request(`/${repoId}/files/${fileId}${query ? '?' + query : ''}`);
    }

    async getFileContent(...args) {
   console.log(`Method called: getFileContent`);
   console.log(`Method called: getFileContent with args:`, ...args);
        return this.request(`/${repoId}/content/${fileId}`);
    }

    async createFile(...args) {
   console.log(`Method called: createFile`);
   console.log(`Method called: createFile with args:`, ...args);
        return this.request(`/${repoId}/files`, {
            method: 'POST',
            body: data
        });
    }

    async updateFile(...args) {
   console.log(`Method called: updateFile`);
   console.log(`Method called: updateFile with args:`, ...args);
        return this.request(`/${repoId}/files/${fileId}`, {
            method: 'PUT',
            body: data
        });
    }

    async deleteFile(...args) {
   console.log(`Method called: deleteFile`);
   console.log(`Method called: deleteFile with args:`, ...args);
        return this.request(`/${repoId}/files/${fileId}`, {
            method: 'DELETE'
        });
    }

    // Star operations
    async starRepository(...args) {
   console.log(`Method called: starRepository`);
   console.log(`Method called: starRepository with args:`, ...args);
        return this.request(`/${repoId}/star`, {
            method: 'POST'
        });
    }

    async unstarRepository(...args) {
   console.log(`Method called: unstarRepository`);
   console.log(`Method called: unstarRepository with args:`, ...args);
        return this.request(`/${repoId}/star`, {
            method: 'DELETE'
        });
    }

    // View counter
    async incrementViews(...args) {
   console.log(`Method called: incrementViews`);
   console.log(`Method called: incrementViews with args:`, ...args);
        return this.request(`/${repoId}/view`, {
            method: 'POST'
        });
    }

    // Duplicate repository
    async duplicateRepository(...args) {
   console.log(`Method called: duplicateRepository`);
   console.log(`Method called: duplicateRepository with args:`, ...args);
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
