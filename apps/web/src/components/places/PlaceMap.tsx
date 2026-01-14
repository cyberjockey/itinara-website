"use client";

import { MapPin } from "lucide-react";

interface PlaceMapProps {
    coordinates?: { lat: number; lng: number };
    address: string;
}

export function PlaceMap({ coordinates, address }: PlaceMapProps) {
    // If no coordinates, we could fallback to a search query embed or just a placeholder
    // For MVP, if no coords, we assume we can't show a precise map easily without an API key for search
    // But we can use the address for a query param in the embed url if available

    // const embedUrl = coordinates 
    //     ? `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${coordinates.lat},${coordinates.lng}&zoom=15`
    //     : `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;

    // Since we likely don't have a public API key ready for this demo, we'll use a visual placeholder 
    // or a direct link to Google Maps.

    const googleMapsUrl = coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <div className="bg-stone-gray/5 rounded-xl p-1 overflow-hidden h-48 relative group">
            {/* Visual Placeholder for Map */}
            <div className="absolute inset-0 bg-[url('/images/map-pattern.png')] opacity-20 bg-center bg-cover" />

            <div className="absolute inset-0 flex items-center justify-center">
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-stone-gray hover:text-terracotta transition-colors bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm"
                >
                    <MapPin className="w-6 h-6" />
                    <span className="font-bold text-sm">View on Google Maps</span>
                    <span className="text-xs text-stone-gray/70 max-w-[200px] truncate text-center">{address}</span>
                </a>
            </div>
        </div>
    );
}
