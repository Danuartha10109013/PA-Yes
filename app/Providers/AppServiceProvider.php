<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Observers\ReportsObserver;
use App\Observers\TransactionObserver;
use App\Models\Reports;
use App\Models\Transaction;
use App\Models\Sector;
use App\Observers\SegmentasiPasarObserver;
use App\Observers\SegmentasiPasarTransactionObserver;
// Illuminate\View\ViewServiceProvider::class;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    // public function boot(): void
    // {
    //     Vite::prefetch(concurrency: 3);
    // }

    public function boot(): void
    {
        Reports::observe(ReportsObserver::class);
        Transaction::observe(TransactionObserver::class); // Daftarkan TransactionObserver
        Sector::observe(SegmentasiPasarObserver::class);
        Transaction::observe(SegmentasiPasarTransactionObserver::class);
    }

}
