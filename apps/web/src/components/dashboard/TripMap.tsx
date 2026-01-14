"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

    const startPos: [number, number] = getCoordinates("Bali"); // Default center

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

                {activities.map((activity) => {
                    let position: [number, number];

                    if (activity.coordinates && typeof activity.coordinates === 'object' && 'lat' in activity.coordinates && 'lng' in activity.coordinates) {
                        position = [activity.coordinates.lat, activity.coordinates.lng];
                    } else {
                        position = getCoordinates(activity.location || "Bali");
                    }

                    return (
                        <Marker key={activity.id} position={position} icon={customIcon}>
                            <Popup>
                                <div className="p-1 min-w-[150px]">
                                    <div className="text-xs font-bold text-terracotta uppercase mb-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Day {activity.day_number} • {activity.start_time?.slice(0, 5) || "Anytime"}
                                    </div>
                                    <h3 className="font-bold text-deep-teak text-sm mb-1">{activity.title}</h3>
                                    {activity.location && (
                                        <div className="flex items-center gap-1 text-xs text-stone-gray">
                                            <MapPin className="w-3 h-3" /> {activity.location}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    );
}
