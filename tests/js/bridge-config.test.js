import { afterEach, describe, expect, it } from 'vitest'
import { flushObservers, makeBridge, stubReact } from './bridge-helpers'

afterEach(() => {
    document.body.innerHTML = ''
    delete window.MuiDatePickerReact
})

describe('Alpine bridge: config from the server', () => {
    it('mounts React with the config rendered by the server', () => {
        const { mount } = stubReact()
        const { component } = makeBridge({
            config: { minDate: '2024-01-01', format: 'DD/MM/YYYY' },
            state: '2024-02-01',
        })

        component.init()

        expect(mount).toHaveBeenCalledTimes(1)
        expect(mount.mock.calls[0][1]).toMatchObject({
            minDate: '2024-01-01',
            format: 'DD/MM/YYYY',
            value: '2024-02-01',
        })
    })

    it('passes a re-rendered config to the mounted picker without remounting', async () => {
        const { instance, mount } = stubReact()
        const bridge = makeBridge({
            config: { minDate: '2024-01-01', disabled: true },
            state: '2024-02-01',
        })
        bridge.component.init()

        bridge.setConfig({
            minDate: '2024-03-01',
            disabled: false,
            error: true,
        })
        await flushObservers()

        expect(mount).toHaveBeenCalledTimes(1)
        expect(instance.update).toHaveBeenLastCalledWith(
            expect.objectContaining({
                minDate: '2024-03-01',
                disabled: false,
                error: true,
                value: '2024-02-01',
            }),
        )
    })

    it('stops watching the config once destroyed', async () => {
        const { instance } = stubReact()
        const bridge = makeBridge({ config: { minDate: '2024-01-01' } })
        bridge.component.init()
        bridge.component.destroy()

        bridge.setConfig({ minDate: '2024-03-01' })
        await flushObservers()

        expect(instance.update).not.toHaveBeenCalled()
    })
})
