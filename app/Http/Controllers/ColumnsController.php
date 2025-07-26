<?php

namespace App\Http\Controllers;
use App\Models\Column;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class ColumnsController extends Controller
{
     public function index(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       $product = Column::all();
        return response()->json($product);


    }
}
