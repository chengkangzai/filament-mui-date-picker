export default function muiDatePickerFormComponent({ state, statePath, config }) {
    return {
        state,
        statePath,
        config,
        reactInstance: null,
        _darkModeObserver: null,
        _primaryColor: null,

        init() {
            this._primaryColor = this.getPrimaryColor()

            this.$nextTick(() => {
                this.mountReact()
            })

            this.$watch('state', (newValue, oldValue) => {
                if (newValue === oldValue) return

                if (this.reactInstance) {
                    this.reactInstance.update(this.buildConfig(newValue))
                }
            })

            this.observeDarkMode()
        },

        mountReact() {
            const container = this.$refs.reactContainer

            if (!container) return

            if (!window.MuiDatePickerReact?.mount) {
                setTimeout(() => this.mountReact(), 100)
                return
            }

            this.reactInstance = window.MuiDatePickerReact.mount(
                container,
                this.buildConfig(this.state),
                {
                    onChange: (value) => {
                        this.state = value

                        // Explicitly sync to Livewire to ensure the value
                        // reaches the server on form submit, even if the
                        // deferred $entangle sync is unreliable with wire:ignore.
                        this.$wire.set(this.statePath, value)
                    },
                    onOpen: () => {},
                    onClose: () => {},
                },
            )
        },

        buildConfig(value) {
            return {
                ...this.config,
                value: value,
                colorScheme: this.getColorScheme(),
                primaryColor: this._primaryColor,
            }
        },

        getColorScheme() {
            return document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light'
        },

        getPrimaryColor() {
            const style = getComputedStyle(document.documentElement)
            const rgb = style.getPropertyValue('--primary-500').trim()

            if (rgb) {
                const parts = rgb.split(' ')
                if (parts.length === 3) {
                    return `rgb(${parts.join(', ')})`
                }
            }

            return '#6366f1'
        },

        observeDarkMode() {
            this._darkModeObserver = new MutationObserver(() => {
                if (this.reactInstance) {
                    this.reactInstance.update(this.buildConfig(this.state))
                }
            })

            this._darkModeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            })
        },

        destroy() {
            if (this.reactInstance) {
                this.reactInstance.unmount()
                this.reactInstance = null
            }

            if (this._darkModeObserver) {
                this._darkModeObserver.disconnect()
                this._darkModeObserver = null
            }
        },
    }
}
