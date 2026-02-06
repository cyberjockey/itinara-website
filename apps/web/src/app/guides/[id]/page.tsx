
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Star, MapPin, CheckCircle2, User, Award, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface GuideProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function GuideProfilePage({ params }: GuideProfilePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: guide } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (!guide) {
        notFound();
    }

    // Default Gimmick Values
    const rating = guide.local_guide_stars || 5.0;
    const googleLevel = guide.google_guide_level || 5;

    return (
        <div className="min-h-screen bg-warm-white py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-gray hover:text-deep-teak mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-stone-gray/10 overflow-hidden">
                    {/* Header Banner (Optional or Just Color) */}
                    <div className="h-32 bg-gradient-to-r from-ocean-turquoise/20 to-teal-500/20"></div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-8 -mt-12">
                            {/* Left Column: Avatar & Overview */}
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-64">
                                <div className="relative">
                                    {guide.avatar_url ? (
                                        <img
                                            src={guide.avatar_url}
                                            onError={(e) => {
                                                e.currentTarget.src = '/logo.png';
                                                e.currentTarget.onerror = null;
                                            }}
                                            alt={guide.full_name}
                                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-ocean-turquoise/10 flex items-center justify-center overflow-hidden">
                                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover opacity-50" />
                                        </div>
                                    )}
                                    {guide.guide_verified && (
                                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm">
                                            <CheckCircle2 className="w-6 h-6 text-ocean-turquoise fill-white" />
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold text-deep-teak mt-4 text-center md:text-left">{guide.full_name}</h1>
                                <p className="text-stone-gray text-sm mb-4">Local Guide in Indonesia</p>

                                {/* Badges Grid */}
                                <div className="space-y-3 w-full">
                                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                            <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-amber-800 uppercase font-bold tracking-wide">Rating</p>
                                            <p className="text-lg font-bold text-amber-900 leading-none">{rating} <span className="text-xs font-normal opacity-75">/ 5.0</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-800 uppercase font-bold tracking-wide">Google Badge</p>
                                            <p className="text-lg font-bold text-orange-900 leading-none">Level {googleLevel}</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-800 uppercase font-bold tracking-wide">Verified</p>
                                            <p className="text-sm font-bold text-blue-900 leading-tight">Identity Checked</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Bio & Expertise */}
                            <div className="flex-1 mt-4 md:mt-12">
                                <section className="mb-8">
                                    <h2 className="text-lg font-bold text-deep-teak mb-3">About Me</h2>
                                    <p className="text-stone-gray leading-relaxed whitespace-pre-wrap">
                                        {guide.guide_bio || "I am a passionate local guide ready to show you the best of Indonesia. I love sharing hidden gems, cultural stories, and ensuring you have an unforgettable trip."}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-lg font-bold text-deep-teak mb-3">Expertise</h2>
                                    {guide.guide_expertise && guide.guide_expertise.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {guide.guide_expertise.map((exp: string, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-stone-gray/5 text-stone-gray rounded-lg font-medium">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-stone-gray/5 text-stone-gray rounded-lg font-medium">Culture</span>
                                            <span className="px-4 py-2 bg-stone-gray/5 text-stone-gray rounded-lg font-medium">Culinary</span>
                                            <span className="px-4 py-2 bg-stone-gray/5 text-stone-gray rounded-lg font-medium">History</span>
                                            <span className="px-4 py-2 bg-stone-gray/5 text-stone-gray rounded-lg font-medium">Nature</span>
                                        </div>
                                    )}
                                </section>

                                <div className="mt-12 p-6 bg-stone-gray/5 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Award className="w-12 h-12 text-terracotta mb-4" />
                                    <h3 className="text-xl font-bold text-deep-teak mb-2">Top Rated Guide 2026</h3>
                                    <p className="text-stone-gray max-w-md">
                                        This guide has consistently received 5-star ratings from travelers for their exceptional knowledge and hospitality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
