import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, User, ChevronLeft, Map, Star, FileText } from "lucide-react";
import { getPublishedTemplate } from "../../actions";
import UseTemplateButton from "@/components/explore/UseTemplateButton";
import { createClient } from "@/lib/supabase/server";

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
                    src={template.featured_image || destinations?.image_url || "/images/hero-bg.png"}
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
                        <p className="text-stone-gray leading-relaxed text-lg">
                            {template.description}
                        </p>
                    </section>

                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold text-deep-teak mb-6 flex items-center gap-2">
                            <Map className="w-6 h-6 text-terracotta" />
                            Itinerary
                        </h2>

                        <div className="space-y-8 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-stone-gray/20"></div>

                            {itinerary?.days?.map((day: any, i: number) => (
                                <div key={i} className="relative pl-16">
                                    {/* Day Marker */}
                                    <div className="absolute left-0 top-0 w-14 h-14 bg-white border-2 border-terracotta rounded-xl flex flex-col items-center justify-center z-10 shadow-sm">
                                        <span className="text-xs font-bold text-stone-gray uppercase">Day</span>
                                        <span className="text-xl font-bold text-deep-teak">{day.day}</span>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-stone-gray/10 shadow-sm">
                                        <h3 className="text-lg font-bold text-deep-teak mb-4">{day.title}</h3>

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
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Booking Card */}

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-gray/10 sticky top-8">
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
                            <p className="text-[10px] text-stone-gray/60 mt-3 italic">
                                * Quota deducted from your VIP trip allowance.
                            </p>
                        </div>
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

                    <p className="text-center text-xs text-stone-gray/60 mb-6">
                        Secure your dates with a local expert.
                    </p>

                    <div className="space-y-4 pt-6 border-t border-stone-gray/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                {guide?.avatar_url ? (
                                    <Image src={guide.avatar_url} alt={guide.full_name} fill className="object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-stone-gray uppercase tracking-wider font-bold">Your Guide</p>
                                <p className="font-bold text-deep-teak">{guide?.full_name || "Itinara Expert"}</p>
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

    );
}
