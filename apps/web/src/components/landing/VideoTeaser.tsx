"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function VideoTeaser() {
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

                    {/* Right: The Video Player (Real YouTube Embed) */}
                    <div className="flex-1 w-full max-w-md md:max-w-xl">
                        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/LyJ_10nwI34?si=NFqWITsA-rpowCUP"
                                title="Unlock Real Indonesia - Official Teaser"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
