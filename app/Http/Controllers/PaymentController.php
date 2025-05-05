<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function generateToken(Request $request)
    {
        $validatedInputs = $request->validate([
            'user' => 'required|array',
            'purchase' => 'required|array',
        ]);

        $authToken = 'Basic ' . base64_encode(env('XSOLLA_PROJECT_ID') . ':' . env('XSOLLA_API_KEY'));
        $endpoint = env('XSOLLA_API_URL') . '/v3/project/' . env('XSOLLA_PROJECT_ID') . '/admin/payment/token';
        $payload = array_merge($validatedInputs, [
            'sandbox' => true,
            'settings' => [
                'return_url' => env('XSOLLA_RETURN_URL'),
            ],
        ]);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => $authToken,
        ])->post($endpoint, $payload);

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
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        return response()->json(['status' => 'success']);
    }
}
