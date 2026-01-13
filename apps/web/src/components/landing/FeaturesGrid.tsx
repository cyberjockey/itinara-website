"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, WifiOff, BookOpen, Move, Star } from "lucide-react";

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-warm-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4">
                        Why Choose ITINARA?
                    </h2>
                    <p className="text-stone-gray/80 text-lg max-w-2xl mx-auto">
                        We fuse insights from Top Local Guides & Google Local Guides to give you a travel experience like no other.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[600px]">

                    {/* Card 1: AI Curation (Large) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-terracotta to-deep-teak rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 font-heading">Curated by Local Guides</h3>
                                <p className="text-white/80 text-lg leading-relaxed">
                                    Input your travel style, budget, and interests. Our Top Local Guides & Google Local Guides help build a tailor-made itinerary that feels handcrafted.
                                </p>
                            </div>
                            {/* Mock UI Element */}
                            <div className="w-full bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm mt-8 translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                                <div className="h-2 w-1/3 bg-white/40 rounded-full mb-3" />
                                <div className="space-y-2">
                                    <div className="h-10 w-full bg-white/20 rounded-lg" />
                                    <div className="h-10 w-full bg-white/20 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Local Guides (Medium Horizontal) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-stone-gray/10 relative overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-12 h-12 bg-ocean-turquoise/10 rounded-xl flex items-center justify-center text-ocean-turquoise shrink-0">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-deep-teak mb-2">Expert Local Insights</h3>
                                <p className="text-stone-gray text-sm">
                                    Access hidden gems and authentic experiences recommended by our network of local experts.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Offline Access (Small) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-rice-paddy-green/20 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-rice-paddy-green/30 transition-colors cursor-default"
                    >
                        <WifiOff className="w-8 h-8 text-deep-teak mb-4" />
                        <h3 className="font-bold text-deep-teak mb-1">100% Offline</h3>
                        <p className="text-xs text-stone-gray">Access maps & tickets anywhere.</p>
                    </motion.div>

                    {/* Card 4: Real-Time Updates (Medium Vertical) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:row-span-1 bg-white rounded-3xl p-6 shadow-sm border border-stone-gray/10 flex flex-col justify-center group hover:border-terracotta/30 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-sunrise-gold/20 flex items-center justify-center text-deep-teak">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-deep-teak">Cultural Wisdom</h3>
                        </div>
                        <p className="text-sm text-stone-gray">
                            Local etiquette, dress codes, and customs included for every destination.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
