<?php

namespace App\Http\Controllers;
use App\Models\Contact;
use App\Models\Sector;
use App\Models\Transaction;
use App\Models\Column;
use App\Models\Product;
use App\Models\Reports;
use App\Models\SegmentasiPasar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function contact(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       // Get the total count of contacts
    $contactCount = Contact::count();

    // You can also get other data if needed, for example, the sum of a 'value' column
    // $contactValueSum = Contact::sum('value_column_name'); // Replace 'value_column_name'

    return response()->json([
        'totalContacts' => $contactCount,
        // You can add other data here as well, e.g.:
        // 'totalContactValue' => $contactValueSum,
    ]);
}
    public function sector(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       // Get the total count of contacts
    $sectorCount = Sector::count();

    // You can also get other data if needed, for example, the sum of a 'value' column
    // $contactValueSum = Contact::sum('value_column_name'); // Replace 'value_column_name'

    return response()->json([
        'totalSectors' => $sectorCount,
        // You can add other data here as well, e.g.:
        // 'totalContactValue' => $contactValueSum,
    ]);
}
    public function leads(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       // Get the total count of contacts
    $leadsCount = Transaction::count();

    // You can also get other data if needed, for example, the sum of a 'value' column
    // $contactValueSum = Contact::sum('value_column_name'); // Replace 'value_column_name'

    return response()->json([
        'totalLeads' => $leadsCount,
        // You can add other data here as well, e.g.:
        // 'totalContactValue' => $contactValueSum,
    ]);
}
    public function product(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       // Get the total count of contacts
    $productCount = Product::count();

    // You can also get other data if needed, for example, the sum of a 'value' column
    // $contactValueSum = Contact::sum('value_column_name'); // Replace 'value_column_name'

    return response()->json([
        'totalProduct' => $productCount,
        // You can add other data here as well, e.g.:
        // 'totalContactValue' => $contactValueSum,
    ]);
}

public function getCrmStatus(): JsonResponse
{
    try {
        $columns = Column::withCount('transactions')->get();
        $totalTransactions = $columns->sum('transactions_count');

        $colors = ["#f68b1e", "#2fbf8f", "#6fc6db", "#ef4f5f", "#a020f0", "#ffc0cb"];

        $segments = $columns->values()->map(function ($column, $index) use ($totalTransactions, $colors) {
            $transactionCount = is_numeric($column->transactions_count) ? (int) $column->transactions_count : 0;
            $total = is_numeric($totalTransactions) && $totalTransactions > 0 ? $totalTransactions : 1;

            $percent = round(($transactionCount / $total) * 100);
            $colorIndex = $index % count($colors); // ✅ FIXED HERE

            return [
                'label' => $column->name,
                'percent' => $percent,
                'color' => $colors[$colorIndex],
                'transaction_count' => $transactionCount,
            ];
        });

        return response()->json([
            'message' => 'CRM status fetched successfully',
            'data' => $segments,
            'total_transactions' => $totalTransactions,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }
}
public function totalpenjualan()
    {
        // Hitung total dari semua nilai 'total' pada tabel reports
        $now = Carbon::now();

        $grandTotal = Reports::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('total');

        return response()->json([
            'grand_total_this_month' => $grandTotal
        ]);
    }

    /**
     * Menampilkan data segmentasi pasar berdasarkan mode (normal/arsip).
     *
     * @param Request $request
     * @return JsonResponse
     */

    public function segmentasi(Request $request): JsonResponse
{
    $now = now();
        $mode = $request->query('show') === 'arsip' ? 'arsip' : 'normal';

        $query = DB::table('segmentasi_pasar')
            ->join('sectors', 'segmentasi_pasar.sector_id', '=', 'sectors.id')
            ->select(
                'segmentasi_pasar.id',
                'segmentasi_pasar.sector_id',
                'sectors.name as sector_name',
                'segmentasi_pasar.jumlah_item',
                'segmentasi_pasar.total_penjualan',
                'segmentasi_pasar.total_transaksi',
                'segmentasi_pasar.kriteria_jumlah_item',
                'segmentasi_pasar.kriteria_total_penjualan',
                'segmentasi_pasar.kriteria_total_transaksi',
                'segmentasi_pasar.status',
                'segmentasi_pasar.month',
                'segmentasi_pasar.year',
                'segmentasi_pasar.created_at',
                'segmentasi_pasar.updated_at'
            );

        if ($mode === 'arsip') {
            $query->where(function ($q) use ($now) {
                $q->where('segmentasi_pasar.month', '!=', $now->month)
                  ->orWhere('segmentasi_pasar.year', '!=', $now->year);
            });
        } else {
            $query->where('segmentasi_pasar.month', $now->month)
                  ->where('segmentasi_pasar.year', $now->year);
        }

        $segmentasiPasar = $query->orderByDesc('segmentasi_pasar.year')
                                 ->orderByDesc('segmentasi_pasar.month')
                                 ->get();

        return response()->json([
            'mode' => $mode,
            'month' => $now->month,
            'year' => $now->year,
            'data' => $segmentasiPasar
        ]);

}
}
