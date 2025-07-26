<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
            $name = $faker->words(3, true);
            $slug = Str::slug($name);

            DB::table('products')->insert([
                'id' => Str::uuid(),
                'name' => $name,
                'slug' => $slug,
                'price' => $faker->randomFloat(2, 10, 1000),
                'description' => $faker->sentence(10),
                'image' => $faker->imageUrl(640, 480, 'products', true),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
