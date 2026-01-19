import { createClient } from "@/lib/supabase/server";
import { MapPin, Star, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SaveButton } from "@/components/dashboard/SaveButton";
import { getPublishedTemplates } from "./actions";

import { Pagination } from "@/components/ui/Pagination";

export default async function ExplorePage(props: { searchParams: Promise<{ query?: string; page?: string; limit?: string; preference?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 6; // Default to 6 for web grid (2x3 or 3x2)
    const preference = searchParams.preference || "All";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Parallel Fetching
    const [templatesData, destinationsData] = await Promise.all([
        getPublishedTemplates(query, page, limit, preference),
        (async () => {
            let q = supabase
                .from('destinations')
                .select('*')
                .order('rating', { ascending: false });
            if (query) q = q.ilike('name', `%${query}%`);
            return q;
        })()
    ]);

    const { data: templates, count: templatesCount } = templatesData;
    const destinations = destinationsData.data || [];

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

    const preferences = ["All", "Adventure", "Relax", "Culture", "Foodie", "Luxury", "Family"];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 pt-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-2">Explore Indonesia</h1>
                    <p className="text-lg text-stone-gray/80">Curated trips by local guides and hidden gems.</p>
                </div>
            </header>

            <div className="mb-12">
                <SearchBar />
            </div>

            {/* Curated Trips Section */}
            {/* Curated Trips Section */}
            <section className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-deep-teak">Curated Trips</h2>
                        <Link href="#" className="text-stone-gray hover:text-terracotta text-sm font-medium transition-colors">View All</Link>
                    </div>

                    {/* Preference Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {preferences.map((p) => (
                            <Link
                                key={p}
                                href={`/dashboard/explore?preference=${p}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${preference === p
                                    ? "bg-terracotta text-white shadow-md"
                                    : "bg-white text-stone-gray border border-stone-gray/20 hover:border-terracotta hover:text-terracotta"
                                    }`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>
                </div>

                {templates && templates.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {templates.map((template: any) => (
                                <Link href={`/dashboard/explore/trips/${template.id}`} key={template.id} className="group flex flex-col h-full">
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-56 shrink-0 overflow-hidden">
                                            <Image
                                                src={template.featured_image || template.destinations?.image_url || "/images/hero-bg.png"}
                                                alt={template.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <div className="bg-white/95 backdrop-blur-sm text-deep-teak text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                    {template.duration_days} Days
                                                </div>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-xs font-medium text-stone-gray/60 mb-3">
                                                <span className="uppercase tracking-wider">{template.difficulty_level}</span>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {template.destinations?.name || 'Indonesia'}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-deep-teak mb-2 group-hover:text-terracotta transition-colors line-clamp-2 leading-tight">
                                                {template.title}
                                            </h3>

                                            <p className="text-stone-gray/80 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                                                {template.description || "No description provided."}
                                            </p>

                                            <div className="pt-4 border-t border-dashed border-stone-gray/10 flex items-center gap-3 mt-auto">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden relative shrink-0">
                                                    {template.profiles?.avatar_url ? (
                                                        <Image src={template.profiles.avatar_url} alt="Guide" fill className="object-cover" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                    )}
                                                </div>
                                                <div className="text-xs truncate">
                                                    <p className="text-stone-gray/60">Guided by</p>
                                                    <p className="font-bold text-deep-teak truncate">{template.profiles?.full_name || "Local Expert"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Pagination
                            totalItems={templatesCount}
                            currentPage={page}
                            pageSize={limit}
                        />
                    </>
                ) : (
                    <div className="mb-12 py-12 px-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-gray/20">
                        <p className="text-stone-gray mb-2">No trips found for <span className="font-bold text-deep-teak">"{preference}"</span>.</p>
                        <p className="text-sm text-stone-gray/60">Try selecting a different category or view all trips.</p>
                    </div>
                )}
            </section>

            {/* Destinations Grid */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-deep-teak">Popular Destinations</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((destination: any) => (
                        <Link href={`/dashboard/explore/${destination.id}`} key={destination.id} className="group flex flex-col h-full">
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                <div className="relative h-64 shrink-0 overflow-hidden">
                                    <Image
                                        src={destination.image_url || "/images/hero-bg.png"}
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
                    ))}
                </div>
            </section>
        </div>
    );
}
