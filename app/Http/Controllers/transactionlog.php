<?php

namespace App\Http\Controllers;
use App\Models\Transaction;
use App\Models\Column;
use Illuminate\Support\Facades\DB;

use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Http\Request;

class transactionlog extends Controller
{
//     public function show($id)
// {
//     $lead = Transaction::with(['logs.user'])->findOrFail($id);

//     return Inertia::render('components/Leads/KanbanCard', [
//         'lead' => $lead,
//         'logs' => $lead->logs->map(function ($log) {
//             return [
//                 'id' => $log->id,
//                 'action' => $log->action, // e.g., created, updated, deleted
//                 'user' => $log->user?->name ?? 'System',
//                 'created_at' => $log->created_at->toDateTimeString(),
//                 'changes' => $log->changes,
//             ];
//         }),
//     ]);
// }


//     public function show($id)
//     {
//         $lead = Transaction::with(['logs.user'])->findOrFail($id);

//         return Inertia::render('components/Leads/KanbanCard', [
//             'lead' => $lead,
//             'logs' => $lead->logs->map(function ($log) {
//                 return [
//                     'id' => $log->id,
//                     'action' => $log->action,
//                     'user' => $log->user?->name ?? 'System',
//                     'created_at' => $log->created_at->toDateTimeString(),
//                     'changes' => $log->changes,
//                 ];
//             }),
//         ]);
// }

public function index()
{
    $columns = Column::with(['transactions' => function ($query) {
        $query->with(['product', 'contact']);
    }])->get();

    foreach ($columns as $column) {
        foreach ($column->transactions as $transaction) {
            $log = DB::table('transaction_logs')
                ->join('users', 'transaction_logs.user_id', '=', 'users.id')
                ->select(
                    'transaction_logs.transaction_id',
                    'transaction_logs.action',
                    DB::raw("UPPER(LEFT(users.name, 2)) as user_initials"),
                    'transaction_logs.created_at'
                )
                ->where('transaction_logs.transaction_id', $transaction->id)
                ->orderByDesc('transaction_logs.created_at')
                ->first();

            $transaction->logs = $log ? [$log] : [];
        }
    }

    return response()->json($transaction);
}


}
