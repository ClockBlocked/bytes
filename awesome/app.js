// ============================================
// Icon Vault - Main Application
// ============================================

// State
let searchQuery = '';
let activeCategory = 'all';
let selectedIcon = null;
let selectedSize = 48;
let selectedColor = 'currentColor';
let customColor = '#58a6ff';

// Constants
const ICON_SIZES = [16, 24, 32, 48, 64];
const PRESET_COLORS = [
    { name: 'Default', value: 'currentColor' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#58a6ff' },
    { name:  'Green', value: '#3fb950' },
    { name: 'Red', value: '#f85149' },
    { name: 'Orange', value: '#d29922' },
    { name: 'Purple', value: '#a371f7' }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const resultCountEl = document.getElementById('resultCount');
const categoryTabsContainer = document. getElementById('categoryTabs');
const showingCountEl = document.getElementById('showingCount');
const categoryLabelEl = document. getElementById('categoryLabel');
const activeCategoryNameEl = document.getElementById('activeCategoryName');
const iconGridEl = document.getElementById('iconGrid');
const emptyStateEl = document.getElementById('emptyState');
const iconModal = document.getElementById('iconModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModal');
const modalIconName = document.getElementById('modalIconName');
const modalIconCategory = document.getElementById('modalIconCategory');
const iconPreview = document.getElementById('iconPreview');
const sizeOptionsEl = document.getElementById('sizeOptions');
const colorOptionsEl = document.getElementById('colorOptions');
const customColorPicker = document.getElementById('customColorPicker');
const customColorValue = document.getElementById('customColorValue');
const tagsSection = document.getElementById('tagsSection');
const tagsList = document.getElementById('tagsList');
const svgCodePreview = document.getElementById('svgCodePreview');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastDescription = document.getElementById('toastDescription');

// ============================================
// Utility Functions
// ============================================

function getFilteredIcons() {
    const icons = getAllIcons();
    return icons.filter(icon => {
        const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            icon. tags.some(tag => tag.toLowerCase().includes(searchQuery. toLowerCase()));
        return matchesCategory && matchesSearch;
    });
}

function getCategories() {
    const icons = getAllIcons();
    const uniqueCategories = [... new Set(icons. map(icon => icon.category))];
    return uniqueCategories. sort((a, b) => {
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
    icons. forEach(icon => {
        if (counts[icon.category] !== undefined) {
            counts[icon.category]++;
        } else {
            counts[icon.category] = 1;
        }
    });
    
    return counts;
}

function getColoredSvg(svg, color) {
    if (color === 'currentColor') return svg;
    return svg
        .replace(/fill="currentColor"/g, `fill="${color}"`)
        .replace(/stroke="currentColor"/g, `stroke="${color}"`);
}

function getSizedSvg(svg, size) {
    // Add width and height if not present, or replace existing
    let result = svg;
    if (result.includes('width="')) {
        result = result.replace(/width="[^"]*"/, `width="${size}"`);
    } else {
        result = result.replace('<svg', `<svg width="${size}"`);
    }
    if (result.includes('height="')) {
        result = result.replace(/height="[^"]*"/, `height="${size}"`);
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
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    const toastIcon = document.getElementById('toastIcon');
    if (isError) {
        toastIcon.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
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
// Render Functions
// ============================================

function renderCategoryTabs() {
    const categories = getCategories();
    const iconCounts = getIconCounts();
    
    let html = `
        <button 
            data-category="all"
            class="category-tab ${activeCategory === 'all' ? 'category-tab-active' : 'category-tab-inactive'}"
        >
            All
            <span class="text-xs px-1. 5 py-0.5 rounded ${activeCategory === 'all' ? 'bg-primary-foreground/20' : 'bg-muted'}">
                ${iconCounts.all}
            </span>
        </button>
    `;
    
    categories.forEach(category => {
        const label = categoryLabels[category] || category;
        const count = iconCounts[category] || 0;
        html += `
            <button 
                data-category="${category}"
                class="category-tab whitespace-nowrap ${activeCategory === category ?  'category-tab-active' : 'category-tab-inactive'}"
            >
                ${label}
                <span class="text-xs px-1.5 py-0.5 rounded ${activeCategory === category ? 'bg-primary-foreground/20' : 'bg-muted'}">
                    ${count}
                </span>
            </button>
        `;
    });
    
    categoryTabsContainer.innerHTML = html;
    
    // Add event listeners
    categoryTabsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.category;
            renderCategoryTabs();
            renderIconGrid();
            updateStats();
        });
    });
}

function renderIconGrid() {
    const filteredIcons = getFilteredIcons();
    
    if (filteredIcons.length === 0) {
        iconGridEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        emptyStateEl.classList.add('flex');
        return;
    }
    
    iconGridEl.classList.remove('hidden');
    emptyStateEl.classList.add('hidden');
    emptyStateEl.classList.remove('flex');
    
    let html = '';
    filteredIcons.forEach((icon, index) => {
        const delay = Math.min(index * 20, 500);
        html += `
            <div style="animation-delay: ${delay}ms" class="animate-fade-in opacity-0" style="animation-fill-mode: forwards;">
                <button
                    data-icon-id="${icon.id}"
                    class="icon-card group flex flex-col items-center gap-3 w-full"
                    aria-label="View ${icon.name} icon"
                >
                    <div class="w-12 h-12 flex items-center justify-center text-foreground icon-svg transition-colors duration-200">
                        ${icon.svg}
                    </div>
                    <span class="text-xs text-muted-foreground icon-name transition-colors truncate max-w-full px-1">
                        ${icon.name}
                    </span>
                </button>
            </div>
        `;
    });
    
    iconGridEl.innerHTML = html;
    
    // Add event listeners
    iconGridEl.querySelectorAll('button[data-icon-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const iconId = btn. dataset.iconId;
            const icons = getAllIcons();
            const icon = icons.find(i => i.id === iconId);
            if (icon) {
                openModal(icon);
            }
        });
    });
}

function updateStats() {
    const filteredIcons = getFilteredIcons();
    showingCountEl.textContent = filteredIcons.length;
    
    if (activeCategory !== 'all') {
        categoryLabelEl.classList.remove('hidden');
        categoryLabelEl.classList.add('flex');
        activeCategoryNameEl.textContent = categoryLabels[activeCategory] || activeCategory;
    } else {
        categoryLabelEl.classList.add('hidden');
        categoryLabelEl. classList.remove('flex');
    }
    
    // Update result count in search bar
    if (searchQuery) {
        resultCountEl.textContent = `${filteredIcons. length} found`;
        resultCountEl.classList.remove('hidden');
    } else {
        resultCountEl.classList.add('hidden');
    }
}

function renderSizeOptions() {
    let html = '';
    ICON_SIZES.forEach(size => {
        html += `
            <button
                data-size="${size}"
                class="px-2. 5 py-1 text-xs rounded-md transition-colors ${
                    selectedSize === size
                        ? 'bg-primary text-primary-foreground'
                        :  'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }"
            >
                ${size}px
            </button>
        `;
    });
    sizeOptionsEl.innerHTML = html;
    
    // Add event listeners
    sizeOptionsEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedSize = parseInt(btn.dataset. size);
            renderSizeOptions();
            updateModalPreview();
        });
    });
}

function renderColorOptions() {
    let html = '';
    PRESET_COLORS.forEach(color => {
        html += `
            <button
                data-color="${color. value}"
                class="flex items-center gap-1. 5 px-2 py-1 text-xs rounded-md transition-colors ${
                    selectedColor === color.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }"
            >
                ${color.value !== 'currentColor' ? `<span class="w-3 h-3 rounded-full border border-border" style="background-color: ${color.value}"></span>` : ''}
                ${color.name}
            </button>
        `;
    });
    colorOptionsEl.innerHTML = html;
    
    // Add event listeners
    colorOptionsEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedColor = btn.dataset.color;
            renderColorOptions();
            updateModalPreview();
        });
    });
}

function renderTags() {
    if (! selectedIcon || selectedIcon.tags.length === 0) {
        tagsSection.classList. add('hidden');
        return;
    }
    
    tagsSection.classList.remove('hidden');
    let html = '';
    selectedIcon.tags. forEach(tag => {
        html += `<span class="text-xs px-2 py-0.5 bg-secondary rounded-md text-muted-foreground">${tag}</span>`;
    });
    tagsList.innerHTML = html;
}

function updateModalPreview() {
    if (!selectedIcon) return;
    
    const displaySize = Math.min(selectedSize, 64);
    const activeColor = selectedColor === 'currentColor' ? 'hsl(210, 16%, 73%)' : selectedColor;
    
    iconPreview.style.width = `${displaySize}px`;
    iconPreview.style.height = `${displaySize}px`;
    iconPreview.style.color = activeColor;
    iconPreview.innerHTML = getSizedSvg(selectedIcon.svg, displaySize);
    
    // Update SVG code preview
    svgCodePreview.textContent = getModifiedSvg();
}

// ============================================
// Modal Functions
// ============================================

function openModal(icon) {
    selectedIcon = icon;
    selectedSize = 48;
    selectedColor = 'currentColor';
    
    // Update modal content
    modalIconName.textContent = icon.name;
    modalIconCategory. textContent = categoryLabels[icon. category] || icon. category;
    modalIconCategory.className = `text-xs px-2 py-0.5 rounded-full ${categoryColors[icon.category] || ''}`;
    
    renderSizeOptions();
    renderColorOptions();
    renderTags();
    updateModalPreview();
    
    // Show modal
    iconModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    iconModal. classList.add('hidden');
    document.body.style.overflow = '';
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
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        
        const svgContent = getModifiedSvg();
        
        const component = `// ${componentName} Icon Component
function ${componentName}Icon(props) {
    const defaultProps = {
        width: ${selectedSize},
        height:  ${selectedSize},
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
    if (! selectedIcon) return;
    
    const blob = new Blob([getModifiedSvg()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document. createElement('a');
    a.href = url;
    a.download = `${selectedIcon.name}-${selectedIcon.category}-${selectedSize}px.svg`;
    document.body.appendChild(a);
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
    
    const scale = 2; // 2x for better quality
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
// Event Listeners
// ============================================

// Search input
searchInput.addEventListener('input', (e) => {
    searchQuery = e. target.value;
    renderIconGrid();
    updateStats();
});

// Keyboard shortcut for search (Cmd/Ctrl + K)
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e. ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput. focus();
    }
    
    // Close modal on Escape
    if (e.key === 'Escape' && ! iconModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Modal close handlers
closeModalBtn. addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Custom color picker
customColorPicker.addEventListener('input', (e) => {
    customColor = e.target.value;
    customColorValue.textContent = customColor;
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

// ============================================
// Initialize Application
// ============================================

function init() {
    renderCategoryTabs();
    renderIconGrid();
    updateStats();
}

// Wait for DOM and all icon files to load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all icon files have registered their icons
    setTimeout(init, 100);
});

// Also initialize when called directly (for cases where DOMContentLoaded already fired)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
}
