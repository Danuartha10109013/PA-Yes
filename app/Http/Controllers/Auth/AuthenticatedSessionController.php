<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
// public function store(LoginRequest $request): RedirectResponse
// {
//     $request->authenticate();

//     $request->session()->regenerate();

//     $user = Auth::user();

//     if ($user->role === 'admin') {
//         return redirect()->route('dashboard.admin'); // misal ke dashboard admin
//     } elseif ($user->role === 'sales') {
//         return redirect()->route('dashboard'); // misal ke halaman sales
//     }

//     return redirect('/'); // fallback jika role tidak dikenali
// }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }


    public function store(LoginRequest $request): RedirectResponse
{
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if (strtolower($user->role) === 'admin') {
        return redirect('/dashboard/admin');
        } elseif (strtolower($user->role) === 'sales') {
        return redirect('/dashboard');
        }

        return redirect('/');
        }
}
