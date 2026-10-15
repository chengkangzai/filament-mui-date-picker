# Changelog

All notable changes to `:package_name` will be documented in this file.

## v3.1.0 - 2026-10-15

### What changed

Reliability, validation and accessibility fixes from a code review, each covered by new tests (Pest 37, Vitest 40). They were checked in a browser on a Filament 5 / Livewire 4 app.

- **Custom storage formats work.** With `->format('d/m/Y')`, 1 Feb used to load as 2 Jan, or fail to save. The Livewire state is now always `Y-m-d`, and `format()` is applied on load and save.
- **Date limits are resolved on the server.**
  - `minDate`, `maxDate`, `disabledDates` and `defaultFocusedDate` are turned into ISO dates in the field's timezone, for both the picker and the validation rules.
  - They accept Carbon, closures, or relative strings such as `'tomorrow'`, which the browser previously ignored.
  
- **Dependent settings stay current.** For example, `minDate(fn (Get $get) => $get('check_in'))`, `disabled()`, `readOnly()` and the error state now update after every Livewire re-render, without remounting the picker.
- **Server-side validation.** There is a `not_in` rule for `disabledDates`. `disablePast()` and `disableFuture()` become min/max dates using "today" in the field's timezone, and the picker and the rules share them.
- **Typed dates.** A complete typed date is always sent to the server, so an out-of-range one shows a validation error instead of silently keeping the old value. An unfinished typed date sends `null`.
- **Theme colour.** Filament 5's `oklch()` primary colour is read correctly. A colour the theme can't use falls back safely instead of stopping the picker mounting.
- **Accessibility.**
  - The label targets the visible input.
  - The input gets `required`, error state, `aria-invalid`, and `aria-describedby` pointing at the field's error or helper text.
  
- **One request per pick.** It uses `$wire.$set(path, value, live)`: deferred fields send nothing until the next request, and `live()` fields send one.
- **Loader.** If the bundle can't load, it stops retrying after about 10 seconds and shows a plain date input.
- **CI.** The lockfile is committed, the JS tests run with `npm ci`, and CI fails if the committed `resources/dist` doesn't match the source.

### Behaviour changes to check when upgrading

- The Livewire state is always `Y-m-d`. `getState()` and `$get()` still return the `format()` value.
- `getMinDate()`, `getMaxDate()`, `getDisabledDates()` and `getDefaultFocusedDate()` now return ISO `Y-m-d` strings.
- The new server-side rules (`disabledDates`, `disablePast`, `disableFuture`) can reject values that used to be accepted.
- Deferred fields no longer send a request on every pick.

```bash
composer update chengkangzai/filament-mui-date-picker
php artisan filament:assets

```
**Full Changelog**: https://github.com/chengkangzai/filament-mui-date-picker/compare/v3.0.4...v3.1.0

## v3.0.4 - 2026-10-15

### What changed

v3.0.3 stopped the picker saving dates the user never picked. This release fixes the gaps a code review found in how it decides a date is **finished**:

- **The pre-highlighted day was dropped.** After you choose a year and month, MUI highlights a day. Clicking that day fires no change, so v3.0.3 threw the pick away. It is now saved.
- **Today button.** With `->showTodayButton()`, a draft that happened to equal today was saved without Today being clicked.
- **Going back.** With `->closeOnDateSelection(false)`, picking a day and then changing the year saved the unfinished date on Escape.
- **Static variant.** Year-only picks were saved.
- **Typed dates.** A typed date the picker rejects, such as one past `maxDate`, was saved.

A date now counts as finished only after:

- a click on an item in the last view
- a click on the action bar (Clear, Today, OK)
- a complete typed date that passes the picker's validation

### Upgrading

```bash
composer update chengkangzai/filament-mui-date-picker
php artisan filament:assets


```
There are no API or config changes.

**Full Changelog**: https://github.com/chengkangzai/filament-mui-date-picker/compare/v3.0.3...v3.0.4

## v3.0.3 - 2026-10-15

### What changed

The picker no longer saves a date until the user has **finished** picking one.

MUI's DatePicker reports a full date as soon as a year or month is tapped, filling in **today's day and month**. The wrapper sent every one of those changes to Livewire. On a birthday field (`->openTo('year')`), a user who tapped their birth year and closed the picker saved today's day and month as their birthday.

Measured on an application using this package: about 4,300 dates of birth matched the user's sign-up day and month, against about 560 expected by chance.

The picker now keeps an in-progress draft and commits only:

- a day picked in the last configured view (or the last entry of `views()`, e.g. the month for `['year', 'month']`)
- **Clear**, **Today**, or **OK** (mobile)
- a complete, valid date typed into the field

If the picker is dismissed half-way, the field goes back to the last saved value.

### Upgrading

Re-publish the assets after updating:

```bash
composer update chengkangzai/filament-mui-date-picker
php artisan filament:assets



```
There are no API or config changes. A partial pick no longer reaches Livewire, so `live()` fields stop firing an update for each year or month tap.

### Internals

- New Vitest + Testing Library suite (`npm test`) that drives the real MUI picker, plus a `Run JS Tests` workflow.

**Full Changelog**: https://github.com/chengkangzai/filament-mui-date-picker/compare/v3.0.2...v3.0.3

## v3.0.2 - 2026-09-15

### What changed

The React + MUI bundle and its stylesheet now load **on request** instead of on every page.

Both were registered as plain assets, so `@filamentScripts` / `@filamentStyles` emitted them wherever a host application called those directives — and applications call them from a **shared layout**. The result was an ~880KB (raw) parser-blocking bundle downloading on every page using that layout, not only the pages with a date field.

Measured on a customer-facing portal built with this package: **240KB gzipped, a third of the page's entire first-load payload, on routes with no date input anywhere.**

Both assets are now `loadedOnRequest()`, and the field's own view pulls them in with `x-load-js` / `x-load-css` alongside the `x-load-src` it already had.

### Upgrading

Nothing to do. No API change, no config, no published assets to refresh.

Applications that render a picker behave identically — `mountReact()` already polled for `window.MuiDatePickerReact` until it resolved, so a global arriving after Alpine initialises is the case that code was written for. Applications that do not render one stop paying for a bundle they never used.

If you previously published this package's view to work around the eager load, you can drop your copy and go back to the package's.

**Full Changelog**: https://github.com/chengkangzai/filament-mui-date-picker/compare/v3.0.1...v3.0.2

## v3.0.1 - 2026-03-17

### Bug Fix

#### Fix: Timezone shifting causes off-by-one date for date-only fields (#2)

When Livewire serializes a Carbon date cast (e.g., `1985-11-17 00:00:00 +08:00`), it converts to UTC ISO format (`1985-11-16T16:00:00.000000Z`). The `formatStateUsing` and `dehydrateStateUsing` callbacks now detect datetime strings (containing time info) and apply timezone conversion to recover the correct local date, while leaving simple date strings (`YYYY-MM-DD`) untouched to avoid incorrect shifting.

Closes #2

## v3.0.0 - 2026-03-17

### Single branch for Filament 4.x and 5.x

This release consolidates the previously separate `4.x` and `5.x` branches into a single package that supports both Filament versions. Since Filament 5 was released purely for Livewire 4 support with no API changes, there is zero code difference — only version constraints are widened.

#### What changed

- `filament/filament`: `^4.0 || ^5.0`
- `filament/forms`: `^4.0 || ^5.0`
- CI tests against both Laravel 11 and 12
- The `4.x` branch has been deleted

#### Includes bug fix from v2.0.1

- Fix: Date picker value not syncing to Livewire on form submit (#1)
- Fix: Timezone shifting dates in negative UTC offset timezones

#### Upgrading

```bash
composer require chengkangzai/filament-mui-date-picker "^3.0"






```
Works with both Filament 4.x and 5.x — no branch selection needed.

## 1.0.0 - 202X-XX-XX

- initial release
