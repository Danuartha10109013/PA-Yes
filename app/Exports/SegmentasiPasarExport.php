<?php

namespace App\Exports;

use App\Models\SegmentasiPasar;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SegmentasiPasarExport implements  FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return SegmentasiPasar::with('sector')->get();
    }

    public function headings(): array
    {
        return [
            'Nama Sektor',
            'Jumlah Item',
            'Total Penjualan',
            'Total Transaksi',
            'Kriteria Jumlah Item',
            'Kriteria Total Penjualan',
            'Kriteria Total Transaksi',
            'Status',
            'Dibuat Pada',
            'Diperbarui Pada',
        ];
    }

    public function map($segmentasiPasar): array
    {
        return [
            $segmentasiPasar->sector->name ?? 'N/A',
            $segmentasiPasar->jumlah_item,
            $segmentasiPasar->total_penjualan,
            $segmentasiPasar->total_transaksi,
            $segmentasiPasar->kriteria_jumlah_item,
            $segmentasiPasar->kriteria_total_penjualan,
            $segmentasiPasar->kriteria_total_transaksi,
            $segmentasiPasar->status,
            $segmentasiPasar->created_at->format('d M Y'),
            $segmentasiPasar->updated_at->format('d M Y'),
        ];
    }
}
