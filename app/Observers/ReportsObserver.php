<?php

namespace App\Observers;

use App\Models\Reports;
use App\Models\Transaction;
use App\Models\Report;


class ReportsObserver
{

    /**
     * Handle the Reports "created" event.
     */
    // public function created(Reports $reports): void
    // {
    //     //
    // }

    /**
     * Handle the Reports "updated" event.
     */
    // public function updated(Reports $reports): void
    // {
    //     //
    // }

    /**
     * Handle the Reports "deleted" event.
     */
//     public function deleted(Reports $reports): void
//     {
//         //
//     }

//     /**
//      * Handle the Reports "restored" event.
//      */
//     public function restored(Reports $reports): void
//     {
//         //
//     }

//     /**
//      * Handle the Reports "force deleted" event.
//      */
//     public function forceDeleted(Reports $reports): void
//     {
//         //
//     }

//     // public function created(Transaction $transaction)
//     // {
//     //     // Create a new report associated with the just-created transaction
//     //     Reports::create([
//     //         'transaction_id' => $transaction->id,
//     //         // You can copy other relevant data from the transaction if needed,
//     //         // just ensure these columns exist in your 'reports' table migration.
//     //         // For example:
//     //         // 'column_id' => $transaction->column_id,
//     //         // 'product_id' => $transaction->product_id,
//     //         // 'grand_total' => $transaction->grand_total,
//     //     ]);
//     // }

//      public function created(Transaction $transaction): void
//     {
//         // Ensure the transaction's relationships are loaded if not already
//         // This is crucial if 'contact' is not always eager-loaded before the observer fires.
//         $transaction->loadMissing(['contact', 'product', 'column']);

//         Reports::create([
//             'transaction_id' => $transaction->id,
//             'contact_name'   => $transaction->contact->name ?? null,       // Get contact name from related model
//             'company_name'   => $transaction->contact->company_name ?? null, // Get company name from related model
//             'product_name'   => $transaction->product->name ?? null,       // Get contact name from related model
//             'qty'            => $transaction->qty,                       // Copy quantity from transaction
//             'total'          => $transaction->grand_total ?? null ,            // Copy grand_total from transaction
//             'status'         => $transaction->column->name ?? null,     // Copy status from transaction, or set a default
//         ]);
//     }
//     public function updated($model): void // Removed type hint, or use a more generic type
//     {
//         if ($model instanceof Reports) {
//             // Logic for when a Reports model is updated
//             // Example: $model->someReportsSpecificField = 'new value';
//             // $model->save();
//         } elseif ($model instanceof Transaction) {
//             // Logic for when a Transaction model is updated
//             // For example, update the corresponding Report
//             $model->loadMissing(['contact', 'product', 'column']);
//             $report = Reports::where('transaction_id', $model->id)->first();
//             if ($report) {
//                 $report->update([
//                     'contact_name'   => $model->contact->name ?? null,
//                     'company_name'   => $model->contact->company_name ?? null,
//                     'product_name'   => $model->product->name ?? null,
//                     'qty'            => $model->qty,
//                     'total'          => $model->grand_total ?? null,
//                     'status'         => $model->column->name ?? null,
//                 ]);
//             }
//         }
//     }

}
