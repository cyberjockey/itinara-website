"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Compass, Minus, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

// Lower resolution for lightweight performance but sufficient detail
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Updated with real coordinates [longitude, latitude]
// Updated with real coordinates [longitude, latitude]
const regions = [
    {
        id: "west-java",
        name: "West Java",
        coordinates: [107.6191, -6.9175] as [number, number], // Bandung
        description: " Highlands, tea plantations, and cool mountain air.",
    },
    {
        id: "jakarta",
        name: "Jakarta",
        coordinates: [106.8456, -6.2088] as [number, number],
        description: "The bustling capital where tradition meets modernity.",
    },
    {
        id: "central-java",
        name: "Central Java",
        coordinates: [110.419, -7.150] as [number, number], // Approx Semarang/Magelang
        description: "The spiritual heart, home to majestic Borobudur.",
    },
    {
        id: "yogyakarta",
        name: "Yogyakarta",
        coordinates: [110.3695, -7.7956] as [number, number],
        description: "The cultural soul, hub of arts and royal heritage.",
    },
    {
        id: "bali",
        name: "Bali",
        coordinates: [115.1889, -8.4095] as [number, number],
        description: "Island of the Gods. Beaches, temples, and culture.",
    },
    {
        id: "lombok",
        name: "Lombok",
        coordinates: [116.3288, -8.6500] as [number, number],
        description: "Unspoiled beauty, pristine beaches and Rinjani.",
    },
];

export function DestinationsMap() {
    const [activeRegion, setActiveRegion] = useState<typeof regions[0] | null>(null);
    const [position, setPosition] = useState({ coordinates: [118, -2] as [number, number], zoom: 1 });

    const handleZoomIn = () => {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
    };

    const handleZoomOut = () => {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
    };

    const handleReset = () => {
        setPosition({ coordinates: [118, -2], zoom: 1 });
        setActiveRegion(null);
    };

    const handleRegionClick = (region: typeof regions[0]) => {
        setActiveRegion(region);
        setPosition({ coordinates: region.coordinates, zoom: 2.5 });
    };

    return (
        <section className="py-24 bg-light-sand relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-turquoise/10 text-ocean-turquoise text-sm font-bold mb-4"
                    >
                        <Compass className="w-4 h-4" />
                        <span>Discover Destinations</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4"
                    >
                        Explore the Archipelago
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-gray/80 text-lg max-w-2xl mx-auto"
                    >
                        From the cultural heart of Java to the pristine beaches of Bali and Lombok, discover curated routes for the independent traveler.
                    </motion.p>
                </div>

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full aspect-[16/9] md:aspect-[2.2/1] bg-gradient-to-b from-ocean-turquoise/5 to-white/50 rounded-3xl overflow-hidden border border-ocean-turquoise/20 flex items-center justify-center shadow-inner group"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-ocean-turquoise/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-terracotta/5 rounded-full blur-3xl" />

                    {/* Map Controls */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleReset}
                            className="p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors"
                            title="Reset View"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>

                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 2000,
                        }}
                        className="w-full h-full z-10 transition-transform duration-700 ease-in-out" // Added smooth transition class
                    >
                        <ZoomableGroup
                            zoom={position.zoom}
                            center={position.coordinates}
                            onMoveEnd={(position) => setPosition(position)}
                            maxZoom={5}
                        // Adding simple motion damping if possible via wrapper, but for now relying on standard behavior
                        // react-simple-maps doesn't animate zoom natively, but we can make the path transitions smooth
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies
                                        .filter((geo) => geo.properties.name === "Indonesia" || geo.id === "360")
                                        .map((geo) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="#C7B299" // Light earthy tone
                                                stroke="#FFF"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: { fill: "#D4654F", outline: "none", transition: "all 0.5s ease" }, // Smoother hover transition
                                                    hover: { fill: "#8B4513", outline: "none", cursor: "pointer" },
                                                    pressed: { fill: "#8B4513", outline: "none" },
                                                }}
                                            />
                                        ))
                                }
                            </Geographies>

                            {regions.map((region) => (
                                <Marker key={region.id} coordinates={region.coordinates}>
                                    <g
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRegionClick(region);
                                        }}
                                        onMouseEnter={() => setActiveRegion(region)}
                                        className="cursor-pointer group"
                                        data-tooltip-id="region-tooltip"
                                        data-tooltip-content={region.name}
                                    >
                                        {/* Static Ring instead of Ping */}
                                        <circle r={8 / position.zoom} fill="#F4A460" opacity={0.4} className="group-hover:opacity-80 transition-opacity duration-300" />
                                        {/* Outer Ring */}
                                        <circle r={6 / position.zoom} fill="rgba(244, 164, 96, 0.8)" stroke="#FFF" strokeWidth={1} className="group-hover:scale-110 transition-transform duration-300 ease-out" />
                                        {/* Inner Dot */}
                                        <circle r={3 / position.zoom} fill="#8B4513" />
                                    </g>
                                </Marker>
                            ))}
                        </ZoomableGroup>
                    </ComposableMap>
                    <Tooltip
                        id="region-tooltip"
                        style={{ backgroundColor: "#8B4513", color: "#FFF", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}
                        border="1px solid rgba(255,255,255,0.2)"
                    />

                    {/* Info Card Overlay */}
                    <AnimatePresence mode="wait">
                        {activeRegion && (
                            <motion.div
                                key={activeRegion.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6 border border-stone-gray/10"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-2xl font-bold font-heading text-deep-teak">{activeRegion.name}</h3>
                                    <div className="p-2 bg-terracotta/10 rounded-full">
                                        <MapPin className="w-5 h-5 text-terracotta" />
                                    </div>
                                </div>

                                <p className="text-stone-gray leading-relaxed mb-6">
                                    {activeRegion.description}
                                </p>
                                <div className="flex gap-3">
                                    <Link href={`/destinations/${activeRegion.id}`} className="flex-1 py-3 bg-deep-teak text-white rounded-xl font-bold text-sm tracking-wide hover:bg-terracotta transition-colors flex items-center justify-center gap-2 group">
                                        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-3 bg-stone-gray/10 text-stone-gray rounded-xl font-bold text-sm hover:bg-stone-gray/20 transition-colors"
                                        title="Close & Reset Map"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section >
    );
}
