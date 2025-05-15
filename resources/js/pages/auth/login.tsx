import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 to-black p-4">
                <div className="bg-opacity-50 w-full max-w-md rounded-lg border-2 border-blue-700 bg-blue-900 p-8">
                    <div className="mb-6 text-center">
                        <img src="/logo.png" className="w-1/2 mx-auto block" alt="Cosmic Crystal Miner Logo" />
                        <h1 className="text-3xl font-bold text-white">Cosmic Crystal Miner</h1>
                        <p className="mt-2 text-blue-200">Log in to continue your mining journey</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <label className="block text-blue-200" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                    className="w-full rounded border border-blue-600 bg-blue-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-blue-200" htmlFor="password">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-sm text-blue-300 transition hover:text-white"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                    className="w-full rounded border border-blue-600 bg-blue-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-blue-600 bg-blue-800 text-purple-600 focus:ring-purple-500"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    tabIndex={3}
                                />
                                <label htmlFor="remember" className="text-blue-200">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 flex w-full items-center justify-center rounded bg-purple-700 px-4 py-2 text-white transition hover:bg-purple-600 disabled:opacity-75"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Enter Mining Station
                            </button>
                        </div>

                        <div className="text-center text-sm text-blue-300">
                            New space explorer?{' '}
                            <TextLink href={route('register')} tabIndex={6} className="text-purple-300 transition hover:text-white">
                                Create account
                            </TextLink>
                        </div>
                    </form>

                    {status && (
                        <div className="bg-opacity-50 mt-4 rounded border border-green-700 bg-green-900 p-2 text-center text-sm text-green-200">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
