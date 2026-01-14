import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Calendar, DollarSign } from "lucide-react";
import { PlacesList } from "@/components/destinations/PlacesList";

export const revalidate = 3600; // Revalidate every hour

export default async function DestinationDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // 1. Fetch Destination Details
    const { data: destination, error: destError } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", params.id)
        .single();

    if (destError || !destination) {
        return notFound();
    }

    // 2. Fetch Places for this Destination
    const { data: places } = await supabase
        .from("places")
        .select("*")
        .eq("destination_id", params.id);

    // 3. Fetch User's Trips (for Add to Trip functionality)
    const { data: { user } } = await supabase.auth.getUser();
    let userTrips: any[] = [];

    if (user) {
        // Only fetch future trips for adding activities
        const now = new Date().toISOString();
        const { data: trips } = await supabase
            .from("trips")
            .select("id, title, start_date, end_date")
            .eq("user_id", user.id)
            .gte("end_date", now)
            .order("start_date", { ascending: true });

        if (trips) {
            userTrips = trips;
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* 1. Header & Back Link */}
            <div className="mb-6">
                <Link href="/dashboard/explore" className="inline-flex items-center text-stone-gray hover:text-deep-teak mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Explore
                </Link>

                <div className="relative h-48 rounded-3xl overflow-hidden mb-6">
                    <Image
                        src={destination.image_url || "/images/hero-bg.png"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-4xl font-heading font-bold mb-2">{destination.name}</h1>
                        <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                {destination.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                {destination.rating} Rating
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 2. Sidebar: Key Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-stone-gray/10 shadow-sm">
                        <h2 className="font-bold text-xl text-deep-teak mb-4">About</h2>
                        <p className="text-stone-gray text-sm leading-relaxed mb-6">
                            {destination.description}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-stone-gray">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak">Best Time</span>
                                    Dry Season (Apr-Oct)
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-stone-gray">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak">Budget</span>
                                    Medium ($50-150/day)
                                </div>
                            </div>
                        </div>

                        {destination.tags && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {destination.tags.map((tag: string) => (
                                    <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-stone-gray/5 text-stone-gray border border-stone-gray/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Main Content: Places */}
                <div className="lg:col-span-2">
                    <PlacesList
                        places={places || []}
                        userTrips={userTrips}
                        destinationName={destination.name}
                        destinationId={destination.id} // Keep ID for logic if needed (e.g. Add to Trip)
                    />
                </div>
            </div>
        </div>
    );
}
