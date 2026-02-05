"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { SortableActivityCard } from "./SortableActivityCard";

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
}

interface DayColumnProps {
    dayNumber: number;
    date: Date;
    activities: Activity[];
    onAddActivity: () => void;
    readOnly?: boolean;
}

// Helper function to generate Google Maps route URL with multiple waypoints
function generateDayRouteUrl(activities: Activity[]): string {
    const locationsWithActivities = activities.filter(a => a.location && a.location.trim());

    if (locationsWithActivities.length === 0) return '#';
    if (locationsWithActivities.length === 1) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationsWithActivities[0].location!)}`;
    }

    // For multiple locations, create a route
    const origin = encodeURIComponent(locationsWithActivities[0].location!);
    const destination = encodeURIComponent(locationsWithActivities[locationsWithActivities.length - 1].location!);

    // Middle locations as waypoints
    const waypoints = locationsWithActivities
        .slice(1, -1)
        .map(a => encodeURIComponent(a.location!))
        .join('|');

    if (waypoints) {
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    } else {
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }
}

export function DayColumn({ dayNumber, date, activities, onAddActivity, readOnly = false }: DayColumnProps) {
    const { setNodeRef } = useDroppable({
        id: `day-${dayNumber}`,
        data: {
            type: "Day",
            dayNumber
        },
        disabled: readOnly // Disable drop
    });

    return (
        <div className="flex-shrink-0 w-80 h-full flex flex-col bg-stone-gray/5 rounded-2xl border border-stone-gray/10">
            {/* Column Header */}
            <div className="p-4 border-b border-stone-gray/10 bg-white/50 rounded-t-2xl backdrop-blur-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-deep-teak uppercase text-xs tracking-wider">
                        Day {dayNumber}
                    </span>
                    <span className="text-xs text-stone-gray bg-white px-2 py-0.5 rounded-full border border-stone-gray/10 shadow-sm">
                        {activities.length} items
                    </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-deep-teak mb-2">
                    {format(date, "MMM d, EEEE")}
                </h3>

                {/* Navigate Day Button - only show if there are activities with locations */}
                {activities.length > 0 && activities.some(a => a.location) && (
                    <a
                        href={generateDayRouteUrl(activities)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-xs shadow-md hover:shadow-lg"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        Navigate Full Day
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="7 13 12 18 17 13" />
                            <polyline points="7 6 12 11 17 6" />
                        </svg>
                    </a>
                )}
            </div>

            {/* Droppable Area */}
            <div ref={readOnly ? undefined : setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[100px]">
                {readOnly ? (
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <SortableActivityCard key={activity.id} activity={activity} readOnly={true} />
                        ))}
                    </div>
                ) : (
                    <SortableContext
                        items={activities.map(a => a.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <SortableActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </SortableContext>
                )}


                {/* Explore Places Prompt */}
                {!readOnly && (
                    <div className="w-full mt-3 p-4 border border-dashed border-terracotta/30 rounded-xl bg-terracotta/5 text-center">
                        <p className="text-xs text-stone-gray/80 mb-2">
                            Add activities from our curated list
                        </p>
                        <a
                            href="/dashboard/explore"
                            className="inline-flex items-center gap-2 text-sm font-bold text-terracotta hover:text-deep-teak transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Browse Explore
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
