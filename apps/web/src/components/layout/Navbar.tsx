"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-white/20 group-hover:border-terracotta/50 transition-colors">
                            <Image
                                src="/logo.png"
                                alt="ITINARA Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className={`font-heading font-bold text-2xl tracking-tight ${isScrolled ? "text-deep-teak" : "text-white"}`}>
                            ITINARA
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {["Destinations", "How it Works", "Community", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className={`text-sm font-medium transition-colors hover:text-terracotta ${isScrolled ? "text-stone-gray" : "text-white/90"
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className={`text-sm font-medium transition-colors hover:text-terracotta mr-2 ${isScrolled ? "text-stone-gray" : "text-white/90"}`}
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 ${isScrolled
                                ? "bg-terracotta text-white hover:bg-deep-teak"
                                : "bg-white text-deep-teak hover:bg-white/90"
                                }`}
                        >
                            Start Planning
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className={`w-6 h-6 ${isScrolled ? "text-deep-teak" : "text-white"}`} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-warm-white flex flex-col justify-center items-center gap-8"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-deep-teak"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden border-4 border-terracotta/20">
                            <Image src="/logo.png" alt="ITINARA" fill className="object-cover" />
                        </div>

                        {["Destinations", "How it Works", "Community", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors"
                            >
                                {item}
                            </Link>
                        ))}

                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors"
                        >
                            Log In
                        </Link>

                        <Link
                            href="/signup"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-4 px-8 py-4 rounded-full bg-terracotta text-white font-bold text-lg hover:bg-deep-teak transition-transform active:scale-95"
                        >
                            Start Planning
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
