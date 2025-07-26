<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sector;
use App\Observers\SegmentasiPasarTransactionObserver;

// class RefreshSegmentasiPasar extends Command
// {
//     /**
//      * The name and signature of the console command.
//      *
//      * @var string
//      */
//     protected $signature = 'app:refresh-segmentasi-pasar';

//     /**
//      * The console command description.
//      *
//      * @var string
//      */
//     protected $description = 'Command description';

//     /**
//      * Execute the console command.
//      */
//     public function handle()
//     {
//         //
//     }
// }





class RefreshSegmentasiPasar extends Command
{
    protected $signature = 'segmentasi:refresh';
    protected $description = 'Hitung ulang data segmentasi pasar untuk semua sektor';

    public function handle()
    {
        $month = now()->month;
        $year = now()->year;

        foreach (Sector::with('contacts')->get() as $sector) {
            (new SegmentasiPasarTransactionObserver)->updateSegmentasiPasarForSector($sector, $month, $year);
        }

        $this->info("Segmentasi pasar diperbarui untuk bulan {$month}/{$year}.");
    }
}
