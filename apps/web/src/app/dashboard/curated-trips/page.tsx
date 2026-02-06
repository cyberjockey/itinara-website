import { createClient } from "@/lib/supabase/server";
import { User, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedTemplates } from "../explore/actions";
import { Pagination } from "@/components/ui/Pagination";
import { getImageUrl } from "@/lib/utils";

export const metadata = {
    title: "Curated Trips | Itinara",
    description: "Explore curated trips by local guides.",
};

export default async function CuratedTripsPage(props: { searchParams: Promise<{ query?: string; page?: string; limit?: string; preference?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query || "";
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 9; // Grid 3x3
    const preference = searchParams.preference || "All";

    const preferences = ["All", "Adventure", "Relax", "Culture", "Foodie", "Luxury", "Family"];

    const { data: templates, count: templatesCount } = await getPublishedTemplates(query, page, limit, preference);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-deep-teak mb-2">Curated Trips</h1>
                    <p className="text-stone-gray/80">Discover unique experiences curated by local experts.</p>
                </div>
            </header>

            {/* Preference Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar mb-6">
                {preferences.map((p) => (
                    <Link
                        key={p}
                        href={`/dashboard/curated-trips?preference=${p}`}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${preference === p
                            ? "bg-terracotta text-white shadow-md transform scale-105"
                            : "bg-white text-stone-gray border border-stone-gray/20 hover:border-terracotta hover:text-terracotta hover:bg-stone-50"
                            }`}
                    >
                        {p}
                    </Link>
                ))}
            </div>

            {/* Trips Grid */}
            {templates && templates.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {templates.map((template: any) => (
                            <Link href={`/dashboard/explore/trips/${template.id}`} key={template.id} className="group flex flex-col h-full">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-60 shrink-0 overflow-hidden">
                                        <Image
                                            src={getImageUrl(template.featured_image || template.destinations?.image_url)}
                                            alt={template.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-white/95 backdrop-blur-sm text-deep-teak text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                {template.duration_days} Days
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                <span>👑</span> 1 VIP Credit
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
                                                    <Image src={getImageUrl(template.profiles.avatar_url, "/images/placeholder-avatar.png")} alt="Guide" fill className="object-cover" />
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
                <div className="py-20 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-gray/20">
                    <p className="text-lg text-stone-gray mb-2">No trips found for <span className="font-bold text-deep-teak">"{preference}"</span>.</p>
                    <p className="text-stone-gray/60">Try selecting a different category.</p>
                </div>
            )
            }
        </div >
    );
}
