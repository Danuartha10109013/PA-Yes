<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;
class SectorController extends Controller
{

    //   public function index()
    // {
    //     // Retrieve all sectors, optionally paginated
    //     $sectors = Sector::get(); // Adjust pagination limit as needed
    //     return view('sectors.index', compact('sectors'));
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('sectors.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255|unique:sectors,name',
    //             'bg_color' => 'nullable|string|max:255', // Tailwind class, e.g., 'bg-blue-600'
    //             'text_color' => 'nullable|string|max:255', // Tailwind class, e.g., 'text-white'
    //         ]);

    //         $sector = Sector::create($validatedData);

    //         return redirect()->route('sectors.index')->with('success', 'Sector created successfully!');

    //     } catch (ValidationException $e) {
    //         return redirect()->back()->withErrors($e->errors())->withInput();
    //     } catch (\Exception $e) {
    //         return redirect()->back()->with('error', 'Failed to create sector: ' . $e->getMessage())->withInput();
    //     }
    // }

    //  public function store(Request $request)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255|unique:sectors,name',
    //             'bg_color' => 'nullable|string|max:255',
    //             'text_color' => 'nullable|string|max:255',
    //         ]);

    //         // If bg_color or text_color are null, Laravel's fill method will use model defaults or casts
    //         $sector = Sector::create($validatedData);

    //         return response()->json([
    //             'message' => 'Sector created successfully!',
    //             'sector' => $sector
    //         ], 201); // 201 Created
    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'message' => 'Validation Error',
    //             'errors' => $e->errors()
    //         ], 422); // 422 Unprocessable Entity
    //     } catch (\Exception $e) {
    //         // Catch any other unexpected errors and return JSON
    //         return response()->json([
    //             'message' => 'An error occurred: ' . $e->getMessage()
    //         ], 500); // 500 Internal Server Error
    //     }
    // }
    // /**
    //  * Display the specified resource.
    //  */
    // public function show(Sector $sector)
    // {
    //     return view('sectors.show', compact('sector'));
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(Sector $sector)
    // {
    //     return view('sectors.edit', compact('sector'));
    // }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255|unique:sectors,name',
        'bg_color' => 'nullable|string|max:255',
        'text_color' => 'nullable|string|max:255',
    ]);

    $sector = Sector::create($validatedData);

    return Redirect::back()->with('success', 'Sektor berhasil ditambahkan!');
}

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Sector $sector)
    // {
    //     try {
    //         $validatedData = $request->validate([
    //             'name' => 'required|string|max:255|unique:sectors,name,' . $sector->id,
    //             'bg_color' => 'nullable|string|max:255',
    //             'text_color' => 'nullable|string|max:255',
    //         ]);

    //         $sector->update($validatedData);

    //         return redirect()->route('sectors.index')->with('success', 'Sector updated successfully!');

    //     } catch (ValidationException $e) {
    //         return redirect()->back()->withErrors($e->errors())->withInput();
    //     } catch (\Exception $e) {
    //         return redirect()->back()->with('error', 'Failed to update sector: ' . $e->getMessage())->withInput();
    //     }
    // }

//     public function update(Request $request, $id)
// {
//     $request->validate([
//         'name' => 'required|string|max:255',
//         'bg_color' => 'nullable|string|max:255',
//         'text_color' => 'nullable|string|max:255',
//     ]);

//     $sector = Sector::findOrFail($id);
//     $sector->name = $request->name;
//     $sector->bg_color = $request->bg_color;
//     $sector->text_color = $request->text_color;
//     $sector->updated_at = now();
//     $sector->save();

//     return response()->json(['sector' => $sector]);
// }

//  public function update(Request $request, $id)
//     {
//         try {
//             $validatedData = $request->validate([
//                 'name' => 'required|string|max:255|unique:sectors,name,' . $id,
//                 'bg_color' => 'nullable|string|max:255',
//                 'text_color' => 'nullable|string|max:255',
//             ]);

//             $sector = Sector::findOrFail($id);

//             // Directly update the sector with validated data.
//             // The model's `updating` boot method will handle random colors
//             // if `bg_color` or `text_color` in $validatedData are empty/null.
//             $sector->update($validatedData);

//             return response()->json(['sector' => $sector], 200);
//         } catch (ValidationException $e) {
//             return response()->json([
//                 'message' => 'Validation Error',
//                 'errors' => $e->errors()
//             ], 422);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'message' => 'An error occurred: ' . $e->getMessage()
//             ], 500);
//         }
//     }

public function update(Request $request, $id): RedirectResponse
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:sectors,name,' . $id,
            'bg_color' => 'nullable|string|max:255',
            'text_color' => 'nullable|string|max:255',
        ]);

        $sector = Sector::findOrFail($id);
        $sector->update($validatedData);

        return redirect()
            ->back()
            ->with('success', 'Sektor berhasil diperbarui.');
    } catch (ValidationException $e) {
        return redirect()
            ->back()
            ->withErrors($e->errors())
            ->withInput();
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sector = Sector::findOrFail($id);
        $sector->delete();

        return Redirect::back()->with('success', 'Sektor berhasil dihapus!')
        ;
    }
    /**
     * Display a listing of the resource.
     */
    // public function index(): Response
    // {
    //     return Inertia::render('sector/page', [
    //         "title" => "List Sektor",
    //         "sectors" => Sector::all()
    //     ]);
    // }

     public function index(): Response
    {
        return Inertia::render('sector/index', [
            'title' => 'List Sektor',
            'sectors' => Sector::orderByDesc('created_at')->get(),
        ]);
    }

    public function data(): JsonResponse
    {
        // Eager load relasi 'sector' untuk menghindari N+1 query problem
       $sectors = Sector::all();
        return response()->json($sectors);


    }

    //  public function store(Request $request): JsonResponse
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255|unique:sectors,name',
    //         // 'bg_color' => 'nullable|string|max:255',
    //         // 'text_color' => 'nullable|string|max:255',
    //     ]);

    //     $sector = Sector::create($validatedData);

    //     return response()->json([
    //         'message' => 'Sector created successfully.',
    //         'sector' => $sector
    //     ], 201); // 201 Created
    // }

    // /**
    //  * Display the specified resource.
    //  * Menampilkan detail satu sektor.
    //  */
    // public function show(string $id): JsonResponse
    // {
    //     $sector = Sector::findOrFail($id);
    //     return response()->json($sector);
    // }

    // /**
    //  * Update the specified resource in storage.
    //  * Memperbarui data sektor yang ada.
    //  */
    // public function update (Request $request, string $id): JsonResponse
    // {
    //     $sector = Sector::findOrFail($id);

    //     $validatedData = $request->validate([
    //         'name' => 'sometimes|required|string|max:255|unique:sectors,name,' . $sector->id,
    //         // 'bg_color' => 'nullable|string|max:255',
    //         // 'text_color' => 'nullable|string|max:255',
    //     ]);

    //     $sector->update($validatedData);

    //     return response()->json([
    //         'message' => 'Sector updated successfully.',
    //         'sector' => $sector
    //     ]);
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  * Menghapus sektor (secara soft delete).
    //  */
    // public function destroy(string $id): JsonResponse
    // {
    //     $sector = Sector::findOrFail($id);
    //     $sector->delete(); // Menggunakan soft delete

    //     return response()->json(['message' => 'Sector deleted successfully.']);
    // }

}
