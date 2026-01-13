"use client";

import { createTrip } from "./actions";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Sparkles } from "lucide-react";
import { AIWizard } from "@/components/ai/AIWizard";
import { GeneratedTripPreview } from "@/components/ai/GeneratedTripPreview";

const initialState = {
    message: "",
};

export default function NewTripPage() {
    const [mode, setMode] = useState<"manual" | "ai">("manual");
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(createTrip, initialState);

    const [aiResult, setAIResult] = useState<any>(null);

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            {/* Mode Switcher */}
            <div className="flex justify-center mb-8">
                <div className="bg-stone-gray/5 p-1 rounded-full flex gap-1">
                    <button
                        onClick={() => { setMode("manual"); setAIResult(null); }}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "manual" ? "bg-white shadow-sm text-deep-teak" : "text-stone-gray hover:text-deep-teak"}`}
                    >
                        Manual Plan
                    </button>
                    <button
                        onClick={() => setMode("ai")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "ai" ? "bg-white shadow-sm text-deep-teak" : "text-stone-gray hover:text-deep-teak"}`}
                    >
                        <Sparkles className="w-3 h-3" /> Local Expert Plan
                    </button>
                </div>
            </div>

            {mode === "ai" ? (
                <div className="animate-in fade-in duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Let Local Guides Plan Your Trip</h1>
                        <p className="text-stone-gray">Tell us your preferences and we'll craft the perfect itinerary.</p>
                    </div>

                    {!aiResult ? (
                        <AIWizard onComplete={setAIResult} />
                    ) : (
                        <GeneratedTripPreview itinerary={aiResult} onReset={() => setAIResult(null)} />
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-gray/10 animate-in fade-in duration-500">
                    <div className="mb-8">
                        <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Plan a New Adventure</h1>
                        <p className="text-stone-gray">Where are you heading next?</p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-stone-gray mb-1">
                                Trip Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                placeholder="e.g., Bali & Komodo Expedition"
                            />
                        </div>

                        <div>
                            <label htmlFor="destination" className="block text-sm font-medium text-stone-gray mb-1">
                                Destination
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                                <input
                                    id="destination"
                                    name="destination"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    placeholder="e.g., Indonesia"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-stone-gray mb-1">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-stone-gray mb-1">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {state?.message && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {state.message}
                            </div>
                        )}

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Link href="/dashboard" className="px-6 py-3 rounded-full text-stone-gray font-bold hover:bg-stone-gray/5 transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-8 py-3 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isPending ? "Creating Trip..." : "Create Trip"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
