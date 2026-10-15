import React from 'react'
import { render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MuiDatePickerApp from '../../resources/js/react/MuiDatePickerApp'

beforeEach(() => {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })
})
afterEach(cleanup)

function dayInMonth(day) {
    return within(screen.getByRole('dialog'))
        .getAllByRole('gridcell', { name: day })
        .find(
            (cell) => !cell.classList.contains('MuiPickersDay-dayOutsideMonth'),
        )
}

describe.each([
    ['plain', {}],
    ['clearable', { clearable: true }],
])('touch device, %s', (_, extra) => {
    it('commits a full date picked on a touch screen', async () => {
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

        await user.click(screen.getByRole('textbox'))
        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: '1990',
            }),
        )
        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: 'March',
            }),
        )
        await user.click(dayInMonth('7'))
        const ok = within(screen.getByRole('dialog')).queryByRole('button', {
            name: /^ok$/i,
        })
        if (ok) await user.click(ok)

        expect(onChange).toHaveBeenLastCalledWith('1990-03-07')
    })
})
