import React from 'react'
import { render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MuiDatePickerApp from '../../resources/js/react/MuiDatePickerApp'

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-10-15T10:00:00') })
})
afterEach(() => {
    vi.useRealTimers()
    cleanup()
})

function renderPicker(extra = {}) {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
        <MuiDatePickerApp
            config={{
                value: null,
                format: 'DD/MM/YYYY',
                openTo: 'year',
                maxDate: '2008-10-15',
                locale: 'en',
                ...extra,
            }}
            onChange={onChange}
            onOpen={() => {}}
            onClose={() => {}}
        />,
    )

    return { onChange, user }
}

const dialog = () => screen.getByRole('dialog')

function dayInMonth(day) {
    return within(dialog())
        .getAllByRole('gridcell', { name: day })
        .find(
            (cell) => !cell.classList.contains('MuiPickersDay-dayOutsideMonth'),
        )
}

describe('deliberate selections', () => {
    it('commits the day that was already highlighted when it is clicked', async () => {
        const { onChange, user } = renderPicker()
        await user.click(screen.getByRole('button', { name: /choose date/i }))

        await user.click(within(dialog()).getByRole('radio', { name: '1990' }))
        await user.click(within(dialog()).getByRole('radio', { name: 'March' }))
        await user.click(dayInMonth('15'))

        expect(onChange).toHaveBeenLastCalledWith('1990-03-15')
    })

    it('does not commit a guessed date when the Today button is enabled but not clicked', async () => {
        const { onChange, user } = renderPicker({
            showTodayButton: true,
            maxDate: '2030-12-31',
        })
        await user.click(screen.getByRole('button', { name: /choose date/i }))

        await user.click(within(dialog()).getByRole('radio', { name: '2026' }))
        await user.keyboard('{Escape}')

        expect(onChange).not.toHaveBeenCalled()
    })

    it('commits today when the Today button is clicked', async () => {
        const { onChange, user } = renderPicker({
            showTodayButton: true,
            maxDate: '2030-12-31',
        })
        await user.click(screen.getByRole('button', { name: /choose date/i }))

        await user.click(
            within(dialog()).getByRole('button', { name: /today/i }),
        )

        expect(onChange).toHaveBeenLastCalledWith('2026-10-15')
    })

    it('forgets a picked day once the user goes back and changes the year', async () => {
        const { onChange, user } = renderPicker({
            closeOnSelect: false,
            openTo: 'day',
            value: '1985-06-20',
        })
        await user.click(screen.getByRole('button', { name: /choose date/i }))

        await user.click(dayInMonth('21'))
        await user.click(
            within(dialog()).getByRole('button', {
                name: /calendar view is open, switch to year view/i,
            }),
        )
        await user.click(within(dialog()).getByRole('radio', { name: '1990' }))
        await user.keyboard('{Escape}')

        expect(onChange).not.toHaveBeenCalledWith('1990-06-21')
    })

    it('does not commit a year-only pick in the static variant', async () => {
        const { onChange, user } = renderPicker({ variant: 'static' })

        await user.click(screen.getByRole('radio', { name: '1990' }))

        expect(onChange).not.toHaveBeenCalled()
    })

    it('commits a full date in the static variant', async () => {
        const { onChange, user } = renderPicker({ variant: 'static' })

        await user.click(screen.getByRole('radio', { name: '1990' }))
        await user.click(screen.getByRole('radio', { name: 'March' }))
        await user.click(
            screen
                .getAllByRole('gridcell', { name: '7' })
                .find(
                    (c) =>
                        !c.classList.contains('MuiPickersDay-dayOutsideMonth'),
                ),
        )

        expect(onChange).toHaveBeenLastCalledWith('1990-03-07')
    })

    it('commits a complete typed date even when it is out of range, so the server can reject it with a message', async () => {
        const { onChange, user } = renderPicker({
            maxDate: '2008-10-15',
            value: '1990-03-07',
        })

        await user.click(screen.getByRole('textbox'))
        await user.keyboard('07032015')

        expect(onChange).toHaveBeenLastCalledWith('2015-03-07')
        expect(onChange.mock.calls.flat()).not.toContain('0201-03-07')
    })

    it('never leaves the previous date saved while the typed date is unfinished', async () => {
        const { onChange, user } = renderPicker({ value: '1990-03-07' })

        await user.click(screen.getByRole('textbox'))
        await user.keyboard('{Control>}a{/Control}{Backspace}0703')

        expect(onChange).toHaveBeenLastCalledWith(null)
    })
})
