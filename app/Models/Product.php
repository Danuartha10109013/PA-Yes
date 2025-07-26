<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
        'image',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
//     public function getImageAttribute($value)
// {
//     // return $value ? asset('storage/' . $value) : null;
//     return $value ? asset('storage/' . ltrim(str_replace('public/', '', $value), '/')) : null;
// }
 public function getImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }


}
