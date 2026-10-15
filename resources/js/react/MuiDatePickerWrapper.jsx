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
    // committing every change saved "birthdays" nobody chose. A date is finished when the user
    // clicks an item in the last view (even the one already highlighted, which fires no
    // change), or an action-bar button (Clear, Today, OK), or types a complete valid date.
    const [draft, setDraft] = useState(() => toDayjs(config.value))
    const committed = useRef(config.value ?? null)
    const isOpen = useRef(config.variant === 'static')
    const deliberate = useRef(false)

    useEffect(() => {
        committed.current = config.value ?? null
        deliberate.current = false
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

    const markDeliberate = useCallback(
        (view) => () => {
            if (view === finalView) {
                deliberate.current = true
            }
        },
        [finalView],
    )

    const handleChange = useCallback(
        (newValue) => {
            setDraft(newValue)

            if (config.variant === 'static') {
                if (deliberate.current) commit(newValue)
                return
            }

            // Typing in the field. A complete date is committed even when it breaks a limit, so
            // the server rejects it with a message instead of silently keeping the old date; an
            // unfinished one commits nothing (null), never the previously saved value.
            if (!isOpen.current) {
                commit(isCompleteDate(newValue) ? newValue : null)
            }
        },
        [commit, config.variant],
    )

    const handleAccept = useCallback(
        (newValue) => {
            if (newValue === null || deliberate.current) {
                commit(newValue)
                return
            }

            setDraft(toDayjs(committed.current))
        },
        [commit],
    )

    const handleOpen = useCallback(() => {
        isOpen.current = true
        deliberate.current = false
        onOpen?.()
    }, [onOpen])

    const handleClose = useCallback(() => {
        isOpen.current = false
        deliberate.current = false
        setDraft(toDayjs(committed.current))
        onClose?.()
    }, [onClose])

    const handleViewChange = useCallback(
        (view) => {
            if (view !== finalView) {
                deliberate.current = false
            }
        },
        [finalView],
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
                // Filament's <label for> targets the field id, so the visible input takes it.
                id: config.id || undefined,
                name: config.name || undefined,
                required: config.required || false,
                // Only force the error on; otherwise leave MUI's own validation state alone.
                ...(config.error ? { error: true } : {}),
                inputProps: {
                    'aria-describedby': config.describedBy || undefined,
                    'aria-label': config.ariaLabel || undefined,
                },
            },
            toolbar: {
                hidden: !config.showToolbar,
            },
            actionBar: {
                ...(actionBarActions ? { actions: actionBarActions } : {}),
                onClickCapture: () => {
                    deliberate.current = true
                },
            },
            yearButton: { onClickCapture: markDeliberate('year') },
            monthButton: { onClickCapture: markDeliberate('month') },
            day: {
                onClickCapture: markDeliberate('day'),
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

// MUI reports the year while it is being typed ("0201" on the way to "2015"); treat
// those as unfinished rather than real dates.
function isCompleteDate(value) {
    return Boolean(value?.isValid()) && value.year() >= 1000
}
