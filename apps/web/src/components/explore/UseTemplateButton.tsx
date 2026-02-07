"use client";

import { useState, useTransition } from "react";
import { purchaseTemplate } from "@/app/actions/marketplace";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UseTemplateButtonProps {
    templateId: string;
    durationDays: number;
    vipQuota: number;
    isAuthenticated?: boolean;
}

export default function UseTemplateButton({ templateId, durationDays, vipQuota, isAuthenticated }: UseTemplateButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showDate, setShowDate] = useState(false);
    const router = useRouter();

    // Default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);

    const handleBooking = () => {
        if (!startDate) return;

        startTransition(async () => {
            try {
                //  Retrieve referral tracking data from localStorage
                const refCode = localStorage.getItem('template_ref_code') || undefined;
                const sessionId = localStorage.getItem('itinara_session_id') || undefined;

                const res = await purchaseTemplate(templateId, startDate, refCode, sessionId);

                if (res.success) {
                    // Analytics: Spend Virtual Currency & Create Trip
                    if (typeof window !== 'undefined' && 'gtag' in window) {
                        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'spend_virtual_currency', {
                            value: 1,
                            virtual_currency_name: 'VIP_Credit',
                            item_name: `Template_${templateId}`
                        });

                        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'create_trip', {
                            trip_id: res.tripId,
                            destination: 'template'
                        });
                    }

                    // Clear referral tracking after successful purchase
                    if (refCode) {
                        localStorage.removeItem('template_ref_code');
                    }
                    router.push(`/dashboard/trips/${res.tripId}`);
                }
            } catch (error: unknown) {
                console.error(error);
                alert(error instanceof Error ? error.message : "Failed to purchase trip.");
            }
        });
    };

    const handleClick = () => {
        if (!isAuthenticated) {
            router.push(`/signup?next=${encodeURIComponent(`/dashboard/explore/trips/${templateId}`)}`);
            return;
        }

        if (vipQuota < 1) {
            router.push("/dashboard/purchase"); // Redirect to top-up
            return;
        }
        setShowPurchaseConfirm(true);
    };

    const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);

    if (showPurchaseConfirm) {
        return (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        Wait! Just to Confirm...
                    </h4>
                    <p className="text-sm text-amber-700/80 leading-relaxed">
                        Booking this curated trip will deduct <span className="font-bold">1 VIP Trip Credit</span> from your quota.
                    </p>
                    <p className="text-xs text-amber-700/60 mt-2 font-medium">
                        Remaining after booking: {vipQuota - 1} Credits
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPurchaseConfirm(false)}
                        className="flex-1 py-3 text-sm font-bold text-stone-gray hover:bg-stone-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setShowPurchaseConfirm(false);
                            setShowDate(true);
                        }}
                        className="flex-[2] bg-deep-teak hover:bg-[#2c1810] text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                    >
                        Yes, Use 1 Credit
                    </button>
                </div>
            </div>
        );
    }

    if (showDate) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-gray/20">
                    <label className="block text-sm font-medium text-stone-gray mb-2">When do you want to start?</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-stone-gray/30 rounded-lg focus:ring-2 focus:ring-terracotta outline-none"
                    />
                    <p className="text-xs text-stone-gray/60 mt-2">
                        This is a {durationDays} day trip.
                        Ending on {new Date(new Date(startDate).getTime() + (durationDays - 1) * 86400000).toLocaleDateString()}.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowDate(false)}
                        className="flex-1 py-3 text-sm font-bold text-stone-gray hover:bg-stone-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBooking}
                        disabled={isPending}
                        className="flex-[2] bg-terracotta hover:bg-[#B54B35] text-white font-bold py-3 rounded-xl shadow-lg shadow-terracotta/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Purchase (1 VIP Credit)"}
                    </button>
                </div>
            </div>
        );
    }

    const buttonText = !isAuthenticated
        ? "Register to Buy"
        : (vipQuota < 1 ? "Insufficient VIP Quota - Top Up" : "Buy with VIP Trip Quota");

    return (
        <div className="mb-4">
            <button
                onClick={handleClick}
                className={`w-full font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 
                ${(isAuthenticated && vipQuota < 1)
                        ? "bg-gray-100 text-stone-gray hover:bg-gray-200 shadow-gray-200/50"
                        : "bg-terracotta hover:bg-[#B54B35] text-white shadow-terracotta/20"
                    }`}
            >
                {buttonText}
            </button>
            <p className="text-center text-xs text-stone-gray/60 mt-2">
                Your Balance: <span className="font-bold text-deep-teak">{vipQuota} VIP Credits</span>
            </p>
        </div>
    );
}
