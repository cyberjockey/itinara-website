import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link';

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
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';
    const isGuide = profile?.role === 'local_guide';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r fixed h-full overflow-y-auto">
                <div className="p-6 border-b">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Itinara Logo" className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">ITINARA <span className="text-batik-indigo">CRM</span></h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{profile?.role || 'Guest'}</p>
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
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
                            <Link href="/dashboard/moderation" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                Moderation Queue
                            </Link>
                        </>
                    )}
                    {(isGuide || isAdmin) && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Local Guide</div>
                            <Link href="/dashboard/templates" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Templates
                            </Link>
                            <Link href="/dashboard/places" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Places
                            </Link>
                            <Link href="/dashboard/profile" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                                My Profile
                            </Link>
                        </>
                    )}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
