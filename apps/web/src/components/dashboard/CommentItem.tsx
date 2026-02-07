"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Trash2, Heart, MessageCircle, Edit2, X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn, getImageUrl } from "@/lib/utils";
import { addComment, deleteComment, editComment, toggleCommentLike } from "@/app/dashboard/trips/actions";

interface Comment {
    id: string;
    parent_id?: string | null;
    user_id: string;
    content: string;
    attachment_url?: string | null;
    created_at: string;
    updated_at?: string | null;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
    replies?: Comment[];
    likedByCurrentUser?: boolean;
    likeCount?: number;
}

interface CommentItemProps {
    comment: Comment;
    currentUserId: string;
    tripId: string;
    likedByCurrentUser: boolean;
    likeCount: number;
    depth?: number;
}

export function CommentItem({
    comment,
    currentUserId,
    tripId,
    likedByCurrentUser,
    likeCount,
    depth = 0
}: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [editText, setEditText] = useState(comment.content);
    const [optimisticLike, setOptimisticLike] = useState({ isLiked: likedByCurrentUser, count: likeCount });

    const handleLike = async () => {
        const prev = optimisticLike;
        setOptimisticLike({
            isLiked: !prev.isLiked,
            count: prev.isLiked ? prev.count - 1 : prev.count + 1
        });
        try {
            await toggleCommentLike(comment.id, tripId);
        } catch {
            setOptimisticLike(prev);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await addComment(tripId, replyText, comment.id);
            setIsReplying(false);
            setReplyText("");
        } catch (e) {
            console.error(e);
            alert("Failed to reply");
        }
    };

    const handleEdit = async () => {
        if (!editText.trim()) return;
        try {
            await editComment(comment.id, editText, tripId);
            setIsEditing(false);
        } catch (e) {
            console.error(e);
            alert("Failed to edit");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this comment?")) return;
        await deleteComment(comment.id, tripId);
    };

    // Calculate generic avatar letter
    const initial = comment.profiles?.full_name?.[0] || "?";

    return (
        <div className={cn("group animate-in fade-in duration-300", depth > 0 && "ml-4 pl-4 border-l-2 border-stone-gray/10")}>
            <div className="flex gap-3 py-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-stone-gray/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-stone-gray">
                    {comment.profiles?.avatar_url ? (
                        <Image src={getImageUrl(comment.profiles.avatar_url, "/images/placeholder-avatar.png")} alt="Avatar" width={32} height={32} className="object-cover" />
                    ) : (
                        initial
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-baseline justify-between">
                        <span className="font-bold text-deep-teak text-sm">
                            {comment.profiles?.full_name || "Unknown User"}
                        </span>
                        <span className="text-xs text-stone-gray/60">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            {comment.updated_at && <span className="ml-1 italic text-[10px]">(edited)</span>}
                        </span>
                    </div>

                    {/* Content (Display or Edit) */}
                    {isEditing ? (
                        <div className="mt-2">
                            <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-stone-gray/20 text-sm outline-none focus:border-deep-teak text-black"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleEdit} className="text-xs bg-deep-teak text-white px-3 py-1 rounded-full font-bold">Save</button>
                                <button onClick={() => setIsEditing(false)} className="text-xs text-stone-gray px-2">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-stone-gray text-sm mt-1 break-words">{comment.content}</p>
                            {comment.attachment_url && (
                                <div className="mt-2">
                                    <img
                                        src={comment.attachment_url}
                                        alt="Attachment"
                                        className="max-h-60 rounded-lg border border-stone-gray/10 object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                        onClick={() => comment.attachment_url && window.open(comment.attachment_url, '_blank')}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={handleLike}
                            className={cn("flex items-center gap-1 text-xs font-bold transition-colors", optimisticLike.isLiked ? "text-red-500" : "text-stone-gray/60 hover:text-red-500")}
                        >
                            <Heart className={cn("w-3 h-3", optimisticLike.isLiked && "fill-current")} />
                            {optimisticLike.count > 0 && optimisticLike.count}
                        </button>

                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1 text-xs font-bold text-stone-gray/60 hover:text-deep-teak transition-colors"
                        >
                            <MessageCircle className="w-3 h-3" />
                            Reply
                        </button>

                        {currentUserId === comment.user_id && (
                            <>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-1 text-xs font-bold text-stone-gray/60 hover:text-blue-500 transition-colors"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1 text-xs font-bold text-stone-gray/60 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleReply} className="mt-3 flex gap-2 animate-in slide-in-from-top-1">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${comment.profiles?.full_name}...`}
                                className="flex-1 px-3 py-2 rounded-lg border border-stone-gray/20 text-sm outline-none focus:border-deep-teak text-black placeholder:text-stone-gray/40"
                                autoFocus
                            />
                            <button type="submit" disabled={!replyText.trim()} className="p-2 bg-deep-teak text-white rounded-lg hover:bg-terracotta">
                                <Send className="w-3 h-3" />
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-1">
                    {comment.replies.map((reply: Comment) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            tripId={tripId}
                            likedByCurrentUser={reply.likedByCurrentUser ?? false}
                            likeCount={reply.likeCount ?? 0}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
