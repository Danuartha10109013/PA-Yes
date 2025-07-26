<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Transaction;
use App\Models\Column;
use App\Models\Product;
use App\Models\Contact;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    //  public function run(): void
    // {
    //     $faker = Faker::create();

    //     $columnIds = Column::pluck('id')->toArray();
    //     $productIds = Product::pluck('id')->toArray();
    //     $contactIds = Contact::pluck('id')->toArray();

    //     foreach (range(1, 20) as $i) {
    //         $price = $faker->randomFloat(2, 100, 1000);
    //         $qty = $faker->numberBetween(1, 5);

    //         Transaction::create([
    //             'id' => Str::uuid(),
    //             'column_id' => $faker->randomElement($columnIds),
    //             'product_id' => $faker->optional()->randomElement($productIds),
    //             'contact_id' => $faker->optional()->randomElement($contactIds),
    //             'current_price' => $price,
    //             'qty' => $qty,
    //             // 'trx' dan 'grand_total' otomatis dihandle oleh model Transaction
    //         ]);
    //     }
    // }

    public function run(): void
    {
        $faker = Faker::create();

        $columnIds = Column::pluck('id')->toArray();
        $productIds = Product::pluck('id')->toArray();
        $contactIds = Contact::pluck('id')->toArray();

        // Helper function to generate unique TRX number
        $generateTrx = function() use ($faker) {
            $now = now();
            $y = $now->format('y'); // Two digit year
            $m = $now->format('m'); // Month with leading zero
            $d = $now->format('d'); // Day with leading zero
            $h = $now->format('H'); // Hour with leading zero
            $i = $now->format('i'); // Minute with leading zero
            $random = $faker->numberBetween(10, 99); // 2 digit random number

            $trx = "TRX{$y}{$m}{$d}{$h}{$i}{$random}";

            // Ensure uniqueness (simple check, for large datasets consider more robust methods)
            while (Transaction::where('trx', $trx)->exists()) {
                $random = $faker->numberBetween(10, 99);
                $trx = "TRX{$y}{$m}{$d}{$h}{$i}{$random}";
            }
            return $trx;
        };

        foreach (range(1, 20) as $i) {
            $price = $faker->randomFloat(2, 100, 1000);
            $qty = $faker->numberBetween(1, 5);
            $grandTotal = $price * $qty; // Calculate grand_total here

            // Generate deadline, ensuring format() is only called if a DateTime object is returned
            $deadline = $faker->optional()->dateTimeBetween('+1 week', '+1 month');
            $formattedDeadline = $deadline ? $deadline->format('Y-m-d') : null;

            Transaction::create([
                'id' => Str::uuid(),
                'trx' => $generateTrx(), // Generate unique TRX
                'column_id' => $faker->randomElement($columnIds),
                'product_id' => $faker->optional()->randomElement($productIds),
                'contact_id' => $faker->optional()->randomElement($contactIds),
                'current_price' => $price,
                'qty' => $qty,
                'grand_total' => $grandTotal, // Assign calculated grand_total
                'deadline' => $formattedDeadline, // Assign the formatted deadline or null
                'notes' => $faker->optional()->sentence(), // Add dummy notes
            ]);
        }
    }
}
