<?php

namespace App\Exports;

use App\Models\Reports;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings; // Optional: To add column headings
use Maatwebsite\Excel\Concerns\WithMapping; // Optional: To map data for custom columns


class ReportsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Fetch all reports with necessary relationships
        return Reports::with(['transaction.contact', 'transaction.product'])->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID Laporan',
            'TRX Transaksi',
            'Nama Customer',
            'Nama Perusahaan',
            'Nama Produk',
            'Kuantitas',
            'Total',
            'Status',
            'Dibuat Pada',
            'Diperbarui Pada',
        ];
    }

    /**
     * @param mixed $report
     * @return array
     */
    public function map($report): array
    {
        return [
            $report->id,
            $report->trx,
            $report->contact_name,
            $report->company_name,
            $report->product_name,
            $report->qty,
            $report->total,
            $report->status,
            $report->created_at->format('Y-m-d H:i:s'), // Format date as needed
            $report->updated_at->format('Y-m-d H:i:s'), // Format date as needed
        ];
    }
}
