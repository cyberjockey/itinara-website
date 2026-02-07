"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Share2, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TripDeleteButton } from "./TripDeleteButton";
import { TripCommitButton } from "./TripCommitButton";
import { CalendarExportButton } from "./CalendarExportButton";
import { ShareButton } from "./ShareButton";
import { TripVisibilityToggle } from "./TripVisibilityToggle";

interface Activity {
    id: string;
    title: string;
    start_time: string | null;
    day_number: number;
    notes: string | null;
    location: string | null;
}

interface TripActionsMenuProps {
    tripId: string;
    tripTitle: string;
    tripStartDate: string;
    activities: Activity[];
    isCommitted: boolean;
    isOwner: boolean;
}

export function TripActionsMenu({
    tripId,
    tripTitle,
    tripStartDate,
    activities,
    isCommitted,
    isOwner,
    isPublic
}: TripActionsMenuProps & { isPublic?: boolean }) { // Added isPublic to props type
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!isOwner) {
        return (
            <Link
                href={`/dashboard/trips/${tripId}/print`}
                className="p-2 text-stone-gray hover:text-deep-teak hover:bg-stone-gray/5 rounded-full transition-colors border border-transparent hover:border-stone-gray/10"
                title="Print Trip"
            >
                <Share2 className="w-5 h-5" />
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 rounded-full transition-colors border",
                    isOpen
                        ? "bg-deep-teak text-white border-deep-teak"
                        : "bg-white text-stone-gray border-stone-gray/20 hover:border-deep-teak hover:text-deep-teak"
                )}
                title="More Actions"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-stone-gray/10 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-1 flex flex-col gap-1">

                        <div onClick={() => setIsOpen(false)}>
                            <ShareButton tripId={tripId} variant="menu-item" />
                        </div>

                        <Link
                            href={`/dashboard/trips/${tripId}/print`}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-stone-gray hover:text-deep-teak hover:bg-stone-gray/5 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Share2 className="w-4 h-4" />
                            Print Trip
                        </Link>

                        <div onClick={() => setIsOpen(false)}>
                            <CalendarExportButton
                                tripTitle={tripTitle}
                                tripStartDate={tripStartDate}
                                activities={activities}
                                variant="menu-item"
                            />
                        </div>

                        <div className="h-px bg-stone-gray/10 my-1" />

                        <div onClick={() => setIsOpen(false)}>
                            {/* Assuming TripVisibilityToggle is imported. I need to import it. 
                                It was not imported in the original file I see in `view_file` output 
                                (wait, I didn't see it imported in module view earlier).
                                I'll add the import.
                             */}
                            <TripVisibilityToggle tripId={tripId} initialIsPublic={!!isPublic} variant="menu-item" />
                        </div>

                        <div onClick={() => setIsOpen(false)}>
                            <TripCommitButton
                                tripId={tripId}
                                initialIsCommitted={isCommitted}
                                variant="menu-item"
                            />
                        </div>

                        <div className="h-px bg-stone-gray/10 my-1" />

                        <div onClick={() => setIsOpen(false)}>
                            <TripDeleteButton tripId={tripId} variant="menu-item" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
