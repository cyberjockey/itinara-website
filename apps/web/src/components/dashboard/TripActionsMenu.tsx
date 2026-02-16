"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Share2 } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";

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
    isPublic?: boolean;
}

export function TripActionsMenu({
    tripId,
    tripTitle,
    tripStartDate,
    activities,
    isCommitted,
    isOwner,
    isPublic
}: TripActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const toggleMenu = () => {
        if (!isOpen) {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                // Position: Right aligned to button, Top aligned to button bottom
                // w-56 = 14rem = 224px
                setMenuPos({
                    top: rect.bottom + 8,
                    left: rect.right - 224
                });
            }
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check both menu (portal) and button
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
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
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
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

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: menuPos.top,
                        left: menuPos.left,
                        zIndex: 9999
                    }}
                    className="w-56 bg-white rounded-xl shadow-xl border border-stone-gray/10 overflow-hidden animate-in slide-in-from-top-2 duration-200"
                >
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
                            <div>
                                <TripVisibilityToggle tripId={tripId} initialIsPublic={!!isPublic} variant="menu-item" />
                            </div>

                            <div>
                                <TripCommitButton
                                    tripId={tripId}
                                    initialIsCommitted={isCommitted}
                                    variant="menu-item"
                                />
                            </div>

                            <div className="h-px bg-stone-gray/10 my-1" />

                            <div>
                                <TripDeleteButton tripId={tripId} variant="menu-item" />
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
