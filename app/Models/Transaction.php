<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str; // Import Str facade
use Illuminate\Support\Facades\Auth;
use App\Models\TransactionLog;
use Illuminate\Support\Facades\Log;

class Transaction extends Model
{

     use SoftDeletes, HasUuids; // Use HasUuids for UUID primary keys, and SoftDeletes

    // Crucial: Tell Eloquent that the primary key is NOT an auto-incrementing integer.
    public $incrementing = false;

    // Crucial: Tell Eloquent that the primary key is a string (for UUIDs).
    protected $keyType = 'string';

    // Define fillable properties for mass assignment protection
    protected $fillable = [
        'column_id',
        // 'id', // No need to make 'id' fillable when using HasUuids trait, as it's auto-generated
        'trx',
        'product_id',
        'contact_id',
        'current_price',
        'qty',
        'discount_amount',
        'grand_total',
        'deadline',
        'notes'
    ];

    // Casts for attributes (optional, but good for type consistency)
    protected $casts = [
        'current_price' => 'float',
        'qty' => 'integer',
        'discount_amount' => 'float',
        'grand_total' => 'float',
        'deadline' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     * This is a good place to register model event listeners.
     * The HasUuids trait already handles UUID generation for the primary key.
     *
     * @return void
     */
    protected static function booted(): void
    {
        static::creating(function ($transaction) {
            // Only generate 'trx' code if it's not already set
            if (empty($transaction->trx)) {
                $transaction->trx = self::generateTrxCode();
            }
        });
         static::created(function ($transaction) {
        self::logActivity($transaction, 'created');
    });

    static::updated(function ($transaction) {
        self::logActivity($transaction, 'updated');
    });

    // static::deleted(function ($transaction) {
    //     self::logActivity($transaction, 'deleted');
    static::deleting(function ($transaction) {
    self::logActivity($transaction, 'deleted');

    });
    }

    protected static function generateTrxCode(): string
    {
        do {
            $code = 'TRX' . now()->format('ymdHis') . rand(10, 99);
        } while (self::where('trx', $code)->exists());

        return $code;
    }


      // --- PASTIKAN HANYA ADA SATU DEFINISI logActivity INI ---
    protected static function logActivity(Transaction $transaction, string $action, array $initialData = []): void
    {
        $userId = Auth::id(); // Pastikan user login. Jika tidak, ini akan null.

        $changes = [];
        if ($action === 'updated') {
            $changes = $transaction->getDirty(); // getDirty() lebih baik untuk perubahan aktual
            unset($changes['updated_at']); // Jangan log perubahan updated_at
            if (isset($changes['deleted_at'])) {
                // Keep deleted_at if it was changed (i.e., just got soft-deleted)
            } else {
                unset($changes['deleted_at']);
            }
            unset($changes['created_at']); // created_at tidak berubah saat update
            unset($changes['id']); // id tidak berubah
        } elseif ($action === 'created') {
            $changes = $initialData; // Gunakan data awal yang spesifik untuk created
        } elseif ($action === 'deleted') {
            // Untuk deleted, log informasi identifikasi kunci
            $changes = [
                'id' => $transaction->id,
                'trx' => $transaction->trx,
                'column_id' => $transaction->getOriginal('column_id') ?? $transaction->column_id // Ambil column_id sebelum dihapus
            ];
        }

        // Jangan log update jika tidak ada perubahan signifikan (setelah membersihkan timestamp)
        if ($action === 'updated' && empty($changes)) {
            Log::info("No significant changes to log for transaction {$transaction->id}.");
            return;
        }

        try {
            // Pastikan model TransactionLog ada dan bisa digunakan
            // use App\Models\TransactionLog; // Tambahkan ini di bagian atas jika belum ada
            if (class_exists(TransactionLog::class)) {
                TransactionLog::create([
                    'transaction_id' => $transaction->id,
                    'user_id'        => $userId,
                    'action'         => $action,
                    'changes'        => json_encode($changes), // Simpan sebagai JSON string
                ]);
                Log::info("Logged activity for transaction {$transaction->id}: $action");
            } else {
                Log::warning("TransactionLog model not found. Activity for transaction {$transaction->id} not logged.");
            }
        } catch (\Exception $e) {
            Log::error("Failed to log activity for transaction {$transaction->id}: " . $e->getMessage(), [
                'exception' => $e
            ]);
        }
    }
    // Define relationships
    public function column(): BelongsTo
    {
        return $this->belongsTo(Column::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function report(): HasOne
    {
        return $this->hasOne(Reports::class);
    }

//     protected static function logActivity(Transaction $transaction, string $action): void
// {
//     $userId = Auth::id();

//     $changes = $action === 'updated'
//         ? $transaction->getChanges()
//         : $transaction->toArray();

//     TransactionLog::create([
//         'transaction_id' => $transaction->id,
//         'user_id'        => $userId,
//         'action'         => $action,
//         'changes'        => $changes,
//     ]);
// }


public function logs()
{
    return $this->hasMany(TransactionLog::class);
}




}
