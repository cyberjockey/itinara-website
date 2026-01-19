"use client";

import { useState } from "react";
import { CommunityTripCard } from "@/components/dashboard/CommunityTripCard";
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.map((trip) => (
                    <CommunityTripCard
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
