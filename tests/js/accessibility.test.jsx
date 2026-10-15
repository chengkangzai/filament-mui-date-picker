import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import MuiDatePickerApp from '../../resources/js/react/MuiDatePickerApp'

afterEach(cleanup)

function renderPicker(config) {
    return render(
        <>
            <label htmlFor="form.date">Date of birth</label>
            <MuiDatePickerApp
                config={{
                    value: null,
                    format: 'DD/MM/YYYY',
                    locale: 'en',
                    ...config,
                }}
                onChange={() => {}}
            />
        </>,
    )
}

describe('picker text field accessibility', () => {
    it('takes the Filament field id so the label names and focuses it', async () => {
        renderPicker({ id: 'form.date', name: 'data.date' })

        const textbox = screen.getByLabelText('Date of birth')

        expect(textbox).toBe(screen.getByRole('textbox'))
        expect(textbox.getAttribute('id')).toBe('form.date')
        expect(textbox.getAttribute('name')).toBe('data.date')

        await userEvent.setup().click(screen.getByText('Date of birth'))

        expect(document.activeElement).toBe(textbox)
    })

    it('reflects the validation error and describes itself by the error and helper text', () => {
        renderPicker({
            id: 'form.date',
            required: true,
            error: true,
            describedBy: 'form.date-helper form.date-error',
        })

        const textbox = screen.getByRole('textbox')

        expect(textbox.getAttribute('aria-invalid')).toBe('true')
        expect(textbox.getAttribute('aria-describedby')).toBe(
            'form.date-helper form.date-error',
        )
        expect(textbox.required).toBe(true)
    })

    it('is not marked invalid without an error', () => {
        renderPicker({ id: 'form.date' })

        expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe(
            'false',
        )
    })

    it('uses an aria-label when one is given', () => {
        render(
            <MuiDatePickerApp
                config={{
                    value: null,
                    locale: 'en',
                    ariaLabel: 'Date of birth',
                }}
                onChange={() => {}}
            />,
        )

        expect(
            screen.getByRole('textbox', { name: 'Date of birth' }),
        ).toBeTruthy()
    })
})
