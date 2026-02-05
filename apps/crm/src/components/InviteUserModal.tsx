"use client";

import { useState } from "react";
import { X, Mail, UserPlus, Loader2 } from "lucide-react";
import { sendInvitation } from "../app/dashboard/users/invitation-actions";

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "local_guide">("local_guide");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await sendInvitation(email, role);

        setIsLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setEmail("");
                setRole("local_guide");
                setSuccess(false);
                onClose();
            }, 2000);
        } else {
            setError(result.error || "Failed to send invitation");
        }
    };

    const handleClose = () => {
        setEmail("");
        setRole("local_guide");
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Invite User</h2>
                            <p className="text-sm text-gray-500">Send an invitation to join the CRM</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Sent!</h3>
                            <p className="text-gray-500">
                                An invitation email has been sent to <strong>{email}</strong>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assign Role
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole("local_guide")}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${role === "local_guide"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="font-medium text-gray-900">Local Guide</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Can manage own content
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("admin")}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${role === "admin"
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="font-medium text-gray-900">Administrator</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Full CRM access
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Send Invitation
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
