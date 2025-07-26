<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string', // Ensure role is cast to string for consistency with enum
        ];
    }

    protected $keyType = 'string';
    // Memberi tahu Eloquent bahwa primary key tidak auto-increment.
    public $incrementing = false;

    /**
     * Metode "booted" dari model.
     *
     * Ini akan dipanggil saat model diinisialisasi.
     * Kami menggunakannya untuk mengatur UUID bagi record baru.
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            // Jika ID kosong, hasilkan UUID baru untuk primary key
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
