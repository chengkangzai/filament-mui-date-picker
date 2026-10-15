export default function muiDatePickerFormComponent({
    state,
    statePath,
    config = {},
}) {
    return {
        state,
        statePath,
        config,
        reactInstance: null,
        _darkModeObserver: null,
        _configObserver: null,
        _primaryColor: null,

        init() {
            this._primaryColor = this.getPrimaryColor()

            // The React container is wire:ignore'd, so the server renders the config into an
            // attribute outside it. Livewire morphs that attribute on every render; watching it
            // keeps closures such as minDate(fn (Get $get) => ...), disabled() and the error
            // state current without remounting React (which would drop focus and open state).
            this.config = this.readConfig() ?? this.config
            this.observeConfig()

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

        readConfig() {
            const json = this.$refs.config?.getAttribute(
                'data-mui-date-picker-config',
            )

            if (!json) return null

            try {
                return JSON.parse(json)
            } catch {
                return null
            }
        },

        observeConfig() {
            if (!this.$refs.config) return

            this._configObserver = new MutationObserver(() => {
                const config = this.readConfig()

                if (!config) return

                this.config = config

                if (this.reactInstance) {
                    this.reactInstance.update(this.buildConfig(this.state))
                }
            })

            this._configObserver.observe(this.$refs.config, {
                attributes: true,
                attributeFilter: ['data-mui-date-picker-config'],
            })
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

            if (this._configObserver) {
                this._configObserver.disconnect()
                this._configObserver = null
            }

            if (this._darkModeObserver) {
                this._darkModeObserver.disconnect()
                this._darkModeObserver = null
            }
        },
    }
}
