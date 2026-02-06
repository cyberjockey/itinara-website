"use client";

import { useState } from "react";
import { ItineraryBuilder } from "./ItineraryBuilder";
import { TemplateDetailsForm } from "./TemplateDetailsForm";
import { Layout, Settings } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure to have a utils file or use clsx directly

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TemplateEditor({ template }: { template: any }) {
    const [activeTab, setActiveTab] = useState<'itinerary' | 'details' | 'settings'>('itinerary');

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('itinerary')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'itinerary'
                            ? "border-blue-600 text-blue-600 bg-blue-50/50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                >
                    <Layout className="w-4 h-4" />
                    Itinerary Builder
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                        activeTab === 'details'
                            ? "border-blue-600 text-blue-600 bg-blue-50/50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                >
                    <Settings className="w-4 h-4" />
                    Trip Details
                </button>
                {/* Placeholder for Map View later */}
                {/* <button className="px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 border-transparent text-gray-400 cursor-not-allowed">
                    <Map className="w-4 h-4" />
                    Map View (Coming Soon)
                </button> */}
            </div>

            {/* Content Area */}
            <div className={cn(
                "flex-1 relative",
                activeTab === 'itinerary' ? "overflow-hidden" : "overflow-y-auto"
            )}>
                {activeTab === 'itinerary' && (
                    <ItineraryBuilder template={template} />
                )}

                {activeTab === 'details' && (
                    <div className="h-full overflow-y-auto">
                        <TemplateDetailsForm template={template} />
                    </div>
                )}
            </div>
        </div>
    );
}
