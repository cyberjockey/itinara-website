"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Heart, X, Send, Loader2, Filter } from "lucide-react";
import { fetchComments, addComment } from "@/app/dashboard/trips/actions";
import { CommentItem } from "@/components/dashboard/CommentItem";
import { cn } from "@/lib/utils";

interface CommentPopoverProps {
    tripId: string;
    currentUserId: string;
}

export function CommentPopover({ tripId, currentUserId }: CommentPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
    const [hasMore, setHasMore] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const LIMIT = 3;

    const loadComments = async (reset = false) => {
        if (loading) return;
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

    useEffect(() => {
        if (isOpen && comments.length === 0) {
            loadComments(true);
        }
    }, [isOpen]); // Only load when opened first time

    // Reload when sort changes
    useEffect(() => {
        if (isOpen) {
            loadComments(true);
        }
    }, [sortBy]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(tripId, newComment);
            setNewComment("");
            // Refresh comments to show new one (ideally optimism, but this is safer)
            loadComments(true);
        } catch (e) {
            alert("Failed to post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 border rounded-full transition-colors font-medium text-sm",
                    isOpen ? "bg-deep-teak text-white border-deep-teak" : "border-stone-gray/20 text-stone-gray hover:bg-stone-gray/5"
                )}
            >
                <MessageCircle className="w-4 h-4" />
                Comments
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-[400px] bg-white rounded-2xl shadow-xl border border-stone-gray/10 z-50 flex flex-col max-h-[600px] animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-stone-gray/10 flex justify-between items-center bg-warm-white rounded-t-2xl">
                        <h3 className="font-bold text-deep-teak">Comments</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy(sortBy === 'recent' ? 'popular' : 'recent')}
                                className="p-2 hover:bg-stone-gray/10 rounded-full text-stone-gray/60"
                                title="Sort"
                            >
                                <Filter className={cn("w-4 h-4", sortBy === 'popular' && "text-deep-teak")} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-gray/10 rounded-full text-stone-gray/60">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
                        {comments.length === 0 && !loading ? (
                            <div className="text-center py-10 text-stone-gray/50 italic text-sm">
                                Be the first to start the conversation!
                            </div>
                        ) : (
                            comments.map((c) => (
                                <CommentItem
                                    key={c.id}
                                    comment={c}
                                    currentUserId={currentUserId}
                                    tripId={tripId}
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
                                onClick={() => loadComments(false)}
                                className="w-full py-2 text-xs font-bold text-deep-teak hover:bg-stone-gray/5 rounded-lg transition-colors"
                            >
                                Load more comments
                            </button>
                        )}
                    </div>

                    {/* Footer Input */}
                    <div className="p-4 border-t border-stone-gray/10 bg-white rounded-b-2xl">
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-gray/20 text-sm focus:border-deep-teak outline-none bg-stone-gray/5 text-black"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-deep-teak text-white rounded-lg hover:bg-terracotta disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
