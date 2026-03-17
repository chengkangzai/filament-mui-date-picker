<?php

namespace Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire;

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Livewire\Component;

class DatePickerFormWithTimezone extends Component implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    public ?array $submittedData = null;

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                MuiDatePicker::make('date_of_birth')
                    ->required()
                    ->timezone('America/New_York'),
            ])
            ->statePath('data');
    }

    public function submit(): void
    {
        $this->submittedData = $this->form->getState();
    }

    public function render(): string
    {
        return <<<'BLADE'
        <div>
            {{ $this->form }}
        </div>
        BLADE;
    }
}
