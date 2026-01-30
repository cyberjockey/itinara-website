"use client";

import { useState, useEffect } from "react";
// Custom modal pattern used instead of headlessui to avoid deps issues.

import { X, Calendar, MapPin } from "lucide-react";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { createActivity } from "@/app/dashboard/trips/[id]/actions";
import { createPortal } from "react-dom";

interface Trip {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
}

interface Place {
    id?: string; // Add optional ID
    name: string;
    location: string;
    type?: string;
}

interface AddToTripModalProps {
    destination: {
        name: string;
        location: string;
    };
    trips: Trip[];
    place?: Place; // Optional: if adding a specific place
    trigger?: React.ReactNode; // Optional: custom trigger button
}

export default function AddToTripModal({ destination, trips, place, trigger }: AddToTripModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const selectedTrip = trips.find(t => t.id === selectedTripId);

    // Calculate days if a trip is selected
    let days: { number: number, date: string }[] = [];
    if (selectedTrip) {
        const start = parseISO(selectedTrip.start_date);
        const end = parseISO(selectedTrip.end_date);
        const count = differenceInDays(end, start) + 1;
        days = Array.from({ length: count }, (_, i) => ({
            number: i + 1,
            date: format(addDays(start, i), "MMM d, yyyy")
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        if (!selectedTripId) {
            setMessage("Please select a trip.");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("tripId", selectedTripId);
        formData.append("dayNumber", selectedDay.toString());

        // Use place details if available, otherwise destination details
        const title = place ? `Visit ${place.name}` : `Visit ${destination.name}`;
        const location = place ? place.location : destination.location;
        const category = place?.type?.toLowerCase() || "sightseeing";
        const notes = place ? `Added from ${destination.name} explore page` : "Added from Explore page";

        formData.append("title", title);
        formData.append("location", location);
        formData.append("category", category);
        formData.append("notes", notes);
        if (place?.id) {
            formData.append("placeId", place.id);
        }
        formData.append("startTime", "10:00"); // Default 10 AM

        const result = await createActivity(null, formData);

        setIsSubmitting(false);
        if (result.message === "success") {
            setIsOpen(false);
            alert("Added to trip successfully!"); // clear feedback for MVP
            // Reset
            setSelectedTripId("");
            setSelectedDay(1);
        } else {
            setMessage(result.message || "Failed to add.");
        }
    };

    return (
        <>
            {trigger ? (
                <div onClick={() => setIsOpen(true)}>{trigger}</div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-terracotta text-white font-bold py-4 rounded-xl shadow-lg hover:bg-deep-teak transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add to Trip
                </button>
            )}

            {isOpen && isMounted && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-stone-gray/10 flex justify-between items-center bg-warm-white">
                            <h3 className="font-heading font-bold text-xl text-deep-teak">
                                {place ? `Add ${place.name}` : "Add to Itinerary"}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-gray/10 rounded-full text-stone-gray">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-gray mb-2">Select Trip</label>
                                {trips.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {trips.map(trip => (
                                            <label
                                                key={trip.id}
                                                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedTripId === trip.id
                                                    ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta"
                                                    : "border-stone-gray/20 hover:border-terracotta/50"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="trip"
                                                    value={trip.id}
                                                    checked={selectedTripId === trip.id}
                                                    onChange={(e) => {
                                                        setSelectedTripId(e.target.value);
                                                        setSelectedDay(1); // Reset day
                                                    }}
                                                    className="hidden"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold text-deep-teak">{trip.title}</div>
                                                    <div className="text-xs text-stone-gray">{format(parseISO(trip.start_date), "MMM d")} - {format(parseISO(trip.end_date), "MMM d, yyyy")}</div>
                                                </div>
                                                {selectedTripId === trip.id && <div className="w-4 h-4 rounded-full bg-terracotta ml-2" />}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-stone-gray text-sm bg-warm-white/50 rounded-xl">
                                        No upcoming trips found.
                                        <a href="/dashboard/trips/new" className="text-terracotta font-bold hover:underline ml-1">Create one first?</a>
                                    </div>
                                )}
                            </div>

                            {selectedTrip && (
                                <div>
                                    <label className="block text-sm font-medium text-stone-gray mb-2">Select Day</label>
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none bg-white appearance-none"
                                    >
                                        {days.map(day => (
                                            <option key={day.number} value={day.number}>
                                                Day {day.number} - {day.date}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {message && <p className="text-red-500 text-sm text-center">{message}</p>}

                            <button
                                type="submit"
                                disabled={!selectedTripId || isSubmitting}
                                className="w-full py-4 rounded-full bg-terracotta text-white font-bold text-lg hover:bg-deep-teak transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isSubmitting ? "Adding..." : "Confirm & Add"}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
