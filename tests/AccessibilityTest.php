<?php

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;
use Filament\Forms\Components\Field;

// Filament renders ids on the helper text and error message from 5.10.
$hasDescriptionIds = method_exists(Field::class, 'getDescriptionIds');

it('forwards the field id, name and required state to the picker input', function () {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')->required()]);
    $field = datePickerField($livewire);

    expect(renderedConfig($livewire))
        ->id->toBe($field->getId())
        ->name->toBe('data.date')
        ->required->toBeTrue()
        ->error->toBeFalse();
});

it('does not leave the label pointing at the hidden input', function () {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')]);
    $id = datePickerField($livewire)->getId();

    $document = new DOMDocument;
    @$document->loadHTML($livewire->html());

    expect((new DOMXPath($document))->query("//input[@type='hidden'][@id='{$id}']")->length)->toBe(0);
});

it('points aria-describedby at the helper text', function () {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')->helperText('Your birthday')]);
    $id = datePickerField($livewire)->getId();

    $describedBy = explode(' ', renderedConfig($livewire)['describedBy']);

    expect($describedBy)->not->toBeEmpty();

    $document = new DOMDocument;
    @$document->loadHTML($livewire->html());

    foreach ($describedBy as $describedById) {
        expect($document->getElementById($describedById)?->textContent)->toContain('Your birthday');
    }
})->skip(! $hasDescriptionIds, 'Filament < 5.10 renders no helper text id');

it('marks the picker invalid and describes it by the error once validation fails', function () use ($hasDescriptionIds) {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')->required()])
        ->call('submit')
        ->assertHasFormErrors(['date' => 'required']);
    $id = datePickerField($livewire)->getId();

    expect(renderedConfig($livewire))->error->toBeTrue();

    if ($hasDescriptionIds) {
        expect(renderedConfig($livewire))->describedBy->toContain("{$id}-error");
    }

    $livewire->set('data.date', '2024-02-01')->call('submit')->assertHasNoFormErrors();

    expect(renderedConfig($livewire))->error->toBeFalse();
});

it('gives the picker an aria-label when the field label is hidden', function () {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')->label('Date of birth')->hiddenLabel()]);

    expect(renderedConfig($livewire)['ariaLabel'])->toBe('Date of birth');
});

it('does not set an aria-label when the visible label already names the picker', function () {
    $livewire = datePickerForm(fn () => [MuiDatePicker::make('date')->label('Date of birth')]);

    expect(renderedConfig($livewire))->not->toHaveKey('ariaLabel');
});
