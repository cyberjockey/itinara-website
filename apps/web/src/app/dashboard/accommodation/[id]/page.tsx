import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Calendar, DollarSign } from "lucide-react";
import { PlacesList } from "@/components/destinations/PlacesList";
import { getImageUrl } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic';

interface Trip {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
}

export default async function AccommodationDetailPage(props: { params: Promise<{ id: string }> }) {
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

    // 2. Fetch Accommodations for this Destination
    const { data: places } = await supabase
        .from("places")
        .select("*")
        .eq("destination_id", params.id)
        .or('type.ilike.Accomodation,type.ilike.Accommodation');

    // 3. Fetch User's Trips (for Add to Trip functionality)
    const { data: { user } } = await supabase.auth.getUser();
    let userTrips: Trip[] = [];

    if (user) {
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {/* 1. Header & Back Link */}
            <div className="mb-8">
                <Link href="/dashboard/accommodation" className="inline-flex items-center text-sm font-medium text-stone-gray hover:text-deep-teak mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Accommodations
                </Link>

                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
                    <Image
                        src={getImageUrl(destination.image_url)}
                        alt={destination.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white w-full">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Stays in {destination.name}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-medium text-white/90">
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                {destination.rating} Rating
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-2">{destination.name}</h1>
                        <div className="flex items-center gap-2 text-white/80 text-lg">
                            <MapPin className="w-5 h-5 text-terracotta" />
                            {destination.location}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* 2. Sidebar: Key Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-stone-gray/10 shadow-sm sticky top-8">
                        <h2 className="font-bold text-xl text-deep-teak mb-4">About the Area</h2>
                        <p className="text-stone-gray leading-relaxed mb-8">
                            {destination.description}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak text-sm mb-1">Best Booking Period</span>
                                    <span className="text-stone-gray text-sm">3-6 Months in Advance</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak text-sm mb-1">Price Range</span>
                                    <span className="text-stone-gray text-sm">{destination.name === 'Bali' ? '$40 - $300' : '$20 - $150'} / night</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Main Content: Accommodations */}
                <div className="lg:col-span-2 space-y-16">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-deep-teak">Recommended Accommodations</h2>
                        </div>
                        <PlacesList
                            places={places || []}
                            userTrips={userTrips}
                            destinationName={destination.name}
                            destinationId={destination.id}
                            readOnly={true}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
