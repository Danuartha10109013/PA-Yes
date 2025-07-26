<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('segmentasi_pasar', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sector_id')->constrained()->onDelete('cascade');
            $table->integer('month')->nullable();;
            $table->integer('year')->nullable();;
            $table->integer('jumlah_item')->nullable();
            $table->integer('total_penjualan')->nullable();
            $table->integer('total_transaksi')->nullable();
            $table->string('kriteria_jumlah_item')->nullable();
            $table->string('kriteria_total_penjualan')->nullable();
            $table->string('kriteria_total_transaksi')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->unique(['sector_id', 'month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segmentasi_pasar');
    }
};
