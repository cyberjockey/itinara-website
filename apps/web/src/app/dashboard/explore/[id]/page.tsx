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

    // 4. Fetch Trip Templates for this Destination
    const { data: templates } = await supabase
        .from("trip_templates")
        .select("*, profiles!inner(full_name, avatar_url)")
        .eq("status", "published")
        .eq("destination_id", params.id)
        .order("use_count", { ascending: false });

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {/* 1. Header & Back Link */}
            <div className="mb-8">
                <Link href="/dashboard/explore" className="inline-flex items-center text-sm font-medium text-stone-gray hover:text-deep-teak mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Explore
                </Link>

                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
                    <Image
                        src={destination.image_url || "/images/hero-bg.png"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white w-full">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Destination
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
                        <h2 className="font-bold text-xl text-deep-teak mb-4">About</h2>
                        <p className="text-stone-gray leading-relaxed mb-8">
                            {destination.description}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak text-sm mb-1">Best Time to Visit</span>
                                    <span className="text-stone-gray text-sm">Dry Season (Apr-Oct)</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-deep-teak text-sm mb-1">Estimated Budget</span>
                                    <span className="text-stone-gray text-sm">Medium ($50-150/day)</span>
                                </div>
                            </div>
                        </div>

                        {destination.tags && (
                            <div className="mt-8 pt-8 border-t border-dashed border-stone-gray/20">
                                <h3 className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-3">Popular For</h3>
                                <div className="flex flex-wrap gap-2">
                                    {destination.tags.map((tag: string) => (
                                        <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-gray/5 text-stone-gray hover:bg-stone-gray/10 transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Main Content: Trips & Places */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Curated Trips Section */}
                    {templates && templates.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-deep-teak mb-6">Curated Trips in {destination.name}</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {templates.map((template: any) => (
                                    <Link href={`/dashboard/explore/trips/${template.id}`} key={template.id} className="group flex flex-col h-full">
                                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                            <div className="relative h-48 shrink-0 overflow-hidden">
                                                <Image
                                                    src={template.featured_image || destination.image_url || "/images/hero-bg.png"}
                                                    alt={template.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-deep-teak text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                    {template.duration_days} Days
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="text-lg font-bold text-deep-teak mb-2 group-hover:text-terracotta transition-colors line-clamp-2">
                                                    {template.title}
                                                </h3>
                                                <p className="text-stone-gray/80 text-sm line-clamp-2 mb-4 flex-1">
                                                    {template.description}
                                                </p>
                                                <div className="flex items-center justify-between pt-4 border-t border-dashed border-stone-gray/10 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden relative">
                                                            {template.profiles?.avatar_url ? (
                                                                <Image src={template.profiles.avatar_url} alt="Guide" fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200" />
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold text-stone-gray">{template.profiles?.full_name}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-terracotta group-hover:translate-x-1 transition-transform">View Trip →</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-2xl font-bold text-deep-teak mb-6">Popular Places</h2>
                        <PlacesList
                            places={places || []}
                            userTrips={userTrips}
                            destinationName={destination.name}
                            destinationId={destination.id}
                        />
                    </section>


                </div>
            </div>
        </div>
    );
}
