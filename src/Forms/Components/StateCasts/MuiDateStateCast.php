<?php

namespace Cck\FilamentMuiDatePicker\Forms\Components\StateCasts;

use Carbon\Exceptions\InvalidFormatException;
use DateTimeInterface;
use Filament\Schemas\Components\StateCasts\Contracts\StateCast;
use Illuminate\Support\Carbon;

/**
 * The picker always works with ISO `Y-m-d` dates in Livewire. `set()` turns a stored value
 * (in the field's `format()`) into that, and `get()` turns it back into the stored format.
 */
class MuiDateStateCast implements StateCast
{
    public const INTERNAL_FORMAT = 'Y-m-d';

    public function __construct(
        protected string $format,
        protected string $timezone,
    ) {}

    public function get(mixed $state): ?string
    {
        $date = $this->set($state);

        if ($date === null) {
            return null;
        }

        $date = Carbon::createFromFormat('!' . self::INTERNAL_FORMAT, $date, $this->timezone);

        if (static::formatHasTime($this->format)) {
            $date = $date->setTimezone(config('app.timezone'));
        }

        return $date->format($this->format);
    }

    public function set(mixed $state): ?string
    {
        if (blank($state)) {
            return null;
        }

        if ($state instanceof DateTimeInterface) {
            return Carbon::instance($state)->setTimezone($this->timezone)->format(self::INTERNAL_FORMAT);
        }

        if (! is_string($state)) {
            return null;
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/D', $state) && $this->isValidIsoDate($state)) {
            return $state;
        }

        try {
            $date = Carbon::createFromFormat('!' . $this->format, $state, config('app.timezone'));

            if (static::formatHasTime($this->format)) {
                $date = $date->setTimezone($this->timezone);
            }

            return $date->format(self::INTERNAL_FORMAT);
        } catch (InvalidFormatException) {
            // Not in the storage format; fall through to a lenient parse.
        }

        try {
            // A value with a time (e.g. a Livewire-serialised Carbon such as
            // `1985-11-16T16:00:00.000000Z`) names an instant: convert it to the field's
            // timezone to recover the calendar date. A bare date is taken as is.
            if (preg_match('/\d{2}:\d{2}/', $state)) {
                return Carbon::parse($state)->setTimezone($this->timezone)->format(self::INTERNAL_FORMAT);
            }

            return Carbon::parse($state, $this->timezone)->format(self::INTERNAL_FORMAT);
        } catch (InvalidFormatException) {
            return null;
        }
    }

    public static function formatHasTime(string $format): bool
    {
        $format = preg_replace('/\\\\./s', '', $format);

        return (bool) preg_match('/[aABgGhHisuvUeOPpTZcr]/', $format);
    }

    protected function isValidIsoDate(string $date): bool
    {
        [$year, $month, $day] = array_map('intval', explode('-', $date));

        return checkdate($month, $day, $year);
    }
}
