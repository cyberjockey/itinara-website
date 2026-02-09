"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

const SCENES = [
    {
        id: "borobudur",
        image: "/images/promo_borobudur_sunrise.png", // We will need to move the artifacts here or just mock for now if not available
        text: "Think you know Indonesia?",
        subtext: "You've seen the photos...",
        duration: 5000
    },
    {
        id: "jakarta",
        image: "/images/promo_jakarta_night_market_v2.png",
        text: "But have you felt the pulse?",
        subtext: "From the city energy...",
        duration: 5000
    },
    {
        id: "raja_ampat",
        image: "/images/promo_raja_ampat_underwater.png",
        text: "From deep oceans to hidden jungles...",
        subtext: "Unlock the real authentic experience.",
        duration: 5000
    },
    {
        id: "final",
        image: "/images/hero-mosaic.jpg", // Fallback to hero image for final CTA
        text: "Stop planning. Start exploring.",
        subtext: "Itinara. Your journey, curated.",
        duration: 5000
    }
];

export function VideoTeaser() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentScene((prev) => (prev + 1) % SCENES.length);
        }, SCENES[currentScene].duration);

        return () => clearInterval(timer);
    }, [isPlaying, currentScene]);

    return (
        <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-20">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* Left: Text Context */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-terracotta/20 text-terracotta text-sm font-bold mb-4">
                                OFFICIAL TEASER
                            </span>
                            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                                Unlock Real <span className="text-terracotta">Indonesia</span>
                            </h2>
                            <p className="text-stone-400 text-lg mb-8 max-w-md mx-auto md:mx-0">
                                Experience the visuals that define the archipelago.
                                From the sunrise at Borobudur to the depths of Raja Ampat.
                            </p>
                            <Link href="/dashboard" className="hidden md:inline-flex px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-200 transition-colors">
                                Start Your Journey
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: The Video Player (Mock) */}
                    <div className="flex-1 w-full max-w-md md:max-w-xl">
                        <div className="relative aspect-[9/16] md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentScene}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0"
                                >
                                    {/* Note: In a real implementation, we would ensure these images exist in public/images.
                                        For this demo, we assume they are placed there or placeholders. 
                                    */}
                                    {/* Using a placeholder for demo if image fails */}
                                    <div className="absolute inset-0 bg-stone-800" />
                                    <Image
                                        src={SCENES[currentScene].image}
                                        alt={SCENES[currentScene].text}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            // Fallback logic could go here, but next/image handles styling
                                            // e.currentTarget.src = "/images/fallback.jpg"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Overlay Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentScene}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-2"
                                    >
                                        <h3 className="text-2xl font-bold font-heading">{SCENES[currentScene].text}</h3>
                                        <p className="text-white/70 text-sm font-mono uppercase tracking-widest">{SCENES[currentScene].subtext}</p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Controls */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors"
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Play/Pause Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {!isPlaying && (
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                                        <Play className="w-8 h-8 fill-white text-white ml-1" />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
