"use client";

import { signup } from "./actions";
import { useActionState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

const initialState = {
    message: "",
};

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-warm-white" />}>
            <SignupForm />
        </Suspense>
    );
}

function SignupForm() {
    const searchParams = useSearchParams();
    const next = searchParams.get("next");

    const [state, formAction, isPending] = useActionState(signup, initialState);

    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/login-mosaic-v2.png"
                    alt="Indonesia Mosaic"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-deep-teak/40" />
            </div>

            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-terracotta/10">
                            <Image src="/logo.png" alt="ITINARA Logo" fill className="object-cover" />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-deep-teak">Create Account</h1>
                        <p className="text-stone-gray/80">Start planning your dream trip</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        {next && <input type="hidden" name="next" value={next} />}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-stone-gray mb-1">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-stone-gray mb-1">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

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
                            <label htmlFor="phone" className="block text-sm font-medium text-stone-gray mb-1">
                                Phone Number <span className="text-stone-gray/60 font-normal">(with country code)</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                pattern="^\+?[0-9\s\-]{7,15}$"
                                title="Phone number must start with + and contain 7-15 digits"
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                placeholder="+62 812 3456 7890"
                            />
                        </div>



                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-gray mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-stone-gray/60 mt-1">Must be at least 6 characters</p>
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
                            {isPending ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-gray">
                        Already have an account?{" "}
                        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="text-terracotta font-bold hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
