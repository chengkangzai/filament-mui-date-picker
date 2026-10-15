import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeBridge, stubReact } from './bridge-helpers'

beforeEach(() => {
    vi.useFakeTimers()
    delete window.MuiDatePickerReact
})

afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
    delete window.MuiDatePickerReact
})

describe('Alpine bridge: waiting for the React bundle', () => {
    it('mounts once the bundle arrives', () => {
        const bridge = makeBridge()
        bridge.component.init()

        vi.advanceTimersByTime(1000)
        const { mount } = stubReact()
        vi.advanceTimersByTime(100)

        expect(mount).toHaveBeenCalledTimes(1)
    })

    it('stops polling when the component is destroyed', () => {
        const bridge = makeBridge()
        bridge.component.init()
        bridge.component.destroy()

        const { mount } = stubReact()
        vi.advanceTimersByTime(1000)

        expect(mount).not.toHaveBeenCalled()
        expect(vi.getTimerCount()).toBe(0)
    })

    it('gives up after about ten seconds, logs an error and shows a plain date input', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {})
        const bridge = makeBridge({
            config: { id: 'form.date', name: 'data.date', required: true },
            state: '2024-02-01',
        })
        bridge.component.init()

        vi.advanceTimersByTime(9000)
        expect(error).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1100)

        expect(error).toHaveBeenCalledTimes(1)
        expect(vi.getTimerCount()).toBe(0)

        const input = bridge.reactContainer.querySelector('input[type="date"]')
        expect(input).not.toBeNull()
        expect(input.id).toBe('form.date')
        expect(input.value).toBe('2024-02-01')
        expect(input.required).toBe(true)
        expect(bridge.reactContainer.textContent).toMatch(
            /could not be loaded/i,
        )

        input.value = '2024-03-05'
        input.dispatchEvent(new Event('change'))

        expect(bridge.wire.$set).toHaveBeenCalledWith(
            'data.date',
            '2024-03-05',
            false,
        )
    })
})
