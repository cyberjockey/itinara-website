"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, WifiOff, BookOpen, MapPin, Download, Smartphone } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6
        }
    }
};

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
                        We fuse insights from Top Local Guides & Google Local Guides to give you a travel experience like no other.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[600px]"
                >

                    {/* Card 1: AI Curation (Large) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#C14E3F] to-[#8B3A2F] rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group shadow-xl transition-shadow duration-300"
                    >
                        {/* Background Effect */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                                    <Sparkles className="w-7 h-7 text-sunrise-gold" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold mb-4 tracking-wide">Curated by Local Guides</h3>
                                <p className="text-white/90 text-lg leading-relaxed font-light">
                                    Input your travel style, budget, and interests. Our Top Local Guides & Google Local Guides help build a tailor-made itinerary that feels handcrafted.
                                </p>
                            </div>

                            {/* Abstract Map UI Element */}
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md mt-8 hover:bg-white/10 transition-colors group/ui">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-sunrise-gold animate-pulse" />
                                    <div className="h-2 w-24 bg-white/40 rounded-full" />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-12 w-full bg-white/10 rounded-xl flex items-center px-4 gap-3">
                                        <MapPin className="w-4 h-4 text-white/60" />
                                        <div className="h-2 w-32 bg-white/30 rounded-full" />
                                    </div>
                                    <div className="h-12 w-full bg-white/10 rounded-xl flex items-center px-4 gap-3 opacity-60">
                                        <MapPin className="w-4 h-4 text-white/60" />
                                        <div className="h-2 w-20 bg-white/30 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Local Guides (Medium Horizontal) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)" }}
                        className="md:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-stone-gray/5 relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center h-full">
                            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold text-deep-teak mb-2">Expert Local Insights</h3>
                                <p className="text-stone-gray/80 leading-relaxed">
                                    Access hidden gems and authentic experiences recommended by our network of local experts.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Itinara App (Small) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)" }}
                        className="bg-[#E8F3E8] rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-[#DCEBDC] transition-colors duration-300"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#4A7C59] shadow-sm mb-4 group-hover:rotate-12 transition-transform duration-300">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-deep-teak text-lg mb-1">Itinara App</h3>
                            <p className="text-sm text-stone-gray/80 font-medium">Offline maps & tickets anywhere.</p>
                        </div>
                    </motion.div>

                    {/* Card 4: Cultural Wisdom (Medium Vertical -> Small in grid) */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)" }}
                        className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-gray/5 flex flex-col justify-between group hover:border-[#C14E3F]/20 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-[#FDF8F5] rounded-xl flex items-center justify-center text-[#C14E3F] group-hover:text-[#8B3A2F] transition-colors">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-heading font-bold text-deep-teak text-lg mb-2">Cultural Wisdom</h3>
                            <p className="text-sm text-stone-gray/80 leading-relaxed">
                                Etiquette, dress codes, & customs.
                            </p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}
