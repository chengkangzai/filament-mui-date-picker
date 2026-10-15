import { afterEach, describe, expect, it } from 'vitest'
import { makeBridge, stubReact } from './bridge-helpers'

afterEach(() => {
    document.body.innerHTML = ''
    delete window.MuiDatePickerReact
})

function pick(bridge, mount, value) {
    const { onChange } = mount.mock.calls[0][2]
    onChange(value)
}

describe('Alpine bridge: writing the picked date to Livewire', () => {
    it('writes a deferred field to $wire without sending a request', () => {
        const { mount } = stubReact()
        const bridge = makeBridge({ live: false })
        bridge.component.init()

        pick(bridge, mount, '2024-02-01')

        expect(bridge.wire.$set).toHaveBeenCalledTimes(1)
        expect(bridge.wire.$set).toHaveBeenCalledWith(
            'data.date',
            '2024-02-01',
            false,
        )
        expect(bridge.wire.set).not.toHaveBeenCalled()
    })

    it('sends a live field to the server straight away, once', () => {
        const { mount } = stubReact()
        const bridge = makeBridge({ live: true })
        bridge.component.init()

        pick(bridge, mount, '2024-02-01')

        expect(bridge.wire.$set).toHaveBeenCalledTimes(1)
        expect(bridge.wire.$set).toHaveBeenCalledWith(
            'data.date',
            '2024-02-01',
            true,
        )
        expect(bridge.wire.set).not.toHaveBeenCalled()
    })

    it('does not also write through the entangled state, which would send a second request', () => {
        const { mount } = stubReact()
        const bridge = makeBridge({ live: true, state: '2024-01-01' })
        bridge.component.init()

        pick(bridge, mount, '2024-02-01')

        expect(bridge.component.state).toBe('2024-01-01')
    })

    it('writes a cleared date as null', () => {
        const { mount } = stubReact()
        const bridge = makeBridge({ state: '2024-01-01' })
        bridge.component.init()

        pick(bridge, mount, null)

        expect(bridge.wire.$set).toHaveBeenCalledWith('data.date', null, false)
    })
})
