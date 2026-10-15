<?php

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;
use Filament\Schemas\Components\Utilities\Get;

it('renders the picker config outside the ignored React container', function () {
    $html = datePickerForm(fn () => [MuiDatePicker::make('date')])->html();

    $document = new DOMDocument;
    @$document->loadHTML($html);
    $config = (new DOMXPath($document))->query('//*[@data-mui-date-picker-config]')->item(0);

    expect($config)->not->toBeNull();

    for ($node = $config; $node instanceof DOMElement; $node = $node->parentNode) {
        expect($node->hasAttribute('wire:ignore'))->toBeFalse();
    }
});

it('re-renders the config when a field it depends on changes', function () {
    $livewire = datePickerForm(fn () => [
        MuiDatePicker::make('start')->live(),
        MuiDatePicker::make('end')
            ->minDate(fn (Get $get) => $get('start'))
            ->disabled(fn (Get $get) => blank($get('start'))),
    ]);

    expect(renderedConfig($livewire, 'end'))
        ->not->toHaveKey('minDate')
        ->disabled->toBeTrue();

    $livewire->set('data.start', '2024-03-01');

    expect(renderedConfig($livewire, 'end'))
        ->minDate->toBe('2024-03-01')
        ->disabled->toBeFalse();
});

it('re-renders the disabled dates when they depend on another field', function () {
    $livewire = datePickerForm(fn () => [
        MuiDatePicker::make('start')->live(),
        MuiDatePicker::make('end')
            ->disabledDates(fn (Get $get) => array_filter([$get('start')])),
    ]);

    expect(renderedConfig($livewire, 'end')['disabledDates'])->toBe([]);

    $livewire->set('data.start', '2024-03-01');

    expect(renderedConfig($livewire, 'end')['disabledDates'])->toBe(['2024-03-01']);
});
