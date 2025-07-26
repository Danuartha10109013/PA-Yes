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

class AdminController extends Controller
{
    public function segmentasi()
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

    return Inertia::render('Admin/Segmentasi/index', [
        'segmentasi' => $segmentasi,
        'averages' => $averages,
        'month' => $now->month,
        'year' => $now->year,
        'mode' => $show === 'arsip' ? 'arsip' : 'current',
    ]);
}

}
