import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 to-black p-4">
                <div className="bg-opacity-50 w-full max-w-md rounded-lg border-2 border-blue-700 bg-blue-900 p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-white">Join Cosmic Crystal Miner</h1>
                        <p className="mt-2 text-blue-200">Create an account to start your mining adventure</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <label className="block text-blue-200" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Full name"
                                    className="w-full rounded border border-blue-600 bg-blue-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <label className="block text-blue-200" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
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
                                <label className="block text-blue-200" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                    className="w-full rounded border border-blue-600 bg-blue-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <label className="block text-blue-200" htmlFor="password_confirmation">
                                    Confirm password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                    className="w-full rounded border border-blue-600 bg-blue-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 flex w-full items-center justify-center rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-500 disabled:opacity-75"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Create Space Explorer Account
                            </button>
                        </div>

                        <div className="text-center text-sm text-blue-300">
                            Already have an account?{' '}
                            <TextLink href={route('login')} tabIndex={6} className="text-purple-300 transition hover:text-white">
                                Log in
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
