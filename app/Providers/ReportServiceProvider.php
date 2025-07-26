<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\ReportsObserver; // Import your observer
use App\Models\Transaction; // Import your model
// use Illuminate\Foundation\Support\ProvidersReportsServiceProvider as ServiceProvider;


class ReportServiceProvider extends ServiceProvider
{

    protected $listen = [
        //
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
     public function boot()
    {
        // Register the TransactionObserver to listen for Transaction model events
        Transaction::observe(ReportsObserver::class);
    }
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
