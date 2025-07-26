<?php

namespace App\Http\Controllers;
use App\Models\Reports;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\ReportResource; // Import the ReportResource
use Barryvdh\DomPDF\Facade\Pdf; // For PDF generation
use Maatwebsite\Excel\Facades\Excel; // For Excel generation
use App\Exports\ReportsExport; // We'll create this class next

class ReportController extends Controller
{

    // public function index(): JsonResponse
    // {
    //     $reports = DB::table('reports')
    //         ->join('transactions', 'reports.transaction_id', '=', 'transactions.id')
    //         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id') // Use leftJoin to handle column_id that might be null
    //         ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id') // Use leftJoin to handle column_id that might be null
    //         ->select(
    //             'reports.*', // Select all columns from reports table
    //             'transactions.trx', // Include transaction trx code
    //             // 'transactions.qty', // These are now copied to reports table, so 'reports.qty' is preferred
    //             // 'transactions.grand_total', // These are now copied to reports table, so 'reports.grand_total' is preferred
    //             'columns.name as column_name', // Alias column name to avoid conflict
    //             'contacts.name as contact_name' // Alias column name to avoid conflict
    //         )
    //         ->latest('reports.created_at') // Order by reports.created_at for clarity
    //         ->get();

    //     return response()->json($reports);
    // }
    // }
    //     public function index()
    // {
    //     // Eager load the 'transaction' relationship and its nested relationships
    //     $reports = Reports::with([
    //         'transaction',
    //         'transaction.contact',
    //         'transaction.product',
    //         'transaction.column'
    //     ])->latest()->get();

    //     return ReportResource::collection($reports);
    // }

    public function index(Request $request)
{
    $now = now();
    $mode = $request->query('show') === 'arsip' ? 'arsip' : 'normal';

    $query = Reports::with([
        'transaction',
        'transaction.contact',
        'transaction.product',
        'transaction.column'
    ]);

    if ($mode === 'arsip') {
        // Semua data yang BUKAN dari bulan & tahun ini
        $query->where(function ($q) use ($now) {
            $q->whereMonth('updated_at', '!=', $now->month)
              ->orWhereYear('updated_at', '!=', $now->year);
        });
    } else {
        // Hanya data bulan & tahun ini
        $query->whereMonth('updated_at', $now->month)
              ->whereYear('updated_at', $now->year);
    }

    $reports = $query->latest()->get();

    return response()->json([
        'mode' => $mode,
        'month' => $now->month,
        'year' => $now->year,
        'data' => ReportResource::collection($reports),
    ]);
}



    public function storeTransaction(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'trx' => 'required|string|max:255|unique:reports,trx',
                'current_price' => 'required|numeric|min:0',
                'qty' => 'required|integer',
                'contact_id' => 'nullable|uuid|exists:contacts,id', // Validate if contact_id is provided and exists
                'status' => 'nullable|string|max:50', // Validate status if provided
            ]);

            // Generate TRX code here if not provided in request.
            // The booted method in Transaction model already handles this.
            $transactionData = [
                'trx' => $request->input('trx',),
                'current_price' => $request->input('current_price', '-'),
                'qty' => $request->input('qty', '-'),
                'grand_total' => $request->input('current_price') * $request->input('qty'),
                'contact_id' => $request->input('contact_id'),
                'status' => $request->input('status', 'pending'), // Default status if not provided
                // 'column_id' and 'product_id' would also be added here if needed from the request
            ];

            $transaction = Transaction::create($transactionData);

            // The TransactionObserver will automatically create a Report here.
            // Access the newly created report directly via the relationship
            $report = $transaction->report;

            return response()->json([
                'message' => 'Transaction created successfully, and report generated.',
                'transaction' => $transaction,
                'report' => $report // The report automatically created and fully populated
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create transaction.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function index(): JsonResponse
    // {
    //     // Mengambil semua laporan, dengan eager loading relasi 'transaction'
    //     // 'latest()' akan mengurutkan dari yang terbaru
    //     $reports = Reports::with('transaction')->latest()->get();
    //     return response()->json($reports);
    // }

    // public function index(): JsonResponse
    // {
    //     $reports = DB::table('reports')
    //         ->join('transactions', 'reports.transaction_id', '=', 'transactions.id')
    //         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id') // Gunakan leftJoin untuk menangani column_id yang mungkin null
    //         ->select(
    //             'reports.*',
    //             'transactions.trx',
    //             'transactions.qty',
    //             'transactions.grand_total',
    //             'columns.name as column_name' // Ganti nama kolom 'name' untuk menghindari konflik
    //         )
    //         ->latest('reports.created_at') // Urutkan berdasarkan reports.created_at untuk kejelasan
    //         ->get();

    //     return response()->json($reports);
    // }
    //  public function storeTransaction(Request $request): JsonResponse
    // {
    //     $request->validate([
    //         'trx' => 'required|string|unique:transactions,trx',
    //         'current_price' => 'required|numeric',
    //         'qty' => 'required|integer',
    //         // Add other validation rules as per your transaction columns
    //     ]);

    //     try {
    //         $transaction = Transaction::create([
    //             'trx' => $request->input('trx'),
    //             'current_price' => $request->input('current_price'),
    //             'qty' => $request->input('qty'),
    //             'grand_total' => $request->input('current_price') * $request->input('qty'),
    //             // ... fill other columns as needed
    //         ]);

    //         // The TransactionObserver will automatically create a Report here.
    //         // You can optionally load the newly created report for the response.
    //         $report = $transaction->reports()->latest()->first(); // Assuming one report per transaction for simplicity

    //         return response()->json([
    //             'message' => 'Transaction created successfully, and report generated.',
    //             'transaction' => $transaction,
    //             'report' => $report // The report automatically created
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to create transaction.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // You can add methods for specific report retrieval, update, delete if needed

    /**
     * Display the specified report.
     * Menampilkan detail satu laporan berdasarkan ID (untuk tampilan web).
     */
    // public function show(Reports $report): View
    // {
    //     // Otomatis mencari laporan berdasarkan ID dan eager load transaksinya
    //     $report->load('transaction');
    //     return view('reports.show', compact('report'));
    // }

    /**
     * Get reports data as JSON (API endpoint).
     * Mengambil daftar laporan dalam format JSON (untuk API).
     */
    public function getReportsApi(): JsonResponse
    {
        // Mengambil semua laporan beserta data transaksinya untuk API
        // Anda bisa menambahkan paginasi: Report::with('transaction')->paginate(10);
        $reports = Reports::with('transaction')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $reports,
            'message' => 'Reports fetched successfully.'
        ]);
    }

    /**
     * Get a specific report data as JSON (API endpoint).
     * Mengambil detail satu laporan dalam format JSON (untuk API).
     */
    public function getReportDetailApi(Reports $report): JsonResponse
    {
        // Mengambil detail laporan beserta data transaksinya untuk API
        $report->load('transaction');

        return response()->json([
            'success' => true,
            'data' => $report,
            'message' => 'Report details fetched successfully.'
        ]);
    }

    // public function exportPdf(Request $request)
    // {
    //     $reports = Reports::with(['transaction.column', 'transaction.contact', 'transaction.product'])->get();

    //     $data = [
    //         'title' => 'Laporan Transaksi',
    //         'date' => date('d/m/Y'),
    //         'reports' => $reports
    //     ];

    //     // $pdf = Pdf::loadView('reports.pdf', $data); // Create 'reports.pdf' Blade view in resources/views
    //     // return $pdf->download('laporan-transaksi-' . time() . '.pdf');

    //     $pdf = Pdf::loadView('reports.pdf', $data)->setPaper('a4', 'landscape');
    //     return $pdf->download('laporan-transaksi-' . time() . '.pdf');

    // }


    public function exportPdf(Request $request)
{
    $reports = Reports::with(['transaction.column', 'transaction.contact', 'transaction.product'])->get();

    $data = [
        'title' => 'Laporan Transaksi',
        'date' => date('d/m/Y'),
        'reports' => $reports
    ];

    $pdf = Pdf::loadView('reports.pdf', $data)->setPaper('a4', 'landscape');

    // GANTI: return $pdf->download(...);
    return $pdf->stream('laporan-transaksi.pdf'); // <-- tampilkan di browser
}
//     public function exportPdf(Request $request)
// {
//     $now = now();

//     // Data bulan & tahun ini
//     $currentReports = Reports::with([
//         'transaction.column',
//         'transaction.contact',
//         'transaction.product'
//     ])
//     ->whereMonth('created_at', $now->month)
//     ->whereYear('created_at', $now->year)
//     ->get();

//     // Data arsip: selain bulan & tahun ini
//     $archivedReports = Reports::with([
//         'transaction.column',
//         'transaction.contact',
//         'transaction.product'
//     ])
//     ->where(function ($query) use ($now) {
//         $query->whereMonth('created_at', '!=', $now->month)
//               ->orWhereYear('created_at', '!=', $now->year);
//     })
//     ->get();

//     $data = [
//         'title' => 'Laporan Transaksi',
//         'date' => $now->format('d/m/Y'),
//         'currentReports' => $currentReports,
//         'archivedReports' => $archivedReports,
//     ];

//     $pdf = Pdf::loadView('reports.pdf', $data)->setPaper('a4', 'landscape');
//     return $pdf->download('laporan-transaksi-' . time() . '.pdf');
// }


//     /**
//      * Generate an Excel report.
//      *
//      * * @param  \Illuminate\Http\Request  $request
//      * @return \Illuminate\Http\Response
//      */
    public function exportExcel(Request $request)
    {
        return Excel::download(new ReportsExport, 'laporan-transaksi-' . time() . '.xlsx');
    }

}
