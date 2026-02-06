import { createClient } from "@/lib/supabase/server";

import { Users, Search } from "lucide-react";
import { CommunityFeed } from "@/components/dashboard/CommunityFeed";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
    const supabase = await createClient();

    // Fetch User for likes
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch public trips with profiles
    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*, profiles!trips_user_id_fkey(full_name, avatar_url)')
        .eq('is_public', true)
        .eq('status', 'upcoming')
        .order('created_at', { ascending: false });

    if (tripsError) {
        console.error("Community Fetch Error:", tripsError);
    }

    // Fetch user likes to show "red heart" state
    const likedTripIds = new Set<string>();
    if (user) {
        const { data: userLikes } = await supabase
            .from('trip_likes')
            .select('trip_id')
            .eq('user_id', user.id);
        userLikes?.forEach(l => likedTripIds.add(l.trip_id));
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8 text-center">
                <span className="inline-block p-3 rounded-full bg-ocean-turquoise/10 mb-4">
                    <Users className="w-8 h-8 text-ocean-turquoise" />
                </span>
                <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Community</h1>
                <p className="text-stone-gray text-base max-w-md mx-auto">
                    See what fellow travelers are planning. Like, comment, and get inspired.
                </p>

                {/* Search Bar */}
                <div className="mt-6 max-w-md mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-stone-gray/20 focus:border-ocean-turquoise focus:ring-1 focus:ring-ocean-turquoise outline-none shadow-sm text-black placeholder:text-stone-gray/50 bg-white"
                    />
                </div>
            </header>

            {trips && trips.length > 0 ? (
                <CommunityFeed
                    trips={trips}
                    currentUserId={user?.id}
                    likedTripIds={likedTripIds}
                />
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-gray/20">
                    <p className="text-stone-gray">No public trips found yet. Be the first to publish one!</p>
                </div>
            )}
        </div>
    );
}
