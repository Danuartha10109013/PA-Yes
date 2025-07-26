<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     return [
    //         'email' => ['required', 'string', 'email'],
    //         'password' => ['required', 'string'],
    //     ];
    // }

    public function rules(): array
{
    return [
        'email' => [
            'required',
            'string',
            'email',
            function ($attribute, $value, $fail) {
                if (strpos($value, '@') === false) {
                    $fail('Email harus mengandung karakter "@"');
                }
            },
        ],
        'password' => ['required', 'string'],
    ];
}

public function messages()
{
    return [
        'email.required' => 'Email wajib diisi!.',
        // 'email.email' => 'Format email tidak valid.',
        'email.email' => 'Email harus mengandung karakter "@" dan format valid.',
        'password.required' => 'Password wajib diisi!.',
    ];
}

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();

    //     if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'email' => trans('auth.failed'),
    //         ]);
    //     }

    //     RateLimiter::clear($this->throttleKey());
    // }

    public function authenticate(): void
{
    $this->ensureIsNotRateLimited();

    $email = $this->input('email');
    $password = $this->input('password');

    // Cek apakah user dengan email ini ada
    $user = \App\Models\User::where('email', $email)->first();

    if (!$user) {
        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => 'User tidak ditemukan.',
        ]);
    }

    // Jika user ada, cek password via attempt
    if (!Auth::attempt(['email' => $email, 'password' => $password], $this->boolean('remember'))) {
        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'password' => 'Password salah.',
        ]);
    }

    RateLimiter::clear($this->throttleKey());
}

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
