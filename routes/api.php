<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::withoutMiddleware([])->group(function () {
    Route::post('payment/webhook/xsolla', [PaymentController::class, 'xsollaWebhook'])
        ->name('payment.xsolla-webhook');
    Route::post('payment/webhook/xsolla-sdk', [PaymentController::class, 'xsollaSdkWebhook'])
        ->name('payment.xsolla-sdk-webhook');
});
