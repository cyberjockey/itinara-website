"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, MoreVertical } from "lucide-react";

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
}

interface SortableActivityCardProps {
    activity: Activity;
    readOnly?: boolean;
}

export function SortableActivityCard({ activity, readOnly = false }: SortableActivityCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: activity.id,
        data: {
            type: "Activity",
            activity
        },
        disabled: readOnly
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(readOnly ? {} : listeners)} // Disable listeners if readOnly
            className={`bg-white p-4 rounded-xl border border-stone-gray/10 shadow-sm flex gap-3 
                ${readOnly ? 'cursor-default' : 'hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group'}
            `}
        >
            <div className="flex gap-3 w-full">
                <div className="flex flex-col items-center min-w-[50px] border-r border-stone-gray/10 pr-3">
                    <span className="text-sm font-bold text-deep-teak">
                        {activity.start_time ? activity.start_time.slice(0, 5) : "--:--"}
                    </span>
                    <div className="h-full w-px bg-stone-gray/10 my-2 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rice-paddy-green" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-deep-teak truncate pr-2" title={activity.title}>
                            {activity.title}
                        </h4>
                        {!readOnly && (
                            <button className="text-stone-gray/40 hover:text-deep-teak opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {activity.category && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-gray/5 text-stone-gray capitalize border border-stone-gray/10">
                            {activity.category}
                        </span>
                    )}

                    {activity.location && (
                        <div className="flex items-center gap-1 text-xs text-stone-gray mt-1 truncate">
                            <MapPin className="w-3 h-3 text-terracotta flex-shrink-0" />
                            <span className="truncate">{activity.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
