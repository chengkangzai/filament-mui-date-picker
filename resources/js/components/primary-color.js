export const DEFAULT_PRIMARY_COLOR = '#6366f1'

// Colours MUI's palette helpers (lighten, darken, alpha) can parse.
const MUI_COLOR = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i

// Filament 3 stored --primary-500 as an "r g b" triplet; Filament 4 and 5 use oklch(), which
// MUI cannot parse (createTheme throws on it). Resolve whatever is there to a colour MUI can
// use, or fall back to the default.
export function resolvePrimaryColor(root = document.documentElement) {
    const raw = getComputedStyle(root).getPropertyValue('--primary-500').trim()

    return toMuiColor(raw) ?? toMuiColor(probe(root)) ?? DEFAULT_PRIMARY_COLOR
}

function toMuiColor(value) {
    if (!value) return null

    const triplet = value.match(
        /^(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)$/,
    )
    if (triplet) return `rgb(${triplet.slice(1).join(', ')})`

    if (/^oklch\(/i.test(value)) return oklchToRgb(value)

    if (MUI_COLOR.test(value)) return value

    return null
}

// Let the browser resolve the variable (named colours, nested var(), etc.).
function probe(root) {
    if (!document.body) return null

    const el = document.createElement('span')
    el.style.display = 'none'
    el.style.color = 'var(--primary-500)'
    ;(root === document.documentElement ? document.body : root).appendChild(el)

    try {
        return getComputedStyle(el).color.trim() || null
    } finally {
        el.remove()
    }
}

export function oklchToRgb(value) {
    const match = value.match(
        /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/i,
    )

    if (!match) return null

    const lightness = Number(match[1]) / (match[2] ? 100 : 1)
    const chroma = match[4] ? (Number(match[3]) / 100) * 0.4 : Number(match[3])
    const hue = (Number(match[5]) * Math.PI) / 180

    const a = chroma * Math.cos(hue)
    const b = chroma * Math.sin(hue)

    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

    const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]

    const [red, green, blue] = linear.map((channel) => {
        const gamma =
            channel <= 0.0031308
                ? 12.92 * channel
                : 1.055 * channel ** (1 / 2.4) - 0.055

        return Math.round(Math.min(1, Math.max(0, gamma)) * 255)
    })

    return `rgb(${red}, ${green}, ${blue})`
}
