"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Lock, Loader2 } from "lucide-react";
import { commitTrip } from "@/app/dashboard/trips/actions";
import { useRouter } from "next/navigation";

interface TripCommitButtonProps {
    tripId: string;
    initialIsCommitted: boolean;
    variant?: 'default' | 'menu-item';
}

export function TripCommitButton({ tripId, initialIsCommitted, variant = 'default' }: TripCommitButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isCommitted, setIsCommitted] = useState(initialIsCommitted);
    const [showConfirm, setShowConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCommit = () => {
        startTransition(async () => {
            const result = await commitTrip(tripId);
            if (result.success) {
                setIsCommitted(true);
                setShowConfirm(false);
                router.refresh();
            } else {
                alert(result.message);
            }
        });
    };

    const ConfirmationModal = () => {
        if (!showConfirm || !mounted) return null;

        return createPortal(
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-terracotta" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-deep-teak">Commit Trip?</h3>
                            <p className="text-sm text-stone-gray">Lock your itinerary for travel</p>
                        </div>
                    </div>

                    <div className="bg-warm-white rounded-xl p-4 mb-6">
                        <p className="text-sm text-stone-gray mb-3">
                            Committing your trip will:
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-rice-paddy-green mt-0.5 flex-shrink-0" />
                                <span className="text-deep-teak">Unlock <strong>Emergency Services</strong> lookup based on your activity locations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-rice-paddy-green mt-0.5 flex-shrink-0" />
                                <span className="text-deep-teak">Lock your itinerary to prevent accidental changes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-rice-paddy-green mt-0.5 flex-shrink-0" />
                                <span className="text-deep-teak">Mark trip as ready for travel</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 px-4 py-2.5 border border-stone-gray/20 rounded-xl text-stone-gray hover:bg-stone-gray/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCommit}
                            disabled={isPending}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-terracotta to-deep-teak text-white rounded-xl hover:shadow-md transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Committing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Commit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    if (isCommitted) {
        if (variant === 'menu-item') {
            return (
                <div className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium text-rice-paddy-green bg-rice-paddy-green/5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Trip Committed</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-rice-paddy-green/10 text-rice-paddy-green rounded-xl text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Committed</span>
            </div>
        );
    }

    if (variant === 'menu-item') {
        return (
            <>
                <button
                    onClick={() => setShowConfirm(true)}
                    disabled={isPending}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium text-stone-gray hover:text-deep-teak hover:bg-stone-gray/5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Lock className="w-4 h-4" />
                    )}
                    <span>Commit Trip</span>
                </button>
                <ConfirmationModal />
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-terracotta to-deep-teak text-white rounded-xl hover:shadow-md transition-all font-medium text-sm disabled:opacity-50"
            >
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Lock className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Commit Trip</span>
            </button>
            <ConfirmationModal />
        </>
    );
}
