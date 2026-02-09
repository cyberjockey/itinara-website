"use client";

import { motion } from "framer-motion";
import { TreePalm, Mountain, Waves } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-turquoise/10 text-ocean-turquoise text-sm font-medium mb-6"
                    >
                        <TreePalm className="w-4 h-4" />
                        <span>Our Mission</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-8"
                    >
                        Bridging Dreams & Reality
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg prose-stone mx-auto text-stone-gray/90"
                    >
                        <p>
                            At ITINARA, we believe travel is transformative. But planning a trip to a country as vast and diverse as <strong>Indonesia</strong>—with its 17,000 islands, hundreds of ethnic groups, and countless hidden wonders—can be daunting. That's why we built the ultimate <strong>Indonesia itinerary planner</strong>.
                        </p>
                        <p>
                            Our mission is to bridge the gap between dream and reliable reality. We don't just aggregate data; we curate experiences. By partnering with top-tier local guides and verifying every recommendation, we ensure that whether you're chasing waterfalls in Lombok, exploring ancient temples in Central Java, or diving in Raja Ampat, your journey is seamless and authentic.
                        </p>
                        <p>
                            Stop scrolling through endless forums and outdated blogs. Start building your dream <strong>Indonesia vacation</strong> today with a platform designed by travelers, for travelers. We handle the logistics so you can focus on the memories.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 flex justify-center gap-8 text-stone-gray/60"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Mountain className="w-8 h-8" strokeWidth={1.5} />
                            <span className="text-sm font-medium">17,000+ Islands</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Waves className="w-8 h-8" strokeWidth={1.5} />
                            <span className="text-sm font-medium">Endless Coastlines</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
