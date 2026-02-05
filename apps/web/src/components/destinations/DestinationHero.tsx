"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

interface DestinationHeroProps {
    name: string;
    description: string;
    imageUrl: string;
}

export function DestinationHero({ name, description, imageUrl }: DestinationHeroProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 250]); // Parallax effect

    return (
        <header className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden bg-deep-teak">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%] w-full"
            >
                <Image
                    src={getImageUrl(imageUrl)}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            <div className="relative z-20 max-w-4xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold mb-6"
                >
                    <MapPin className="w-4 h-4" /> Indonesia
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-xl"
                >
                    {name} <br /> Travel Itinerary
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
                >
                    Curated routes to explore {name} independently, with intention and ease.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/dashboard" className="px-8 py-4 bg-[#E35435] text-white rounded-full font-bold text-lg hover:bg-[#C13F23] transition-colors shadow-xl">
                        Download Itinerary
                    </Link>
                    <Link href="#pricing" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                        View Pricing
                    </Link>
                </motion.div>
            </div>
        </header>
    );
}
