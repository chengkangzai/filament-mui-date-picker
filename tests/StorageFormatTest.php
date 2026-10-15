<?php

use Carbon\Carbon;
use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;

afterEach(fn () => Carbon::setTestNow());

it('keeps livewire state as an ISO date when a custom storage format is used', function () {
    datePickerForm(
        fn () => [MuiDatePicker::make('date')->format('d/m/Y')],
        ['date' => '01/02/2024'],
    )->assertSet('data.date', '2024-02-01');
});

it('saves a custom storage format unchanged after a load and save round trip', function () {
    datePickerForm(
        fn () => [MuiDatePicker::make('date')->format('d/m/Y')],
        ['date' => '01/02/2024'],
    )
        ->call('submit')
        ->assertHasNoFormErrors()
        ->assertSet('submittedData.date', '01/02/2024');
});

it('saves a date picked in the browser in the custom storage format', function () {
    datePickerForm(fn () => [MuiDatePicker::make('date')->format('d/m/Y')])
        ->set('data.date', '2024-02-01')
        ->call('submit')
        ->assertHasNoFormErrors()
        ->assertSet('submittedData.date', '01/02/2024');
});

it('hydrates a carbon state in the field timezone', function () {
    config(['app.timezone' => 'UTC']);

    datePickerForm(
        fn () => [MuiDatePicker::make('date')->timezone('Asia/Kuala_Lumpur')->format('d/m/Y')],
        ['date' => Carbon::parse('2024-01-31 20:00:00', 'UTC')],
    )
        ->assertSet('data.date', '2024-02-01')
        ->call('submit')
        ->assertSet('submittedData.date', '01/02/2024');
});

it('resolves a relative minDate to an ISO date for the picker and the rules', function () {
    Carbon::setTestNow('2024-02-01 10:00:00');

    $field = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')->format('d/m/Y')->minDate('tomorrow'),
    ]));

    expect($field->getReactConfig()['minDate'])->toBe('2024-02-02')
        ->and($field->getValidationRules())->toContain('after_or_equal:2024-02-02');
});

it('resolves a relative maxDate in the field timezone', function () {
    config(['app.timezone' => 'UTC']);
    Carbon::setTestNow(Carbon::parse('2024-02-01 20:00:00', 'UTC'));

    $field = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')->timezone('Asia/Kuala_Lumpur')->maxDate('today'),
    ]));

    expect($field->getReactConfig()['maxDate'])->toBe('2024-02-02')
        ->and($field->getValidationRules())->toContain('before_or_equal:2024-02-02');
});

it('resolves a carbon minDate to an ISO date when a custom format is used', function () {
    $field = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')->format('d/m/Y')->minDate(Carbon::parse('2024-02-01')),
    ]));

    expect($field->getReactConfig()['minDate'])->toBe('2024-02-01')
        ->and($field->getValidationRules())->toContain('after_or_equal:2024-02-01');
});

it('validates a custom-format field against its minDate', function () {
    datePickerForm(fn () => [
        MuiDatePicker::make('date')->format('d/m/Y')->minDate(Carbon::parse('2024-02-01')),
    ])
        ->set('data.date', '2024-01-31')
        ->call('submit')
        ->assertHasFormErrors(['date' => 'after_or_equal'])
        ->set('data.date', '2024-02-01')
        ->call('submit')
        ->assertHasNoFormErrors()
        ->assertSet('submittedData.date', '01/02/2024');
});

it('resolves closures, date strings and carbon instances for disabledDates and defaultFocusedDate', function () {
    $field = datePickerField(datePickerForm(fn () => [
        MuiDatePicker::make('date')
            ->format('d/m/Y')
            ->disabledDates(fn () => ['2024-02-01', Carbon::parse('2024-02-03'), '05/02/2024'])
            ->defaultFocusedDate(fn () => Carbon::parse('2024-02-10')),
    ]));

    expect($field->getReactConfig())
        ->disabledDates->toBe(['2024-02-01', '2024-02-03', '2024-02-05'])
        ->defaultFocusedDate->toBe('2024-02-10');
});
