"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDown, MapPin, Calendar, Compass } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);


    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const words = ["Heritage", "Culture", "Culinary", "Indonesia"];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                // Finished typing word, pause before deleting
                // If it's the last word "Indonesia", pause longer or stop? 
                // Let's pause longer then loop for now as it's standard.
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, words]);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-warm-white bg-deep-teak">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%] w-full"
            >
                <Image
                    src="/images/hero-mosaic.jpg"
                    alt="Indonesia Mosaic: Culture, Food, Heritage"
                    fill
                    className="object-cover object-center"
                    quality={80}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                        <Compass className="w-4 h-4 text-sunrise-gold" />
                        <span className="text-sm font-medium tracking-wide uppercase">Every Journey Begins With a Feeling</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight tracking-tight drop-shadow-2xl relative z-10"
                    style={{
                        textShadow: "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)"
                    }}
                >
                    Explore <span className="text-white">{text}</span>
                    <span className="animate-pulse">|</span>
                    <br />
                    <motion.span
                        className="text-sunrise-gold italic font-accent inline-block"
                        animate={{
                            rotateX: [0, 10, 0],
                            y: [0, -5, 0],
                            textShadow: [
                                "0 0px 0px rgba(244, 164, 96, 0)",
                                "0 10px 20px rgba(244, 164, 96, 0.5)",
                                "0 0px 0px rgba(244, 164, 96, 0)"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "mirror"
                        }}
                    >
                        with intention.
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl max-w-3xl font-light text-warm-white/90 drop-shadow-md"
                >
                    ITINARA helps you discover the beauty of Indonesia authentically.
                    Curated itineraries that guide without dictating, for travelers who value freedom and depth.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mt-4"
                >
                    <Link href="/dashboard" className="h-14 px-8 rounded-full bg-terracotta hover:bg-deep-teak text-white font-semibold text-lg transition-all shadow-lg hover:scale-105 flex items-center gap-2 group">
                        <Calendar className="w-5 h-5" />
                        Start Planning
                    </Link>
                    <Link href="/#destinations" className="h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Explore Destinations
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/80"
            >
                <span className="text-sm uppercase tracking-widest font-medium text-[10px]">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </motion.div>
        </section>
    );
}
