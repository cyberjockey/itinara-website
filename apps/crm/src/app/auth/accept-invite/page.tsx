"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validateInvitation, acceptInvitation } from "../../dashboard/users/invitation-actions";
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

export default function AcceptInvitePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [inviteData, setInviteData] = useState<{ email: string; role: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function validate() {
            if (!token) {
                setError("No invitation token provided");
                setIsValidating(false);
                return;
            }

            const result = await validateInvitation(token);

            if (result.valid) {
                setIsValid(true);
                setInviteData({ email: result.email!, role: result.role! });
            } else {
                setError(result.error || "Invalid invitation");
            }
            setIsValidating(false);
        }

        validate();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();

            // Sign up the user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: inviteData!.email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setIsSubmitting(false);
                return;
            }

            if (data.user) {
                // Update the user's profile with the correct role
                await supabase
                    .from("profiles")
                    .update({
                        role: inviteData!.role,
                        full_name: fullName,
                        email: inviteData!.email,
                    })
                    .eq("id", data.user.id);

                // Mark invitation as accepted
                await acceptInvitation(token!, data.user.id);

                setSuccess(true);

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Validating invitation...</p>
                </div>
            </div>
        );
    }

    // Invalid invitation
    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full text-center px-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Invitation</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full text-center px-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Account Created!</h1>
                    <p className="text-gray-600 mb-2">Your account has been set up successfully.</p>
                    <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    // Signup form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to Itinara</h1>
                    <p className="text-gray-600 mt-2">Complete your account setup</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-800">
                            You're joining as a <strong className="capitalize">{inviteData?.role?.replace("_", " ")}</strong>
                        </p>
                        <p className="text-sm text-blue-600 mt-1">{inviteData?.email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Your full name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="Create a password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
