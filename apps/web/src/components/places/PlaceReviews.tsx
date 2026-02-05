"use client";

import { Star, User } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface Review {
    author: string;
    rating: number;
    text: string;
    time: string;
    avatar_url?: string;
}

interface PlaceReviewsProps {
    reviews: Review[];
    googleRating?: number;
    googleReviewCount?: number;
    googleMapsUrl?: string;
}

export function PlaceReviews({ reviews, googleRating, googleReviewCount, googleMapsUrl }: PlaceReviewsProps) {
    if ((!reviews || reviews.length === 0) && !googleRating) return null;

    return (
        <div className="bg-white rounded-2xl p-8 border border-stone-gray/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-deep-teak flex items-center gap-2">
                        Reviews
                        {googleRating && (
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width={14} height={14} alt="Google" className="inline-block" />
                                {googleRating} Rating
                            </span>
                        )}
                    </h3>
                    {googleReviewCount && (
                        <p className="text-sm text-stone-gray mt-1">
                            Based on {googleReviewCount.toLocaleString()} Google reviews
                        </p>
                    )}
                </div>
                {googleMapsUrl && (
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline font-medium"
                    >
                        Read all reviews on Google
                    </a>
                )}
            </div>

            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-stone-gray/10 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {review.avatar_url ? (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                        <Image src={getImageUrl(review.avatar_url, "/images/placeholder-avatar.png")} alt={review.author} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-stone-gray/10 flex items-center justify-center text-stone-gray">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-sm text-deep-teak">{review.author}</div>
                                    <div className="text-xs text-stone-gray">{review.time}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < review.rating ? "text-orange-400 fill-orange-400" : "text-stone-gray/20"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-stone-gray text-sm leading-relaxed">
                            {review.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
