import React from 'react'
import { createRoot } from 'react-dom/client'
import MuiDatePickerApp from './react/MuiDatePickerApp'

const roots = new WeakMap()

export function mount(el, config, callbacks) {
    if (roots.has(el)) {
        roots.get(el).unmount()
        roots.delete(el)
    }

    const root = createRoot(el)
    roots.set(el, root)

    root.render(
        <MuiDatePickerApp
            config={config}
            onChange={callbacks.onChange}
            onOpen={callbacks.onOpen}
            onClose={callbacks.onClose}
        />,
    )

    return {
        update(newConfig) {
            root.render(
                <MuiDatePickerApp
                    config={newConfig}
                    onChange={callbacks.onChange}
                    onOpen={callbacks.onOpen}
                    onClose={callbacks.onClose}
                />,
            )
        },
        unmount() {
            root.unmount()
            roots.delete(el)
        },
    }
}
