"use client";

import Image from "next/image";
import { ArrowDown, MapPin, Calendar, Compass } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-warm-white bg-deep-teak">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%] w-full" // Increased height to prevent gap at bottom
            >
                <Image
                    src="/images/hero-bg.png"
                    alt="Bali Rice Terraces"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                        <Compass className="w-4 h-4 text-sunrise-gold" />
                        <span className="text-sm font-medium tracking-wide uppercase">Every Journey Begins With a Feeling</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight tracking-tight drop-shadow-lg"
                >
                    Explore Indonesia <br />
                    <span className="text-sunrise-gold italic font-accent">with intention.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl max-w-3xl font-light text-warm-white/90 drop-shadow-md"
                >
                    ITINARA helps you discover the beauty of Indonesia authentically.
                    Curated itineraries that guide without dictating, for travelers who value freedom and depth.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mt-4"
                >
                    <button className="h-14 px-8 rounded-full bg-terracotta hover:bg-deep-teak text-white font-semibold text-lg transition-all shadow-lg hover:scale-105 flex items-center gap-2 group">
                        <Calendar className="w-5 h-5" />
                        Start Planning
                    </button>
                    <button className="h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Explore Destinations
                    </button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/80"
            >
                <span className="text-sm uppercase tracking-widest font-medium text-[10px]">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </motion.div>
        </section>
    );
}
