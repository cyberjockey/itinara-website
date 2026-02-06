import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, User, ChevronLeft, Map, Star, FileText, Sparkles } from "lucide-react";
import { getPublishedTemplate } from "../../actions";
import UseTemplateButton from "@/components/explore/UseTemplateButton";
import { TripGallery } from "@/components/dashboard/TripGallery";
import { createClient } from "@/lib/supabase/server";
import { getImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const template = await getPublishedTemplate(id);

    if (!template) {
        notFound();
    }

    const { destinations, profiles: guide } = template;
    const itinerary = template.itinerary as any; // Cast JSONB

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let vipCredits = 0;

    if (user) {
        const { data: quota } = await supabase
            .from('user_quotas')
            .select('vip_trips_remaining')
            .eq('user_id', user.id)
            .single();

        if (quota) {
            vipCredits = quota.vip_trips_remaining || 0;
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/dashboard/explore" className="inline-flex items-center text-sm font-medium text-stone-gray hover:text-deep-teak transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Explore
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden aspect-[21/9] mb-12 shadow-xl">
                <Image
                    src={getImageUrl(template.featured_image || destinations?.image_url)}
                    alt={template.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-terracotta text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {template.duration_days} Days
                        </span>
                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/30">
                            {template.difficulty_level}
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-400/90 text-deep-teak px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-300 shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-deep-teak" />
                            <span>4.5+ Google Rated</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 bg-blue-500/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold border border-blue-400/50">
                            <User className="w-3.5 h-3.5" />
                            <span>Certified Local Guide</span>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                        {template.title}
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-terracotta" />
                            {destinations?.name}, {destinations?.country || "Indonesia"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-deep-teak mb-4">About this Trip</h2>
                        <p className="text-stone-gray leading-relaxed text-lg mb-8">
                            {template.description}
                        </p>
                    </section>

                    {/* Gallery Section */}
                    {template.gallery_images && template.gallery_images.length > 0 && (
                        <TripGallery images={template.gallery_images} />
                    )}

                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold text-deep-teak mb-6 flex items-center gap-2">
                            <Map className="w-6 h-6 text-terracotta" />
                            Itinerary
                        </h2>

                        <div className="space-y-8 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-stone-gray/20"></div>

                            {itinerary?.days?.map((day: any, i: number) => {
                                const stops = day.activities
                                    ?.map((a: any) => a.location || a.title)
                                    .filter(Boolean) || [];

                                const mapsUrl = stops.length > 0
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stops[stops.length - 1])}&waypoints=${stops.slice(0, stops.length - 1).map((s: string) => encodeURIComponent(s)).join('|')}`
                                    : null;

                                return (
                                    <div key={i} className="relative pl-16">
                                        {/* Day Marker */}
                                        <div className="absolute left-0 top-0 w-14 h-14 bg-white border-2 border-terracotta rounded-xl flex flex-col items-center justify-center z-10 shadow-sm">
                                            <span className="text-xs font-bold text-stone-gray uppercase">Day</span>
                                            <span className="text-xl font-bold text-deep-teak">{day.day}</span>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 border border-stone-gray/10 shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                <h3 className="text-lg font-bold text-deep-teak">{day.title}</h3>

                                                {mapsUrl && (
                                                    <a
                                                        href={mapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                                                    >
                                                        <Map className="w-4 h-4" />
                                                        Navigate Day {day.day}
                                                    </a>
                                                )}
                                            </div>

                                            {day.activities && day.activities.length > 0 ? (
                                                <div className="space-y-6">
                                                    {day.activities.map((activity: any) => (
                                                        <div key={activity.id} className="flex gap-4 group">
                                                            <div className="w-16 pt-1 text-right text-sm font-mono font-medium text-stone-gray shrink-0">
                                                                {activity.start_time}
                                                            </div>
                                                            <div className="flex-1 pb-4 border-b border-stone-gray/10 last:border-0 last:pb-0">
                                                                <div className="flex items-start justify-between">
                                                                    <h4 className="font-bold text-deep-teak group-hover:text-terracotta transition-colors">
                                                                        {activity.title}
                                                                    </h4>
                                                                </div>
                                                                {activity.location && (
                                                                    <div className="flex items-center gap-1.5 text-xs text-stone-gray/70 mt-1 mb-2">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {activity.location}
                                                                    </div>
                                                                )}
                                                                {activity.description && (
                                                                    <p className="text-sm text-stone-gray leading-relaxed">
                                                                        {activity.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-stone-gray/60 italic text-sm">Free time to explore.</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Booking Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-gray/10">
                        <div className="mb-6">
                            <span className="text-sm text-stone-gray font-medium">Estimated Budget</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-deep-teak">{template.estimated_budget || "Contact for Price"}</span>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-rice-paddy-green/10 rounded-xl border border-rice-paddy-green/20">
                            <h4 className="font-bold text-deep-teak text-sm mb-3">Includes Local Expert Guides:</h4>
                            <ul className="space-y-2">
                                {[
                                    "Local Culture Guide",
                                    "Heritage or Historical Guide",
                                    "Legendary Cuisine Guide",
                                    "Hidden Gem Guide",
                                    "Emergency Contact Service"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-stone-gray">
                                        <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-amber-600 mt-3 font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                                Uses 1 VIP Trip Credit per booking
                            </p>
                        </div>

                        {template.guide_material_url && (
                            <a
                                href={template.guide_material_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full mb-3 px-6 py-3 bg-white border-2 border-dashed border-terracotta/30 hover:border-terracotta text-terracotta font-bold rounded-xl transition-all hover:bg-terracotta/5 group"
                            >
                                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Download Guide's PDF</span>
                            </a>
                        )}

                        <UseTemplateButton
                            templateId={template.id}
                            durationDays={template.duration_days}
                            vipQuota={vipCredits}
                        />

                        <p className="text-center text-xs text-stone-gray/60 mb-6 font-medium bg-stone-50 py-2 rounded-lg mt-2">
                            Secure your dates with a local expert.
                        </p>

                        <div className="space-y-4 pt-6 border-t border-stone-gray/10 mb-2">
                            <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-gray/5">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative shrink-0 border-2 border-white shadow-sm">
                                    {guide?.avatar_url ? (
                                        <Image src={getImageUrl(guide.avatar_url, "/images/placeholder-avatar.png")} alt={guide.full_name} fill className="object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-stone-gray uppercase tracking-wider font-bold truncate">Your Local Guide</p>
                                    <p className="font-bold text-deep-teak truncate">{guide?.full_name || "Itinara Expert"}</p>
                                </div>
                            </div>

                            {guide?.bio && (
                                <p className="text-sm text-stone-gray/80 italic">
                                    "{guide.bio}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
