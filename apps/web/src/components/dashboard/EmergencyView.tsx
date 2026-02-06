"use client";

import { useState, useEffect, useCallback } from "react";
import { Hospital, Shield, Pill, Building2, Phone, MapPin, ExternalLink, AlertTriangle, Lock, CheckCircle2, Loader2, Navigation, LocateFixed } from "lucide-react";
import { getEmergencyNumbers, getCountryFromDestination, getDestinationCoordinates, type EmergencyNumbers } from "@/lib/emergencyNumbers";

interface EmergencyPlace {
    id: number;
    name: string;
    type: "hospital" | "clinic" | "police" | "pharmacy";
    lat: number;
    lon: number;
    distance?: number;
    address?: string;
    phone?: string;
}

interface EmergencyViewProps {
    trip: any;
    activities: any[];
    tripStatus: string;
}

const TYPE_CONFIG = {
    hospital: { icon: Hospital, label: "Hospitals", color: "text-red-600", bg: "bg-red-50" },
    clinic: { icon: Building2, label: "Clinics", color: "text-orange-600", bg: "bg-orange-50" },
    police: { icon: Shield, label: "Police Stations", color: "text-blue-600", bg: "bg-blue-50" },
    pharmacy: { icon: Pill, label: "Pharmacies", color: "text-green-600", bg: "bg-green-50" },
};

export function EmergencyView({ trip, activities, tripStatus }: EmergencyViewProps) {
    // Derive status flags
    const isActive = tripStatus === 'active';
    const isCompleted = tripStatus === 'completed';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{
        hospitals: EmergencyPlace[];

        clinics: EmergencyPlace[];
        police: EmergencyPlace[];
        pharmacies: EmergencyPlace[];
    } | null>(null);

    // GPS Location state
    const [useGPS, setUseGPS] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);

    // Get emergency numbers based on destination
    const countryCode = getCountryFromDestination(trip.destination) || "ID";
    const emergencyNumbers = getEmergencyNumbers(countryCode);

    // Try to get coordinates from activities first, then fall back to destination
    const referenceActivity = activities.find(a => a.place?.latitude && a.place?.longitude);
    const activityLat = referenceActivity?.place?.latitude;
    const activityLon = referenceActivity?.place?.longitude;

    // Fallback to destination coordinates if no activity has coordinates
    const destinationCoords = getDestinationCoordinates(trip.destination);

    // Final coordinates: GPS > Activity > Destination
    const refLat = useGPS && gpsCoords ? gpsCoords.lat : (activityLat || destinationCoords?.lat);
    const refLon = useGPS && gpsCoords ? gpsCoords.lon : (activityLon || destinationCoords?.lon);

    // Fetch emergency services
    const fetchEmergencyServices = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/emergency?lat=${lat}&lon=${lon}&radius=5000`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch");
            }

            setResults(data.results);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle "Use My Location" button
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setGpsError("Geolocation is not supported by your browser");
            return;
        }

        setGpsLoading(true);
        setGpsError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                setGpsCoords(coords);
                setUseGPS(true);
                setGpsLoading(false);
                // Immediately fetch with new coordinates
                fetchEmergencyServices(coords.lat, coords.lon);
            },
            (error) => {
                setGpsLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setGpsError("Location access denied. Please enable location permissions.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setGpsError("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        setGpsError("Location request timed out.");
                        break;
                    default:
                        setGpsError("An unknown error occurred.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Reset to trip location
    const handleUseTrip = () => {
        setUseGPS(false);
        setGpsCoords(null);
        const lat = activityLat || destinationCoords?.lat;
        const lon = activityLon || destinationCoords?.lon;
        if (lat && lon) {
            fetchEmergencyServices(lat, lon);
        }
    };

    useEffect(() => {
        if (!isActive || !refLat || !refLon || useGPS) return;
        fetchEmergencyServices(refLat, refLon);
    }, [isActive, refLat, refLon, useGPS, fetchEmergencyServices]);

    // Completed trip state - emergency services no longer needed
    if (isCompleted) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-rice-paddy-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-rice-paddy-green" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">Trip Completed</h3>
                    <p className="text-stone-gray mb-4">
                        This trip has ended. Emergency services are only available during active trips.
                    </p>
                    <p className="text-sm text-stone-gray/70">
                        Emergency services lookup is designed for travelers currently on their trip.
                    </p>
                </div>
            </div>
        );
    }

    // Not committed state
    if (!isActive) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-stone-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-stone-gray/50" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">Emergency Services Locked</h3>
                    <p className="text-stone-gray mb-6">
                        Commit your trip to unlock emergency services information. Once committed, you'll see nearby hospitals, police stations, pharmacies, and local emergency numbers.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                        <div className="flex items-start gap-3">

                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium mb-1">Why commit?</p>
                                <p>Committing locks your itinerary and enables travel-mode features like emergency services lookup based on your activity locations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No coordinates available
    if (!refLat || !refLon) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">No Location Data</h3>
                    <p className="text-stone-gray mb-4">
                        Add activities with locations to see nearby emergency services.
                    </p>
                    <button
                        onClick={handleUseMyLocation}
                        disabled={gpsLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-turquoise text-white rounded-xl hover:bg-ocean-turquoise/90 transition-colors font-medium disabled:opacity-50"
                    >
                        {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                        Use My Current Location
                    </button>
                    {gpsError && <p className="text-red-500 text-sm mt-2">{gpsError}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-warm-white min-h-full">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Location Toggle Bar */}
                <div className="bg-white rounded-xl border border-stone-gray/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${useGPS ? 'bg-ocean-turquoise/10' : 'bg-terracotta/10'}`}>
                            {useGPS ? <LocateFixed className="w-5 h-5 text-ocean-turquoise" /> : <MapPin className="w-5 h-5 text-terracotta" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deep-teak">
                                {useGPS ? 'Using your current location' : `Using trip location: ${trip.destination}`}
                            </p>
                            <p className="text-xs text-stone-gray">
                                {refLat?.toFixed(4)}, {refLon?.toFixed(4)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!useGPS ? (
                            <button
                                onClick={handleUseMyLocation}
                                disabled={gpsLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-turquoise text-white rounded-xl hover:bg-ocean-turquoise/90 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                                Use My Location
                            </button>
                        ) : (
                            <button
                                onClick={handleUseTrip}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-stone-gray/20 text-stone-gray rounded-xl hover:bg-stone-gray/5 transition-colors text-sm font-medium"
                            >
                                <MapPin className="w-4 h-4" />
                                Use Trip Location
                            </button>
                        )}
                    </div>
                </div>

                {gpsError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-sm">
                        {gpsError}
                    </div>
                )}

                {/* Emergency Numbers Card */}
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Phone className="w-6 h-6" />
                        <h2 className="text-lg font-bold">Emergency Numbers — {trip.destination}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <EmergencyNumberCard label="Police" number={emergencyNumbers.police} icon="🚔" />
                        <EmergencyNumberCard label="Ambulance" number={emergencyNumbers.ambulance} icon="🚑" />
                        <EmergencyNumberCard label="Fire" number={emergencyNumbers.fire} icon="🚒" />
                        {emergencyNumbers.general && (
                            <EmergencyNumberCard label="General" number={emergencyNumbers.general} icon="📞" />
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
                        <span className="ml-3 text-stone-gray">Finding nearby services...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        <p className="font-medium">Failed to load emergency services</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Results */}
                {results && !loading && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <ServiceCategory type="hospital" places={results.hospitals} refLat={refLat} refLon={refLon} />
                        <ServiceCategory type="police" places={results.police} refLat={refLat} refLon={refLon} />
                        <ServiceCategory type="clinic" places={results.clinics} refLat={refLat} refLon={refLon} />
                        <ServiceCategory type="pharmacy" places={results.pharmacies} refLat={refLat} refLon={refLon} />
                    </div>
                )}
            </div>
        </div>
    );
}

function EmergencyNumberCard({ label, number, icon }: { label: string; number: string; icon: string }) {
    return (
        <a
            href={`tel:${number}`}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors block active:scale-95"
        >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">{label}</div>
            <div className="text-xl font-bold flex items-center gap-2">
                {number}
                <Phone className="w-4 h-4 opacity-70" />
            </div>
            <div className="text-xs text-white/50 mt-1">Tap to call</div>
        </a>
    );
}



function ServiceCategory({
    type,
    places,
    refLat,
    refLon,
}: {
    type: keyof typeof TYPE_CONFIG;
    places: EmergencyPlace[];
    refLat: number;
    refLon: number;
}) {
    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    return (
        <div className="bg-white rounded-2xl border border-stone-gray/10 overflow-hidden">
            <div className={`px-4 py-3 ${config.bg} border-b border-stone-gray/10 flex items-center gap-2`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
                <h3 className="font-bold text-deep-teak">{config.label}</h3>
                <span className="ml-auto text-sm text-stone-gray">{places.length} found</span>
            </div>
            <div className="divide-y divide-stone-gray/5">
                {places.length === 0 ? (
                    <div className="p-4 text-center text-stone-gray text-sm">
                        No {config.label.toLowerCase()} found within 5km
                    </div>
                ) : (
                    places.slice(0, 5).map((place) => (
                        <div key={place.id} className="p-4 hover:bg-stone-gray/5 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-deep-teak text-sm truncate">{place.name}</h4>
                                    {place.address && (
                                        <p className="text-xs text-stone-gray mt-0.5 truncate">{place.address}</p>
                                    )}
                                    {place.phone ? (
                                        <a
                                            href={`tel:${place.phone}`}
                                            className="text-sm text-ocean-turquoise mt-2 inline-flex items-center gap-1.5 font-medium hover:text-ocean-turquoise/80 active:scale-95 transition-all"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {place.phone}
                                        </a>
                                    ) : (
                                        <p className="text-xs text-stone-gray/50 mt-1 italic">No phone listed</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {place.distance !== undefined && (
                                        <span className="text-xs text-stone-gray bg-stone-gray/10 px-2 py-1 rounded-full">
                                            {place.distance} km
                                        </span>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/dir/${refLat},${refLon}/${place.lat},${place.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-stone-gray/60 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                                        title="Get directions"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
