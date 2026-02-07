import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Share2, Map as MapIcon, List as ListIcon, Sparkles } from "lucide-react"; // Added Icons
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TripVisibilityToggle } from "@/components/dashboard/TripVisibilityToggle";
import { LikeButton } from "@/components/dashboard/LikeButton";
import { CommentPopover } from "@/components/dashboard/CommentPopover";
import { TripViewToggle } from "@/components/dashboard/TripViewToggle";
import { TripActionsMenu } from "@/components/dashboard/TripActionsMenu";

export const dynamic = "force-dynamic";

export default async function TripDetailPage(props: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const supabase = await createClient();

    // Map query param to view
    const tab = typeof searchParams.tab === 'string' ? searchParams.tab : undefined;
    let initialView: "timeline" | "map" | "details" | "emergency" | "guide" = "timeline";

    if (tab === 'chat') initialView = 'guide';
    else if (tab === 'map') initialView = 'map';
    else if (tab === 'details') initialView = 'details';

    // Fetch User
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch trip details (include source_template_id for Ask Guide tab)
    const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select("*, source_template_id")
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
            <div className="mb-0 px-4 md:px-6 pt-6 bg-white border-b border-stone-gray/10 pb-4 shadow-sm z-10 w-full">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Top Row: Back Button & Visibility Badge (Desktop) */}
                    <div className="flex items-center justify-between mb-2">
                        <Link href={isOwner ? "/dashboard" : "/dashboard/community"} className="inline-flex items-center text-sm font-medium text-stone-gray hover:text-deep-teak transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to {isOwner ? 'Dashboard' : 'Community'}
                        </Link>

                        {/* Visibility on Desktop only, otherwise in menu */}
                        {isOwner && (
                            <div className="hidden md:block">
                                <TripVisibilityToggle tripId={trip.id} initialIsPublic={trip.is_public || false} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-deep-teak mb-3 leading-tight break-words">
                                {trip.title}
                            </h1>

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-stone-gray text-xs md:text-sm">
                                <div className="flex items-center gap-1.5 bg-stone-gray/5 px-2.5 py-1 rounded-md">
                                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                                    <span className="font-medium truncate max-w-[150px]">{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-stone-gray/5 px-2.5 py-1 rounded-md">
                                    <Calendar className="w-3.5 h-3.5 text-terracotta" />
                                    <span className="font-medium">
                                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Trip Type Label */}
                                {trip.trip_type === 'vip' ? (
                                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-1 rounded-md font-bold shadow-sm flex items-center gap-1">
                                        <span>👑</span> VIP
                                    </div>
                                ) : trip.source_template_id ? (
                                    <div className="bg-white border border-stone-gray/20 text-stone-gray px-2.5 py-1 rounded-md font-bold flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3 text-terracotta" /> Curated
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-0">
                            <LikeButton
                                tripId={trip.id}
                                initialLikeCount={likeCount || 0}
                                initialIsLiked={!!isLikedData}
                            />
                            <CommentPopover tripId={trip.id} currentUserId={user?.id || ""} />

                            <div className="w-px h-6 bg-stone-gray/20 mx-1 md:mx-2"></div>

                            <TripActionsMenu
                                tripId={trip.id}
                                tripTitle={trip.title}
                                tripStartDate={trip.start_date}
                                activities={activities || []}
                                isCommitted={trip.status === 'active' || trip.status === 'completed'}
                                isOwner={isOwner}
                                isPublic={trip.is_public}
                            />
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
                    isCommitted={trip.status === 'active' || trip.status === 'completed'}
                    initialView={initialView}
                />
            </div>
        </div>
    );
}
