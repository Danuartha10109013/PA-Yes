<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ColumnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        $columns = [
            'PROSPECTING',
            'CONTACTING',
            'NEGOTIATION',
            'DEALING',
            'JUNK',
        ];

        foreach ($columns as $name) {
            DB::table('columns')->insert([
                'id' => Str::uuid(),
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
