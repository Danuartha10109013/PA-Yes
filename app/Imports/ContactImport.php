<?php

namespace App\Imports;

use App\Models\Contact;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\Sector;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

use Maatwebsite\Excel\Concerns\ToCollection;


// class ContactImport implements ToModel, WithHeadingRow
class ContactImport implements ToCollection, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    // public function model(array $row)
    // {
    //     return new Contact([
    //         //
    //     ]);
    // }

    //  public function model(array $row)
    // {
    //     $sectorName = trim($row['sector'] ?? '');

    //     if (empty($sectorName)) {
    //         throw new \Exception('Kolom sektor wajib diisi.');
    //     }

    //     $sector = Sector::firstOrCreate(
    //         ['name' => $sectorName],
    //         [
    //             'id' => Str::uuid(),
    //             'bg_color' => '#E0E0E0',
    //             'text_color' => '#000000'
    //         ]
    //     );

    //     return new Contact([
    //         'id' => Str::uuid(),
    //         'name' => $row['name'],
    //         'company_name' => $row['company_name'] ?? null,
    //         'email' => $row['email'] ?? null,
    //         'phone' => $row['phone'] ?? null,
    //         'social_media' => $row['social_media'] ?? null,
    //         'sector_id' => $sector->id,
    //         'address' => $row['address'] ?? null,
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        $duplicateEmails = [];

        foreach ($rows as $index => $row) {
            $email = trim($row['email'] ?? '');
            $name = trim($row['name'] ?? '');
            $sectorName = trim($row['sector'] ?? '');

            // Validasi wajib sektor
            if (empty($sectorName)) {
                throw new \Exception("Kolom sektor wajib diisi pada baris " . ($index + 2));
            }

            // Cek email duplikat di database
            if (!empty($email) && Contact::where('email', $email)->exists()) {
                $duplicateEmails[] = [
                    'row' => $index + 2,
                    'email' => $email,
                ];
                continue; // Skip simpan
            }

            // Ambil atau buat sektor
            $sector = Sector::firstOrCreate(
                ['name' => $sectorName],
                [
                    'id' => Str::uuid(),
                    'bg_color' => '#E0E0E0',
                    'text_color' => '#000000',
                ]
            );

            // Simpan kontak baru
            Contact::create([
                'id' => Str::uuid(),
                'name' => $name,
                'company_name' => $row['company_name'] ?? null,
                'email' => $email,
                'phone' => $row['phone'] ?? null,
                'social_media' => $row['social_media'] ?? null,
                'sector_id' => $sector->id,
                'address' => $row['address'] ?? null,
            ]);
        }

        if (!empty($duplicateEmails)) {
            $message = 'Email duplikat ditemukan: ';
            foreach ($duplicateEmails as $item) {
                $message .= "Baris {$item['row']} ({$item['email']}), ";
            }
            throw new \Exception(rtrim($message, ', '));
        }
    }
}
