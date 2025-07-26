<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Sector;

class SectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    //  public function run(): void
    // {
    //     $sectors = [
    //         'Technology',
    //         'Healthcare',
    //         'Finance',
    //         'Education',
    //         'Retail',
    //     ];

    //     foreach ($sectors as $name) {
    //         Sector::create([
    //             'id' => Str::uuid(),
    //             'name' => $name,
    //             // Tidak perlu isi `bg_color` dan `text_color`, akan otomatis diisi oleh model
    //         ]);
    //     }
    // }

    public function run(): void
    {
        $sectors = ['Industri Makanan', 'Teknologi', 'Kesehatan', 'Pendidikan', 'Pertanian'];

        foreach ($sectors as $name) {
            Sector::create([
                'name' => $name,
            ]);
        }
    }
}
