import { createClient } from "@/lib/supabase/server";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SaveButton } from "@/components/dashboard/SaveButton";

export default async function ExplorePage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Destinations
    let queryBuilder = supabase
        .from('destinations')
        .select('*')
        .order('rating', { ascending: false });

    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    const { data: destinations } = await queryBuilder;

    // 2. Fetch User's Saved Destinations IDs
    let savedIds: string[] = [];
    if (user) {
        const { data: saved } = await supabase
            .from('saved_destinations')
            .select('destination_id')
            .eq('user_id', user.id);

        if (saved) {
            savedIds = saved.map(s => s.destination_id);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Explore Destinations</h1>
                <p className="text-stone-gray">Discover the hidden gems of Indonesia.</p>
            </header>

            <SearchBar />

            {/* Destinations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destinations?.map((destination) => (
                    <div key={destination.id} className="group bg-white rounded-2xl overflow-hidden border border-stone-gray/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="relative h-64 overflow-hidden">
                            {/* In a real app, use the actual image_url. For now, if the seed used local paths, it works. If external, need Next.js config. */}
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
                                <SaveButton
                                    destinationId={destination.id}
                                    initialIsSaved={savedIds.includes(destination.id)}
                                />
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
        </div>
    );
}
