import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Calendar, Clock, Tag, ExternalLink } from "lucide-react";
import { PlaceGallery } from "@/components/places/PlaceGallery";
import { PlaceReviews } from "@/components/places/PlaceReviews";
import { PlaceMap } from "@/components/places/PlaceMap";
import { AddActivityModal } from "@/components/dashboard/AddActivityModal";
import { AddToTripWrapper } from "@/components/places/AddToTripWrapper"; // New client wrapper

export const revalidate = 3600;

export default async function PlaceDetailPage(props: { params: Promise<{ id: string; placeId: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // 1. Fetch Place Details
    const { data: place, error } = await supabase
        .from("places")
        .select("*, destination:destinations(name)")
        .eq("id", params.placeId)
        .single();

    if (error || !place) {
        return notFound();
    }

    // 2. Fetch User's Trips for Add to Trip
    const { data: { user } } = await supabase.auth.getUser();
    let userTrips: any[] = [];
    if (user) {
        const now = new Date().toISOString();
        const { data: trips } = await supabase
            .from("trips")
            .select("id, title, start_date, end_date")
            .eq("user_id", user.id)
            .gte("end_date", now)
            .order("start_date", { ascending: true });
        if (trips) userTrips = trips;
    }

    // Default Images if photos array is empty
    const photos = place.photos && place.photos.length > 0 ? place.photos : [place.image_url || "/images/hero-bg.png"];

    // Default Reviews Mock if empty (since migration might not have run)
    const reviews = place.reviews || [
        { author: "Traveler A", rating: 5, text: "Amazing experience! Highly recommended.", time: "1 month ago" },
        { author: "Traveler B", rating: 4, text: "Great visuals, bit crowded.", time: "2 months ago" }
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 pb-24">
            {/* Header / Nav */}
            <div className="mb-6">
                <Link href={`/dashboard/explore/${params.id}`} className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to {place.destination?.name || "Destination"}
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content (Left 2/3) */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">{place.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-stone-gray mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-terracotta" />
                            {place.location}
                        </div>
                        {place.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                {place.rating} ({reviews.length} reviews)
                            </div>
                        )}
                        {place.status && (
                            <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${place.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {place.status}
                            </div>
                        )}
                    </div>

                    <PlaceGallery photos={photos} placeName={place.name} />

                    <div className="prose prose-stone text-stone-gray mb-8">
                        <h3 className="font-bold text-lg text-deep-teak mb-2">About</h3>
                        <p>{place.description || `Experience the unique charm of ${place.name}. A must-visit spot in ${place.location}.`}</p>
                    </div>

                    <PlaceReviews reviews={reviews} />
                </div>

                {/* Sidebar (Right 1/3) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Card */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-gray/10 shadow-lg sticky top-6">
                        <div className="mb-6">
                            <span className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-1 block">Plan Your Visit</span>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-terracotta" />
                                <span className="font-medium text-deep-teak capitalize">{place.type || "Attraction"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-terracotta" />
                                <span className="font-medium text-deep-teak">Usually 1-2 hours</span>
                            </div>
                        </div>

                        <PlaceMap coordinates={place.coordinates} address={place.location || place.name} />

                        <div className="mt-6 pt-6 border-t border-stone-gray/10">
                            <AddToTripWrapper
                                userTrips={userTrips}
                                placeName={place.name}
                                placeLocation={place.location}
                                placeType={place.type}
                                placeCoordinates={place.coordinates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
