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
        .select("*")
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

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
            <div className="mb-0 px-6 pt-6">
                <Link href="/dashboard" className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-2 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-deep-teak">{trip.title}</h1>
                        <div className="flex items-center gap-4 text-stone-gray mt-2 text-sm">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                {trip.destination}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-terracotta" />
                                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </div>
                            <TripVisibilityToggle tripId={trip.id} initialIsPublic={trip.is_public || false} />

                            {/* Trip Type Label */}
                            {trip.trip_type === 'vip' ? (
                                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                    <span>👑</span> VIP
                                </div>
                            ) : (
                                <div className="bg-stone-gray/10 text-stone-gray px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Premium
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 items-center relative">
                        <LikeButton
                            tripId={trip.id}
                            initialLikeCount={likeCount || 0}
                            initialIsLiked={!!isLikedData}
                        />
                        <CommentPopover tripId={trip.id} currentUserId={user?.id || ""} />
                        <div className="w-px h-6 bg-stone-gray/20 mx-2"></div>
                        <Link
                            href={`/dashboard/trips/${trip.id}/print`}
                            className="flex items-center gap-2 px-4 py-2 border border-stone-gray/20 rounded-full text-stone-gray hover:bg-stone-gray/5 transition-colors font-medium text-sm"
                        >
                            <Share2 className="w-4 h-4" />
                            Print
                        </Link>
                        <CalendarExportButton
                            tripTitle={trip.title}
                            tripStartDate={trip.start_date}
                            activities={activities || []}
                        />
                        <ShareButton tripId={trip.id} />
                    </div>
                </div>
            </div>



            {/* Client-side Toggle Wrapper */}
            <TripViewToggle trip={trip} activities={activities || []} />
        </div>
    );
}

