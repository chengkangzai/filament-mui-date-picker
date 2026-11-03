<?php

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;

/**
 * The picker's Alpine component is lazy-loaded (x-load). Until it has registered,
 * async-alpine holds the element under x-ignore — but it skips that during a clone,
 * so if Livewire morphs the element (Alpine.cloneNode) while the bundle is still
 * downloading, Alpine evaluates `muiDatePickerFormComponent(...)` and the children's
 * `x-model="state"` against a component that does not exist yet:
 * "ReferenceError: muiDatePickerFormComponent is not defined" / "state is not defined".
 *
 * Livewire returns before cloneNode only for a full `wire:ignore` (`wire:ignore.self`
 * still clones), which is also how Filament's own lazy-loaded fields are marked.
 */
function morphSafetyXpath(): DOMXPath
{
    $document = new DOMDocument;
    @$document->loadHTML(datePickerForm(fn () => [MuiDatePicker::make('date')])->html());

    return new DOMXPath($document);
}

it('fully wire:ignores the lazy-loaded Alpine component so a morph never clones it', function () {
    $component = morphSafetyXpath()->query('//*[@x-load]')->item(0);

    expect($component)->not->toBeNull()
        ->and($component->hasAttribute('x-data'))->toBeTrue()
        ->and($component->hasAttribute('wire:ignore'))->toBeTrue()
        ->and($component->hasAttribute('wire:ignore.self'))->toBeFalse();
});

it('keeps the live config beside the ignored component, where Livewire still morphs it', function () {
    $xpath = morphSafetyXpath();
    $component = $xpath->query('//*[@x-load]')->item(0);
    $config = $xpath->query('//*[@data-mui-date-picker-config]')->item(0);

    expect($config)->not->toBeNull()
        ->and($config->parentNode->isSameNode($component->parentNode))->toBeTrue();
});
