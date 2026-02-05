"use client";

import { GeneratedItinerary } from "@/lib/ai-service";
import { Clock, MapPin, Calendar, Save, ArrowLeft, RefreshCw } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { createTripFromAI } from "@/app/dashboard/trips/new/actions"; // We'll need to create this action
import { useRouter } from "next/navigation";

interface GeneratedTripPreviewProps {
    itinerary: GeneratedItinerary;
    onReset: () => void;
}

export function GeneratedTripPreview({ itinerary, onReset }: GeneratedTripPreviewProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // We'll send the raw JSON to the server to process and insert
            // Note: In a real app, passing huge JSON via server action form data strings is okay but check limits.
            // Alternatively, post to an API route.
            const formData = new FormData();
            formData.append("itinerary", JSON.stringify(itinerary));

            await createTripFromAI(formData);
            // Action handles redirect usually, but if not:
            // router.push("/dashboard"); 
        } catch (e) {
            console.error(e);
            alert("Failed to save trip.");
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onReset}
                    className="flex items-center text-stone-gray hover:text-deep-teak transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Discard
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onReset}
                        className="p-2 text-stone-gray hover:text-deep-teak hover:bg-stone-gray/5 rounded-full transition-colors"
                        title="Regenerate"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-terracotta text-white font-bold rounded-full hover:bg-deep-teak transition-colors disabled:opacity-70"
                    >
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Trip</>}
                    </button>
                </div>
            </div>

            {/* Trip Cover */}
            <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-8 shadow-md">
                <Image
                    src={getImageUrl(itinerary.cover_image_url)}
                    alt={itinerary.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                        <h1 className="text-3xl font-heading font-bold mb-2">{itinerary.title}</h1>
                        <p className="text-white/90 text-lg max-w-2xl">{itinerary.description}</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 pl-4 border-l-2 border-stone-gray/10 ml-4 pb-12">
                {itinerary.days.map((day) => (
                    <div key={day.day_number} className="relative">
                        {/* Day Marker */}
                        <div className="absolute -left-[25px] top-0 w-8 h-8 rounded-full bg-deep-teak text-white flex items-center justify-center font-bold text-sm ring-4 ring-warm-white">
                            {day.day_number}
                        </div>

                        <div className="ml-6 mb-6">
                            <h3 className="text-xl font-bold text-deep-teak">Day {day.day_number}</h3>
                            {day.theme && <p className="text-terracotta font-medium text-sm">{day.theme}</p>}
                        </div>

                        <div className="ml-6 space-y-4">
                            {day.activities.map((activity, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-gray/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        <div className="min-w-[80px] flex md:flex-col items-center gap-1 text-sm font-bold text-stone-gray">
                                            <Clock className="w-4 h-4 text-terracotta" />
                                            {activity.time}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-deep-teak text-lg mb-1">{activity.title}</h4>
                                            <div className="flex items-center gap-1 text-xs text-stone-gray/70 mb-3 font-medium uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" /> {activity.location}
                                            </div>
                                            <p className="text-stone-gray text-sm leading-relaxed">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
