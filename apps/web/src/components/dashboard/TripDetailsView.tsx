"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, FileText, Download, MapPin, Phone, Globe, Clock, Info, Instagram, Facebook, Twitter, Youtube, CheckCircle2, Video, Trash2, AlertCircle, Eye } from "lucide-react";
import Link from 'next/link';
// import { useTrip } from "@/components/dashboard/TripContext";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

import { Activity, Place, Trip } from "@/types/trip";

interface TripDetailsViewProps {
    trip: Trip;
    activities: Activity[];
}

// Helper for parsing simple markdown-like text
function SmartText({ text, className = "" }: { text: string; className?: string }) {
    if (!text) return null;

    // 1. Handle "Visitor Tips" or similar lists embedded with checkmarks
    // If we detect multiple checkmarks, treat it as a list
    if (text.includes("✓") || text.includes("✔")) {
        const segments = text.split(/(?=✓|✔)/).filter(s => s.trim().length > 0);
        if (segments.length > 1) {
            return (
                <div className={`space-y-2 ${className}`}>
                    {segments.map((segment, i) => {
                        const cleanSegment = segment.replace(/^[✓✔]\s*/, "").trim();
                        // Check if this segment is a header (e.g. "Visitor Tips")
                        if (segment.toLowerCase().includes("visitor tips") && !segment.match(/^[✓✔]/)) {
                            const [header, ...rest] = segment.split(/(?=✓|✔)/);
                            return (
                                <div key={i}>
                                    {header && <div className="font-bold text-deep-teak mb-1">{header}</div>}
                                    {rest.map((r, ri) => (
                                        <div key={ri} className="flex gap-2 items-start">
                                            <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                                            <span className="text-stone-600">{r.replace(/^[✓✔]\s*/, "").trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // Standard checkmark item
                        return (
                            <div key={i} className="flex gap-2 items-start">
                                <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                                <span className={segment.match(/^[✓✔]/) ? "text-stone-600" : "font-bold text-deep-teak"}>
                                    {cleanSegment}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    // 2. Standard Text Formatting (Bold, Newlines)
    const lines = text.split('\n');
    return (
        <div className={`space-y-2 ${className}`}>
            {lines.map((line, i) => {
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

export function TripDetailsView({ trip, activities }: TripDetailsViewProps) {
    const [viewingPdf, setViewingPdf] = useState<{ url: string, title: string } | null>(null);

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
                    {(trip.guide_materials && trip.guide_materials.length > 0) ? (
                        trip.guide_materials.map((url: string, index: number) => {
                            const isUrl = url.startsWith('http') || url.startsWith('https');
                            const href = isUrl ? url : `/api/files/download?file_id=${url}`;
                            const fileName = isUrl ? decodeURIComponent(url.split('/').pop()?.split('?')[0] || `Document ${index + 1}`) : `Guide Document ${index + 1}`;

                            return (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-stone-gray/20 hover:border-terracotta/50 hover:bg-stone-50 transition-all group">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs uppercase shrink-0">PDF</div>
                                        <div className="text-left min-w-0 flex-1">
                                            <div className="font-bold text-deep-teak group-hover:text-terracotta transition-colors truncate max-w-[180px] sm:max-w-[250px]" title={fileName}>
                                                {fileName}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <button
                                                    onClick={() => setViewingPdf({ url: href, title: fileName })}
                                                    className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" /> Preview
                                                </button>
                                                <span className="text-xs text-stone-gray/50">•</span>
                                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-gray hover:text-deep-teak transition-colors">
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewingPdf({ url: href, title: fileName })}
                                            className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-gray hover:text-terracotta"
                                            title="Preview PDF"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : trip.guide_material_url ? (
                        <div className="flex items-center justify-between p-4 rounded-xl border border-stone-gray/20 hover:border-terracotta/50 hover:bg-stone-50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs uppercase">PDF</div>
                                <div className="text-left">
                                    <div className="font-bold text-deep-teak group-hover:text-terracotta transition-colors line-clamp-1">
                                        Trip Guide
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <button
                                            onClick={() => trip.guide_material_url && setViewingPdf({ url: trip.guide_material_url, title: 'Trip Guide' })}
                                            className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" /> Preview
                                        </button>
                                        <span className="text-xs text-stone-gray/50">•</span>
                                        <a href={trip.guide_material_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-gray hover:text-deep-teak transition-colors">
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-xl border border-dashed border-stone-gray/20 flex flex-col items-center justify-center text-center col-span-2">
                            <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                                <span className="text-stone-gray/50">📄</span>
                            </div>
                            <p className="text-sm text-stone-gray">No documents available for this trip yet.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-dashed border-stone-gray/20 opacity-50">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-gray/10">
                        <div className="w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center text-stone-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-stone-400">Booking Tickets</div>
                            <div className="text-xs text-stone-400">Coming soon</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Details */}
            <div className="space-y-6">
                <h3 className="font-bold text-xl text-deep-teak">Daily Activity Details</h3>

                {Object.entries(activitiesByDay).map(([dayNum, dayActivities]) => {
                    const date = trip.start_date
                        ? format(new Date(new Date(trip.start_date).setDate(new Date(trip.start_date).getDate() + parseInt(dayNum) - 1)), "EEEE, MMMM d")
                        : `Day ${dayNum}`;

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

            {/* PDF Viewer Modal */}
            <PdfViewerModal
                isOpen={!!viewingPdf}
                onClose={() => setViewingPdf(null)}
                title={viewingPdf?.title || 'Document Preview'}
                pdfUrl={viewingPdf?.url || ''}
            />
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
                                            {place.price_level && place.price_level.length <= 20 && (
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{place.price_level}</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-stone-600 leading-relaxed">
                                            <SmartText text={place.description || "No description available."} />
                                        </div>

                                        {/* Fallback for long price level / pricing info */}
                                        {place.price_level && place.price_level.length > 20 && (
                                            <div className="mt-4 pt-4 border-t border-dashed border-stone-gray/20">
                                                <div className="text-xs text-green-700 font-bold uppercase mb-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    Pricing & Entry
                                                </div>
                                                <div className="text-sm text-stone-600 bg-green-50/50 p-3 rounded-lg border border-green-100 leading-relaxed">
                                                    <SmartText text={place.price_level} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {place.what_to_expect && (
                                        <div className="bg-white p-4 rounded-xl border border-stone-gray/10 shadow-sm">
                                            <div className="text-xs text-stone-gray font-bold uppercase mb-2">What to Expect</div>
                                            <div className="text-sm text-stone-600">
                                                <SmartText text={place.what_to_expect} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Contact, Social, Amenities */}
                                <div className="space-y-4">
                                    {/* Contact Info */}
                                    <div className="bg-white rounded-xl border border-stone-gray/10 overflow-hidden shadow-sm">
                                        {place.phone && place.phone.length > 3 && (
                                            <div className="flex items-center gap-3 p-3 border-b border-stone-gray/5">
                                                <div className="p-1.5 bg-terracotta/10 rounded-md">
                                                    <Phone className="w-4 h-4 text-terracotta" />
                                                </div>
                                                <span className="text-sm text-deep-teak font-medium">{place.phone}</span>
                                            </div>
                                        )}
                                        {place.website && place.website.length > 5 && place.website.toLowerCase() !== "blank" && (
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
