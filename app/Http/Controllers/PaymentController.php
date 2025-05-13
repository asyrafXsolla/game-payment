<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Xsolla\SDK\Webhook\Message\Message;
use Xsolla\SDK\Webhook\Message\NotificationTypeDictionary;
use Xsolla\SDK\Webhook\WebhookAuthenticator;
use Xsolla\SDK\Webhook\WebhookRequest as XsollaRequest;

class PaymentController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function xsollaWebhook(Request $request)
    {
        $headers = $request->headers->all();
        $body = $request->all();

        Log::info('Xsolla webhook received', [
            'headers' => $headers,
            'body' => $body,
        ]);

        if (!isset($headers['authorization'][0])) {
            return response()->json(['error' => 'Authorization header missing'], 403);
        }

        // Authenticate webhook by checking the signature
        $matches = [];
        preg_match('~^Signature ([0-9a-f]{40})$~', $headers['authorization'][0], $matches);
        if (array_key_exists(1, $matches)) {
            $clientSignature = $matches[1];
        } else {
            return response()->json([
                'error' => [
                    'code' => 'INVALID_SIGNATURE',
                    'message' => 'Signature not found in "Authorization" header from Xsolla webhook request: ' . $headers['authorization'],
                ]
            ], 403);
        }

        $expectedSignature = sha1(json_encode($body) . env('XSOLLA_WEBHOOK_SECRET'));        
        if (!hash_equals($clientSignature, $expectedSignature)) {
            return response()->json([
                'error' => [
                    'code' => 'INVALID_SIGNATURE',
                    'message' => 'Invalid signature',
                ]
            ], 403);
        }

        // Differentiate the notification type (user_validation, order_paid)
        $notificationType = $body['notification_type'] ?? null;
        switch ($notificationType) {
            case 'user_validation':
                // Handle user validation
                $user = $body['user'] ?? null;
                if (!$user) {
                    return response()->json([
                        'error' => [
                            'code' => 'INVALID_USER',
                            'message' => 'User not found in the request'
                        ]
                    ], 400);
                }

                $userId = explode('_', $user['id'])[2] ?? null;
                if (! User::where('id', $userId)->exists()) {
                    return response()->json([
                        'error' => [
                            'code' => 'INVALID_USER',
                            'message' => 'Invalid user ID'
                        ]
                    ], 400);
                }
                break;
            case 'order_paid':
                // Handle order paid
                (new PaymentService())->processOrderPaid($body);
                break;
            case 'payment':
                // Handle payment
                break;
            default:
                return response()->json(['error' => 'Unknown notification type'], 400);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function xsollaSdkWebhook(Request $request)
    {
        $message = Message::fromArray($request->toArray());

        $webhookAuthenticator = new WebhookAuthenticator(env('XSOLLA_WEBHOOK_SECRET'));
        try {
            $webhookAuthenticator->authenticate(XsollaRequest::fromGlobals(), false);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'code' => 'INVALID_SIGNATURE',
                    'message' => $e->getMessage()
                ]
            ], 403);
        }

        switch ($message->getNotificationType()) {
            case NotificationTypeDictionary::USER_VALIDATION:
                $user = $request['user'] ?? null;
                if (!$user) {
                    return response()->json([
                        'error' => [
                            'code' => 'INVALID_USER',
                            'message' => 'User not found in the request'
                        ]
                    ], 400);
                }

                $userId = explode('_', $user['id'])[2] ?? null;
                if (! User::where('id', $userId)->exists()) {
                    return response()->json([
                        'error' => [
                            'code' => 'INVALID_USER',
                            'message' => 'Invalid user ID'
                        ]
                    ], 400);
                }

                break;
            case NotificationTypeDictionary::ORDER_PAID:
                (new PaymentService())->processOrderPaid($request->toArray());
            case NotificationTypeDictionary::PAYMENT:
                /** @var Xsolla\SDK\Webhook\Message\PaymentMessage $message */
                break;
            case NotificationTypeDictionary::REFUND:
                /** @var Xsolla\SDK\Webhook\Message\RefundMessage $message */
                break;
            default:
                throw new \Exception('Notification type not implemented');
        }

        return response()->json(['status' => 'success']);
    }
}
