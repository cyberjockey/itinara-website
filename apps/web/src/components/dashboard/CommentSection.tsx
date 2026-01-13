"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { addComment } from "@/app/dashboard/trips/actions";
import { CommentItem } from "@/components/dashboard/CommentItem";

interface CommentSectionProps {
    tripId: string;
    currentUserId: string;
    initialComments: any[]; // Flat list from DB, we will organize it
}

export function CommentSection({ tripId, currentUserId, initialComments }: CommentSectionProps) {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(tripId, commentText);
            setCommentText("");
        } catch (error) {
            console.error("Failed to submit comment", error);
            alert("Failed to submit comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Organize flat comments into trees
    const rootComments = initialComments.filter(c => !c.parent_id);
    const getReplies = (parentId: string) => {
        return initialComments
            .filter(c => c.parent_id === parentId)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Oldest first for replies usually
            .map(c => ({
                ...c,
                replies: getReplies(c.id) // Recursive
            }));
    };

    const commentTree = rootComments.map(c => ({
        ...c,
        replies: getReplies(c.id)
    }));


    return (
        <div className="mt-12 border-t border-stone-gray/10 pt-8">
            <h3 className="text-xl font-heading font-bold text-deep-teak mb-6">
                Comments ({initialComments.length})
            </h3>

            {/* Main Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a new comment..."
                    className="flex-1 px-4 py-3 rounded-full border border-stone-gray/20 focus:border-deep-teak focus:ring-1 focus:ring-deep-teak outline-none bg-stone-gray/5 text-black placeholder:text-stone-gray/50"
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmitting}
                    className="p-3 bg-deep-teak text-white rounded-full hover:bg-terracotta disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>

            {/* Comment List */}
            <div className="space-y-2">
                {commentTree.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUserId}
                        tripId={tripId}
                        likedByCurrentUser={comment.likedByCurrentUser}
                        likeCount={comment.likeCount}
                    />
                ))}

                {initialComments.length === 0 && (
                    <p className="text-stone-gray/50 text-center py-4 italic">No comments yet. Start the conversation!</p>
                )}
            </div>
        </div>
    );
}
