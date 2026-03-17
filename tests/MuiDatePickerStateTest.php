<?php

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
