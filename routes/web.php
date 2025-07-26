<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ColumnsController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SegmentasiPasarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\transactionlog;
use App\Models\Product;
use App\Models\SegmentasiPasar;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use app\Http\Middleware\HandleInertiaRequests;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'can' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
// Route::get('/dashboard/admin', function () {
//     return Inertia::render('Admin/Dashboard/index');
// })->middleware(['auth', 'verified'])->name('dashboard.admin');


// Route::get('/contactscount', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('contactscount');

// // Route::get('/contactscount', [ContactController::class, 'data']);

// Route::get('/contactscount', [DashboardController::class, 'contact'])
//     ->middleware(['auth', 'verified'])
//     ->name('contactscount');

// Route::get('/sectorscount', [DashboardController::class, 'sector'])
//     ->middleware(['auth', 'verified'])
//     ->name('sectorscount');

// Route::get('/leadscount', [DashboardController::class, 'leads'])
//     ->middleware(['auth', 'verified'])
//     ->name('leadscount');

// Route::get('/manageleads', function () {
//     return Inertia::render('Manageleads/index');
// })->middleware(['auth', 'verified'])->name('manageleads');

// Route::get('/contact', function () {
//     return Inertia::render('Contact/index');
// })->middleware(['auth', 'verified'])->name('contact');

// Route::get('/kanban', function () {
//     return Inertia::render('Transaction/index');
// })->middleware(['auth', 'verified'])->name('kanban');

// Route::get('/produk', function () {
//     return Inertia::render('product');
// })->middleware(['auth', 'verified'])->name('produk');

// Route::get('/lead', function () {
//         return Inertia::render('Manageleads'); // harus cocok dengan nama file
//     })->name('lead');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('yesi', function () {
    return 'yesi';
});
// Route::get('/lead', function () {
//     return view ('Manageleads');
// });
require __DIR__.'/auth.php';


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/contacts', [ContactController::class, 'index'])->name('Contact.index');
//     Route::post('/contacts', [ContactController::class, 'store']);
//     Route::get('/contacts/{contact}', [ContactController::class, 'show']); // Use {contact} to leverage implicit model binding
//     Route::put('/contacts/{contact}', [ContactController::class, 'edit']); // Your custom update method name
//     Route::delete('/contacts/{contact}', [ContactController::class, 'delete']); // Your custom delete method name
// });


// Route::middleware(['auth', 'verified'])->group(function () {
//     // Inertia page render
//     Route::get('/contacts-page', function () {
//         return Inertia::render('Contact/index'); // Sesuaikan dengan struktur folder dan nama file di resources/js/Pages
//     })->name('contacts.page');

//     // API endpoints
//     Route::get('/contacts', [ContactController::class, 'index'])->name('Contact.index');
//     Route::post('/contacts', [ContactController::class, 'store']);
//     Route::get('/contacts/{contact}', [ContactController::class, 'show']);
//     Route::put('/contacts/{contact}', [ContactController::class, 'edit']);
//     Route::delete('/contacts/{contact}', [ContactController::class, 'delete']);
// });


// Route::middleware(['auth', 'verified'])->group(function () {
//     // Inertia page render
//     Route::get('/sectors-page', function () {
//         return Inertia::render('sector/index'); // Sesuaikan dengan struktur folder dan nama file di resources/js/Pages
//     })->name('sectors.page');

//     // API endpoints
//     Route::get('/sector', [SectorController::class, 'index'])->name('sector.index');
    // Route::get('/sectors', [SectorController::class, 'data'])->name('sector.index');
//     Route::post('/sectors', [SectorController::class, 'store']);
//     Route::get('/sectors/{sector}', [SectorController::class, 'show']);
//     Route::put('/sectors/{sector}', [SectorController::class, 'edit']);
//     Route::delete('/sector/{sector}', [SectorController::class, 'delete']);
// });


// Route::middleware(['auth', 'verified'])->group(function () {
//     // Inertia pages
//     Route::get('/contacts-page', fn() => Inertia::render('Contact/index'))->name('contacts.page');
//     Route::get('/sectors-page', fn() => Inertia::render('sector/index'))->name('sectors.page');

//     // API endpoints
//     Route::get('/contacts', [ContactController::class, 'index']);
//     Route::post('/contacts', [ContactController::class, 'store']);
//     Route::get('/contacts/{id}', [ContactController::class, 'show']);
//     Route::put('/contacts/{id}', [ContactController::class, 'update']);
//     Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

//     // Route::get('/sectors', [SectorController::class, 'index']);
//     Route::get('/sectors', [SectorController::class, 'data'])->name('sector.index');
//     Route::post('/sectors', [SectorController::class, 'store']);
//     Route::get('/sectors/{id}', [SectorController::class, 'show']);
//     Route::put('/sectors/{id}', [SectorController::class, 'update'])->name('sectors.update');;
//     Route::delete('/sectors/{id}', [SectorController::class, 'destroy'])->name('contacts.destroy');
// });


// Route::middleware(['auth', 'verified'])->group(function () {
// Route::get('/kanban-leads', fn() => Inertia::render('Kanban/index'))->name('kanban.leads');
// Route::get('/list-leads', fn() => Inertia::render('Kanban/list'))->name('list.leads');
// Route::get('/kanban/leads', [TransactionController::class, 'index']);
// Route::get('/listleads', [TransactionController::class, 'data']);
// Route::put('/kanban/leads/update-column', [TransactionController::class, 'updateLeadColumn']);
// Route::put('/kanban/leads/{id}', [TransactionController::class, 'update']);
// Route::post('/kanban/leads', [TransactionController::class, 'store']);
// Route::delete('/kanban/leads/{id}', [TransactionController::class, 'destroy'])->name('kanban.destroy');

// });

// Route::get('/test-kanban-data', function () {
//     $controller = new \App\Http\Controllers\TransactionController(); // Replace with your actual controller name
//     return $controller->index();
// });



// // Route::middleware(['auth', 'verified'])->group(function () {
// // Route::get('/products-page', fn() => Inertia::render('product/index'))->name('kanbab.leads');
// // Route::get('/products', [ProductController::class, 'data'])->name('products.index');
// // // Route::get('/products', [ProductController::class, 'index']);
// // Route::put('/products/{id)', [ProductController::class, 'update']);
// // Route::post('/products/{id)', [ProductController::class, 'store']);

// // });

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/products-page', fn() => Inertia::render('product/index'))->name('products.page'); // Corrected name
//     Route::get('/products', [ProductController::class, 'data'])->name('products.index');
//     Route::post('/products', [ProductController::class, 'store'])->name('products.store'); // Removed {id} for store
//     Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // Changed {id} to {product} for implicit binding and fixed typo
//     Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // Added delete route for completeness
// });

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/reports-page', fn() => Inertia::render('Report/index'))->name('products.page'); // Corrected name
//     Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
//     Route::get('/reports-arsip', [ReportController::class, 'index'])->name('reports.index');
//     Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
//     Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);
//     // Route::post('/products', [ProductController::class, 'storeTransaction'])->name('products.store'); // Removed {id} for store
//     // Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // Changed {id} to {product} for implicit binding and fixed typo
//     // Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // Added delete route for completeness
// });
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/SegmentasiPasar', fn() => Inertia::render('SegmentasiPasar/index'))->name('segmentasi.page'); // Corrected name
//     Route::get('/segmentasi', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');
//     // Route::post('/products', [ProductController::class, 'storeTransaction'])->name('products.store'); // Removed {id} for store
//     // Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // Changed {id} to {product} for implicit binding and fixed typo
//     // Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // Added delete route for completeness
// });

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/KelolaUser', fn() => Inertia::render('Admin/KelolaUser/index'))->name('user.page'); // Corrected name
//     Route::get('/users', [UserController::class, 'index'])->name('users.index');
//     Route::post('/users', [UserController::class, 'store'])->name('users.store'); // Removed {id} for store
//     Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update'); // Changed {id} to {product} for implicit binding and fixed typo
//     Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy'); // Added delete route for completeness
// });


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
Route::get('/dashboard/admin', fn() => Inertia::render('Admin/Dashboard/index'))->name('dashboard.admin');

Route::get('/KelolaUser', fn() => Inertia::render('Admin/KelolaUser/index'))->name('user.page');
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

Route::get('/admin/reports', fn() => Inertia::render('Admin/Report/index'))->name('reports.page');
Route::get('/admin/report', [ReportController::class, 'index'])->name('reports.index');
Route::get('/reports-arsip', [ReportController::class, 'index']);
Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);
Route::get('/admin/SegmentasiPasar', [AdminController::class, 'segmentasi']);

// Route::get('/admin/SegmentasiPasar', fn() => Inertia::render('Admin/Segmentasi/index'))->name('segmentasi.page');
});


Route::middleware(['auth', 'verified', 'role:sales'])->group(function () {
Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
Route::get('/kanban-leads', fn() => Inertia::render('Kanban/index'))->name('Kanban.leads');
Route::get('/arsip-leads', fn() => Inertia::render('Leads/index'))->name('arsip.leads');
Route::get('/list-leads', fn() => Inertia::render('Kanban/list'))->name('list.leads');
Route::get('/kanban', fn() => Inertia::render('Kanban/index'))->name('kanban');
Route::get('/manageleads', fn() => Inertia::render('Manageleads/index'))->name('manageleads');

Route::get('/contacts-page', fn() => Inertia::render('Contact/index'))->name('contacts.page');
Route::get('/sectors-page', fn() => Inertia::render('sector/index'))->name('sectors.page');
Route::get('/products-page', fn() => Inertia::render('product/index'))->name('products.page');
Route::get('/reports-page', fn() => Inertia::render('Report/index'))->name('reports.page');
Route::get('/reports-arsip', fn() => Inertia::render('Report/arsip'))->name('reports.arsip');
});

Route::middleware(['auth', 'verified', 'role:sales'])->group(function () {
Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);
Route::post('/contacts/import', [ContactController::class, 'import'])->name('contacts.import');
Route::post('/addleads', [ContactController::class, 'addleads']);
Route::get('/contacts/{id}', [ContactController::class, 'show']);
Route::put('/contacts/{id}', [ContactController::class, 'update']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

// Route::get('/sectors', [SectorController::class, 'data'])->name('sector.index');
Route::get('/sectors', [SectorController::class, 'index'])->name('sector.index');
Route::post('/sectors', [SectorController::class, 'store']);
Route::get('/sectors/{id}', [SectorController::class, 'show']);
Route::put('/sectors/{id}', [SectorController::class, 'update'])->name('sectors.update');
Route::delete('/sectors/{id}', [SectorController::class, 'destroy'])->name('contacts.destroy');

// Route::get('/products', [ProductController::class, 'data'])->name('products.index');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
Route::get('/kanban-leads', fn() => Inertia::render('Kanban/index'))->name('kanban.leads');
Route::get('/list-leads', fn() => Inertia::render('Kanban/list'))->name('list.leads');

Route::get('/kanban/leads', [TransactionController::class, 'index'])->name('kanban.index');
Route::get('/list/leads', [TransactionController::class, 'list'])->name('List.index');
Route::get('/leads/arsip', [TransactionController::class, 'arsip'])->name('List.arsip');
// Route::get('/leads/arsip?show=arsip', [TransactionController::class, 'arsip'])->name('List.arsip');
// Route::get('/kanban/leads?show=arsip', [TransactionController::class, 'list']);
Route::get('/listleads', [TransactionController::class, 'data']);
Route::put('/kanban/leads/update-column', [TransactionController::class, 'updateLeadColumn']);
Route::put('/kanban/leads/update-status/{id}', [TransactionController::class, 'updatestatus']);
Route::put('/kanban/leads/{id}', [TransactionController::class, 'update']);
Route::post('/kanban/leads', [TransactionController::class, 'store']);
Route::post('/add/leads', [TransactionController::class, 'addleads']);
Route::delete('/kanban/leads/{id}', [TransactionController::class, 'destroy'])->name('kanban.destroy');
Route::get('/log/transaction', [TransactionLog::class, 'index'])->name('log.transaction');

Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
// Route::get('/reports?show=arsip', [ReportController::class, 'index']);
// Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
// Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);

Route::get('/SegmentasiPasar', fn() => Inertia::render('SegmentasiPasar/index'))->name('segmentasi.page');
// Route::get('/SegmentasiPasar/arsip', fn() => Inertia::render('SegmentasiPasar/arsip'))->name('segmentasi.arsip');
// Route::get('/segmentasi', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');
// Route::get('/segmentasi?show=arsip', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');
// Route::get('/segmentasi/averages', [SegmentasiPasarController::class, 'getAverages']);

// Route::get('/segmentasi/export-pdf', [SegmentasiPasarController::class, 'exportPdf']);
// Route::get('/segmentasi/export-excel', [SegmentasiPasarController::class, 'exportExcel']);



Route::get('/columns', [ColumnsController::class, 'index'])->name('columns.index');
Route::post('/columns', [ColumnController::class, 'store'])->name('columns.store');
Route::put('/columns/{id}', [ColumnController::class, 'update'])->name('columns.update');
Route::delete('/columns/{id}', [ColumnController::class, 'destroy'])->name('columns.destroy');
Route::post('/columns/{id}/duplicate', [ColumnController::class, 'duplicate'])->name('columns.duplicate');
Route::get('/segment', [DashboardController::class, 'segmentasi'])->name('segment');



});

Route::middleware(['auth', 'verified', 'role:admin,sales'])->group(function () {
Route::get('/segmentasi', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');

// Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
// Route::get('/reports-arsip', [ReportController::class, 'index']);
// Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
// Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);
});


Route::middleware(['auth', 'verified', 'role:admin,sales'])->group(function () {
Route::get('/contactscount', [DashboardController::class, 'contact'])->name('contactscount');
Route::get('/sectorscount', [DashboardController::class, 'sector'])->name('sectorscount');
Route::get('/leadscount', [DashboardController::class, 'leads'])->name('leadscount');
Route::get('/productcount', [DashboardController::class, 'product'])->name('productcount');
Route::get('/reports/grand-total-this-month', [DashboardController::class, 'totalpenjualan'])->name('productcount');
Route::get('/crm-status', [DashboardController::class, 'getCrmStatus'])->name('persentase.crm');
Route::get('/segment', [DashboardController::class, 'segmentasi'])->name('segment');

Route::get('/manageleads', fn() => Inertia::render('Manageleads/index'))->name('manageleads');
Route::get('/contact', fn() => Inertia::render('Contact/index'))->name('contact');
Route::get('/kanban', fn() => Inertia::render('Transaction/index'))->name('kanban');
Route::get('/produk', fn() => Inertia::render('product'))->name('produk');
Route::get('/lead', fn() => Inertia::render('Manageleads'))->name('lead');

Route::get('/reports?show=arsip', [ReportController::class, 'index']);
Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);


Route::get('/segmentasi/export-pdf', [SegmentasiPasarController::class, 'exportPdf']);
Route::get('/segmentasi/export-excel', [SegmentasiPasarController::class, 'exportExcel']);


Route::get('/SegmentasiPasar/arsip', fn() => Inertia::render('SegmentasiPasar/arsip'))->name('segmentasi.arsip');
Route::get('/segmentasi', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');
Route::get('/segmentasi?show=arsip', [SegmentasiPasarController::class, 'index'])->name('segmentasi.index');
Route::get('/segmentasi/averages', [SegmentasiPasarController::class, 'getAverages']);
});


Route::get('/cek-user', function (Illuminate\Http\Request $request) {
    dd($request->user());
})->middleware('auth');
