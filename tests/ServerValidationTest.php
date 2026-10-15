<?php

use Carbon\Carbon;
use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;

beforeEach(fn () => config(['app.timezone' => 'UTC']));

afterEach(fn () => Carbon::setTestNow());

it('rejects a disabled date on the server with a clear message', function () {
    datePickerForm(fn () => [
        MuiDatePicker::make('date')->format('d/m/Y')->disabledDates(['2024-02-01', '05/02/2024']),
    ])
        ->set('data.date', '2024-02-05')
        ->call('submit')
        ->assertHasFormErrors(['date' => 'not_in'])
        ->assertSee('The selected date is not available.');
});

it('accepts a date that is not disabled', function () {
    datePickerForm(fn () => [
        MuiDatePicker::make('date')->disabledDates([Carbon::parse('2024-02-01')]),
    ])
        ->set('data.date', '2024-02-02')
        ->call('submit')
        ->assertHasNoFormErrors();
});

it('rejects a past date when disablePast is set, using today in the field timezone', function () {
    // 20:00 UTC on 1 Feb is already 2 Feb in Kuala Lumpur.
    Carbon::setTestNow(Carbon::parse('2024-02-01 20:00:00', 'UTC'));

    datePickerForm(fn () => [
        MuiDatePicker::make('date')->timezone('Asia/Kuala_Lumpur')->disablePast(),
    ])
        ->set('data.date', '2024-02-01')
        ->call('submit')
        ->assertHasFormErrors(['date' => 'after_or_equal'])
        ->set('data.date', '2024-02-02')
        ->call('submit')
        ->assertHasNoFormErrors();
});

it('rejects a future date when disableFuture is set, using today in the field timezone', function () {
    // 02:00 UTC on 2 Feb is still 1 Feb in New York.
    Carbon::setTestNow(Carbon::parse('2024-02-02 02:00:00', 'UTC'));

    datePickerForm(fn () => [
        MuiDatePicker::make('date')->timezone('America/New_York')->disableFuture(),
    ])
        ->set('data.date', '2024-02-02')
        ->call('submit')
        ->assertHasFormErrors(['date' => 'before_or_equal'])
        ->set('data.date', '2024-02-01')
        ->call('submit')
        ->assertHasNoFormErrors();
});

it('sends the server-computed today to the picker instead of the browser clock', function () {
    Carbon::setTestNow(Carbon::parse('2024-02-01 20:00:00', 'UTC'));

    $config = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')->timezone('Asia/Kuala_Lumpur')->disablePast()->disableFuture(),
    ]))->getReactConfig();

    expect($config)
        ->minDate->toBe('2024-02-02')
        ->maxDate->toBe('2024-02-02')
        ->not->toHaveKey('disablePast')
        ->not->toHaveKey('disableFuture');
});

it('keeps the later of minDate and today when disablePast is set', function () {
    Carbon::setTestNow('2024-02-01 10:00:00');

    $field = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')->disablePast()->minDate('2024-03-01'),
    ]));

    expect($field->getReactConfig()['minDate'])->toBe('2024-03-01')
        ->and($field->getValidationRules())->toContain('after_or_equal:2024-03-01')
        ->not->toContain('after_or_equal:2024-02-01');
});
