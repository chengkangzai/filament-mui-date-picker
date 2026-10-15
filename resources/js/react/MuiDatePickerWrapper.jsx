import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import dayjs from 'dayjs'

export default function MuiDatePickerWrapper({
    config,
    onChange,
    onOpen,
    onClose,
}) {
    const views = config.views || ['year', 'month', 'day']
    const finalView = views[views.length - 1]
    const openTo = config.openTo || 'day'

    // The picker shows a draft; only a finished date is committed to Livewire. MUI reports a
    // full date as soon as a year or month is tapped (today's day and month filled in), so
    // committing every change saved "birthdays" nobody chose.
    const [draft, setDraft] = useState(() => toDayjs(config.value))
    const committed = useRef(config.value ?? null)
    const isOpen = useRef(false)
    const currentView = useRef(openTo)
    const pickedInFinalView = useRef(false)

    useEffect(() => {
        committed.current = config.value ?? null
        setDraft(toDayjs(config.value))
    }, [config.value])

    const commit = useCallback(
        (newValue) => {
            const formatted = newValue ? newValue.format('YYYY-MM-DD') : null

            if (formatted === committed.current) return

            committed.current = formatted
            onChange(formatted)
        },
        [onChange],
    )

    const handleChange = useCallback(
        (newValue) => {
            setDraft(newValue)

            if (isOpen.current && currentView.current === finalView) {
                pickedInFinalView.current = true
            }

            // Typing in the field: commit once the date is complete and valid.
            if (!isOpen.current && (newValue === null || newValue.isValid())) {
                commit(newValue)
            }
        },
        [commit, finalView],
    )

    const handleAccept = useCallback(
        (newValue) => {
            const finished =
                newValue === null ||
                pickedInFinalView.current ||
                isTodayButton(newValue, config)

            if (finished) {
                commit(newValue)
                return
            }

            setDraft(toDayjs(committed.current))
        },
        [commit, config],
    )

    const handleOpen = useCallback(() => {
        isOpen.current = true
        currentView.current = openTo
        pickedInFinalView.current = false
        onOpen?.()
    }, [onOpen, openTo])

    const handleClose = useCallback(() => {
        isOpen.current = false
        setDraft(toDayjs(committed.current))
        onClose?.()
    }, [onClose])

    const handleViewChange = useCallback((view) => {
        currentView.current = view
    }, [])

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
        value: draft,
        onChange: handleChange,
        onAccept: handleAccept,
        onOpen: handleOpen,
        onClose: handleClose,
        onViewChange: handleViewChange,
        format: config.format || 'MM/DD/YYYY',
        minDate: config.minDate ? dayjs(config.minDate) : undefined,
        maxDate: config.maxDate ? dayjs(config.maxDate) : undefined,
        disableFuture: config.disableFuture || false,
        disablePast: config.disablePast || false,
        shouldDisableDate,
        views,
        openTo,
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

function toDayjs(value) {
    return value ? dayjs(value) : null
}

// The action bar's Today button is a complete, deliberate choice from any view.
function isTodayButton(value, config) {
    return Boolean(config.showTodayButton) && value.isSame(dayjs(), 'day')
}
