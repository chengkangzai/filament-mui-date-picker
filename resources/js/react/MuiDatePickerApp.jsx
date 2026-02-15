import React, { useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MuiDatePickerWrapper from './MuiDatePickerWrapper'
import { buildTheme } from './theme'
import { resolveLocale } from './locales'

export default function MuiDatePickerApp({ config, onChange, onOpen, onClose }) {
    const theme = useMemo(
        () => buildTheme(config.colorScheme, config.primaryColor),
        [config.colorScheme, config.primaryColor],
    )

    const { dayjsLocale, localeText } = useMemo(() => {
        const resolved = resolveLocale(config.locale)

        // Merge PHP-provided localeText overrides on top of resolved locale
        const mergedLocaleText = config.localeText
            ? { ...resolved.localeText, ...config.localeText }
            : resolved.localeText

        return {
            dayjsLocale: resolved.dayjsLocale,
            localeText: mergedLocaleText,
        }
    }, [config.locale, config.localeText])

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={dayjsLocale}
                localeText={localeText}
            >
                <MuiDatePickerWrapper
                    config={config}
                    onChange={onChange}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            </LocalizationProvider>
        </ThemeProvider>
    )
}
