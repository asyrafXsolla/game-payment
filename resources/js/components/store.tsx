import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface StoreProps {
    coins: number;
    setCoins: React.Dispatch<React.SetStateAction<number>>;
}

interface CoinPackage {
    id: number;
    name: string;
    amount: number;
    price: string;
    description: string;
    sku: string;
}

const coinPackages: CoinPackage[] = [
    {
        id: 1,
        name: 'Small Crystal Pack',
        amount: 1000,
        price: '$0.99',
        description: 'Start your mining journey with 1,000 coins',
        sku: 'small-crystal-pack',
    },
    {
        id: 2,
        name: 'Medium Crystal Pack',
        amount: 10000,
        price: '$4.99',
        description: 'Power up with 10,000 coins',
        sku: 'medium-crystal-pack',
    },
    {
        id: 3,
        name: 'Massive Crystal Pack',
        amount: 100000,
        price: '$19.99',
        description: 'Become a mining tycoon with 100,000 coins',
        sku: 'massive-crystal-pack',
    },
];

export default function Store({ coins, setCoins }: StoreProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<CoinPackage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = usePage().props as any;

    const generateXsollaToken = async (pack: CoinPackage) => {
        try {
            setIsLoading(true);

            const payload = {
                sandbox: true,
                user: {
                    id: {
                        value: 'user_id_'.concat(auth.user.id),
                    },
                    name: {
                        value: auth.user.name,
                    },
                    email: {
                        value: auth.user.email,
                    },
                    country: {
                        value: 'MY',
                        allow_modify: false,
                    },
                },
                purchase: {
                    items: [
                        {
                            sku: pack.sku,
                            quantity: 1,
                        },
                    ],
                },
            };

            // Call your backend endpoint to generate the token
            const response = await axios.post(route('payment.generate-token'), payload);

            // Open the Xsolla payment page in a new tab
            if (response.data?.token) {
                const paymentUrl = `https://sandbox-secure.xsolla.com/paystation4/?token=${response.data.token}`;
                window.open(paymentUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to generate Xsolla token', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = (pack: CoinPackage) => {
        setSelectedPack(pack);
        setIsModalOpen(true);
    };

    const confirmPurchase = () => {
        if (selectedPack) {
            generateXsollaToken(selectedPack);
        }
    };

    return (
        <div className="bg-opacity-50 rounded-lg bg-blue-900 p-6">
            <h2 className="mb-6 text-center text-2xl font-bold">Cosmic Crystal Store</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {coinPackages.map((pack) => (
                    <div
                        key={pack.id}
                        className="flex flex-col rounded-lg border-2 border-blue-700 bg-blue-800 p-4 transition hover:border-purple-500"
                    >
                        <h3 className="mb-2 text-xl font-bold">{pack.name}</h3>
                        <div className="mb-2 text-2xl font-bold text-yellow-400">{pack.amount.toLocaleString()} coins</div>
                        <p className="mb-4 flex-grow text-gray-300">{pack.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">{pack.price}</span>
                            <button onClick={() => handlePurchase(pack)} className="rounded-lg bg-green-600 px-4 py-2 transition hover:bg-green-500">
                                Purchase
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Purchase Confirmation Modal */}
            {isModalOpen && (
                <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="w-full max-w-md rounded-lg border-2 border-blue-600 bg-blue-800 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Confirm Purchase</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="mb-4 text-blue-200">
                                You are about to purchase {selectedPack?.name} for {selectedPack?.price}.
                            </p>
                            <div className="rounded-md border border-blue-700 bg-blue-900 p-4">
                                <p className="font-medium text-yellow-300">Important:</p>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-200">
                                    <li>A new tab will open for the payment process</li>
                                    <li>Please do not close your browser during payment</li>
                                    <li>After successful payment, return to this page</li>
                                    <li>This is a sandbox environment - use <span className="text-green-300">test cards</span> for payment</li>
                                    <li>Sample test cards available at:
                                        <a
                                            href="https://developers.xsolla.com/solutions/payments/testing/test-cards/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-1 text-purple-300 underline hover:text-purple-200"
                                        >
                                            Xsolla Test Cards
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded bg-gray-700 px-4 py-2 transition hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPurchase}
                                disabled={isLoading}
                                className="flex items-center rounded bg-green-600 px-4 py-2 transition hover:bg-green-500"
                            >
                                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
