<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'id' => (string) Str::uuid(), // Generate a UUID for the primary key
            'name' => 'Sales User',
            'email' => 'sales@tappp.link',
            'email_verified_at' => now(),
            'password' => Hash::make('sales@tappp.link'), // Hash the password
            'role' => 'sales',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Admin User
        DB::table('users')->insert([
            'id' => (string) Str::uuid(), // Generate a UUID for the primary key
            'name' => 'Admin User',
            'email' => 'admin@tappp.link',
            'email_verified_at' => now(),
            'password' => Hash::make('admin@tappp.link'), // Hash the password
            'role' => 'admin',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Sales User

        // You can add more users here if needed
        // For example, using a loop for multiple users:
        // for ($i = 1; $i <= 3; $i++) {
        //     DB::table('users')->insert([
        //         'id' => (string) Str::uuid(),
        //         'name' => 'Test User ' . $i,
        //         'email' => 'test' . $i . '@example.com',
        //         'email_verified_at' => now(),
        //         'password' => Hash::make('password'),
        //         'role' => 'sales', // Or 'admin'
        //         'remember_token' => Str::random(10),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);
        // }
    }
}
