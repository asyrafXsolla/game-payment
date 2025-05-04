import React from 'react';

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
}

const coinPackages: CoinPackage[] = [
    {
        id: 1,
        name: "Small Crystal Pack",
        amount: 1000,
        price: "$0.99",
        description: "Start your mining journey with 1,000 coins"
    },
    {
        id: 2,
        name: "Medium Crystal Pack",
        amount: 10000,
        price: "$4.99",
        description: "Power up with 10,000 coins"
    },
    {
        id: 3,
        name: "Massive Crystal Pack",
        amount: 100000,
        price: "$19.99",
        description: "Become a mining tycoon with 100,000 coins"
    }
];

export default function Store({ coins, setCoins }: StoreProps) {
    const handlePurchase = (pack: CoinPackage) => {
        // This will be replaced with Xsolla integration later
        alert(`In the future, you'll be redirected to Xsolla payment for ${pack.name}`);
    };

    return (
        <div className="bg-blue-900 bg-opacity-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Cosmic Crystal Store</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coinPackages.map(pack => (
                    <div
                        key={pack.id}
                        className="bg-blue-800 rounded-lg p-4 flex flex-col border-2 border-blue-700 hover:border-purple-500 transition"
                    >
                        <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
                        <div className="text-yellow-400 font-bold text-2xl mb-2">
                            {pack.amount.toLocaleString()} coins
                        </div>
                        <p className="text-gray-300 mb-4 flex-grow">{pack.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">{pack.price}</span>
                            <button
                                onClick={() => handlePurchase(pack)}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
