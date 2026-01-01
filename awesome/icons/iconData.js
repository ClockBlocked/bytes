// Icon Categories
const IconCategory = {
    SOLID:  'solid',
    REGULAR: 'regular',
    LIGHT:  'light',
    DUOTONE_SOLID: 'duotone-solid',
    DUOTONE_REGULAR: 'duotone-regular',
    DUOTONE_LIGHT: 'duotone-light',
    BRANDS: 'brands'
};

// Category Labels
const categoryLabels = {
    'solid': 'Solid',
    'regular': 'Regular',
    'light': 'Light',
    'duotone-solid': 'Duotone Solid',
    'duotone-regular': 'Duotone Regular',
    'duotone-light': 'Duotone Light',
    'brands': 'Brands'
};

// Category Colors (CSS classes)
const categoryColors = {
    'solid': 'badge-solid',
    'regular': 'badge-regular',
    'light': 'badge-light',
    'duotone-solid': 'badge-duotone-solid',
    'duotone-regular': 'badge-duotone-regular',
    'duotone-light':  'badge-duotone-light',
    'brands':  'badge-brands'
};

// This will hold all icons combined from the separate files
// Each icon file will push its icons to this array
const allIcons = [];

// Function to register icons from external files
function registerIcons(icons) {
    if (Array.isArray(icons)) {
        allIcons.push(... icons);
    }
}

// Function to get all icons (call this after all icon files have loaded)
function getAllIcons() {
    return allIcons;
}
