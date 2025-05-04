<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function generateToken(Request $request)
    {
        $request->validate([
            'sandbox' => 'required|boolean',
            'user' => 'required|array',
            'purchase' => 'required|array',
        ]);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode(env('XSOLLA_PROJECT_ID') . ':' . env('XSOLLA_API_KEY')),
        ])->post(env('XSOLLA_API_URL') . '/v3/project/' . env('XSOLLA_PROJECT_ID') . '/admin/payment/token', $request->all());

        if ($response->successful()) {
            return response()->json([
                'token' => $response->json('token'),
            ]);
        }

        return response()->json([
            'error' => 'Failed to generate token',
            'details' => $response->json(),
        ], 500);
    }

    public function xsollaWebhook(Request $request)
    {
        Log::info('Xsolla webhook received', [
            'payload' => $request->all(),
        ]);

        return response()->json(['status' => 'success']);
    }
}
