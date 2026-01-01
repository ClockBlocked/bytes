// ============================================
// Icon Vault - Main Application
// With Lazy Loading & Performance Optimizations
// ============================================

// State
let searchQuery = '';
let activeCategory = 'all';
let selectedIcon = null;
let selectedSize = 48;
let selectedColor = 'currentColor';
let customColor = '#58a6ff';

// Lazy Loading State
let visibleIconsCount = 0;
const ICONS_PER_BATCH = 50; // Number of icons to load per batch
const SCROLL_THRESHOLD = 300; // Pixels from bottom to trigger load
let isLoading = false;
let filteredIconsCache = [];
let renderRequestId = null;

// Constants
const ICON_SIZES = [16, 24, 32, 48, 64];
const PRESET_COLORS = [
    { name: 'Default', value: 'currentColor' },
    { name:  'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#58a6ff' },
    { name:  'Green', value: '#3fb950' },
    { name: 'Red', value: '#f85149' },
    { name: 'Orange', value: '#d29922' },
    { name: 'Purple', value: '#a371f7' }
];

// DOM Elements
let searchInput;
let resultCountEl;
let categoryTabsContainer;
let showingCountEl;
let categoryLabelEl;
let activeCategoryNameEl;
let iconGridEl;
let emptyStateEl;
let loadingIndicator;
let iconModal;
let modalBackdrop;
let closeModalBtn;
let modalIconName;
let modalIconCategory;
let iconPreview;
let sizeOptionsEl;
let colorOptionsEl;
let customColorPicker;
let customColorValue;
let tagsSection;
let tagsList;
let svgCodePreview;
let toast;
let toastTitle;
let toastDescription;

// ============================================
// Utility Functions
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(... args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(... args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getFilteredIcons() {
    const icons = getAllIcons();
    const query = searchQuery.toLowerCase();
    
    return icons.filter(icon => {
        const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
        if (!matchesCategory) return false;
        
        if (query === '') return true;
        
        // Check name
        if (icon.name.toLowerCase().includes(query)) return true;
        
        // Check tags
        for (let i = 0; i < icon.tags. length; i++) {
            if (icon.tags[i]. toLowerCase().includes(query)) return true;
        }
        
        return false;
    });
}

function getCategories() {
    const icons = getAllIcons();
    const categorySet = new Set();
    
    for (let i = 0; i < icons.length; i++) {
        categorySet.add(icons[i].category);
    }
    
    return Array. from(categorySet).sort((a, b) => {
        const labelA = categoryLabels[a] || a;
        const labelB = categoryLabels[b] || b;
        return labelA.localeCompare(labelB);
    });
}

function getIconCounts() {
    const icons = getAllIcons();
    const counts = { all: icons.length };
    
    // Initialize all category counts to 0
    Object.keys(categoryLabels).forEach(cat => {
        counts[cat] = 0;
    });
    
    // Count icons per category
    for (let i = 0; i < icons.length; i++) {
        const category = icons[i]. category;
        if (counts[category] !== undefined) {
            counts[category]++;
        } else {
            counts[category] = 1;
        }
    }
    
    return counts;
}

function getColoredSvg(svg, color) {
    if (color === 'currentColor') return svg;
    return svg
        .replace(/fill="currentColor"/g, `fill="${color}"`)
        .replace(/stroke="currentColor"/g, `stroke="${color}"`);
}

function getSizedSvg(svg, size) {
    let result = svg;
    if (result.includes('width="')) {
        result = result.replace(/width="[^"]*"/, `width="${size}"`);
    } else {
        result = result.replace('<svg', `<svg width="${size}"`);
    }
    if (result.includes('height="')) {
        result = result. replace(/height="[^"]*"/, `height="${size}"`);
    } else {
        result = result.replace('<svg', `<svg height="${size}"`);
    }
    return result;
}

function getModifiedSvg() {
    if (! selectedIcon) return '';
    let modifiedSvg = selectedIcon.svg;
    if (selectedColor !== 'currentColor') {
        modifiedSvg = getColoredSvg(modifiedSvg, selectedColor);
    }
    modifiedSvg = getSizedSvg(modifiedSvg, selectedSize);
    return modifiedSvg;
}

function showToast(title, description, isError = false) {
    toastTitle. textContent = title;
    toastDescription.textContent = description;
    
    const toastIcon = document.getElementById('toastIcon');
    if (isError) {
        toastIcon.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h. 01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else {
        toastIcon. innerHTML = `<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
    }
    
    toast.classList.remove('hidden');
    toast.classList.add('toast-enter');
    
    setTimeout(() => {
        toast.classList. remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.remove('toast-exit');
        }, 300);
    }, 3000);
}

// ============================================
// Lazy Loading / Virtualization
// ============================================

function createIconCard(icon, index) {
    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.style.animationDelay = `${Math.min((index % ICONS_PER_BATCH) * 10, 200)}ms`;
    
    const button = document.createElement('button');
    button.className = 'icon-card group flex flex-col items-center gap-3 w-full';
    button.setAttribute('data-icon-id', icon.id);
    button.setAttribute('aria-label', `View ${icon.name} icon`);
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'w-12 h-12 flex items-center justify-center text-foreground icon-svg transition-colors duration-200';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'text-xs text-muted-foreground icon-name transition-colors truncate max-w-full px-1';
    nameSpan.textContent = icon.name;
    
    button.appendChild(iconContainer);
    button.appendChild(nameSpan);
    div.appendChild(button);
    
    // Use Intersection Observer to lazy load the SVG
    return { element: div, iconContainer, svg: icon.svg, iconId: icon.id };
}

function renderIconBatch(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    const iconsToObserve = [];
    
    for (let i = startIndex; i < endIndex && i < filteredIconsCache. length; i++) {
        const icon = filteredIconsCache[i];
        const { element, iconContainer, svg, iconId } = createIconCard(icon, i);
        
        // Store reference for lazy SVG loading
        iconContainer.dataset.svg = svg;
        iconContainer.dataset. loaded = 'false';
        
        fragment.appendChild(element);
        iconsToObserve.push(iconContainer);
    }
    
    iconGridEl.appendChild(fragment);
    
    // Observe new icons for lazy SVG injection
    iconsToObserve.forEach(container => {
        svgObserver.observe(container);
    });
    
    // Add click handlers using event delegation (already set up)
    visibleIconsCount = endIndex;
}

function loadMoreIcons() {
    if (isLoading || visibleIconsCount >= filteredIconsCache. length) {
        hideLoadingIndicator();
        return;
    }
    
    isLoading = true;
    showLoadingIndicator();
    
    // Use requestAnimationFrame for smooth rendering
    if (renderRequestId) {
        cancelAnimationFrame(renderRequestId);
    }
    
    renderRequestId = requestAnimationFrame(() => {
        const endIndex = Math.min(visibleIconsCount + ICONS_PER_BATCH, filteredIconsCache.length);
        renderIconBatch(visibleIconsCount, endIndex);
        
        isLoading = false;
        
        if (visibleIconsCount >= filteredIconsCache.length) {
            hideLoadingIndicator();
        }
    });
}

function showLoadingIndicator() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
}

function hideLoadingIndicator() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

// Intersection Observer for lazy loading SVGs
let svgObserver;

function initSvgObserver() {
    svgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry. isIntersecting) {
                const container = entry.target;
                if (container.dataset. loaded === 'false' && container.dataset. svg) {
                    // Inject SVG when visible
                    container. innerHTML = container.dataset.svg;
                    container.dataset. loaded = 'true';
                    delete container.dataset.svg; // Free up memory
                }
                svgObserver.unobserve(container);
            }
        });
    }, {
        rootMargin: '100px', // Load slightly before visible
        threshold: 0
    });
}

// Scroll handler for infinite loading
const handleScroll = throttle(() => {
    const scrollTop = window. pageYOffset || document.documentElement. scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document. documentElement.clientHeight;
    
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        loadMoreIcons();
    }
}, 100);

// ============================================
// Render Functions
// ============================================

function renderCategoryTabs() {
    const categories = getCategories();
    const iconCounts = getIconCounts();
    
    const fragment = document.createDocumentFragment();
    
    // All tab
    const allBtn = document.createElement('button');
    allBtn.dataset.category = 'all';
    allBtn.className = `category-tab ${activeCategory === 'all' ? 'category-tab-active' : 'category-tab-inactive'}`;
    allBtn.innerHTML = `
        All
        <span class="text-xs px-1. 5 py-0.5 rounded ${activeCategory === 'all' ? 'bg-primary-foreground/20' : 'bg-muted'}">
            ${iconCounts.all}
        </span>
    `;
    fragment.appendChild(allBtn);
    
    // Category tabs
    categories.forEach(category => {
        const label = categoryLabels[category] || category;
        const count = iconCounts[category] || 0;
        
        const btn = document.createElement('button');
        btn.dataset.category = category;
        btn.className = `category-tab whitespace-nowrap ${activeCategory === category ?  'category-tab-active' : 'category-tab-inactive'}`;
        btn.innerHTML = `
            ${label}
            <span class="text-xs px-1.5 py-0.5 rounded ${activeCategory === category ? 'bg-primary-foreground/20' :  'bg-muted'}">
                ${count}
            </span>
        `;
        fragment.appendChild(btn);
    });
    
    categoryTabsContainer.innerHTML = '';
    categoryTabsContainer.appendChild(fragment);
}

function resetAndRenderIconGrid() {
    // Cancel any pending renders
    if (renderRequestId) {
        cancelAnimationFrame(renderRequestId);
    }
    
    // Reset state
    visibleIconsCount = 0;
    isLoading = false;
    
    // Update filtered icons cache
    filteredIconsCache = getFilteredIcons();
    
    // Clear grid
    iconGridEl.innerHTML = '';
    
    if (filteredIconsCache.length === 0) {
        iconGridEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        emptyStateEl.classList.add('flex');
        hideLoadingIndicator();
        return;
    }
    
    iconGridEl.classList. remove('hidden');
    emptyStateEl.classList.add('hidden');
    emptyStateEl.classList.remove('flex');
    
    // Render first batch
    loadMoreIcons();
}

function updateStats() {
    showingCountEl.textContent = filteredIconsCache. length;
    
    if (activeCategory !== 'all') {
        categoryLabelEl.classList.remove('hidden');
        categoryLabelEl.classList.add('flex');
        activeCategoryNameEl.textContent = categoryLabels[activeCategory] || activeCategory;
    } else {
        categoryLabelEl.classList.add('hidden');
        categoryLabelEl.classList.remove('flex');
    }
    
    if (searchQuery) {
        resultCountEl.textContent = `${filteredIconsCache.length} found`;
        resultCountEl.classList.remove('hidden');
    } else {
        resultCountEl.classList.add('hidden');
    }
}

function renderSizeOptions() {
    const fragment = document.createDocumentFragment();
    
    ICON_SIZES. forEach(size => {
        const btn = document.createElement('button');
        btn.dataset.size = size;
        btn.className = `px-2.5 py-1 text-xs rounded-md transition-colors ${
            selectedSize === size
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`;
        btn.textContent = `${size}px`;
        fragment.appendChild(btn);
    });
    
    sizeOptionsEl.innerHTML = '';
    sizeOptionsEl.appendChild(fragment);
}

function renderColorOptions() {
    const fragment = document.createDocumentFragment();
    
    PRESET_COLORS.forEach(color => {
        const btn = document.createElement('button');
        btn.dataset.color = color. value;
        btn. className = `flex items-center gap-1. 5 px-2 py-1 text-xs rounded-md transition-colors ${
            selectedColor === color.value
                ?  'bg-primary text-primary-foreground'
                :  'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`;
        
        if (color.value !== 'currentColor') {
            const colorDot = document.createElement('span');
            colorDot.className = 'w-3 h-3 rounded-full border border-border';
            colorDot.style.backgroundColor = color.value;
            btn.appendChild(colorDot);
        }
        
        btn.appendChild(document.createTextNode(color.name));
        fragment.appendChild(btn);
    });
    
    colorOptionsEl.innerHTML = '';
    colorOptionsEl.appendChild(fragment);
}

function renderTags() {
    if (! selectedIcon || selectedIcon.tags.length === 0) {
        tagsSection.classList.add('hidden');
        return;
    }
    
    tagsSection.classList. remove('hidden');
    
    const fragment = document.createDocumentFragment();
    selectedIcon.tags. forEach(tag => {
        const span = document.createElement('span');
        span.className = 'text-xs px-2 py-0.5 bg-secondary rounded-md text-muted-foreground';
        span.textContent = tag;
        fragment.appendChild(span);
    });
    
    tagsList.innerHTML = '';
    tagsList. appendChild(fragment);
}

function updateModalPreview() {
    if (!selectedIcon) return;
    
    const displaySize = Math.min(selectedSize, 64);
    const activeColor = selectedColor === 'currentColor' ? 'hsl(210, 16%, 73%)' : selectedColor;
    
    iconPreview.style.width = `${displaySize}px`;
    iconPreview.style.height = `${displaySize}px`;
    iconPreview.style. color = activeColor;
    iconPreview. innerHTML = getSizedSvg(selectedIcon.svg, displaySize);
    
    svgCodePreview. textContent = getModifiedSvg();
}

// ============================================
// Modal Functions
// ============================================

function openModal(icon) {
    selectedIcon = icon;
    selectedSize = 48;
    selectedColor = 'currentColor';
    
    modalIconName. textContent = icon. name;
    modalIconCategory.textContent = categoryLabels[icon. category] || icon.category;
    modalIconCategory.className = `text-xs px-2 py-0.5 rounded-full ${categoryColors[icon.category] || ''}`;
    
    renderSizeOptions();
    renderColorOptions();
    renderTags();
    updateModalPreview();
    
    iconModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    iconModal.classList.add('hidden');
    document.body.style. overflow = '';
    selectedIcon = null;
}

// ============================================
// Copy/Download Functions
// ============================================

async function copySvg() {
    try {
        await navigator.clipboard.writeText(getModifiedSvg());
        showToast('Copied! ', 'SVG code copied to clipboard');
    } catch (err) {
        showToast('Failed to copy', 'Please try again', true);
    }
}

async function copyDataUri() {
    try {
        const svg = getModifiedSvg();
        const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
        await navigator. clipboard.writeText(dataUri);
        showToast('Copied!', 'Data URI copied to clipboard');
    } catch (err) {
        showToast('Failed to copy', 'Please try again', true);
    }
}

async function copyJsComponent() {
    if (!selectedIcon) return;
    
    try {
        const componentName = selectedIcon.name
            .split('-')
            .map(word => word. charAt(0).toUpperCase() + word.slice(1))
            .join('');
        
        const svgContent = getModifiedSvg();
        
        const component = `// ${componentName} Icon Component
function ${componentName}Icon(props) {
    const defaultProps = {
        width: ${selectedSize},
        height: ${selectedSize},
        ... props
    };
    
    const container = document.createElement('div');
    container.innerHTML = \`${svgContent}\`;
    const svg = container.firstChild;
    
    Object.keys(defaultProps).forEach(key => {
        if (key === 'className') {
            svg.setAttribute('class', defaultProps[key]);
        } else {
            svg.setAttribute(key, defaultProps[key]);
        }
    });
    
    return svg;
}

// Usage:  document.body.appendChild(${componentName}Icon({ className: 'my-icon' }));`;
        
        await navigator.clipboard.writeText(component);
        showToast('Copied!', 'JavaScript component copied to clipboard');
    } catch (err) {
        showToast('Failed to copy', 'Please try again', true);
    }
}

function downloadSvg() {
    if (!selectedIcon) return;
    
    const blob = new Blob([getModifiedSvg()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a. download = `${selectedIcon.name}-${selectedIcon.category}-${selectedSize}px.svg`;
    document.body. appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded!', `${selectedIcon.name}. svg has been downloaded`);
}

function downloadPng() {
    if (!selectedIcon) return;
    
    const svg = getModifiedSvg();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const scale = 2;
    canvas.width = selectedSize * scale;
    canvas.height = selectedSize * scale;
    
    img.onload = () => {
        if (ctx) {
            ctx.drawImage(img, 0, 0, selectedSize * scale, selectedSize * scale);
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a. href = url;
                    a.download = `${selectedIcon.name}-${selectedIcon.category}-${selectedSize}px. png`;
                    document.body.appendChild(a);
                    a.click();
                    document. body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showToast('Downloaded!', `${selectedIcon.name}.png has been downloaded`);
                }
            }, 'image/png');
        }
    };
    
    img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ============================================
// Event Handlers Setup
// ============================================

function setupEventListeners() {
    // Debounced search input
    const debouncedSearch = debounce(() => {
        resetAndRenderIconGrid();
        updateStats();
    }, 150);
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        debouncedSearch();
    });
    
    // Keyboard shortcut for search (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        if (e.key === 'Escape' && ! iconModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Category tabs - event delegation
    categoryTabsContainer.addEventListener('click', (e) => {
        const btn = e.target. closest('button[data-category]');
        if (btn) {
            activeCategory = btn.dataset.category;
            renderCategoryTabs();
            resetAndRenderIconGrid();
            updateStats();
        }
    });
    
    // Icon grid - event delegation
    iconGridEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-icon-id]');
        if (btn) {
            const iconId = btn.dataset.iconId;
            const icon = getAllIcons().find(i => i.id === iconId);
            if (icon) {
                openModal(icon);
            }
        }
    });
    
    // Modal close handlers
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Size options - event delegation
    sizeOptionsEl.addEventListener('click', (e) => {
        const btn = e. target.closest('button[data-size]');
        if (btn) {
            selectedSize = parseInt(btn.dataset.size);
            renderSizeOptions();
            updateModalPreview();
        }
    });
    
    // Color options - event delegation
    colorOptionsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-color]');
        if (btn) {
            selectedColor = btn.dataset.color;
            renderColorOptions();
            updateModalPreview();
        }
    });
    
    // Custom color picker
    customColorPicker.addEventListener('input', (e) => {
        customColor = e.target.value;
        customColorValue. textContent = customColor;
        selectedColor = customColor;
        renderColorOptions();
        updateModalPreview();
    });
    
    // Copy buttons
    document.getElementById('copySvgBtn').addEventListener('click', copySvg);
    document.getElementById('copyDataUriBtn').addEventListener('click', copyDataUri);
    document.getElementById('copyJsBtn').addEventListener('click', copyJsComponent);
    
    // Download buttons
    document.getElementById('downloadSvgBtn').addEventListener('click', downloadSvg);
    document.getElementById('downloadPngBtn').addEventListener('click', downloadPng);
    
    // Scroll handler for infinite loading
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also check on resize in case viewport changes
    window.addEventListener('resize', throttle(() => {
        if (visibleIconsCount < filteredIconsCache.length) {
            handleScroll();
        }
    }, 250), { passive: true });
}

// ============================================
// Initialize Application
// ============================================

function cacheDOMElements() {
    searchInput = document.getElementById('searchInput');
    resultCountEl = document. getElementById('resultCount');
    categoryTabsContainer = document. getElementById('categoryTabs');
    showingCountEl = document.getElementById('showingCount');
    categoryLabelEl = document.getElementById('categoryLabel');
    activeCategoryNameEl = document.getElementById('activeCategoryName');
    iconGridEl = document.getElementById('iconGrid');
    emptyStateEl = document.getElementById('emptyState');
    loadingIndicator = document.getElementById('loadingIndicator');
    iconModal = document.getElementById('iconModal');
    modalBackdrop = document. getElementById('modalBackdrop');
    closeModalBtn = document. getElementById('closeModal');
    modalIconName = document.getElementById('modalIconName');
    modalIconCategory = document.getElementById('modalIconCategory');
    iconPreview = document. getElementById('iconPreview');
    sizeOptionsEl = document.getElementById('sizeOptions');
    colorOptionsEl = document. getElementById('colorOptions');
    customColorPicker = document.getElementById('customColorPicker');
    customColorValue = document.getElementById('customColorValue');
    tagsSection = document. getElementById('tagsSection');
    tagsList = document. getElementById('tagsList');
    svgCodePreview = document.getElementById('svgCodePreview');
    toast = document.getElementById('toast');
    toastTitle = document. getElementById('toastTitle');
    toastDescription = document.getElementById('toastDescription');
}

function init() {
    cacheDOMElements();
    initSvgObserver();
    setupEventListeners();
    renderCategoryTabs();
    resetAndRenderIconGrid();
    updateStats();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure all icon files have registered their icons
        setTimeout(init, 50);
    });
} else {
    setTimeout(init, 50);
}