<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
// use Database\Seeders\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // <-- Add this line
// use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    // public function run(): void
    // {
    //     // User::factory(10)->create();

    //     User::factory()->create([
    //         'name' => 'Test User',
    //         'email' => 'test@example.com',
    //     ]);
    // }
    public function run(): void
    {

        // Define "current month" and "previous month" for consistent seeding.
        // As per previous discussions, we'll use fixed dates for "this month" (June 2025)
        // and "previous month" (May 2025) to ensure consistent seeded data regardless of
        // when the seeder is run.
        $currentMonth = Carbon::parse('2025-06-01'); // Start of June 2025
        $previousMonth = Carbon::parse('2025-05-01'); // Start of May 2025

        // Optional: Disable foreign key checks for seeding to avoid issues with order.
        // Uncomment the line below if you encounter foreign key constraint errors during seeding.
        // For MySQL: DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->command->info('Starting database seeding...');

        // --- 1. Seed 'columns' table ---
        $columnData = [
            ['name' => 'PROSPECTING'],
            ['name' => 'CONTACTING'],
            ['name' => 'NEGOTIATION'],
            ['name' => 'DEALING'],
            ['name' => 'JUNK'],
        ];

        $columnIds = []; // To store UUIDs for later use

        foreach ($columnData as $data) {
            $uuid = (string) Str::uuid();
            DB::table('columns')->insert([
                'id' => $uuid,
                'name' => $data['name'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $columnIds[$data['name']] = $uuid;
        }
        $this->command->info('Columns seeded successfully!');


        // --- 2. Seed 'products' table ---
        $productData = [
            [
                'name' => 'Premium Software License',
                'slug' => 'premium-software-license',
                'price' => 500.00,
                'description' => 'Annual license for our premium software suite.',
                'image' => null,
            ],
            [
                'name' => 'Consulting Hours Package',
                'slug' => 'consulting-hours-package',
                'price' => 150.00,
                'description' => 'Block of 10 consulting hours with our experts.',
                'image' => null,
            ],
            [
                'name' => 'Basic Support Plan',
                'slug' => 'basic-support-plan',
                'price' => 75.00,
                'description' => 'Monthly basic support plan.',
                'image' => null,
            ],
            [
                'name' => 'Custom Software Development',
                'slug' => 'custom-software-development',
                'price' => 5000.00,
                'description' => 'Tailored software development project based on client requirements.',
                'image' => null,
            ],
            [
                'name' => 'Enterprise CRM Solution',
                'slug' => 'enterprise-crm-solution',
                'price' => 15000.00,
                'description' => 'Comprehensive CRM solution for large enterprises.',
                'image' => null,
            ],
        ];

        $productIds = [];

        foreach ($productData as $data) {
            $uuid = (string) Str::uuid();
            DB::table('products')->insert([
                'id' => $uuid,
                'name' => $data['name'],
                'slug' => $data['slug'],
                'price' => $data['price'],
                'description' => $data['description'],
                'image' => $data['image'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $productIds[$data['name']] = $uuid;
        }
        $this->command->info('Products seeded successfully!');


        // --- 3. Seed 'sectors' table ---
        $sectorData = [
            ['name' => 'Information Technology', 'bg_color' => '#E0F2F7', 'text_color' => '#2196F3'],
            ['name' => 'Finance', 'bg_color' => '#E8F5E9', 'text_color' => '#4CAF50'],
            ['name' => 'Healthcare', 'bg_color' => '#FFEBEE', 'text_color' => '#F44336'],
            ['name' => 'Retail', 'bg_color' => '#FFFDE7', 'text_color' => '#FFC107'],
            ['name' => 'Manufacturing', 'bg_color' => '#E3F2FD', 'text_color' => '#03A9F4'],
            ['name' => 'Education', 'bg_color' => '#F3E5F5', 'text_color' => '#9C27B0'],
        ];

        $sectorIds = [];

        foreach ($sectorData as $data) {
            $uuid = (string) Str::uuid();
            DB::table('sectors')->insert([
                'id' => $uuid,
                'name' => $data['name'],
                'bg_color' => $data['bg_color'],
                'text_color' => $data['text_color'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $sectorIds[$data['name']] = $uuid;
        }
        $this->command->info('Sectors seeded successfully!');


        // --- 4. Seed 'contacts' table (depends on 'sectors') ---
        $contactData = [
            [
                'name' => 'John Doe',
                'company_name' => 'Tech Solutions Inc.',
                'email' => 'john.doe@techsolutions.com',
                'phone' => '081234567890',
                'sector_name' => 'Information Technology',
                'address' => '123 Tech Lane, Silicon Valley, CA',
            ],
            [
                'name' => 'Jane Smith',
                'company_name' => 'Global Finance Corp.',
                'email' => 'jane.smith@globalfinance.com',
                'phone' => '089876543210',
                'sector_name' => 'Finance',
                'address' => '456 Wall Street, New York, NY',
            ],
            [
                'name' => 'Peter Jones',
                'company_name' => 'MediCare Hospital',
                'email' => 'peter.jones@medicare.com',
                'phone' => '087654321098',
                'sector_name' => 'Healthcare',
                'address' => '789 Health Ave, Medical City, TX',
            ],
            [
                'name' => 'Sarah Connor',
                'company_name' => 'Retail Express',
                'email' => 'sarah.connor@retailexpress.com',
                'phone' => '082109876543',
                'sector_name' => 'Retail',
                'address' => '101 Shopping Mall, City Center, WA',
            ],
            [
                'name' => 'David Lee',
                'company_name' => 'EduPro Systems',
                'email' => 'david.lee@edupro.com',
                'phone' => '085678901234',
                'sector_name' => 'Education',
                'address' => '202 University Blvd, Knowledge Town, MA',
            ],
        ];

        $contactIds = [];

        foreach ($contactData as $data) {
            if (!isset($sectorIds[$data['sector_name']])) {
                $this->command->error("Sector '{$data['sector_name']}' not found for contact '{$data['name']}'. Skipping.");
                continue;
            }

            $uuid = (string) Str::uuid();
            DB::table('contacts')->insert([
                'id' => $uuid,
                'name' => $data['name'],
                'company_name' => $data['company_name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'sector_id' => $sectorIds[$data['sector_name']],
                'address' => $data['address'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $contactIds[$data['name']] = $uuid;
        }
        $this->command->info('Contacts seeded successfully!');


        // --- 5. Seed 'transactions' table (depends on 'columns', 'products', 'contacts') ---

        // Data for transactions in the current month (June 2025)
        $this->seedTransactions(
            'Current Month (June 2025)',
            $currentMonth,
            $columnIds,
            $productIds,
            $contactIds,
            [
                [
                    'column_name' => 'PROSPECTING',
                    'product_name' => 'Premium Software License',
                    'contact_name' => 'John Doe',
                    'qty' => 1,
                    'deadline_days_ahead' => 10, // Deadline within June 2025
                    'notes' => 'New lead identified, initial email sent for Premium Software License.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Consulting Hours Package',
                    'contact_name' => 'Jane Smith',
                    'qty' => 3,
                    'deadline_days_ahead' => 18, // Deadline within June 2025
                    'notes' => 'Follow-up call scheduled. Client interested in a 3-hour consulting package.',
                ],
                [
                    'column_name' => 'NEGOTIATION',
                    'product_name' => 'Custom Software Development',
                    'contact_name' => 'Peter Jones',
                    'qty' => 1,
                    'deadline_days_ahead' => 25, // Deadline within June 2025
                    'notes' => 'Proposal submitted for custom software. Negotiation on scope and price in progress.',
                ],
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Basic Support Plan',
                    'contact_name' => 'Sarah Connor',
                    'qty' => 1,
                    'deadline_days_ahead' => 5, // Deal closed early in June
                    'notes' => 'Deal closed for basic support plan. Invoice sent.',
                ],
                [
                    'column_name' => 'PROSPECTING',
                    'product_name' => 'Enterprise CRM Solution',
                    'contact_name' => 'David Lee',
                    'qty' => 1,
                    'deadline_days_ahead' => 28, // New high-value lead
                    'notes' => 'Discovered a potential need for CRM in education sector. Initial outreach.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Premium Software License',
                    'contact_name' => 'Sarah Connor',
                    'qty' => 2,
                    'deadline_days_ahead' => 12,
                    'notes' => 'Followed up on previous interest for multiple licenses.',
                ],
            ]
        );

        // Data for transactions in the previous month (May 2025)
        $this->seedTransactions(
            'Previous Month (May 2025)',
            $previousMonth,
            $columnIds,
            $productIds,
            $contactIds,
            [
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Premium Software License',
                    'contact_name' => 'John Doe',
                    'qty' => 2,
                    'deadline_days_ahead' => 20, // Deal closed in May
                    'notes' => 'Successfully closed deal for two Premium Software Licenses.',
                ],
                [
                    'column_name' => 'JUNK',
                    'product_name' => 'Basic Support Plan',
                    'contact_name' => 'Jane Smith',
                    'qty' => 1,
                    'deadline_days_ahead' => -5, // Deadline was in May, client dropped out
                    'notes' => 'Client decided not to proceed after initial contact. Marked as junk.',
                ],
                [
                    'column_name' => 'NEGOTIATION',
                    'product_name' => 'Consulting Hours Package',
                    'contact_name' => 'Peter Jones',
                    'qty' => 5,
                    'deadline_days_ahead' => 15, // Was in negotiation in May, still pending or moved to this month
                    'notes' => 'Ongoing negotiation from last month. Client requested revised quote.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Enterprise CRM Solution',
                    'contact_name' => 'John Doe',
                    'qty' => 1,
                    'deadline_days_ahead' => 28, // Initial contact in May, still in pipeline
                    'notes' => 'First contact regarding CRM. Sent initial information pack.',
                ],
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Custom Software Development',
                    'contact_name' => 'Sarah Connor',
                    'qty' => 1,
                    'deadline_days_ahead' => 12, // Deal closed in May
                    'notes' => 'Custom development project signed off in May.',
                ],
            ]
        );

        // Optional: Re-enable foreign key checks (if you disabled them)
        // For MySQL: DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Database seeding completed!');
    }

    /**
     * Helper method to seed transactions with a specific base date.
     *
     * @param string $description A descriptive label for the seeding batch.
     * @param Carbon $baseDate The base date for generating created_at and deadline.
     * @param array $columnIds Array of column UUIDs.
     * @param array $productIds Array of product UUIDs.
     * @param array $contactIds Array of contact UUIDs.
     * @param array $transactionsToSeed Array of transaction data to insert.
     */
    protected function seedTransactions(
        string $description,
        Carbon $baseDate,
        array $columnIds,
        array $productIds,
        array $contactIds,
        array $transactionsToSeed
    ): void {
        $this->command->info("Seeding transactions for {$description}...");

        foreach ($transactionsToSeed as $data) {
            // Retrieve product price based on product name
            $productPrice = DB::table('products')->where('id', $productIds[$data['product_name']])->value('price');
            $grandTotal = $productPrice * $data['qty'];

            // Calculate created_at and updated_at to be within the specified month range
            $createdAt = $baseDate->copy()->addDays(rand(0, $baseDate->daysInMonth - 1))
                                  ->setTime(rand(9, 17), rand(0, 59), rand(0, 59));

            // updated_at will be after created_at, but not later than deadline (if positive)
            $updatedAt = $createdAt->copy()->addDays(rand(0, floor($data['deadline_days_ahead'] > 0 ? $data['deadline_days_ahead'] * 0.8 : 0)))
                                  ->addHours(rand(1,5)) // Add some random hours
                                  ->addMinutes(rand(1,59));

            // Ensure updated_at is at least equal to created_at
            if ($updatedAt->lessThan($createdAt)) {
                $updatedAt = $createdAt->copy();
            }

            // Ensure product_id and contact_id exist before inserting
            if (!isset($productIds[$data['product_name']]) || !isset($contactIds[$data['contact_name']])) {
                $this->command->error("Skipping transaction for product '{$data['product_name']}' or contact '{$data['contact_name']}' due to missing ID.");
                continue;
            }


            DB::table('transactions')->insert([
                'id' => (string) Str::uuid(),
                'trx' => 'TRX-' . Str::upper(Str::random(8)),
                'column_id' => $columnIds[$data['column_name']],
                'product_id' => $productIds[$data['product_name']],
                'contact_id' => $contactIds[$data['contact_name']],
                'current_price' => $productPrice,
                'qty' => $data['qty'],
                'grand_total' => $grandTotal,
                'deadline' => $baseDate->copy()->addDays($data['deadline_days_ahead']), // Deadline relative to baseDate
                'notes' => $data['notes'],
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ]);
        }

        $this->call([
            UserSeeder::class,
            SectorSeeder::class,
            ProductSeeder::class,
            ColumnSeeder::class,
            ContactSeeder::class,
            TransactionSeeder::class,
        //     // Add other seeders here if you create them later
        ]);

    }
}
