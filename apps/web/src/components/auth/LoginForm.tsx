"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
// import { login } from "@/app/login/actions";

interface LoginFormProps { }

export function LoginForm({ }: LoginFormProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const next = searchParams.get("next");
    const supabase = createClient();

    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    // Clear legacy cookie that might cause 431 errors
    useEffect(() => {
        document.cookie = "itinara-web-auth-v2=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        startTransition(async () => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage(error.message);
            } else {
                // Success - redirect
                router.refresh(); // Refresh to update server components with new session
                if (next) {
                    router.push(next);
                } else {
                    router.push("/dashboard?event=login");
                }
            }
        });
    };

    const handleGoogleLogin = async () => {
        const redirectTo = next
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
            : `${window.location.origin}/auth/callback`;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
        });
    };

    return (
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
            <form onSubmit={handleSubmit} className="space-y-6">
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

                {message && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3.5 rounded-full bg-terracotta text-white font-bold disabled:opacity-50"
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
    );
}
