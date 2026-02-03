"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Destination {
    name: string;
    slug: string;
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const pathname = usePathname();

    // Only pages with full-screen hero headers should have transparent nav initially
    const hasHeroHeader = pathname === "/" || pathname.startsWith("/destinations/");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch destinations
        const fetchDestinations = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('destinations')
                .select('name, slug')
                .order('name');
            if (data) setDestinations(data);
        };

        fetchDestinations();
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active state: Scrolled OR not on a hero page
    const isSolid = isScrolled || !hasHeroHeader;

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
                        {/* Destinations Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button
                                className={`text-sm font-medium transition-colors hover:text-terracotta flex items-center gap-1 ${isSolid ? "text-stone-gray" : "text-white/90"}`}
                            >
                                Destinations
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, rotateX: -15 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        exit={{ opacity: 0, y: 10, rotateX: -15 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-0 mt-4 w-48 bg-white rounded-xl shadow-xl overflow-hidden origin-top z-50 border border-stone-100"
                                    >
                                        <div className="p-2 flex flex-col gap-1">
                                            <Link
                                                href="/destinations"
                                                className="px-4 py-2 text-sm font-bold text-deep-teak hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                All Destinations
                                            </Link>
                                            <div className="h-px bg-stone-100 my-1" />
                                            {destinations.map((dest) => (
                                                <Link
                                                    key={dest.slug}
                                                    href={`/destinations/${dest.slug}`}
                                                    className="px-4 py-2 text-sm text-stone-gray hover:text-terracotta hover:bg-orange-50 rounded-lg transition-colors"
                                                >
                                                    {dest.name}
                                                </Link>
                                            ))}
                                            {destinations.length === 0 && (
                                                <span className="px-4 py-2 text-xs text-stone-300">Loading cities...</span>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="/#about"
                            className={`text-sm font-medium transition-colors hover:text-terracotta ${isSolid ? "text-stone-gray" : "text-white/90"}`}
                        >
                            About
                        </Link>
                        <Link
                            href="/blog"
                            className={`text-sm font-medium transition-colors hover:text-terracotta ${isSolid ? "text-stone-gray" : "text-white/90"}`}
                        >
                            Blog
                        </Link>

                        <div className="w-px h-6 bg-current opacity-20 mx-2" />

                        <Link
                            href="/login"
                            className={`text-sm font-medium transition-colors hover:text-terracotta ${isSolid ? "text-stone-gray" : "text-white/90"}`}
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
                        className="fixed inset-0 z-[60] bg-warm-white flex flex-col items-center pt-24 gap-6 px-4 overflow-y-auto"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-deep-teak"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-16 h-16 mb-2 rounded-full overflow-hidden border-4 border-terracotta/20 shrink-0">
                            <Image src="/logo.png" alt="ITINARA" fill className="object-cover" />
                        </div>

                        {/* Mobile Destinations */}
                        <div className="w-full max-w-sm">
                            <div className="text-center mb-4">
                                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Destinations</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/destinations"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="col-span-2 py-3 px-4 bg-white rounded-xl shadow-sm border border-stone-100 font-bold text-deep-teak hover:bg-orange-50 transition-colors"
                                    >
                                        Explore All
                                    </Link>
                                    {destinations.map((dest) => (
                                        <Link
                                            key={dest.slug}
                                            href={`/destinations/${dest.slug}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="py-3 px-4 bg-white rounded-xl shadow-sm border border-stone-100 text-stone-600 font-medium hover:text-terracotta hover:bg-orange-50 transition-colors text-center"
                                        >
                                            {dest.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-stone-200 w-full my-6" />

                            <div className="flex flex-col items-center gap-6">
                                <Link
                                    href="/#about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/blog"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors"
                                >
                                    Blog
                                </Link>
                            </div>

                            <div className="h-px bg-stone-200 w-full my-6" />

                            <div className="flex flex-col items-center gap-4 w-full">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-stone-500 hover:text-deep-teak transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center py-4 rounded-full bg-terracotta text-white font-bold text-lg hover:bg-deep-teak transition-transform active:scale-95"
                                >
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
