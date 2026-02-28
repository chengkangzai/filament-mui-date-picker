<?php

namespace Cck\FilamentMuiDatePicker;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class MuiDatePickerServiceProvider extends PackageServiceProvider
{
    public static string $name = 'mui-date-picker';

    public static string $viewNamespace = 'mui-date-picker';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name);

        $configFileName = $package->shortName();

        if (file_exists($package->basePath("/../config/{$configFileName}.php"))) {
            $package->hasConfigFile();
        }

        if (file_exists($package->basePath('/../resources/lang'))) {
            $package->hasTranslations();
        }

        if (file_exists($package->basePath('/../resources/views'))) {
            $package->hasViews(static::$viewNamespace);
        }
    }

    public function packageRegistered(): void {}

    public function packageBooted(): void
    {
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );
    }

    protected function getAssetPackageName(): ?string
    {
        return 'chengkangzai/filament-mui-date-picker';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            AlpineComponent::make('mui-date-picker', __DIR__ . '/../resources/dist/components/mui-date-picker.js'),
            Css::make('mui-date-picker-styles', __DIR__ . '/../resources/dist/mui-date-picker.css'),
            Js::make('mui-date-picker-react', __DIR__ . '/../resources/dist/mui-date-picker.js'),
        ];
    }
}
