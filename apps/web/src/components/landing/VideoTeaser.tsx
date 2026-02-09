"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export function VideoTeaser() {
    const [isOpen, setIsOpen] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

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
                                This is more than just a trip. It's a journey into the soul of the archipelago.
                                Watch our latest teaser to feel the pulse of Indonesia.
                            </p>
                            <Link href="/dashboard" className="hidden md:inline-flex px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-200 transition-colors">
                                Start Your Journey
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: The Video Thumbnail Trigger */}
                    <div className="flex-1 w-full max-w-md md:max-w-xl">
                        <div
                            onClick={() => setIsOpen(true)}
                            className="relative aspect-video bg-stone-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer"
                        >
                            {/* Cover Image */}
                            <Image
                                src="/images/promo_borobudur_sunrise.png"
                                alt="Watch Trailer"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                                    <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center shadow-lg group-hover:bg-deep-teak transition-colors">
                                        <Play className="w-8 h-8 fill-white text-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 text-center">
                                <span className="text-sm font-bold tracking-widest uppercase text-white/90 drop-shadow-md">Watch Full Teaser</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Fullscreen Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 group"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="sr-only">Close</span>
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl relative bg-black border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/LyJ_10nwI34?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
                                title="Unlock Real Indonesia - Official Teaser"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
