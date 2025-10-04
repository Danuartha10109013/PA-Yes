<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Column;
use App\Models\Contact; // Pastikan model Contact diimpor
use App\Models\Product; // Pastikan model Product diimpor
use App\Models\Sector;  // Pastikan model Sector diimpor
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // Untuk UUID jika diperlukan
use Carbon\Carbon; // Import Carbon for date handling
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;



class TransactionController extends Controller
{

    //         public function updateLeadColumn(Request $request)
//     {
//         Log::info('Incoming updateLeadColumn request:', $request->all()); // Log all incoming request data

    //         try {
//             $validatedData = $request->validate([
//                 'leadId' => 'required|uuid|exists:transactions,id',
//                 'newColumnId' => 'required|uuid|exists:columns,id',
//             ]);

    //             // Log validated data to confirm it's correct
//             Log::info('Validated data:', $validatedData);

    //             $transaction = Transaction::findOrFail($validatedData['leadId']);
//             $newColumn = Column::findOrFail($validatedData['newColumnId']);

    //             Log::info("Attempting to move Transaction ID: {$transaction->id} from Column ID: {$transaction->column_id} to New Column ID: {$newColumn->id}");

    //             // Ensure 'column_id' is fillable in your Transaction model, or use forceFill/unguard if necessary
//             // For example, in app/Models/Transaction.php
//             // protected $fillable = ['column_id', /* other fillable fields */];
//             $transaction->column_id = $newColumn->id;
//             $transaction->save();

    //             Log::info('Lead column updated successfully for transaction ID: ' . $transaction->id);
//             return response()->json(['message' => 'Lead column updated successfully.'], 200);

    //         } catch (ValidationException $e) {
//             Log::warning('Validation error in updateLeadColumn:', ['errors' => $e->errors(), 'request_data' => $request->all()]);
//             return response()->json(['errors' => $e->errors(), 'message' => 'Validation Failed'], 422);
//         } catch (\Exception $e) {
//             Log::error('Error updating lead column: ' . $e->getMessage(), [
//                 'trace' => $e->getTraceAsString(),
//                 'request_data' => $request->all()
//             ]);
//             return response()->json(['message' => 'An error occurred while updating the lead column.'], 500);
//         }
//     }


    // public function index(Request $request)
// {
//     $now = now();
//     $sevenDaysAgo = now()->subDays(7); // Batas arsip 7 hari

    //     $query = DB::table('transactions')
//         ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
//         ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
//         ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
//         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')

    //         // Subquery untuk log terakhir
//         ->leftJoinSub(function ($query) {
//             $query->from('transaction_logs')
//                 ->select('id', 'transaction_id', 'user_id')
//                 ->whereIn('id', function ($sub) {
//                     $sub->from('transaction_logs as t2')
//                         ->selectRaw('MAX(id)')
//                         ->groupBy('transaction_id');
//                 });
//         }, 'actual_latest_log', function ($join) {
//             $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
//         })

    //         ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')

    //         ->select(
//             'transactions.id as id',
//             'transactions.trx',
//             'transactions.current_price',
//             'transactions.qty',
//             'transactions.discount_amount',
//             'transactions.grand_total',
//             'transactions.deadline',
//             'transactions.notes',
//             'transactions.created_at',
//             'transactions.updated_at',
//             'contacts.id as contact_id',
//             'contacts.name as contact_name',
//             'contacts.company_name',
//             'contacts.email as contact_email',
//             'contacts.phone as contact_phone',
//             'contacts.social_media as contact_social',
//             'contacts.address as contact_address',
//             'sectors.name as sector_name',
//             'sectors.bg_color as sector_color',
//             'products.id as product_id',
//             'products.name as product_name',
//             'columns.id as column_id',
//             'columns.name as column_name',
//             'users.name as last_user_name'
//         )
//         ->whereNull('transactions.deleted_at');

    //     // Filter arsip atau aktif berdasarkan updated_at (7 hari)
//     if ($request->query('show') === 'arsip') {
//         $query->whereIn('columns.name', ['DEALING', 'JUNK'])
//               ->where('transactions.updated_at', '<', $sevenDaysAgo);
//     } else {
//         $query->where(function ($q) use ($sevenDaysAgo) {
//             $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
//               ->orWhere(function ($sub) use ($sevenDaysAgo) {
//                   $sub->whereIn('columns.name', ['DEALING', 'JUNK'])
//                       ->where('transactions.updated_at', '>=', $sevenDaysAgo);
//               });
//         });
//     }

    //     // Format transaksi
//     $transactions = $query->get()->map(function ($transaction) {
//         $deadlineDate = $transaction->deadline
//             ? Carbon::parse($transaction->deadline)->format('Y-m-d')
//             : null;

    //         $lastUserInitials = null;
//         $lastUserBgColor = 'bg-gray-400';

    //         if (!empty($transaction->last_user_name)) {
//             $words = preg_split('/\s+/', trim($transaction->last_user_name));
//             if (count($words) >= 2) {
//                 $lastUserInitials = strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
//             } else {
//                 $lastUserInitials = strtoupper(substr($words[0], 0, 2));
//             }
//             $lastUserBgColor = 'bg-fuchsia-500';
//         }

    //         return [
//             'id' => $transaction->id,
//             'trx' => $transaction->trx,
//             'sector' => $transaction->sector_name ?? 'Unknown',
//             'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
//             'name' => $transaction->contact_name ?? 'N/A',
//             'company_name' => $transaction->company_name,
//             'email' => $transaction->contact_email ?? '-',
//             'phone' => $transaction->contact_phone ?? '-',
//             'social_media' => $transaction->contact_social ?? '-',
//             'address' => $transaction->contact_address ?? '-',
//             'product' => $transaction->product_name ?? 'N/A',
//             'deadline' => $deadlineDate,

    //             'assigneeInitials' => $lastUserInitials ?? '??',
//             'assigneeBgColor' => $lastUserBgColor,

    //             'columnId' => $transaction->column_id ?? 'unknown',
//             'current_price' => (float) $transaction->current_price,
//             'qty' => (int) $transaction->qty,
//             'discount_amount' => (int) $transaction->discount_amount,
//             'grand_total' => (float) $transaction->grand_total,
//             'notes' => $transaction->notes,
//             'created_at' => $transaction->created_at,
//             'updated_at' => $transaction->updated_at,
//             'contact_id' => $transaction->contact_id,
//             'product_id' => $transaction->product_id,
//             'lastUserInitials' => $lastUserInitials,
//             'lastUserBgColor' => $lastUserBgColor,
//         ];
//     });

    //     // Ambil kolom Kanban
//     $columns = Column::all();

    //     $kanbanData = $columns->map(function ($column) use ($transactions) {
//         return [
//             'id' => $column->id,
//             'title' => $column->name,
//             'leads' => $transactions->where('columnId', $column->id)->values(),
//         ];
//     });

    //     return response()->json($kanbanData);
// }




    // public function addleads(Request $request)
// {
//     try {
//         $validator = Validator::make($request->all(), [
//             'column_id'      => 'required|uuid|exists:columns,id',
//             'contact_id'     => 'required|uuid|exists:contacts,id',
//             'name'           => 'required|string|max:255',
//             'company_name'   => 'nullable|string|max:255',
//             'product_id'     => 'nullable|uuid|exists:products,id',
//             'product_name'   => 'nullable|string|max:255',
//             'current_price'  => 'nullable|numeric',
//             'qty'            => 'nullable|integer',
//             'deadline'       => 'nullable|date',
//             'notes'          => 'nullable|string|max:1000',
//         ]);

    //         if ($request->filled('product_id')) {
//             $validator->after(function ($validator) use ($request) {
//                 if ($request->current_price === null || $request->current_price < 0.01) {
//                     $validator->errors()->add('current_price', 'The current price must be at least 0.01.');
//                 }
//                 if ($request->qty === null || $request->qty <= 0) {
//                     $validator->errors()->add('qty', 'The quantity must be greater than 0.');
//                 }
//             });
//         }

    //         $validated = $validator->validate();

    //         $contact = Contact::findOrFail($validated['contact_id']);
//         $product = $validated['product_id'] ? Product::find($validated['product_id']) : null;

    //         // Update nama contact jika berubah
//         if ($validated['name'] !== $contact->name) {
//             $contact->name = $validated['name'];
//         }
//         if (isset($validated['company_name']) && $validated['company_name'] !== $contact->company_name) {
//             $contact->company_name = $validated['company_name'];
//         }
//         $contact->save();

    //         // Update nama produk jika ada
//         if ($product && $validated['product_name'] && $validated['product_name'] !== $product->name) {
//             $product->name = $validated['product_name'];
//             $product->save();
//         }

    //         // Hitung grand total
//         if ($validated['product_id']) {
//             $currentPrice = $validated['current_price'];
//             $qty = $validated['qty'];
//         } else {
//             $currentPrice = 0;
//             $qty = 0;
//         }

    //         $grandTotal = ($currentPrice * $qty);

    //         $transaction = Transaction::create([
//             'column_id'     => $validated['column_id'],
//             'product_id'    => $product?->id,
//             'contact_id'    => $contact->id,
//             'current_price' => $currentPrice,
//             'qty'           => $qty,
//             'grand_total'   => $grandTotal,
//             'deadline'      => $validated['deadline'] ?? null,
//             'notes'         => $validated['notes'] ?? null,
//             'created_by'    => Auth::id(),
//             'updated_by'    => Auth::id(),
//         ]);

    //         $contact->load('sector');

    //         return response()->json([
//             'id'               => $transaction->id,
//             'sector'           => $contact->sector->name ?? null,
//             'sectorColor'      => $contact->sector->bg_color ?? 'bg-gray-400',
//             'name'             => $contact->name,
//             'company_name'     => $contact->company_name,
//             'product'          => $product?->name ?? $validated['product_name'],
//             'product_id'       => $product?->id,
//             'deadline'         => optional($transaction->deadline)->format('Y-m-d'),
//             'assigneeInitials' => strtoupper(substr($contact->name, 0, 1) . ($product ? substr($product->name, 0, 1) : '')),
//             'assigneeBgColor'  => 'bg-blue-500',
//             'columnId'         => $transaction->column_id,
//             'notes'            => $transaction->notes,
//             'created_at'       => $transaction->created_at->toISOString(),
//             'updated_at'       => $transaction->updated_at->toISOString(),
//             'current_price'    => (float) $transaction->current_price,
//             'qty'              => (int) $transaction->qty,
//             'grand_total'      => (float) $transaction->grand_total,
//             'contact_id'       => $contact->id,
//         ], 201);

    //     } catch (ValidationException $e) {
//         return response()->json([
//             'message' => 'Validation failed',
//             'errors'  => $e->errors()
//         ], 422);
//     } catch (ModelNotFoundException $e) {
//         return response()->json([
//             'message' => 'Model not found',
//             'error'   => $e->getMessage()
//         ], 404);
//     } catch (\Exception $e) {
//         return response()->json([
//             'message' => 'Server error',
//             'error'   => $e->getMessage()
//         ], 500);
//     }
// }

public function addleads(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'column_id'      => 'required|uuid|exists:columns,id',
            'contact_id'     => 'required|uuid|exists:contacts,id',
            'company_name'   => 'nullable|string|max:255',
            'product_id'     => 'nullable|uuid|exists:products,id',
            'product_name'   => 'nullable|string|max:255',
            'current_price'  => 'nullable|numeric',
            'qty'            => 'nullable|integer',
            'deadline'       => 'nullable|date',
            'notes'          => 'nullable|string|max:1000',
        ]);

        // Validasi tambahan jika product dipilih
        if ($request->filled('product_id')) {
            $validator->after(function ($validator) use ($request) {
                if ($request->current_price === null || $request->current_price < 0.01) {
                    $validator->errors()->add('current_price', 'Harga harus minimal 0.01.');
                }
                if ($request->qty === null || $request->qty <= 0) {
                    $validator->errors()->add('qty', 'Jumlah harus lebih dari 0.');
                }
            });
        }

        $validated = $validator->validate();

        $contact = Contact::findOrFail($validated['contact_id']);
        $product = $validated['product_id'] ? Product::find($validated['product_id']) : null;

        // Update company name jika berubah
        if (isset($validated['company_name']) && $validated['company_name'] !== $contact->company_name) {
            $contact->company_name = $validated['company_name'];
            $contact->save();
        }

        // Update nama produk jika ada
        if ($product && $validated['product_name'] && $validated['product_name'] !== $product->name) {
            $product->name = $validated['product_name'];
            $product->save();
        }

        $currentPrice = $validated['product_id'] ? $validated['current_price'] : 0;
        $qty = $validated['product_id'] ? $validated['qty'] : 0;
        $grandTotal = $currentPrice * $qty;

        $transaction = Transaction::create([
            'column_id'     => $validated['column_id'],
            'product_id'    => $product?->id,
            'contact_id'    => $contact->id,
            'current_price' => $currentPrice,
            'qty'           => $qty,
            'grand_total'   => $grandTotal,
            'deadline'      => $validated['deadline'] ?? null,
            'notes'         => $validated['notes'] ?? null,
            'created_by'    => Auth::id(),
            'updated_by'    => Auth::id(),
        ]);

        Log::info("✅ Lead baru berhasil ditambahkan dengan ID: {$transaction->id} ke kolom ID: {$validated['column_id']}");

        // Return JSON response for AJAX requests
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Lead berhasil ditambahkan.',
                'transaction' => $transaction
            ]);
        }

        return redirect()->back()->with('success', 'Lead berhasil ditambahkan.');

    } catch (ValidationException $e) {
        return redirect()->back()->withErrors($e->errors())->withInput();
    } catch (ModelNotFoundException $e) {
        return redirect()->back()->with('error', 'Data kontak atau produk tidak ditemukan.');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
    }
}





    // ... other methods, e.g., destroy for deleting leads
    // public function destroy(string $id)
    // {
    //     $transaction = Transaction::find($id);

    //     if (!$transaction) {
    //         return response()->json(['message' => 'Lead not found'], 404);
    //     }

    //     try {
    //         $transaction->delete(); // This will trigger the deleting event for logging
    //         return response()->json(['message' => 'Lead deleted successfully'], 200);
    //     } catch (\Exception $e) {
    //         Log::error("❌ Error deleting transaction $id: " . $e->getMessage());
    //         return response()->json(['message' => 'Failed to delete lead', 'error' => $e->getMessage()], 500);
    //     }
    // }


    // public function store(Request $request)
    // {
    //     try {
    //         // Validasi awal
    //         $validator = Validator::make($request->all(), [
    //             'column_id' => 'required|uuid|exists:columns,id',
    //             'contact_id' => 'required|uuid|exists:contacts,id',
    //             'name' => 'required|string|max:255',
    //             'company_name' => 'nullable|string|max:255',
    //             'product_id' => 'nullable|uuid|exists:products,id',
    //             'product_name' => 'nullable|string|max:255',
    //             'current_price' => 'nullable|numeric',
    //             'qty' => 'nullable|integer',
    //             'discount_amount' => 'nullable|numeric|min:0',
    //             'deadline' => 'nullable|date',
    //             'notes' => 'nullable|string|max:1000',
    //         ]);

    //         // Validasi tambahan jika product_id diisi
    //         if ($request->filled('product_id')) {
    //             $validator->after(function ($validator) use ($request) {
    //                 if ($request->current_price === null || $request->current_price < 0.01) {
    //                     $validator->errors()->add('current_price', 'The current price must be at least 0.01.');
    //                 }
    //                 if ($request->qty === null || $request->qty <= 0) {
    //                     $validator->errors()->add('qty', 'The quantity must be greater than 0.');
    //                 }
    //             });
    //         }

    //         $validated = $validator->validate();

    //         // Ambil Contact
    //         $contact = Contact::findOrFail($validated['contact_id']);

    //         // Ambil Produk jika ada
    //         $product = null;
    //         if (!empty($validated['product_id'])) {
    //             $product = Product::findOrFail($validated['product_id']);
    //         }

    //         // Update data contact
    //         if ($contact->name !== $validated['name']) {
    //             $contact->name = $validated['name'];
    //         }
    //         if (
    //             isset($validated['company_name']) &&
    //             $contact->company_name !== $validated['company_name']
    //         ) {
    //             $contact->company_name = $validated['company_name'];
    //         }
    //         $contact->save();

    //         // Update nama produk jika diubah
    //         if ($product && $validated['product_name'] && $product->name !== $validated['product_name']) {
    //             $product->name = $validated['product_name'];
    //             $product->save();
    //         }

    //         // Set default nilai jika tidak pakai product
    //         if (empty($validated['product_id'])) {
    //             $validated['current_price'] = 0;
    //             $validated['qty'] = 0;
    //             $validated['discount_amount'] = 0;
    //         }

    //         $currentPrice = $validated['current_price'];
    //         $qty = $validated['qty'];
    //         $discount = $validated['discount_amount'] ?? 0;
    //         $grandTotal = ($currentPrice * $qty) - $discount;

    //         $transaction = Transaction::create([
    //             'column_id' => $validated['column_id'],
    //             'product_id' => optional($product)->id,
    //             'contact_id' => $contact->id,
    //             'current_price' => $currentPrice,
    //             'qty' => $qty,
    //             'discount_amount' => $discount,
    //             'grand_total' => $grandTotal,
    //             'deadline' => $validated['deadline'] ?? null,
    //             'notes' => $validated['notes'] ?? null,
    //         ]);

    //         $contact->load('sector');

    //         return response()->json([
    //             'id' => $transaction->id,
    //             'sector' => $contact->sector->name ?? null,
    //             'sectorColor' => $contact->sector->bg_color ?? 'bg-gray-400',
    //             'name' => $contact->name,
    //             'company_name' => $contact->company_name,
    //             'product' => $product?->name ?? $validated['product_name'],
    //             'product_id' => $product?->id,
    //             'deadline' => optional($transaction->deadline)->format('Y-m-d'),
    //             'assigneeInitials' => strtoupper(substr($contact->name, 0, 1) . substr($product?->name ?? '', 0, 1)),
    //             'assigneeBgColor' => 'bg-blue-500',
    //             'columnId' => $transaction->column_id,
    //             'notes' => $transaction->notes,
    //             'created_at' => $transaction->created_at->toISOString(),
    //             'updated_at' => $transaction->updated_at->toISOString(),
    //             'current_price' => (float) $transaction->current_price,
    //             'qty' => (int) $transaction->qty,
    //             'discount_amount' => (float) $transaction->discount_amount,
    //             'grand_total' => (float) $transaction->grand_total,
    //             'contact_id' => $contact->id,
    //         ], 201);

    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (ModelNotFoundException $e) {
    //         return response()->json([
    //             'message' => 'A related model could not be found.',
    //             'error' => $e->getMessage()
    //         ], 404);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'An unexpected error occurred while adding the lead.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
public function store(Request $request): RedirectResponse
{
    try {
        // Validasi awal
        $validator = Validator::make($request->all(), [
            'column_id' => 'required|uuid|exists:columns,id',
            'contact_id' => 'required|uuid|exists:contacts,id',
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'product_id' => 'nullable|uuid|exists:products,id',
            'product_name' => 'nullable|string|max:255',
            'current_price' => 'nullable|numeric',
            'qty' => 'nullable|integer',
            'discount_amount' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Validasi tambahan jika product_id diisi
        if ($request->filled('product_id')) {
            $validator->after(function ($validator) use ($request) {
                if ($request->current_price === null || $request->current_price < 0.01) {
                    $validator->errors()->add('current_price', 'The current price must be at least 0.01.');
                }
                if ($request->qty === null || $request->qty <= 0) {
                    $validator->errors()->add('qty', 'The quantity must be greater than 0.');
                }
            });
        }

        $validated = $validator->validate();

        // Ambil Contact
        $contact = Contact::findOrFail($validated['contact_id']);

        // Ambil Produk jika ada
        $product = null;
        if (!empty($validated['product_id'])) {
            $product = Product::findOrFail($validated['product_id']);
        }

        // Update data contact jika berubah
        if ($contact->name !== $validated['name']) {
            $contact->name = $validated['name'];
        }
        if (
            isset($validated['company_name']) &&
            $contact->company_name !== $validated['company_name']
        ) {
            $contact->company_name = $validated['company_name'];
        }
        $contact->save();

        // Update nama produk jika diubah
        if ($product && $validated['product_name'] && $product->name !== $validated['product_name']) {
            $product->name = $validated['product_name'];
            $product->save();
        }

        // Set default nilai jika tidak pakai product
        if (empty($validated['product_id'])) {
            $validated['current_price'] = 0;
            $validated['qty'] = 0;
            $validated['discount_amount'] = 0;
        }

        $currentPrice = $validated['current_price'];
        $qty = $validated['qty'];
        $discount = $validated['discount_amount'] ?? 0;
        $grandTotal = ($currentPrice * $qty) - $discount;

        $transaction = Transaction::create([
            'column_id' => $validated['column_id'],
            'product_id' => optional($product)->id,
            'contact_id' => $contact->id,
            'current_price' => $currentPrice,
            'qty' => $qty,
            'discount_amount' => $discount,
            'grand_total' => $grandTotal,
            'deadline' => $validated['deadline'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Load relasi untuk frontend
        $lead = $transaction->load(['contact.sector', 'product']);

        // Redirect back dengan flash message dan data lead
        return redirect()->back()->with([
            'success' => 'Lead berhasil ditambahkan.',
            'lead' => $lead,
        ]);

    } catch (ValidationException $e) {
        return redirect()->back()->withErrors($e->errors())->withInput();
    } catch (ModelNotFoundException $e) {
        return redirect()->back()->with('error', 'Data tidak ditemukan: ' . $e->getMessage());
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
    }
}




    // public function update(Request $request, string $id)
// {
//     Log::info('Incoming update transaction request:', ['id' => $id, 'data' => $request->all()]);

    //     try {
//         $validator = Validator::make($request->all(), [
//             'product_id'       => 'nullable|uuid|exists:products,id',
//             'contact_id'       => 'required|uuid|exists:contacts,id',
//             'current_price'    => 'nullable|numeric',
//             'qty'              => 'nullable|integer',
//             'discount_amount'  => 'nullable|numeric|min:0',
//             'deadline'         => 'nullable|date',
//             'notes'            => 'nullable|string|max:1000',
//         ]);

    //         if ($request->filled('product_id')) {
//             $validator->after(function ($validator) use ($request) {
//                 if ($request->current_price === null || $request->current_price < 0.01) {
//                     $validator->errors()->add('current_price', 'The current price must be at least 0.01.');
//                 }
//                 if ($request->qty === null || $request->qty <= 0) {
//                     $validator->errors()->add('qty', 'The quantity must be greater than 0.');
//                 }
//             });
//         }

    //         $validatedData = $validator->validate();

    //         if (!$validatedData['product_id']) {
//             $validatedData['current_price'] = 0;
//             $validatedData['qty'] = 0;
//             $validatedData['discount_amount'] = 0;
//         }

    //         $currentPrice = $validatedData['current_price'];
//         $qty = $validatedData['qty'];
//         $discount = $validatedData['discount_amount'] ?? 0;
//         $grandTotal = ($currentPrice * $qty) - $discount;

    //         $validatedData['grand_total'] = $grandTotal;

    //         $transaction = Transaction::findOrFail($id);
//         $transaction->update($validatedData);
//         $transaction->refresh();
//         $transaction->load(['contact.sector', 'product', 'column']);

    //         $authUser = Auth::user();

    //         $updatedTransactionData = [
//             'id'               => $transaction->id,
//             'trx'              => $transaction->trx,
//             'sector'           => optional(optional($transaction->contact)->sector)->name ?? 'Unknown',
//             'sectorColor'      => optional(optional($transaction->contact)->sector)->bg_color ?? 'bg-gray-400',
//             'name'             => optional($transaction->contact)->name ?? 'N/A',
//             'company_name'     => $transaction->contact->company_name ?? null,
//             'product'          => optional($transaction->product)->name,
//             'deadline'         => optional($transaction->deadline)->format('Y-m-d'),
//             'assigneeInitials' => strtoupper(substr($authUser->name, 0, 2)),
//             'assigneeBgColor'  => 'bg-blue-500',
//             'columnId'         => $transaction->column_id,
//             'current_price'    => (float) $transaction->current_price,
//             'qty'              => (int) $transaction->qty,
//             'discount_amount'  => (float) $transaction->discount_amount,
//             'grand_total'      => (float) $transaction->grand_total,
//             'notes'            => $transaction->notes,
//             'created_at'       => $transaction->created_at->toISOString(),
//             'updated_at'       => $transaction->updated_at->toISOString(),
//             'contact_id'       => $transaction->contact_id,
//             'product_id'       => $transaction->product_id,
//         ];

    //         Log::info('Transaction updated successfully:', [
//             'transaction_id' => $transaction->id,
//             'updated_data' => $updatedTransactionData
//         ]);

    //         return response()->json([
//             'message' => 'Transaction updated successfully.',
//             'transaction' => $updatedTransactionData
//         ], 200);

    //     } catch (ValidationException $e) {
//         Log::warning('Validation error during transaction update:', [
//             'errors' => $e->errors(),
//             'request_data' => $request->all()
//         ]);
//         return response()->json(['errors' => $e->errors(), 'message' => 'Validation Failed'], 422);

    //     } catch (ModelNotFoundException $e) {
//         Log::error('Transaction not found during update:', ['id' => $id, 'error' => $e->getMessage()]);
//         return response()->json(['message' => 'Transaction not found.', 'error' => $e->getMessage()], 404);

    //     } catch (\Exception $e) {
//         Log::error('Error updating transaction: ' . $e->getMessage(), [
//             'trace' => $e->getTraceAsString(),
//             'request_id' => $id,
//             'request_data' => $request->all()
//         ]);
//         return response()->json([
//             'message' => 'An unexpected error occurred while updating the transaction.',
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }


    // }

    /**
     * Display a listing of the transactions (leads) for the Kanban board.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    // public function index(Request $request)
    // {
    //     $now = now();
    //     $sevenDaysAgo = now()->subDays(7);

    //     $query = DB::table('transactions')
    //         ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
    //         ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
    //         ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
    //         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
    //         ->leftJoinSub(function ($query) {
    //             $query->from('transaction_logs')
    //                 ->select('id', 'transaction_id', 'user_id')
    //                 ->whereIn('id', function ($sub) {
    //                     $sub->from('transaction_logs as t2')
    //                         ->selectRaw('MAX(id)')
    //                         ->groupBy('transaction_id');
    //                 });
    //         }, 'actual_latest_log', function ($join) {
    //             $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
    //         })
    //         ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
    //         ->select(
    //             'transactions.id as id',
    //             'transactions.trx',
    //             'transactions.current_price',
    //             'transactions.qty',
    //             'transactions.discount_amount',
    //             'transactions.grand_total',
    //             'transactions.deadline',
    //             'transactions.notes',
    //             'transactions.created_at',
    //             'transactions.updated_at',
    //             'contacts.id as contact_id',
    //             'contacts.name as contact_name',
    //             'contacts.company_name',
    //             'contacts.email as contact_email',
    //             'contacts.phone as contact_phone',
    //             'contacts.social_media as contact_social',
    //             'contacts.address as contact_address',
    //             'sectors.name as sector_name',
    //             'sectors.bg_color as sector_color',
    //             'products.id as product_id',
    //             'products.name as product_name',
    //             'columns.id as column_id',
    //             'columns.name as column_name',
    //             'users.name as last_user_name'
    //         )
    //         ->whereNull('transactions.deleted_at');

    //     // Filter arsip
    //     if ($request->query('show') === 'arsip') {
    //         $query->whereIn('columns.name', ['DEALING', 'JUNK'])
    //             ->where('transactions.updated_at', '<', $sevenDaysAgo);
    //     } else {
    //         $query->where(function ($q) use ($sevenDaysAgo) {
    //             $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
    //                 ->orWhere(function ($sub) use ($sevenDaysAgo) {
    //                     $sub->whereIn('columns.name', ['DEALING', 'JUNK'])
    //                         ->where('transactions.updated_at', '>=', $sevenDaysAgo);
    //                 });
    //         });
    //     }

    //     // $transactions = $query->get()->map(function ($transaction) {
    //     //     $deadlineDate = $transaction->deadline
    //     //         ? Carbon\Carbon::parse($transaction->deadline)->format('Y-m-d')
    //     //         : null;
    //     $transactions = $query->get()->map(function ($transaction) {
    //         $deadlineDate = $transaction->deadline
    //             ? Carbon::parse($transaction->deadline)->format('Y-m-d')
    //             : null;

    //         $lastUserInitials = '??';
    //         $lastUserBgColor = 'bg-gray-400';

    //         if (!empty($transaction->last_user_name)) {
    //             $words = preg_split('/\s+/', trim($transaction->last_user_name));
    //             $lastUserInitials = count($words) >= 2
    //                 ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
    //                 : strtoupper(substr($words[0], 0, 2));
    //             $lastUserBgColor = 'bg-fuchsia-500';
    //         }

    //         return [
    //             'id' => $transaction->id,
    //             'trx' => $transaction->trx,
    //             'sector' => $transaction->sector_name ?? 'Unknown',
    //             'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
    //             'name' => $transaction->contact_name ?? 'N/A',
    //             'company_name' => $transaction->company_name,
    //             'email' => $transaction->contact_email ?? '-',
    //             'phone' => $transaction->contact_phone ?? '-',
    //             'social_media' => json_decode($transaction->contact_social ?? '[]'),
    //             'address' => json_decode($transaction->contact_address ?? '[]'),
    //             'product' => $transaction->product_name ?? 'N/A',
    //             'deadline' => $deadlineDate,
    //             'assigneeInitials' => $lastUserInitials,
    //             'assigneeBgColor' => $lastUserBgColor,
    //             'columnId' => $transaction->column_id ?? 'unknown',
    //             'current_price' => (float) $transaction->current_price,
    //             'qty' => (int) $transaction->qty,
    //             'discount_amount' => (float) $transaction->discount_amount,
    //             'grand_total' => (float) $transaction->grand_total,
    //             'notes' => $transaction->notes,
    //             'created_at' => $transaction->created_at,
    //             'updated_at' => $transaction->updated_at,
    //             'contact_id' => $transaction->contact_id,
    //             'product_id' => $transaction->product_id,
    //             'lastUserInitials' => $lastUserInitials,
    //             'lastUserBgColor' => $lastUserBgColor,
    //         ];
    //     });

    //     $columns = Column::all();

    //     $kanbanData = $columns->map(function ($column) use ($transactions) {
    //         return [
    //             'id' => $column->id,
    //             'title' => $column->name,
    //             'bgColor' => $column->bg_color,
    //             'borderColor' => $column->border_color,
    //             'titleColor' => $column->title_color,
    //             'dotBorderColor' => $column->dot_border_color,
    //             'dotBgColor' => $column->dot_bg_color,
    //             'dotTextColor' => $column->dot_text_color,
    //             'addLeadColor' => $column->add_lead_color,
    //             'leads' => $transactions->where('columnId', $column->id)->values(),
    //         ];
    //     });

    //     return Inertia::render('Kanban/index', [
    //         'kanbanData' => $kanbanData,
    //     ]);
    // }

    public function index(Request $request)
{
        $contacts = Contact::select('id', 'name', 'company_name')->get();
        $products = Product::select('id', 'name', 'price')->get();
        $transactions = Transaction::with(['contact', 'product', 'column'])->get();
        $query = DB::table('transactions')
        ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
        ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
        ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
        ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
        ->leftJoinSub(function ($query) {
            $query->from('transaction_logs')
                ->select('id', 'transaction_id', 'user_id')
                ->whereIn('id', function ($sub) {
                    $sub->from('transaction_logs as t2')
                        ->selectRaw('MAX(id)')
                        ->groupBy('transaction_id');
                });
        }, 'actual_latest_log', function ($join) {
            $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
        })
        ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
        ->select(
            'transactions.id as id',
            'transactions.trx',
            'transactions.current_price',
            'transactions.qty',
            'transactions.discount_amount',
            'transactions.grand_total',
            'transactions.deadline',
            'transactions.notes',
            'transactions.created_at',
            'transactions.updated_at',
            'contacts.id as contact_id',
            'contacts.name as contact_name',
            'contacts.company_name',
            'contacts.email as contact_email',
            'contacts.phone as contact_phone',
            'contacts.social_media as contact_social',
            'contacts.address as contact_address',
            'sectors.name as sector_name',
            'sectors.bg_color as sector_color',
            'sectors.text_color as sector_text_color',
            'products.id as product_id',
            'products.name as product_name',
            'columns.id as column_id',
            'columns.name as column_name',
            'users.name as last_user_name'
        )
        ->whereNull('transactions.deleted_at');

    // ✅ Untuk Kanban Board, tampilkan semua kolom termasuk DEALING dan JUNK
    // Filter hanya jika ada parameter show=arsip
    if ($request->query('show') === 'arsip') {
        if ($request->has('filter') && in_array(strtoupper($request->filter), ['DEALING', 'JUNK'])) {
            $query->where('columns.name', strtoupper($request->filter));
        } else {
            $query->whereIn('columns.name', ['DEALING', 'JUNK']);
        }
    } else {
        // Jika tidak ada show=arsip, tampilkan semua kolom kecuali DEALING dan JUNK yang sudah lebih dari 7 hari
        $query->where(function ($q) {
            $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
              ->orWhere(function ($subQ) {
                  $subQ->whereIn('columns.name', ['DEALING', 'JUNK'])
                       ->where('transactions.updated_at', '>=', now()->subDays(7));
              });
        });
    }

    $transactions = $query->get()->map(function ($transaction) {
        $deadlineDate = $transaction->deadline
            ? Carbon::parse($transaction->deadline)->format('Y-m-d')
            : null;
        Log::info('Contact social_media:', [$transaction->contact_social]);
        Log::info('Contact address:', [$transaction->contact_address]);

        $lastUserInitials = '??';
        $lastUserBgColor = 'bg-gray-400';

        if (!empty($transaction->last_user_name)) {
            $words = preg_split('/\s+/', trim($transaction->last_user_name));
            $lastUserInitials = count($words) >= 2
                ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
                : strtoupper(substr($words[0], 0, 2));
            $lastUserBgColor = 'bg-fuchsia-500';
        }

        return [
            'id' => $transaction->id,
            'trx' => $transaction->trx,
            'sector' => $transaction->sector_name ?? 'Unknown',
            'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
            'sectorTextColor' => $transaction->sector_text_color ?? 'bg-gray-400',
            'name' => $transaction->contact_name ?? 'N/A',
            'company_name' => $transaction->company_name,
            'email' => $transaction->contact_email ?? '-',
            'phone' => $transaction->contact_phone ?? '-',
            // 'social_media' => json_decode($transaction->contact_social ?? '[]'),
            // 'address' => json_decode($transaction->contact_address ?? '[]'),
            'social_media' => $transaction->contact_social ?? '-',
            'address' => $transaction->contact_address ?? '-',
            'product' => $transaction->product_name ?? 'N/A',
            'deadline' => $deadlineDate,
            'assigneeInitials' => $lastUserInitials,
            'assigneeBgColor' => $lastUserBgColor,
            'columnId' => $transaction->column_id ?? 'unknown',
            'current_price' => (float) $transaction->current_price,
            'qty' => (int) $transaction->qty,
            'discount_amount' => (float) $transaction->discount_amount,
            'grand_total' => (float) $transaction->grand_total,
            'notes' => $transaction->notes,
            'created_at' => $transaction->created_at,
            'updated_at' => $transaction->updated_at,
            'contact_id' => $transaction->contact_id,
            'product_id' => $transaction->product_id,
            'lastUserInitials' => $lastUserInitials,
            'lastUserBgColor' => $lastUserBgColor,
        ];
    });
    Log::info($transactions);

    $columns = Column::all();

    $kanbanData = $columns->map(function ($column) use ($transactions) {
        return [
            'id' => $column->id,
            'title' => $column->name,
            'bgColor' => $column->bg_color,
            'borderColor' => $column->border_color,
            'titleColor' => $column->title_color,
            'dotBorderColor' => $column->dot_border_color,
            'dotBgColor' => $column->dot_bg_color,
            'dotTextColor' => $column->dot_text_color,
            'addLeadColor' => $column->add_lead_color,
            'leads' => $transactions->where('columnId', $column->id)->values(),
        ];
    });



    return Inertia::render('Kanban/index', [
        'kanbanData' => $kanbanData,
        // 'contacts' => $contacts,
        // 'products' => $products,
        'contacts' => Contact::select('id', 'name', 'company_name',)->get(),
        'products' => Product::select('id', 'name', 'price')->get(), // Pastikan ini dikirim
        'columns' => Column::select('id', 'name')->get(), // Pastikan ini dikirim
        // 'columns' => $columns,
        'transactions' => $transactions,

    ]);
}




    /**
     * Update a transaction. This handles general updates from an edit modal.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse


     */
    public function update(Request $request, string $id)
    {
        Log::info('Incoming update transaction request:', ['id' => $id, 'data' => $request->all()]);

        try {
            $validator = Validator::make($request->all(), [
                'product_id'      => 'nullable|uuid|exists:products,id',
                'contact_id'      => 'required|uuid|exists:contacts,id',
                'current_price'   => 'nullable|numeric',
                'qty'             => 'nullable|integer',
                'discount_amount' => 'nullable|numeric|min:0',
                'deadline'        => 'nullable|date',
                'notes'           => 'nullable|string|max:1000',
            ]);

            if ($request->filled('product_id')) {
                $validator->after(function ($validator) use ($request) {
                    if ($request->current_price === null || $request->current_price < 0.01) {
                        $validator->errors()->add('current_price', 'The current price must be at least 0.01.');
                    }
                    if ($request->qty === null || $request->qty <= 0) {
                        $validator->errors()->add('qty', 'The quantity must be greater than 0.');
                    }
                });
            }

            $validatedData = $validator->validate();

            // Set default values if product_id is not provided
            if (!$validatedData['product_id']) {
                $validatedData['current_price'] = 0;
                $validatedData['qty'] = 0;
                $validatedData['discount_amount'] = 0;
            }

            $currentPrice = $validatedData['current_price'];
            $qty = $validatedData['qty'];
            $discount = $validatedData['discount_amount'] ?? 0;
            $grandTotal = ($currentPrice * $qty) - $discount;

            $validatedData['grand_total'] = $grandTotal;

            $transaction = Transaction::findOrFail($id);
            $transaction->update($validatedData);

            Log::info('Transaction updated successfully:', ['transaction_id' => $transaction->id]);

            return redirect()->back()->with('success', 'Transaction updated successfully.');

        } catch (ValidationException $e) {
            Log::warning('Validation error during transaction update:', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return redirect()->back()->withErrors($e->errors())->withInput();

        } catch (ModelNotFoundException $e) {
            Log::error('Transaction not found during update:', ['id' => $id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Transaction not found.');

        } catch (\Exception $e) {
            Log::error('Error updating transaction: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_id' => $id,
                'request_data' => $request->all()
            ]);
            return redirect()->back()->with('error', 'An unexpected error occurred while updating the transaction.');
        }
    }

    /**
     * Remove the specified lead from storage (soft delete).
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    // public function destroy(string $id)
    // {
    //     try {
    //         $transaction = Transaction::findOrFail($id); // Use findOrFail for cleaner error handling

    //         DB::beginTransaction();
    //         // The Transaction model's `deleting` event listener will automatically log the deletion.
    //         // Remove the manual TransactionLog::create here.
    //         $transaction->delete(); // This will trigger the soft deleting if using SoftDeletes
    //         DB::commit();

    //         return response()->json(['message' => 'Lead deleted successfully'], 200);
    //     } catch (ModelNotFoundException $e) {
    //         Log::error('Lead not found for deletion:', ['id' => $id, 'error' => $e->getMessage()]);
    //         return response()->json(['message' => 'Lead not found.', 'error' => $e->getMessage()], 404);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error("❌ Error deleting transaction $id: " . $e->getMessage(), [
    //             'trace' => $e->getTraceAsString(),
    //         ]);
    //         return response()->json(['message' => 'Failed to delete lead', 'error' => $e->getMessage()], 500);
    //     }
    // }

    public function destroy(string $id)
{
    try {
        $transaction = Transaction::findOrFail($id);

        DB::beginTransaction();
        $transaction->delete();
        DB::commit();

        return Redirect::back()->with('success', 'Lead deleted successfully.');
    } catch (ModelNotFoundException $e) {
        Log::error('Lead not found for deletion:', ['id' => $id, 'error' => $e->getMessage()]);
        return Redirect::back()->with('error', 'Lead not found.');
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("❌ Error deleting transaction $id: " . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
        ]);
        return Redirect::back()->with('error', 'Failed to delete lead.');
    }
}


    /**
     * Update the column_id of a specific transaction (for drag-and-drop).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id The transaction ID
     * @return \Illuminate\Http\JsonResponse
     */

    public function updateLeadColumn(Request $request)
    {
        Log::info('📥 Permintaan updateLeadColumn diterima:', $request->all());

        try {
            $validated = $request->validate([
                'leadId' => 'required|uuid|exists:transactions,id',
                'newColumnId' => 'required|uuid|exists:columns,id',
            ]);

            $transaction = Transaction::findOrFail($validated['leadId']);
            $oldColumnId = $transaction->column_id;
            $transaction->column_id = $validated['newColumnId'];
            $transaction->touch(); // Force update updated_at timestamp
            $transaction->save();

            Log::info("✅ Transaksi ID {$transaction->id} berhasil dipindahkan dari kolom ID {$oldColumnId} ke kolom ID {$validated['newColumnId']}.");

            // Return JSON response for AJAX requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Lead berhasil dipindahkan.',
                    'transaction' => $transaction
                ]);
            }

            return back()->with('success', 'Lead berhasil dipindahkan.');

        } catch (ValidationException $e) {
            Log::warning('⚠️ Validasi gagal:', $e->errors());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'errors' => $e->errors()
                ], 422);
            }
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('❌ Kesalahan saat update kolom lead: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan saat memperbarui lead.'
                ], 500);
            }
            return back()->with('error', 'Terjadi kesalahan saat memperbarui lead.');
        }
    }
    //     public function list(Request $request)
// {
//     $now = now();
//     $sevenDaysAgo = now()->subDays(7);

    //     $query = DB::table('transactions')
//         ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
//         ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
//         ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
//         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
//         ->leftJoinSub(function ($query) {
//             $query->from('transaction_logs')
//                 ->select('id', 'transaction_id', 'user_id')
//                 ->whereIn('id', function ($sub) {
//                     $sub->from('transaction_logs as t2')
//                         ->selectRaw('MAX(id)')
//                         ->groupBy('transaction_id');
//                 });
//         }, 'actual_latest_log', function ($join) {
//             $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
//         })
//         ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
//         ->select(
//             'transactions.id as id',
//             'transactions.trx',
//             'transactions.current_price',
//             'transactions.qty',
//             'transactions.discount_amount',
//             'transactions.grand_total',
//             'transactions.deadline',
//             'transactions.notes',
//             'transactions.created_at',
//             'transactions.updated_at',
//             'transactions.column_id as trx_column_id', // <--- Tambahan penting
//             'contacts.id as contact_id',
//             'contacts.name as contact_name',
//             'contacts.company_name',
//             'contacts.email as contact_email',
//             'contacts.phone as contact_phone',
//             'contacts.social_media as contact_social',
//             'contacts.address as contact_address',
//             'sectors.name as sector_name',
//             'sectors.bg_color as sector_color',
//             'products.id as product_id',
//             'products.name as product_name',
//             'columns.id as column_id',
//             'columns.name as column_name',
//             'users.name as last_user_name'
//         )
//         ->whereNull('transactions.deleted_at');

    //     // Filter arsip
//     if ($request->query('show') === 'arsip') {
//         $query->whereIn('columns.name', ['DEALING', 'JUNK'])
//               ->where('transactions.updated_at', '<', $sevenDaysAgo);
//     } else {
//         $query->where(function ($q) use ($sevenDaysAgo) {
//             $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
//               ->orWhere(function ($sub) use ($sevenDaysAgo) {
//                   $sub->whereIn('columns.name', ['DEALING', 'JUNK'])
//                       ->where('transactions.updated_at', '>=', $sevenDaysAgo);
//               });
//         });
//     }

    //     $transactions = $query->get()->map(function ($transaction) {
//         $deadlineDate = $transaction->deadline
//             ? Carbon::parse($transaction->deadline)->format('Y-m-d')
//             : null;

    //         $lastUserInitials = '??';
//         $lastUserBgColor = 'bg-gray-400';

    //         if (!empty($transaction->last_user_name)) {
//             $words = preg_split('/\s+/', trim($transaction->last_user_name));
//             $lastUserInitials = count($words) >= 2
//                 ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
//                 : strtoupper(substr($words[0], 0, 2));
//             $lastUserBgColor = 'bg-fuchsia-500';
//         }

    //         return [
//             'id' => $transaction->id,
//             'trx' => $transaction->trx,
//             'sector' => $transaction->sector_name ?? 'Unknown',
//             'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
//             'name' => $transaction->contact_name ?? 'N/A',
//             'company_name' => $transaction->company_name,
//             'email' => $transaction->contact_email ?? '-',
//             'phone' => $transaction->contact_phone ?? '-',
//             'social_media' => json_decode($transaction->contact_social ?? '[]'),
//             'address' => json_decode($transaction->contact_address ?? '[]'),
//             'product' => $transaction->product_name ?? 'N/A',
//             'deadline' => $deadlineDate,
//             'assigneeInitials' => $lastUserInitials,
//             'assigneeBgColor' => $lastUserBgColor,
//             // Gunakan `column_id` hasil JOIN, jika null gunakan `trx_column_id`
//             'columnId' => $transaction->column_id ?? $transaction->trx_column_id ?? 'unknown',
//             'current_price' => (float) $transaction->current_price,
//             'qty' => (int) $transaction->qty,
//             'discount_amount' => (float) $transaction->discount_amount,
//             'grand_total' => (float) $transaction->grand_total,
//             'notes' => $transaction->notes,
//             'created_at' => $transaction->created_at,
//             'updated_at' => $transaction->updated_at,
//             'contact_id' => $transaction->contact_id,
//             'product_id' => $transaction->product_id,
//             'lastUserInitials' => $lastUserInitials,
//             'lastUserBgColor' => $lastUserBgColor,
//         ];
//     });

    //     $columns = Column::all();

    //     $kanbanData = $columns->map(function ($column) use ($transactions) {
//         return [
//             'id' => $column->id,
//             'title' => $column->name,
//             'bgColor' => $column->bg_color,
//             'borderColor' => $column->border_color,
//             'titleColor' => $column->title_color,
//             'dotBorderColor' => $column->dot_border_color,
//             'dotBgColor' => $column->dot_bg_color,
//             'dotTextColor' => $column->dot_text_color,
//             'addLeadColor' => $column->add_lead_color,
//             'leads' => $transactions->where('columnId', $column->id)->values(),
//         ];
//     });

    //     return Inertia::render('Kanban/list', [
//         'kanbanData' => $kanbanData,
//     ]);
// }

    //  public function updatestatus(Request $request, string $id)
//     {
//         $transaction = Transaction::find($id);

    //         if (!$transaction) {
//             return response()->json(['message' => 'Lead not found'], 404);
//         }

    //         // Validate the request, especially for column_id
//         $validatedData = $request->validate([
//             'column_id' => 'sometimes|uuid|exists:columns,id', // Ensure it's a UUID and exists in columns table
//             // Add other fields that can be updated from the edit modal
//             'contact_id' => 'sometimes|uuid|exists:contacts,id',
//             'product_id' => 'sometimes|uuid|exists:products,id',
//             'trx' => 'sometimes|string|max:255',
//             'current_price' => 'sometimes|numeric|min:q',
//             'qty' => 'sometimes|integer|min:1',
//             'grand_total' => 'sometimes|numeric|min:1',
//             'deadline' => 'sometimes|nullable|date',
//             'notes' => 'sometimes|nullable|string',
//         ]);

    //         $transaction->update($validatedData);

    //         return response()->json([
//             'message' => 'Lead updated successfully',
//             'lead' => $transaction->fresh(), // Return the updated lead
//         ]);
//     }






    // }



    // ... other methods ...

    // public function list(Request $request)
    // {
    //     $now = now();
    //     $sevenDaysAgo = now()->subDays(7);

    //     $query = DB::table('transactions')
    //         ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
    //         ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
    //         ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
    //         ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
    //         ->leftJoinSub(function ($query) {
    //             $query->from('transaction_logs')
    //                 ->select('id', 'transaction_id', 'user_id')
    //                 ->whereIn('id', function ($sub) {
    //                     $sub->from('transaction_logs as t2')
    //                         ->selectRaw('MAX(id)')
    //                         ->groupBy('transaction_id');
    //                 });
    //         }, 'actual_latest_log', function ($join) {
    //             $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
    //         })
    //         ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
    //         ->select(
    //             'transactions.id as id',
    //             'transactions.trx',
    //             'transactions.current_price',
    //             'transactions.qty',
    //             'transactions.discount_amount',
    //             'transactions.grand_total',
    //             'transactions.deadline',
    //             'transactions.notes',
    //             'transactions.created_at',
    //             'transactions.updated_at',
    //             'transactions.column_id as trx_column_id',
    //             'contacts.id as contact_id',
    //             'contacts.name as contact_name',
    //             'contacts.company_name',
    //             'contacts.email as contact_email',
    //             'contacts.phone as contact_phone',
    //             'contacts.social_media as contact_social',
    //             'contacts.address as contact_address',
    //             'sectors.name as sector_name',
    //             'sectors.bg_color as sector_color',
    //             'products.id as product_id',
    //             'products.name as product_name',
    //             'columns.id as column_id',
    //             'columns.name as column_name',
    //             'users.name as last_user_name'
    //         )
    //         ->whereNull('transactions.deleted_at');

    //     // Filter arsip
    //     if ($request->query('show') === 'arsip') {
    //         $query->whereIn('columns.name', ['DEALING', 'JUNK'])
    //             ->where('transactions.updated_at', '<', $sevenDaysAgo);
    //     } else {
    //         $query->where(function ($q) use ($sevenDaysAgo) {
    //             $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
    //                 ->orWhere(function ($sub) use ($sevenDaysAgo) {
    //                     $sub->whereIn('columns.name', ['DEALING', 'JUNK'])
    //                         ->where('transactions.updated_at', '>=', $sevenDaysAgo);
    //                 });
    //         });
    //     }

    //     $transactions = $query->get()->map(function ($transaction) {
    //         $deadlineDate = $transaction->deadline
    //             ? Carbon::parse($transaction->deadline)->format('Y-m-d')
    //             : null;

    //         $lastUserInitials = '??';
    //         $lastUserBgColor = 'bg-gray-400';

    //         if (!empty($transaction->last_user_name)) {
    //             $words = preg_split('/\s+/', trim($transaction->last_user_name));
    //             $lastUserInitials = count($words) >= 2
    //                 ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
    //                 : strtoupper(substr($words[0], 0, 2));
    //             $lastUserBgColor = 'bg-fuchsia-500';
    //         }

    //         return [
    //             'id' => $transaction->id,
    //             'trx' => $transaction->trx,
    //             'sector' => $transaction->sector_name ?? 'Unknown',
    //             'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
    //             'name' => $transaction->contact_name ?? 'N/A',
    //             'company_name' => $transaction->company_name,
    //             'email' => $transaction->contact_email ?? '-',
    //             'phone' => $transaction->contact_phone ?? '-',
    //             'social_media' => json_decode($transaction->contact_social ?? '[]'),
    //             'address' => json_decode($transaction->contact_address ?? '[]'),
    //             'product' => $transaction->product_name ?? 'N/A',
    //             'deadline' => $deadlineDate,
    //             'assigneeInitials' => $lastUserInitials,
    //             'assigneeBgColor' => $lastUserBgColor,
    //             'columnId' => $transaction->column_id ?? $transaction->trx_column_id ?? 'unknown',
    //             'current_price' => (float) $transaction->current_price,
    //             'qty' => (int) $transaction->qty,
    //             'discount_amount' => (float) $transaction->discount_amount,
    //             'grand_total' => (float) $transaction->grand_total,
    //             'notes' => $transaction->notes,
    //             'created_at' => $transaction->created_at,
    //             'updated_at' => $transaction->updated_at,
    //             'contact_id' => $transaction->contact_id,
    //             'product_id' => $transaction->product_id,
    //             'lastUserInitials' => $lastUserInitials,
    //             'lastUserBgColor' => $lastUserBgColor,
    //         ];
    //     });

    //     $columns = Column::all();

    //     $kanbanData = $columns->map(function ($column) use ($transactions) {
    //         return [
    //             'id' => $column->id,
    //             'title' => $column->name,
    //             'bgColor' => $column->bg_color,
    //             'borderColor' => $column->border_color,
    //             'titleColor' => $column->title_color,
    //             'dotBorderColor' => $column->dot_border_color,
    //             'dotBgColor' => $column->dot_bg_color,
    //             'dotTextColor' => $column->dot_text_color,
    //             'addLeadColor' => $column->add_lead_color,
    //             'leads' => $transactions->where('columnId', $column->id)->values(),
    //         ];
    //     });

    //     return Inertia::render('Kanban/list', [
    //         'kanbanData' => $kanbanData,
    //         'columns' => $columns->map(fn($column) => ['id' => $column->id, 'title' => $column->name]), // Pass simplified columns for dropdown
    //     ]);
    // }

    public function list(Request $request)
{
    // $query = DB::table('transactions')
    //     ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
    //     ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
    //     ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
    //     ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
    //     ->leftJoinSub(function ($query) {
    //         $query->from('transaction_logs')
    //             ->select('id', 'transaction_id', 'user_id')
    //             ->whereIn('id', function ($sub) {
    //                 $sub->from('transaction_logs as t2')
    //                     ->selectRaw('MAX(id)')
    //                     ->groupBy('transaction_id');
    //             });
    //     }, 'actual_latest_log', function ($join) {
    //         $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
    //     })
    //     ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
    //     ->select(
    //         'transactions.id as id',
    //         'transactions.trx',
    //         'transactions.current_price',
    //         'transactions.qty',
    //         'transactions.discount_amount',
    //         'transactions.grand_total',
    //         'transactions.deadline',
    //         'transactions.notes',
    //         'transactions.created_at',
    //         'transactions.updated_at',
    //         'transactions.column_id as trx_column_id',
    //         'contacts.id as contact_id',
    //         'contacts.name as contact_name',
    //         'contacts.company_name',
    //         'contacts.email as contact_email',
    //         'contacts.phone as contact_phone',
    //         'contacts.social_media as contact_social',
    //         'contacts.address as contact_address',
    //         'sectors.name as sector_name',
    //         'sectors.bg_color as sector_color',
    //         'products.id as product_id',
    //         'products.name as product_name',
    //         'columns.id as column_id',
    //         'columns.name as column_name',
    //         'users.name as last_user_name'
    //     )
    //     ->whereNull('transactions.deleted_at');

    // // ✅ Filter arsip langsung berdasarkan kolom
    // if ($request->query('show') === 'arsip') {
    //     $query->whereIn('columns.name', ['DEALING', 'JUNK']);
    // } else {
    //     $query->whereNotIn('columns.name', ['DEALING', 'JUNK']);
    // }

    // $transactions = $query->get()->map(function ($transaction) {
    //     $deadlineDate = $transaction->deadline
    //         ? Carbon::parse($transaction->deadline)->format('Y-m-d')
    //         : null;

    //     $lastUserInitials = '??';
    //     $lastUserBgColor = 'bg-gray-400';

    //     if (!empty($transaction->last_user_name)) {
    //         $words = preg_split('/\s+/', trim($transaction->last_user_name));
    //         $lastUserInitials = count($words) >= 2
    //             ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
    //             : strtoupper(substr($words[0], 0, 2));
    //         $lastUserBgColor = 'bg-fuchsia-500';
    //     }

    //     return [
    //         'id' => $transaction->id,
    //         'trx' => $transaction->trx,
    //         'sector' => $transaction->sector_name ?? 'Unknown',
    //         'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
    //         'name' => $transaction->contact_name ?? 'N/A',
    //         'company_name' => $transaction->company_name,
    //         'email' => $transaction->contact_email ?? '-',
    //         'phone' => $transaction->contact_phone ?? '-',
    //         'social_media' => json_decode($transaction->contact_social ?? '[]'),
    //         'address' => json_decode($transaction->contact_address ?? '[]'),
    //         'product' => $transaction->product_name ?? 'N/A',
    //         'deadline' => $deadlineDate,
    //         'assigneeInitials' => $lastUserInitials,
    //         'assigneeBgColor' => $lastUserBgColor,
    //         'columnId' => $transaction->column_id ?? $transaction->trx_column_id ?? 'unknown',
    //         'current_price' => (float) $transaction->current_price,
    //         'qty' => (int) $transaction->qty,
    //         'discount_amount' => (float) $transaction->discount_amount,
    //         'grand_total' => (float) $transaction->grand_total,
    //         'notes' => $transaction->notes,
    //         'created_at' => $transaction->created_at,
    //         'updated_at' => $transaction->updated_at,
    //         'contact_id' => $transaction->contact_id,
    //         'product_id' => $transaction->product_id,
    //         'lastUserInitials' => $lastUserInitials,
    //         'lastUserBgColor' => $lastUserBgColor,
    //     ];
    // });

    // $columns = Column::all();

    // $kanbanData = $columns->map(function ($column) use ($transactions) {
    //     return [
    //         'id' => $column->id,
    //         'title' => $column->name,
    //         'bgColor' => $column->bg_color,
    //         'borderColor' => $column->border_color,
    //         'titleColor' => $column->title_color,
    //         'dotBorderColor' => $column->dot_border_color,
    //         'dotBgColor' => $column->dot_bg_color,
    //         'dotTextColor' => $column->dot_text_color,
    //         'addLeadColor' => $column->add_lead_color,
    //         'leads' => $transactions->where('columnId', $column->id)->values(),
    //     ];
    // });

    // return Inertia::render('Kanban/list', [
    //     'kanbanData' => $kanbanData,
    //     'columns' => $columns->map(fn($column) => ['id' => $column->id, 'title' => $column->name]),
    // ]);

    $query = DB::table('transactions')
        ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
        ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
        ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
        ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
        ->leftJoinSub(function ($query) {
            $query->from('transaction_logs')
                ->select('id', 'transaction_id', 'user_id')
                ->whereIn('id', function ($sub) {
                    $sub->from('transaction_logs as t2')
                        ->selectRaw('MAX(id)')
                        ->groupBy('transaction_id');
                });
        }, 'actual_latest_log', function ($join) {
            $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
        })
        ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
        ->select(
            'transactions.id as id',
            'transactions.trx',
            'transactions.current_price',
            'transactions.qty',
            'transactions.discount_amount',
            'transactions.grand_total',
            'transactions.deadline',
            'transactions.notes',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.column_id as trx_column_id',
            'contacts.id as contact_id',
            'contacts.name as contact_name',
            'contacts.company_name',
            'contacts.email as contact_email',
            'contacts.phone as contact_phone',
            'contacts.social_media as contact_social',
            'contacts.address as contact_address',
            'sectors.name as sector_name',
            'sectors.bg_color as sector_color',
            'products.id as product_id',
            'products.name as product_name',
            'columns.id as column_id',
            'columns.name as column_name',
            'users.name as last_user_name'
        )
        ->whereNull('transactions.deleted_at');

    // Filter arsip DEALING/JUNK berdasarkan parameter filter
    if ($request->query('show') === 'arsip') {
        if ($request->has('filter') && in_array(strtoupper($request->filter), ['DEALING', 'JUNK'])) {
            $query->where('columns.name', strtoupper($request->filter));
        } else {
            $query->whereIn('columns.name', ['DEALING', 'JUNK']);
        }
    } else {
        // Tampilkan semua kolom kecuali DEALING dan JUNK yang sudah lebih dari 7 hari
        $query->where(function ($q) {
            $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
              ->orWhere(function ($subQ) {
                  $subQ->whereIn('columns.name', ['DEALING', 'JUNK'])
                       ->where('transactions.updated_at', '>=', now()->subDays(7));
              });
        });
    }

    $transactions = $query->get()->map(function ($transaction) {
        $deadlineDate = $transaction->deadline
            ? Carbon::parse($transaction->deadline)->format('Y-m-d')
            : null;

        $lastUserInitials = '??';
        $lastUserBgColor = 'bg-gray-400';

        if (!empty($transaction->last_user_name)) {
            $words = preg_split('/\s+/', trim($transaction->last_user_name));
            $lastUserInitials = count($words) >= 2
                ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
                : strtoupper(substr($words[0], 0, 2));
            $lastUserBgColor = 'bg-fuchsia-500';
        }

        return [
            'id' => $transaction->id,
            'trx' => $transaction->trx,
            'sector' => $transaction->sector_name ?? 'Unknown',
            'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
            'name' => $transaction->contact_name ?? 'N/A',
            'company_name' => $transaction->company_name,
            'email' => $transaction->contact_email ?? '-',
            'phone' => $transaction->contact_phone ?? '-',
            'social_media' =>$transaction->contact_social ?? '-',
            'address' => $transaction->contact_address ?? '-',
            'product' => $transaction->product_name ?? 'N/A',
            'deadline' => $deadlineDate,
            'assigneeInitials' => $lastUserInitials,
            'assigneeBgColor' => $lastUserBgColor,
            'columnId' => $transaction->column_id ?? $transaction->trx_column_id ?? 'unknown',
            'current_price' => (float) $transaction->current_price,
            'qty' => (int) $transaction->qty,
            'discount_amount' => (float) $transaction->discount_amount,
            'grand_total' => (float) $transaction->grand_total,
            'notes' => $transaction->notes,
            'created_at' => $transaction->created_at,
            'updated_at' => $transaction->updated_at,
            'contact_id' => $transaction->contact_id,
            'product_id' => $transaction->product_id,
            'lastUserInitials' => $lastUserInitials,
            'lastUserBgColor' => $lastUserBgColor,
        ];
    });

    $columns = Column::all();

    $kanbanData = $columns->map(function ($column) use ($transactions) {
        return [
            'id' => $column->id,
            'title' => $column->name,
            'bgColor' => $column->bg_color,
            'borderColor' => $column->border_color,
            'titleColor' => $column->title_color,
            'dotBorderColor' => $column->dot_border_color,
            'dotBgColor' => $column->dot_bg_color,
            'dotTextColor' => $column->dot_text_color,
            'addLeadColor' => $column->add_lead_color,
            'leads' => $transactions->where('columnId', $column->id)->values(),
        ];
    });

    // Determine which view to render based on URL parameters
    $viewName = 'Kanban/list';
    if ($request->query('show') === 'arsip') {
        $viewName = 'Kanban/arsip';
    }

    return Inertia::render($viewName, [
        'kanbanData' => $kanbanData,
        'contacts' => Contact::select('id', 'name', 'company_name')
                    ->orderBy('created_at', 'desc')
                    ->get(),
        'products' => Product::select('id', 'name', 'price')
                    ->orderBy('name', 'asc')
                    ->get(),
        'columns' => $columns->map(fn($column) => ['id' => $column->id, 'name' => $column->name]),
    ]);
}

public function arsip(Request $request)
{
    $query = DB::table('transactions')
        ->leftJoin('contacts', 'transactions.contact_id', '=', 'contacts.id')
        ->leftJoin('sectors', 'contacts.sector_id', '=', 'sectors.id')
        ->leftJoin('products', 'transactions.product_id', '=', 'products.id')
        ->leftJoin('columns', 'transactions.column_id', '=', 'columns.id')
        ->leftJoinSub(function ($query) {
            $query->from('transaction_logs')
                ->select('id', 'transaction_id', 'user_id')
                ->whereIn('id', function ($sub) {
                    $sub->from('transaction_logs as t2')
                        ->selectRaw('MAX(id)')
                        ->groupBy('transaction_id');
                });
        }, 'actual_latest_log', function ($join) {
            $join->on('transactions.id', '=', 'actual_latest_log.transaction_id');
        })
        ->leftJoin('users', 'actual_latest_log.user_id', '=', 'users.id')
        ->select(
            'transactions.id as id',
            'transactions.trx',
            'transactions.current_price',
            'transactions.qty',
            'transactions.discount_amount',
            'transactions.grand_total',
            'transactions.deadline',
            'transactions.notes',
            'transactions.created_at',
            'transactions.updated_at',
            'transactions.column_id as trx_column_id',
            'contacts.id as contact_id',
            'contacts.name as contact_name',
            'contacts.company_name',
            'contacts.email as contact_email',
            'contacts.phone as contact_phone',
            'contacts.social_media as contact_social',
            'contacts.address as contact_address',
            'sectors.name as sector_name',
            'sectors.bg_color as sector_color',
            'products.id as product_id',
            'products.name as product_name',
            'columns.id as column_id',
            'columns.name as column_name',
            'users.name as last_user_name'
        )
        ->whereNull('transactions.deleted_at');

    // Filter arsip DEALING/JUNK berdasarkan parameter filter
    if ($request->query('show') === 'arsip') {
        if ($request->has('filter') && in_array(strtoupper($request->filter), ['DEALING', 'JUNK'])) {
            $query->where('columns.name', strtoupper($request->filter));
        } else {
            $query->whereIn('columns.name', ['DEALING', 'JUNK']);
        }
    } else {
        // Tampilkan semua kolom kecuali DEALING dan JUNK yang sudah lebih dari 7 hari
        $query->where(function ($q) {
            $q->whereNotIn('columns.name', ['DEALING', 'JUNK'])
              ->orWhere(function ($subQ) {
                  $subQ->whereIn('columns.name', ['DEALING', 'JUNK'])
                       ->where('transactions.updated_at', '>=', now()->subDays(7));
              });
        });
    }

    $transactions = $query->get()->map(function ($transaction) {
        $deadlineDate = $transaction->deadline
            ? Carbon::parse($transaction->deadline)->format('Y-m-d')
            : null;

        $lastUserInitials = '??';
        $lastUserBgColor = 'bg-gray-400';

        if (!empty($transaction->last_user_name)) {
            $words = preg_split('/\s+/', trim($transaction->last_user_name));
            $lastUserInitials = count($words) >= 2
                ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
                : strtoupper(substr($words[0], 0, 2));
            $lastUserBgColor = 'bg-fuchsia-500';
        }

        return [
            'id' => $transaction->id,
            'trx' => $transaction->trx,
            'sector' => $transaction->sector_name ?? 'Unknown',
            'sectorColor' => $transaction->sector_color ?? 'bg-gray-400',
            'name' => $transaction->contact_name ?? 'N/A',
            'company_name' => $transaction->company_name,
            'email' => $transaction->contact_email ?? '-',
            'phone' => $transaction->contact_phone ?? '-',
            'social_media' => $transaction->contact_social ?? '-',
            'address' => $transaction->contact_address ?? '-',
            'product' => $transaction->product_name ?? 'N/A',
            'deadline' => $deadlineDate,
            'assigneeInitials' => $lastUserInitials,
            'assigneeBgColor' => $lastUserBgColor,
            'columnId' => $transaction->column_id ?? $transaction->trx_column_id ?? 'unknown',
            'current_price' => (float) $transaction->current_price,
            'qty' => (int) $transaction->qty,
            'discount_amount' => (float) $transaction->discount_amount,
            'grand_total' => (float) $transaction->grand_total,
            'notes' => $transaction->notes,
            'created_at' => $transaction->created_at,
            'updated_at' => $transaction->updated_at,
            'contact_id' => $transaction->contact_id,
            'product_id' => $transaction->product_id,
            'lastUserInitials' => $lastUserInitials,
            'lastUserBgColor' => $lastUserBgColor,
        ];
    });

    $columns = Column::all();

    $kanbanData = $columns->map(function ($column) use ($transactions) {
        return [
            'id' => $column->id,
            'title' => $column->name,
            'bgColor' => $column->bg_color,
            'borderColor' => $column->border_color,
            'titleColor' => $column->title_color,
            'dotBorderColor' => $column->dot_border_color,
            'dotBgColor' => $column->dot_bg_color,
            'dotTextColor' => $column->dot_text_color,
            'addLeadColor' => $column->add_lead_color,
            'leads' => $transactions->where('columnId', $column->id)->values(),
        ];
    });

    return Inertia::render('Kanban/arsip', [
        'kanbanData' => $kanbanData,
        'contacts' => Contact::select('id', 'name', 'company_name')
                    ->orderBy('created_at', 'desc')
                    ->get(),
        'products' => Product::select('id', 'name', 'price')
                    ->orderBy('name', 'asc')
                    ->get(),
        'columns' => $columns->map(fn($column) => ['id' => $column->id, 'name' => $column->name]),
    ]);
}



    public function updatestatus(Request $request, string $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Lead not found'], 404);
        }

        $validatedData = $request->validate([
            'column_id' => 'sometimes|uuid|exists:columns,id',
            'contact_id' => 'sometimes|uuid|exists:contacts,id',
            'product_id' => 'sometimes|uuid|exists:products,id',
            'trx' => 'sometimes|string|max:255',
            'current_price' => 'sometimes|numeric|min:0', // Corrected 'min:q' to 'min:0' assuming price cannot be negative
            'qty' => 'sometimes|integer|min:1',
            'grand_total' => 'sometimes|numeric|min:1',
            'deadline' => 'sometimes|nullable|date',
            'notes' => 'sometimes|nullable|string',
        ]);

        $transaction->update($validatedData);
        $transaction->touch(); // Force update updated_at timestamp

        return redirect()->back()->with('message', 'Lead updated successfully');

    }
}

