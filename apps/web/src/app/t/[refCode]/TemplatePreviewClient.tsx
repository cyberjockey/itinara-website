"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { trackReferralEvent, getSessionId } from "./tracking";

interface Day {
    day_number: number;
    activities: Activity[];
}

interface Activity {
    id: string;
    title: string;
    start_time: string | null;
    location: string | null;
    category: string | null;
    notes: string | null;
}

import { FileText, Lock, CheckCircle } from "lucide-react";

export function TemplatePreviewClient({
    templateId,
    refCode,
    itinerary,
    guideMaterials,
    tripType
}: {
    templateId: string;
    refCode: string;
    itinerary: any;
    guideMaterials?: any[];
    tripType?: string;
}) {
    const router = useRouter();
    const [days, setDays] = useState<Day[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);

    useEffect(() => {
        // Track view event on page load (once)
        if (!hasTrackedView) {
            trackReferralEvent(refCode, 'view');
            setHasTrackedView(true);
        }

        if (itinerary && itinerary.days) {
            // Map itinerary JSON to Day structure
            const mappedDays = itinerary.days.map((d: any) => ({
                day_number: d.day,
                title: d.title || `Day ${d.day}`,
                activities: d.activities || []
            }));
            setDays(mappedDays);
        }

        setLoading(false);
    }, [templateId, refCode, hasTrackedView, itinerary]);

    const handleUseTemplate = async () => {
        // Track click event
        await trackReferralEvent(refCode, 'click');

        // Store ref_code in localStorage for attribution
        localStorage.setItem('template_ref_code', refCode);

        // Check if user is logged in
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Redirect to signup with return URL
            router.push(`/signup?redirect=/dashboard/explore/trips/${templateId}`);
        } else {
            // Redirect to create trip from template
            router.push(`/dashboard/explore/trips/${templateId}`);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Why Itinara? Value Proposition Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2">
                        <img
                            src="/images/promo-features.png"
                            alt="Itinara Features: GeoMap, Emergency Support, Chat"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                            Why Choose Itinara?
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl">🗺️</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Interactive GeoMap</h3>
                                    <p className="text-sm text-gray-600">Navigate your trip easily with our integrated map system.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl">🆘</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Emergency Support</h3>
                                    <p className="text-sm text-gray-600">Emergency mapping & localized support for your safety.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl">💬</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Direct Guide Chat</h3>
                                    <p className="text-sm text-gray-600">Communicate directly with your local expert guide.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2">
                    {/* Itinerary Preview */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary Overview</h2>

                        <div className="space-y-6">
                            {days.map((day) => (
                                <div key={day.day_number} className={`border-l-4 ${day.day_number === 1 ? 'border-blue-500' : 'border-gray-200'} pl-6 relative`}>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Day {day.day_number}
                                    </h3>

                                    {day.day_number === 1 ? (
                                        <div className="space-y-3">
                                            {day.activities.map((activity) => (
                                                <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        {activity.start_time && (
                                                            <div className="text-sm font-medium text-blue-600 min-w-[60px]">
                                                                {activity.start_time.slice(0, 5)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                                            {activity.location && (
                                                                <p className="text-sm text-gray-600 mt-1">{activity.location}</p>
                                                            )}
                                                            {activity.category && (
                                                                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                                    {activity.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative overflow-hidden rounded-lg bg-gray-50 p-4 border border-gray-100">
                                            <div className="filter blur-sm select-none opacity-50">
                                                <div className="space-y-3">
                                                    <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
                                                    <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/30">
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
                                                    <Lock className="w-4 h-4" />
                                                    Unlock to view details
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-8 space-y-6">

                        {/* Includes Section */}
                        <div className="bg-green-50 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Includes Local Expert Guides:</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Local Culture Guide
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Heritage or Historical Guide
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Legendary Cuisine Guide
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Hidden Gem Guide
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Emergency Contact Service
                                </li>
                                {tripType === 'vip' && (
                                    <li className="flex items-center gap-2 font-semibold text-yellow-700 mt-2 pt-2 border-t border-green-100">
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                        Uses 1 VIP Trip Credit per booking
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* PDF Download (Locked) */}
                        <div className="border-2 border-dashed border-red-200 rounded-lg p-4 mb-6 text-center bg-red-50 relative group">
                            <div className="flex flex-col items-center gap-2 text-red-400">
                                <FileText className="w-8 h-8" />
                                <div className="font-semibold">Download Guide's PDF</div>
                                <div className="text-xs text-red-400/80">Available after purchase</div>
                            </div>

                            {/* Lock Overlay */}
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Lock className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleUseTemplate}
                            className="w-full py-4 bg-[#D9534F] hover:bg-[#c9302c] text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 text-lg mb-2"
                        >
                            Buy with VIP Trip Quota
                        </button>

                        <p className="text-center text-xs text-gray-500">
                            Secure your dates with a local expert.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
