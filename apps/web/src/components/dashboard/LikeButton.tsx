"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/dashboard/trips/actions";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    tripId: string;
    initialLikeCount: number;
    initialIsLiked: boolean;
}

export function LikeButton({ tripId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        if (isLoading) return;

        // Optimistic update
        const previousIsLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        setIsLoading(true);

        try {
            await toggleLike(tripId);
        } catch (e) {
            console.error(e);
            // Revert on error
            setIsLiked(previousIsLiked);
            setLikeCount(previousCount);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all border",
                isLiked
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "bg-white/10 text-stone-gray border-stone-gray/20 hover:bg-stone-gray/10 hover:text-red-500"
            )}
        >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            {likeCount}
        </button>
    );
}
