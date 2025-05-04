<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CoinController;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return redirect('game');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // return Inertia::render('dashboard');
        return redirect()->route('game');
    })->name('dashboard');

    Route::get('game', function () {
        return Inertia::render('game');
    })->name('game');

    Route::get('coins', [CoinController::class, 'get'])->name('coins.get');
    Route::post('coins', [CoinController::class, 'update'])->name('coins.update');

    Route::post('payment/generate-token', [PaymentController::class, 'generateToken'])
        ->name('payment.generate-token');
});

Route::match(['get', 'post'], 'payment/webhook/xsolla', [PaymentController::class, 'xsollaWebhook'])
    ->name('payment.xsolla-webhook')
    ->withoutMiddleware(['web', 'csrf']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
