"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Menu, X, Home, Map, Users, DollarSign, ShieldAlert, FileText, Layout, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
// Custom mobile nav implementation that doesn't depend on Sheet component

export function MobileNav({ user, role }: { user: User; role: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const isAdmin = role === 'admin';
    const isGuide = role === 'local_guide';

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Itinara" className="w-8 h-8" />
                    <span className="font-bold text-gray-800">CRM</span>
                </Link>
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-[65px] bg-white z-20 overflow-y-auto pb-20 animate-in slide-in-from-top-2 duration-200">
                    <nav className="p-4 space-y-1">
                        <MobileLink href="/dashboard" icon={<Home />} onClick={toggleMenu}>Overview</MobileLink>

                        {isAdmin && (
                            <>
                                <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin</div>
                                <MobileLink href="/dashboard/destinations" icon={<Map />} onClick={toggleMenu}>Destinations</MobileLink>
                                <MobileLink href="/dashboard/users" icon={<Users />} onClick={toggleMenu}>User Management</MobileLink>
                                <MobileLink href="/dashboard/customers" icon={<Users />} onClick={toggleMenu}>Customers</MobileLink>
                                <MobileLink href="/dashboard/transactions" icon={<DollarSign />} onClick={toggleMenu}>Transactions</MobileLink>
                                <MobileLink href="/dashboard/moderation" icon={<ShieldAlert />} onClick={toggleMenu}>Moderation</MobileLink>
                                <MobileLink href="/dashboard/blog" icon={<FileText />} onClick={toggleMenu}>Blog</MobileLink>
                                <MobileLink href="/dashboard/pages" icon={<FileText />} onClick={toggleMenu}>Pages</MobileLink>
                                <MobileLink href="/dashboard/landing-pages" icon={<Layout />} onClick={toggleMenu}>Landing Pages</MobileLink>
                            </>
                        )}

                        {(isGuide || isAdmin) && (
                            <>
                                <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Local Guide</div>
                                <MobileLink href="/dashboard/templates" icon={<FileText />} onClick={toggleMenu}>My Templates</MobileLink>
                                <MobileLink href="/dashboard/places" icon={<Map />} onClick={toggleMenu}>My Activities</MobileLink>
                                <MobileLink href="/dashboard/profile" icon={<Settings />} onClick={toggleMenu}>My Profile</MobileLink>
                            </>
                        )}

                        <div className="border-t mt-6 pt-4 px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}

function MobileLink({ href, icon, children, onClick }: { href: string; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
            <span className="text-gray-400">{icon}</span>
            {children}
        </Link>
    );
}
