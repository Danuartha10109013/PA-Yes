<?php

// namespace App\Observers;

// use App\Models\Transaction;
// use App\Models\SegmentasiPasar;
// use App\Models\Sector;
// use App\Models\Contact;
// use App\Models\Column;
// use Illuminate\Support\Facades\Log;

// class SegmentasiPasarTransactionObserver
// {
//     public function created(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function updated(Transaction $transaction)
//     {
//         if ($transaction->isDirty('qty') || $transaction->isDirty('grand_total') || $transaction->isDirty('contact_id') || $transaction->isDirty('column_id')) {
//             if ($transaction->isDirty('contact_id')) {
//                 $oldContactId = $transaction->getOriginal('contact_id');
//                 if ($oldContactId) {
//                     $oldContact = Contact::find($oldContactId);
//                     if ($oldContact && $oldContact->sector) {
//                         $this->updateSegmentasiPasarForSector($oldContact->sector);
//                     }
//                 }
//             }
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     public function deleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function restored(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function forceDeleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
//     {
//         if ($transaction->contact && $transaction->contact->sector) {
//             $this->updateSegmentasiPasarForSector($transaction->contact->sector);
//         } else {
//             Log::warning("Transaction (ID: {$transaction->id}) does not have a linked contact or sector.");
//         }
//     }



// protected function updateSegmentasiPasarForSector(Sector $sector)
//     {
//         // Mencoba mendapatkan data segmentasi pasar yang sudah ada untuk sektor ini
//         // Jika tidak ada, diasumsikan sebagai sektor baru yang belum memiliki data segmentasi.
//         $currentSectorSegment = SegmentasiPasar::where('sector_id', $sector->id)->first();

//         // Jika sektor tidak memiliki record SegmentasiPasar, anggap sebagai Potensial Rendah.
//         // Dalam skenario ini, kita akan membuat record baru dengan nilai 0.
//         // Jika Anda ingin mengizinkan pembuatan data pertama kali berdasarkan transaksi
//         // dan kemudian baru mereferensikan SegmentasiPasar, logika ini perlu diubah.
//         if (!$currentSectorSegment) {
//             // Ini akan menjadi nilai awal untuk sektor ini
//             $jumlahItem = 0;
//             $totalPenjualan = 0;
//             $totalTransaksi = 0;

//             Log::info("Sector '{$sector->name}' (ID: {$sector->id}) has no existing SegmentasiPasar record. Initializing with zero values.");
//         } else {
//             // Ambil metrik untuk sektor saat ini dari record SegmentasiPasar yang sudah ada
//             $jumlahItem = $currentSectorSegment->jumlah_item;
//             $totalPenjualan = $currentSectorSegment->total_penjualan;
//             $totalTransaksi = $currentSectorSegment->total_transaksi;
//         }

//         // --- MENGHITUNG RATA-RATA GLOBAL DARI SELURUH DATA SEGMENTASI PASAR ---
//         // Ambil semua data dari tabel segmentasi_pasar untuk perhitungan rata-rata global
//         $globalSegmentasiPasarData = SegmentasiPasar::all();

//         // Penting: Pastikan ada data untuk mencegah pembagian dengan nol.
//         // Jika tidak ada data di tabel sama sekali (kecuali sektor saat ini), rata-rata akan 0.
//         $avgQty = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('jumlah_item') / $globalSegmentasiPasarData->count() : 0;
//         $avgSales = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_penjualan') / $globalSegmentasiPasarData->count() : 0;
//         $avgTransactions = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_transaksi') / $globalSegmentasiPasarData->count() : 0;
//         // --- AKHIR PERHITUNGAN RATA-RATA GLOBAL ---

//         // --- BARIS DEBUGGING (Untuk verifikasi, bisa dihapus setelah produksi) ---
//         Log::info("--- SEGMENTASI PASAR DEBUG ---");
//         Log::info("Sector Name: {$sector->name} (ID: {$sector->id})");

//         Log::info("Sector Jumlah Item (FROM SegmentasiPasar): {$jumlahItem}");
//         Log::info("Global Average Item (avgQty FROM ALL SegmentasiPasar): {$avgQty}");
//         Log::info("Comparison Jumlah Item: {$jumlahItem} > {$avgQty} ? " . ($jumlahItem > $avgQty ? 'YES' : 'NO'));

//         Log::info("Sector Total Penjualan (FROM SegmentasiPasar): {$totalPenjualan}");
//         Log::info("Global Average Penjualan (avgSales FROM ALL SegmentasiPasar): {$avgSales}");
//         Log::info("Comparison Total Penjualan: {$totalPenjualan} >= {$avgSales} ? " . ($totalPenjualan >= $avgSales ? 'YES' : 'NO'));

//         Log::info("Sector Total Transaksi (FROM SegmentasiPasar): {$totalTransaksi}");
//         Log::info("Global Average Transaksi (avgTransactions FROM ALL SegmentasiPasar): {$avgTransactions}");
//         Log::info("Comparison Total Transaksi: {$totalTransaksi} > {$avgTransactions} ? " . ($totalTransaksi > $avgTransactions ? 'YES' : 'NO'));
//         Log::info("--- END DEBUG ---");
//         // ------------------------------------------

//         // Evaluasi kriteria dengan membandingkan data sektor dengan rata-rata keseluruhan dari SegmentasiPasar
//         $kriteria = [
//             'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//             'Total Penjualan' => $totalPenjualan >= $avgSales ? 'YES' : 'NO',
//             'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//         ];

//         // Tentukan status potensi sektor berdasarkan kriteria yang dievaluasi
//         $status = match (true) {
//             $kriteria['Jumlah item'] === 'YES' && $kriteria['Total Penjualan'] === 'YES' => 'Potensial Tinggi',
//             $kriteria['Jumlah Transaksi'] === 'YES' => 'Potensial Sedang',
//             default => 'Potensial Rendah',
//         };

//         // Simpan atau perbarui record SegmentasiPasar untuk sektor saat ini
//         SegmentasiPasar::updateOrCreate(
//             ['sector_id' => $sector->id],
//             [
//                 'jumlah_item' => $jumlahItem,
//                 'total_penjualan' => $totalPenjualan,
//                 'total_transaksi' => $totalTransaksi,
//                 'kriteria_jumlah_item' => $kriteria['Jumlah item'],
//                 'kriteria_total_penjualan' => $kriteria['Total Penjualan'],
//                 'kriteria_total_transaksi' => $kriteria['Jumlah Transaksi'],
//                 'status' => $status,
//             ]
//         );

//         Log::info("SegmentasiPasar updated for sector '{$sector->name}' (ID: {$sector->id}).");
//     }

// }

//  public function created(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function updated(Transaction $transaction)
//     {
//         // Only re-calculate if relevant fields change
//         if ($transaction->isDirty('qty') || $transaction->isDirty('grand_total') || $transaction->isDirty('contact_id') || $transaction->isDirty('column_id')) {
//             // If contact_id changed, update the old sector's segmentation first
//             if ($transaction->isDirty('contact_id')) {
//                 $oldContactId = $transaction->getOriginal('contact_id');
//                 if ($oldContactId) {
//                     $oldContact = Contact::find($oldContactId);
//                     if ($oldContact && $oldContact->sector) {
//                         $this->updateSegmentasiPasarForSector($oldContact->sector);
//                     }
//                 }
//             }
//             // Then update the new (or current) sector's segmentation
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     public function deleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function restored(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function forceDeleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     /**
//      * Helper to get the sector from a transaction and trigger the update.
//      */
//     protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
//     {
//         if ($transaction->contact && $transaction->contact->sector) {
//             $this->updateSegmentasiPasarForSector($transaction->contact->sector);
//         } else {
//             Log::warning("Transaction (ID: {$transaction->id}) does not have a linked contact or sector, skipping SegmentasiPasar update.");
//         }
//     }

//     /**
//      * Core logic to calculate and update SegmentasiPasar data for a specific sector.
//      * This method needs to query transactions for the sector to get up-to-date aggregates.
//      */
//     protected function updateSegmentasiPasarForSector(Sector $sector)
//     {
//         // 1. Aggregate Transaction Data for the Current Sector
//         // Get all contact IDs associated with the current sector
//         $contactIds = $sector->contacts->pluck('id');

//         // If no contacts in this sector, or no transactions, reset SegmentasiPasar for this sector
//         if ($contactIds->isEmpty()) {
//             SegmentasiPasar::updateOrCreate(
//                 ['sector_id' => $sector->id],
//                 [
//                     'jumlah_item' => 0,
//                     'total_penjualan' => 0,
//                     'total_transaksi' => 0,
//                     'kriteria_jumlah_item' => 'NO',
//                     'kriteria_total_penjualan' => 'NO',
//                     'kriteria_total_transaksi' => 'NO',
//                     'status' => 'Potensial Rendah',
//                     'month' => now()->month, // Add month and year for consistency
//                     'year' => now()->year,
//                 ]
//             );
//             Log::info("No contacts found for sector '{$sector->name}' (ID: {$sector->id}), SegmentasiPasar reset to zero.");
//             return;
//         }

//         // --- Get the ID for 'DEALING' status from the 'column' table ---
//         // Assuming 'DEALING' is a status in your 'columns' table.
//         // This makes your previous commented code functional.
//         $dealingColumn = Column::where('name', 'DEALING')->first();
//         if (!$dealingColumn) {
//             Log::error("'DEALING' status not found in 'columns' table. SegmentasiPasar will not filter by 'dealing' status. Please ensure the 'DEALING' column exists.");
//             // Decide whether to proceed without filtering or return.
//             // For now, we'll proceed without filtering if not found.
//         }

//         // Get all transactions related to these contacts for the *current month and year*
//         // You mentioned 'month' and 'year' in SegmentasiPasar, so we should filter by them here.
//         $query = Transaction::whereIn('contact_id', $contactIds)
//                             ->whereMonth('created_at', now()->month) // Filter by current month
//                             ->whereYear('created_at', now()->year);   // Filter by current year

//         if ($dealingColumn) {
//             $query->where('column_id', $dealingColumn->id);
//         }

//         $transactions = $query->get();

//         // Calculate aggregated data for the current sector (from its transactions)
//         $jumlahItem = $transactions->sum('qty');
//         $totalPenjualan = $transactions->sum('grand_total');
//         $totalTransaksi = $transactions->count();

//         // 2. Calculate Global Averages from ALL SegmentasiPasar records
//         // This is correct as is, it gets averages from the already calculated segmentations.
//         $globalSegmentasiPasarData = SegmentasiPasar::all();
//         $avgQty = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('jumlah_item') / $globalSegmentasiPasarData->count() : 0;
//         $avgSales = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_penjualan') / $globalSegmentasiPasarData->count() : 0;
//         $avgTransactions = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_transaksi') / $globalSegmentasiPasarData->count() : 0;

//         // --- DEBUGGING LOGS ---
//         Log::info("--- SEGMENTASI PASAR DEBUG ---");
//         Log::info("Sector Name: {$sector->name} (ID: {$sector->id})");
//         Log::info("Calculated Sector Jumlah Item (from Transactions): {$jumlahItem}");
//         Log::info("Calculated Sector Total Penjualan (from Transactions): {$totalPenjualan}");
//         Log::info("Calculated Sector Total Transaksi (from Transactions): {$totalTransaksi}");
//         Log::info("Global Average Item: {$avgQty}");
//         Log::info("Global Average Sales: {$avgSales}");
//         Log::info("Global Average Transactions: {$avgTransactions}");
//         Log::info("--- END DEBUG ---");
//         // ------------------------------------------

//         // 3. Evaluate Criteria based on Current Sector's Data vs. Global Averages
//         $kriteria = [
//             'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//             'Total Penjualan' => $totalPenjualan >= $avgSales ? 'YES' : 'NO',
//             'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//         ];

//         // 4. Determine Status
//         $status = match (true) {
//             $kriteria['Jumlah item'] === 'YES' && $kriteria['Total Penjualan'] === 'YES' => 'Potensial Tinggi',
//             $kriteria['Jumlah Transaksi'] === 'YES' => 'Potensial Sedang',
//             default => 'Potensial Rendah',
//         };

//         // 5. Save or Update SegmentasiPasar record for the current sector
//         SegmentasiPasar::updateOrCreate(
//             [
//                 'sector_id' => $sector->id,
//                 'month' => now()->month, // Ensure unique entry per month/year
//                 'year' => now()->year,
//             ],
//             [
//                 'jumlah_item' => $jumlahItem,
//                 'total_penjualan' => $totalPenjualan,
//                 'total_transaksi' => $totalTransaksi,
//                 'kriteria_jumlah_item' => $kriteria['Jumlah item'],
//                 'kriteria_total_penjualan' => $kriteria['Total Penjualan'],
//                 'kriteria_total_transaksi' => $kriteria['Jumlah Transaksi'],
//                 'status' => $status,
//             ]
//         );

//         Log::info("SegmentasiPasar updated for sector '{$sector->name}' (ID: {$sector->id}). Status: {$status}");
//     }
// }


/**
     * Handle the Transaction "created" event.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return void
     */
    // public function created(Transaction $transaction)
    // {
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
    //     // Only re-calculate if relevant fields change
    //     if ($transaction->isDirty('qty') || $transaction->isDirty('grand_total') || $transaction->isDirty('contact_id') || $transaction->isDirty('column_id') || $transaction->isDirty('created_at')) {
    //         // If contact_id changed, update the old sector's segmentation first
    //         if ($transaction->isDirty('contact_id')) {
    //             $oldContactId = $transaction->getOriginal('contact_id');
    //             if ($oldContactId) {
    //                 $oldContact = Contact::find($oldContactId);
    //                 // Only update the old sector if it has a sector and the transaction's old created_at falls within the current month/year
    //                 // This prevents recalculating old months unnecessarily.
    //                 if ($oldContact && $oldContact->sector && now()->month == $transaction->getOriginal('created_at')->month && now()->year == $transaction->getOriginal('created_at')->year) {
    //                     $this->updateSegmentasiPasarForSector($oldContact->sector);
    //                 }
    //             }
    //         }
    //         // Then update the new (or current) sector's segmentation for the relevant month
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
    //     // Only update if the deleted transaction was for the current month/year
    //     if (now()->month == $transaction->created_at->month && now()->year == $transaction->created_at->year) {
    //         $this->updateSegmentasiPasarForTransaction($transaction);
    //     } else {
    //         Log::info("Transaction (ID: {$transaction->id}) from a past month/year was deleted, skipping SegmentasiPasar update.");
    //     }
    // }

    // /**
    //  * Handle the Transaction "restored" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // public function restored(Transaction $transaction)
    // {
    //     // Only update if the restored transaction is for the current month/year
    //     if (now()->month == $transaction->created_at->month && now()->year == $transaction->created_at->year) {
    //         $this->updateSegmentasiPasarForTransaction($transaction);
    //     } else {
    //         Log::info("Transaction (ID: {$transaction->id}) from a past month/year was restored, skipping SegmentasiPasar update.");
    //     }
    // }

    // /**
    //  * Handle the Transaction "forceDeleted" event.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // public function forceDeleted(Transaction $transaction)
    // {
    //     // Only update if the force-deleted transaction was for the current month/year
    //     if (now()->month == $transaction->created_at->month && now()->year == $transaction->created_at->year) {
    //         $this->updateSegmentasiPasarForTransaction($transaction);
    //     } else {
    //         Log::info("Transaction (ID: {$transaction->id}) from a past month/year was force-deleted, skipping SegmentasiPasar update.");
    //     }
    // }

    // /**
    //  * Helper to get the sector from a transaction and trigger the update.
    //  *
    //  * @param  \App\Models\Transaction  $transaction
    //  * @return void
    //  */
    // protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
    // {
    //     if ($transaction->contact && $transaction->contact->sector) {
    //         $this->updateSegmentasiPasarForSector($transaction->contact->sector);
    //     } else {
    //         Log::warning("Transaction (ID: {$transaction->id}) does not have a linked contact or sector, skipping SegmentasiPasar update.");
    //     }
    // }

    /**
     * Core logic to calculate and update SegmentasiPasar data for a specific sector.
     * This method now strictly queries transactions for the current month and year.
     *
     * @param  \App\Models\Sector  $sector
     * @return void
     */
//     protected function updateSegmentasiPasarForSector(Sector $sector)
//     {
//         $currentMonth = now()->month;
//         $currentYear = now()->year;

//         // 1. Aggregate Transaction Data for the Current Sector and Current Month/Year
//         $contactIds = $sector->contacts->pluck('id');

//         // Get the ID for 'DEALING' status from the 'column' table
//         $dealingColumn = Column::where('name', 'DEALING')->first();
//         if (!$dealingColumn) {
//             Log::error("'DEALING' status not found in 'columns' table. SegmentasiPasar will not filter by 'dealing' status. Please ensure the 'DEALING' column exists.");
//         }

//         $query = Transaction::whereIn('contact_id', $contactIds)
//                             ->whereMonth('created_at', $currentMonth)
//                             ->whereYear('created_at', $currentYear);

//         if ($dealingColumn) {
//             $query->where('column_id', $dealingColumn->id);
//         }

//         $transactions = $query->get();

//         $jumlahItem = $transactions->sum('qty');
//         $totalPenjualan = $transactions->sum('grand_total');
//         $totalTransaksi = $transactions->count();

//         // 2. Calculate Global Averages from ALL SegmentasiPasar records for the *current month and year*
//         // This ensures comparisons are based on the current period's overall performance.
//         $globalSegmentasiPasarData = SegmentasiPasar::where('month', $currentMonth)
//                                                   ->where('year', $currentYear)
//                                                   ->get();

//         $avgQty = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('jumlah_item') / $globalSegmentasiPasarData->count() : 0;
//         $avgSales = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_penjualan') / $globalSegmentasiPasarData->count() : 0;
//         $avgTransactions = $globalSegmentasiPasarData->count() > 0 ? $globalSegmentasiPasarData->sum('total_transaksi') / $globalSegmentasiPasarData->count() : 0;

//         // --- DEBUGGING LOGS ---
//         Log::info("--- SEGMENTASI PASAR DEBUG ({$currentMonth}/{$currentYear}) ---");
//         Log::info("Sector Name: {$sector->name} (ID: {$sector->id})");
//         Log::info("Calculated Sector Jumlah Item (from Transactions): {$jumlahItem}");
//         Log::info("Calculated Sector Total Penjualan (from Transactions): {$totalPenjualan}");
//         Log::info("Calculated Sector Total Transaksi (from Transactions): {$totalTransaksi}");
//         Log::info("Global Average Item (for current month/year): {$avgQty}");
//         Log::info("Global Average Sales (for current month/year): {$avgSales}");
//         Log::info("Global Average Transactions (for current month/year): {$avgTransactions}");
//         Log::info("--- END DEBUG ---");
//         // ------------------------------------------

//         // 3. Evaluate Criteria based on Current Sector's Data vs. Global Averages
//         $kriteria = [
//             'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//             'Total Penjualan' => $totalPenjualan >= $avgSales ? 'YES' : 'NO',
//             'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//         ];

//         // 4. Determine Status
//         $status = 'Potensial Rendah'; // Default status
//         if ($kriteria['Jumlah item'] === 'YES' && $kriteria['Total Penjualan'] === 'YES') {
//             $status = 'Potensial Tinggi';
//         } elseif ($kriteria['Jumlah Transaksi'] === 'YES') {
//             $status = 'Potensial Sedang';
//         }

//         // 5. Save or Update SegmentasiPasar record for the current sector and current month/year
//         SegmentasiPasar::updateOrCreate(
//             [
//                 'sector_id' => $sector->id,
//                 'month' => $currentMonth,
//                 'year' => $currentYear,
//             ],
//             [
//                 'jumlah_item' => $jumlahItem,
//                 'total_penjualan' => $totalPenjualan,
//                 'total_transaksi' => $totalTransaksi,
//                 'kriteria_jumlah_item' => $kriteria['Jumlah item'],
//                 'kriteria_total_penjualan' => $kriteria['Total Penjualan'],
//                 'kriteria_total_transaksi' => $kriteria['Jumlah Transaksi'],
//                 'status' => $status,
//             ]
//         );

// //         Log::info("SegmentasiPasar updated for sector '{$sector->name}' (ID: {$sector->id}) for {$currentMonth}/{$currentYear}. Status: {$status}");
// //     }
// protected function updateSegmentasiPasarForSector(Sector $sector)
// {
//     $currentMonth = now()->month;
//     $currentYear = now()->year;

//     // 1. Aggregate Transaction Data for the Current Sector and Current Month/Year
//     $contactIds = $sector->contacts->pluck('id');

//     // Get the ID for 'DEALING' status from the 'column' table
//     $dealingColumn = Column::where('name', 'DEALING')->first();
//     if (!$dealingColumn) {
//         Log::error("'DEALING' status not found in 'columns' table. SegmentasiPasar will not filter by 'dealing' status. Please ensure the 'DEALING' column exists.");
//     }

//     $sectorQuery = Transaction::whereIn('contact_id', $contactIds)
//                               ->whereMonth('created_at', $currentMonth)
//                               ->whereYear('created_at', $currentYear);

//     if ($dealingColumn) {
//         $sectorQuery->where('column_id', $dealingColumn->id);
//     }

//     $sectorTransactions = $sectorQuery->get();

//     $jumlahItem = $sectorTransactions->sum('qty');
//     $totalPenjualan = $sectorTransactions->sum('grand_total');
//     $totalTransaksi = $sectorTransactions->count();

//     // 2. Calculate Global Averages directly from Transactions of ALL sectors
//     // Get all sector IDs
//     $allSectors = Sector::all();
//     $allSectorIds = $allSectors->pluck('id');

//     // Get all contact IDs grouped by sector (to calculate per sector)
//     $sectorContactIdsMap = [];
//     foreach ($allSectors as $s) {
//         $sectorContactIdsMap[$s->id] = $s->contacts->pluck('id')->toArray();
//     }

//     // Prepare arrays to hold per-sector totals
//     $perSectorJumlahItem = [];
//     $perSectorTotalPenjualan = [];
//     $perSectorTotalTransaksi = [];

//     foreach ($allSectors as $s) {
//         $cIds = $sectorContactIdsMap[$s->id];

//         $q = Transaction::whereIn('contact_id', $cIds)
//                         ->whereMonth('created_at', $currentMonth)
//                         ->whereYear('created_at', $currentYear);

//         if ($dealingColumn) {
//             $q->where('column_id', $dealingColumn->id);
//         }

//         $trans = $q->get();

//         $perSectorJumlahItem[] = $trans->sum('qty');
//         $perSectorTotalPenjualan[] = $trans->sum('grand_total');
//         $perSectorTotalTransaksi[] = $trans->count();
//     }

//     $sectorCount = count($allSectors);

//     $avgQty = $sectorCount > 0 ? array_sum($perSectorJumlahItem) / $sectorCount : 0;
//     $avgSales = $sectorCount > 0 ? array_sum($perSectorTotalPenjualan) / $sectorCount : 0;
//     $avgTransactions = $sectorCount > 0 ? array_sum($perSectorTotalTransaksi) / $sectorCount : 0;

//     // --- DEBUGGING LOGS ---
//     Log::info("--- SEGMENTASI PASAR DEBUG ({$currentMonth}/{$currentYear}) ---");
//     Log::info("Sector Name: {$sector->name} (ID: {$sector->id})");
//     Log::info("Calculated Sector Jumlah Item (from Transactions): {$jumlahItem}");
//     Log::info("Calculated Sector Total Penjualan (from Transactions): {$totalPenjualan}");
//     Log::info("Calculated Sector Total Transaksi (from Transactions): {$totalTransaksi}");
//     Log::info("Global Average Item (for current month/year): {$avgQty}");
//     Log::info("Global Average Sales (for current month/year): {$avgSales}");
//     Log::info("Global Average Transactions (for current month/year): {$avgTransactions}");
//     Log::info("--- END DEBUG ---");

//     // 3. Evaluate Criteria based on Current Sector's Data vs. Global Averages
//     $kriteria = [
//         'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//         'Total Penjualan' => $totalPenjualan >= $avgSales ? 'YES' : 'NO',
//         'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//     ];


//     $ji = $kriteria['Jumlah item'];
//     $tp = $kriteria['Total Penjualan'];
//     $jt = $kriteria['Jumlah Transaksi'];

//     if ($ji === 'YES' && $tp === 'YES') {
//         $status = 'Potensial Tinggi';
//     } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
//         $status = 'Potensial Sedang';
//     } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
//         $status = 'Potensial Sedang';
//     } elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
//         $status = 'Potensial Sedang';
//     } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
//         $status = 'Potensial Rendah';
//     } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'NO') {
//         $status = 'Potensial Rendah';
//     } else {
//         $status = 'Potensial Rendah'; // fallback, just in case
//     }

//     // 4. Determine Status
//     // $status = 'Potensial Rendah'; // Default status
//     // if ($kriteria['Jumlah item'] === 'YES' && $kriteria['Total Penjualan'] === 'YES') {
//     //     $status = 'Potensial Tinggi';
//     // } elseif ($kriteria['Jumlah Transaksi'] === 'YES') {
//     //     $status = 'Potensial Sedang';
//     // }

//     // 5. Save or Update SegmentasiPasar record for the current sector and current month/year
//     SegmentasiPasar::updateOrCreate(
//         [
//             'sector_id' => $sector->id,
//             'month' => $currentMonth,
//             'year' => $currentYear,
//         ],
//         [
//             'jumlah_item' => $jumlahItem,
//             'total_penjualan' => $totalPenjualan,
//             'total_transaksi' => $totalTransaksi,
//             'kriteria_jumlah_item' => $kriteria['Jumlah item'],
//             'kriteria_total_penjualan' => $kriteria['Total Penjualan'],
//             'kriteria_total_transaksi' => $kriteria['Jumlah Transaksi'],
//             'status' => $status,
//         ]
//     );

//     Log::info("SegmentasiPasar updated for sector '{$sector->name}' (ID: {$sector->id}) for {$currentMonth}/{$currentYear}. Status: {$status}");
// }

// }



// namespace App\Observers;

// use App\Models\Transaction;
// use App\Models\Contact;
// use App\Models\Sector;
// use App\Models\Column;
// use App\Models\SegmentasiPasar;
// use Illuminate\Support\Facades\Log;

// class SegmentasiPasarTransactionObserver
// {
//     public function created(Transaction $transaction)
//     {
//         Log::info("Transaction created: {$transaction->id}");
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function updated(Transaction $transaction)
//     {
//         if (
//             $transaction->isDirty('qty') ||
//             $transaction->isDirty('grand_total') ||
//             $transaction->isDirty('contact_id') ||
//             $transaction->isDirty('column_id') ||
//             $transaction->isDirty('created_at')
//         ) {
//             // Jika contact berubah, update sektor lama
//             if ($transaction->isDirty('contact_id')) {
//                 $oldContactId = $transaction->getOriginal('contact_id');
//                 if ($oldContactId) {
//                     $oldContact = Contact::find($oldContactId);
//                     if ($oldContact && $oldContact->sector) {
//                         if (
//                             now()->month == $transaction->getOriginal('created_at')->month &&
//                             now()->year == $transaction->getOriginal('created_at')->year
//                         ) {
//                             $this->updateSegmentasiPasarForSector($oldContact->sector);
//                         }
//                     }
//                 }
//             }

//             // Pastikan data sudah tersimpan sebelum lanjut
//             $transaction->refresh();
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     public function deleted(Transaction $transaction)
//     {
//         if (
//             now()->month == $transaction->created_at->month &&
//             now()->year == $transaction->created_at->year
//         ) {
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         } else {
//             Log::info("Transaction (ID: {$transaction->id}) from past month/year deleted. Skipped.");
//         }
//     }

//     public function restored(Transaction $transaction)
//     {
//         if (
//             now()->month == $transaction->created_at->month &&
//             now()->year == $transaction->created_at->year
//         ) {
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     public function forceDeleted(Transaction $transaction)
//     {
//         if (
//             now()->month == $transaction->created_at->month &&
//             now()->year == $transaction->created_at->year
//         ) {
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
//     {
//         if ($transaction->contact && $transaction->contact->sector) {
//             $this->updateSegmentasiPasarForSector($transaction->contact->sector);
//         } else {
//             Log::warning("Transaction {$transaction->id} has no contact or sector.");
//         }
//     }

//     protected function updateSegmentasiPasarForSector(Sector $sector)
//     {
//         $currentMonth = now()->month;
//         $currentYear = now()->year;

//         $contactIds = $sector->contacts->pluck('id');

//         $dealingColumn = Column::where('name', 'DEALING')->first();
//         if (!$dealingColumn) {
//             Log::error("'DEALING' column not found.");
//             return;
//         }

//         $sectorTransactions = Transaction::whereIn('contact_id', $contactIds)
//             ->whereMonth('created_at', $currentMonth)
//             ->whereYear('created_at', $currentYear)
//             ->where('column_id', $dealingColumn->id)
//             ->get();

//         $jumlahItem = $sectorTransactions->sum('qty');
//         $totalPenjualan = $sectorTransactions->sum('grand_total');
//         $totalTransaksi = $sectorTransactions->count();

//         // Hitung global rata-rata semua sektor
//         $allSectors = Sector::with('contacts')->get();

//         $perSectorJumlahItem = [];
//         $perSectorTotalPenjualan = [];
//         $perSectorTotalTransaksi = [];

//         foreach ($allSectors as $s) {
//             $ids = $s->contacts->pluck('id');
//             $q = Transaction::whereIn('contact_id', $ids)
//                 ->whereMonth('created_at', $currentMonth)
//                 ->whereYear('created_at', $currentYear)
//                 ->where('column_id', $dealingColumn->id)
//                 ->get();

//             $perSectorJumlahItem[] = $q->sum('qty');
//             $perSectorTotalPenjualan[] = $q->sum('grand_total');
//             $perSectorTotalTransaksi[] = $q->count();
//         }

//         $sectorCount = count($allSectors);

//         $avgQty = $sectorCount > 0 ? array_sum($perSectorJumlahItem) / $sectorCount : 0;
//         $avgSales = $sectorCount > 0 ? array_sum($perSectorTotalPenjualan) / $sectorCount : 0;
//         $avgTransactions = $sectorCount > 0 ? array_sum($perSectorTotalTransaksi) / $sectorCount : 0;

//         Log::info("--- Segmentasi Pasar Debug [{$currentMonth}/{$currentYear}] ---");
//         Log::info("Sector: {$sector->name}, ID: {$sector->id}");
//         Log::info("Jumlah Item: {$jumlahItem}, Total Penjualan: {$totalPenjualan}, Total Transaksi: {$totalTransaksi}");
//         Log::info("Global Avg Item: {$avgQty}, Avg Penjualan: {$avgSales}, Avg Transaksi: {$avgTransactions}");
//         Log::info("--------------------------------------------------------------");

//         $kriteria = [
//             'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//             // 'Total Penjualan' => $totalPenjualan >= $avgSales ? 'YES' : 'NO',
//             'Total Penjualan' => $avgSales > 0 && $totalPenjualan > $avgSales ? 'YES' : 'NO',
//             'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//         ];

//         $ji = $kriteria['Jumlah item'];
//         $tp = $kriteria['Total Penjualan'];
//         $jt = $kriteria['Jumlah Transaksi'];

//         if ($ji === 'YES' && $tp === 'YES') {
//             $status = 'Potensial Tinggi';
//         } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
//             $status = 'Potensial Rendah';
//         } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'NO') {
//             $status = 'Potensial Rendah';
//         } else {
//             $status = 'Potensial Rendah';
//         }

//         SegmentasiPasar::updateOrCreate(
//             [
//                 'sector_id' => $sector->id,
//                 'month' => $currentMonth,
//                 'year' => $currentYear,
//             ],
//             [
//                 'jumlah_item' => $jumlahItem,
//                 'total_penjualan' => $totalPenjualan,
//                 'total_transaksi' => $totalTransaksi,
//                 'kriteria_jumlah_item' => $ji,
//                 'kriteria_total_penjualan' => $tp,
//                 'kriteria_total_transaksi' => $jt,
//                 'status' => $status,
//             ]
//         );

//         Log::info("SegmentasiPasar updated for sector '{$sector->name}' ({$currentMonth}/{$currentYear}). Status: {$status}");
//     }
// }

// namespace App\Observers;

// use App\Models\Transaction;
// use App\Models\Contact;
// use App\Models\Sector;
// use App\Models\Column;
// use App\Models\SegmentasiPasar;
// use Illuminate\Support\Facades\Log;

// class SegmentasiPasarTransactionObserver
// {
//     public function created(Transaction $transaction)
//     {
//         Log::info("Transaction created: {$transaction->id}");
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function updated(Transaction $transaction)
//     {
//         if (
//             $transaction->isDirty('qty') ||
//             $transaction->isDirty('grand_total') ||
//             $transaction->isDirty('contact_id') ||
//             $transaction->isDirty('column_id') ||
//             $transaction->isDirty('created_at')
//         ) {
//             // Jika contact berubah, update sektor lama
//             if ($transaction->isDirty('contact_id')) {
//                 $oldContactId = $transaction->getOriginal('contact_id');
//                 if ($oldContactId) {
//                     $oldContact = Contact::find($oldContactId);
//                     if ($oldContact && $oldContact->sector) {
//                         $this->updateSegmentasiPasarForSector(
//                             $oldContact->sector,
//                             now()->month,
//                             now()->year
//                         );
//                     }
//                 }
//             }

//             // Pastikan data sudah tersimpan sebelum lanjut
//             $transaction->refresh();
//             $this->updateSegmentasiPasarForTransaction($transaction);
//         }
//     }

//     public function deleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function restored(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     public function forceDeleted(Transaction $transaction)
//     {
//         $this->updateSegmentasiPasarForTransaction($transaction);
//     }

//     protected function updateSegmentasiPasarForTransaction(Transaction $transaction)
//     {
//         if ($transaction->contact && $transaction->contact->sector) {
//             $sector = $transaction->contact->sector;

//             // ✅ Gunakan bulan sekarang karena DEALING terjadi sekarang
//             $this->updateSegmentasiPasarForSector($sector, now()->month, now()->year);
//         } else {
//             Log::warning("Transaction {$transaction->id} has no contact or sector.");
//         }
//     }

//     protected function updateSegmentasiPasarForSector(Sector $sector, $month = null, $year = null)
//     {
//         $currentMonth = $month ?? now()->month;
//         $currentYear = $year ?? now()->year;

//         $contactIds = $sector->contacts->pluck('id');

//         $dealingColumn = Column::where('name', 'DEALING')->first();
//         if (!$dealingColumn) {
//             Log::error("'DEALING' column not found.");
//             return;
//         }

//         // ✅ Ganti created_at → updated_at
//         $sectorTransactions = Transaction::whereIn('contact_id', $contactIds)
//             ->whereMonth('updated_at', $currentMonth)
//             ->whereYear('updated_at', $currentYear)
//             ->where('column_id', $dealingColumn->id)
//             ->get();

//         $jumlahItem = $sectorTransactions->sum('qty');
//         $totalPenjualan = $sectorTransactions->sum('grand_total');
//         $totalTransaksi = $sectorTransactions->count();

//         // Hitung global rata-rata semua sektor
//         $allSectors = Sector::with('contacts')->get();

//         $perSectorJumlahItem = [];
//         $perSectorTotalPenjualan = [];
//         $perSectorTotalTransaksi = [];

//         foreach ($allSectors as $s) {
//             $ids = $s->contacts->pluck('id');
//             $q = Transaction::whereIn('contact_id', $ids)
//                 ->whereMonth('updated_at', $currentMonth)
//                 ->whereYear('updated_at', $currentYear)
//                 ->where('column_id', $dealingColumn->id)
//                 ->get();

//             $perSectorJumlahItem[] = $q->sum('qty');
//             $perSectorTotalPenjualan[] = $q->sum('grand_total');
//             $perSectorTotalTransaksi[] = $q->count();
//         }

//         $sectorCount = count($allSectors);

//         $avgQty = $sectorCount > 0 ? array_sum($perSectorJumlahItem) / $sectorCount : 0;
//         $avgSales = $sectorCount > 0 ? array_sum($perSectorTotalPenjualan) / $sectorCount : 0;
//         $avgTransactions = $sectorCount > 0 ? array_sum($perSectorTotalTransaksi) / $sectorCount : 0;

//         Log::info("--- Segmentasi Pasar Debug [{$currentMonth}/{$currentYear}] ---");
//         Log::info("Sector: {$sector->name}, ID: {$sector->id}");
//         Log::info("Jumlah Item: {$jumlahItem}, Total Penjualan: {$totalPenjualan}, Total Transaksi: {$totalTransaksi}");
//         Log::info("Global Avg Item: {$avgQty}, Avg Penjualan: {$avgSales}, Avg Transaksi: {$avgTransactions}");
//         Log::info("--------------------------------------------------------------");

//         $kriteria = [
//             'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
//             'Total Penjualan' => $avgSales > 0 && $totalPenjualan > $avgSales ? 'YES' : 'NO',
//             'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
//         ];

//         $ji = $kriteria['Jumlah item'];
//         $tp = $kriteria['Total Penjualan'];
//         $jt = $kriteria['Jumlah Transaksi'];

//         if ($ji === 'YES' && $tp === 'YES') {
//             $status = 'Potensial Tinggi';
//         } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
//             $status = 'Potensial Sedang';
//         } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
//             $status = 'Potensial Rendah';
//         } else {
//             $status = 'Potensial Rendah';
//         }

//         SegmentasiPasar::updateOrCreate(
//             [
//                 'sector_id' => $sector->id,
//                 'month' => $currentMonth,
//                 'year' => $currentYear,
//             ],
//             [
//                 'jumlah_item' => $jumlahItem,
//                 'total_penjualan' => $totalPenjualan,
//                 'total_transaksi' => $totalTransaksi,
//                 'kriteria_jumlah_item' => $ji,
//                 'kriteria_total_penjualan' => $tp,
//                 'kriteria_total_transaksi' => $jt,
//                 'status' => $status,
//             ]
//         );

//         Log::info("SegmentasiPasar updated for sector '{$sector->name}' ({$currentMonth}/{$currentYear}). Status: {$status}");
//     }
// }



namespace App\Observers;

use App\Models\Transaction;
use App\Models\Contact;
use App\Models\Sector;
use App\Models\Column;
use App\Models\SegmentasiPasar;
use Illuminate\Support\Facades\Log;

class SegmentasiPasarTransactionObserver
{
    public function created(Transaction $transaction)
    {
        Log::info("Transaction created: {$transaction->id}");
        $this->updateSegmentasiPasarForTransaction($transaction);
    }

    public function updated(Transaction $transaction)
    {
        $shouldUpdate = false;

        // Cek perubahan langsung
        if (
            $transaction->isDirty('qty') ||
            $transaction->isDirty('grand_total') ||
            $transaction->isDirty('contact_id') ||
            $transaction->isDirty('column_id') ||
            $transaction->isDirty('created_at') ||
            $transaction->isDirty('product_id')
        ) {
            $shouldUpdate = true;
        }

        // Cek perubahan sektor dari contact
        $originalContactId = $transaction->getOriginal('contact_id');
        $currentContactId = $transaction->contact_id;

        $originalSectorId = null;
        $currentSectorId = null;

        if ($originalContactId) {
            $originalContact = Contact::with('sector')->find($originalContactId);
            $originalSectorId = optional($originalContact->sector)->id;
        }

        if ($currentContactId) {
            $currentContact = Contact::with('sector')->find($currentContactId);
            $currentSectorId = optional($currentContact->sector)->id;
        }

        if ($originalSectorId !== $currentSectorId) {
            $shouldUpdate = true;

            // Update sektor lama
            if ($originalSectorId) {
                $oldSector = Sector::find($originalSectorId);
                if ($oldSector) {
                    $this->updateSegmentasiPasarForSector($oldSector, now()->month, now()->year);
                }
            }
        }

        if ($shouldUpdate) {
            $transaction->refresh(); // Pastikan relasi up to date
            $this->updateSegmentasiPasarForTransaction($transaction);
        }
    }

    public function deleted(Transaction $transaction)
    {
        $this->updateSegmentasiPasarForTransaction($transaction);
    }

    public function restored(Transaction $transaction)
    {
        $this->updateSegmentasiPasarForTransaction($transaction);
    }

    public function forceDeleted(Transaction $transaction)
    {
        $this->updateSegmentasiPasarForTransaction($transaction);
    }

    public function updateSegmentasiPasarForTransaction(Transaction $transaction)
    {
        if ($transaction->contact && $transaction->contact->sector) {
            $sector = $transaction->contact->sector;
            $this->updateSegmentasiPasarForSector($sector, now()->month, now()->year);
        } else {
            Log::warning("Transaction {$transaction->id} has no contact or sector.");
        }
    }

    // public function updateSegmentasiPasarForSector(Sector $sector, $month = null, $year = null)
    // {
    //     $currentMonth = $month ?? now()->month;
    //     $currentYear = $year ?? now()->year;

    //     $contactIds = $sector->contacts->pluck('id');

    //     $dealingColumn = Column::where('name', 'DEALING')->first();
    //     if (!$dealingColumn) {
    //         Log::error("'DEALING' column not found.");
    //         return;
    //     }

    //     $sectorTransactions = Transaction::whereIn('contact_id', $contactIds)
    //         ->whereMonth('updated_at', $currentMonth)
    //         ->whereYear('updated_at', $currentYear)
    //         ->where('column_id', $dealingColumn->id)
    //         ->get();

    //     $jumlahItem = $sectorTransactions->sum('qty');
    //     $totalPenjualan = $sectorTransactions->sum('grand_total');
    //     $totalTransaksi = $sectorTransactions->count();

    //     // Ambil rata-rata global tanpa menyertakan sektor ini
    //     $avgQty = SegmentasiPasar::where('month', $currentMonth)
    //         ->where('year', $currentYear)
    //         ->where('sector_id', '!=', $sector->id)
    //         ->avg('jumlah_item') ?? 0;

    //     $avgSales = SegmentasiPasar::where('month', $currentMonth)
    //         ->where('year', $currentYear)
    //         ->where('sector_id', '!=', $sector->id)
    //         ->avg('total_penjualan') ?? 0;

    //     $avgTransactions = SegmentasiPasar::where('month', $currentMonth)
    //         ->where('year', $currentYear)
    //         ->where('sector_id', '!=', $sector->id)
    //         ->avg('total_transaksi') ?? 0;

    //     Log::info("--- Segmentasi Pasar Debug [{$currentMonth}/{$currentYear}] ---");
    //     Log::info("Sector: {$sector->name}, ID: {$sector->id}");
    //     Log::info("Jumlah Item: {$jumlahItem}, Total Penjualan: {$totalPenjualan}, Total Transaksi: {$totalTransaksi}");
    //     Log::info("Global Avg Item: {$avgQty}, Avg Penjualan: {$avgSales}, Avg Transaksi: {$avgTransactions}");
    //     Log::info("--------------------------------------------------------------");

    //     $kriteria = [
    //         'Jumlah item' => $jumlahItem > $avgQty ? 'YES' : 'NO',
    //         'Total Penjualan' => $avgSales > 0 && $totalPenjualan > $avgSales ? 'YES' : 'NO',
    //         'Jumlah Transaksi' => $totalTransaksi > $avgTransactions ? 'YES' : 'NO',
    //     ];

    //     $ji = $kriteria['Jumlah item'];
    //     $tp = $kriteria['Total Penjualan'];
    //     $jt = $kriteria['Jumlah Transaksi'];

    //     if ($ji === 'YES' && $tp === 'YES') {
    //         $status = 'Potensial Tinggi';
    //     } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
    //         $status = 'Potensial Sedang';
    //     } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
    //         $status = 'Potensial Sedang';
    //     } elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
    //         $status = 'Potensial Sedang';
    //     } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
    //         $status = 'Potensial Rendah';
    //     } else {
    //         $status = 'Potensial Rendah';
    //     }

    //     SegmentasiPasar::updateOrCreate(
    //         [
    //             'sector_id' => $sector->id,
    //             'month' => $currentMonth,
    //             'year' => $currentYear,
    //         ],
    //         [
    //             'jumlah_item' => $jumlahItem,
    //             'total_penjualan' => $totalPenjualan,
    //             'total_transaksi' => $totalTransaksi,
    //             'kriteria_jumlah_item' => $ji,
    //             'kriteria_total_penjualan' => $tp,
    //             'kriteria_total_transaksi' => $jt,
    //             'status' => $status,
    //         ]
    //     );

    //     Log::info("SegmentasiPasar updated for sector '{$sector->name}' ({$currentMonth}/{$currentYear}). Status: {$status}");
    // }

        public function updateSegmentasiPasarForSector(Sector $sector, int $month, int $year): void

{
    // Default ke bulan dan tahun saat ini
    $currentMonth = $month ?? now()->month;
    $currentYear = $year ?? now()->year;

    // Ambil semua sektor dan relasi kontak
    $allSectors = Sector::with('contacts')->get();

    // Ambil kolom DEALING
    $dealingColumn = Column::where('name', 'DEALING')->first();
    if (!$dealingColumn) {
        Log::error("'DEALING' column not found.");
        return;
    }

    $dataSummary = [];

    // Step 1: Kumpulkan data per sektor
    foreach ($allSectors as $sector) {
        $contactIds = $sector->contacts->pluck('id');

        $transactions = Transaction::whereIn('contact_id', $contactIds)
            ->whereMonth('updated_at', $currentMonth)
            ->whereYear('updated_at', $currentYear)
            ->where('column_id', $dealingColumn->id)
            ->get();

        $jumlahItem = $transactions->sum('qty');
        $totalPenjualan = $transactions->sum('grand_total');
        $totalTransaksi = $transactions->count();

        $dataSummary[] = [
            'sector' => $sector,
            'jumlah_item' => $jumlahItem,
            'total_penjualan' => $totalPenjualan,
            'total_transaksi' => $totalTransaksi,
        ];
    }

    // Step 2: Hitung rata-rata global
    $avgQty = collect($dataSummary)->avg('jumlah_item') ?? 0;
    $avgSales = collect($dataSummary)->avg('total_penjualan') ?? 0;
    $avgTransactions = collect($dataSummary)->avg('total_transaksi') ?? 0;

    Log::info("=== Global Rata-rata Segmentasi Pasar [{$currentMonth}/{$currentYear}] ===");
    Log::info("Jumlah Item: " . number_format($avgQty, 4));
    Log::info("Total Penjualan: Rp" . number_format($avgSales, 4));
    Log::info("Total Transaksi: " . number_format($avgTransactions, 4));
    Log::info("============================================================");

    // Step 3: Update Segmentasi per sektor
    foreach ($dataSummary as $data) {
        $sector = $data['sector'];
        $jumlahItem = $data['jumlah_item'];
        $totalPenjualan = $data['total_penjualan'];
        $totalTransaksi = $data['total_transaksi'];

        $ji = $jumlahItem > $avgQty ? 'YES' : 'NO';
        $tp = $avgSales > 0 && $totalPenjualan > $avgSales ? 'YES' : 'NO';
        $jt = $totalTransaksi > $avgTransactions ? 'YES' : 'NO';

        // Tentukan status
        // if ($ji === 'YES' && $tp === 'YES') {
        //     $status = 'Potensial Tinggi';
        // } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
        //     $status = 'Potensial Sedang';
        // } elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
        //     $status = 'Potensial Sedang';
        // } elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
        //     $status = 'Potensial Sedang';
        // } elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
        //     $status = 'Potensial Rendah';
        // } else {
        //     $status = 'Potensial Rendah';
        // }

        if ($ji === 'YES' && $tp === 'YES' && $jt === 'YES') {
    $status = 'Potensial Tinggi';
} elseif ($ji === 'YES' && $tp === 'YES' && $jt === 'NO') {
    $status = 'Potensial Tinggi';
} elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'YES') {
    $status = 'Potensial Sedang';
} elseif ($ji === 'YES' && $tp === 'NO' && $jt === 'NO') {
    $status = 'Potensial Sedang';
} elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'YES') {
    $status = 'Potensial Sedang';
} elseif ($ji === 'NO' && $tp === 'YES' && $jt === 'NO') {
    $status = 'Potensial Sedang';
} elseif ($ji === 'NO' && $tp === 'NO' && $jt === 'YES') {
    $status = 'Potensial Rendah';
} else {
    $status = 'Potensial Rendah';
}


        SegmentasiPasar::updateOrCreate(
            [
                'sector_id' => $sector->id,
                'month' => $currentMonth,
                'year' => $currentYear,
            ],
            [
                'jumlah_item' => $jumlahItem,
                'total_penjualan' => $totalPenjualan,
                'total_transaksi' => $totalTransaksi,
                'kriteria_jumlah_item' => $ji,
                'kriteria_total_penjualan' => $tp,
                'kriteria_total_transaksi' => $jt,
                'status' => $status,
            ]
        );

        Log::info("--- Segmentasi Pasar Debug [{$currentMonth}/{$currentYear}] ---");
        Log::info("Sector: {$sector->name}, ID: {$sector->id}");
        Log::info("Jumlah Item: {$jumlahItem}, Total Penjualan: {$totalPenjualan}, Total Transaksi: {$totalTransaksi}");
        Log::info("Global Avg Item: " . number_format($avgQty, 4) . ", Avg Penjualan: " . number_format($avgSales, 4) . ", Avg Transaksi: " . number_format($avgTransactions, 4));
        Log::info("--------------------------------------------------------------");
        Log::info("SegmentasiPasar updated for sector '{$sector->name}' ({$currentMonth}/{$currentYear}). Status: {$status}");
    }
}
}

