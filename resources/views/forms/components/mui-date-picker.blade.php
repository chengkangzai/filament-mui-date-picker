@php
    $fieldWrapperView = $getFieldWrapperView();
    $id = $getId();
    $isDisabled = $isDisabled();
    $statePath = $getStatePath();
    $reactConfig = $getReactConfig();
    $livewireKey = $getLivewireKey();
@endphp

<x-dynamic-component
    :component="$fieldWrapperView"
    :field="$field"
    :inline-label-vertical-alignment="\Filament\Support\Enums\VerticalAlignment::Center"
>
    <div
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('mui-date-picker', 'chengkangzai/filament-mui-date-picker') }}"
        {{-- The React + MUI bundle and its stylesheet are registered loadedOnRequest, so they
             are pulled in here rather than by @filamentScripts / @filamentStyles. A host
             application calls those from a shared layout, which meant an ~880KB parser-blocking
             bundle downloaded on every page using that layout, including pages with no date
             field. muiDatePickerFormComponent() already polls for window.MuiDatePickerReact
             until it appears, so arriving after Alpine initialises is the expected case. --}}
        x-load-js="{{ \Illuminate\Support\Js::from([\Filament\Support\Facades\FilamentAsset::getScriptSrc('mui-date-picker-react', 'chengkangzai/filament-mui-date-picker')]) }}"
        x-load-css="{{ \Illuminate\Support\Js::from([\Filament\Support\Facades\FilamentAsset::getStyleHref('mui-date-picker-styles', 'chengkangzai/filament-mui-date-picker')]) }}"
        x-data="muiDatePickerFormComponent({
            state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
            statePath: @js($statePath),
            config: @js($reactConfig),
        })"
        wire:ignore.self
        wire:key="{{ $livewireKey }}"
        {{ $getExtraAlpineAttributeBag() }}
        @class(['fi-fo-mui-date-picker'])
    >
        <input
            type="hidden"
            x-model="state"
            @if ($id) id="{{ $id }}" @endif
        />

        <div
            wire:ignore
            x-ref="reactContainer"
            class="fi-fo-mui-date-picker-container"
        ></div>
    </div>
</x-dynamic-component>
