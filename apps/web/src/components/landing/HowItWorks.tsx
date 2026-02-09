"use client";

import { motion } from "framer-motion";
import { Compass, Wand2, Map } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Choose Your Vibe",
        description: "Tell us what you love—whether it's surfing in Uluwatu, hiking Mount Bromo, or culinary tours in Jakarta.",
        icon: Compass,
        color: "bg-ocean-turquoise",
    },
    {
        id: 2,
        title: "We Curate",
        description: "Our Top Local Guides & Google Local Guides build a personalized itinerary that balances major sights with hidden gems.",
        icon: Wand2,
        color: "bg-terracotta",
    },
    {
        id: 3,
        title: "Explore Freely",
        description: "Get a day-by-day plan with maps, smart routes, and tips. Change anything, anytime. It's your trip, your rules.",
        icon: Map,
        color: "bg-sunrise-gold",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-warm-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-terracotta rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-ocean-turquoise rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-terracotta font-bold tracking-widest uppercase text-sm"
                    >
                        Simple Process
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mt-3 mb-6"
                    >
                        How ITINARA Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-gray/80 text-lg"
                    >
                        Planning a multi-island **Indonesia itinerary** doesn't have to be overwhelming. At ITINARA, we simplify the chaos of travel planning. Whether you're seeking the spiritual calm of Bali's rice terraces or the raw adventure of Java's volcanoes, our platform streamlines every step of your journey.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[2px] bg-stone-gray/10 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className={`w-24 h-24 rounded-2xl ${step.color} bg-opacity-10 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <div className={`absolute inset-0 ${step.color} opacity-10 rounded-2xl`} />
                                <step.icon className={`w-10 h-10 text-stone-gray`} strokeWidth={1.5} />

                                {/* Step Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-deep-teak border border-stone-gray/10">
                                    {step.id}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-deep-teak mb-3 group-hover:text-terracotta transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-stone-gray leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
