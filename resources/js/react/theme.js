import { createTheme } from '@mui/material/styles'

export function buildTheme(colorScheme, primaryColor) {
    const isDark = colorScheme === 'dark'

    return createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            primary: {
                main: primaryColor || '#6366f1',
            },
            background: isDark
                ? { default: '#1f2937', paper: '#111827' }
                : { default: '#ffffff', paper: '#ffffff' },
        },
        // MUI's global z-index scale — set very high to sit above Filament's UI
        zIndex: {
            mobileStepper: 99000,
            fab: 99050,
            speedDial: 99050,
            appBar: 99100,
            drawer: 99200,
            modal: 99300,
            snackbar: 99400,
            tooltip: 99500,
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: 'inherit',
            fontSize: 14,
        },
        components: {
            MuiPopover: {
                defaultProps: {
                    container: () => document.body,
                },
            },
            MuiPopper: {
                defaultProps: {
                    container: () => document.body,
                },
            },
            MuiDialog: {
                defaultProps: {
                    container: () => document.body,
                },
                styleOverrides: {
                    root: {
                        // Ensure the dialog root sits above Filament layers
                        zIndex: '99300 !important',
                    },
                    container: {
                        // Dialog container must be above the backdrop
                        position: 'relative',
                        zIndex: 2,
                    },
                },
            },
            MuiModal: {
                defaultProps: {
                    container: () => document.body,
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        // Force backdrop behind dialog content
                        zIndex: '1 !important',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        fontSize: '0.875rem',
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        fontSize: '0.875rem',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                        },
                    }),
                    notchedOutline: () => ({
                        borderColor: isDark
                            ? 'rgba(255, 255, 255, 0.23)'
                            : 'rgba(0, 0, 0, 0.23)',
                    }),
                },
            },
        },
    })
}
