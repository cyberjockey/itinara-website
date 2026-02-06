"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface SocialPostCardProps {
    trip: any;
    currentUserId?: string;
    isLiked?: boolean;
    onCommentClick?: () => void;
}

export function SocialPostCard({ trip, currentUserId, isLiked = false, onCommentClick }: SocialPostCardProps) {
    // Safe fallbacks
    const authorName = trip.profiles?.full_name || "Traveler";
    const authorInitials = authorName[0]?.toUpperCase() || "?";
    const avatarUrl = trip.profiles?.avatar_url;
    const timeAgo = trip.created_at ? formatDistanceToNow(parseISO(trip.created_at), { addSuffix: true }) : "recently";

    // Privacy: Only show destination name, no dates or duration
    const destination = trip.destination || null;

    return (
        <article className="bg-white border-b border-stone-gray/10 hover:bg-warm-white/50 transition-colors">
            <div className="px-4 py-4">
                {/* Header: Author */}
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Link href={`/profile/${trip.user_id}`} className="flex-shrink-0">
                        <div className="relative w-10 h-10 rounded-full bg-stone-gray/10 overflow-hidden ring-2 ring-white shadow-sm hover:ring-terracotta/30 transition-all">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={authorName} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-stone-gray text-sm bg-gradient-to-br from-rice-paddy-green/20 to-ocean-turquoise/20">
                                    {authorInitials}
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Author line */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-deep-teak text-sm hover:underline cursor-pointer">
                                {authorName}
                            </span>
                            <span className="text-stone-gray/60 text-sm">·</span>
                            <span className="text-stone-gray/60 text-sm">{timeAgo}</span>
                            <button className="ml-auto text-stone-gray/50 hover:text-deep-teak p-1 rounded-full hover:bg-stone-gray/10 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Post text (trip title as the "post") */}
                        <Link href={`/dashboard/trips/${trip.id}`} className="block group">
                            <p className="text-[15px] text-deep-teak leading-relaxed mb-2 group-hover:text-terracotta transition-colors">
                                {trip.title}
                            </p>

                            {/* Optional destination tag */}
                            {destination && (
                                <span className="inline-flex items-center gap-1 text-xs text-ocean-turquoise bg-ocean-turquoise/10 px-2 py-1 rounded-full font-medium mb-3">
                                    📍 {destination}
                                </span>
                            )}

                            {/* Image (optional) */}
                            {trip.image_url && (
                                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-2 border border-stone-gray/10">
                                    <Image
                                        src={trip.image_url}
                                        alt={trip.title}
                                        fill
                                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                    />
                                </div>
                            )}
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 -ml-2">
                            <div className="flex items-center gap-1">
                                {/* Like */}
                                <button className={`flex items-center gap-1.5 p-2 rounded-full transition-colors ${isLiked ? "text-red-500" : "text-stone-gray/60 hover:text-red-500 hover:bg-red-50"}`}>
                                    <Heart className={`w-[18px] h-[18px] ${isLiked ? "fill-current" : ""}`} />
                                </button>

                                {/* Comment */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onCommentClick?.();
                                    }}
                                    className="flex items-center gap-1.5 p-2 rounded-full text-stone-gray/60 hover:text-ocean-turquoise hover:bg-ocean-turquoise/10 transition-colors"
                                >
                                    <MessageCircle className="w-[18px] h-[18px]" />
                                </button>

                                {/* Share */}
                                <button className="flex items-center gap-1.5 p-2 rounded-full text-stone-gray/60 hover:text-rice-paddy-green hover:bg-rice-paddy-green/10 transition-colors">
                                    <Share2 className="w-[18px] h-[18px]" />
                                </button>
                            </div>

                            {/* Bookmark */}
                            <button className="p-2 rounded-full text-stone-gray/60 hover:text-terracotta hover:bg-terracotta/10 transition-colors">
                                <Bookmark className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
