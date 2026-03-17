<?php

use Carbon\Carbon;
use Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire\DatePickerForm;
use Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire\DatePickerFormWithTimezone;
use Livewire\Livewire;

it('passes required validation when date is filled', function () {
    Livewire::test(DatePickerForm::class)
        ->fillForm(['date_of_birth' => '2024-01-10'])
        ->call('submit')
        ->assertHasNoFormErrors();
});

it('fails required validation when date is empty', function () {
    Livewire::test(DatePickerForm::class)
        ->fillForm(['date_of_birth' => null])
        ->call('submit')
        ->assertHasFormErrors(['date_of_birth' => 'required']);
});

it('dehydrates date to configured format', function () {
    Livewire::test(DatePickerForm::class)
        ->fillForm(['date_of_birth' => '2024-01-10'])
        ->call('submit')
        ->assertSet('submittedData.date_of_birth', '2024-01-10');
});

it('does not shift date when component timezone differs from app timezone', function () {
    config(['app.timezone' => 'UTC']);

    Livewire::test(DatePickerFormWithTimezone::class)
        ->fillForm(['date_of_birth' => '2024-01-10'])
        ->call('submit')
        ->assertSet('submittedData.date_of_birth', '2024-01-10');
});

it('preserves date in positive UTC offset timezone', function () {
    config(['app.timezone' => 'UTC']);

    Livewire::test(DatePickerForm::class)
        ->fillForm(['date_of_birth' => '2024-01-10'])
        ->call('submit')
        ->assertSet('submittedData.date_of_birth', '2024-01-10');
});

it('correctly handles UTC ISO datetime string from Livewire serialization', function () {
    // Simulates: model has date cast to Carbon('1985-11-17 00:00:00', 'Asia/Kuala_Lumpur')
    // Livewire serializes it to UTC: '1985-11-16T16:00:00.000000Z'
    // formatStateUsing must recover the original date '1985-11-17'
    config(['app.timezone' => 'Asia/Kuala_Lumpur']);

    Livewire::test(DatePickerForm::class)
        ->fillForm(['date_of_birth' => '1985-11-16T16:00:00.000000Z'])
        ->call('submit')
        ->assertSet('submittedData.date_of_birth', '1985-11-17');
});

it('correctly handles UTC ISO datetime string with negative UTC offset timezone', function () {
    // Carbon('2024-01-10 00:00:00', 'America/New_York') → UTC: '2024-01-10T05:00:00.000000Z'
    config(['app.timezone' => 'America/New_York']);

    Livewire::test(DatePickerFormWithTimezone::class)
        ->fillForm(['date_of_birth' => '2024-01-10T05:00:00.000000Z'])
        ->call('submit')
        ->assertSet('submittedData.date_of_birth', '2024-01-10');
});
