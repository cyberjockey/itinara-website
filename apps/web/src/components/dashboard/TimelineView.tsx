"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { AddActivityModal } from "./AddActivityModal";
import { updateActivityPosition } from "@/app/dashboard/trips/actions";
import { toast } from "sonner"; // Assuming sonner is used, or replace with console/alert fallback

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { MapPin, Sparkles } from "lucide-react";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { DayColumn } from "./DayColumn";
import { SortableActivityCard } from "./SortableActivityCard";
import { createPortal } from "react-dom";

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
    place_id?: string;
    order_index?: number;
}

interface Trip {
    id: string;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface TimelineViewProps {
    trip: Trip;
    activities: Activity[];
    readOnly?: boolean;
    isCommitted?: boolean; // NEW: Disable editing after commit
}

export function TimelineView({ trip, activities: initialActivities, readOnly = false, isCommitted = false }: TimelineViewProps) {
    const startDate = parseISO(trip.start_date);
    const endDate = parseISO(trip.end_date);
    const totalDays = differenceInDays(endDate, startDate) + 1;

    // Optimistic UI state
    const [activities, setActivities] = useState(initialActivities);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDayForAdd, setSelectedDayForAdd] = useState(1);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
            // Disable sensors if readOnly
            // Actually DndContext has no "disabled" prop, but we can just not render DndContext if readOnly
            // OR render a simplified view.
            // But we want the SAME layout.
            // So let's conditionally wrap or just make items not draggable.
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Group activities by day
    const columns = useMemo(() => {
        const cols = new Map<number, Activity[]>();
        for (let i = 1; i <= totalDays; i++) {
            cols.set(i, []);
        }
        activities.forEach(activity => {
            const dayList = cols.get(activity.day_number);
            if (dayList) dayList.push(activity);
        });

        // Ensure sorted by order_index or time
        for (let i = 1; i <= totalDays; i++) {
            const list = cols.get(i) || [];
            list.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0) || (a.start_time || "").localeCompare(b.start_time || ""));
        }
        return cols;
    }, [activities, totalDays]);

    const handleDragStart = (event: DragStartEvent) => {
        if (readOnly) return;
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        if (readOnly) return;
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Ensure we're not dragging over itself
        if (activeId === overId) return;

        const isActiveActivity = active.data.current?.type === "Activity";
        const isOverActivity = over.data.current?.type === "Activity";
        const isOverDay = over.data.current?.type === "Day";

        if (!isActiveActivity) return;

        // Scenario 1: Dragging over another activity
        if (isActiveActivity && isOverActivity) {
            const activeActivity = activities.find(a => a.id === activeId);
            const overActivity = activities.find(a => a.id === overId);

            if (!activeActivity || !overActivity) return;

            // If different days, move it
            if (activeActivity.day_number !== overActivity.day_number) {
                setActivities((items) => {
                    const activeIndex = items.findIndex((t) => t.id === activeId);
                    const overIndex = items.findIndex((t) => t.id === overId);

                    if (items[activeIndex].day_number !== items[overIndex].day_number) {
                        const updatedItems = [...items];
                        updatedItems[activeIndex].day_number = items[overIndex].day_number;
                        return arrayMove(updatedItems, activeIndex, overIndex - 1); // Insert before
                    }
                    return items;
                });
            }
        }

        // Scenario 2: Dragging over an empty day column
        if (isActiveActivity && isOverDay) {
            const activeActivity = activities.find(a => a.id === activeId);
            const overDayNumber = over.data.current?.dayNumber as number;

            if (activeActivity && activeActivity.day_number !== overDayNumber) {
                setActivities((items) => {
                    const activeIndex = items.findIndex((t) => t.id === activeId);
                    const updatedItems = [...items];
                    updatedItems[activeIndex].day_number = overDayNumber;
                    return arrayMove(updatedItems, activeIndex, activeIndex); // Stay in place, just change day
                });
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        if (readOnly) return;
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeActivity = activities.find(a => a.id === activeId);

        const newIndex = 0;
        let newDayNumber = activeActivity?.day_number || 1;

        if (activeId !== overId) {
            setActivities((items) => {
                const oldIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);
                return arrayMove(items, oldIndex, overIndex);
            });

            // Calculate new position for server update
            // Note: This logic simplifies "index" to just current array position.
            // In a real app, you might calculate specialized order indices.
            // We'll update the SERVER with the new day and index.
            const currentItems = activities; // This is theoretically "stale" but active/over indices logic works better on "items" inside setState.
            // Better approach: Re-calculate from the *resulting* array
        }

        // Wait for state update is unreliable in React synchronous flow, so we calculate directly.
        // Actually, for simplicity in this MVP, let's just trigger the server action with the day we dropped it on.
        // If dropped on an activity, we find that activity's day.

        const overActivity = activities.find(a => a.id === overId);
        const isOverDay = over.data.current?.type === "Day";

        if (overActivity) {
            newDayNumber = overActivity.day_number;
            // newIndex logic would require finding its index in that day's list
        } else if (isOverDay) {
            newDayNumber = over.data.current?.dayNumber as number;
        }

        // We optimistically updated activity.day_number in handleDragOver, so activeActivity.day_number might be correct already if valid.
        // Let's persist.
        if (activeActivity) {
            // We need to determine the new order index.
            // Usually done by full reordering the list for that day.
            // For now, let's just update the Day Number to ensure basic functionality first.
            try {
                await updateActivityPosition(activeId, trip.id, activeActivity.day_number, 0);
                toast.success("Timeline updated");
            } catch (err) {
                toast.error("Failed to save changes");
            }
        }
    };

    // Prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    const handleAddActivity = (dayNumber: number) => {
        if (readOnly || isCommitted) return; // Prevent adding activities if committed
        setSelectedDayForAdd(dayNumber);
        setIsAddModalOpen(true);
    };

    if (!isMounted) {
        return null; // Or a loading skeleton to match server render if needed, but null is safer for portal issues
        // Actually, returning null might cause a flicker.
        // Better: Render the static parts, but skip the Portal part.
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-warm-white">
            {!readOnly && (
                <AddActivityModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    tripId={trip.id}
                    dayNumber={selectedDayForAdd}
                />
            )}

            {/* Empty State / Onboarding CTA */}
            {!readOnly && !isCommitted && activities.length === 0 && (
                <div className="mx-6 mt-6 mb-2 p-8 bg-white border border-dashed border-stone-gray/20 rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 bg-warm-white rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-terracotta" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">{trip.destination ? `Start planning your ${trip.destination} trip!` : "Start planning your adventure!"}</h3>
                    <p className="text-stone-gray mb-6 max-w-md">
                        Your itinerary is empty. Explore our curated list of top-rated places in {trip.destination || "your destination"} to start building your perfect trip.
                    </p>
                    <a
                        href={`/dashboard/explore?query=${encodeURIComponent(trip.destination)}`}
                        className="px-6 py-3 bg-deep-teak text-white font-bold rounded-full hover:bg-terracotta transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Explore {trip.destination}
                    </a>
                </div>
            )}

            <div className="flex-1 w-full flex justify-center overflow-hidden">
                <div className="flex-1 max-w-7xl w-full overflow-x-auto overflow-y-hidden p-6">
                    {readOnly ? (
                        // Read Only View - Simplified
                        <div className="flex h-full gap-6 w-max">
                            {Array.from(columns.entries()).map(([dayNum, dayActivities]) => (
                                <DayColumn
                                    key={dayNum}
                                    dayNumber={dayNum}
                                    date={addDays(startDate, dayNum - 1)}
                                    activities={dayActivities}
                                    onAddActivity={() => handleAddActivity(dayNum)}
                                    readOnly={true}
                                />
                            ))}
                        </div>
                    ) : (
                        // Drag and Drop View
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="flex h-full gap-6 w-max">
                                {Array.from(columns.entries()).map(([dayNum, dayActivities]) => (
                                    <DayColumn
                                        key={dayNum}
                                        dayNumber={dayNum}
                                        date={addDays(startDate, dayNum - 1)}
                                        activities={dayActivities}
                                        onAddActivity={() => handleAddActivity(dayNum)}
                                        readOnly={false}
                                    />
                                ))}
                            </div>

                            {createPortal(
                                <DragOverlay dropAnimation={dropAnimation}>
                                    {activeId ? (
                                        <SortableActivityCard
                                            activity={activities.find(a => a.id === activeId)!}
                                            readOnly={false}
                                        />
                                    ) : null}
                                </DragOverlay>,
                                document.body
                            )}
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}
