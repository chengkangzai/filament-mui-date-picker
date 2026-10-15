<?php

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;

it('tells the bridge a deferred field is not live', function () {
    $html = datePickerForm(fn () => [MuiDatePicker::make('date')])->html();

    expect($html)->toContain('live: false');
});

it('tells the bridge a live field is live', function () {
    $html = datePickerForm(fn () => [MuiDatePicker::make('date')->live()])->html();

    expect($html)->toContain('live: true');
});

it('treats a field that is live on blur or debounced as live', function () {
    expect(datePickerForm(fn () => [MuiDatePicker::make('date')->live(onBlur: true)])->html())->toContain('live: true')
        ->and(datePickerForm(fn () => [MuiDatePicker::make('date')->live(debounce: 500)])->html())->toContain('live: true');
});

it('receives a deferred value sent along with the submit request', function () {
    // $wire.$set(path, value, false) only updates the client-side data; Livewire sends it as
    // an update in the same request as the next action, which is what this simulates.
    datePickerForm(fn () => [MuiDatePicker::make('date')->required()->format('d/m/Y')])
        ->update(
            calls: [['method' => 'submit', 'params' => [], 'path' => '']],
            updates: ['data.date' => '2024-02-01'],
        )
        ->assertHasNoFormErrors()
        ->assertSet('submittedData.date', '01/02/2024');
});
