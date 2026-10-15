import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolvePrimaryColor } from '../../resources/js/components/primary-color'
import { buildTheme } from '../../resources/js/react/theme'

afterEach(() => {
    document.documentElement.style.removeProperty('--primary-500')
    vi.restoreAllMocks()
})

function rgbParts(color) {
    const match = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/)
    expect(match, `${color} is not rgb()`).not.toBeNull()

    return match.slice(1).map(Number)
}

describe('primary colour', () => {
    it('converts a Filament 4/5 oklch() colour to rgb()', () => {
        // Tailwind's indigo-500, which is roughly rgb(97, 95, 255).
        document.documentElement.style.setProperty(
            '--primary-500',
            'oklch(0.585 0.233 277.117)',
        )

        const [r, g, b] = rgbParts(resolvePrimaryColor())

        expect(Math.abs(r - 97)).toBeLessThanOrEqual(3)
        expect(Math.abs(g - 95)).toBeLessThanOrEqual(3)
        expect(Math.abs(b - 255)).toBeLessThanOrEqual(3)
    })

    it('accepts oklch() with a percentage lightness and an alpha', () => {
        document.documentElement.style.setProperty(
            '--primary-500',
            'oklch(58.5% 0.233 277.117 / 0.5)',
        )

        expect(resolvePrimaryColor()).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
    })

    it('reads the legacy Filament 3 "r g b" triplet', () => {
        document.documentElement.style.setProperty(
            '--primary-500',
            '99 102 241',
        )

        expect(resolvePrimaryColor()).toBe('rgb(99, 102, 241)')
    })

    it('passes an rgb() or hex colour through', () => {
        document.documentElement.style.setProperty('--primary-500', '#f59e0b')

        expect(resolvePrimaryColor()).toBe('#f59e0b')
    })

    it('falls back to the default when the variable is missing', () => {
        expect(resolvePrimaryColor()).toBe('#6366f1')
    })

    it('falls back to the default for a colour it cannot read', () => {
        document.documentElement.style.setProperty(
            '--primary-500',
            'color-mix(in srgb, red, blue)',
        )

        expect(resolvePrimaryColor()).toBe('#6366f1')
    })
})

describe('theme', () => {
    it('falls back to the default primary colour instead of throwing on a colour MUI cannot parse', () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {})

        const theme = buildTheme('light', 'oklch(0.585 0.233 277.117)')

        expect(theme.palette.primary.main).toBe('#6366f1')
    })

    it('uses a valid primary colour', () => {
        expect(
            buildTheme('dark', 'rgb(97, 95, 255)').palette.primary.main,
        ).toBe('rgb(97, 95, 255)')
    })
})
