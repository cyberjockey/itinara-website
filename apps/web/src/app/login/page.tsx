"use client";

import { login } from "./actions";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar"; // Assuming you want to reuse the Navbar or a simplified version

const initialState = {
    message: "",
};

export default function LoginPage() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/login-mosaic.png"
                    alt="Indonesia Mosaic"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-deep-teak/40" />
            </div>

            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-terracotta/10">
                            <Image src="/logo.png" alt="ITINARA Logo" fill className="object-cover" />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-deep-teak">Welcome Back</h1>
                        <p className="text-stone-gray/80">Sign in to continue your journey</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-gray mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-stone-gray">
                                    Password
                                </label>
                                <Link href="#" className="text-xs text-terracotta hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                placeholder="••••••••"
                            />
                        </div>

                        {state?.message && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {state.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3.5 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-gray">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-terracotta font-bold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
