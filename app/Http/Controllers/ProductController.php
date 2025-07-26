<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\Product\StoreRequest as ProductStore;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('product/index', [
            "title" => "List Produk",
            'products' => Product::orderBy('created_at', 'desc')->get()
        ]);
    }

     public function data(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       $product = Product::all();
        return response()->json($product);


    }

    //     public function index()
    // {
    //     // Fetch all products, ordered by the latest created_at
    //     $products = Product::orderBy('created_at', 'desc')->get();
    //     return response()->json($products);
    // }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255',
    //             'slug' => 'required|string|unique:products,slug|max:255',
    //             'price' => 'required|numeric|min:0',
    //             'description' => 'nullable|string',
    //             'image' => 'nullable|string', // Assuming image is stored as a URL/path for simplicity
    //         ]);

    //         $product = Product::create($validatedData);
    //         return response()->json(['message' => 'Product created successfully!', 'product' => $product], 201);

    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'message' => 'Validation Error',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to add product: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }


    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string',
    //         'slug' => 'required|string|unique:products,slug',
    //         'price' => 'required|numeric',
    //         'description' => 'nullable|string',
    //         'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    //     ]);

    //     $image = $request->file('image');
    //     $imagePath = $image->store('products', 'public'); // stored in storage/app/public/products

    //     $product = new Product();
    //     $product->name = $request->name;
    //     $product->slug = $request->slug;
    //     $product->price = $request->price;
    //     $product->description = $request->description;
    //     $product->image = $imagePath;
    //     $product->save();

    //     return response()->json([
    //         'message' => 'Product created successfully',
    //         'product' => $product
    //     ]);
    // }


    //   public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'slug' => 'required|string|unique:products,slug|max:255',
    //         'price' => 'required|numeric|min:0',
    //         'description' => 'nullable|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    //     ]);

    //     $image = $request->file('image');
    //     $imagePath = $image->store('products', 'public'); // stored in storage/app/public/products

    //     $product = new Product();
    //     $product->name = $request->name;
    //     $product->slug = $request->slug;
    //     $product->price = $request->price;
    //     $product->description = $request->description;
    //     $product->image = $imagePath;
    //     $product->save();

    //     return response()->json([
    //         'message' => 'Product created successfully',
    //         'product' => $product
    //     ], 201); // Use 201 Created status code for successful creation
    // }
    // /**
    //  * Update the specified resource in storage.
    //  */
    // // public function update(Request $request, Product $product)
    // // {
    // //     try {
    // //         $validatedData = $request->validate([
    // //             'name' => 'required|string|max:255',
    // //             'slug' => 'required|string|unique:products,slug,' . $product->id . '|max:255',
    // //             'price' => 'required|numeric|min:0',
    // //             'description' => 'nullable|string',
    // //             'image' => 'nullable|string',
    // //         ]);

    // //         $product->update($validatedData);
    // //         return response()->json(['message' => 'Product updated successfully!', 'product' => $product], 200);

    // //     } catch (ValidationException $e) {
    // //         return response()->json([
    // //             'message' => 'Validation Error',
    // //             'errors' => $e->errors()
    // //         ], 422);
    // //     } catch (\Exception $e) {
    // //         return response()->json([
    // //             'message' => 'Failed to update product: ' . $e->getMessage()
    // //         ], 500);
    // //     }
    // // }


//     public function store(Request $request)
// {
//     $request->validate([
//         'name' => 'required|string|max:255',
//         'slug' => 'required|string|unique:products,slug|max:255',
//         'price' => 'required|numeric|min:0',
//         'description' => 'nullable|string',
//         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
//     ]);

//     $imagePath = null;
//     if ($request->hasFile('image')) {
//         $image = $request->file('image');
//         $imagePath = $image->store('products', 'public'); // simpan hanya jika ada file
//     }

//     $product = new Product();
//     $product->name = $request->name;
//     $product->slug = $request->slug;
//     $product->price = $request->price;
//     $product->description = $request->description;
//     $product->image = $imagePath; // bisa null
//     $product->save();

//     return response()->json([
//         'message' => 'Product created successfully',
//         'product' => $product
//     ], 201);
// }

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'slug' => 'required|string|unique:products,slug|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imagePath = $image->store('products', 'public');
    }

    $product = new Product();
    $product->name = $request->name;
    $product->slug = $request->slug;
    $product->price = $request->price;
    $product->description = $request->description;
    $product->image = $imagePath;
    $product->save();

    return redirect()->route('products.index') // ganti ke route yang sesuai
        ->with('success', 'Product created successfully.');
}


    // public function update(Request $request, Product $product)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255',
    //             // Slug must be unique, but ignore the current product's slug
    //             'slug' => 'required|string|unique:products,slug,' . $product->id . '|max:255',
    //             'price' => 'required|numeric|min:0',
    //             'description' => 'nullable|string',
    //             'image' => 'nullable|string', // Expecting URL/path for image on update
    //         ]);

    //         // Auto-generate slug if name changed and new slug is different from old slug (or empty)
    //         // This logic allows manual slug changes but regenerates if the name is changed and slug isn't
    //         if ($product->name !== $validatedData['name'] && $product->slug === $validatedData['slug']) {
    //             $validatedData['slug'] = Str::slug($validatedData['name']);
    //         }
    //         // If the user explicitly changes the slug, it will be used due to validation 'unique:products,slug,' . $product->id

    //         $product->update($validatedData);
    //         return response()->json(['message' => 'Product updated successfully!', 'product' => $product], 200);

    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'message' => 'Validation Error',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to update product: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

//     public function update(Request $request, Product $product)
// {
//     try {
//         $validatedData = $request->validate([
//             'name' => 'required|string|max:255',
//             'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
//             'price' => 'required|numeric|min:0',
//             'description' => 'nullable|string',
//             'image' => 'nullable|image|max:2048',
//         ]);

//         if ($request->hasFile('image')) {
//             // Hapus gambar lama jika ada
//             if ($product->getRawOriginal('image')) {
//                 Storage::delete($product->getRawOriginal('image'));
//             }

//             // Simpan gambar baru
//             $path = $request->file('image')->store('public/products');
//             $validatedData['image'] = $path;
//         }

//         $product->update($validatedData);

//         return back()->with('success', 'Product updated successfully!');
//     } catch (ValidationException $e) {
//         return back()->withErrors($e->errors())->withInput();
//     } catch (\Exception $e) {
//         return back()->with('error', 'Gagal memperbarui produk: ' . $e->getMessage());
//     }
// }


public function update(Request $request, Product $product)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $product->id . '|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Regenerasi slug jika nama berubah tapi slug tidak diubah
        if (
            $product->name !== $validatedData['name'] &&
            $product->slug === $validatedData['slug']
        ) {
            $validatedData['slug'] = Str::slug($validatedData['name']);
        }

        // Jika ada gambar baru diunggah
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image && Storage::exists('public/' . $product->image)) {
                Storage::delete('public/' . $product->image);
            }

            // Simpan gambar ke 'products' di disk 'public'
            $imagePath = $request->file('image')->store('products', 'public');
            $validatedData['image'] = $imagePath; // "products/namafile.jpg"
        }

        $product->update($validatedData);

    //     return response()->json([
    //         'message' => 'Produk berhasil diperbarui!',
    //         'product' => $product
    //     ]);

    // } catch (ValidationException $e) {
    //     return response()->json([
    //         'message' => 'Validasi gagal',
    //         'errors' => $e->errors()
    //     ], 422);
    // } catch (\Exception $e) {
    //     return response()->json([
    //         'message' => 'Gagal menyimpan produk: ' . $e->getMessage()
    //     ], 500);
    // }
      return Redirect::back()->with('success', 'Produk berhasil diperbarui.');
    } catch (ModelNotFoundException $e) {
        return Redirect::back()->with('error', 'Validasi gagal.');
    } catch (\Exception $e) {
        return Redirect::back()->with('error', 'Gagal menyimpan produk.');
    }
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product->delete();
        //     return response()->json(['message' => 'Product deleted successfully!'], 200);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'Failed to delete product: ' . $e->getMessage()
        //     ], 500);
        return Redirect::back()->with('success', 'Produk berhasil dihapus.');
    } catch (ModelNotFoundException $e) {
        return Redirect::back()->with('error', 'Produk tidak ditemukan.');
    } catch (\Exception $e) {
        return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus Produk.');
    }
}

    /**
     * Show the form for creating a new resource.
     */
//     public function create(): Response
//     {
//         return Inertia::render('product/create', [
//             "title" => "Tambah Produk Baru",
//         ]);
//     }


//     /**
//      * Store a newly created resource in storage.
//      */
//     public function store(ProductStore $request)
//     {
//         DB::transaction(function() use($request) {
//             $validated = $request->validated();
//             $validated['slug'] = Str::slug($validated['name']);
//             Product::create($validated);
//         });
//         return response()->json([
//             "message" => "Berhasil menambahkan produk!"
//         ], 201);
//     }

//     /**
//      * Display the specified resource.
//      */
//     public function show(Product $product)
//     {
//         //
//     }

//     /**
//      * Show the form for editing the specified resource.
//      */
//     public function edit(Product $product): Response
//     {
//         return Inertia::render('product/edit', [
//             "title" => "Edit Produk $product->name",
//             "product" => $product
//         ]);
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(Request $request, Product $product)
//     {
//         //
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(Product $product)
//     {
//         //
//     }
// }
}
