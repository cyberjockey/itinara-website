"use client";

import { useState } from "react";
import { SocialPostCard } from "@/components/dashboard/SocialPostCard";
import { TripThreadSheet } from "@/components/dashboard/TripThreadSheet";

interface Trip {
    id: string;
    user_id: string;
    title: string;
    destination: string;
    image_url?: string;
    created_at?: string;
    start_date?: string;
    end_date?: string;
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface CommunityFeedProps {
    trips: Trip[];
    currentUserId?: string;
    likedTripIds: Set<string>;
    tripCounts?: Record<string, number>;
}

export function CommunityFeed({ trips, currentUserId, likedTripIds, tripCounts = {} }: CommunityFeedProps) {
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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
                        guideTripCount={tripCounts[trip.user_id] || 0}
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
