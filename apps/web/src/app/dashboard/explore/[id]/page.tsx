import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Share2, Tag } from "lucide-react";
import AddToTripModal from "@/components/dashboard/AddToTripModal";
import { ReviewsList } from "@/components/destinations/ReviewsList";
import { MapEmbed } from "@/components/destinations/MapEmbed";
import { SaveButton } from "@/components/dashboard/SaveButton";

export default async function DestinationDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // 1. Fetch Destination Details
    const { data: destination, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !destination) {
        return notFound();
    }

    // 2. Fetch Manual Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('destination_id', destination.id)
        .order('created_at', { ascending: false });

    // 3. Fetch User's Trips (for the Add Modal)
    const { data: { user } } = await supabase.auth.getUser();
    const { data: trips } = await supabase
        .from('trips')
        .select('id, title, start_date, end_date')
        .eq('user_id', user?.id)
        .eq('status', 'upcoming') // Only show upcoming trips usually
        .order('start_date', { ascending: true });

    // 4. Check if Saved
    let isSaved = false;
    if (user) {
        const { data: saved } = await supabase
            .from('saved_destinations')
            .select('*')
            .eq('user_id', user.id)
            .eq('destination_id', destination.id)
            .single();
        isSaved = !!saved;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link href="/dashboard/explore" className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-6 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
            </Link>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 mb-8">
                {/* Hero Image */}
                <div className="relative h-[400px] w-full">
                    <Image
                        src={destination.image_url || "/images/hero-bg.png"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-8 w-full flex justify-between items-end">
                            <div className="text-white">
                                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">{destination.name}</h1>
                                <div className="flex items-center gap-4 text-white/90">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination.location}</span>
                                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {destination.rating}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <SaveButton
                                    destinationId={destination.id}
                                    initialIsSaved={isSaved}
                                    className="!bg-white/20 !text-white hover:!bg-white hover:!text-red-500"
                                />
                                <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-deep-teak transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-3 gap-8 p-8">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-deep-teak mb-4">About this place</h2>
                            <p className="text-stone-gray leading-relaxed text-lg">
                                {destination.description}
                                {/* Add some filler text if description is short to look good */}
                                <br /><br />
                                Experience the breathtaking beauty and rich culture of {destination.name}.
                                Perfect for travelers seeking {destination.tags?.join(", ").toLowerCase()}.
                            </p>
                        </div>

                        {/* Video Teaser Section */}
                        {destination.video_url && (
                            <div className="mb-8">
                                <h3 className="font-bold text-deep-teak mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta text-xs font-bold">▶</span>
                                    Cinematic Experience
                                </h3>
                                <div className="relative w-full rounded-2xl overflow-hidden border border-stone-gray/10 shadow-lg aspect-video bg-black">
                                    <iframe
                                        src={destination.video_url}
                                        title="Teaser Video"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {/* Panoramic Gallery Section */}
                        {destination.gallery_images && destination.gallery_images.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-deep-teak mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-terracotta" /> Scenic Views
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                                    {destination.gallery_images.map((imgUrl: string, idx: number) => (
                                        <div key={idx} className="relative h-64 w-[400px] flex-shrink-0 rounded-2xl overflow-hidden snap-center border border-stone-gray/10">
                                            <Image
                                                src={imgUrl}
                                                alt={`Gallery ${idx}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold text-deep-teak mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-terracotta" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {destination.tags?.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-stone-gray/5 text-stone-gray rounded-lg text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Google Reviews (Manual) */}
                        {reviews && reviews.length > 0 && (
                            <ReviewsList
                                reviews={reviews}
                                rating={destination.rating}
                                totalRatings={reviews.length}
                                googleReviewsUrl={destination.google_reviews_url}
                            />
                        )}
                    </div>

                    {/* Sidebar CTA */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-warm-white/50 rounded-2xl p-6 border border-stone-gray/10 sticky top-24">
                            <h3 className="font-bold text-xl text-deep-teak mb-2">Interested?</h3>
                            <p className="text-stone-gray text-sm mb-6">
                                Add this destination to one of your upcoming trips to automatically schedule a visit.
                            </p>

                            <AddToTripModal destination={destination} trips={trips || []} />

                            <p className="text-center text-xs text-stone-gray/50 mt-4">
                                You can customize the time and details later.
                            </p>
                        </div>

                        {/* Map Embed (Manual) */}
                        <MapEmbed
                            src={destination.map_embed_url}
                            query={`${destination.name}, ${destination.location}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
