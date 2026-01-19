"use client";

import { useState, useEffect } from "react";
import { X, Send, Loader2, Filter, MapPin, Calendar, Heart, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { fetchComments, addComment } from "@/app/dashboard/trips/actions";
import { CommentItem } from "@/components/dashboard/CommentItem";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TripThreadSheetProps {
    trip: any;
    currentUserId?: string;
    isOpen: boolean;
    onClose: () => void;
    initialIsLiked?: boolean;
}

export function TripThreadSheet({ trip, currentUserId, isOpen, onClose, initialIsLiked = false }: TripThreadSheetProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
    const [hasMore, setHasMore] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when trip changes or sheet opens
    useEffect(() => {
        if (isOpen && trip) {
            setComments([]);
            setOffset(0);
            setHasMore(true);
            loadComments(true, trip.id);
        }
    }, [isOpen, trip?.id]);

    const LIMIT = 10;

    const loadComments = async (reset = false, tripId: string) => {
        if (loading && !reset) return; // Allow reset even if loading (race condition handling simplistic here)
        setLoading(true);
        try {
            const currentOffset = reset ? 0 : offset;
            const { comments: newComments } = await fetchComments(tripId, currentOffset, LIMIT, sortBy);

            if (newComments.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (reset) {
                setComments(newComments);
                setOffset(LIMIT);
            } else {
                setComments(prev => [...prev, ...newComments]);
                setOffset(prev => prev + LIMIT);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !trip) return;

        setIsSubmitting(true);
        try {
            await addComment(trip.id, newComment);
            setNewComment("");
            loadComments(true, trip.id); // Refresh
        } catch (e) {
            alert("Failed to post");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !trip) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Side Panel */}
            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-gray/10 bg-white z-10">
                    <h2 className="font-heading font-bold text-lg text-deep-teak truncate pr-4">{trip.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-gray/10 rounded-full text-stone-gray transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-warm-white">
                    {/* Trip Summary Card */}
                    <div className="bg-white p-0 pb-6 border-b border-stone-gray/10 mb-2">
                        <div className="relative h-56 w-full">
                            <Image
                                src={trip.image_url || "/images/hero-bg.png"}
                                alt={trip.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2 border border-white/20">
                                    <MapPin className="w-3 h-3" /> {trip.destination}
                                </span>
                                <div className="flex items-center gap-2 text-sm opacity-90">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{trip.start_date ? format(new Date(trip.start_date), "MMM d") : "TBD"} - {trip.end_date ? format(new Date(trip.end_date), "MMM d") : "TBD"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-gray/10 overflow-hidden relative">
                                        {trip.profiles?.avatar_url ? (
                                            <Image src={trip.profiles.avatar_url} alt="Ava" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-stone-gray">?</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-deep-teak text-sm">{trip.profiles?.full_name || "Traveler"}</p>
                                        <p className="text-xs text-stone-gray">Author</p>
                                    </div>
                                </div>
                                <button className="text-stone-gray hover:text-deep-teak">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-stone-gray text-sm leading-relaxed mb-6">
                                {trip.description || "No description provided for this trip. Check out the full itinerary for details on activities and places."}
                            </p>

                            <div className="flex items-center gap-4">
                                <Link
                                    href={`/dashboard/trips/${trip.id}`}
                                    className="flex-1 py-2.5 bg-terracotta text-white font-bold rounded-xl text-center text-sm hover:bg-deep-teak transition-colors shadow-md"
                                >
                                    View Full Itinerary
                                </Link>
                                <button className="p-2.5 border border-stone-gray/20 rounded-xl hover:bg-stone-gray/5 text-stone-gray transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-deep-teak">Comments</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortBy(sortBy === 'recent' ? 'popular' : 'recent')}
                                    className="text-xs font-medium text-stone-gray hover:text-deep-teak flex items-center gap-1"
                                >
                                    <Filter className="w-3 h-3" />
                                    {sortBy === 'recent' ? 'Latest' : 'Popular'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {comments.length === 0 && !loading ? (
                                <div className="text-center py-10 text-stone-gray/50 italic text-sm bg-stone-gray/5 rounded-xl border border-dashed border-stone-gray/10">
                                    No comments yet. Start the conversation!
                                </div>
                            ) : (
                                comments.map((c) => (
                                    <CommentItem
                                        key={c.id}
                                        comment={c}
                                        currentUserId={currentUserId || ""}
                                        tripId={trip.id}
                                        likedByCurrentUser={c.likedByCurrentUser}
                                        likeCount={c.likeCount}
                                    />
                                ))
                            )}

                            {loading && (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                                </div>
                            )}

                            {!loading && hasMore && comments.length > 0 && (
                                <button
                                    onClick={() => loadComments(false, trip.id)}
                                    className="w-full py-3 text-sm font-bold text-deep-teak border border-stone-gray/20 rounded-xl hover:bg-stone-gray/5 transition-colors"
                                >
                                    Load more comments
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Input */}
                <div className="p-4 border-t border-stone-gray/10 bg-white z-10">
                    <form onSubmit={handleSubmit} className="relative flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0 mt-1">
                            {/* Placeholder for current user avatar if available, else user icon */}
                            <div className="w-4 h-4 bg-terracotta rounded-full" />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-gray/20 text-sm focus:border-deep-teak outline-none bg-stone-gray/5 text-black placeholder:text-stone-gray/50 transition-all focus:bg-white"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-deep-teak text-white rounded-lg hover:bg-terracotta disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
