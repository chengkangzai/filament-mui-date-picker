<?php

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;
use Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire\ConfigurableDatePickerForm;
use Cck\FilamentMuiDatePicker\Tests\TestCase;
use Livewire\Features\SupportTesting\Testable;
use Livewire\Livewire;

uses(TestCase::class)->in(__DIR__);

uses()->beforeEach(fn () => ConfigurableDatePickerForm::resetConfiguration())->in(__DIR__);

function datePickerForm(Closure $schema, array $fill = []): Testable
{
    ConfigurableDatePickerForm::$schemaUsing = $schema;
    ConfigurableDatePickerForm::$fillWith = $fill;

    return Livewire::test(ConfigurableDatePickerForm::class);
}

function datePickerField(Testable $livewire, string $name = 'date'): MuiDatePicker
{
    return collect($livewire->instance()->form->getFlatFields(withHidden: true))
        ->first(fn ($field) => $field->getName() === $name);
}

function renderedConfig(Testable $livewire, string $name = 'date'): array
{
    $html = $livewire->html();

    $document = new DOMDocument;
    @$document->loadHTML($html);
    $xpath = new DOMXPath($document);

    $node = $xpath->query("//*[@data-mui-date-picker-config][@data-state-path='data.{$name}']")->item(0);

    expect($node)->not->toBeNull("No rendered config for data.{$name}");

    return json_decode($node->getAttribute('data-mui-date-picker-config'), true);
}
