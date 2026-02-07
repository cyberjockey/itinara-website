"use client";

import { useState } from "react";
import { Sparkles, Calendar, Users, Wallet, Check, ArrowRight, Loader2, MapPin } from "lucide-react";
import { generateItinerary, GeneratedItinerary } from "@/lib/ai-service";
import { cn } from "@/lib/utils";

interface AIWizardProps {
    onComplete: (itinerary: GeneratedItinerary) => void;
}

const INTERESTS = [
    "Culture & History", "Nature & Wildlife", "Food & Culinary",
    "Relaxation & Spa", "Adventure & Sports", "Shopping & Fashion",
    "Nightlife", "Photography"
];

const TRAVELERS = ["Solo", "Couple", "Family", "Friends"];
const BUDGETS = ["Budget", "Standard", "Luxury"];

export function AIWizard({ onComplete }: AIWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState(3);
    const [travelers, setTravelers] = useState("Couple");
    const [budget, setBudget] = useState("Standard");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests([...selectedInterests, interest]);
            }
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateItinerary({
                destination,
                days,
                travelers,
                budget,
                interests: selectedInterests
            });
            onComplete(result);
        } catch (e) {
            console.error(e);
            alert("Failed to generate itinerary. Please try again.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-terracotta/20 blur-xl rounded-full animate-pulse"></div>
                    <Sparkles className="w-16 h-16 text-terracotta relative z-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-deep-teak mb-2 animate-pulse">Dreaming up your trip...</h3>
                <p className="text-stone-gray text-center max-w-md">
                    Our Top Local Guides & Google Local Guides are crafting a {days}-day itinerary for {destination} tailored to your preferences.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-stone-gray/10 shadow-xl">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", step >= s ? "bg-deep-teak" : "bg-stone-gray/10")} />
                ))}
            </div>

            {/* Step 1: Destination & Days */}
            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-deep-teak mb-2">Where are you headed?</h2>
                        <p className="text-stone-gray">Let&apos;s start with the basics of your journey.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-deep-teak mb-2">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g. Bali, Japan, Paris"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all text-black placeholder:text-stone-gray/40"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-deep-teak mb-2">Duration (Days)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={days}
                                    onChange={(e) => setDays(parseInt(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all text-black placeholder:text-stone-gray/40"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!destination}
                            className="flex items-center gap-2 px-6 py-3 bg-deep-teak text-white font-bold rounded-full hover:bg-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Travelers & Budget */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-deep-teak mb-2">How do you like to travel?</h2>
                        <p className="text-stone-gray">Help us understand your travel style.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-deep-teak mb-3">Who are you traveling with?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {TRAVELERS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTravelers(t)}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                                            travelers === t
                                                ? "border-terracotta bg-terracotta/5 text-terracotta font-bold ring-1 ring-terracotta"
                                                : "border-stone-gray/20 text-stone-gray hover:border-stone-gray/40"
                                        )}
                                    >
                                        <Users className="w-4 h-4" /> {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-deep-teak mb-3">What is your budget?</label>
                            <div className="grid grid-cols-3 gap-3">
                                {BUDGETS.map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => setBudget(b)}
                                        className={cn(
                                            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                                            budget === b
                                                ? "border-terracotta bg-terracotta/5 text-terracotta font-bold ring-1 ring-terracotta"
                                                : "border-stone-gray/20 text-stone-gray hover:border-stone-gray/40"
                                        )}
                                    >
                                        <Wallet className="w-4 h-4" /> {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            onClick={() => setStep(1)}
                            className="text-stone-gray hover:text-deep-teak font-medium"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="flex items-center gap-2 px-6 py-3 bg-deep-teak text-white font-bold rounded-full hover:bg-terracotta transition-colors"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-deep-teak mb-2">What are you interested in?</h2>
                        <p className="text-stone-gray">Pick up to 5 interests to customize your plan.</p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        {INTERESTS.map((interest) => (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                    selectedInterests.includes(interest)
                                        ? "bg-deep-teak text-white border-deep-teak"
                                        : "bg-white text-stone-gray border-stone-gray/20 hover:border-stone-gray/40"
                                )}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            onClick={() => setStep(2)}
                            className="text-stone-gray hover:text-deep-teak font-medium"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={selectedInterests.length === 0}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-terracotta to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <Sparkles className="w-4 h-4 fill-white" /> Generate Itinerary
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
