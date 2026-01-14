"use client";

import { useState } from "react";
import { TimelineView } from "@/components/dashboard/TimelineView";
// import dynamic from "next/dynamic";
import { Map, List, ListFilter } from "lucide-react";
import { TripMap } from "@/components/dashboard/TripMap"; // Our new component

// Dynamically import map to avoid SSR issues with Leaflet? 
// Actually TripMap handles its own mount check. But next/dynamic is safer for leaflet.
import dynamic from 'next/dynamic';

const TripMapSafe = dynamic(() => import('@/components/dashboard/TripMap').then(mod => mod.TripMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-stone-gray/5 animate-pulse rounded-2xl" />
});

interface TripViewToggleProps {
    trip: any;
    activities: any[];
    readOnly?: boolean;
}

export function TripViewToggle({ trip, activities, readOnly = false }: TripViewToggleProps) {
    const [view, setView] = useState<"timeline" | "map">("timeline");

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* View Toggle Tabs */}
            <div className="px-6 pb-2 border-b border-stone-gray/10 flex gap-6">
                <button
                    onClick={() => setView("timeline")}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${view === "timeline" ? "text-deep-teak" : "text-stone-gray hover:text-deep-teak"
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
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${view === "map" ? "text-deep-teak" : "text-stone-gray hover:text-deep-teak"
                        }`}
                >
                    <Map className="w-4 h-4" />
                    Map View
                    {view === "map" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                {view === "timeline" ? (
                    <TimelineView trip={trip} activities={activities} readOnly={readOnly} />
                ) : (
                    <div className="h-full p-6 bg-warm-white">
                        <TripMapSafe activities={activities} />
                    </div>
                )}
            </div>
        </div>
    );
}
