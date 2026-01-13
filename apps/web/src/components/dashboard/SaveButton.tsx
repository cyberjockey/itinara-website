"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleSaveDestination } from "@/app/dashboard/explore/actions";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll just use template literals or install clsx

// Just in case utils doesn't exist, I'll inline a simple clsx
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

interface SaveButtonProps {
    destinationId: string;
    initialIsSaved: boolean;
    className?: string;
}

export function SaveButton({ destinationId, initialIsSaved, className }: SaveButtonProps) {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();

        setIsLoading(true);
        // Optimistic update
        const newState = !isSaved;
        setIsSaved(newState);

        try {
            await toggleSaveDestination(destinationId);
        } catch (error) {
            // Revert on error
            setIsSaved(!newState);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={classNames(
                "p-2 rounded-full backdrop-blur-md transition-all active:scale-95",
                isSaved ? "bg-white text-red-500 hover:bg-neutral-100" : "bg-white/20 text-white hover:bg-white/30",
                className
            )}
            disabled={isLoading}
        >
            <Heart className={classNames("w-4 h-4", isSaved ? "fill-current" : "")} />
        </button>
    );
}
