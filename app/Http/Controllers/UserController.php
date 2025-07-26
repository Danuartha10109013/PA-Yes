<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash; // For hashing passwords
use Illuminate\Support\Str;

class UserController extends Controller
{
     public function index()
    {
        // Get all users, ordered by their creation date in descending order.
        // We use makeHidden to ensure sensitive fields like 'password' and 'remember_token'
        // are not included in the JSON response sent to the frontend.
        $users = User::latest()->get()->makeHidden(['password', 'remember_token']);
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data.
        // 'email' must be unique in the 'users' table.
        // 'password' must be at least 8 characters long.
        // 'role' must be either 'admin' or 'sales' based on your enum.
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'sales'])],
        ]);

        // Create a new user record.
        // We manually generate a UUID for the 'id' as per your migration.
        // The password is automatically hashed by the User model's casts.
        $user = User::create([
            // 'id' => (string) Str::uuid(), // Generate UUID for the primary key
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Password will be hashed by model cast
            'role' => $request->role,
        ]);

        // Return a success message and the newly created user (with sensitive fields hidden).
        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan!',
            'user' => $user->makeHidden(['password', 'remember_token'])
        ], 201); // 201 Created status for successful resource creation
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Return a single user, hiding sensitive information.
        return response()->json($user->makeHidden(['password', 'remember_token']));
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, User $user)
    // {
    //     // Validate the incoming request data for updating a user.
    //     // 'email' unique rule ignores the current user's email, allowing updates without issues.
    //     // 'password' is now nullable, meaning it's optional for updates.
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => [
    //             'required',
    //             'string',
    //             'email',
    //             'max:255',
    //             // Rule::unique('users')->ignore($user->id), // Ignore current user's email
    //             Rule::unique('users', 'email')->ignore($user->id, 'id'),

    //         ],
    //         'password' => 'nullable|string|min:8', // Password is now nullable for update
    //         'role' => ['required', Rule::in(['admin', 'sales'])],
    //     ]);

    //     // Update user properties.
    //     $user->name = $request->name;
    //     $user->email = $request->email;
    //     $user->role = $request->role;

    //     // Only update the password if a new one is provided in the request.
    //     if ($request->filled('password')) {
    //         $user->password = $request->password; // Password will be hashed by model cast
    //     }

    //     // Save the changes to the database.
    //     $user->save();

    //     // Return a success message and the updated user (with sensitive fields hidden).
    //     return response()->json([
    //         'message' => 'Pengguna berhasil diperbarui!',
    //         'user' => $user->makeHidden(['password', 'remember_token'])
    //     ]);
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(User $user)
    // {
    //     // Delete the user record.
    //     // Because your migration has softDeletes, this will set the 'deleted_at' timestamp
    //     // rather than permanently removing the record.
    //     $user->delete();

    //     // Return a success message.
    //     return response()->json(['message' => 'Pengguna berhasil dihapus!']);
    // }

//     public function update(Request $request, User $user)
// {


    // $request->validate([
    //     'name' => 'required|string|max:255',
    //     'email' => [
    //         'required',
    //         'string',
    //         'email',
    //         'max:255',
    //         Rule::unique('users', 'email')->ignore($user->id, 'id'),
    //     ],
    //     'password' => 'nullable|string|min:8',
    //     'role' => ['required', Rule::in(['admin', 'sales'])],
    // ]);

    // $user->name = $request->name;
    // $user->email = $request->email;
    // $user->role = $request->role;

    // if ($request->filled('password')) {
    //     $user->password = Hash::make($request->password);
    // }

    // $user->save();

    // return response()->json([
    //     'message' => 'Pengguna berhasil diperbarui!',
    //     'user' => $user->makeHidden(['password', 'remember_token'])
    // ]);
    public function update(Request $request, $id)
    {
        // Find user explicitly to debug route model binding issues
        $user = User::find($id);

        if (!$user) {
            Log::error("User not found for ID: {$id}");
            return response()->json(['message' => 'User not found'], 404);
        }

        Log::info("Updating user ID: {$user->id}");
        Log::info('Request payload:', $request->all());

        // Validate input, ignore unique email for current user ID
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
            'role' => ['required', Rule::in(['admin', 'sales'])],
        ]);

        // Update fields
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = $request->password; // hashed by model cast
        }

        $user->save();

        Log::info('User updated successfully', ['user_id' => $user->id]);

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui!',
            'user' => $user->makeHidden(['password', 'remember_token']),
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus!']);
    }
}


