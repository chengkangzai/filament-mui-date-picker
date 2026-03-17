# Changelog

All notable changes to `:package_name` will be documented in this file.

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
