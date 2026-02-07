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
        <div id="print-content" className="max-w-[297mm] mx-auto bg-white p-12 min-h-screen print:p-0 print:max-w-none">
            <style dangerouslySetInnerHTML={{
                __html: `
                @page { 
                    size: landscape; 
                    margin: 10mm;
                }
                @media print {
                    body {
                        background: white;
                    }
                }
            ` }} />
            {/* Navigation (Hidden in Print) */}
            <div className="mb-8 print:hidden flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-gray/10" data-html2canvas-ignore="true">
                <Link
                    href={`/dashboard/trips/${params.id}`}
                    className="flex items-center gap-2 text-stone-gray hover:text-deep-teak transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <PrintPageButton />
                </div>
            </div>

            {/* Header with Logo */}
            <div className="flex justify-between items-start border-b-2 border-deep-teak pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-deep-teak mb-2 leading-tight">{trip.title}</h1>
                    <div className="flex items-center gap-6 text-stone-gray text-sm">
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
                <div className="relative w-32 h-10">
                    <Image
                        src="/logo.png"
                        alt="Itinara"
                        fill
                        className="object-contain object-right"
                    />
                </div>
            </div>

            {/* Trip Details & Emergency Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10 break-inside-avoid">
                {/* Trip Summary/About */}
                <div className="bg-stone-gray/5 p-6 rounded-xl border border-stone-gray/10">
                    <h2 className="text-lg font-heading font-bold text-deep-teak mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-terracotta" />
                        About This Trip
                    </h2>
                    {trip.description && (
                        <p className="text-sm text-stone-gray leading-relaxed mb-3">
                            {trip.description}
                        </p>
                    )}
                    <p className="text-sm text-stone-gray leading-relaxed">
                        A curated itinerary for <strong>{trip.destination}</strong>.
                        This trip spans <strong>{(new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1} days</strong>
                        and includes <strong>{activities?.length || 0} activities</strong>.
                    </p>
                </div>

                {/* Emergency Contacts */}
                {emergencyNumbers ? (
                    <div className="bg-rice-paddy-green/10 p-6 rounded-xl border border-rice-paddy-green/20">
                        <h2 className="text-lg font-heading font-bold text-deep-teak mb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-deep-teak" />
                            Emergency Contacts ({countryCode})
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center border-b border-deep-teak/10 pb-1">
                                <span className="text-stone-gray">General/Police</span>
                                <span className="font-bold text-deep-teak">{emergencyNumbers.general || emergencyNumbers.police}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-deep-teak/10 pb-1">
                                <span className="text-stone-gray">Ambulance</span>
                                <span className="font-bold text-deep-teak">{emergencyNumbers.ambulance}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-gray">Fire</span>
                                <span className="font-bold text-deep-teak">{emergencyNumbers.fire}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-stone-gray/5 p-6 rounded-xl border border-stone-gray/10 flex items-center justify-center text-stone-gray text-sm italic">
                        Emergency contacts not available for this region.
                    </div>
                )}
            </div>

            {/* Itinerary - Manual Guide Style */}
            <div className="space-y-12">
                {Object.keys(activitiesByDay).map((dayNum) => {
                    const dayActivities = activitiesByDay[parseInt(dayNum)];
                    const dayDate = new Date(trip.start_date);
                    dayDate.setDate(dayDate.getDate() + (parseInt(dayNum) - 1));
                    const routeUrl = generateDayRouteUrl(dayActivities);
                    const hasRoute = dayActivities.some(a => (a.location && a.location.trim()) || (a.place_name && a.place_name.trim()) || (a.title && a.title.trim()));

                    return (
                        <div key={dayNum} className="break-inside-avoid print:break-before-page">
                            {/* Day Header */}
                            <div className="flex justify-between items-center mb-8 border-b-2 border-stone-gray/10 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-deep-teak text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                                        {dayNum}
                                    </div>
                                    <h2 className="text-3xl font-heading font-bold text-deep-teak">
                                        {format(dayDate, "EEEE, MMMM d")}
                                    </h2>
                                </div>

                                {hasRoute && (
                                    <a
                                        href={routeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-terracotta hover:text-deep-teak flex items-center gap-1 uppercase tracking-wide border border-terracotta/30 px-4 py-2 rounded-full hover:bg-terracotta/5 transition-colors"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        View Day Route
                                    </a>
                                )}
                            </div>

                            <div className="space-y-10">
                                {dayActivities.map((act) => {
                                    const place = act.place_id ? placesMap[act.place_id] : null;
                                    const fallbackLocation = act.location || act.place_name || (place ? (place.location || place.full_address) : null);

                                    return (
                                        <div key={act.id} className="bg-white rounded-2xl border border-stone-gray/10 shadow-sm overflow-hidden break-inside-avoid ring-1 ring-black/5">
                                            {/* Activity Header */}
                                            <div className="p-5 border-b border-stone-gray/10 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-gray bg-white border border-stone-gray/10 px-2 py-1 rounded">
                                                            <Clock className="w-3 h-3 text-terracotta" />
                                                            {act.start_time ? act.start_time.slice(0, 5) : "--:--"}
                                                        </div>
                                                        <span className="text-xs font-bold text-stone-gray/50 uppercase tracking-widest">{act.category || "Activity"}</span>
                                                    </div>
                                                    <h3 className="font-heading font-bold text-xl text-deep-teak">
                                                        {act.title}
                                                    </h3>
                                                    {fallbackLocation && (
                                                        <div className="flex items-center gap-1.5 text-sm text-stone-gray mt-1">
                                                            <MapPin className="w-3.5 h-3.5 text-stone-gray/60" />
                                                            <span className="italic">{fallbackLocation}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={generateGoogleMapsUrl(fallbackLocation || act.title)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-gray/20 text-stone-gray hover:text-terracotta hover:border-terracotta/50 transition-colors shadow-sm"
                                                        title="View on Maps"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Your Notes (High Priority) */}
                                            {act.notes && (
                                                <div className="bg-amber-50/50 border-b border-amber-100/50 p-5">
                                                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <Tag className="w-3 h-3" /> Your Notes
                                                    </h4>
                                                    <p className="text-sm text-stone-gray/90 italic leading-relaxed">
                                                        &quot;{act.notes}&quot;
                                                    </p>
                                                </div>
                                            )}

                                            {/* Detailed Content Grid */}
                                            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-gray/10">
                                                {/* Left Column: About & Pricing */}
                                                <div className="p-5 space-y-6">
                                                    {/* About */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-2">About</h4>
                                                        <p className="text-sm text-stone-gray leading-relaxed">
                                                            {place?.description || "Experience the local culture and sights."}
                                                        </p>
                                                    </div>

                                                    {/* Pricing & Entry */}
                                                    {(place?.price_level || place?.ticket_price) && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-rice-paddy-green uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                <CreditCard className="w-3 h-3" /> Pricing & Entry
                                                            </h4>
                                                            <div className="bg-rice-paddy-green/5 rounded-lg p-3 border border-rice-paddy-green/10 text-sm">
                                                                {place.price_level && <span className="font-bold text-deep-teak mr-2">{place.price_level}</span>}
                                                                <span className="text-stone-gray">{place.ticket_price || "Entry fees may vary."}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* What to Expect */}
                                                    {place?.what_to_expect && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-2">What To Expect</h4>
                                                            <p className="text-sm text-stone-gray leading-relaxed text-xs">
                                                                {place.what_to_expect}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Column: Tips & Info */}
                                                <div className="p-5 space-y-6 bg-stone-50/30">
                                                    {/* Contact */}
                                                    {(place?.phone || place?.website) && (
                                                        <div className="space-y-2">
                                                            {place.phone && (
                                                                <div className="flex items-center gap-2 text-sm text-stone-gray">
                                                                    <Phone className="w-3 h-3 text-terracotta" />
                                                                    <span>{place.phone}</span>
                                                                </div>
                                                            )}
                                                            {place.website && (
                                                                <a
                                                                    href={place.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-sm text-stone-gray hover:text-terracotta truncate"
                                                                >
                                                                    <Globe className="w-3 h-3 text-terracotta" />
                                                                    <span className="truncate">{place.website.replace(/^https?:\/\//, '')}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Tips (Amenities) */}
                                                    {place?.amenities && Array.isArray(place.amenities) && place.amenities.length > 0 && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-terracotta uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                <CheckCircle className="w-3 h-3" /> Visitor Tips
                                                            </h4>
                                                            <div className="bg-white rounded-lg p-3 border border-stone-gray/10 text-sm space-y-2 shadow-sm">
                                                                {place.amenities.slice(0, 3).map((tip: string, i: number) => (
                                                                    <div key={i} className="flex gap-2 items-start">
                                                                        <span className="text-terracotta font-bold">•</span>
                                                                        <span className="text-stone-gray text-xs leading-relaxed">{typeof tip === 'string' ? tip : 'Check details on site'}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Estimated Time */}
                                                    <div className="flex items-center gap-2 text-sm text-stone-gray/60 border-t border-dashed border-stone-gray/10 pt-3 mt-auto">
                                                        <Info className="w-3 h-3" />
                                                        <span>Suggested Duration: ~1-2 Hours</span>
                                                    </div>
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
                <span>Generated by Itinara • itinerara.com</span>
            </div>
        </div>
    );
}
