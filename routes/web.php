<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
