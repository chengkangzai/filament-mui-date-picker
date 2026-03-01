# Filament MUI Date Picker

A [Filament](https://filamentphp.com) form field powered by [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) and React. It renders a fully-featured Material UI date picker inside your Filament panels with seamless Livewire two-way binding, dark mode support, and built-in localization for 40+ languages.

<!--
[![Latest Version on Packagist](https://img.shields.io/packagist/v/chengkangzai/filament-mui-date-picker.svg?style=flat-square)](https://packagist.org/packages/chengkangzai/filament-mui-date-picker)
[![Total Downloads](https://img.shields.io/packagist/dt/chengkangzai/filament-mui-date-picker.svg?style=flat-square)](https://packagist.org/packages/chengkangzai/filament-mui-date-picker)
-->

<!--
## Screenshots

TODO: Add screenshots showing the date picker in light mode, dark mode, mobile variant, and static variant.
-->

## Features

- Material UI date picker rendered via React, embedded inside Filament forms
- Full two-way data binding with Livewire through Alpine.js
- Three picker variants: desktop (popover), mobile (dialog), and static (always-visible)
- Configurable picker views (year, month, day) and opening view
- Min/max date constraints with automatic Laravel validation rules
- Disable specific dates, past dates, or future dates
- 40+ built-in MUI locale translations plus PHP lang file overrides
- Clearable input with optional "Today" button
- Landscape and portrait orientations
- Follows Filament's dark mode and primary color automatically
- Supports `readOnly`, `disabled`, `required`, `placeholder`, and all standard Filament field features
- Display format and storage format can be configured independently

## Version Compatibility

| Plugin Version | Filament | Laravel | PHP |
|---|---|---|---|
| 2.x | 5.x | 12.x | 8.2+ |
| 1.x | 4.x | 11.x, 12.x | 8.2+ |

## Requirements

- PHP 8.2+
- Laravel 11 or 12
- Filament 4.x
- Node.js (for building assets during development only)

## Installation

Install the package via Composer:

```bash
composer require chengkangzai/filament-mui-date-picker
```

Register the plugin in your Filament panel provider:

```php
use Cck\FilamentMuiDatePicker\MuiDatePickerPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugins([
            MuiDatePickerPlugin::make(),
        ]);
}
```

Optionally, publish the configuration file:

```bash
php artisan vendor:publish --tag="mui-date-picker-config"
```

To publish and customize translation files:

```bash
php artisan vendor:publish --tag="mui-date-picker-translations"
```

## Basic Usage

Add the `MuiDatePicker` field to any Filament form schema:

```php
use Cck\FilamentMuiDatePicker\Forms\Components\MuiDatePicker;

MuiDatePicker::make('date')
    ->label('Date')
```

The field stores dates in `Y-m-d` format by default and displays them as `MM/DD/YYYY`.

## Configuration Options

### Display Format and Storage Format

The **display format** controls how the date appears in the input field (uses [Day.js tokens](https://day.js.org/docs/en/display/format)). The **storage format** controls how the date is stored in your database (uses PHP date format tokens).

```php
MuiDatePicker::make('date')
    ->displayFormat('DD/MM/YYYY')  // Day.js format shown to the user
    ->format('Y-m-d')             // PHP format stored in the database
```

| Method | Default | Format Type |
|---|---|---|
| `displayFormat()` | `MM/DD/YYYY` | Day.js |
| `format()` | `Y-m-d` | PHP |

### Min and Max Dates

Constrain the selectable date range. These methods automatically add `before_or_equal` and `after_or_equal` Laravel validation rules.

```php
use Carbon\Carbon;

MuiDatePicker::make('date')
    ->minDate('2024-01-01')
    ->maxDate('2024-12-31')

// Or with Carbon instances:
MuiDatePicker::make('date')
    ->minDate(now()->startOfMonth())
    ->maxDate(now()->endOfMonth())
```

### Disabled Dates

Pass an array of specific dates that cannot be selected:

```php
MuiDatePicker::make('date')
    ->disabledDates([
        '2024-12-25',
        '2024-12-31',
        Carbon::parse('2024-01-01'),
    ])
```

### Disable Future / Disable Past

Quickly prevent selection of future or past dates:

```php
MuiDatePicker::make('date')
    ->disableFuture()  // Only past dates and today

MuiDatePicker::make('date')
    ->disablePast()    // Only today and future dates
```

### Picker Variant

Choose how the date picker is presented. The default is `desktop`.

```php
// Desktop: opens as a popover anchored to the input
MuiDatePicker::make('date')->desktop()

// Mobile: opens as a full-screen dialog
MuiDatePicker::make('date')->mobile()

// Static: renders the calendar inline, always visible
MuiDatePicker::make('date')->staticMode()

// Or use the generic method:
MuiDatePicker::make('date')->variant('mobile')
```

### Picker Views and Opening View

Control which views (year, month, day) are available and which one the picker opens to:

```php
// Only allow year and month selection
MuiDatePicker::make('date')
    ->pickerViews(['year', 'month'])
    ->openTo('year')

// Open directly to year selection, then drill down
MuiDatePicker::make('date')
    ->pickerViews(['year', 'month', 'day'])
    ->openTo('year')
```

### Clearable

Allow the user to clear the selected date:

```php
MuiDatePicker::make('date')
    ->clearable()
```

### Today Button

Show a "Today" button in the picker toolbar for quick selection:

```php
MuiDatePicker::make('date')
    ->showTodayButton()
```

### Toolbar

Show or hide the picker toolbar:

```php
MuiDatePicker::make('date')
    ->showToolbar()
```

### Close on Date Selection

By default, the picker closes when a date is selected. You can keep it open:

```php
MuiDatePicker::make('date')
    ->closeOnDateSelection(false)
```

### Orientation

Control the layout orientation of the picker:

```php
MuiDatePicker::make('date')->landscape()
MuiDatePicker::make('date')->portrait()

// Or use the generic method:
MuiDatePicker::make('date')->orientation('landscape')
```

### Reduce Animations

Disable picker animations for performance or accessibility:

```php
MuiDatePicker::make('date')
    ->reduceAnimations()
```

### Disable Today Highlight

Remove the visual highlight on today's date in the calendar:

```php
MuiDatePicker::make('date')
    ->disableHighlightToday()
```

### Locale

Set the locale for date formatting and UI text. Falls back to `config('app.locale')`:

```php
MuiDatePicker::make('date')
    ->locale('fr')
```

See the [Localization](#localization--i18n) section for full details.

### Locale Text Overrides

Override specific UI text strings on a per-field basis:

```php
MuiDatePicker::make('date')
    ->localeText([
        'cancelButtonLabel' => 'Dismiss',
        'clearButtonLabel' => 'Reset',
        'todayButtonLabel' => 'Jump to today',
    ])
```

### Timezone

Set the timezone for date handling. Falls back to `config('app.timezone')`:

```php
MuiDatePicker::make('date')
    ->timezone('America/New_York')
```

### First Day of Week

Override the first day of the week (0 = Sunday, 1 = Monday, etc.):

```php
MuiDatePicker::make('date')
    ->firstDayOfWeek(1) // Monday
```

### Default Focused Date

Set which date the calendar focuses on when opened without a value:

```php
MuiDatePicker::make('date')
    ->defaultFocusedDate('2024-06-15')

// Or with Carbon:
MuiDatePicker::make('date')
    ->defaultFocusedDate(now()->addMonth())
```

### Placeholder

Set placeholder text shown when no date is selected:

```php
MuiDatePicker::make('date')
    ->placeholder('Select a date...')
```

### Read Only and Disabled

```php
// Read-only: the user can see the value but cannot change it
MuiDatePicker::make('date')
    ->readOnly()

// Disabled: the field is grayed out and non-interactive
MuiDatePicker::make('date')
    ->disabled()
```

## Localization / i18n

The date picker supports 40+ languages through three layers of localization that merge together. Each layer overrides the one below it.

### Layer 1: Built-in MUI Locale Translations (JavaScript)

The following 40 locales ship with built-in MUI translations for all picker UI text (button labels, toolbar titles, accessibility strings, etc.). When you set `->locale('fr')`, MUI's French translations are loaded automatically with no extra configuration:

| Locale Code | Language | Locale Code | Language |
|---|---|---|---|
| `be` | Belarusian | `ja` | Japanese |
| `bg` | Bulgarian | `kk` | Kazakh |
| `bn` / `bn_BD` | Bengali | `ko` | Korean |
| `ca` | Catalan | `mk` | Macedonian |
| `cs` | Czech | `nb` | Norwegian Bokmal |
| `da` | Danish | `nl` | Dutch |
| `de` | German | `nn` | Norwegian Nynorsk |
| `el` | Greek | `pl` | Polish |
| `en` / `en_GB` | English | `pt` / `pt_PT` | Portuguese |
| `es` / `es_MX` | Spanish | `pt_BR` | Brazilian Portuguese |
| `eu` | Basque | `ro` | Romanian |
| `fa` | Persian | `ru` | Russian |
| `fi` | Finnish | `sk` | Slovak |
| `fr` / `fr_CA` | French | `sv` | Swedish |
| `he` | Hebrew | `tr` | Turkish |
| `hr` | Croatian | `uk` | Ukrainian |
| `hu` | Hungarian | `ur` | Urdu |
| `is` | Icelandic | `vi` | Vietnamese |
| `it` | Italian | `zh` / `zh_CN` / `zh_HK` / `zh_TW` | Chinese |

### Layer 2: PHP Lang Files (Publishable)

For languages not covered by MUI's built-in translations (or to customize the built-in ones), the plugin ships PHP translation files. These are loaded via Laravel's standard translation system and merged on top of Layer 1.

The plugin ships with lang files for these languages:

- `en` -- English
- `ar` -- Arabic
- `ms` -- Malay
- `ta` -- Tamil
- `th` -- Thai
- `hi` -- Hindi
- `id` -- Indonesian
- `sw` -- Swahili
- `fil` -- Filipino
- `km` -- Khmer

To publish and customize these files:

```bash
php artisan vendor:publish --tag="mui-date-picker-translations"
```

This copies the lang files to `lang/vendor/mui-date-picker/` in your application, where you can edit them freely.

#### Available Translation Keys

Each lang file returns an array with these keys:

```php
return [
    'previousMonth' => 'Previous month',
    'nextMonth' => 'Next month',
    'openPreviousView' => 'Open previous view',
    'openNextView' => 'Open next view',
    'cancelButtonLabel' => 'Cancel',
    'clearButtonLabel' => 'Clear',
    'okButtonLabel' => 'OK',
    'todayButtonLabel' => 'Today',
    'datePickerToolbarTitle' => 'Select date',
    'start' => 'Start',
    'end' => 'End',
    'startDate' => 'Start date',
    'endDate' => 'End date',
    'year' => 'Year',
    'month' => 'Month',
    'day' => 'Day',
    'hours' => 'Hours',
    'minutes' => 'Minutes',
    'seconds' => 'Seconds',
    'empty' => 'Empty',
];
```

#### Adding a New Language

1. Publish the translations (if you have not already).
2. Create a new file at `lang/vendor/mui-date-picker/{locale}/mui-date-picker.php`.
3. Translate all the keys listed above.
4. Set `->locale('{locale}')` on your field or set `config('app.locale')` globally.

### Layer 3: Per-Field `localeText()` Overrides

The highest-priority layer. Use `localeText()` on individual fields to override any translation string:

```php
MuiDatePicker::make('date')
    ->locale('fr')
    ->localeText([
        'todayButtonLabel' => "Aujourd'hui",
        'clearButtonLabel' => 'Effacer',
    ])
```

### How the Layers Merge

When the picker renders, translations are resolved in this order:

1. MUI's built-in JavaScript translations for the locale (if available)
2. PHP lang file translations are merged on top (from `lang/vendor/mui-date-picker/{locale}/` or the plugin's bundled files)
3. Per-field `localeText()` values are merged last, taking highest priority

This means you can rely on MUI's built-in translations for most languages, customize individual strings through PHP lang files, and apply one-off overrides on specific fields.

## Real-World Examples

### Date of Birth (18+ Required)

```php
MuiDatePicker::make('date_of_birth')
    ->label('Date of Birth')
    ->required()
    ->maxDate(now()->subYears(18))
    ->openTo('year')
    ->pickerViews(['year', 'month', 'day'])
    ->displayFormat('DD/MM/YYYY')
    ->placeholder('Select your date of birth...')
    ->disableFuture()
```

### Appointment Booking (Future Dates Only, No Weekends)

```php
use Carbon\Carbon;
use Carbon\CarbonPeriod;

// Build a list of weekend dates for the next 6 months
$weekends = collect(CarbonPeriod::create(now(), now()->addMonths(6)))
    ->filter(fn (Carbon $date) => $date->isWeekend())
    ->map(fn (Carbon $date) => $date->format('Y-m-d'))
    ->values()
    ->all();

MuiDatePicker::make('appointment_date')
    ->label('Appointment Date')
    ->required()
    ->disablePast()
    ->disabledDates($weekends)
    ->clearable()
    ->showTodayButton()
    ->placeholder('Choose an available weekday...')
```

### Simple Date Field

```php
MuiDatePicker::make('date')
    ->label('Date')
```

### Inline Static Calendar

```php
MuiDatePicker::make('event_date')
    ->label('Event Date')
    ->staticMode()
    ->showTodayButton()
    ->clearable()
```

### Localized Date Picker

```php
MuiDatePicker::make('date')
    ->label('Tarikh')
    ->locale('ms')
    ->displayFormat('DD/MM/YYYY')
    ->firstDayOfWeek(1)
    ->clearable()
```

## Styling

The date picker automatically adapts to Filament's dark mode and uses your panel's primary color. No additional CSS configuration is needed.

The component uses the following CSS classes if you need to target it for custom styling:

- `.fi-fo-mui-date-picker` -- the outer wrapper
- `.fi-fo-mui-date-picker-container` -- the React mount point

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](.github/SECURITY.md) on how to report security vulnerabilities.

## Credits

- [chengkangzai](https://github.com/chengkangzai)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
