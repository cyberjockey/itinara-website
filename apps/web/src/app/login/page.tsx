"use client";

import { login } from "./actions";
import { useActionState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";

const initialState = {
    message: "",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-warm-white" />}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const searchParams = useSearchParams();
    const next = searchParams.get("next");

    const [state, formAction, isPending] = useActionState(login, initialState);

    const handleGoogleLogin = async () => {
        const supabase = createClient();

        const redirectTo = next
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
            : `${window.location.origin}/auth/callback`;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
        });
    };

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
                <div className="absolute inset-0 bg-deep-teak/40" />
            </div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-terracotta/10">
                            <Image src="/logo.png" alt="ITINARA Logo" fill className="object-cover" />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-deep-teak">
                            Welcome Back
                        </h1>
                        <p className="text-stone-gray/80">
                            Sign in to continue your journey
                        </p>
                    </div>

                    {/* EMAIL / PASSWORD */}
                    <form action={formAction} className="space-y-6">
                        {next && <input type="hidden" name="next" value={next} />}

                        <div>
                            <label className="block text-sm font-medium text-stone-gray mb-1">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-gray mb-1">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20"
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
                            className="w-full py-3.5 rounded-full bg-terracotta text-white font-bold"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-gray">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
                            className="text-terracotta font-bold hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-stone-gray/20" />
                        <span className="text-xs text-stone-gray/60">OR</span>
                        <div className="flex-1 h-px bg-stone-gray/20" />
                    </div>

                    {/* GOOGLE LOGIN */}
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full py-3 rounded-full border border-stone-gray/30 bg-white flex items-center justify-center gap-3 hover:bg-stone-50 transition"
                    >
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN1HgAOQZBf48TI55AvzbnfV0IFrCCrX6ldg&s"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        <span className="font-semibold text-stone-gray">
                            Continue with Google
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
