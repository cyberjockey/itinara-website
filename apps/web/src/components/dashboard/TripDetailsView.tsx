"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, FileText, Download, MapPin, Phone, Globe, Clock, Info, Instagram, Facebook, Twitter, Youtube, CheckCircle2, Video } from "lucide-react";
import Link from 'next/link';

interface Place {
    id: string;
    name: string;
    description?: string;
    phone?: string;
    website?: string;
    location?: string;
    rating?: number;
    social_media?: Record<string, string>;
    price_level?: string;
    amenities?: string[];
    what_to_expect?: string;
}

interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
    place_id?: string;
    place?: Place;
}

interface TripDetailsViewProps {
    trip: any;
    activities: Activity[];
}

export function TripDetailsView({ trip, activities }: TripDetailsViewProps) {
    // Group by Day
    const activitiesByDay = activities.reduce((acc, activity) => {
        const day = activity.day_number || 1;
        if (!acc[day]) acc[day] = [];
        acc[day].push(activity);
        return acc;
    }, {} as Record<number, Activity[]>);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Documents Section */}
            <div className="bg-white rounded-2xl p-6 border border-stone-gray/10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-terracotta/10 rounded-lg">
                        <FileText className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-deep-teak">Trip Documents</h3>
                        <p className="text-sm text-stone-gray">Download your guides and tickets.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-between p-4 rounded-xl border border-stone-gray/20 hover:border-terracotta/50 hover:bg-stone-50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs uppercase">PDF</div>
                            <div className="text-left">
                                <div className="font-bold text-deep-teak group-hover:text-terracotta transition-colors">Complete Itinerary Guide</div>
                                <div className="text-xs text-stone-gray">2.4 MB • Updated just now</div>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-stone-gray group-hover:text-terracotta" />
                    </button>
                    {/* Placeholder for tickets */}
                    <button className="flex items-center justify-between p-4 rounded-xl border border-dotted border-stone-gray/30 hover:border-terracotta/50 hover:bg-stone-50 transition-all group">
                        <div className="flex items-center gap-3 opacity-60">
                            <FileText className="w-10 h-10 p-2 bg-stone-100 rounded-lg text-stone-400" />
                            <div className="text-left">
                                <div className="font-medium text-stone-gray">Booking Tickets</div>
                                <div className="text-xs text-stone-gray">Coming soon</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Daily Details */}
            <div className="space-y-6">
                <h3 className="font-bold text-xl text-deep-teak">Daily Activity Details</h3>

                {Object.entries(activitiesByDay).map(([dayNum, dayActivities]) => {
                    const date = trip.start_date ? format(new Date(new Date(trip.start_date).setDate(new Date(trip.start_date).getDate() + parseInt(dayNum) - 1)), "EEEE, MMMM d") : `Day ${dayNum}`;

                    return (
                        <div key={dayNum} className="space-y-4">
                            <div className="sticky top-0 bg-warm-white/95 backdrop-blur-sm py-3 z-10 border-b border-stone-gray/5 flex items-center gap-3">
                                <span className="bg-deep-teak text-white text-xs font-bold px-2 py-1 rounded">DAY {dayNum}</span>
                                <h4 className="font-bold text-stone-gray">{date}</h4>
                            </div>

                            <div className="space-y-4">
                                {dayActivities.map((activity) => (
                                    <DetailCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {activities.length === 0 && (
                    <div className="text-center py-12 text-stone-gray">
                        No activities yet. Switch to Timeline view to plan your trip!
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailCard({ activity }: { activity: Activity }) {
    const [isOpen, setIsOpen] = useState(false);
    const place = activity.place;

    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
        if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
        if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
        if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
        if (p.includes('tiktok')) return <Video className="w-4 h-4" />;
        return <Globe className="w-4 h-4" />;
    };

    return (
        <div className="bg-white rounded-xl border border-stone-gray/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50/50"
            >
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center min-w-[50px] pr-4 border-r border-stone-gray/10">
                        <span className="font-bold text-deep-teak">{activity.start_time?.slice(0, 5) || "--:--"}</span>
                        <div className="text-[10px] text-stone-gray uppercase tracking-wider">{activity.category || "General"}</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-deep-teak">{activity.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-stone-gray">
                            <MapPin className="w-3.5 h-3.5 text-terracotta" />
                            {activity.location || "No location specified"}
                        </div>
                    </div>
                </div>
                <button className={`p-2 rounded-full transition-transform duration-200 ${isOpen ? "rotate-180 bg-stone-100" : ""}`}>
                    <ChevronDown className="w-5 h-5 text-stone-gray" />
                </button>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="px-4 pb-6 pt-2 border-t border-stone-gray/5 bg-stone-50/30">
                    <div className="ml-[70px] space-y-6">
                        {/* User Notes */}
                        {activity.notes && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-stone-600">
                                <span className="font-bold text-yellow-700 block mb-1 text-xs uppercase">Your Notes</span>
                                {activity.notes}
                            </div>
                        )}

                        {/* Place Details Inline */}
                        {place ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Description & Info */}
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-stone-gray/10 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xs text-stone-gray font-bold uppercase">About</div>
                                            {place.price_level && (
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{place.price_level}</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-stone-600 leading-relaxed">
                                            {place.description || "No description available."}
                                        </div>
                                    </div>

                                    {place.what_to_expect && (
                                        <div className="bg-white p-4 rounded-xl border border-stone-gray/10 shadow-sm">
                                            <div className="text-xs text-stone-gray font-bold uppercase mb-2">What to Expect</div>
                                            <p className="text-sm text-stone-600">{place.what_to_expect}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Contact, Social, Amenities */}
                                <div className="space-y-4">
                                    {/* Contact Info */}
                                    <div className="bg-white rounded-xl border border-stone-gray/10 overflow-hidden shadow-sm">
                                        {place.phone && (
                                            <div className="flex items-center gap-3 p-3 border-b border-stone-gray/5">
                                                <div className="p-1.5 bg-terracotta/10 rounded-md">
                                                    <Phone className="w-4 h-4 text-terracotta" />
                                                </div>
                                                <span className="text-sm text-deep-teak font-medium">{place.phone}</span>
                                            </div>
                                        )}
                                        {place.website && (
                                            <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border-b border-stone-gray/5 hover:bg-stone-50 transition-colors group">
                                                <div className="p-1.5 bg-blue-50 rounded-md group-hover:bg-blue-100 transition-colors">
                                                    <Globe className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-sm text-blue-600 hover:underline truncate">{place.website.replace(/^https?:\/\//, '')}</span>
                                            </a>
                                        )}
                                        <div className="flex items-center gap-3 p-3">
                                            <div className="p-1.5 bg-orange-50 rounded-md">
                                                <Clock className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <span className="text-sm text-deep-teak">~1.5 Hours</span>
                                        </div>
                                    </div>

                                    {/* Amenities Tags */}
                                    {place.amenities && place.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {place.amenities.map((amenity, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-gray/10 rounded-full text-xs font-medium text-stone-600 shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Social Media */}
                                    {place.social_media && Object.keys(place.social_media).length > 0 && (
                                        <div>
                                            <div className="text-[10px] text-stone-400 font-bold uppercase mb-2 tracking-wider">Social Media</div>
                                            <div className="flex gap-2">
                                                {Object.entries(place.social_media).map(([platform, url]) => (
                                                    <a
                                                        key={platform}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 bg-white border border-stone-gray/10 rounded-xl text-stone-gray hover:text-terracotta hover:border-terracotta/50 hover:shadow-md transition-all active:scale-95"
                                                        title={platform}
                                                    >
                                                        {getSocialIcon(platform)}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-stone-100 rounded-lg border border-stone-gray/10 opacity-70">
                                <Info className="w-5 h-5 text-stone-400" />
                                <div className="text-sm font-medium text-stone-500">No extended details available for this location.</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
