import { createClient } from "@/lib/supabase/server";

import { Globe, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default async function CommunityPage() {
    const supabase = await createClient();

    // Fetch User for likes
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch public trips with profiles and like count
    // specific count syntax might vary, usually logic is needed or verify if Supabase supports foreign count in select like this
    // Simple approach: Fetch raw then client side or use RPC. 
    // Standard Supabase JS: .select('*, trip_likes(count)') returns an array of objects if not careful, or count. 
    // Let's stick to simple linking first to solve the user's immediate confusion, and add LikeButton if possible.

    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*, profiles!trips_user_id_fkey(full_name, avatar_url)')
        .eq('is_public', true)
        .eq('status', 'upcoming') // Or any status
        .order('created_at', { ascending: false });

    if (tripsError) {
        console.error("Community Fetch Error:", tripsError);
    }

    // Fetch user likes to show "red heart" state
    let likedTripIds = new Set<string>();
    if (user) {
        const { data: userLikes } = await supabase
            .from('trip_likes')
            .select('trip_id')
            .eq('user_id', user.id);
        userLikes?.forEach(l => likedTripIds.add(l.trip_id));
    }

    // Fetch like counts (separate query to avoid complex joins if count not easy)
    // Actually, let's just let the Detail page handle the heavy lifting for now to be safe, 
    // BUT user wants to know where to like. 
    // I will wrap the card in a Link so they can GET to the detail page.
    // I will adds a visual "Like" icon with count if I can, or just the Link first.

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-10 text-center">
                <span className="inline-block p-3 rounded-full bg-rice-paddy-green/10 mb-4">
                    <Globe className="w-8 h-8 text-rice-paddy-green" />
                </span>
                <h1 className="text-4xl font-heading font-bold text-deep-teak mb-4">Discover Community Trips</h1>
                <p className="text-stone-gray text-lg max-w-2xl mx-auto">
                    Explore itineraries crafted by fellow travelers. Click on a card to view details, like, and comment.
                </p>

                {/* Search Bar (Visual Only for now) */}
                <div className="mt-8 max-w-md mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                    <input
                        type="text"
                        placeholder="Search destinations..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-stone-gray/20 focus:border-deep-teak focus:ring-1 focus:ring-deep-teak outline-none shadow-sm text-black placeholder:text-stone-gray/50"
                    />
                </div>
            </header>

            {trips && trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip) => (
                        <Link
                            key={trip.id}
                            href={`/dashboard/trips/${trip.id}`}
                            className="block bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-md transition-all hover:-translate-y-1 group"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={trip.image_url || "/images/hero-bg.png"}
                                    alt={trip.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                                    <span className="px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {trip.destination}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-deep-teak mb-2 line-clamp-1 group-hover:text-terracotta transition-colors">{trip.title}</h3>

                                <div className="flex items-center text-sm text-stone-gray mb-4">
                                    <Calendar className="w-4 h-4 mr-2 text-terracotta" />
                                    {trip.start_date ? format(new Date(trip.start_date), "MMM d") : "TBD"}
                                    {trip.end_date && ` - ${format(new Date(trip.end_date), "MMM d")}`}
                                </div>

                                {/* Author Info */}
                                <div className="flex items-center justify-between pt-4 border-t border-stone-gray/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-stone-gray/10 overflow-hidden">
                                            {trip.profiles?.avatar_url ? (
                                                <Image src={trip.profiles.avatar_url} alt="Avatar" width={32} height={32} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stone-gray">
                                                    {trip.profiles?.full_name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-deep-teak">
                                            {trip.profiles?.full_name || "Unknown Traveler"}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-1 rounded-full">
                                        View Trip
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-gray/20">
                    <p className="text-stone-gray">No public trips found yet. Be the first to publish one!</p>
                </div>
            )}
        </div>
    );
}
