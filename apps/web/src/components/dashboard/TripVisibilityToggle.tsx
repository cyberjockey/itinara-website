"use client";

import { useState } from "react";
import { Globe, Lock, Loader2 } from "lucide-react";
import { toggleTripVisibility } from "@/app/dashboard/trips/actions";
import { cn } from "@/lib/utils";

interface TripVisibilityToggleProps {
    tripId: string;
    initialIsPublic: boolean;
}

export function TripVisibilityToggle({ tripId, initialIsPublic }: TripVisibilityToggleProps) {
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        const newState = !isPublic;
        try {
            await toggleTripVisibility(tripId, newState);
            setIsPublic(newState);
        } catch (e) {
            console.error(e);
            alert("Failed to update visibility.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                isPublic
                    ? "bg-rice-paddy-green/10 text-rice-paddy-green border-rice-paddy-green/20 hover:bg-rice-paddy-green/20"
                    : "bg-stone-gray/5 text-stone-gray border-stone-gray/10 hover:bg-stone-gray/10"
            )}
            title={isPublic ? "Public: Visible to everyone" : "Private: Only you can see this"}
        >
            {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : isPublic ? (
                <Globe className="w-3 h-3" />
            ) : (
                <Lock className="w-3 h-3" />
            )}
            {isPublic ? "Public" : "Private"}
        </button>
    );
}
