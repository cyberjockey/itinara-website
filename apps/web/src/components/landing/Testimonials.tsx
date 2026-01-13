"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        origin: "United Kingdom",
        text: "I wanted to see the real Bali, not just the tourist traps. ITINARA guided me to a local family for a cooking class I'll never forget.",
        trip: "2-week Bali & Lombok",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
        id: 2,
        name: "Marcus Thorne",
        origin: "Australia",
        text: "The Top Local Guide & Google Local Guide suggestions were spot on. It found surf spots in Sumba that weren't on any blog. The offline maps saved us multiple times!",
        trip: "10-day Sumba Surf Trip",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        origin: "Spain",
        text: "Planning a honeymoon was stressful until we found ITINARA. The romantic dinner recommendations were absolutely perfect.",
        trip: "Luxury Java & Bali",
        rating: 5,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    },
    {
        id: 4,
        name: "James Chen",
        origin: "Singapore",
        text: "Jakarta's hidden coffee scene is incredible. The itinerary took me to places I'd never find on Google Maps.",
        trip: "Jakarta Coffee Culture",
        rating: 5,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    {
        id: 5,
        name: "Sophie & Thomas",
        origin: "Germany",
        text: "We hiked Rinjani with a guide recommended by ITINARA. It was tough but the details on preparation were a lifesaver.",
        trip: "Lombok Adventure",
        rating: 5,
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop",
    },
    {
        id: 6,
        name: "Aiko Tanaka",
        origin: "Japan",
        text: "I loved the focus on art and history in Yogyakarta. It felt very respectful of the local culture.",
        trip: "Yogyakarta Heritage",
        rating: 5,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section className="py-24 bg-light-sand overflow-hidden relative">
            {/* Decorative Quote Mark */}
            <Quote className="absolute top-12 left-8 w-40 h-40 text-terracotta/5 rotate-12 z-0" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-terracotta transform uppercase tracking-widest text-sm font-bold">Community Stories</span>
                    <h2 className="text-4xl font-heading font-bold text-deep-teak mt-2">
                        Loved by Travelers
                    </h2>
                </div>

                <div
                    className="relative min-h-[300px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-gray/5 text-center flex flex-col items-center"
                        >
                            <div className="relative w-20 h-20 mb-6">
                                <Image
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].name}
                                    fill
                                    className="object-cover rounded-full border-4 border-warm-white shadow-md"
                                />
                            </div>

                            <div className="flex gap-1 mb-6 text-sunrise-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>

                            <blockquote className="text-xl md:text-2xl font-accent italic text-stone-gray mb-6 leading-relaxed">
                                "{testimonials[currentIndex].text}"
                            </blockquote>

                            <div className="mt-auto">
                                <h4 className="font-bold text-deep-teak text-lg">{testimonials[currentIndex].name}</h4>
                                <p className="text-stone-gray/60 text-sm mt-1">{testimonials[currentIndex].origin} • {testimonials[currentIndex].trip}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-terracotta" : "w-2 bg-stone-gray/20 hover:bg-terracotta/50"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
