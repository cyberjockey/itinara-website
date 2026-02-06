"use client";

import { useState } from "react";
import { SocialPostCard } from "@/components/dashboard/SocialPostCard";
import { TripThreadSheet } from "@/components/dashboard/TripThreadSheet";

interface CommunityFeedProps {
    trips: any[];
    currentUserId?: string;
    likedTripIds: Set<string>;
}

export function CommunityFeed({ trips, currentUserId, likedTripIds }: CommunityFeedProps) {
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

    return (
        <>
            {/* Single-column feed like X/Threads */}
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-gray/10 overflow-hidden shadow-sm">
                {trips.map((trip) => (
                    <SocialPostCard
                        key={trip.id}
                        trip={trip}
                        currentUserId={currentUserId}
                        isLiked={likedTripIds.has(trip.id)}
                        onCommentClick={() => setSelectedTrip(trip)}
                    />
                ))}
            </div>

            <TripThreadSheet
                trip={selectedTrip}
                isOpen={!!selectedTrip}
                onClose={() => setSelectedTrip(null)}
                currentUserId={currentUserId}
                initialIsLiked={selectedTrip ? likedTripIds.has(selectedTrip.id) : false}
            />
        </>
    );
}
