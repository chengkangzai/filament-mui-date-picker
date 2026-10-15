// MUI's DatePicker renders the desktop variant when `(pointer: fine)` matches.
window.matchMedia = (query) => ({
    matches: query.includes('pointer: fine'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
})
