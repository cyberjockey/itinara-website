"use client";

import { createTrip } from "@/app/dashboard/trips/new/actions";
import { useActionState } from "react";
import { DestinationCombobox } from "@/app/dashboard/trips/new/DestinationCombobox";
import Link from "next/link";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";

const initialState = {
    message: "",
};

export function NewTripForm() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(createTrip, initialState);

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-gray/10 animate-in fade-in duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Plan a New Adventure</h1>
                    <p className="text-stone-gray">Where are you heading next?</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-gray mb-1">
                            Trip Title <span className="text-stone-gray/50 font-normal">(Optional)</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                            placeholder="e.g., Bali Adventure (defaults to destination)"
                        />
                    </div>

                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-stone-gray mb-1">
                            City / Destination
                        </label>
                        <p className="text-xs text-stone-gray/60 mb-2">To ensure the best experience, please focus on one city per trip.</p>
                        <DestinationCombobox name="destination" />
                    </div>

                    {/* Trip Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-stone-gray mb-3">
                            Trip Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Premium Option */}
                            <label className="relative cursor-pointer group">
                                <input
                                    type="radio"
                                    name="trip_type"
                                    value="premium"
                                    defaultChecked
                                    className="peer sr-only"
                                />
                                <div className="p-4 rounded-xl border-2 border-stone-gray/20 peer-checked:border-terracotta peer-checked:bg-terracotta/5 hover:border-terracotta/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-terracotta" />
                                            <h3 className="font-bold text-deep-teak">Premium</h3>
                                        </div>
                                        <span className="text-2xl font-bold text-terracotta">$9</span>
                                    </div>
                                    <ul className="text-xs text-stone-gray/80 space-y-1">
                                        <li>• Up to 7 days</li>
                                        <li>• Up to 10 activities</li>
                                        <li>• AI planning</li>
                                    </ul>
                                </div>
                            </label>

                            {/* VIP Option */}
                            <label className="relative cursor-pointer group">
                                <input
                                    type="radio"
                                    name="trip_type"
                                    value="vip"
                                    className="peer sr-only"
                                />
                                <div className="p-4 rounded-xl border-2 border-stone-gray/20 peer-checked:border-amber-400 peer-checked:bg-amber-50 hover:border-amber-400/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">👑</span>
                                            <h3 className="font-bold text-deep-teak">VIP</h3>
                                        </div>
                                        <span className="text-2xl font-bold text-amber-700">$30</span>
                                    </div>
                                    <ul className="text-xs text-stone-gray/80 space-y-1">
                                        <li>• Unlimited days</li>
                                        <li>• Unlimited activities</li>
                                        <li>• Concierge support</li>
                                    </ul>
                                </div>
                            </label>
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
        </div>
    );
}
