<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\Reports;
class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        // Pastikan relasi 'contact' dimuat jika belum, untuk mengakses nama kontak.
        // Ini penting jika 'contact' tidak selalu di-eager-load sebelum observer ini dijalankan.
        $transaction->loadMissing(['contact', 'product', 'column']);

        // Buat entri baru di tabel 'reports'
        Reports::create([
            'transaction_id' => $transaction->id,
            'trx'            => $transaction->trx,
            'contact_name'   => $transaction->contact->name ?? null, // Ambil nama kontak dari relasi
            'company_name'   => $transaction->contact->company_name ?? null, // Ambil nama perusahaan dari relasi
            'product_name'   => $transaction->product->name ?? null, // Ambil nama kontak dari relasi
            'qty'            => $transaction->qty,            // Salin kuantitas dari transaksi
            'total'          => $transaction->grand_total,    // Salin grand_total dari transaksi
            'status'         => $transaction->column->name ?? null, // Salin status, atau default 'completed'
        ]);
    }

    /**
     * Handle the Transaction "updated" event.
     * Jika Anda perlu memperbarui laporan yang terkait saat transaksi diubah, tambahkan logika di sini.
     */
    public function updated(Transaction $transaction): void
    {
        // Cari laporan yang terkait dengan transaksi ini
        $report = Reports::where('transaction_id', $transaction->id)->first();

        if ($report) {
            // Muat ulang relasi 'contact' jika diperlukan untuk data terbaru
        $transaction->loadMissing(['contact', 'product', 'column']);

            // Perbarui kolom di laporan sesuai perubahan transaksi
            $report->update([
                'trx'            => $transaction->trx,
                'contact_name'   => $transaction->contact->name ?? null,
                'company_name'   => $transaction->contact->company_name ?? null,
                'product_name'   => $transaction->product->name ?? null,
                'qty'            => $transaction->qty,
                'total'          => $transaction->grand_total,
                'status'         => $transaction->column->name,
                // Tambahkan kolom lain yang perlu di-sync dari Transaction ke Reports
            ]);
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     * Contoh: Jika transaksi dihapus, Anda mungkin juga ingin menghapus laporan yang terkait.
     */
    // public function deleted(Transaction $transaction): void
    // {
    //     // Reports::where('transaction_id', $transaction->id)->delete(); // Soft delete laporan
    //     Reports::where('transaction_id', $transaction->id)->forceDelete(); // Hapus permanen laporan
    // }

    // /**
    //  * Handle the Transaction "restored" event.
    //  */
    // public function restored(Transaction $transaction): void
    // {
    //     //
    // }

    /**
     * Handle the Transaction "force deleted" event.
     */
    // public function forceDeleted(Transaction $transaction): void
    // {
    //     Reports::where('transaction_id', $transaction->id)->delete();
    //     $transaction->delete(); // This will soft delete if using SoftDeletes, or hard delete otherwise

    // }

    public function deleted(Transaction $transaction): void
    {
        // If you are using soft deletes for Transactions and want Reports to also be soft deleted:
        // Reports::where('transaction_id', $transaction->id)->delete();

        // If 'deleted' means a permanent delete for Reports (even if Transaction is soft-deleted):
        Reports::where('transaction_id', $transaction->id)->forceDelete();
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        // If Reports were soft-deleted with the Transaction, you might restore them here:
        // Reports::where('transaction_id', $transaction->id)->restore();
    }

    /**
     * Handle the Transaction "force deleted" event.
     * This event fires when a transaction is permanently removed from the database.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        // When a Transaction is force deleted, permanently delete its associated Report.
        // The Transaction model itself is already deleted by this point.
        Reports::where('transaction_id', $transaction->id)->delete(); // Use delete() here as it might be soft-deleted or force-deleted depending on Reports model setup.
        // REMOVED: $transaction->delete(); // This line is redundant and can cause issues.
    }
}
//     public function created(Transaction $transaction): void
//     {
//         //
//     }

//     /**
//      * Handle the Transaction "updated" event.
//      */
//     public function updated(Transaction $transaction): void
//     {
//         //
//     }

//     /**
//      * Handle the Transaction "deleted" event.
//      */
//     public function deleted(Transaction $transaction): void
//     {
//         //
//     }

//     /**
//      * Handle the Transaction "restored" event.
//      */
//     public function restored(Transaction $transaction): void
//     {
//         //
//     }

//     /**
//      * Handle the Transaction "force deleted" event.
//      */
//     public function forceDeleted(Transaction $transaction): void
//     {
//         //
//     }
// }
