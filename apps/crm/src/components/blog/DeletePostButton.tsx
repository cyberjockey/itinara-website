"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deletePost } from "@/app/dashboard/blog/actions";
import { useTransition } from "react";

export function DeletePostButton({ postId }: { postId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        startTransition(async () => {
            try {
                await deletePost(postId);
            } catch (error) {
                alert("Failed to delete post");
                console.error(error);
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
