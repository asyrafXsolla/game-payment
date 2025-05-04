<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CoinController;

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
