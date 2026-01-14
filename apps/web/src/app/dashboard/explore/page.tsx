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
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <header className="mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-3">Explore Destinations</h1>
                <p className="text-lg text-stone-gray/80">Discover the hidden gems of Indonesia.</p>
            </header>

            <SearchBar />

            {/* Destinations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations?.map((destination) => (
                    <div key={destination.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-gray/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="relative h-72 overflow-hidden">
                            {/* In a real app, use the actual image_url. For now, if the seed used local paths, it works. If external, need Next.js config. */}
                            <Image
                                src={destination.image_url || "/images/hero-bg.png"}
                                alt={destination.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-sm font-bold text-deep-teak shadow-sm">
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                {destination.rating}
                            </div>
                            <div className="absolute top-5 left-5">
                                <SaveButton
                                    destinationId={destination.id}
                                    initialIsSaved={savedIds.includes(destination.id)}
                                />
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-heading font-bold text-deep-teak mb-2">{destination.name}</h3>
                            <div className="flex items-center gap-2 text-stone-gray/80 text-sm mb-4">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                <span className="font-medium">{destination.location}</span>
                            </div>
                            <p className="text-stone-gray/80 text-sm line-clamp-2 mb-4 leading-relaxed">
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
