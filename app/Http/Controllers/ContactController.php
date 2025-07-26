<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Sector;
use App\Models\Column;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ContactImport;
use Illuminate\Validation\Rule;



class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index(): JsonResponse
    // {
    //     // Eager load relasi 'sector' untuk menghindari N+1 query problem
    //     $contact = Contact::with('sector')->get();
    //     return response()->json($contact);

    // }

    // public function index()
    // {
    //     // Eager load relasi 'sector' untuk menghindari N+1 query problem
    //    $contacts = Contact::with('sector')
    //     ->latest() // sama dengan orderBy('created_at', 'desc')
    //     ->get();

    //     // Assuming you have a way to get available columns for transactions.
    //     // This could be from a 'Column' model, a config, or a hardcoded array.
    //     // For demonstration, let's assume a 'Column' model exists.
    //     // $availableColumns = Column::all(); // Fetch all columns

    //     return Inertia::render('Contact/index', [
    //         'contacts' => $contacts,
    //         // 'availableColumns' => $availableColumns,
    //         // You can pass other props like auth user if needed, as per your original code
    //         // 'auth' => [
    //         //     'user' => auth()->user(),
    //         // ],
    //     ]);
    // }

//     public function index()
// {
//     $contacts = Contact::with('sector')->latest()->get();
//     $sectors = Sector::select('id', 'name')->get(); // Ambil data sektor

//     return Inertia::render('Contact/index', [
//         'contacts' => $contacts,
//         'sectors' => $sectors, // ⬅️ Kirim ke frontend
//     ]);
// }
public function index()
{
    $contacts = Contact::with('sector')->latest()->get();
    $sectors = Sector::select('id', 'name', 'bg_color', 'text_color')->get(); // optional warna
    $columns = Column::select('id', 'name')->get(); // Ambil semua column

    return Inertia::render('Contact/index', [
        'contacts' => $contacts,
        'sectors' => $sectors,
        'columns' => $columns, // ⬅️ kirim ke frontend
    ]);
}

    public function data(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       // Get the total count of contacts
    $contactCount = Contact::count();

    // You can also get other data if needed, for example, the sum of a 'value' column
    // $contactValueSum = Contact::sum('value_column_name'); // Replace 'value_column_name'

    return response()->json([
        'totalContacts' => $contactCount,
        // You can add other data here as well, e.g.:
        // 'totalContactValue' => $contactValueSum,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    //  public function store(Request $request): JsonResponse
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'nullable|string|email|max:255|unique:contacts,email',
    //         'company_name' => 'nullable|string|max:255',
    //         'phone' => 'nullable|string|max:255',
    //         // 'social_media' => 'nullable|string|max:255',
    //         'social_media' => 'nullable|url|max:255',
    //         'sector_id' => 'required|exists:sectors,id', // Memastikan sector_id ada di tabel sectors
    //         'address' => 'nullable|string|max:1000',
    //     ]);

    //     $contact = Contact::create($validatedData);
    //     $contact->load('sector');



    //     return response()->json([
    //         'message' => 'Company created successfully.',
    //         'contact' => $contact
    //     ], 201); // 201 Created
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function show(string $id): JsonResponse
    // {
    //     $contact = Contact::with('sector')->findOrFail($id);
    //     return response()->json($contact);
    // }

    // /**
    //  * Display the specified resource.
    //  */
    // public function update (Request $request, string $id): JsonResponse
    // {
    //     $contact = Contact::findOrFail($id);

    //     $validatedData = $request->validate([
    //         'name' => 'sometimes|required|string|max:255',
    //         'email' => 'nullable|string|email|max:255|unique:contacts,email,' . $contact->id,
    //         'company_name' => 'nullable|string|max:255',
    //         'phone' => 'nullable|string|max:255',
    //         'social_media' => 'nullable|url|max:255',
    //         'sector_id' => 'required|exists:sectors,id',
    //         'address' => 'nullable|string|max:1000',
    //     ]);

    //     $contact->update($validatedData);

    //     // Muat ulang dengan relasi sector jika perlu untuk respons
    //     $contact->load('sector');

    //     return response()->json([
    //         'message' => 'Contact updated successfully.',
    //         'contact' => $contact
    //     ]);
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // // public function destroy(string $id): JsonResponse
    // // {
    // //     $contact = Contact::findOrFail($id);
    // //     $contact->delete(); // Menggunakan soft delete

    // //     return response()->json(['message' => 'contact deleted successfully.']);
    // // }

    // public function destroy($id)
    // {
    //     $contact = Contact::findOrFail($id);
    //     $contact->delete();

    //     return response()->json([
    //         'message' => 'Kontak berhasil dihapus.',
    //     ]);
    // }


    // public function store(Request $request): JsonResponse
    // {

    //     // Di controller
    //     Log::info('CSRF token from request: ' . $request->header('X-CSRF-TOKEN'));
    //     Log::info('Session token: ' . session()->token());

    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255',
    //             'email' => 'nullable|string|email|max:255|unique:contacts,email',
    //             'company_name' => 'nullable|string|max:255',
    //             'phone' => 'nullable|string|max:255',
    //             'social_media' => 'nullable|url|max:255',
    //             'sector_id' => 'required|exists:sectors,id', // Memastikan sector_id ada di tabel sectors
    //             'address' => 'nullable|string|max:1000',
    //         ]);

    //         $contact = Contact::create($validatedData);
    //         $contact->load('sector');

    //         return response()->json([
    //             'message' => 'Contact created successfully.',
    //             'contact' => $contact
    //         ], 201); // 201 Created
    //     } catch (ValidationException $e) {
    //         Log::error('Validation error when storing new contact: ' . json_encode($e->errors()));
    //         return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
    //     } catch (\Exception $e) {
    //         Log::error('Error storing new contact: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
    //         return response()->json(['message' => 'An unexpected error occurred while adding the contact.', 'error' => $e->getMessage()], 500);
    //     }
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    // public function show(string $id): JsonResponse
    // {
    //     $contact = Contact::with('sector')->findOrFail($id);
    //     return response()->json($contact);
    // }


//     public function store(Request $request): RedirectResponse
// {
//     Log::info('CSRF token from request: ' . $request->header('X-CSRF-TOKEN'));
//     Log::info('Session token: ' . session()->token());

//     try {
//         $validatedData = $request->validate([
//             'name' => 'required|string|max:255',
//             'email' => 'nullable|string|email|max:255|unique:contacts,email',
//             'company_name' => 'nullable|string|max:255',
//             'phone' => 'nullable|string|max:255',
//             'social_media' => 'nullable|url|max:255',
//             'sector_id' => 'required|exists:sectors,id',
//             'address' => 'nullable|string|max:1000',
//         ]);


//         $contact = Contact::create($validatedData);
//         $contact->load('sector');

//         return redirect()->back()->with('success', 'Kontak berhasil ditambahkan.');
//     } catch (ValidationException $e) {
//         Log::error('Validation error when storing new contact: ' . json_encode($e->errors()));
//         return redirect()->back()->withErrors($e->errors())->withInput();
//     } catch (\Exception $e) {
//         Log::error('Error storing new contact: ' . $e->getMessage());
//         return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan kontak.');
//     }
// }
// public function store(Request $request): RedirectResponse
// {
//     Log::info('CSRF token from request: ' . $request->header('X-CSRF-TOKEN'));
//     Log::info('Session token: ' . session()->token());

//     try {
//         $messages = [
//             'name.required' => 'Nama wajib diisi.',
//             'company_name.required' => 'Perusahaan wajib diisi.',
//             'email.email' => 'Format email tidak valid.',
//             'email.unique' => 'Email sudah digunakan.',
//             'company_name.max' => 'Nama perusahaan maksimal 255 karakter.',
//             'phone.max' => 'Nomor telepon maksimal 255 karakter.',
//             'social_media.url' => 'Format URL sosial media tidak valid.',
//             'social_media.max' => 'Sosial media maksimal 255 karakter.',
//             'sector_id.required' => 'Sektor wajib dipilih.',
//             'sector_id.exists' => 'Sektor yang dipilih tidak valid.',
//             'address.max' => 'Alamat maksimal 1000 karakter.',
//         ];

//         $rules = [
//             'name' => 'required|string|max:255',
//             'email' => 'nullable|string|email|max:255|unique:contacts,email',
//             'company_name' => 'required|string|max:255',
//             'phone' => 'nullable|string|max:255',
//             'social_media' => 'nullable|url|max:255',
//             'sector_id' => 'required|exists:sectors,id',
//             'address' => 'nullable|string|max:1000',
//         ];

//         $validatedData = $request->validate($rules, $messages);

//         $contact = Contact::create($validatedData);
//         $contact->load('sector');

//         return redirect()->back()->with('success', 'Kontak berhasil ditambahkan.');
//     } catch (ValidationException $e) {
//         Log::error('Validation error when storing new contact: ' . json_encode($e->errors()));
//         return redirect()->back()->withErrors($e->errors())->withInput();
//     } catch (\Exception $e) {
//         Log::error('Error storing new contact: ' . $e->getMessage());
//         return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan kontak.');
//     }
// }

public function store(Request $request): RedirectResponse
    {
        // Log CSRF tokens (ini untuk debugging, bisa dihapus di produksi)
        Log::info('CSRF token from request: ' . $request->header('X-CSRF-TOKEN'));
        Log::info('Session token: ' . session()->token());

        try {
            // Trim spasi email jika ada, sebelum validasi
            if ($request->has('email') && is_string($request->email)) {
                $request->merge([
                    'email' => trim($request->email),
                ]);
            }

            $messages = [
                'name.required' => 'Nama wajib diisi.',
                'company_name.required' => 'Perusahaan wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah digunakan.', // Pesan ini akan muncul jika email aktif sudah ada
                'company_name.max' => 'Nama perusahaan maksimal 255 karakter.',
                'phone.max' => 'Nomor telepon maksimal 255 karakter.',
                'social_media.url' => 'Format URL sosial media tidak valid.',
                'social_media.max' => 'Sosial media maksimal 255 karakter.',
                'sector_id.required' => 'Sektor wajib dipilih.',
                'sector_id.exists' => 'Sektor yang dipilih tidak valid.',
                'address.max' => 'Alamat maksimal 1000 karakter.',
            ];

            $rules = [
                'name' => 'required|string|max:255',
                'email' => [
                    'nullable', // Email bisa kosong/null
                    'string',
                    'email',
                    'max:255',
                    // MODIFIKASI PENTING DI SINI:
                    // Cek keunikan hanya pada kontak yang tidak terhapus (aktif).
                    Rule::unique('contacts', 'email')->where(function ($query) {
                        $query->whereNull('deleted_at');
                    }),
                ],
                'company_name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:255',
                'social_media' => 'nullable|url|max:255',
                'sector_id' => 'required|exists:sectors,id',
                'address' => 'nullable|string|max:1000',
            ];

            $validatedData = $request->validate($rules, $messages);

            // Buat kontak baru dengan data yang sudah divalidasi
            $contact = Contact::create($validatedData);
            $contact->load('sector'); // Muat relasi 'sector' jika diperlukan

            return redirect()->back()->with('success', 'Kontak berhasil ditambahkan.');
        } catch (ValidationException $e) {
            // Tangani error validasi
            Log::error('Validation error when storing new contact: ' . json_encode($e->errors()));
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            // Tangani error umum lainnya
            Log::error('Error storing new contact: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan kontak.');
        }
    }

    /**
     * Display the specified resource.
     */
    // public function update (Request $request, string $id): JsonResponse
    // {
    //     try {
    //         $contact = Contact::findOrFail($id);

    //         $validatedData = $request->validate([
    //             'name' => 'sometimes|required|string|max:255',
    //             'email' => 'nullable|string|email|max:255|unique:contacts,email,' . $contact->id,
    //             'company_name' => 'nullable|string|max:255',
    //             'phone' => 'nullable|string|max:255',
    //             'social_media' => 'nullable|url|max:255',
    //             'sector_id' => 'required|exists:sectors,id',
    //             'address' => 'nullable|string|max:1000',
    //         ]);

    //         $contact->update($validatedData);

    //         // Muat ulang dengan relasi sector jika perlu untuk respons
    //         $contact->load('sector');

    //         return response()->json([
    //             'message' => 'Contact updated successfully.',
    //             'contact' => $contact
    //         ]);
    //     } catch (ValidationException $e) {
    //         Log::error('Validation error when updating contact: ' . json_encode($e->errors()));
    //         return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
    //     } catch (ModelNotFoundException $e) {
    //         Log::error('Contact not found during update: ' . $e->getMessage());
    //         return response()->json(['message' => 'Contact not found.', 'error' => $e->getMessage()], 404);
    //     } catch (\Exception $e) {
    //         Log::error('Error updating contact: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
    //         return response()->json(['message' => 'An unexpected error occurred while updating the contact.', 'error' => $e->getMessage()], 500);
    //     }
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function destroy($id)
    // {
    //     try {
    //         $contact = Contact::findOrFail($id);
    //         $contact->delete();

    //         return response()->json([
    //             'message' => 'Kontak berhasil dihapus.',
    //         ]);
    //     } catch (ModelNotFoundException $e) {
    //         Log::error('Contact not found during deletion: ' . $e->getMessage());
    //         return response()->json(['message' => 'Contact not found.', 'error' => $e->getMessage()], 404);
    //     } catch (\Exception $e) {
    //         Log::error('Error deleting contact: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
    //         return response()->json(['message' => 'An unexpected error occurred while deleting the contact.', 'error' => $e->getMessage()], 500);
    //     }
    // }

//     public function update(Request $request, string $id): RedirectResponse
// {
//     try {
//         $contact = Contact::findOrFail($id);

//         $validatedData = $request->validate([
//             'name' => 'sometimes|required|string|max:255',
//             'email' => 'nullable|string|email|max:255|unique:contacts,email,' . $contact->id,
//             'company_name' => 'nullable|string|max:255',
//             'phone' => 'nullable|string|max:255',
//             'social_media' => 'nullable|url|max:255',
//             'sector_id' => 'required|exists:sectors,id',
//             'address' => 'nullable|string|max:1000',
//         ]);

//         $contact->update($validatedData);

//         return Redirect::back()->with('success', 'Kontak berhasil diperbarui.');
//     } catch (ValidationException $e) {
//         return Redirect::back()->withErrors($e->errors())->withInput();
//     } catch (ModelNotFoundException $e) {
//         return Redirect::back()->with('error', 'Kontak tidak ditemukan.');
//     } catch (\Exception $e) {
//         return Redirect::back()->with('error', 'Terjadi kesalahan saat memperbarui kontak.');
//     }
// }

public function update(Request $request, $id): RedirectResponse
    {
        try {
            $contact = Contact::findOrFail($id);

            if ($request->has('email') && is_string($request->email)) {
                $request->merge([
                    'email' => trim($request->email),
                ]);
            }

            $messages = [
                'name.required' => 'Nama wajib diisi.',
                'company_name.required' => 'Perusahaan wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah digunakan.', // Pesan ini akan muncul jika email aktif sudah ada
                'company_name.max' => 'Nama perusahaan maksimal 255 karakter.',
                'phone.max' => 'Nomor telepon maksimal 255 karakter.',
                'social_media.url' => 'Format URL sosial media tidak valid.',
                'social_media.max' => 'Sosial media maksimal 255 karakter.',
                'sector_id.required' => 'Sektor wajib dipilih.',
                'sector_id.exists' => 'Sektor yang dipilih tidak valid.',
                'address.max' => 'Alamat maksimal 1000 karakter.',
            ];

            $rules = [
                'name' => 'required|string|max:255',
                'email' => [
                    'nullable',
                    'string',
                    'email',
                    'max:255',
                    // MODIFIKASI PENTING DI SINI:
                    Rule::unique('contacts', 'email')
                        ->ignore($contact->id) // Abaikan ID kontak yang sedang diupdate
                        ->where(function ($query) {
                            $query->whereNull('deleted_at'); // Hanya cek email yang tidak terhapus (aktif)
                        }),
                ],
                'company_name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:255',
                'social_media' => 'nullable|url|max:255',
                'sector_id' => 'required|exists:sectors,id',
                'address' => 'nullable|string|max:1000',
            ];

            $validatedData = $request->validate($rules, $messages);

            $contact->update($validatedData);
            $contact->load('sector');

            return redirect()->back()->with('success', 'Kontak berhasil diperbarui.');

        } catch (ValidationException $e) {
            Log::error('Validasi gagal saat edit kontak: ' . json_encode($e->errors()));
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Gagal update kontak: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui kontak.');
        }
    }
    /**
     * Update the specified resource in storage.
     */


    // public function destroy(string $id)
    // {
    //     $contact = Contact::find($id);

    //     if (!$contact) {
    //         return response()->json(['message' => 'Contact not found'], 404);
    //     }

    //     $contact->delete();

    //     return response()->json(['message' => 'Contact deleted successfully'], 200);
    // }

    public function destroy($id)
{
    try {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return Redirect::back()->with('success', 'Kontak berhasil dihapus.');
    } catch (ModelNotFoundException $e) {
        return Redirect::back()->with('error', 'Kontak tidak ditemukan.');
    } catch (\Exception $e) {
        return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus kontak.');
    }
}

    /**
     * Update the specified resource in storage.
     */

//      public function addleads(Request $request)
// {
//     $validator = Validator::make($request->all(), [
//         'contact_id' => 'required|uuid|exists:contacts,id',
//         'column_id' => 'required|uuid|exists:columns,id',
//     ]);

//     if ($validator->fails()) {
//         return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
//     }

//     // ---------- Perubahan Logika di sini ----------
//     // Cek apakah kontak sudah memiliki transaksi lain
//     $existingTransactionForContact = Transaction::where('contact_id', $request->contact_id)->first();

//     if ($existingTransactionForContact) {
//         // Opsi 1: Hapus transaksi lama (pindah kontak)
//         // $existingTransactionForContact->delete();
//         // Atau, update transaksi lama ke kolom baru
//         // $existingTransactionForContact->update(['column_id' => $request->column_id]);
//         // return response()->json(['message' => 'Kontak berhasil dipindahkan ke kolom baru.', 'transaction' => $existingTransactionForContact->load(['contact', 'column'])], 200);

//         // Opsi 2: Berikan error karena kontak sudah ada di kolom lain
//         return response()->json(['message' => 'Kontak ini sudah berada di kolom lain. Hapus dari kolom sebelumnya terlebih dahulu.'], 409);
//     }

//     // Jika tidak ada transaksi lama, atau jika Anda memilih untuk menghapus/memperbarui yang lama,
//     // maka buat transaksi baru
//     $transaction = Transaction::create([
//         'contact_id' => $request->contact_id,
//         'column_id' => $request->column_id,
//     ]);

//     $transaction->load(['contact', 'column']);
//     return response()->json(['message' => 'Transaction created successfully', 'transaction' => $transaction], 201);
// }

// public function addleads(Request $request)
//     {
//         // $validator = Validator::make($request->all(), [
//         //     'contact_id' => 'required|uuid|exists:contacts,id',
//         //     'column_id' => 'required|uuid|exists:columns,id',
//         // ]);

//         // if ($validator->fails()) {
//         //     return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
//         // }

//         // // Karena ID adalah UUID dan Anda ingin memungkinkan penambahan berulang,
//         // // kita akan selalu membuat entri transaksi baru.
//         // $transaction = Transaction::create([
//         //     'contact_id' => $request->contact_id,
//         //     'column_id' => $request->column_id,
//         //     // Anda bisa menambahkan kolom lain di sini jika diperlukan
//         //     // untuk membedakan transaksi yang "sama", misalnya:
//         //     // 'notes' => 'Ditambahkan dari menu aksi',
//         //     // 'transaction_date' => now(), // Jika Anda ingin timestamp spesifik per transaksi
//         // ]);

//         // // Muat relasi jika diperlukan untuk respons
//         // $transaction->load(['contact', 'column']);

//         // return response()->json([
//         //     'message' => 'Transaksi baru berhasil ditambahkan.',
//         //     'transaction' => $transaction
//         // ], 201); // Kode status 201 Created menunjukkan sumber daya baru telah dibuat


//         try {
//             // Validate incoming request data
//             $request->validate([
//                 'column_id' => 'required|uuid|exists:columns,id', // Pastikan kolom ada
//                 'contact_id' => 'required|uuid|exists:contacts,id', // Kontak HARUS ada
//                 'name' => 'required|string|max:255', // Nama kontak (dari pilihan dropdown)
//                 'company_name' => 'nullable|string|max:255', // Nama perusahaan (dari pilihan dropdown)
//                 'product_id' => 'nullable|uuid|exists:products,id', // <-- DIUBAH: Product ID sekarang nullable
//                 'product_name' => 'nullable|string|max:255', // <-- DIUBAH: Product Name sekarang nullable
//                 'current_price' => 'nullable|numeric',
//                 'qty' => 'nullable|integers|min:0',
//                 'deadline' => 'nullable|date',
//                 'notes' => 'nullable|string|max:1000',
//             ]);

//             // Retrieve existing Contact based on provided ID
//             $contact = Contact::findOrFail($request->contact_id);

//             // Retrieve Product (use find() instead of findOrFail() for nullable)
//             $product = null;
//             if ($request->product_id) { // Hanya cari produk jika product_id diberikan
//                 $product = Product::find($request->product_id);
//                 // Jika product_id diberikan tapi produk tidak ditemukan, bisa return error
//                 if (!$product) {
//                     return response()->json(['message' => 'The selected product could not be found.'], 404);
//                 }
//             }


//             // Optional: Update contact's name/company_name if frontend sends different values
//             if ($contact->name !== $request->name) {
//                 $contact->name = $request->name;
//                 $contact->save();
//             }
//             if ($request->company_name !== null && $contact->company_name !== $request->company_name) {
//                 $contact->company_name = $request->company_name;
//                 $contact->save();
//             }

//             // Optional: Update product's name if frontend sends a different value
//             // Hanya lakukan ini jika produk ada
//             if ($product && $product->name !== $request->product_name) {
//                 $product->name = $request->product_name;
//                 $product->save();
//             }

//             // Calculate grand total, safely handling nullable product/price
//             $currentPrice = $request->current_price ?? ($product ? $product->price : 0); // Jika produk null, harga default 0
//             // $qty = $request->qty;
//             $qty = $request->filled('qty') ? (int) $request->qty : null;
//             // $grandTotal = $currentPrice * $qty;
//             $grandTotal = ($currentPrice ?? 0) * ($qty ?? 0);


//             // Create the Transaction
//             $transaction = Transaction::create([
//                 'column_id' => $request->column_id,
//                 'product_id' => $product ? $product->id : null, // Store null if product is null
//                 'contact_id' => $contact->id,
//                 'current_price' => $currentPrice,
//                 'qty' => $qty,
//                 'grand_total' => $grandTotal,
//                 'deadline' => $request->deadline,
//                 'notes' => $request->notes,
//                 // 'id' akan otomatis dibuat oleh model Transaction (HasUuids)
//             ]);

//             // Reload contact relation with sector for response
//             $contact->load('sector');

//             // Prepare lead data for frontend response
//             $newLeadData = [
//                 'id' => $transaction->id, // Ambil ID yang sudah dibuat oleh model
//                 'sector' => $contact->sector->name ?? null,
//                 'sectorColor' => $contact->sector->bg_color ?? 'bg-gray-400',
//                 'name' => $contact->name,
//                 'company_name' => $contact->company_name,
//                 'product' => $product ? $product->name : ($request->product_name ?? null), // Jika produk null, gunakan product_name dari request atau null
//                 'product_id' => $product ? $product->id : null, // Jika produk null, gunakan null
//                 'deadline' => $transaction->deadline ? $transaction->deadline->format('Y-m-d') : null,
//                 'assigneeInitials' => strtoupper(substr($contact->name, 0, 1) . ($product ? substr($product->name, 0, 1) : '')), // Sesuaikan jika product null
//                 'assigneeBgColor' => 'bg-blue-500',
//                 'columnId' => $transaction->column_id,
//                 'notes' => $transaction->notes,
//                 'created_at' => $transaction->created_at->toISOString(),
//                 'updated_at' => $transaction->updated_at->toISOString(),
//                 'current_price' => (float) $transaction->current_price,
//                 'qty' => (int) $transaction->qty,
//                 'grand_total' => (float) $transaction->grand_total,
//                 'contact_id' => $contact->id,
//             ];

//             return response()->json($newLeadData, 201);

//         } catch (ValidationException $e) {
//             Log::error('Validation error when storing new lead: ' . json_encode($e->errors()));
//             return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
//         } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
//             // Ini akan menangani jika contact_id tidak ditemukan (karena findOrFail)
//             Log::error('Dependent model not found during lead creation: ' . $e->getMessage());
//             return response()->json(['message' => 'The selected contact could not be found.', 'error' => $e->getMessage()], 404);
//         } catch (\Exception $e) {
//             Log::error('Error storing new lead: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
//             return response()->json(['message' => 'An unexpected error occurred while adding the lead.', 'error' => $e->getMessage()], 500);
//         }

//     }

// public function addleads(Request $request)
// {
//     try {
//         $validated = $request->validate([
//             'column_id' => 'required|uuid|exists:columns,id',
//             'contact_id' => 'required|uuid|exists:contacts,id',
//             'name' => 'required|string|max:255',
//             'company_name' => 'nullable|string|max:255',
//             'product_id' => 'nullable|uuid|exists:products,id',
//             'product_name' => 'nullable|string|max:255',
//             'current_price' => 'nullable|numeric',
//             'qty' => 'nullable|integer|min:0',
//             'discount_amount' => 'nullable|numeric|min:0',
//             'deadline' => 'nullable|date',
//             'notes' => 'nullable|string|max:1000',
//         ]);

//         $contact = Contact::findOrFail($validated['contact_id']);

//         $product = null;
//         if (!empty($validated['product_id'])) {
//             $product = Product::find($validated['product_id']);
//             if (!$product) {
//                 return response()->json(['message' => 'The selected product could not be found.'], 404);
//             }
//         }

//         if ($contact->name !== $validated['name']) {
//             $contact->name = $validated['name'];
//             $contact->save();
//         }
//         if (isset($validated['company_name']) && $contact->company_name !== $validated['company_name']) {
//             $contact->company_name = $validated['company_name'];
//             $contact->save();
//         }

//         if ($product && isset($validated['product_name']) && $product->name !== $validated['product_name']) {
//             $product->name = $validated['product_name'];
//             $product->save();
//         }

//         $currentPrice = $validated['current_price'] ?? ($product ? $product->price : 0);
//         $qty = isset($validated['qty']) ? (int)$validated['qty'] : 0;

//         $subtotal = $currentPrice * $qty;
//         $discount = $validated['discount_amount'] ?? 0;

//         // Pastikan discount tidak lebih besar dari subtotal
//         if ($discount > $subtotal) {
//             return response()->json(['message' => 'Discount amount cannot be greater than total price.'], 422);
//         }

//         $grandTotal = $subtotal - $discount;

//         $transaction = Transaction::create([
//             'column_id' => $validated['column_id'],
//             'product_id' => $product ? $product->id : null,
//             'contact_id' => $contact->id,
//             'current_price' => $currentPrice,
//             'qty' => $qty,
//             'discount_amount' => $discount,
//             'grand_total' => $grandTotal,
//             'deadline' => $validated['deadline'] ?? null,
//             'notes' => $validated['notes'] ?? null,
//         ]);

//         $contact->load('sector');

//         $newLeadData = [
//             'id' => $transaction->id,
//             'trx' => $transaction->trx,
//             'sector' => $contact->sector->name ?? null,
//             'sectorColor' => $contact->sector->bg_color ?? 'bg-gray-400',
//             'name' => $contact->name,
//             'company_name' => $contact->company_name,
//             'product' => $product ? $product->name : ($validated['product_name'] ?? null),
//             'product_id' => $product ? $product->id : null,
//             'deadline' => $transaction->deadline ? $transaction->deadline->format('Y-m-d') : null,
//             'assigneeInitials' => strtoupper(substr($contact->name, 0, 1) . ($product ? substr($product->name, 0, 1) : '')),
//             'assigneeBgColor' => 'bg-blue-500',
//             'columnId' => $transaction->column_id,
//             'notes' => $transaction->notes,
//             'created_at' => $transaction->created_at->toISOString(),
//             'updated_at' => $transaction->updated_at->toISOString(),
//             'current_price' => (float)$transaction->current_price,
//             'qty' => (int)$transaction->qty,
//             'discount_amount' => (float)$transaction->discount_amount,
//             'grand_total' => (float)$transaction->grand_total,
//             'contact_id' => $contact->id,
//         ];

//         return response()->json($newLeadData, 201);

//     } catch (ValidationException $e) {
//         Log::error('Validation error when storing new lead: ' . json_encode($e->errors()));
//         return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
//     } catch (ModelNotFoundException $e) {
//         Log::error('Dependent model not found during lead creation: ' . $e->getMessage());
//         return response()->json(['message' => 'The selected contact could not be found.', 'error' => $e->getMessage()], 404);
//     } catch (\Exception $e) {
//         Log::error('Error storing new lead: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
//         return response()->json(['message' => 'An unexpected error occurred while adding the lead.', 'error' => $e->getMessage()], 500);
//     }
// }


public function addleads(Request $request)
{
    try {
        $validated = $request->validate([
            'column_id' => 'required|uuid|exists:columns,id',
            'contact_id' => 'required|uuid|exists:contacts,id',
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'product_id' => 'nullable|uuid|exists:products,id',
            'product_name' => 'nullable|string|max:255',
            'current_price' => 'nullable|numeric',
            'qty' => 'nullable|integer|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $contact = Contact::findOrFail($validated['contact_id']);

        $product = null;
        if (!empty($validated['product_id'])) {
            $product = Product::find($validated['product_id']);
            if (!$product) {
                return redirect()->back()->withErrors(['product_id' => 'Produk tidak ditemukan.']);
            }
        }

        if ($contact->name !== $validated['name']) {
            $contact->name = $validated['name'];
            $contact->save();
        }
        if (isset($validated['company_name']) && $contact->company_name !== $validated['company_name']) {
            $contact->company_name = $validated['company_name'];
            $contact->save();
        }

        if ($product && isset($validated['product_name']) && $product->name !== $validated['product_name']) {
            $product->name = $validated['product_name'];
            $product->save();
        }

        $currentPrice = $validated['current_price'] ?? ($product ? $product->price : 0);
        $qty = isset($validated['qty']) ? (int)$validated['qty'] : 0;

        $subtotal = $currentPrice * $qty;
        $discount = $validated['discount_amount'] ?? 0;

        if ($discount > $subtotal) {
            return redirect()->back()->withErrors(['discount_amount' => 'Diskon tidak boleh lebih besar dari total harga.']);
        }

        $grandTotal = $subtotal - $discount;

        $transaction = Transaction::create([
            'column_id' => $validated['column_id'],
            'product_id' => $product ? $product->id : null,
            'contact_id' => $contact->id,
            'current_price' => $currentPrice,
            'qty' => $qty,
            'discount_amount' => $discount,
            'grand_total' => $grandTotal,
            'deadline' => $validated['deadline'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $contact->load('sector');

        $newLeadData = [
            'id' => $transaction->id,
            'trx' => $transaction->trx,
            'sector' => $contact->sector->name ?? null,
            'sectorColor' => $contact->sector->bg_color ?? 'bg-gray-400',
            'name' => $contact->name,
            'company_name' => $contact->company_name,
            'product' => $product ? $product->name : ($validated['product_name'] ?? null),
            'product_id' => $product ? $product->id : null,
            'deadline' => $transaction->deadline ? $transaction->deadline->format('Y-m-d') : null,
            'assigneeInitials' => strtoupper(substr($contact->name, 0, 1) . ($product ? substr($product->name, 0, 1) : '')),
            'assigneeBgColor' => 'bg-blue-500',
            'columnId' => $transaction->column_id,
            'notes' => $transaction->notes,
            'created_at' => $transaction->created_at->toISOString(),
            'updated_at' => $transaction->updated_at->toISOString(),
            'current_price' => (float)$transaction->current_price,
            'qty' => (int)$transaction->qty,
            'discount_amount' => (float)$transaction->discount_amount,
            'grand_total' => (float)$transaction->grand_total,
            'contact_id' => $contact->id,
        ];

        return redirect()->back()->with([
            'message' => 'Lead berhasil ditambahkan.',
            'newLeadData' => $newLeadData,
        ]);

    } catch (ValidationException $e) {
        Log::error('Validasi gagal saat menambahkan lead: ' . json_encode($e->errors()));
        return redirect()->back()->withErrors($e->errors())->withInput();
    } catch (ModelNotFoundException $e) {
        Log::error('Model tidak ditemukan saat menambahkan lead: ' . $e->getMessage());
        return redirect()->back()->withErrors(['contact_id' => 'Kontak yang dipilih tidak ditemukan.']);
    } catch (\Exception $e) {
        Log::error('Kesalahan saat menyimpan lead: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        return redirect()->back()->withErrors(['general' => 'Terjadi kesalahan saat menambahkan lead.']);
    }
}


// public function import(Request $request)
//     {
//         $request->validate([
//             'file' => 'required|mimes:xlsx,xls,csv|max:2048',
//         ]);

//         try {
//             Excel::import(new ContactImport, $request->file('file'));
//             return redirect()->back()->with('success', 'Kontak berhasil diimpor.');
//         } catch (\Exception $e) {
//             Log::error('Import error: ' . $e->getMessage());
//             return redirect()->back()->with('error', 'Gagal mengimpor kontak. Cek format file Anda.');
//         }
//     }
// public function import(Request $request)
// {
//     $request->validate([
//         'file' => 'required|mimes:xlsx,xls,csv|max:2048',
//     ]);

//     try {
//         Excel::import(new ContactImport, $request->file('file'));
//         return back()->with('success', 'Kontak berhasil diimpor.');
//     } catch (\Exception $e) {
//         Log::error('Import error: ' . $e->getMessage());

//         // Jika requestnya dari Inertia (AJAX), kembalikan response JSON
//         if ($request->expectsJson()) {
//             return response()->json(['message' => $e->getMessage()], 422);
//         }

//         return back()->with('error', $e->getMessage());
//     }
// }

public function import(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls,csv|max:2048',
    ]);

    try {
        Excel::import(new ContactImport, $request->file('file'));

        // Jika sukses, kembalikan redirect dengan flash message inertia
        return back()->with('success', 'Kontak berhasil diimpor.');
    } catch (\Exception $e) {
        Log::error('Import error: ' . $e->getMessage());

        // Gunakan withErrors agar ditangkap oleh props.errors di React
        return back()->withErrors([
            'message' => $e->getMessage(),
        ]);
    }
}
}
