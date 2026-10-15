import { resolvePrimaryColor } from './primary-color'

const MOUNT_RETRY_INTERVAL = 100
const MOUNT_MAX_ATTEMPTS = 100 // ~10 seconds

export default function muiDatePickerFormComponent({
    state,
    statePath,
    live = false,
    config = {},
}) {
    return {
        state,
        statePath,
        live,
        config,
        reactInstance: null,
        _darkModeObserver: null,
        _configObserver: null,
        _primaryColor: null,
        _mountTimer: null,
        _mountAttempts: 0,
        _destroyed: false,

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
            this._mountTimer = null

            const container = this.$refs.reactContainer

            if (!container || this._destroyed) return

            if (!window.MuiDatePickerReact?.mount) {
                if (++this._mountAttempts >= MOUNT_MAX_ATTEMPTS) {
                    console.error(
                        `[mui-date-picker] The date picker bundle did not load for "${this.statePath}"; showing a plain date input instead.`,
                    )
                    this.renderFallback(container)

                    return
                }

                this._mountTimer = setTimeout(
                    () => this.mountReact(),
                    MOUNT_RETRY_INTERVAL,
                )

                return
            }

            this.reactInstance = window.MuiDatePickerReact.mount(
                container,
                this.buildConfig(this.state),
                {
                    onChange: (value) => this.commit(value),
                    onOpen: () => {},
                    onClose: () => {},
                },
            )
        },

        renderFallback(container) {
            const message = document.createElement('p')
            message.className = 'fi-fo-mui-date-picker-fallback-message'
            message.textContent =
                'The date picker could not be loaded. Enter the date below.'

            const input = document.createElement('input')
            input.type = 'date'
            input.className = 'fi-input fi-fo-mui-date-picker-fallback-input'
            input.value = this.state ?? ''

            if (this.config.id) input.id = this.config.id
            if (this.config.name) input.name = this.config.name
            if (this.config.minDate) input.min = this.config.minDate
            if (this.config.maxDate) input.max = this.config.maxDate
            input.required = Boolean(this.config.required)
            input.disabled = Boolean(this.config.disabled)
            input.readOnly = Boolean(this.config.readOnly)

            input.addEventListener('change', () =>
                this.commit(input.value || null),
            )

            container.replaceChildren(message, input)
        },

        // One write per picked date, straight to $wire (47c0c86: the deferred $entangle sync
        // was unreliable under wire:ignore on submit, so the value must not depend on it).
        // A live field sends the request now; a deferred one only updates $wire's data, which
        // Livewire sends with the next request (such as the form submit). The entangled
        // `state` follows from $wire, so it is not assigned here: doing so on a live field
        // would send a second request.
        commit(value) {
            this.$wire.$set(this.statePath, value, this.live)
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
            return resolvePrimaryColor()
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
            this._destroyed = true

            if (this._mountTimer) {
                clearTimeout(this._mountTimer)
                this._mountTimer = null
            }

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
