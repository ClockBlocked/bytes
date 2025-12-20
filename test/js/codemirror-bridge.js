class CodeMirrorBridge {
    constructor(options = {}) {
        this.manager = options.manager || repoManager;
        this.editor = null;
        this.editorContainer = options.container || '#code-editor';
        this.readOnly = options.readOnly || false;
        this.theme = options.theme || 'default';
        this.changeDebounceMs = options.changeDebounceMs || 500;
        this.changeTimeout = null;
        this.initialized = false;
        this.languageModes = {
            'javascript': 'javascript',
            'js': 'javascript',
            'jsx': 'jsx',
            'typescript': 'text/typescript',
            'ts': 'text/typescript',
            'tsx': 'text/typescript-jsx',
            'html': 'htmlmixed',
            'htm': 'htmlmixed',
            'css': 'css',
            'scss': 'text/x-scss',
            'sass': 'text/x-sass',
            'less': 'text/x-less',
            'json': 'application/json',
            'xml': 'xml',
            'svg': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'markdown': 'markdown',
            'md': 'markdown',
            'php': 'php',
            'python': 'python',
            'py': 'python',
            'ruby': 'ruby',
            'rb': 'ruby',
            'java': 'text/x-java',
            'c': 'text/x-csrc',
            'cpp': 'text/x-c++src',
            'csharp': 'text/x-csharp',
            'cs': 'text/x-csharp',
            'go': 'go',
            'rust': 'rust',
            'rs': 'rust',
            'swift': 'swift',
            'kotlin': 'text/x-kotlin',
            'kt': 'text/x-kotlin',
            'scala': 'text/x-scala',
            'sql': 'sql',
            'shell': 'shell',
            'bash': 'shell',
            'sh': 'shell',
            'powershell': 'powershell',
            'ps1': 'powershell',
            'dockerfile': 'dockerfile',
            'plaintext': 'text/plain',
            'txt': 'text/plain',
            'vue': 'vue',
            'svelte': 'svelte',
            'graphql': 'graphql',
            'gql': 'graphql',
            'toml': 'toml',
            'ini': 'properties',
            'apache': 'apache'
        };
    }

    init(editorInstance = null) {
        if (editorInstance) {
            this.editor = editorInstance;
        } else {
            this.initializeDefaultEditor();
        }
        
        this.setupEventListeners();
        this.initialized = true;
        return this;
    }

    initializeDefaultEditor() {
        const container = document.querySelector(this.editorContainer);
        
        if (!container) {
            console.error('Editor container not found:', this.editorContainer);
            return;
        }

        if (typeof CodeMirror === 'undefined') {
            console.error('CodeMirror not loaded');
            return;
        }

        this.editor = CodeMirror(container, {
            value: '',
            mode: 'text/plain',
            theme: this.theme,
            lineNumbers: true,
            lineWrapping: true,
            readOnly: this.readOnly,
            tabSize: 2,
            indentWithTabs: false,
            autoCloseBrackets: true,
            autoCloseTags: true,
            matchBrackets: true,
            matchTags: { bothTags: true },
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            styleActiveLine: true,
            scrollbarStyle: 'overlay',
            extraKeys: {
                'Ctrl-S': () => this.saveCurrentFile(),
                'Cmd-S': () => this.saveCurrentFile(),
                'Ctrl-/': 'toggleComment',
                'Cmd-/': 'toggleComment',
                'Tab': (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        cm.replaceSelection(cm.getOption('indentWithTabs') ? '\t' : 
                            Array(cm.getOption('tabSize') + 1).join(' '), 'end');
                    }
                }
            }
        });
    }

    setupEventListeners() {
        if (!this.editor) return;

        this.editor.on('change', (cm, change) => {
            if (change.origin === 'setValue') return;
            
            clearTimeout(this.changeTimeout);
            this.changeTimeout = setTimeout(() => {
                this.handleContentChange(cm.getValue());
            }, this.changeDebounceMs);
        });

        this.manager.on('fileSelected', (file) => {
            this.loadFile(file);
        });

        this.manager.on('fileSaved', (file) => {
            this.onFileSaved(file);
        });

        this.manager.on('fileDeleted', () => {
            this.clear();
        });

        this.manager.on('reset', () => {
            this.clear();
        });
    }

    handleContentChange(content) {
        const currentFile = this.manager.getCurrentFile();
        
        if (!currentFile) return;
        
        this.manager.markFileChanged(currentFile.id, content);
    }

    loadFile(file) {
        if (!this.editor) return;

        const content = file.content ?? '';
        const mode = this.getModeForLanguage(file.language);

        this.editor.setValue(content);
        this.editor.setOption('mode', mode);
        this.editor.setOption('readOnly', this.readOnly);
        
        this.editor.clearHistory();
        this.editor.setCursor(0, 0);
        this.editor.scrollTo(0, 0);
        this.editor.refresh();
    }

    getModeForLanguage(language) {
        const lang = (language || 'plaintext').toLowerCase();
        return this.languageModes[lang] || 'text/plain';
    }

    async loadFileById(fileId) {
        try {
            const file = await this.manager.selectFile(fileId);
            return file;
        } catch (error) {
            console.error('Failed to load file:', error);
            throw error;
        }
    }

    async saveCurrentFile() {
        const currentFile = this.manager.getCurrentFile();
        
        if (!currentFile || !this.editor) {
            return null;
        }

        const content = this.editor.getValue();
        
        try {
            const updated = await this.manager.updateFile(currentFile.id, { content });
            return updated;
        } catch (error) {
            console.error('Failed to save file:', error);
            throw error;
        }
    }

    onFileSaved(file) {
        console.log('File saved:', file.filename);
    }

    getValue() {
        return this.editor ? this.editor.getValue() : '';
    }

    setValue(content) {
        if (this.editor) {
            this.editor.setValue(content);
        }
    }

    clear() {
        if (this.editor) {
            this.editor.setValue('');
            this.editor.setOption('mode', 'text/plain');
            this.editor.clearHistory();
        }
    }

    setReadOnly(readOnly) {
        this.readOnly = readOnly;
        if (this.editor) {
            this.editor.setOption('readOnly', readOnly);
        }
    }

    setTheme(theme) {
        this.theme = theme;
        if (this.editor) {
            this.editor.setOption('theme', theme);
        }
    }

    setMode(mode) {
        if (this.editor) {
            this.editor.setOption('mode', mode);
        }
    }

    setModeForFilename(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mode = this.languageModes[ext] || 'text/plain';
        this.setMode(mode);
    }

    focus() {
        if (this.editor) {
            this.editor.focus();
        }
    }

    refresh() {
        if (this.editor) {
            this.editor.refresh();
        }
    }

    getCursor() {
        return this.editor ? this.editor.getCursor() : { line: 0, ch: 0 };
    }

    setCursor(line, ch) {
        if (this.editor) {
            this.editor.setCursor(line, ch);
        }
    }

    getSelection() {
        return this.editor ? this.editor.getSelection() : '';
    }

    replaceSelection(text) {
        if (this.editor) {
            this.editor.replaceSelection(text);
        }
    }

    getLineCount() {
        return this.editor ? this.editor.lineCount() : 0;
    }

    goToLine(line) {
        if (this.editor) {
            this.editor.setCursor(line - 1, 0);
            this.editor.scrollIntoView({ line: line - 1, ch: 0 }, 100);
        }
    }

    find(query, options = {}) {
        if (!this.editor) return null;

        const cursor = this.editor.getSearchCursor(
            query,
            options.from || this.editor.getCursor(),
            { caseFold: !options.caseSensitive }
        );

        if (cursor.findNext()) {
            this.editor.setSelection(cursor.from(), cursor.to());
            this.editor.scrollIntoView({ from: cursor.from(), to: cursor.to() });
            return cursor;
        }

        return null;
    }

    replace(query, replacement, options = {}) {
        if (!this.editor) return false;

        const cursor = this.find(query, options);
        
        if (cursor) {
            this.editor.replaceRange(replacement, cursor.from(), cursor.to());
            return true;
        }

        return false;
    }

    replaceAll(query, replacement, options = {}) {
        if (!this.editor) return 0;

        let count = 0;
        const cursor = this.editor.getSearchCursor(
            query,
            { line: 0, ch: 0 },
            { caseFold: !options.caseSensitive }
        );

        while (cursor.findNext()) {
            cursor.replace(replacement);
            count++;
        }

        return count;
    }

    formatCode() {
        if (!this.editor) return;

        const content = this.editor.getValue();
        const mode = this.editor.getOption('mode');

        if (mode === 'application/json') {
            try {
                const formatted = JSON.stringify(JSON.parse(content), null, 2);
                this.editor.setValue(formatted);
            } catch (e) {
                console.warn('Failed to format JSON:', e);
            }
        }
    }

    getStats() {
        if (!this.editor) {
            return { lines: 0, characters: 0, words: 0 };
        }

        const content = this.editor.getValue();
        
        return {
            lines: this.editor.lineCount(),
            characters: content.length,
            words: content.trim() ? content.trim().split(/\s+/).length : 0
        };
    }

    addKeymap(key, handler) {
        if (this.editor) {
            const extraKeys = this.editor.getOption('extraKeys') || {};
            extraKeys[key] = handler;
            this.editor.setOption('extraKeys', extraKeys);
        }
    }

    getEditor() {
        return this.editor;
    }

    destroy() {
        clearTimeout(this.changeTimeout);
        
        if (this.editor) {
            this.editor.toTextArea();
            this.editor = null;
        }
        
        this.initialized = false;
    }
}

const cmBridge = new CodeMirrorBridge();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CodeMirrorBridge, cmBridge };
}
