
import { createClient } from "@/lib/supabase/server";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SaveButton } from "@/components/dashboard/SaveButton";

export default async function SavedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Saved Destinations with details
    const { data: savedItems } = await supabase
        .from('saved_destinations')
        .select(`
            destination:destinations (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    // Flatten the structure a bit for easier mapping
    // Note: Type assertion or detailed types would be better, but we trust the query shape here for MVP.
    const destinations = savedItems?.map((item: any) => item.destination) || [];

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Saved Destinations</h1>
                <p className="text-stone-gray">Your personal travel wish list.</p>
            </header>

            {destinations.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {destinations.map((destination: any) => (
                        <div key={destination.id} className="group bg-white rounded-2xl overflow-hidden border border-stone-gray/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={destination.image_url || "/images/hero-bg.png"}
                                    alt={destination.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-deep-teak shadow-sm">
                                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                                    {destination.rating}
                                </div>
                                <div className="absolute top-4 left-4">
                                    <SaveButton destinationId={destination.id} initialIsSaved={true} />
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-heading font-bold text-deep-teak mb-1">{destination.name}</h3>
                                <div className="flex items-center gap-1 text-stone-gray text-sm mb-3">
                                    <MapPin className="w-3 h-3 text-terracotta" />
                                    {destination.location}
                                </div>
                                <p className="text-stone-gray/80 text-sm line-clamp-2 mb-4">
                                    {destination.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {destination.tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-stone-gray/5 text-stone-gray">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/dashboard/explore/${destination.id}`}
                                    className="block w-full text-center py-2.5 rounded-xl border border-stone-gray/20 font-bold text-deep-teak hover:bg-deep-teak hover:text-white transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-stone-gray/10 rounded-3xl bg-warm-white/30">
                    <p className="text-stone-gray text-lg font-medium mb-2">No saved destinations yet.</p>
                    <p className="text-stone-gray/60 mb-6">Go explore and save places you want to visit!</p>
                    <Link href="/dashboard/explore" className="px-6 py-3 bg-terracotta text-white font-bold rounded-full hover:bg-deep-teak transition-colors shadow-md">
                        Start Exploring
                    </Link>
                </div>
            )}
        </div>
    );
}
