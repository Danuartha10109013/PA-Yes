<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SegmentasiPasar extends Model
{
   use HasFactory, HasUuids;

    // Nama tabel di database
    protected $table = 'segmentasi_pasar';

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'sector_id',
        'jumlah_item',
        'total_penjualan',
        'total_transaksi',
        'kriteria_jumlah_item',
        'kriteria_total_penjualan',
        'kriteria_total_transaksi',
        'status',
        'month',
        'year',
    ];

    // Kolom yang harus di-cast ke tipe data tertentu
    protected $casts = [
        // 'jumlah_item' => 'integer', // Opsional: jika Anda ingin memastikan tipe data
        // 'total_penjualan' => 'integer',
        // 'total_transaksi' => 'integer',
    ];

    /**
     * Define the relationship with the Sector model.
     * Sebuah segmentasi pasar dimiliki oleh satu sektor.
     */
    // public function sector()
    // {
    //     return $this->belongsTo(Sector::class);
    // }
    public function sector() // This method name is crucial!
    {
        return $this->belongsTo(Sector::class, 'sector_id', 'id');
        // 'Sector::class' points to your Sector model
        // 'sector_id' is the foreign key on the segmentasi_pasar table
        // 'id' is the primary key on the sectors table (usually 'id' by default)
    }

    protected static function booted()
{
    static::creating(function ($model) {
        $model->month ??= now()->month;
        $model->year ??= now()->year;
    });
}

}
