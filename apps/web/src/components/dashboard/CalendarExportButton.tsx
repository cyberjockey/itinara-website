"use client";

import { Calendar } from "lucide-react";
import { generateICS } from "@/lib/calendar";

interface Activity {
    id: string;
    title: string;
    start_time: string | null;
    day_number: number;
    notes: string | null;
    location: string | null;
    trip_start_date: string; // Passed from parent or calculated
}

interface CalendarExportButtonProps {
    tripTitle: string;
    tripStartDate: string;
    activities: any[]; // Using any for simplicity here, but should be typed match DB
}

export function CalendarExportButton({ tripTitle, tripStartDate, activities }: CalendarExportButtonProps) {

    const handleDownload = () => {
        const tripStart = new Date(tripStartDate);

        const events = activities.map(act => {
            // Calculate actual date
            const actDate = new Date(tripStart);
            actDate.setDate(actDate.getDate() + (act.day_number - 1));

            // Parse time (HH:MM or HH:MM:SS)
            if (act.start_time) {
                const [hours, minutes] = act.start_time.split(':').map(Number);
                actDate.setHours(hours, minutes, 0, 0);
            } else {
                // All day or default morning if no time
                actDate.setHours(9, 0, 0, 0);
            }

            return {
                title: act.title,
                description: act.notes || `Activity for ${tripTitle}`,
                location: act.location,
                start: actDate,
                durationMinutes: 60 // Default duration
            };
        });

        const icsContent = generateICS(events);

        // Create Blob and trigger download
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${tripTitle.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 border border-stone-gray/20 rounded-full text-stone-gray hover:bg-stone-gray/5 transition-colors font-medium text-sm"
        >
            <Calendar className="w-4 h-4" />
            Add to Calendar
        </button>
    );
}
