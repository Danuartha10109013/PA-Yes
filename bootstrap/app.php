<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    // ->withMiddleware(function (Middleware $middleware) {
    // //     $middleware->web(append: [
    // //         \App\Http\Middleware\HandleInertiaRequests::class,
    // //         \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,


    // //     ]);

    // //     $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

    // //     $middleware->web(append: [
    // //         HandleAppearance::class,
    // //         HandleInertiaRequests::class,
    // //         AddLinkHeadersForPreloadedAssets::class,

    //         $middleware->web(append: [
    //         \App\Http\Middleware\HandleAppearance::class,
    //         \App\Http\Middleware\HandleInertiaRequests::class,
    //         \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    //     ]);
    // //     ]);
    // })



    // ->withExceptions(function (Exceptions $exceptions) {
    //     //
    // })
    // ->withMiddleware(function ($middleware) {
    //     $middleware->alias([
    //     'role' => \App\Http\Middleware\RoleMiddleware::class,
    //     ]);
    //     })

    ->withMiddleware(function (Middleware $middleware) {
        // Tambahkan middleware web (Inertia, etc)
        $middleware->web(append: [
            \App\Http\Middleware\HandleAppearance::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Alias middleware kustom seperti 'role'
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })

    ->create();
