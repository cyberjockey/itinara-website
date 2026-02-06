"use client";

import { X, Map, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TripTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TripTypeModal({ isOpen, onClose }: TripTypeModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleSelect = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-deep-teak">Plan a New Adventure</h2>
                            <p className="text-stone-gray/80">How would you like to start your journey?</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-stone-gray/5 rounded-full text-stone-gray transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Self Setup Option */}
                        <button
                            onClick={() => handleSelect('/dashboard/trips/new')}
                            className="group relative p-6 rounded-2xl border-2 border-stone-gray/10 hover:border-terracotta/50 bg-stone-gray/5 hover:bg-terracotta/5 text-left transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Map className="w-6 h-6 text-terracotta" />
                            </div>
                            <h3 className="text-lg font-bold text-deep-teak mb-2 group-hover:text-terracotta transition-colors">Self-Setup Itinerary</h3>
                            <p className="text-sm text-stone-gray/80 mb-6 leading-relaxed">
                                Build your own custom itinerary from scratch. Choose your dates, destination, and activities freely.
                            </p>
                            <div className="flex items-center text-sm font-bold text-deep-teak group-hover:text-terracotta transition-colors">
                                Start Custom Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        {/* Local Guide Option */}
                        <button
                            onClick={() => handleSelect('/dashboard/explore')}
                            className="group relative p-6 rounded-2xl border-2 border-stone-gray/10 hover:border-blue-500/50 bg-stone-gray/5 hover:bg-blue-500/5 text-left transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UserCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-deep-teak mb-2 group-hover:text-blue-600 transition-colors">Curated by Local Guide</h3>
                            <p className="text-sm text-stone-gray/80 mb-6 leading-relaxed">
                                Browse expert-crafted itineraries. Save time with pre-planned routes and local hidden gems.
                            </p>
                            <div className="flex items-center text-sm font-bold text-deep-teak group-hover:text-blue-600 transition-colors">
                                Browse Templates <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
