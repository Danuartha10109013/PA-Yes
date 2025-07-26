<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\SegmentasiPasar;
use App\Models\Sector;
use App\Models\Column; // Import model Column
use Illuminate\Support\Facades\Log; // For logging purposes

class SegmentasiPasarObserver
{
    // /**
    //  * Handle the Sector "created" event.
    //  *
    //  * @param  \App\Models\Sector  $sector
    //  * @return void
    //  */
    // public function created(Sector $sector)
    // {
    //     // Saat sektor dibuat, buat entri kosong di segmentasi_pasar
    //     SegmentasiPasar::updateOrCreate(
    //         ['sector_id' => $sector->id,
    //                         'month' => now()->month,
    //                         'year' => now()->year,],
    //         [
    //             'jumlah_item' => 0,
    //             'total_penjualan' => 0,
    //             'total_transaksi' => 0,
    //             'kriteria_jumlah_item' => 'NO',
    //             'kriteria_total_penjualan' => 'NO',
    //             'kriteria_total_transaksi' => 'NO',
    //             'status' => 'Potensial Rendah',
    //         ]
    //     );
    // }
    // /**
    //  * Handle the Transaction "created" event.
    //  */
    // //  public function updateSegmentasiPasarForSector(Sector $sector): void
    // // {
    // //     // Only recalculate if the name (or any other relevant field you deem necessary) changed
    // //     if ($sector->isDirty('name')) { // Or check for 'bg_color', 'text_color' if they influence
    // //         $segmentasiPasarObserver = new SegmentasiPasarObserver();
    // //         $segmentasiPasarObserver->updateSegmentasiPasarForSector($sector);
    // //         Log::info("SegmentasiPasar recalculated for sector '{$sector->name}' (ID: {$sector->id}) due to sector name update.");
    // //     }
    // // }

    // // public function created(Sector $sector): void
    // // {
    // //     // Tambahkan baris baru ke tabel segmentasi_pasar
    // //     SegmentasiPasar::create([
    // //         'sector_id' => $sector->id,
    // //         // 'name' => $sector->name,
    // //         // Tambahkan field lain jika perlu seperti 'text_color', 'bg_color', dsb.
    // //     ]);

    // //     Log::info("SegmentasiPasar dibuat otomatis untuk sektor '{$sector->name}' (ID: {$sector->id}).");
    // // }

    // // public function created(Sector $sector): void
    // // {
    // //     SegmentasiPasar::create([
    // //         'sector_id' => $sector->id,
    // //         'jumlah_item' => 0,
    // //         'total_penjualan' => 0,
    // //         'total_transaksi' => 0,
    // //         // 'kriteria_jumlah_item' => null,
    // //         // 'kriteria_total_penjualan' => null,
    // //         // 'kriteria_total_transaksi' => null,
    // //         // 'status' => null,
    // //     ]);

    // //     Log::info("SegmentasiPasar dibuat untuk sektor '{$sector->name}' (ID: {$sector->id}).");
    // // }

    // public function deleted(Sector $sector): void
    // {
    //     Log::info("Sector '{$sector->name}' (ID: {$sector->id}) dihapus. SegmentasiPasar terhapus otomatis melalui cascade.");
    // }
    // public function forceDeleted(Sector $sector): void
    // {
    //     // When a Transaction is force deleted, permanently delete its associated Report.
    //     // The Transaction model itself is already deleted by this point.
    //     SegmentasiPasar::where('sector_id', $sector->id)->delete(); // Use delete() here as it might be soft-deleted or force-deleted depending on Reports model setup.
    //     // REMOVED: $transaction->delete(); // This line is redundant and can cause issues.
    // }

    /**
     * Handle the Sector "created" event.
     *
     * @param  \App\Models\Sector  $sector
     * @return void
     */
    public function created(Sector $sector)
    {
        // When a sector is created, create an empty entry in segmentasi_pasar
        // for the current month and year.
        SegmentasiPasar::updateOrCreate(
            [
                'sector_id' => $sector->id,
                'month' => now()->month,
                'year' => now()->year,
            ],
            [
                'jumlah_item' => 0,
                'total_penjualan' => 0,
                'total_transaksi' => 0,
                'kriteria_jumlah_item' => 'NO',
                'kriteria_total_penjualan' => 'NO',
                'kriteria_total_transaksi' => 'NO',
                'status' => 'Potensial Rendah',
            ]
        );
        Log::info("SegmentasiPasar entry initialized for new sector '{$sector->name}' (ID: {$sector->id}) for current month/year.");
    }

    /**
     * Handle the Sector "deleted" event.
     *
     * @param  \App\Models\Sector  $sector
     * @return void
     */
    public function deleted(Sector $sector): void
    {
        Log::info("Sector '{$sector->name}' (ID: {$sector->id}) dihapus. SegmentasiPasar terhapus otomatis melalui cascade.");
    }

    /**
     * Handle the Sector "forceDeleted" event.
     *
     * @param  \App\Models\Sector  $sector
     * @return void
     */
    public function forceDeleted(Sector $sector): void
    {
        // When a Sector is force deleted, permanently delete its associated SegmentasiPasar records.
        // This ensures cleanup even if onDelete('cascade') isn't fully robust or soft deletes are involved.
        SegmentasiPasar::where('sector_id', $sector->id)->delete();
        Log::info("SegmentasiPasar records for force-deleted sector '{$sector->name}' (ID: {$sector->id}) have been removed.");
    }



    /**
     * Handle the Sector "deleted" event.
     * You might want to delete the SegmentasiPasar record if the sector is deleted.
     */
    // public function deleted(Sector $sector): void
    // {
    //     // The onDelete('cascade') in your migration already handles this for SegmentasiPasar.
    //     // But if you had other related data that needs manual cleanup, you'd do it here.
    //     Log::info("Sector '{$sector->name}' (ID: {$sector->id}) deleted. SegmentasiPasar record should be cascaded.");
    // }

    // You might also want to trigger an update if a Sector is created, though less common for recalculation needs.
    // public function created(Sector $sector): void
    // {
    //     $segmentasiPasarObserver = new SegmentasiPasarObserver();
    //     $segmentasiPasarObserver->updateSegmentasiPasarForSector($sector);
    // }

    // public function created(Transaction $transaction)
    // {
    //     // Call method to update market segmentation for the related sector
    //     $this->updateSegmentasiPasarForTransaction($transaction);
    // }

    // /**
    //  * Handle the Transaction "updated" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // public function updated(Transaction $transaction)
    // {
    //     // Check if columns affecting aggregation (qty, grand_total, contact_id, column_id) have changed
    //     // 'column_id' is included in isDirty() as it now affects the 'dealing' filter calculation.
    //     if ($transaction->isDirty('qty') || $transaction->isDirty('grand_total') || $transaction->isDirty('contact_id') || $transaction->isDirty('column_id')) {
    //         // If contact_id changed, we need to update market segmentation for the old sector AND the new sector
    //         if ($transaction->isDirty('contact_id')) {
    //             // Old sector (if exists)
    //             $oldContactId = $transaction->getOriginal('contact_id');
    //             if ($oldContactId) {
    //                 $oldContact = \App\Models\Contact::find($oldContactId);
    //                 if ($oldContact && $oldContact->sector) {
    //                     $this->updateSegmentasiPasarForSector($oldContact->sector);
    //                 }
    //             }
    //         }
    //         // Update for the current sector
    //         $this->updateSegmentasiPasarForTransaction($transaction);
    //     }
    // }

    // /**
    //  * Handle the Transaction "deleted" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // public function deleted(Transaction $transaction)
    // {
    //     // Update market segmentation for the related sector after transaction is deleted
    //     $this->updateSegmentasiPasarForTransaction($transaction);
    // }

    // /**
    //  * Handle the Transaction "restored" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  *
    //  * @return void
    //  */
    // public function restored(Transaction $transaction)
    // {
    //     $this->updateSegmentasiPasarForTransaction($transaction);
    // }

    // /**
    //  * Handle the Transaction "forceDeleted" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // public function forceDeleted(Transaction $transaction)
    // {
    //     $this->updateSegmentasiPasarForTransaction($transaction);
    // }

    // /**
    //  * Helper method to update SegmentasiPasar for a given transaction's sector.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
    // {
    //     // Ensure transaction has a contact and contact has a sector
    //     if ($transaction->contact && $transaction->contact->sector) {
    //         $sector = $transaction->contact->sector;
    //         $this->updateSegmentasiPasarForSector($sector);
    //     } else {
    //         Log::warning("Transaction (ID: {$transaction->id}) does not have a linked contact or sector, skipping segmentasi_pasar update.");
    //     }
    // }

    // /**
    //  * Core logic to calculate and update SegmentasiPasar data for a specific sector.
    //  *
    //  * @param  \App\Models\Sector  $sector
    //  * @return void
    //  */
    // protected function updateSegmentasiPasarForSector(Sector $sector)
    // {
    //     // Get all contact IDs associated with the current sector
    //     $contactIds = $sector->contacts->pluck('id');
    //     $numberOfContactsInSector = $contactIds->count(); // Count of contacts in this sector

    //     // If no contacts in this sector, ensure the market segmentation data is deleted or reset
    //     if ($contactIds->isEmpty()) {
    //         SegmentasiPasar::where('sector_id', $sector->id)->delete(); // Or set to default values
    //         Log::info("No contacts found for sector '{$sector->name}' (ID: {$sector->id}), removed/reset segmentasi_pasar entry.");
    //         return;
    //     }

    //     // --- Get the ID for 'DEALING' status from the 'column' table ---
    //     $dealingColumn = Column::where('name', 'DEALING')->first();

    //     // If 'DEALING' status is not found in the 'column' table, we cannot filter.
    //     // You can choose to stop the process, or continue without the 'dealing' filter.
    //     if (!$dealingColumn) {
    //         Log::error("'DEALING' status not found in 'columns' table. SegmentasiPasar will not filter by 'dealing' status.");
    //         // For this scenario, we will continue WITHOUT the 'dealing' filter.
    //         // If you wish to stop, uncomment the line below:
    //         // return;
    //     }

    //     // Get all transactions related to these contacts
    //     // ONLY count transactions that are 'DEALING'
    //     $query = Transaction::whereIn('contact_id', $contactIds);

    //     if ($dealingColumn) {
    //         $query->where('column_id', $dealingColumn->id);
    //     }

    //     $transactions = $query->get();

    //     // Calculate aggregated data for the sector
    //     $jumlahItem = $transactions->sum('qty');
    //     $totalPenjualan = $transactions->sum('grand_total');
    //     $totalTransaksi = $transactions->count(); // Counts all transactions. If you need unique 'trx' column, use ->unique('trx')->count()

    //     // --- Calculate averages for criteria ---
    //     // Calculate the average quantity per transaction in this sector
    //     $rataRataQtyPerTransaksiSektor = ($totalTransaksi > 0) ? ($jumlahItem / $totalTransaksi) : 0;
    //     // Calculate the average sales (grand_total) per transaction in this sector
    //     $rataRataPenjualanPerTransaksiSektor = ($totalTransaksi > 0) ? ($totalPenjualan / $totalTransaksi) : 0;
    //     // Calculate the average number of transactions per contact in this sector
    //     $rataRataTransaksiPerKontakSektor = ($numberOfContactsInSector > 0) ? ($totalTransaksi / $numberOfContactsInSector) : 0;


    //     // --- Apply your Rule-based Decision Tree logic ---

    //     // The prediksi_manual function to determine 'YES' or 'NO'
    //     // Now all criteria compare against dynamically calculated averages
    //     $prediksiManual = function ($itemCount, $salesTotal, $transactionCount, $avgQty, $avgSales, $avgTransactions) {
    //         return [
    //             'Jumlah item' => $itemCount > $avgQty ? 'YES' : 'NO',
    //             'Total Penjualan' => $salesTotal >= $avgSales ? 'YES' : 'NO', // Using average sales as threshold
    //             'Jumlah Transaksi' => $transactionCount > $avgTransactions ? 'YES' : 'NO' // Using average transactions per contact as threshold
    //         ];
    //     };

    //     // Get 'YES'/'NO' results for each criterion
    //     $kriteriaResults = $prediksiManual(
    //         $jumlahItem,
    //         $totalPenjualan,
    //         $totalTransaksi,
    //         $rataRataQtyPerTransaksiSektor,
    //         $rataRataPenjualanPerTransaksiSektor,
    //         $rataRataTransaksiPerKontakSektor
    //     );

    //     $kriteriaJumlahItem = $kriteriaResults['Jumlah item'];
    //     $kriteriaTotalPenjualan = $kriteriaResults['Total Penjualan'];
    //     // Ensure the column name matches your migration, assuming 'kriteria_total_transaksi' without spaces
    //     $kriteriaTotalTransaksi = $kriteriaResults['Jumlah Transaksi'];

    //     // The prediksi_manual1 function to determine 'Status'
    //     $prediksiManual1 = function ($ji, $tp, $jt) {
    //         if ($ji == 'YES' && $tp == 'YES') {
    //             return 'Potensial Tinggi';
    //         } elseif ($ji == 'YES' && $tp == 'NO' && $jt == 'YES') {
    //             return 'Potensial Sedang';
    //         } elseif ($ji == 'YES' && $tp == 'NO' && $jt == 'NO') {
    //             return 'Potensial Sedang';
    //         } elseif ($ji == 'NO' && $tp == 'YES' && $jt == 'YES') {
    //             return 'Potensial Sedang';
    //         } elseif ($ji == 'NO' && $tp == 'NO' && $jt == 'YES') {
    //             return 'Potensial Rendah';
    //         } elseif ($ji == 'NO' && $tp == 'NO' && $jt == 'NO') {
    //             return 'Potensial Rendah';
    //         } else {
    //             return 'Potensial Rendah'; // Catch-all, though previous conditions should cover all permutations
    //         }
    //     };

    //     // Determine status based on combined criteria
    //     $status = $prediksiManual1(
    //         $kriteriaJumlahItem,
    //         $kriteriaTotalPenjualan,
    //         $kriteriaTotalTransaksi
    //     );

    //     // Create or update the SegmentasiPasar record
    //     SegmentasiPasar::updateOrCreate(
    //         ['sector_id' => $sector->id], // Find by sector_id
    //         [
    //             'jumlah_item' => $jumlahItem,
    //             'total_penjualan' => $totalPenjualan,
    //             'total_transaksi' => $totalTransaksi,
    //             'kriteria_jumlah_item' => $kriteriaJumlahItem,
    //             'kriteria_total_penjualan' => $kriteriaTotalPenjualan,
    //             'kriteria_total_transaksi' => $kriteriaTotalTransaksi, // Ensure this column name matches your migration
    //             'status' => $status,
    //         ]
    //     );

    //     Log::info("SegmentasiPasar updated for sector '{$sector->name}' (ID: {$sector->id}). Data: Items={$jumlahItem}, Sales={$totalPenjualan}, Transactions={$totalTransaksi}, Status={$status}");
    // }
}

