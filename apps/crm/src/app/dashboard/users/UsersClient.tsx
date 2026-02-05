"use client";

import { useState } from "react";
import { UserPlus, RefreshCw, Trash2, Clock, Mail } from "lucide-react";
import { InviteUserModal } from "../../../components/InviteUserModal";
import { cancelInvitation, resendInvitation, type Invitation } from "./invitation-actions";

interface UsersClientProps {
    initialInvitations: Invitation[];
}

export function UsersClient({ initialInvitations }: UsersClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invitations, setInvitations] = useState(initialInvitations);
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const handleCancel = async (id: string) => {
        setLoadingIds(prev => new Set(prev).add(id));
        const result = await cancelInvitation(id);
        if (result.success) {
            setInvitations(prev => prev.filter(inv => inv.id !== id));
        }
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleResend = async (id: string) => {
        setLoadingIds(prev => new Set(prev).add(id));
        await resendInvitation(id);
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    return (
        <>
            {/* Invite Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
                <UserPlus className="w-4 h-4" />
                Invite User
            </button>

            {/* Pending Invitations Section */}
            {invitations.length > 0 && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-900">Pending Invitations</h3>
                        <span className="text-sm text-amber-700">({invitations.length})</span>
                    </div>

                    <div className="space-y-3">
                        {invitations.map((invitation) => {
                            const isLoading = loadingIds.has(invitation.id);
                            const expiresAt = new Date(invitation.expires_at);
                            const isExpired = expiresAt < new Date();

                            return (
                                <div
                                    key={invitation.id}
                                    className={`flex items-center justify-between p-4 bg-white rounded-lg border ${isExpired ? "border-red-200" : "border-amber-100"
                                        }`}
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">{invitation.email}</div>
                                        <div className="flex items-center gap-3 mt-1 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${invitation.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}>
                                                {invitation.role === "admin" ? "Admin" : "Local Guide"}
                                            </span>
                                            <span className={`flex items-center gap-1 ${isExpired ? "text-red-600" : "text-gray-500"
                                                }`}>
                                                <Clock className="w-3 h-3" />
                                                {isExpired
                                                    ? "Expired"
                                                    : `Expires ${expiresAt.toLocaleDateString()}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleResend(invitation.id)}
                                            disabled={isLoading}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Resend invitation"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                                        </button>
                                        <button
                                            onClick={() => handleCancel(invitation.id)}
                                            disabled={isLoading}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Cancel invitation"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            <InviteUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
