<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
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
            'transaction_id' => $this->transaction_id,
            'trx'            => $this->transaction->trx,
            'contact_name' => $this->contact_name,
            'company_name' => $this->company_name,
            'product_name' => $this->product_name,
            'qty' => $this->qty,
            'total' => $this->total,
            'status' => $this->status, // Use status from the report
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'transaction' => new TransactionResource($this->whenLoaded('transaction')), // Load nested transaction
        ];
    }
}
