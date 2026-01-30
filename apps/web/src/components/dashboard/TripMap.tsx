"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { Calendar, MapPin } from "lucide-react";

// Fix for default marker icon in Leaflet with Next.js
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// Custom icon setup
const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
    coordinates?: { lat: number; lng: number } | null;
}

interface TripMapProps {
    activities: Activity[];
}

// Helper to "geocode" locations for demo purposes if we don't have lat/long yet
// In a real app, 'activity' should save lat/long from the database
const MOCK_COORDS: Record<string, [number, number]> = {
    "Bali": [-8.409518, 115.188919],
    "Ubud": [-8.5069, 115.2625],
    "Kuta": [-8.7185, 115.1686],
    "Seminyak": [-8.6829, 115.1547],
    "Uluwatu": [-8.8149, 115.0884],
    "Jakarta": [-6.2088, 106.8456],
    "Yogyakarta": [-7.7956, 110.3695],
    "Borobudur": [-7.6079, 110.2038],
    "Prambanan": [-7.7520, 110.4915],
    "Komodo": [-8.5902, 119.4975],
};

function getCoordinates(location: string): [number, number] {
    // 1. Try exact match
    if (MOCK_COORDS[location]) return MOCK_COORDS[location];

    // 2. Try partial match
    for (const key of Object.keys(MOCK_COORDS)) {
        if (location.includes(key)) {
            // Add random jitter for multiple items in same city so they don't overlap perfectly
            const jitter = (Math.random() - 0.5) * 0.01;
            return [MOCK_COORDS[key][0] + jitter, MOCK_COORDS[key][1] + jitter];
        }
    }

    // Default to Bali center
    return [-8.409518, 115.188919];
}

export function TripMap({ activities }: TripMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-stone-gray/5 rounded-2xl animate-pulse" />;
    }

    const startPos: [number, number] = getCoordinates("Bali"); // Default fallback

    // Sub-component to handle map bounds
    function MapBounds() {
        const map = useMap();

        useEffect(() => {
            if (activities.length > 0) {
                const bounds = L.latLngBounds(activities.map(a => {
                    if (a.coordinates && typeof a.coordinates === 'object' && 'lat' in a.coordinates && 'lng' in a.coordinates) {
                        return [a.coordinates.lat, a.coordinates.lng];
                    }
                    return getCoordinates(a.location || "Bali");
                }));

                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        }, [activities, map]);

        return null;
    }

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-stone-gray/10 shadow-sm relative z-0">
            <MapContainer
                center={startPos}
                zoom={9}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBounds />

                {activities.map((activity) => {
                    let position: [number, number];

                    if (activity.coordinates && typeof activity.coordinates === 'object' && 'lat' in activity.coordinates && 'lng' in activity.coordinates) {
                        position = [activity.coordinates.lat, activity.coordinates.lng];
                    } else {
                        position = getCoordinates(activity.location || "Bali");
                    }

                    return (
                        <Marker key={activity.id} position={position} icon={customIcon}>
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[200px]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-bold text-terracotta uppercase flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Day {activity.day_number}
                                        </div>
                                        {activity.start_time && (
                                            <span className="text-xs font-mono bg-stone-gray/5 px-1.5 py-0.5 rounded text-stone-gray">
                                                {activity.start_time.slice(0, 5)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-deep-teak text-base mb-1 leading-tight">{activity.title}</h3>

                                    {activity.category && (
                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-stone-gray/5 text-stone-gray capitalize border border-stone-gray/10 mb-2">
                                            {activity.category}
                                        </span>
                                    )}

                                    {activity.location && (
                                        <div className="flex items-center gap-1 text-xs text-stone-gray mb-3">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{activity.location}</span>
                                        </div>
                                    )}

                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location || activity.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-bold text-xs"
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        Navigate
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    );
}
