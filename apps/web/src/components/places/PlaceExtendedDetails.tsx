"use client";

import { Lock, Phone, Globe, DollarSign, Facebook, Instagram, MessageCircle, Info } from "lucide-react";
import Link from "next/link";

interface PlaceExtendedDetailsProps {
    place: {
        phone?: string;
        website?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        social_media?: any;
        price_level?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amenities?: any; // Used for Highlights/Tips
        what_to_expect?: string;
        type?: string;
    };
    isUnlocked: boolean;
}

export function PlaceExtendedDetails({ place, isUnlocked }: PlaceExtendedDetailsProps) {
    if (!place) return null;

    const hasExtendedInfo = place.phone || place.website || place.social_media || place.price_level || place.what_to_expect || (place.amenities && place.amenities.length > 0);

    // Accommodation details are free for everyone
    const isVisible = isUnlocked || place.type?.toLowerCase() === 'accommodation';

    if (!hasExtendedInfo) return null;

    return (
        <div className="mt-8 relative">
            <h3 className="font-bold text-lg text-deep-teak mb-4">Activity Details</h3>

            <div className={`space-y-6 transition-all duration-300 ${!isVisible ? "blur-sm select-none opacity-60" : ""}`}>

                {/* Contact & Web */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {place.phone && (
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                            <Phone className="w-5 h-5 text-terracotta" />
                            <div>
                                <div className="text-xs text-stone-gray font-bold uppercase">Phone / Whatsapp</div>
                                <div className="text-sm font-medium text-deep-teak">{isVisible ? place.phone : "+62 812 XXXX XXXX"}</div>
                            </div>
                        </div>
                    )}
                    {place.website && (
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                            <Globe className="w-5 h-5 text-terracotta" />
                            <div>
                                <div className="text-xs text-stone-gray font-bold uppercase">Website</div>
                                <Link
                                    href={isVisible ? place.website : "#"}
                                    target={isVisible ? "_blank" : undefined}
                                    className="text-sm font-medium text-deep-teak hover:underline truncate block max-w-[200px]"
                                >
                                    {isVisible ? place.website : "www.example.com"}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Social Media & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-terracotta" />
                        <div>
                            <div className="text-xs text-stone-gray font-bold uppercase">Price Range</div>
                            <div className="text-sm font-medium text-deep-teak">{place.price_level || "Free"}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                        <div className="flex gap-2">
                            {/* Mock Icons if specific keys exist, mostly generic for now */}
                            <Instagram className="w-5 h-5 text-deep-teak/80" />
                            <Facebook className="w-5 h-5 text-deep-teak/80" />
                            <MessageCircle className="w-5 h-5 text-deep-teak/80" />
                        </div>
                        <div>
                            <div className="text-xs text-stone-gray font-bold uppercase">Social Media</div>
                            <div className="text-sm font-medium text-deep-teak">
                                {isVisible ? "Available" : "Hidden"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* What to Expect */}
                {place.what_to_expect && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-gray/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-terracotta" />
                            <span className="font-bold text-sm text-deep-teak uppercase">What to Expect</span>
                        </div>
                        <p className="text-sm text-stone-gray leading-relaxed">
                            {place.what_to_expect}
                        </p>
                    </div>
                )}

                {/* Highlights / Tips */}
                {place.amenities && Array.isArray(place.amenities) && place.amenities.length > 0 && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-gray/10">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-terracotta" />
                            <span className="font-bold text-sm text-deep-teak uppercase">Highlight & Tips</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {place.amenities.map((tip: string, idx: number) => (
                                <li key={idx} className="text-sm text-stone-gray">{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* Overlay */}
            {!isVisible && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center border border-stone-200 max-w-sm mx-auto">
                        <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6 text-terracotta" />
                        </div>
                        <h4 className="text-lg font-bold text-deep-teak mb-2">Unlock Activity Details</h4>
                        <p className="text-sm text-stone-gray mb-4">
                            To reveal contact info, social media, and insider tips, simply add this activity to your trip.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
