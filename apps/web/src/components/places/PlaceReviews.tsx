"use client";

import { Star, User } from "lucide-react";

interface Review {
    author: string;
    rating: number;
    text: string;
    time: string;
    avatar_url?: string;
}

interface PlaceReviewsProps {
    reviews: Review[];
}

export function PlaceReviews({ reviews }: PlaceReviewsProps) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-lg text-deep-teak">Reviews</h3>
                <div className="flex items-center gap-1 text-sm text-stone-gray/80">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
                    <span>Rating</span>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-stone-gray/10 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {review.avatar_url ? (
                                    <img src={review.avatar_url} alt={review.author} className="w-8 h-8 rounded-full" />
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
