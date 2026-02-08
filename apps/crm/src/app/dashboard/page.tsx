import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    // const supabase = await createClient();

    // We can fetch stats here later

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">Welcome back to your workspace.</p>
                </div>
                {/* Action buttons could go here */}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total Templates</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Places Managed</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                    No recent activity to show.
                </div>
            </div>
        </>
    );
}
