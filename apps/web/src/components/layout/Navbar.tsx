"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Only pages with full-screen hero headers should have transparent nav initially
    const hasHeroHeader = pathname === "/" || pathname.startsWith("/destinations/");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        // Force check on mount for direct link access
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active state: Scrolled OR not on a hero page
    const isSolid = isScrolled || !hasHeroHeader;

    const navItems = [
        { label: "Destinations", href: "/#destinations" },
        { label: "About", href: "/#about" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
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
                        <span className={`font-heading font-bold text-2xl tracking-tight ${isSolid ? "text-deep-teak" : "text-white"}`}>
                            ITINARA
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-terracotta ${isSolid ? "text-stone-gray" : "text-white/90"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className={`text-sm font-medium transition-colors hover:text-terracotta mr-2 ${isSolid ? "text-stone-gray" : "text-white/90"}`}
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 ${isSolid
                                ? "bg-terracotta text-white hover:bg-deep-teak"
                                : "bg-white text-deep-teak hover:bg-white/90"
                                }`}
                        >
                            Register Now
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className={`w-6 h-6 ${isSolid ? "text-deep-teak" : "text-white"}`} />
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

                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors"
                            >
                                {item.label}
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
                            Register Now
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
