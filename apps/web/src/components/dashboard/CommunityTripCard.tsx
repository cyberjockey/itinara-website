import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import { getImageUrl } from "@/lib/utils";

interface CommunityTripCardProps {
    trip: any;
    currentUserId?: string;
    isLiked?: boolean;
    onCommentClick?: () => void;
}

export function CommunityTripCard({ trip, currentUserId, isLiked = false, onCommentClick }: CommunityTripCardProps) {
    const duration = trip.start_date && trip.end_date
        ? differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1
        : 1;

    // Use safe fallbacks
    const authorName = trip.profiles?.full_name || "Traveler";
    const authorInitials = authorName[0]?.toUpperCase() || "?";
    const avatarUrl = trip.profiles?.avatar_url;
    const timeAgo = trip.created_at ? formatDistanceToNow(parseISO(trip.created_at), { addSuffix: true }) : "recently";

    return (
        <div className="bg-white rounded-3xl border border-stone-gray/10 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
            {/* Header: Author Info (Social Style) */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-stone-gray/10 overflow-hidden ring-2 ring-white shadow-sm">
                        {avatarUrl ? (
                            <Image src={getImageUrl(avatarUrl, "/images/placeholder-avatar.png")} alt={authorName} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-stone-gray text-sm">
                                {authorInitials}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-deep-teak leading-tight">{authorName}</p>
                        <p className="text-xs text-stone-gray">{timeAgo}</p>
                    </div>
                </div>
                <button className="text-stone-gray hover:text-deep-teak">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Main Content: Image & Link */}
            <Link href={`/dashboard/trips/${trip.id}`} className="block relative aspect-[4/3] w-full group-hover:brightness-[0.98] transition-all">
                <Image
                    src={getImageUrl(trip.image_url)}
                    alt={trip.title}
                    fill
                    className="object-cover"
                />

                {/* Privacy-Focused Overlay Tag */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-terracotta" />
                    {trip.destination}
                </div>
            </Link>

            {/* Actions Bar */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-stone-gray/5">
                <div className="flex items-center gap-4">
                    <button className={`flex items-center gap-1.5 group/action ${isLiked ? "text-red-500" : "text-stone-gray hover:text-red-500"}`}>
                        <div className={`p-2 rounded-full group-hover/action:bg-red-50 transition-colors ${isLiked ? "bg-red-50" : ""}`}>
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                        </div>
                        {/* <span className="text-sm font-bold">{trip.likes_count || 0}</span> */}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onCommentClick?.();
                        }}
                        className="flex items-center gap-1.5 group/action text-stone-gray hover:text-blue-500"
                    >
                        <div className="p-2 rounded-full group-hover/action:bg-blue-50 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                    </button>
                    <button className="flex items-center gap-1.5 group/action text-stone-gray hover:text-deep-teak">
                        <div className="p-2 rounded-full group-hover/action:bg-stone-gray/10 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </div>
                    </button>
                </div>
                <button className="text-stone-gray hover:text-terracotta transition-colors">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>

            {/* Footer: Details & Caption */}
            <div className="p-4 pt-3 flex-1 flex flex-col">
                {/* Replace exact dates with Duration for privacy */}
                <div className="mb-2">
                    <span className="inline-block bg-rice-paddy-green/10 text-rice-paddy-green text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                        {duration} Days Trip
                    </span>
                    <h3 className="text-lg font-bold text-deep-teak leading-tight mb-1 hover:text-terracotta transition-colors">
                        <Link href={`/dashboard/trips/${trip.id}`}>
                            {trip.title}
                        </Link>
                    </h3>
                </div>

                {/* Optional: Add a short description or tags here later */}
            </div>
        </div>
    );
}

function MoreHorizontalIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    )
}
