"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, MoreVertical, Car, ExternalLink, X } from "lucide-react";
import { createPortal } from "react-dom";

import { Activity } from "@/types/trip";
import { calculateEstimatedFare, formatCurrency, Coordinates } from "@/lib/fares";

interface SortableActivityCardProps {
    activity: Activity;
    readOnly?: boolean;
    previousCoordinates?: Coordinates | null;
}

export function SortableActivityCard({ activity, readOnly = false, previousCoordinates }: SortableActivityCardProps) {
    const [showRideOptions, setShowRideOptions] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

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

    // Toggle handler
    const toggleRideOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!showRideOptions) {
            // Calculate position
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                // Position: Right aligned to button, Top aligned to button bottom
                setPopoverPos({
                    top: rect.bottom + 8,
                    left: rect.right - 256 // Width of w-64 is 16rem = 256px
                });
            }
            setShowRideOptions(true);
        } else {
            setShowRideOptions(false);
        }
    };

    // Handle click outside to close popover
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if click is outside popover AND outside the button
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowRideOptions(false);
            }
        }
        if (showRideOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showRideOptions]);

    const latRaw = activity.place?.coordinates?.lat ?? activity.place?.latitude;
    const lngRaw = activity.place?.coordinates?.lng ?? activity.place?.longitude;
    const hasCoordinates = (latRaw !== undefined && latRaw !== null) && (lngRaw !== undefined && lngRaw !== null);

    // State for real-time fare calculation
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Calculate fare based on USER LOCATION
    const fareEstimate = (hasCoordinates && userLocation)
        ? calculateEstimatedFare(userLocation, { lat: Number(latRaw), lng: Number(lngRaw) })
        : null;

    // Fetch location when popover opens
    useEffect(() => {
        if (showRideOptions && hasCoordinates && !userLocation) {
            setLoadingLocation(true);
            setLocationError(null);

            if (!navigator.geolocation) {
                setLocationError("Geolocation not supported");
                setLoadingLocation(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Location access denied");
                    setLoadingLocation(false);
                }
            );
        }
    }, [showRideOptions, hasCoordinates, userLocation]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(readOnly ? {} : listeners)}
            className={`bg-white p-4 rounded-xl border border-stone-gray/10 shadow-sm flex gap-3 
                ${readOnly ? 'cursor-default' : 'hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group'}
                relative
                ${showRideOptions ? 'z-50' : ''} 
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
                        <div className="flex items-center gap-2 truncate pr-2">
                            <h4 className="font-bold text-deep-teak truncate" title={activity.title}>
                                {activity.title}
                            </h4>
                            {activity.place_id && (
                                <a
                                    href={activity.place?.destination_id
                                        ? `/dashboard/explore/${activity.place.destination_id}/place/${activity.place_id}`
                                        : `/dashboard/explore/search?place=${activity.place_id}`}
                                    target="_blank"
                                    className="text-stone-gray hover:text-terracotta transition-colors"
                                    title="View Details"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                                    </svg>
                                </a>
                            )}
                        </div>

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

                    {/* Always show Navigate / Location block if we have a title or location */}
                    <div className="flex items-center gap-2 text-xs text-stone-gray mt-1 flex-wrap">
                        <div className="flex items-center gap-1 truncate flex-1 min-w-[100px]">
                            <MapPin className="w-3 h-3 text-terracotta flex-shrink-0" />
                            <span className="truncate">{activity.location || activity.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location || activity.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 bg-stone-gray/5 text-stone-gray hover:text-terracotta rounded-md hover:bg-stone-gray/10 transition-colors font-medium whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Navigate
                            </a>

                            {/* Ride Hailing Button */}
                            {hasCoordinates && (
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={toggleRideOptions}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors font-medium whitespace-nowrap
                                            ${showRideOptions
                                                ? 'bg-deep-teak text-white shadow-md'
                                                : 'bg-stone-gray/5 text-stone-gray hover:text-deep-teak hover:bg-stone-gray/10'
                                            }
                                        `}
                                    >
                                        <Car className="w-3 h-3" />
                                        Ride
                                    </button>

                                    {/* Ride Options Popover - PORTAL */}
                                    {showRideOptions && typeof document !== 'undefined' && createPortal(
                                        <div
                                            ref={popoverRef}
                                            style={{
                                                position: 'fixed',
                                                top: popoverPos.top,
                                                left: popoverPos.left,
                                                zIndex: 9999
                                            }}
                                            className="w-64 bg-white rounded-xl shadow-xl border border-stone-gray/10 p-3 animate-in fade-in zoom-in-95 duration-200"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-gray/10">
                                                <span className="text-xs font-bold text-stone-gray uppercase">Ride To Location</span>
                                                <button
                                                    onClick={() => setShowRideOptions(false)}
                                                    className="text-stone-gray hover:text-deep-teak"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Location Status / Error */}
                                            {loadingLocation && (
                                                <div className="text-[10px] text-stone-gray text-center py-2 italic animate-pulse">
                                                    📍 Locating you...
                                                </div>
                                            )}
                                            {locationError && (
                                                <div className="text-[10px] text-red-500 text-center py-2 bg-red-50 rounded mb-2">
                                                    {locationError}. <br />Enable location services.
                                                </div>
                                            )}

                                            {/* Fare Estimates (only if active) */}
                                            {fareEstimate && (
                                                <div className="mb-2">
                                                    <div className="grid grid-cols-2 gap-2 text-center mb-2">
                                                        <div className="bg-stone-gray/5 rounded p-1.5">
                                                            <div className="text-[10px] text-stone-gray uppercase font-bold">Car</div>
                                                            <div className="font-bold text-deep-teak text-sm">~{formatCurrency(fareEstimate.car)}</div>
                                                        </div>
                                                        <div className="bg-stone-gray/5 rounded p-1.5">
                                                            <div className="text-[10px] text-stone-gray uppercase font-bold">Bike</div>
                                                            <div className="font-bold text-deep-teak text-sm">~{formatCurrency(fareEstimate.bike)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="text-[9px] text-stone-gray/80 text-center mb-3 bg-stone-gray/5 p-1.5 rounded border border-stone-gray/10">
                                                        <p className="font-semibold mb-1">Estimated based on:</p>
                                                        <p>Car: Base 15k + 6k/km</p>
                                                        <p>Bike: Base 10k + 3k/km</p>
                                                        <p className="mt-1.5 italic text-stone-gray/60 border-t border-stone-gray/10 pt-1">
                                                            This is an estimation. For exact price please visit the hailride app below.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2">
                                                <a
                                                    href="grab://open"
                                                    className="flex flex-col items-center justify-center p-2 bg-[#00B140]/10 text-[#00B140] rounded-lg hover:bg-[#00B140] hover:text-white transition-all group/grab"
                                                >
                                                    <span className="font-bold text-sm">Grab</span>
                                                    <ExternalLink className="w-3 h-3 mt-1 opacity-70 group-hover/grab:opacity-100" />
                                                </a>
                                                <a
                                                    href="gojek://"
                                                    className="flex flex-col items-center justify-center p-2 bg-[#00AA13]/10 text-[#00AA13] rounded-lg hover:bg-[#00AA13] hover:text-white transition-all group/gojek"
                                                >
                                                    <span className="font-bold text-sm">Gojek</span>
                                                    <ExternalLink className="w-3 h-3 mt-1 opacity-70 group-hover/gojek:opacity-100" />
                                                </a>
                                            </div>
                                            <p className="text-[9px] text-stone-gray/60 text-center mt-2 leading-tight">
                                                App must be installed
                                            </p>
                                        </div>,
                                        document.body
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
