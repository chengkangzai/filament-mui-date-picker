import { vi } from 'vitest'
import muiDatePickerFormComponent from '../../resources/js/components/mui-date-picker'

export function stubReact() {
    const instance = { update: vi.fn(), unmount: vi.fn() }
    window.MuiDatePickerReact = { mount: vi.fn(() => instance) }

    return { instance, mount: window.MuiDatePickerReact.mount }
}

export function stubWire() {
    return { $set: vi.fn(() => Promise.resolve()), set: vi.fn() }
}

// Builds the bridge the way the Blade view and Alpine do: the config lives in a
// data attribute outside the wire:ignore'd React container.
export function makeBridge({
    config = {},
    state = null,
    statePath = 'data.date',
    live = false,
    wire = stubWire(),
} = {}) {
    const root = document.createElement('div')
    const configEl = document.createElement('div')
    configEl.setAttribute('data-mui-date-picker-config', JSON.stringify(config))
    const reactContainer = document.createElement('div')
    root.append(configEl, reactContainer)
    document.body.append(root)

    const watchers = {}
    const component = muiDatePickerFormComponent({ state, statePath, live })

    Object.assign(component, {
        $el: root,
        $refs: { config: configEl, reactContainer },
        $wire: wire,
        $watch: (key, callback) => {
            watchers[key] = callback
        },
        $nextTick: (callback) => callback(),
    })

    return {
        component,
        root,
        configEl,
        reactContainer,
        wire,
        setState(value) {
            const old = component.state
            component.state = value
            watchers.state?.(value, old)
        },
        setConfig(next) {
            configEl.setAttribute(
                'data-mui-date-picker-config',
                JSON.stringify(next),
            )
        },
    }
}

export const flushObservers = () =>
    new Promise((resolve) => setTimeout(resolve, 0))
