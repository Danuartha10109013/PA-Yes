<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;


class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // return [
        //     ...parent::share($request),
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        // ];
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : null,
            ],
        ]);
    }

    // public function share(Request $request): array
    // {
    //     return array_merge(parent::share($request), [
    //         'auth' => [
    //             'user' => fn () => $request->user(), // Ini penting
    //         ],
    //     ]);
    // }


    /**
     * Determine the current asset version.
     */
//     public function version(Request $request): ?string
//     {
//         return parent::version($request);
//     }

//     /**
//      * Define the props that are shared by default.
//      *
//      * @return array<string, mixed>
//      */
//     public function share(Request $request): array
//     {
//         return array_merge(parent::share($request), [
//             'auth' => [
//                 'user' => $request->user() ? [
//                     'id' => $request->user()->id,
//                     'name' => $request->user()->name,
//                     'email' => $request->user()->email,
//                     'role' => $request->user()->role, // Assuming you have a 'role' column
//                     // Add any other user attributes you need on the frontend here
//                 ] : null, // Pass null if no user is authenticated
//             ],
//             // If you are using Ziggy for route handling in your JS, uncomment or add this:
//             'ziggy' => fn () => [
//                 ...(new Ziggy())->toArray(),
//                 'location' => $request->url(),
//             ],
//         ]);
//     }
}
