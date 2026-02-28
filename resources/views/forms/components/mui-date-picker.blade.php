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
        x-data="muiDatePickerFormComponent({
            state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
            config: @js($reactConfig),
        })"
        wire:ignore
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
            x-ref="reactContainer"
            class="fi-fo-mui-date-picker-container"
        ></div>
    </div>
</x-dynamic-component>
