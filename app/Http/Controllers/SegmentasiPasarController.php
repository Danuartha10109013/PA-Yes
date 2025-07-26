<?php

namespace App\Http\Controllers;
use App\Models\SegmentasiPasar;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf; // For PDF generation
use Maatwebsite\Excel\Facades\Excel; // For Excel generation
use App\Exports\SegmentasiPasarExport;
use Inertia\Inertia;
use Carbon\Carbon;


class SegmentasiPasarController extends Controller
{
    //  public function index()
    // {
    //     // Mengambil semua data SegmentasiPasar, dengan eager loading relasi 'sector'
    //     // agar nama sektor bisa langsung diakses.
    //     $segmentasiPasar = SegmentasiPasar::with('sector')->get();

    //     // Mengembalikan data sebagai JSON response
    //     return response()->json([
    //         'message' => 'Data segmentasi pasar berhasil diambil.',
    //         'data' => $segmentasiPasar
    //     ]);
    // }

//      public function show(string $id)
//     {
//         // If you need sector_name here, you'd also use join
//         $segmentasiPasar = DB::table('segmentasi_pasar')
//             ->join('sectors', 'segmentasi_pasar.sector_id', '=', 'sectors.id')
//             ->select(
//                 'segmentasi_pasar.sector_name',
//                 'sectors.name'
//             )
//             ->where('segmentasi_pasar.id', $id)
//             ->first(); // Use first() for a single record

//         if (!$segmentasiPasar) {
//             return response()->json(['message' => 'Segmentasi pasar tidak ditemukan.'], 404);
//         }

//         return response()->json([
//             'message' => 'Data segmentasi pasar berhasil diambil.',
//             'data' => $segmentasiPasar
//         ]);
//     }
// }

// public function index()
//     {
//         // Menggunakan DB Query Builder dengan join untuk mendapatkan data segmentasi pasar dan nama sektor
//         $segmentasiPasar = DB::table('segmentasi_pasar')
//             ->join('sectors', 'segmentasi_pasar.sector_id', '=', 'sectors.id')
//             ->select(
//                 'segmentasi_pasar.id',
//                 'segmentasi_pasar.sector_id', // Sertakan sector_id jika diperlukan di frontend
//                 'sectors.name as sector_name', // Aliaskan sectors.name menjadi sector_name
//                 'segmentasi_pasar.jumlah_item',
//                 'segmentasi_pasar.total_penjualan',
//                 'segmentasi_pasar.total_transaksi',
//                 'segmentasi_pasar.kriteria_jumlah_item',
//                 'segmentasi_pasar.kriteria_total_penjualan',
//                 'segmentasi_pasar.kriteria_total_transaksi',
//                 'segmentasi_pasar.status',
//                 'segmentasi_pasar.created_at',
//                 'segmentasi_pasar.updated_at'
//                 // Jika Anda memiliki 'deleted_at' dan ingin menanganinya dengan soft delete pada join,
//                 // Anda perlu menambahkan kondisi whereNull seperti:
//                 // ->whereNull('segmentasi_pasar.deleted_at')
//                 // ->whereNull('sectors.deleted_at')
//             )
//             ->get(); // Mengambil semua hasil

//         return response()->json([
//             'message' => 'Data segmentasi pasar berhasil diambil.',
//             'data' => $segmentasiPasar
//         ]);
//     }
// }

// public function index(Request $request)
// {
//     $now = now();
//     $mode = $request->query('show') === 'arsip' ? 'arsip' : 'normal';

//     $query = DB::table('segmentasi_pasar')
//         ->join('sectors', 'segmentasi_pasar.sector_id', '=', 'sectors.id')
//         ->select(
//             'segmentasi_pasar.id',
//             'segmentasi_pasar.sector_id',
//             'sectors.name as sector_name',
//             'segmentasi_pasar.jumlah_item',
//             'segmentasi_pasar.total_penjualan',
//             'segmentasi_pasar.total_transaksi',
//             'segmentasi_pasar.kriteria_jumlah_item',
//             'segmentasi_pasar.kriteria_total_penjualan',
//             'segmentasi_pasar.kriteria_total_transaksi',
//             'segmentasi_pasar.status',
//             'segmentasi_pasar.month',
//             'segmentasi_pasar.year',
//             'segmentasi_pasar.created_at',
//             'segmentasi_pasar.updated_at'
//         );

//     if ($mode === 'arsip') {
//         $query->where(function ($q) use ($now) {
//             $q->where('segmentasi_pasar.month', '!=', $now->month)
//               ->orWhere('segmentasi_pasar.year', '!=', $now->year);
//         });
//     } else {
//         $query->where('segmentasi_pasar.month', $now->month)
//               ->where('segmentasi_pasar.year', $now->year);
//     }

//     $segmentasiPasar = $query->orderByDesc('segmentasi_pasar.year')
//                              ->orderByDesc('segmentasi_pasar.month')
//                              ->get();

//     return response()->json([
//         'mode' => $mode,
//         'month' => $now->month,
//         'year' => $now->year,
//         'data' => $segmentasiPasar
//     ]);
// }

 /**
     * Menampilkan data segmentasi pasar berdasarkan mode (normal/arsip).
     *
     * @param Request $request
     * @return JsonResponse
     */
    // public function index(Request $request): JsonResponse
    // {
    //     $now = now();
    //     $mode = $request->query('show') === 'arsip' ? 'arsip' : 'normal';

    //     $query = DB::table('segmentasi_pasar')
    //         ->join('sectors', 'segmentasi_pasar.sector_id', '=', 'sectors.id')
    //         ->select(
    //             'segmentasi_pasar.id',
    //             'segmentasi_pasar.sector_id',
    //             'sectors.name as sector_name',
    //             'segmentasi_pasar.jumlah_item',
    //             'segmentasi_pasar.total_penjualan',
    //             'segmentasi_pasar.total_transaksi',
    //             'segmentasi_pasar.kriteria_jumlah_item',
    //             'segmentasi_pasar.kriteria_total_penjualan',
    //             'segmentasi_pasar.kriteria_total_transaksi',
    //             'segmentasi_pasar.status',
    //             'segmentasi_pasar.month',
    //             'segmentasi_pasar.year',
    //             'segmentasi_pasar.created_at',
    //             'segmentasi_pasar.updated_at'
    //         );

    //     if ($mode === 'arsip') {
    //         $query->where(function ($q) use ($now) {
    //             $q->where('segmentasi_pasar.month', '!=', $now->month)
    //               ->orWhere('segmentasi_pasar.year', '!=', $now->year);
    //         });
    //     } else {
    //         $query->where('segmentasi_pasar.month', $now->month)
    //               ->where('segmentasi_pasar.year', $now->year);
    //     }

    //     $segmentasiPasar = $query->orderByDesc('segmentasi_pasar.year')
    //                              ->orderByDesc('segmentasi_pasar.month')
    //                              ->get();

    //     return response()->json([
    //         'mode' => $mode,
    //         'month' => $now->month,
    //         'year' => $now->year,
    //         'data' => $segmentasiPasar
    //     ]);
    // }



// public function index()
// {
//     $now = Carbon::now();
//     $lastMonth = $now->copy()->subMonth();

//     // Data bulan ini
//     $segmentasiBulanIni = SegmentasiPasar::with('sector')
//         ->where('month', $now->month)
//         ->where('year', $now->year)
//         ->orderByRaw("CASE
//             WHEN status = 'Potensial Tinggi' THEN 1
//             WHEN status = 'Potensial Sedang' THEN 2
//             WHEN status = 'Potensial Rendah' THEN 3
//             ELSE 4 END")
//         ->orderByDesc('total_penjualan')
//         ->orderByDesc('total_transaksi')
//         ->orderByDesc('jumlah_item')
//         ->get()
//         ->map(function ($item) {
//             return [
//                 'id' => $item->id,
//                 'sector_id' => $item->sector_id,
//                 'sector_name' => optional($item->sector)->name,
//                 'jumlah_item' => $item->jumlah_item,
//                 'total_penjualan' => $item->total_penjualan,
//                 'total_transaksi' => $item->total_transaksi,
//                 'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
//                 'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
//                 'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
//                 'status' => $item->status,
//                 'month' => $item->month,
//                 'year' => $item->year,
//                 'created_at' => $item->created_at,
//                 'updated_at' => $item->updated_at,
//                 'deleted_at' => $item->deleted_at,
//             ];
//         });

//     // Data arsip bulan lalu
//     $segmentasiBulanLalu = SegmentasiPasar::with('sector')
//         ->where('month', $lastMonth->month)
//         ->where('year', $lastMonth->year)
//         ->orderByRaw("CASE
//             WHEN status = 'Potensial Tinggi' THEN 1
//             WHEN status = 'Potensial Sedang' THEN 2
//             WHEN status = 'Potensial Rendah' THEN 3
//             ELSE 4 END")
//         ->orderByDesc('total_penjualan')
//         ->orderByDesc('total_transaksi')
//         ->orderByDesc('jumlah_item')
//         ->get()
//         ->map(function ($item) {
//             return [
//                 'id' => $item->id,
//                 'sector_id' => $item->sector_id,
//                 'sector_name' => optional($item->sector)->name,
//                 'jumlah_item' => $item->jumlah_item,
//                 'total_penjualan' => $item->total_penjualan,
//                 'total_transaksi' => $item->total_transaksi,
//                 'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
//                 'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
//                 'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
//                 'status' => $item->status,
//                 'month' => $item->month,
//                 'year' => $item->year,
//                 'created_at' => $item->created_at,
//                 'updated_at' => $item->updated_at,
//                 'deleted_at' => $item->deleted_at,
//             ];
//         });

//     $averages = [
//         'avg_jumlah_item' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('jumlah_item'),
//         'avg_total_penjualan' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_penjualan'),
//         'avg_total_transaksi' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_transaksi'),
//     ];

//     return Inertia::render('SegmentasiPasar/index', [
//         'segmentasi' => $segmentasiBulanIni,
//         'arsip' => $segmentasiBulanLalu,
//         'averages' => $averages,
//         'month' => $now->month,
//         'year' => $now->year,
//     ]);
// }

public function index()
{
    $now = Carbon::now();
    $show = request()->get('show'); // ambil parameter ?show=arsip dari URL

    $segmentasi = collect();
    $averages = [];

    if ($show === 'arsip') {
        // Jika show=arsip → tampilkan semua arsip (bulan sebelum sekarang)
        $segmentasi = SegmentasiPasar::with('sector')
            ->where(function ($query) use ($now) {
                $query->where('year', '<', $now->year)
                    ->orWhere(function ($q) use ($now) {
                        $q->where('year', $now->year)
                          ->where('month', '<', $now->month);
                    });
            })
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->orderByRaw("CASE
                WHEN status = 'Potensial Tinggi' THEN 1
                WHEN status = 'Potensial Sedang' THEN 2
                WHEN status = 'Potensial Rendah' THEN 3
                ELSE 4 END")
            ->orderByDesc('total_penjualan')
            ->orderByDesc('total_transaksi')
            ->orderByDesc('jumlah_item')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'sector_id' => $item->sector_id,
                    'sector_name' => optional($item->sector)->name,
                    'jumlah_item' => $item->jumlah_item,
                    'total_penjualan' => $item->total_penjualan,
                    'total_transaksi' => $item->total_transaksi,
                    'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
                    'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
                    'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
                    'status' => $item->status,
                    'month' => $item->month,
                    'year' => $item->year,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'deleted_at' => $item->deleted_at,
                ];
            });
    } else {
        // Default → tampilkan data bulan ini
        $segmentasi = SegmentasiPasar::with('sector')
            ->where('month', $now->month)
            ->where('year', $now->year)
            ->orderByRaw("CASE
                WHEN status = 'Potensial Tinggi' THEN 1
                WHEN status = 'Potensial Sedang' THEN 2
                WHEN status = 'Potensial Rendah' THEN 3
                ELSE 4 END")
            ->orderByDesc('total_penjualan')
            ->orderByDesc('total_transaksi')
            ->orderByDesc('jumlah_item')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'sector_id' => $item->sector_id,
                    'sector_name' => optional($item->sector)->name,
                    'jumlah_item' => $item->jumlah_item,
                    'total_penjualan' => $item->total_penjualan,
                    'total_transaksi' => $item->total_transaksi,
                    'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
                    'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
                    'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
                    'status' => $item->status,
                    'month' => $item->month,
                    'year' => $item->year,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'deleted_at' => $item->deleted_at,
                ];
            });

        // Hitung rata-rata hanya jika bukan arsip
        $averages = [
            'avg_jumlah_item' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('jumlah_item'),
            'avg_total_penjualan' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_penjualan'),
            'avg_total_transaksi' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_transaksi'),
        ];
    }

    return Inertia::render('SegmentasiPasar/index', [
        'segmentasi' => $segmentasi,
        'averages' => $averages,
        'month' => $now->month,
        'year' => $now->year,
        'mode' => $show === 'arsip' ? 'arsip' : 'current',
    ]);
}


public function segmentasipasaradmin()
{
    $now = Carbon::now();
    $lastMonth = $now->copy()->subMonth();

    // Data bulan ini
    $segmentasiBulanIni = SegmentasiPasar::with('sector')
        ->where('month', $now->month)
        ->where('year', $now->year)
        ->orderByRaw("CASE
            WHEN status = 'Potensial Tinggi' THEN 1
            WHEN status = 'Potensial Sedang' THEN 2
            WHEN status = 'Potensial Rendah' THEN 3
            ELSE 4 END")
        ->orderByDesc('total_penjualan')
        ->orderByDesc('total_transaksi')
        ->orderByDesc('jumlah_item')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'sector_id' => $item->sector_id,
                'sector_name' => optional($item->sector)->name,
                'jumlah_item' => $item->jumlah_item,
                'total_penjualan' => $item->total_penjualan,
                'total_transaksi' => $item->total_transaksi,
                'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
                'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
                'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
                'status' => $item->status,
                'month' => $item->month,
                'year' => $item->year,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'deleted_at' => $item->deleted_at,
            ];
        });

    // Data arsip bulan lalu
    $segmentasiBulanLalu = SegmentasiPasar::with('sector')
        ->where('month', $lastMonth->month)
        ->where('year', $lastMonth->year)
        ->orderByRaw("CASE
            WHEN status = 'Potensial Tinggi' THEN 1
            WHEN status = 'Potensial Sedang' THEN 2
            WHEN status = 'Potensial Rendah' THEN 3
            ELSE 4 END")
        ->orderByDesc('total_penjualan')
        ->orderByDesc('total_transaksi')
        ->orderByDesc('jumlah_item')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'sector_id' => $item->sector_id,
                'sector_name' => optional($item->sector)->name,
                'jumlah_item' => $item->jumlah_item,
                'total_penjualan' => $item->total_penjualan,
                'total_transaksi' => $item->total_transaksi,
                'kriteria_jumlah_item' => $item->kriteria_jumlah_item,
                'kriteria_total_penjualan' => $item->kriteria_total_penjualan,
                'kriteria_total_transaksi' => $item->kriteria_total_transaksi,
                'status' => $item->status,
                'month' => $item->month,
                'year' => $item->year,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'deleted_at' => $item->deleted_at,
            ];
        });

    $averages = [
        'avg_jumlah_item' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('jumlah_item'),
        'avg_total_penjualan' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_penjualan'),
        'avg_total_transaksi' => SegmentasiPasar::where('month', $now->month)->where('year', $now->year)->avg('total_transaksi'),
    ];

    return Inertia::render('Admin/Segmentasi/index', [
        'segmentasi' => $segmentasiBulanIni,
        'arsip' => $segmentasiBulanLalu,
        'averages' => $averages,
        'month' => $now->month,
        'year' => $now->year,
    ]);
}



    /**
     * Mendapatkan rata-rata nilai dari data segmentasi pasar pada bulan & tahun saat ini.
     *
     * @return JsonResponse
     */
    public function getAverages(): JsonResponse
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $data = SegmentasiPasar::where('month', $currentMonth)
                               ->where('year', $currentYear)
                               ->get();

        $count = $data->count();

        if ($count === 0) {
            return response()->json(['message' => 'No data available for current month/year'], 404);
        }

        $avg = [
            'avg_jumlah_item' => round($data->sum('jumlah_item') / $count, 2),
            'avg_total_penjualan' => round($data->sum('total_penjualan') / $count, 2),
            'avg_total_transaksi' => round($data->sum('total_transaksi') / $count, 2),
        ];

        return response()->json($avg);
    }

    /**
     * Menampilkan data segmentasi pasar berdasarkan ID.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $segmentasiPasar = DB::table('segmentasi_pasar')
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
            )
            ->where('segmentasi_pasar.id', $id)
            ->first();

        if (!$segmentasiPasar) {
            return response()->json(['message' => 'Segmentasi pasar tidak ditemukan.'], 404);
        }

        return response()->json([
            'message' => 'Data segmentasi pasar berhasil diambil.',
            'data' => $segmentasiPasar
        ]);
    }
     public function exportPdf()
    {
        $segmen = SegmentasiPasar::with('sector')->get();

         $data = [
            'title' => 'Laporan Segmentasi Pasar',
            'date' => date('d/m/Y'),
            'segmentasi_pasar' => $segmen
        ];

        // $pdf = Pdf::loadView('reports.pdf', $data); // Create 'reports.pdf' Blade view in resources/views
        // return $pdf->download('laporan-transaksi-' . time() . '.pdf');

        $pdf = Pdf::loadView('segmentasipasar.pdf', $data)->setPaper('a4', 'landscape');
        return $pdf->stream('laporan-segmentasipasar-' . time() . '.pdf');


    }
    public function exportExcel()
    {
        return Excel::download(new SegmentasiPasarExport, 'segmentasi_pasar.xlsx');
    }
}
