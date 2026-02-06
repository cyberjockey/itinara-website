import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { TemplatePreviewClient } from "./TemplatePreviewClient";

export default async function TemplateReferralPage({ params }: { params: Promise<{ refCode: string }> }) {
    const { refCode } = await params;

    // Fetch template by refCode
    const supabase = await createClient();

    const { data: refLink, error: refError } = await supabase
        .from("template_referral_links")
        .select(`
            ref_code,
            template_id,
            trip_templates!inner (
                id,
                title,
                description,
                duration_days,
                difficulty_level,
                difficulty_level,
                estimated_budget,
                itinerary,
                gallery_images,
                guide_materials,
                trip_type,
                destinations (
                    id,
                    name,
                    country
                ),
                profiles (
                    id,
                    full_name,
                    avatar_url
                )
            )
        `)
        .eq("ref_code", refCode)
        .single();

    if (refError || !refLink || !refLink.trip_templates) {
        notFound();
    }

    const template = Array.isArray(refLink.trip_templates) ? refLink.trip_templates[0] : refLink.trip_templates;
    const guide = Array.isArray(template.profiles) ? template.profiles[0] : template.profiles;
    const destination = Array.isArray(template.destinations) ? template.destinations[0] : template.destinations;

    return (
        <div className="min-h-screen relative pb-12 bg-gray-50">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'url("/images/wonderful-indonesia-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-bold mb-4">{template.title}</h1>
                            <p className="text-lg text-gray-700 mb-6">{template.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm">
                                {destination && (
                                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-gray-800">{destination.name}, {destination.country}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-800">{template.duration_days} Days</span>
                                </div>
                                {template.difficulty_level && (
                                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                                        <span className="text-gray-800 capitalize">Difficulty: {template.difficulty_level}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guide Info */}
                {guide && (
                    <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
                        <div className="max-w-6xl mx-auto px-4 py-6">
                            <div className="flex items-center gap-4">
                                {guide.avatar_url ? (
                                    <img
                                        src={guide.avatar_url}
                                        alt={guide.full_name}
                                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                        {guide.full_name?.charAt(0) || 'G'}
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm text-gray-500">Created by</div>
                                    <div className="font-semibold text-gray-900">{guide.full_name || 'Local Guide'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Gallery */}
                {template.gallery_images && template.gallery_images.length > 0 && (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {template.gallery_images.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-video relative rounded-lg overflow-hidden shadow-md group">
                                    <img
                                        src={img.startsWith('http') ? img : `/api/files/telegram/${img}`}
                                        alt={`Gallery image ${idx + 1}`}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content - Client Component for Tracking and Itinerary */}
                <TemplatePreviewClient
                    templateId={template.id}
                    refCode={refCode}
                    itinerary={template.itinerary}
                    guideMaterials={template.guide_materials}
                    tripType={template.trip_type}
                />
            </div>
        </div>
    );
}
