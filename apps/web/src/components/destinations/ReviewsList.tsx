import { Star, User, SquareArrowOutUpRight } from "lucide-react";

import { Review } from "@/lib/google-places";

interface ReviewsListProps {
    reviews: Review[];
    rating: number;
    totalRatings: number;
    googleReviewsUrl?: string | null;
}

export function ReviewsList({ reviews, rating, totalRatings, googleReviewsUrl }: ReviewsListProps) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-gray/10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-deep-teak">Visitor Reviews</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            <span className="text-3xl font-heading font-bold text-deep-teak">{rating}</span>
                            <div className="flex text-orange-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.round(rating) ? "fill-current" : "text-gray-300"}`} />
                                ))}
                            </div>
                        </div>
                        <span className="text-stone-gray text-sm">({totalRatings.toLocaleString()} reviews)</span>
                    </div>
                    Powered by <span className="font-bold">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                    </span>
                </div>
            </div>

            {googleReviewsUrl && (
                <div className="mb-8">
                    <a
                        href={googleReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-gray/20 rounded-full text-stone-gray hover:bg-stone-gray/5 hover:text-deep-teak transition-colors text-sm font-medium shadow-sm"
                    >
                        <SquareArrowOutUpRight className="w-4 h-4" />
                        Read more on Google
                    </a>
                </div>
            )}

            <div className="space-y-6">
                {reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-stone-gray/10 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-gray/10 shrink-0">
                                {review.profile_photo_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={review.profile_photo_url}
                                        alt={review.author_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-gray">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-deep-teak">{review.author_name}</h4>
                                    <span className="text-xs text-stone-gray">{review.relative_time_description}</span>
                                </div>
                                <div className="flex text-orange-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <p className="text-stone-gray text-sm leading-relaxed">
                                    {review.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
