class StorageMigration {
    constructor(options = {}) {
        this.api = options.api || storageAPI;
        this.localStorageKeys = options.localStorageKeys || {
            repos: 'github_clone_repos',
            files: 'github_clone_files',
            settings: 'github_clone_settings'
        };
        this.indexedDBName = options.indexedDBName || 'GitHubCloneDB';
        this.onProgress = options.onProgress || null;
        this.onError = options.onError || null;
        this.onComplete = options.onComplete || null;
    }

    async detectLocalData() {
        const result = {
            hasLocalStorage: false,
            hasIndexedDB: false,
            localStorage: {
                repos: [],
                files: [],
                totalSize: 0
            },
            indexedDB: {
                repos: [],
                files: [],
                totalSize: 0
            }
        };

        const lsRepos = localStorage.getItem(this.localStorageKeys.repos);
        if (lsRepos) {
            try {
                const parsed = JSON.parse(lsRepos);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    result.hasLocalStorage = true;
                    result.localStorage.repos = parsed;
                    result.localStorage.totalSize += lsRepos.length;
                }
            } catch (e) {
                console.warn('Failed to parse localStorage repos:', e);
            }
        }

        const lsFiles = localStorage.getItem(this.localStorageKeys.files);
        if (lsFiles) {
            try {
                const parsed = JSON.parse(lsFiles);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    result.localStorage.files = parsed;
                    result.localStorage.totalSize += lsFiles.length;
                }
            } catch (e) {
                console.warn('Failed to parse localStorage files:', e);
            }
        }

        try {
            const idbData = await this.readIndexedDB();
            if (idbData.repos.length > 0 || idbData.files.length > 0) {
                result.hasIndexedDB = true;
                result.indexedDB = idbData;
            }
        } catch (e) {
            console.warn('Failed to read IndexedDB:', e);
        }

        return result;
    }

    async readIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.indexedDBName);

            request.onerror = () => {
                resolve({ repos: [], files: [], totalSize: 0 });
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const result = { repos: [], files: [], totalSize: 0 };

                if (!db.objectStoreNames.contains('repos')) {
                    db.close();
                    resolve(result);
                    return;
                }

                const transaction = db.transaction(['repos', 'files'], 'readonly');

                const reposStore = transaction.objectStore('repos');
                const reposRequest = reposStore.getAll();

                reposRequest.onsuccess = () => {
                    result.repos = reposRequest.result || [];
                };

                if (db.objectStoreNames.contains('files')) {
                    const filesStore = transaction.objectStore('files');
                    const filesRequest = filesStore.getAll();

                    filesRequest.onsuccess = () => {
                        result.files = filesRequest.result || [];
                    };
                }

                transaction.oncomplete = () => {
                    db.close();
                    resolve(result);
                };

                transaction.onerror = () => {
                    db.close();
                    resolve(result);
                };
            };
        });
    }

    async migrateToServer(options = {}) {
        const source = options.source || 'localStorage';
        const clearAfterMigration = options.clearAfterMigration !== false;
        const skipExisting = options.skipExisting !== false;

        const localData = await this.detectLocalData();

        let repos, files;

        if (source === 'localStorage') {
            repos = localData.localStorage.repos;
            files = localData.localStorage.files;
        } else if (source === 'indexedDB') {
            repos = localData.indexedDB.repos;
            files = localData.indexedDB.files;
        } else if (source === 'all') {
            repos = [...localData.localStorage.repos, ...localData.indexedDB.repos];
            files = [...localData.localStorage.files, ...localData.indexedDB.files];
        }

        if (repos.length === 0) {
            this.emitProgress(100, 'No data to migrate');
            return { migrated: 0, skipped: 0, errors: [] };
        }

        const results = {
            migrated: 0,
            skipped: 0,
            errors: [],
            repos: []
        };

        const total = repos.length;

        for (let i = 0; i < repos.length; i++) {
            const repo = repos[i];
            const progress = Math.round((i / total) * 100);
            this.emitProgress(progress, `Migrating: ${repo.name || 'Untitled'}`);

            try {
                const repoFiles = this.findFilesForRepo(repo, files);

                const migratedRepo = await this.migrateRepository(repo, repoFiles, skipExisting);

                if (migratedRepo) {
                    results.migrated++;
                    results.repos.push(migratedRepo);
                } else {
                    results.skipped++;
                }
            } catch (error) {
                results.errors.push({
                    repo: repo.name || repo.id,
                    error: error.message
                });

                if (this.onError) {
                    this.onError(error, repo);
                }
            }
        }

        if (clearAfterMigration && results.errors.length === 0) {
            this.clearLocalData(source);
        }

        this.emitProgress(100, 'Migration complete');

        if (this.onComplete) {
            this.onComplete(results);
        }

        return results;
    }

    findFilesForRepo(repo, files) {
        if (repo.files && Array.isArray(repo.files)) {
            if (repo.files.length > 0 && typeof repo.files[0] === 'object') {
                return repo.files;
            }

            return files.filter(f => repo.files.includes(f.id));
        }

        return files.filter(f => f.repoId === repo.id);
    }

    async migrateRepository(localRepo, localFiles, skipExisting) {
        const repoData = this.normalizeRepoData(localRepo);
        const filesData = localFiles.map(f => this.normalizeFileData(f));

        repoData.files = filesData;

        try {
            const result = await this.api.createRepository(repoData);
            return result.data.repository;
        } catch (error) {
            if (error.status === 400 && skipExisting) {
                console.warn(`Skipping existing repo: ${repoData.name}`);
                return null;
            }
            throw error;
        }
    }

    normalizeRepoData(localRepo) {
        return {
            name: localRepo.name || localRepo.title || 'Untitled Repository',
            description: localRepo.description || localRepo.desc || '',
            visibility: localRepo.visibility || localRepo.isPublic ? 'public' : 'private',
            tags: localRepo.tags || localRepo.labels || []
        };
    }

    normalizeFileData(localFile) {
        return {
            filename: localFile.filename || localFile.name || localFile.title || 'untitled.txt',
            content: localFile.content || localFile.code || localFile.data || ''
        };
    }

    clearLocalData(source = 'all') {
        if (source === 'localStorage' || source === 'all') {
            Object.values(this.localStorageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
        }

        if (source === 'indexedDB' || source === 'all') {
            indexedDB.deleteDatabase(this.indexedDBName);
        }
    }

    emitProgress(percent, message) {
        if (this.onProgress) {
            this.onProgress(percent, message);
        }
    }

    async exportLocalDataAsJson() {
        const localData = await this.detectLocalData();

        const exportData = {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            source: 'local',
            repositories: []
        };

        const allRepos = [...localData.localStorage.repos, ...localData.indexedDB.repos];
        const allFiles = [...localData.localStorage.files, ...localData.indexedDB.files];

        for (const repo of allRepos) {
            const repoFiles = this.findFilesForRepo(repo, allFiles);

            exportData.repositories.push({
                ...this.normalizeRepoData(repo),
                files: repoFiles.map(f => this.normalizeFileData(f)),
                originalId: repo.id,
                originalCreatedAt: repo.createdAt,
                originalUpdatedAt: repo.updatedAt
            });
        }

        return exportData;
    }

    downloadLocalDataBackup() {
        this.exportLocalDataAsJson().then(data => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `local-data-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    async importFromJson(jsonData) {
        let data;

        if (typeof jsonData === 'string') {
            data = JSON.parse(jsonData);
        } else {
            data = jsonData;
        }

        const results = {
            imported: 0,
            errors: []
        };

        const repos = data.repositories || data.repos || [data];

        for (const repoData of repos) {
            try {
                await this.api.importRepository(repoData);
                results.imported++;
            } catch (error) {
                results.errors.push({
                    repo: repoData.name,
                    error: error.message
                });
            }
        }

        return results;
    }

    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const results = await this.importFromJson(data);
                    resolve(results);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}

class MigrationUI {
    constructor(migration) {
        this.migration = migration || new StorageMigration();
        this.modal = null;
    }

    async checkAndPrompt() {
        const localData = await this.migration.detectLocalData();

        if (!localData.hasLocalStorage && !localData.hasIndexedDB) {
            return false;
        }

        const totalRepos = localData.localStorage.repos.length + localData.indexedDB.repos.length;

        return this.showMigrationPrompt(totalRepos, localData);
    }

    showMigrationPrompt(repoCount, localData) {
        return new Promise((resolve) => {
            const confirmed = confirm(
                `Found ${repoCount} repository(ies) stored locally.\n\n` +
                `Would you like to migrate them to server storage?\n\n` +
                `Benefits:\n` +
                `• Access from any device\n` +
                `• Persistent storage\n` +
                `• Shareable links\n\n` +
                `Your local data will be backed up before migration.`
            );

            if (confirmed) {
                this.runMigration(localData).then(resolve);
            } else {
                resolve(false);
            }
        });
    }

    async runMigration(localData) {
        this.migration.downloadLocalDataBackup();

        this.migration.onProgress = (percent, message) => {
            console.log(`Migration: ${percent}% - ${message}`);
        };

        try {
            const results = await this.migration.migrateToServer({
                source: 'all',
                clearAfterMigration: true
            });

            alert(
                `Migration complete!\n\n` +
                `Migrated: ${results.migrated} repositories\n` +
                `Skipped: ${results.skipped}\n` +
                `Errors: ${results.errors.length}`
            );

            return results;
        } catch (error) {
            alert(`Migration failed: ${error.message}`);
            return null;
        }
    }
}

const storageMigration = new StorageMigration();
const migrationUI = new MigrationUI(storageMigration);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageMigration, MigrationUI, storageMigration, migrationUI };
}
