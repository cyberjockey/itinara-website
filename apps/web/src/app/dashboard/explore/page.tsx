import { createClient } from "@/lib/supabase/server";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SaveButton } from "@/components/dashboard/SaveButton";
import { getImageUrl } from "@/lib/utils";

interface Destination {
    id: string;
    name: string;
    location: string;
    description: string;
    image_url: string;
    rating: number;
}

export const dynamic = "force-dynamic";

export default async function ExplorePage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Destinations
    const { data: destinations } = await (async () => {
        let q = supabase
            .from('destinations')
            .select('*')
            .order('rating', { ascending: false });
        if (query) q = q.ilike('name', `%${query}%`);
        return q;
    })();

    // Fetch User's Saved Destinations IDs
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 pt-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-2">Explore Indonesia</h1>
                    <p className="text-lg text-stone-gray/80">Discover hidden gems and popular destinations.</p>
                </div>
            </header>

            <div className="mb-12">
                <SearchBar />
            </div>

            {/* Destinations Grid */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-deep-teak">Popular Destinations</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations?.map((destination: Destination) => (
                        <Link href={`/dashboard/explore/${destination.id}`} key={destination.id} className="group flex flex-col h-full">
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                <div className="relative h-64 shrink-0 overflow-hidden">
                                    <Image
                                        src={getImageUrl(destination.image_url)}
                                        alt={destination.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <SaveButton
                                            destinationId={destination.id}
                                            initialIsSaved={savedIds.includes(destination.id)}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-deep-teak">{destination.name}</h3>
                                        <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md text-xs font-bold text-deep-teak shadow-sm border border-stone-gray/5">
                                            <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                            {destination.rating}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-stone-gray/80 text-xs mb-4 font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-terracotta" />
                                        <span>{destination.location}</span>
                                    </div>

                                    <p className="text-stone-gray/80 text-sm line-clamp-2 leading-relaxed flex-1 mb-6">
                                        {destination.description}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-terracotta group-hover:translate-x-1 transition-transform mt-auto">
                                        Explore Region <span className="ml-1">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )) || <p>No destinations found.</p>}
                </div>
            </section>
        </div>
    );
}

