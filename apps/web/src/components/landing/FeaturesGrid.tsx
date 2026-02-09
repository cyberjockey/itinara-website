"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-warm-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4 tracking-tight"
                    >
                        Why Choose ITINARA?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-stone-gray/80 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience travel with peace of mind and deeper connections. From <strong>Emergency SOS</strong> and detailed <strong>Map Views</strong> to <strong>Auto-Routing</strong>, direct <strong>Chat with Guides</strong>, and a vibrant community—Itinara puts everything you need in one place.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full max-w-5xl mx-auto"
                >
                    <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl">
                        <NextImage
                            src="/images/features-collage.png"
                            alt="Itinara Key Features: Emergency, Map, Routing, Chat, Community"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto hover:scale-105 transition-transform duration-700"
                            quality={100}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
