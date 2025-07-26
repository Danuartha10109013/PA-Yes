<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Contact;
use App\Models\Sector;
class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $sectors = Sector::pluck('id')->toArray();

        foreach (range(1, 20) as $i) {
            Contact::create([
                'id' => Str::uuid(),
                'name' => $faker->name(),
                'company_name' => $faker->company(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->phoneNumber(),
                'sector_id' => $faker->randomElement($sectors),
                'address' => $faker->address(),
            ]);
        }
    }
}
