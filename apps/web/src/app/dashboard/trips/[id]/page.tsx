import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Share2, Map as MapIcon, List as ListIcon, Sparkles } from "lucide-react"; // Added Icons
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TripVisibilityToggle } from "@/components/dashboard/TripVisibilityToggle";
import { CalendarExportButton } from "@/components/dashboard/CalendarExportButton";
import { LikeButton } from "@/components/dashboard/LikeButton";
import { CommentPopover } from "@/components/dashboard/CommentPopover";
import { ShareButton } from "@/components/dashboard/ShareButton"; // Add import
import { TripViewToggle } from "@/components/dashboard/TripViewToggle"; // New Component for client-side toggle

export default async function TripDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // Fetch User
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch trip details
    const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", params.id)
        .single();

    if (tripError || !trip) {
        return notFound();
    }

    // Fetch activities
    const { data: activities } = await supabase
        .from("activities")
        .select("*, place:places(*)") // Join for extended details
        .eq("trip_id", params.id)
        .order("day_number", { ascending: true })
        .order("start_time", { ascending: true });

    // Fetch Likes
    const { count: likeCount } = await supabase
        .from('trip_likes')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', params.id);

    const { data: isLikedData } = user ? await supabase
        .from('trip_likes')
        .select('*')
        .eq('trip_id', params.id)
        .eq('user_id', user.id)
        .single() : { data: null };

    const isOwner = user?.id === trip.user_id;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-white/50">
            <div className="mb-0 px-6 pt-6 bg-white border-b border-stone-gray/10 pb-4 shadow-sm z-10">
                <div className="max-w-7xl mx-auto w-full">
                    <Link href={isOwner ? "/dashboard" : "/dashboard/community"} className="inline-flex items-center text-sm font-medium text-stone-gray hover:text-deep-teak mb-4 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to {isOwner ? 'Dashboard' : 'Community'}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">{trip.title}</h1>
                            <div className="flex items-center gap-4 text-stone-gray text-sm">
                                <div className="flex items-center gap-1.5 bg-stone-gray/5 px-2.5 py-1 rounded-md">
                                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                                    <span className="font-medium">{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-stone-gray/5 px-2.5 py-1 rounded-md">
                                    <Calendar className="w-3.5 h-3.5 text-terracotta" />
                                    <span className="font-medium">
                                        {/* Privacy for visitors: Show only days count or general start date? 
                                            User asked for privacy. Let's just show year or generic duration?
                                            But 'TimelineView' needs dates. 
                                            Let's keep dates for now as standard travel sites do, but remove editing.
                                        */}
                                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-stone-gray/20 mx-1 hidden md:block"></div>

                                {isOwner && (
                                    <TripVisibilityToggle tripId={trip.id} initialIsPublic={trip.is_public || false} />
                                )}

                                {/* Trip Type Label */}
                                {trip.trip_type === 'vip' ? (
                                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                        <span>👑</span> VIP
                                    </div>
                                ) : (
                                    <div className="bg-white border border-stone-gray/20 text-stone-gray px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3 text-terracotta" /> Premium
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 items-center relative self-end md:self-auto">
                            <LikeButton
                                tripId={trip.id}
                                initialLikeCount={likeCount || 0}
                                initialIsLiked={!!isLikedData}
                            />
                            <CommentPopover tripId={trip.id} currentUserId={user?.id || ""} />
                            <div className="w-px h-6 bg-stone-gray/20 mx-2"></div>
                            <Link
                                href={`/dashboard/trips/${trip.id}/print`}
                                className="flex items-center gap-2 px-4 py-2 border border-stone-gray/20 rounded-xl text-stone-gray hover:text-deep-teak hover:border-stone-gray/40 hover:bg-stone-50 transition-all font-medium text-sm"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Print</span>
                            </Link>

                            {/* Actions only for owner or specific allowed actions for visitors */}
                            {isOwner && (
                                <>
                                    <CalendarExportButton
                                        tripTitle={trip.title}
                                        tripStartDate={trip.start_date}
                                        activities={activities || []}
                                    />
                                    <ShareButton tripId={trip.id} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Client-side Toggle Wrapper */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
                <TripViewToggle
                    trip={trip}
                    activities={activities || []}
                    readOnly={!isOwner}
                />
            </div>
        </div>
    );
}

