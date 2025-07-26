<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Define "current month" and "previous month" for consistent seeding.
        // Using fixed dates for "this month" (June 2025) and "previous month" (May 2025)
        $currentMonth = Carbon::parse('2025-06-01'); // Start of June 2025
        $previousMonth = Carbon::parse('2025-05-01'); // Start of May 2025

        $this->command->info('Starting database seeding...');

        // Clear existing data first
        $this->clearExistingData();

        // --- 1. Seed 'columns' table with styling ---
        $columnData = [
            [
                'name' => 'PROSPECTING',
                'bg_color' => 'bg-blue-100',
                'border_color' => 'border-blue-300',
                'title_color' => 'text-blue-600',
                'dot_border_color' => 'border-blue-400',
                'dot_bg_color' => 'bg-transparent',
                'dot_text_color' => 'text-blue-400',
                'add_lead_color' => 'text-blue-700'
            ],
            [
                'name' => 'CONTACTING',
                'bg_color' => 'bg-yellow-100',
                'border_color' => 'border-yellow-300',
                'title_color' => 'text-yellow-600',
                'dot_border_color' => 'border-yellow-400',
                'dot_bg_color' => 'bg-transparent',
                'dot_text_color' => 'text-yellow-400',
                'add_lead_color' => 'text-yellow-700'
            ],
            [
                'name' => 'NEGOTIATION',
                'bg_color' => 'bg-purple-100',
                'border_color' => 'border-purple-300',
                'title_color' => 'text-purple-600',
                'dot_border_color' => 'border-purple-400',
                'dot_bg_color' => 'bg-transparent',
                'dot_text_color' => 'text-purple-400',
                'add_lead_color' => 'text-purple-700'
            ],
            [
                'name' => 'DEALING',
                'bg_color' => 'bg-green-100',
                'border_color' => 'border-green-300',
                'title_color' => 'text-green-600',
                'dot_border_color' => 'border-green-400',
                'dot_bg_color' => 'bg-transparent',
                'dot_text_color' => 'text-green-400',
                'add_lead_color' => 'text-green-700'
            ],
            [
                'name' => 'JUNK',
                'bg_color' => 'bg-red-100',
                'border_color' => 'border-red-300',
                'title_color' => 'text-red-600',
                'dot_border_color' => 'border-red-400',
                'dot_bg_color' => 'bg-transparent',
                'dot_text_color' => 'text-red-400',
                'add_lead_color' => 'text-red-700'
            ],
        ];

        $columnIds = []; // To store UUIDs for later use

        foreach ($columnData as $data) {
            $uuid = (string) Str::uuid();
            DB::table('columns')->insert([
                'id' => $uuid,
                'name' => $data['name'],
                'bg_color' => $data['bg_color'],
                'border_color' => $data['border_color'],
                'title_color' => $data['title_color'],
                'dot_border_color' => $data['dot_border_color'],
                'dot_bg_color' => $data['dot_bg_color'],
                'dot_text_color' => $data['dot_text_color'],
                'add_lead_color' => $data['add_lead_color'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $columnIds[$data['name']] = $uuid;
        }
        $this->command->info('Columns seeded successfully!');

        // --- 2. Seed 'sectors' table ---
        $sectorData = [
            ['name' => 'Information Technology', 'bg_color' => '#E0F2F7', 'text_color' => '#2196F3'],
            ['name' => 'Finance', 'bg_color' => '#E8F5E9', 'text_color' => '#4CAF50'],
            ['name' => 'Healthcare', 'bg_color' => '#FFEBEE', 'text_color' => '#F44336'],
            ['name' => 'Retail', 'bg_color' => '#FFFDE7', 'text_color' => '#FFC107'],
            ['name' => 'Manufacturing', 'bg_color' => '#E3F2FD', 'text_color' => '#03A9F4'],
            ['name' => 'Education', 'bg_color' => '#F3E5F5', 'text_color' => '#9C27B0'],
            ['name' => 'Real Estate', 'bg_color' => '#FCE4EC', 'text_color' => '#E91E63'],
            ['name' => 'Transportation', 'bg_color' => '#E0F7FA', 'text_color' => '#00BCD4'],
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

        // --- 3. Seed 'products' table ---
        $productData = [
            [
                'name' => 'Premium Software License',
                'slug' => 'premium-software-license',
                'price' => 500.00,
                'description' => 'Annual license for our premium software suite with full support.',
                'image' => null,
            ],
            [
                'name' => 'Consulting Hours Package',
                'slug' => 'consulting-hours-package',
                'price' => 150.00,
                'description' => 'Block of 10 consulting hours with our certified experts.',
                'image' => null,
            ],
            [
                'name' => 'Basic Support Plan',
                'slug' => 'basic-support-plan',
                'price' => 75.00,
                'description' => 'Monthly basic support plan with email and chat support.',
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
                'description' => 'Comprehensive CRM solution for large enterprises with custom integrations.',
                'image' => null,
            ],
            [
                'name' => 'Cloud Migration Service',
                'slug' => 'cloud-migration-service',
                'price' => 3000.00,
                'description' => 'Complete cloud migration service including planning and execution.',
                'image' => null,
            ],
            [
                'name' => 'Data Analytics Platform',
                'slug' => 'data-analytics-platform',
                'price' => 8000.00,
                'description' => 'Advanced data analytics platform with real-time reporting.',
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

        // --- 4. Seed 'contacts' table (depends on 'sectors') ---
        $contactData = [
            [
                'name' => 'John Doe',
                'company_name' => 'Tech Solutions Inc.',
                'email' => 'john.doe@techsolutions.com',
                'phone' => '081234567890',
                'sector_name' => 'Information Technology',
                'address' => '123 Tech Lane, Silicon Valley, CA',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/johndoe', 'twitter' => '@johndoe']),
            ],
            [
                'name' => 'Jane Smith',
                'company_name' => 'Global Finance Corp.',
                'email' => 'jane.smith@globalfinance.com',
                'phone' => '089876543210',
                'sector_name' => 'Finance',
                'address' => '456 Wall Street, New York, NY',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/janesmith']),
            ],
            [
                'name' => 'Peter Jones',
                'company_name' => 'MediCare Hospital',
                'email' => 'peter.jones@medicare.com',
                'phone' => '087654321098',
                'sector_name' => 'Healthcare',
                'address' => '789 Health Ave, Medical City, TX',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/peterjones']),
            ],
            [
                'name' => 'Sarah Connor',
                'company_name' => 'Retail Express',
                'email' => 'sarah.connor@retailexpress.com',
                'phone' => '082109876543',
                'sector_name' => 'Retail',
                'address' => '101 Shopping Mall, City Center, WA',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/sarahconnor', 'instagram' => '@sarahconnor']),
            ],
            [
                'name' => 'David Lee',
                'company_name' => 'EduPro Systems',
                'email' => 'david.lee@edupro.com',
                'phone' => '085678901234',
                'sector_name' => 'Education',
                'address' => '202 University Blvd, Knowledge Town, MA',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/davidlee']),
            ],
            [
                'name' => 'Maria Garcia',
                'company_name' => 'Real Estate Plus',
                'email' => 'maria.garcia@realestateplus.com',
                'phone' => '083456789012',
                'sector_name' => 'Real Estate',
                'address' => '303 Property Ave, Real Estate City, FL',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/mariagarcia', 'facebook' => 'facebook.com/mariagarcia']),
            ],
            [
                'name' => 'Alex Chen',
                'company_name' => 'Logistics Solutions',
                'email' => 'alex.chen@logistics.com',
                'phone' => '084567890123',
                'sector_name' => 'Transportation',
                'address' => '404 Transport St, Logistics Hub, CA',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/alexchen']),
            ],
            [
                'name' => 'Lisa Wong',
                'company_name' => 'Manufacturing Pro',
                'email' => 'lisa.wong@manufacturingpro.com',
                'phone' => '086789012345',
                'sector_name' => 'Manufacturing',
                'address' => '505 Factory Blvd, Industrial Zone, TX',
                'social_media' => json_encode(['linkedin' => 'linkedin.com/in/lisawong']),
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
                'social_media' => $data['social_media'],
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
                    'deadline_days_ahead' => 10,
                    'notes' => 'New lead identified, initial email sent for Premium Software License.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Consulting Hours Package',
                    'contact_name' => 'Jane Smith',
                    'qty' => 3,
                    'deadline_days_ahead' => 18,
                    'notes' => 'Follow-up call scheduled. Client interested in a 3-hour consulting package.',
                ],
                [
                    'column_name' => 'NEGOTIATION',
                    'product_name' => 'Custom Software Development',
                    'contact_name' => 'Peter Jones',
                    'qty' => 1,
                    'deadline_days_ahead' => 25,
                    'notes' => 'Proposal submitted for custom software. Negotiation on scope and price in progress.',
                ],
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Basic Support Plan',
                    'contact_name' => 'Sarah Connor',
                    'qty' => 1,
                    'deadline_days_ahead' => 5,
                    'notes' => 'Deal closed for basic support plan. Invoice sent.',
                ],
                [
                    'column_name' => 'PROSPECTING',
                    'product_name' => 'Enterprise CRM Solution',
                    'contact_name' => 'David Lee',
                    'qty' => 1,
                    'deadline_days_ahead' => 28,
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
                [
                    'column_name' => 'NEGOTIATION',
                    'product_name' => 'Cloud Migration Service',
                    'contact_name' => 'Maria Garcia',
                    'qty' => 1,
                    'deadline_days_ahead' => 20,
                    'notes' => 'Cloud migration proposal sent. Client reviewing technical specifications.',
                ],
                [
                    'column_name' => 'PROSPECTING',
                    'product_name' => 'Data Analytics Platform',
                    'contact_name' => 'Alex Chen',
                    'qty' => 1,
                    'deadline_days_ahead' => 30,
                    'notes' => 'Initial contact regarding data analytics needs. Scheduled discovery call.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Enterprise CRM Solution',
                    'contact_name' => 'Lisa Wong',
                    'qty' => 1,
                    'deadline_days_ahead' => 15,
                    'notes' => 'Follow-up meeting scheduled. Client interested in CRM for manufacturing processes.',
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
                    'deadline_days_ahead' => 20,
                    'notes' => 'Successfully closed deal for two Premium Software Licenses.',
                ],
                [
                    'column_name' => 'JUNK',
                    'product_name' => 'Basic Support Plan',
                    'contact_name' => 'Jane Smith',
                    'qty' => 1,
                    'deadline_days_ahead' => -5,
                    'notes' => 'Client decided not to proceed after initial contact. Marked as junk.',
                ],
                [
                    'column_name' => 'NEGOTIATION',
                    'product_name' => 'Consulting Hours Package',
                    'contact_name' => 'Peter Jones',
                    'qty' => 5,
                    'deadline_days_ahead' => 15,
                    'notes' => 'Ongoing negotiation from last month. Client requested revised quote.',
                ],
                [
                    'column_name' => 'CONTACTING',
                    'product_name' => 'Enterprise CRM Solution',
                    'contact_name' => 'John Doe',
                    'qty' => 1,
                    'deadline_days_ahead' => 28,
                    'notes' => 'First contact regarding CRM. Sent initial information pack.',
                ],
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Custom Software Development',
                    'contact_name' => 'Sarah Connor',
                    'qty' => 1,
                    'deadline_days_ahead' => 12,
                    'notes' => 'Custom development project signed off in May.',
                ],
                [
                    'column_name' => 'DEALING',
                    'product_name' => 'Cloud Migration Service',
                    'contact_name' => 'Alex Chen',
                    'qty' => 1,
                    'deadline_days_ahead' => 8,
                    'notes' => 'Cloud migration project completed successfully.',
                ],
            ]
        );

        // --- 6. Seed default admin user ---
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => Carbon::now(),
        ]);

        // --- 7. Seed default sales user ---
        $salesUser = User::create([
            'name' => 'Sales User',
            'email' => 'sales@example.com',
            'password' => bcrypt('password'),
            'role' => 'sales',
            'email_verified_at' => Carbon::now(),
        ]);

        $this->command->info('Users seeded successfully!');
        $this->command->info('Database seeding completed!');
        $this->command->info('Default login credentials:');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Sales: sales@example.com / password');
    }

    /**
     * Clear existing data before seeding
     */
    protected function clearExistingData(): void
    {
        $this->command->info('Clearing existing data...');
        
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear tables in reverse dependency order
        DB::table('transactions')->truncate();
        DB::table('contacts')->truncate();
        DB::table('products')->truncate();
        DB::table('sectors')->truncate();
        DB::table('columns')->truncate();
        DB::table('users')->truncate();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Existing data cleared successfully!');
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
            // Validate that all required IDs exist
            if (!isset($productIds[$data['product_name']])) {
                $this->command->error("Product '{$data['product_name']}' not found. Skipping transaction.");
                continue;
            }
            
            if (!isset($contactIds[$data['contact_name']])) {
                $this->command->error("Contact '{$data['contact_name']}' not found. Skipping transaction.");
                continue;
            }
            
            if (!isset($columnIds[$data['column_name']])) {
                $this->command->error("Column '{$data['column_name']}' not found. Skipping transaction.");
                continue;
            }

            // Retrieve product price based on product name
            $productPrice = DB::table('products')->where('id', $productIds[$data['product_name']])->value('price');
            $grandTotal = $productPrice * $data['qty'];

            // Calculate created_at and updated_at to be within the specified month range
            $createdAt = $baseDate->copy()->addDays(rand(0, $baseDate->daysInMonth - 1))
                                  ->setTime(rand(9, 17), rand(0, 59), rand(0, 59));

            // updated_at will be after created_at, but not later than deadline (if positive)
            $updatedAt = $createdAt->copy()->addDays(rand(0, floor($data['deadline_days_ahead'] > 0 ? $data['deadline_days_ahead'] * 0.8 : 0)))
                                  ->addHours(rand(1,5))
                                  ->addMinutes(rand(1,59));

            // Ensure updated_at is at least equal to created_at
            if ($updatedAt->lessThan($createdAt)) {
                $updatedAt = $createdAt->copy();
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
                'deadline' => $baseDate->copy()->addDays($data['deadline_days_ahead']),
                'notes' => $data['notes'],
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ]);
        }

        $this->command->info("Transactions for {$description} seeded successfully!");
    }
}
