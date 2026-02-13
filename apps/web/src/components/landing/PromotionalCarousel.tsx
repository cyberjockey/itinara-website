"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getActivePromotions } from "@/app/actions/promotion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Promotion {
    id: string;
    html_content: string;
    css_content: string | null;
    cta_link: string | null;
}

export function PromotionalCarousel() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        getActivePromotions()
            .then(data => {
                if (data && data.length > 0) {
                    setPromotions(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return null; // Or a skeleton
    if (promotions.length === 0) return null;

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="flex-[0_0_100%] min-w-0 relative">
                            {/* Inject CSS specific to this slide */}
                            {promo.css_content && (
                                <style dangerouslySetInnerHTML={{ __html: promo.css_content }} />
                            )}

                            {/* Render HTML content */}
                            <div dangerouslySetInnerHTML={{ __html: promo.html_content }} />

                            {/* Optional formatting wrapper if CTA is just a link overlay */}
                            {promo.cta_link && (
                                <Link href={promo.cta_link} className="absolute inset-0 z-10">
                                    <span className="sr-only">View Promotion</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons (Only show if multiple slides) */}
            {promotions.length > 1 && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100 z-20"
                        onClick={scrollPrev}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100 z-20"
                        onClick={scrollNext}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}
        </div>
    );
}
