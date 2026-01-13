"use client";

import { useState } from "react";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { MapPin, Clock, Plus, ChevronRight, Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { AddActivityModal } from "./AddActivityModal";

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
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
}

export function TimelineView({ trip, activities }: TimelineViewProps) {
    const startDate = parseISO(trip.start_date);
    const endDate = parseISO(trip.end_date);
    const totalDays = differenceInDays(endDate, startDate) + 1;

    // Generate array of days
    const days = Array.from({ length: totalDays }, (_, i) => ({
        dayNumber: i + 1,
        date: addDays(startDate, i),
        activities: activities.filter(a => a.day_number === i + 1).sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""))
    }));

    const [selectedDay, setSelectedDay] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <AddActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                tripId={trip.id}
                dayNumber={selectedDay}
            />

            {/* Days Horizontal Scroll */}
            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                {days.map((day) => {
                    const isSelected = selectedDay === day.dayNumber;
                    return (
                        <button
                            key={day.dayNumber}
                            onClick={() => setSelectedDay(day.dayNumber)}
                            className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center border transition-all ${isSelected
                                    ? "bg-deep-teak text-white border-deep-teak shadow-lg scale-105"
                                    : "bg-white text-stone-gray border-stone-gray/10 hover:border-terracotta/50"
                                }`}
                        >
                            <span className={`text-xs font-bold uppercase ${isSelected ? "text-white/70" : "text-stone-gray/50"}`}>
                                Day {day.dayNumber}
                            </span>
                            <span className="text-xl font-heading font-bold mt-1">
                                {format(day.date, "d")}
                            </span>
                            <span className="text-xs mt-1">
                                {format(day.date, "MMM")}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Content */}
            <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-deep-teak">
                            Day {selectedDay}
                        </h2>
                        <p className="text-stone-gray">
                            {format(days[selectedDay - 1].date, "EEEE, MMMM do, yyyy")}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-full font-bold text-sm shadow-md hover:bg-deep-teak transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Activity
                    </button>
                </div>

                <div className="space-y-4">
                    {days[selectedDay - 1].activities.length > 0 ? (
                        days[selectedDay - 1].activities.map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-5 rounded-2xl border border-stone-gray/10 shadow-sm flex gap-4 group hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col items-center min-w-[60px] border-r border-stone-gray/10 pr-4">
                                    <span className="text-lg font-bold text-deep-teak">
                                        {activity.start_time ? activity.start_time.slice(0, 5) : "--:--"}
                                    </span>
                                    <div className="h-full w-px bg-stone-gray/10 my-2 relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rice-paddy-green" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-deep-teak">{activity.title}</h3>
                                        <button className="text-stone-gray/50 hover:text-deep-teak">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {activity.category && (
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-stone-gray/5 text-stone-gray capitalize border border-stone-gray/10">
                                            {activity.category}
                                        </span>
                                    )}
                                    {activity.location && (
                                        <div className="flex items-center gap-1 text-sm text-stone-gray mt-1">
                                            <MapPin className="w-3 h-3 text-terracotta" />
                                            {activity.location}
                                        </div>
                                    )}
                                    {activity.notes && (
                                        <p className="text-sm text-stone-gray/70 mt-2 bg-warm-white/50 p-2 rounded-lg italic border border-stone-gray/5">
                                            "{activity.notes}"
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-stone-gray/10 rounded-3xl bg-warm-white/30 hover:bg-stone-gray/5 transition-colors group"
                        >
                            <CalendarIcon className="w-12 h-12 text-stone-gray/20 mb-3 group-hover:text-terracotta/50 transition-colors" />
                            <p className="text-stone-gray font-medium">No plans for this day yet.</p>
                            <span className="mt-2 text-terracotta font-bold text-sm hover:underline">
                                Start adding activities
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
