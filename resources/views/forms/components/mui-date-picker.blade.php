@php
    $fieldWrapperView = $getFieldWrapperView();
    $id = $getId();
    $isDisabled = $isDisabled();
    $statePath = $getStatePath();
    $reactConfig = $getReactConfig();
    $livewireKey = $getLivewireKey();
    // Same test the $entangle binding below uses: live(), live(onBlur: true) and
    // live(debounce: ...) all entangle live, and a picked date is a finished value.
    $isLive = in_array('live', $getStateBindingModifiers(withBlur: false, withDebounce: false));
@endphp

<x-dynamic-component
    :component="$fieldWrapperView"
    :field="$field"
    :inline-label-vertical-alignment="\Filament\Support\Enums\VerticalAlignment::Center"
>
    {{-- Morphable wrapper. Livewire morphs it (and the config below) on every render; the
         Alpine component inside is fully wire:ignore'd. --}}
    <div
        wire:key="{{ $livewireKey }}"
        @class(['fi-fo-mui-date-picker'])
    >
        {{-- Outside the wire:ignore'd component so Livewire morphs it on every render; the
             Alpine bridge finds it as its sibling, watches this attribute and passes the new
             config to React. --}}
        <div
            data-mui-date-picker-config="{{ json_encode($reactConfig) }}"
            data-state-path="{{ $statePath }}"
            hidden
        ></div>

        {{-- Full wire:ignore, not wire:ignore.self. The component is lazy-loaded (x-load), and
             async-alpine skips its x-ignore guard during a clone. With .self, Livewire still runs
             Alpine.cloneNode on every morph, so a morph that lands before the component has
             registered (a slow mobile network) evaluates muiDatePickerFormComponent(...) and
             x-model="state" against nothing: "muiDatePickerFormComponent is not defined" /
             "state is not defined". A full wire:ignore makes Livewire return before cloneNode,
             as Filament's own lazy-loaded fields do. State still flows through $entangle. --}}
        <div
            x-load
            x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('mui-date-picker', 'chengkangzai/filament-mui-date-picker') }}"
            {{-- The React + MUI bundle and its stylesheet are registered loadedOnRequest, so they
                 are pulled in here rather than by @filamentScripts / @filamentStyles. A host
                 application calls those from a shared layout, which meant an ~880KB parser-blocking
                 bundle downloaded on every page using that layout, including pages with no date
                 field. muiDatePickerFormComponent() polls for window.MuiDatePickerReact (for up to
                 ~10 seconds, then falls back to a plain date input), so arriving after Alpine
                 initialises is the expected case. --}}
            x-load-js="{{ \Illuminate\Support\Js::from([\Filament\Support\Facades\FilamentAsset::getScriptSrc('mui-date-picker-react', 'chengkangzai/filament-mui-date-picker')]) }}"
            x-load-css="{{ \Illuminate\Support\Js::from([\Filament\Support\Facades\FilamentAsset::getStyleHref('mui-date-picker-styles', 'chengkangzai/filament-mui-date-picker')]) }}"
            x-data="muiDatePickerFormComponent({
                state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
                statePath: @js($statePath),
                live: @js($isLive),
            })"
            wire:ignore
            {{ $getExtraAlpineAttributeBag() }}
        >
            <input
                type="hidden"
                x-model="state"
            />

            <div
                x-ref="reactContainer"
                class="fi-fo-mui-date-picker-container"
            ></div>
        </div>
    </div>
</x-dynamic-component>
