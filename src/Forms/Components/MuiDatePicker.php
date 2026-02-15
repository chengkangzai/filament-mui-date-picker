<?php

namespace Cck\FilamentMuiDatePicker\Forms\Components;

use Carbon\CarbonInterface;
use Closure;
use Filament\Forms\Components\Concerns\CanBeReadOnly;
use Filament\Forms\Components\Concerns\HasAffixes;
use Filament\Forms\Components\Concerns\HasExtraInputAttributes;
use Filament\Forms\Components\Concerns\HasPlaceholder;
use Filament\Forms\Components\Field;
use Filament\Schemas\Components\Contracts\HasAffixActions;
use Filament\Support\Concerns\HasExtraAlpineAttributes;

class MuiDatePicker extends Field implements HasAffixActions
{
    use CanBeReadOnly;
    use HasAffixes;
    use HasExtraAlpineAttributes;
    use HasExtraInputAttributes;
    use HasPlaceholder;

    protected string $view = 'mui-date-picker::forms.components.mui-date-picker';

    protected string | Closure | null $displayFormat = null;

    protected string | Closure | null $format = null;

    protected CarbonInterface | string | Closure | null $maxDate = null;

    protected CarbonInterface | string | Closure | null $minDate = null;

    protected CarbonInterface | string | Closure | null $defaultFocusedDate = null;

    protected string | Closure | null $timezone = null;

    protected string | Closure | null $locale = null;

    protected array | Closure $disabledDates = [];

    protected int | Closure | null $firstDayOfWeek = null;

    protected bool | Closure $closeOnDateSelection = true;

    // MUI-specific properties
    protected string | Closure $variant = 'desktop';

    protected array | Closure $views = ['year', 'month', 'day'];

    protected string | Closure $openTo = 'day';

    protected bool | Closure $showToolbar = false;

    protected bool | Closure $clearable = false;

    protected bool | Closure $showTodayButton = false;

    protected bool | Closure $disableFuture = false;

    protected bool | Closure $disablePast = false;

    protected bool | Closure $disableHighlightToday = false;

    protected string | Closure | null $orientation = null;

    protected bool | Closure $reduceAnimations = false;

    protected array | Closure $localeText = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->rule('date');
    }

    public function displayFormat(string | Closure | null $format): static
    {
        $this->displayFormat = $format;

        return $this;
    }

    public function getDisplayFormat(): string
    {
        return $this->evaluate($this->displayFormat) ?? 'MM/DD/YYYY';
    }

    public function format(string | Closure | null $format): static
    {
        $this->format = $format;

        return $this;
    }

    public function getFormat(): string
    {
        return $this->evaluate($this->format) ?? 'Y-m-d';
    }

    public function maxDate(CarbonInterface | string | Closure | null $date): static
    {
        $this->maxDate = $date;

        $this->rule(static function (MuiDatePicker $component) {
            return "before_or_equal:{$component->getMaxDate()}";
        }, static fn (MuiDatePicker $component): bool => (bool) $component->getMaxDate());

        return $this;
    }

    public function getMaxDate(): ?string
    {
        $date = $this->evaluate($this->maxDate);

        if ($date instanceof CarbonInterface) {
            return $date->format($this->getFormat());
        }

        return $date;
    }

    public function minDate(CarbonInterface | string | Closure | null $date): static
    {
        $this->minDate = $date;

        $this->rule(static function (MuiDatePicker $component) {
            return "after_or_equal:{$component->getMinDate()}";
        }, static fn (MuiDatePicker $component): bool => (bool) $component->getMinDate());

        return $this;
    }

    public function getMinDate(): ?string
    {
        $date = $this->evaluate($this->minDate);

        if ($date instanceof CarbonInterface) {
            return $date->format($this->getFormat());
        }

        return $date;
    }

    public function defaultFocusedDate(CarbonInterface | string | Closure | null $date): static
    {
        $this->defaultFocusedDate = $date;

        return $this;
    }

    public function getDefaultFocusedDate(): ?string
    {
        $date = $this->evaluate($this->defaultFocusedDate);

        if ($date instanceof CarbonInterface) {
            return $date->format('Y-m-d');
        }

        return $date;
    }

    public function timezone(string | Closure | null $timezone): static
    {
        $this->timezone = $timezone;

        return $this;
    }

    public function getTimezone(): string
    {
        return $this->evaluate($this->timezone) ?? config('app.timezone');
    }

    public function locale(string | Closure | null $locale): static
    {
        $this->locale = $locale;

        return $this;
    }

    public function getLocale(): string
    {
        return $this->evaluate($this->locale) ?? config('app.locale', 'en');
    }

    public function disabledDates(array | Closure $dates): static
    {
        $this->disabledDates = $dates;

        return $this;
    }

    public function getDisabledDates(): array
    {
        $dates = $this->evaluate($this->disabledDates);

        return array_map(function ($date) {
            if ($date instanceof CarbonInterface) {
                return $date->format('Y-m-d');
            }

            return $date;
        }, $dates);
    }

    public function firstDayOfWeek(int | Closure | null $day): static
    {
        $this->firstDayOfWeek = $day;

        return $this;
    }

    public function getFirstDayOfWeek(): ?int
    {
        return $this->evaluate($this->firstDayOfWeek);
    }

    public function closeOnDateSelection(bool | Closure $condition = true): static
    {
        $this->closeOnDateSelection = $condition;

        return $this;
    }

    public function shouldCloseOnDateSelection(): bool
    {
        return (bool) $this->evaluate($this->closeOnDateSelection);
    }

    public function variant(string | Closure $variant): static
    {
        $this->variant = $variant;

        return $this;
    }

    public function getVariant(): string
    {
        return $this->evaluate($this->variant);
    }

    public function mobile(): static
    {
        $this->variant = 'mobile';

        return $this;
    }

    public function desktop(): static
    {
        $this->variant = 'desktop';

        return $this;
    }

    public function staticMode(): static
    {
        $this->variant = 'static';

        return $this;
    }

    public function pickerViews(array | Closure $views): static
    {
        $this->views = $views;

        return $this;
    }

    public function getPickerViews(): array
    {
        return $this->evaluate($this->views);
    }

    public function openTo(string | Closure $view): static
    {
        $this->openTo = $view;

        return $this;
    }

    public function getOpenTo(): string
    {
        return $this->evaluate($this->openTo);
    }

    public function showToolbar(bool | Closure $condition = true): static
    {
        $this->showToolbar = $condition;

        return $this;
    }

    public function getShowToolbar(): bool
    {
        return (bool) $this->evaluate($this->showToolbar);
    }

    public function clearable(bool | Closure $condition = true): static
    {
        $this->clearable = $condition;

        return $this;
    }

    public function isClearable(): bool
    {
        return (bool) $this->evaluate($this->clearable);
    }

    public function showTodayButton(bool | Closure $condition = true): static
    {
        $this->showTodayButton = $condition;

        return $this;
    }

    public function getShowTodayButton(): bool
    {
        return (bool) $this->evaluate($this->showTodayButton);
    }

    public function disableFuture(bool | Closure $condition = true): static
    {
        $this->disableFuture = $condition;

        return $this;
    }

    public function getDisableFuture(): bool
    {
        return (bool) $this->evaluate($this->disableFuture);
    }

    public function disablePast(bool | Closure $condition = true): static
    {
        $this->disablePast = $condition;

        return $this;
    }

    public function getDisablePast(): bool
    {
        return (bool) $this->evaluate($this->disablePast);
    }

    public function disableHighlightToday(bool | Closure $condition = true): static
    {
        $this->disableHighlightToday = $condition;

        return $this;
    }

    public function getDisableHighlightToday(): bool
    {
        return (bool) $this->evaluate($this->disableHighlightToday);
    }

    public function orientation(string | Closure | null $orientation): static
    {
        $this->orientation = $orientation;

        return $this;
    }

    public function getOrientation(): ?string
    {
        return $this->evaluate($this->orientation);
    }

    public function landscape(): static
    {
        $this->orientation = 'landscape';

        return $this;
    }

    public function portrait(): static
    {
        $this->orientation = 'portrait';

        return $this;
    }

    public function reduceAnimations(bool | Closure $condition = true): static
    {
        $this->reduceAnimations = $condition;

        return $this;
    }

    public function getReduceAnimations(): bool
    {
        return (bool) $this->evaluate($this->reduceAnimations);
    }

    /**
     * Override MUI locale text strings (button labels, accessibility, etc.).
     * Merges on top of the built-in locale — only keys you provide are overridden.
     *
     * Available keys: cancelButtonLabel, clearButtonLabel, okButtonLabel,
     * todayButtonLabel, datePickerToolbarTitle, previousMonth, nextMonth, etc.
     */
    public function localeText(array | Closure $text): static
    {
        $this->localeText = $text;

        return $this;
    }

    public function getLocaleText(): array
    {
        return $this->evaluate($this->localeText);
    }

    public function getReactConfig(): array
    {
        $config = array_filter([
            'variant' => $this->getVariant(),
            'views' => $this->getPickerViews(),
            'openTo' => $this->getOpenTo(),
            'format' => $this->getDisplayFormat(),
            'minDate' => $this->getMinDate(),
            'maxDate' => $this->getMaxDate(),
            'disabledDates' => $this->getDisabledDates(),
            'disableFuture' => $this->getDisableFuture(),
            'disablePast' => $this->getDisablePast(),
            'showToolbar' => $this->getShowToolbar(),
            'clearable' => $this->isClearable(),
            'showTodayButton' => $this->getShowTodayButton(),
            'firstDayOfWeek' => $this->getFirstDayOfWeek(),
            'closeOnSelect' => $this->shouldCloseOnDateSelection(),
            'locale' => $this->getLocale(),
            'orientation' => $this->getOrientation(),
            'reduceAnimations' => $this->getReduceAnimations(),
            'disableHighlightToday' => $this->getDisableHighlightToday(),
            'defaultFocusedDate' => $this->getDefaultFocusedDate(),
            'placeholder' => $this->getPlaceholder(),
            'readOnly' => $this->isReadOnly(),
            'disabled' => $this->isDisabled(),
        ], fn ($value) => ! is_null($value));

        $localeText = $this->resolveLocaleText();

        if (! empty($localeText)) {
            $config['localeText'] = $localeText;
        }

        return $config;
    }

    /**
     * Merge lang file translations with per-field overrides.
     * Priority: per-field localeText() > published lang file > plugin lang file
     */
    protected function resolveLocaleText(): array
    {
        $locale = $this->getLocale();

        // Load from lang file (plugin's or user's published version)
        $translations = __('mui-date-picker::mui-date-picker', [], $locale);

        // __() returns the key string if no file found — only use if array
        $langFile = is_array($translations) ? $translations : [];

        // Per-field overrides take highest priority
        $fieldOverrides = $this->getLocaleText();

        return array_merge($langFile, $fieldOverrides);
    }
}
