<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Process a paid order from Xsolla webhook
     *
     * @param array $data The webhook payload data
     * @return bool Success indicator
     */
    public function processOrderPaid(array $data): bool
    {
        $userId = $data['user']['external_id'] ?? null;
        $transactionId = $data['transaction']['id'] ?? null;

        if (!$userId) {
            Log::error('Missing required payment data', ['data' => $data]);
            return false;
        }

        return DB::transaction(function() use ($data, $userId, $transactionId) {
            // Find user
            $user = User::find(explode('_', $userId)[2] ?? null);
            if (!$user) {
                Log::error('User not found for payment', ['user_id' => $userId]);
                return false;
            }

            // Award virtual currency or items based on purchase
            $items = $data['items'] ?? [];
            foreach ($items as $item) {
                $itemSku = $item['sku'] ?? null;
                if ($itemSku) {
                    $this->awardItemToUser($user, $itemSku);
                }
            }

            Log::info('Payment processed successfully', [
                'user_id' => $userId,
                'transaction_id' => $transactionId
            ]);

            return true;
        });
    }

    /**
     * Award items or currency to user based on purchased SKU
     *
     * @return void
     */
    private function awardItemToUser(User $user, string $sku): void
    {
        // Map SKUs to rewards
        $rewards = [
            'small-crystal-pack' => 1000,
            'medium-crystal-pack' => 10000,
            'massive-crystal-pack' => 100000
        ];

        if (isset($rewards[$sku])) {
            $amount = $rewards[$sku];
            $user->coins += $amount;
            $user->save();

            Log::info("Added $amount coins to user {$user->id}");
        }
    }
}
