import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Store from '../components/store';
import axios from 'axios';

export default function Game() {
    const [coins, setCoins] = useState(0);
    const [clickPower] = useState(1);
    const [showStore, setShowStore] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { auth } = usePage().props as unknown as {
        auth: { user: { id: number; name: string; email: string; coins?: number } };
    };

    useEffect(() => {
        loadCoins();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveCoins();
        }, 2000);

        return () => clearTimeout(timer);
    }, [coins]);

    const loadCoins = async () => {
        try {
            const response = await axios.get(route('coins.get'));
            setCoins(response.data.coins);
        } catch (error) {
            console.error('Failed to load coins', error);
        }
    };

    const saveCoins = async () => {
        try {
            await axios.post(route('coins.update'), { coins });
        } catch (error) {
            console.error('Failed to save coins', error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleClick = () => {
        setCoins((prev) => prev + clickPower);
    };

    return (
        <>
            <Head title="Cosmic Crystal Miner" />
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
                {/* Header */}
                <header className="flex items-center justify-between bg-blue-800 p-4">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <img src="/logo.png" alt="game-logo" width="50" />
                        <span className="text-lg font-bold">Cosmic Crystal Miner</span>
                    </Link>
                    {/* <h1 className="text-xl font-bold">Cosmic Crystal Miner</h1> */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-full bg-yellow-600 px-3 py-1">
                            <span className="mr-1">💰</span>
                            <span className="font-bold">{coins.toLocaleString()}</span>
                        </div>
                        <button
                            className="rounded-lg bg-purple-700 px-4 py-2 transition hover:bg-purple-600"
                            onClick={() => setShowStore(!showStore)}
                        >
                            {showStore ? 'Close Store' : 'Store'}
                        </button>

                        {/* Profile with initials */}
                        <div className="relative">
                            <button className="flex items-center gap-2" onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-500 bg-blue-600 font-bold text-white">
                                    {getInitials(auth.user.name)}
                                </div>
                                <span className="hidden text-sm md:inline">{auth.user.name}</span>
                            </button>

                            {showDropdown && (
                                <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-md border border-blue-700 bg-blue-800 shadow-lg">
                                    <div className="border-b border-blue-700 p-3">
                                        <p className="text-sm font-medium">{auth.user.name}</p>
                                        <p className="text-xs text-blue-300">{auth.user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center rounded px-4 py-2 text-left text-sm transition hover:bg-purple-700"
                                        >
                                            <span className="mr-2">🚀</span> Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="container mx-auto p-4">
                    {showStore ? (
                        <Store coins={coins} setCoins={setCoins} />
                    ) : (
                        <div className="mt-20 flex flex-col items-center justify-center">
                            <img src="/logo.png" alt="game-logo" width="25%"/>
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-2xl">Click the crystal below to mine coins!</h2>
                                <p className="text-gray-300">
                                    Each click earns you {clickPower} coin{clickPower > 1 ? 's' : ''}
                                </p>
                            </div>

                            <button
                                onClick={handleClick}
                                className="crystal-btn relative h-48 w-48 rounded-full transition-transform hover:scale-105 active:scale-95"
                            >
                                <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500 opacity-50"></div>
                                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-purple-300">
                                    <span className="text-6xl">💎</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
