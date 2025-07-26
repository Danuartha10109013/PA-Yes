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
        Schema::create('contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('company_name')->nullable();;
            $table->string('email')->nullable();;
            $table->string('phone')->nullable();;
            $table->string('social_media')->nullable();;
            $table->foreignUuid('sector_id')->constrained();
            $table->text('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
//     public function up(): void
// {
//     Schema::table('contacts', function (Blueprint $table) {
//         // Menambahkan kolom baru sosmed yang nullable
//         $table->json('sosmed')->nullable()->after('phone');

//         // Mengubah kolom yang sudah ada agar nullable
//         $table->string('company_name')->nullable()->change();
//         $table->string('email')->nullable()->change();
//         $table->string('phone')->nullable()->change();

//         // Kalau kolom sector_id dan address sudah ada, tidak perlu tulis ulang di sini
//         // Kalau ingin ubah address jadi nullable
//         $table->text('address')->nullable()->change();
//     });
// }

// public function down(): void
// {
//     Schema::table('contacts', function (Blueprint $table) {
//         // Hapus kolom sosmed
//         $table->dropColumn('sosmed');

//         // Kembalikan kolom ke non-nullable
//         $table->string('company_name')->nullable(false)->change();
//         $table->string('email')->nullable(false)->change();
//         $table->string('phone')->nullable(false)->change();

//         $table->text('address')->nullable(false)->change();
//     });
// }
};
