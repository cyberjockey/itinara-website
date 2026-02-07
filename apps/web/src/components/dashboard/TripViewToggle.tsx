"use client";

import { useState } from "react";
import { TimelineView } from "@/components/dashboard/TimelineView";
import { TripDetailsView } from "./TripDetailsView";
import { EmergencyView } from "./EmergencyView";
import { GuideChat } from "./GuideChat";
import { Map, ListFilter, FileText, Shield, Lock, MessageCircle } from "lucide-react";

// Dynamically import map to avoid SSR issues with Leaflet
import dynamic from 'next/dynamic';

const TripMapSafe = dynamic(() => import('@/components/dashboard/TripMap').then(mod => mod.TripMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-stone-gray/5 animate-pulse rounded-2xl" />
});

import { Trip, Activity } from "@/types/trip";

interface TripViewToggleProps {
    trip: Trip;
    activities: Activity[];
    readOnly?: boolean;
    isCommitted?: boolean;
    initialView?: "timeline" | "map" | "details" | "emergency" | "guide";
}

export function TripViewToggle({ trip, activities, readOnly = false, isCommitted = false, initialView = "timeline" }: TripViewToggleProps) {
    const [view, setView] = useState<"timeline" | "map" | "details" | "emergency" | "guide">(initialView);

    // Check trip status for Emergency and Guide tabs
    const isActive = trip.status === 'active';
    const isCompleted = trip.status === 'completed';

    // Check if trip is from a curated template (has guide)
    const hasCuratedGuide = !!trip.source_template_id;

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* View Toggle Tabs */}
            <div className="border-b border-stone-gray/10 bg-white">
                <div className="px-4 md:px-6 pt-4 pb-2 flex gap-5 md:gap-10 overflow-x-auto max-w-7xl mx-auto w-full no-scrollbar">
                    <button
                        onClick={() => setView("timeline")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${view === "timeline" ? "text-deep-teak" : "text-stone-gray hover:text-deep-teak"
                            }`}
                    >
                        <ListFilter className="w-4 h-4" />
                        Timeline
                        {view === "timeline" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setView("map")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${view === "map" ? "text-deep-teak" : "text-stone-gray hover:text-deep-teak"
                            }`}
                    >
                        <Map className="w-4 h-4" />
                        Map View
                        {view === "map" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setView("details")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${view === "details" ? "text-deep-teak" : "text-stone-gray hover:text-deep-teak"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Trip Details
                        {view === "details" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                        )}
                    </button>

                    {/* Ask Guide Tab - Only for curated trips */}
                    {hasCuratedGuide && (
                        <button
                            onClick={() => setView("guide")}
                            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${view === "guide" ? "text-ocean-turquoise" : "text-stone-gray hover:text-ocean-turquoise"
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Ask Guide
                            {!isActive && <Lock className="w-3 h-3 text-stone-gray/50" />}
                            {view === "guide" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ocean-turquoise rounded-full" />
                            )}
                        </button>
                    )}

                    <button
                        onClick={() => setView("emergency")}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${view === "emergency" ? "text-red-600" : "text-stone-gray hover:text-red-600"
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        Emergency
                        {!isActive && <Lock className="w-3 h-3 text-stone-gray/50" />}
                        {view === "emergency" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative overflow-y-auto">
                {view === "timeline" ? (
                    <TimelineView trip={trip} activities={activities} readOnly={readOnly} isCommitted={isCommitted} />
                ) : view === "map" ? (
                    <div className="h-full p-6 bg-warm-white">
                        <TripMapSafe activities={activities} />
                    </div>
                ) : view === "details" ? (
                    <div className="h-full bg-warm-white overflow-y-auto">
                        <TripDetailsView trip={trip} activities={activities} />
                    </div>
                ) : view === "guide" ? (
                    <GuideChat trip={trip} tripStatus={trip.status} />
                ) : (
                    <EmergencyView trip={trip} activities={activities} tripStatus={trip.status} />
                )}
            </div>
        </div>
    );
}

