import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Clock, Phone, Globe, ExternalLink, ArrowLeft, Tag, CreditCard, Info, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { PrintPageButton } from "@/components/dashboard/PrintPageButton";
import { getCountryFromDestination, getEmergencyNumbers } from "@/lib/emergencyNumbers";
import { generateDayRouteUrl, generateGoogleMapsUrl } from "@/lib/maps";
import Image from "next/image";

export const dynamic = "force-dynamic";

import { Activity, Place } from "@/types/trip";

// Helper for parsing simple markdown-like text (Shared logic with TripDetailsView)
function SmartText({ text, className = "" }: { text: string; className?: string }) {
    if (!text) return null;

    // Clean up double backslashes which might be present in the data
    // Clean up backslashes which might be present in the data (handling both double \\ and single \)
    const cleanText = text.replace(/\\\\/g, '\n').replace(/\\/g, '\n').replace(/\n\n/g, '\n');

    // 1. Handle "Visitor Tips" or similar lists embedded with checkmarks
    // If we detect multiple checkmarks, treat it as a list
    if (cleanText.includes("✓") || cleanText.includes("✔")) {
        const segments = cleanText.split(/(?=✓|✔)/).filter(s => s.trim().length > 0);
        if (segments.length > 1) {
            return (
                <div className={`space-y-1 ${className}`}>
                    {segments.map((segment, i) => {
                        const segmentText = segment.replace(/^[✓✔]\s*/, "").trim();
                        // Check if this segment is a header (e.g. "Visitor Tips")
                        if (segment.toLowerCase().includes("visitor tips") && !segment.match(/^[✓✔]/)) {
                            const [header, ...rest] = segment.split(/(?=✓|✔)/);
                            return (
                                <div key={i} className="mt-2">
                                    {header && <div className="font-bold text-deep-teak mb-1">{header}</div>}
                                    {rest.map((r, ri) => (
                                        <div key={ri} className="flex gap-2 items-start">
                                            <span className="text-terracotta font-bold">•</span>
                                            <span className="text-stone-600">{r.replace(/^[✓✔]\s*/, "").trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // Standard checkmark item
                        return (
                            <div key={i} className="flex gap-2 items-start">
                                <span className="text-terracotta font-bold">•</span>
                                <span className={segment.match(/^[✓✔]/) ? "text-stone-600" : "font-bold text-deep-teak"}>
                                    {segmentText}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    // 2. Standard Text Formatting (Bold, Newlines)
    const lines = cleanText.split('\n');
    return (
        <div className={`space-y-2 ${className}`}>
            {lines.map((line, i) => {
                // Skip empty lines if they are just whitespace
                if (!line.trim()) return <div key={i} className="h-2"></div>;

                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={i} className="min-h-[1em]">
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="text-deep-teak">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
}

export default async function PrintTripPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: trip } = await supabase.from("trips").select("*").eq("id", params.id).single();
    if (!trip) return notFound();

    const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .eq("trip_id", params.id)
        .order("day_number", { ascending: true })
        .order("start_time", { ascending: true });

    // Group activities by day and collect place IDs
    const activitiesByDay: Record<number, Activity[]> = {};
    const placeIds: string[] = [];

    (activities as Activity[] | null)?.forEach(act => {
        if (!activitiesByDay[act.day_number]) activitiesByDay[act.day_number] = [];
        activitiesByDay[act.day_number].push(act);
        if (act.place_id) placeIds.push(act.place_id);
    });

    // Fetch details for linked places
    const { data: places } = await supabase
        .from("places")
        .select("*")
        .in("id", placeIds);

    const placesMap = (places as Place[] | null || []).reduce((acc, place) => {
        acc[place.id] = place;
        return acc;
    }, {} as Record<string, Place>);

    // Get emergency numbers
    const countryCode = getCountryFromDestination(trip.destination);
    const emergencyNumbers = countryCode ? getEmergencyNumbers(countryCode) : null;

    return (
        <div id="print-content" className="w-full md:max-w-[297mm] mx-auto bg-white p-8 min-h-screen print:p-0 print:max-w-none">
            <style dangerouslySetInnerHTML={{
                __html: `
                @page { 
                    size: A4 landscape; 
                    margin: 10mm;
                }
                @media print {
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        margin: 0;
                        padding: 0;
                    }
                    /* Ensure containers take full width in print */
                    #print-content {
                        width: 100% !important;
                        max-width: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                    }
                    .break-before-page {
                        page-break-before: always;
                    }
                }
            ` }} />
            {/* Navigation (Hidden in Print) */}
            <div className="mb-6 print:hidden flex flex-col sm:flex-row justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-gray/10 gap-4" data-html2canvas-ignore="true">
                <Link
                    href={`/dashboard/trips/${params.id}`}
                    className="flex items-center gap-2 text-stone-gray hover:text-deep-teak transition-colors font-medium text-sm md:text-base w-full sm:w-auto"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <PrintPageButton />
                </div>
            </div>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex justify-between items-start border-b-2 border-deep-teak pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2 leading-tight">{trip.title}</h1>
                        <div className="flex items-center gap-4 text-stone-gray text-sm">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                <span className="font-medium">{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-terracotta" />
                                <span className="font-medium">
                                    {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-24 h-8 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Itinara"
                            fill
                            className="object-contain object-right"
                        />
                    </div>
                </div>

                {/* About & Emergency Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* About This Trip */}
                    <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                        <h2 className="text-sm font-bold text-deep-teak mb-2 flex items-center gap-2 uppercase tracking-wide">
                            <Globe className="w-4 h-4 text-terracotta" />
                            About This Trip
                        </h2>
                        {trip.description && (
                            <div className="text-xs text-stone-600 leading-relaxed mb-2 line-clamp-3">
                                <SmartText text={trip.description} />
                            </div>
                        )}
                        <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-200 mt-2">
                            A curated itinerary for <strong>{trip.destination}</strong>.
                            {activities?.length ? ` Includes ${activities.length} activities.` : ''}
                        </p>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                        <h2 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            Emergency Contacts ({countryCode})
                        </h2>
                        {emergencyNumbers ? (
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-1">
                                    <span className="text-emerald-800">General/Police</span>
                                    <span className="font-bold text-emerald-900">{emergencyNumbers.general || emergencyNumbers.police}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-1">
                                    <span className="text-emerald-800">Ambulance</span>
                                    <span className="font-bold text-emerald-900">{emergencyNumbers.ambulance}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-800">Fire</span>
                                    <span className="font-bold text-emerald-900">{emergencyNumbers.fire}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-emerald-800 italic">
                                Emergency contacts not available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-8">
                {Object.keys(activitiesByDay).map((dayNum) => {
                    const dayActivities = activitiesByDay[parseInt(dayNum)];
                    const dayDate = new Date(trip.start_date);
                    dayDate.setDate(dayDate.getDate() + (parseInt(dayNum) - 1));
                    const routeUrl = generateDayRouteUrl(dayActivities);
                    const hasRoute = dayActivities.some(a => (a.location && a.location.trim()) || (a.place_name && a.place_name.trim()) || (a.title && a.title.trim()));

                    return (
                        <div key={dayNum} className="break-before-page">
                            {/* Day Header */}
                            <div className="flex justify-between items-center mb-6 border-b-2 border-stone-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-deep-teak text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                                        {dayNum}
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold text-deep-teak">
                                        {format(dayDate, "EEEE, MMMM d")}
                                    </h2>
                                </div>
                                {hasRoute && (
                                    <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-terracotta uppercase border border-terracotta/30 px-3 py-1 rounded-full hover:bg-terracotta/5">
                                        View Map
                                    </a>
                                )}
                            </div>

                            <div className="space-y-6">
                                {dayActivities.map((act) => {
                                    const place = act.place_id ? placesMap[act.place_id] : null;
                                    const fallbackLocation = act.location || act.place_name || (place ? (place.location || place.full_address) : null);

                                    return (
                                        <div key={act.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden break-inside-avoid shadow-sm">
                                            {/* Top Bar: Time & Category */}
                                            <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 border border-stone-200 px-1.5 py-0.5 rounded bg-white">
                                                        <Clock className="w-3 h-3 text-terracotta" />
                                                        {act.start_time ? act.start_time.slice(0, 5) : "--:--"}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{act.category || "Activity"}</span>
                                                </div>
                                                <a href={generateGoogleMapsUrl(fallbackLocation || act.title)} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-deep-teak">
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            {/* Main Content Grid */}
                                            <div className="grid grid-cols-[1.2fr_0.8fr] gap-0 divide-x divide-stone-100">
                                                {/* Left Column: Content */}
                                                <div className="p-4 space-y-4">
                                                    <div>
                                                        <h3 className="font-heading font-bold text-lg text-deep-teak leading-tight">{act.title}</h3>
                                                        {fallbackLocation && (
                                                            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                                                                <MapPin className="w-3 h-3 text-stone-400" />
                                                                <span className="truncate">{fallbackLocation}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        {/* Notes/About */}
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-stone-400 uppercase mb-1">About</h4>
                                                            <div className="text-xs text-stone-600 leading-relaxed">
                                                                <SmartText text={place?.description || "Experience the local culture and sights."} />
                                                            </div>
                                                        </div>

                                                        {/* Pricing */}
                                                        {(place?.price_level || place?.ticket_price) && (
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-stone-400 uppercase mb-1">Pricing</h4>
                                                                <div className="text-xs text-stone-600">
                                                                    {place.price_level && <span className="font-bold text-emerald-600 mr-2">{place.price_level}</span>}
                                                                    <SmartText text={place.ticket_price || "Fees apply"} className="inline" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Column: Tips & Info */}
                                                <div className="p-4 bg-stone-50/30 space-y-4">
                                                    {/* User Notes */}
                                                    {act.notes && (
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                                                                <Tag className="w-3 h-3" /> Your Notes
                                                            </h4>
                                                            <div className="text-xs text-stone-600 italic leading-relaxed bg-amber-50/50 p-2 rounded border border-amber-100/50">
                                                                <SmartText text={act.notes} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Visitor Tips / Amenities */}
                                                    {place?.amenities && Array.isArray(place.amenities) && place.amenities.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-terracotta uppercase mb-1 flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" /> Tips
                                                            </h4>
                                                            <ul className="space-y-1">
                                                                {place.amenities.slice(0, 3).map((tip: string, i: number) => (
                                                                    <li key={i} className="text-[10px] text-stone-500 flex gap-1.5 items-start leading-tight">
                                                                        <span className="text-terracotta">•</span>
                                                                        <span>{typeof tip === 'string' ? tip : 'Check details'}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Contact */}
                                                    {(place?.phone || place?.website) && (
                                                        <div className="pt-2 border-t border-stone-100 flex flex-col gap-1">
                                                            {place.phone && (
                                                                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                                                                    <Phone className="w-3 h-3 text-stone-400" />
                                                                    {place.phone}
                                                                </div>
                                                            )}
                                                            {place.website && (
                                                                <a href={place.website} target="_blank" className="flex items-center gap-1.5 text-[10px] text-stone-500 hover:text-terracotta truncate">
                                                                    <Globe className="w-3 h-3 text-stone-400" />
                                                                    <span className="truncate">{place.website.replace(/^https?:\/\//, '')}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 pt-8 border-t border-stone-gray/10 flex flex-col items-center justify-center gap-4 text-center text-sm text-stone-gray print:hidden">
                <p>Ready to go? Print this guide or save it as a PDF.</p>
                <PrintPageButton />
            </div>

            {/* Print Footer */}
            <div className="hidden print:flex justify-between items-center mt-auto pt-8 border-t border-stone-gray/10 text-xs text-stone-gray/50">
                <span>{trip.title} • {trip.destination}</span>
                <span>Generated by Itinara • itinaravacation.com</span>
            </div>
        </div>
    );
}
