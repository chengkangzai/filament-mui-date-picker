<?php

namespace Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire;

use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;
use Closure;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Livewire\Component;

class ConfigurableDatePickerForm extends Component implements HasForms
{
    use InteractsWithForms;

    public static ?Closure $schemaUsing = null;

    public static array $fillWith = [];

    public ?array $data = [];

    public ?array $submittedData = null;

    public static function resetConfiguration(): void
    {
        static::$schemaUsing = null;
        static::$fillWith = [];
    }

    public function mount(): void
    {
        $this->form->fill(static::$fillWith);
    }

    public function form(Schema $form): Schema
    {
        $components = static::$schemaUsing
            ? (static::$schemaUsing)()
            : [MuiDatePicker::make('date')];

        return $form
            ->schema($components)
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
