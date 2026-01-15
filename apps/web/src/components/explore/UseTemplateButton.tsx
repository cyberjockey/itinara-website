"use client";

import { useState, useTransition } from "react";
import { useTemplate } from "@/app/dashboard/explore/actions";
import { Loader2, Calendar } from "lucide-react";

interface UseTemplateButtonProps {
    templateId: string;
    durationDays: number;
}

export default function UseTemplateButton({ templateId, durationDays }: UseTemplateButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showDate, setShowDate] = useState(false);

    // Default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);

    const handleBooking = () => {
        if (!startDate) return;

        startTransition(async () => {
            try {
                await useTemplate(templateId, startDate);
            } catch (error) {
                console.error(error);
                alert("Failed to book trip. Please try again.");
            }
        });
    };

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
                        className="w-full px-4 py-2 border border-stoe-gray/30 rounded-lg focus:ring-2 focus:ring-terracotta outline-none"
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
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowDate(true)}
            className="w-full bg-terracotta hover:bg-[#B54B35] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-terracotta/20 transition-all transform hover:-translate-y-0.5 mb-4"
        >
            Book This Trip
        </button>
    );
}
