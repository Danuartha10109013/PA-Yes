<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'trx' => $this->trx,
            'current_price' => $this->current_price,
            'qty' => $this->qty,
            'grand_total' => $this->grand_total,
            'contact_id' => $this->contact_id,
            'product_id' => $this->product_id,
            'column_id' => $this->column_id,
            // 'status' => $this->status, // You might want to get this from the 'column' relationship if it's the official status
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'column_name' => $this->whenLoaded('column', function () {
                return $this->column->name ?? null;
            }),
            'contact_name' => $this->whenLoaded('contact', function () {
                return $this->contact->name ?? null;
            }),
            'product_name' => $this->whenLoaded('product', function () {
                return $this->product->name ?? null;
            }),
        ];
    }
}
