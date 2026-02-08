import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from "@/app/auth/actions";
import { LogOut } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";

import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check auth and fetch profile one time for the layout
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, avatar_url')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';
    const isGuide = profile?.role === 'local_guide';

    // Fetch stats for leveling

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Navigation */}
            <MobileNav user={user} role={profile?.role || 'Guest'} avatarUrl={profile?.avatar_url} />

            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-white border-r fixed h-full hidden md:flex md:flex-col z-20 overflow-y-auto">
                <div className="p-6 border-b flex-shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <Image src="/logo.svg" alt="Itinara Logo" width={32} height={32} className="w-8 h-8" />

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">ITINARA <span className="text-batik-indigo">CRM</span></h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{profile?.role || 'Guest'}</p>
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Overview
                    </Link>
                    {isAdmin && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin</div>
                            <Link href="/dashboard/destinations" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Destinations
                            </Link>
                            <Link href="/dashboard/users" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                User Management
                            </Link>
                            <Link href="/dashboard/customers" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Customers
                            </Link>
                            <Link href="/dashboard/transactions" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Transactions
                            </Link>
                            <Link href="/dashboard/moderation" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Moderation Queue
                            </Link>
                            <Link href="/dashboard/blog" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Blog Management
                            </Link>
                            <Link href="/dashboard/pages" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Static Pages
                            </Link>
                            <Link href="/dashboard/landing-pages" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Landing Pages
                            </Link>
                        </>
                    )}
                    {(isGuide || isAdmin) && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Local Guide</div>
                            <Link href="/dashboard/guide-inbox" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                💬 Guide Inbox
                            </Link>
                            <Link href="/dashboard/templates" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Templates
                            </Link>
                            <Link href="/dashboard/places" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Activities
                            </Link>
                            <Link href="/dashboard/profile" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Profile
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t bg-white flex-shrink-0">
                    <div className="flex items-center gap-3 px-2">
                        <div className="shrink-0">
                            <UserAvatar
                                avatarUrl={profile?.avatar_url}
                                size="sm"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
