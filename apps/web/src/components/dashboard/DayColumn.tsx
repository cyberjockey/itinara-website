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
                <h3 className="font-heading font-bold text-lg text-deep-teak">
                    {format(date, "MMM d, EEEE")}
                </h3>
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
                            Add activities from our curated places
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
