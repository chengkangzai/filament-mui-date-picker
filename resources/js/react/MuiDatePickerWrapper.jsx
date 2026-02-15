import React, { useCallback, useMemo } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import dayjs from 'dayjs'

export default function MuiDatePickerWrapper({ config, onChange, onOpen, onClose }) {
    const value = config.value ? dayjs(config.value) : null

    const handleChange = useCallback(
        (newValue, context) => {
            const formatted = newValue ? newValue.format('YYYY-MM-DD') : null
            onChange(formatted)
        },
        [onChange],
    )

    const handleAccept = useCallback(
        (newValue) => {
            const formatted = newValue ? newValue.format('YYYY-MM-DD') : null
            onChange(formatted)
        },
        [onChange],
    )

    const shouldDisableDate = useMemo(() => {
        if (!config.disabledDates?.length) return undefined
        const disabled = new Set(config.disabledDates)
        return (date) => disabled.has(date.format('YYYY-MM-DD'))
    }, [config.disabledDates])

    const actionBarActions = useMemo(() => {
        const actions = []
        if (config.clearable) actions.push('clear')
        if (config.showTodayButton) actions.push('today')
        if (config.variant === 'mobile') {
            actions.push('cancel', 'accept')
        }
        return actions.length > 0 ? actions : undefined
    }, [config.clearable, config.showTodayButton, config.variant])

    const commonProps = {
        value,
        onChange: handleChange,
        onAccept: handleAccept,
        onOpen,
        onClose,
        format: config.format || 'MM/DD/YYYY',
        minDate: config.minDate ? dayjs(config.minDate) : undefined,
        maxDate: config.maxDate ? dayjs(config.maxDate) : undefined,
        disableFuture: config.disableFuture || false,
        disablePast: config.disablePast || false,
        shouldDisableDate,
        views: config.views || ['year', 'month', 'day'],
        openTo: config.openTo || 'day',
        closeOnSelect: config.closeOnSelect !== false,
        readOnly: config.readOnly || false,
        disabled: config.disabled || false,
        disableHighlightToday: config.disableHighlightToday || false,
        reduceAnimations: config.reduceAnimations || false,
        orientation: config.orientation || undefined,
        showDaysOutsideCurrentMonth: true,
        fixedWeekNumber: 6,
        defaultCalendarMonth: config.defaultFocusedDate
            ? dayjs(config.defaultFocusedDate)
            : undefined,
        slotProps: {
            textField: {
                placeholder: config.placeholder || '',
                size: 'small',
                fullWidth: true,
                variant: 'outlined',
            },
            toolbar: {
                hidden: !config.showToolbar,
            },
            actionBar: actionBarActions
                ? { actions: actionBarActions }
                : undefined,
            day: {
                sx: {
                    '&.Mui-selected': {
                        fontWeight: 600,
                    },
                },
            },
        },
    }

    switch (config.variant) {
        case 'mobile':
            return <MobileDatePicker {...commonProps} />
        case 'static':
            return (
                <StaticDatePicker
                    {...commonProps}
                    displayStaticWrapperAs={config.orientation || 'desktop'}
                />
            )
        default:
            return <DatePicker {...commonProps} />
    }
}
