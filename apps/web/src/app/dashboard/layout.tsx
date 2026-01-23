"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, Users, Settings, LogOut, Plus, Menu, X, Compass } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { TripTypeModal } from "@/components/dashboard/TripTypeModal";
import { SidebarQuota } from "@/components/dashboard/SidebarQuota";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Client-side redirect after sign out
        router.refresh(); // Refresh to clear any cached data
    };

    const navItems = [
        { name: "My Trips", href: "/dashboard", icon: Home },
        { name: "Curated Trips", href: "/dashboard/curated-trips", icon: Compass },
        { name: "Explore", href: "/dashboard/explore", icon: Map },
        { name: "Saved", href: "/dashboard/saved", icon: Heart },
        { name: "Community", href: "/dashboard/community", icon: Users },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-warm-white flex">
            <TripTypeModal isOpen={isTripModalOpen} onClose={() => setIsTripModalOpen(false)} />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-gray/10 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-deep-teak hover:bg-stone-gray/5 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-lg text-deep-teak">ITINARA</span>
                </div>
                <button onClick={() => setIsTripModalOpen(true)} className="p-2 bg-terracotta text-white rounded-full shadow-sm">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[85vw] md:w-64 bg-white border-r border-stone-gray/10 flex flex-col transition-transform duration-300 ease-out shadow-2xl md:shadow-none will-change-transform transform-gpu
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 flex justify-between items-center bg-white z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 overflow-hidden rounded-full border border-stone-gray/20">
                            <Image
                                src="/logo.png"
                                alt="ITINARA"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-heading font-bold text-xl text-deep-teak">ITINARA</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-1 text-stone-gray hover:text-deep-teak"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-4 py-2 bg-white z-10">
                    <button
                        onClick={() => {
                            setIsTripModalOpen(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-3 rounded-xl bg-terracotta text-white font-bold flex items-center justify-center gap-2 hover:bg-deep-teak transition-colors shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Trip</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-rice-paddy-green/20 text-deep-teak font-semibold"
                                    : "text-stone-gray hover:bg-stone-gray/5"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-deep-teak" : "text-stone-gray/70"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <SidebarQuota />

                <div className="p-4 border-t border-stone-gray/10 bg-white z-10 mt-auto">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-stone-gray hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen bg-warm-white relative w-full">
                {children}
            </main>
        </div>
    );
}
