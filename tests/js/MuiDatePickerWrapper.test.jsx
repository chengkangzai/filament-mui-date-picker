import React from 'react'
import {
    render,
    screen,
    within,
    cleanup,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MuiDatePickerApp from '../../resources/js/react/MuiDatePickerApp'

afterEach(cleanup)

const birthdayConfig = (overrides = {}) => ({
    value: null,
    format: 'DD/MM/YYYY',
    openTo: 'year',
    minDate: '1926-10-15',
    maxDate: '2008-10-15',
    locale: 'en',
    ...overrides,
})

function renderPicker(config) {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
        <MuiDatePickerApp
            config={config}
            onChange={onChange}
            onOpen={() => {}}
            onClose={() => {}}
        />,
    )

    return { onChange, user }
}

function dayInMonth(day) {
    return within(screen.getByRole('dialog'))
        .getAllByRole('gridcell', { name: day })
        .find(
            (cell) => !cell.classList.contains('MuiPickersDay-dayOutsideMonth'),
        )
}

async function openPicker(user) {
    await user.click(screen.getByRole('button', { name: /choose date/i }))

    return screen.getByRole('dialog')
}

describe('committing a date to Livewire', () => {
    it('does not commit a date when only a year is picked', async () => {
        const { onChange, user } = renderPicker(birthdayConfig())
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('radio', { name: '1990' }))

        expect(onChange).not.toHaveBeenCalled()
    })

    it('does not commit a date when a year and month are picked and the picker is dismissed', async () => {
        const { onChange, user } = renderPicker(birthdayConfig())
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('radio', { name: '1990' }))
        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: 'March',
            }),
        )
        await user.keyboard('{Escape}')

        expect(onChange).not.toHaveBeenCalled()
    })

    it('commits the full date once a day is picked', async () => {
        const { onChange, user } = renderPicker(birthdayConfig())
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('radio', { name: '1990' }))
        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: 'March',
            }),
        )
        await user.click(dayInMonth('7'))

        expect(onChange).toHaveBeenLastCalledWith('1990-03-07')
        expect(onChange.mock.calls.flat()).not.toContain(
            expect.stringMatching(/^1990-(10|03)-15$/),
        )
    })

    it('keeps the previously saved date when a new year is picked and the picker is dismissed', async () => {
        const { onChange, user } = renderPicker(
            birthdayConfig({ value: '1985-06-20' }),
        )
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('radio', { name: '1990' }))
        await user.keyboard('{Escape}')

        expect(onChange).not.toHaveBeenCalled()
        expect(screen.getByRole('textbox')).toHaveProperty(
            'value',
            '20/06/1985',
        )
    })

    it('commits a date typed into the field', async () => {
        const { onChange, user } = renderPicker(birthdayConfig())

        await user.click(screen.getByRole('textbox'))
        await user.keyboard('07031990')

        expect(onChange).toHaveBeenLastCalledWith('1990-03-07')
    })

    it('commits an empty value when the date is cleared', async () => {
        const { onChange, user } = renderPicker(
            birthdayConfig({ value: '1985-06-20', clearable: true }),
        )
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('button', { name: /clear/i }))

        expect(onChange).toHaveBeenLastCalledWith(null)
    })

    it('commits once the last configured view is picked', async () => {
        const { onChange, user } = renderPicker(
            birthdayConfig({ views: ['year', 'month'], format: 'MM/YYYY' }),
        )
        const dialog = await openPicker(user)

        await user.click(within(dialog).getByRole('radio', { name: '1990' }))
        expect(onChange).not.toHaveBeenCalled()

        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: 'March',
            }),
        )
        expect(onChange).toHaveBeenLastCalledWith('1990-03-15')
    })

    it('commits on OK and discards on Cancel in the mobile variant', async () => {
        const { onChange, user } = renderPicker(
            birthdayConfig({ variant: 'mobile' }),
        )

        await user.click(screen.getByRole('textbox'))
        await user.click(
            within(screen.getByRole('dialog')).getByRole('radio', {
                name: '1990',
            }),
        )
        await user.click(
            within(screen.getByRole('dialog')).getByRole('button', {
                name: /cancel/i,
            }),
        )
        expect(onChange).not.toHaveBeenCalled()
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

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
        await user.click(
            within(screen.getByRole('dialog')).getByRole('button', {
                name: /ok/i,
            }),
        )
        expect(onChange).toHaveBeenLastCalledWith('1990-03-07')
    })
})
