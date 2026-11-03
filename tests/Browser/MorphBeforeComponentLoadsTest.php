<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

use function Amp\delay;

/**
 * Reproduces the production race in a real browser: a Livewire update lands while the
 * picker's lazy-loaded Alpine component (x-load-src) is still downloading — a slow mobile
 * network. Before the fix the morph cloned the element and Alpine threw
 * "muiDatePickerFormComponent is not defined" / "state is not defined".
 *
 * Filament's own assets are published so the page runs the real async-alpine x-load plugin.
 * This package's assets are deliberately NOT published: Pest's server serves public/ files
 * directly, so leaving them out routes them through Laravel, where the component script is
 * held back with a non-blocking Amp delay (the Livewire update is answered meanwhile).
 *
 * Runs in CI's "Browser tests" job. Locally:
 *   composer require --dev pestphp/pest-plugin-browser:^4.0 --no-update && composer update
 *   npm ci && npx playwright install chromium
 *   vendor/bin/pest --group=browser
 * The plugin is not in composer.json because it refuses to boot Pest without Playwright.
 */
beforeEach(function () {
    Artisan::call('filament:assets');
    File::deleteDirectory(public_path('js/chengkangzai'));
    File::deleteDirectory(public_path('css/chengkangzai'));

    $dist = dirname(__DIR__, 2) . '/resources/dist';
    $serve = fn (string $file, string $type) => response(File::get("{$dist}/{$file}"), 200, ['Content-Type' => $type]);

    Route::get('js/chengkangzai/filament-mui-date-picker/components/mui-date-picker.js', function () use ($serve) {
        delay(3);

        return $serve('components/mui-date-picker.js', 'application/javascript');
    });
    Route::get('js/chengkangzai/filament-mui-date-picker/mui-date-picker-react.js', fn () => $serve('mui-date-picker.js', 'application/javascript'));
    Route::get('css/chengkangzai/filament-mui-date-picker/mui-date-picker-styles.css', fn () => $serve('mui-date-picker.css', 'text/css'));

    Route::get('/picker', fn () => Blade::render(<<<'BLADE'
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="csrf-token" content="{{ csrf_token() }}">
                @filamentStyles
            </head>
            <body>
                @livewire(\Cck\FilamentMuiDatePicker\Tests\Fixtures\Livewire\DatePickerForm::class)
                @filamentScripts
            </body>
        </html>
        BLADE))->middleware('web');
});

it('survives a Livewire morph that lands before the Alpine component has loaded', function () {
    $page = visit('/picker');

    // The component script is still on its 3s delay: force a morph now.
    $page->script('() => Livewire.first().$refresh()');
    $page->wait(1);

    $page->assertNoJavaScriptErrors();

    // Once the delayed script arrives the picker still boots and mounts React.
    $page->wait(4);

    $page->assertScript(
        '() => document.querySelector(".fi-fo-mui-date-picker-container")?.children.length > 0',
        true,
    );
    $page->assertNoJavaScriptErrors();
})->group('browser');
