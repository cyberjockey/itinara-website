"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromotionalBanner() {
    return (
        <div className="bg-deep-teak overflow-hidden relative">
            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full border-2 border-sunrise-gold" />
                <div className="absolute top-12 right-12 w-32 h-32 rounded-full border-2 border-sunrise-gold" />
                <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 rounded-full border border-sunrise-gold/30" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunrise-gold/20 border border-sunrise-gold/30 text-sunrise-gold text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Limited Time Offer
                        </div>

                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                            Celebrate Chinese New Year with <span className="text-sunrise-gold">Exclusive Deals</span>
                        </h2>

                        <p className="text-white/80 text-lg mb-8 max-w-xl">
                            Unlock special discounts on premium trips and discover hidden gems across the archipelago.
                            Join us in welcoming the Year of the Fire Horse!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <Link
                                href="/cny"
                                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-600/20 transition-all flex items-center gap-2 group"
                            >
                                View Offers
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/guides/apply"
                                className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                Become a Guide
                            </Link>
                        </div>
                    </div>

                    {/* Visual Element (can be an image or graphic) */}
                    <div className="relative w-full max-w-md aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm flex items-center justify-center group">
                        {/* Placeholder for a festive image, or we can use a CSS art / simpler graphic if no image is ready */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-deep-teak/40 z-10" />

                        <div className="relative z-20 text-center p-8">
                            <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-sunrise-gold to-yellow-600 mb-2 drop-shadow-sm">
                                2026
                            </div>
                            <div className="text-xl md:text-2xl font-heading text-white tracking-[0.2em] uppercase">
                                Year of the Fire Horse
                            </div>
                            <div className="mt-6 inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg rotate-[-2deg] group-hover:rotate-0 transition-transform">
                                UP TO 50% OFF
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
