
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const supabase = createClient();
    const { data: destination } = await supabase
        .from('destinations')
        .select('name, description, image_url')
        .eq('slug', params.slug)
        .single();

    if (!destination) return { title: 'Not Found' };

    return {
        title: `${destination.name} Travel Itinerary | ITINARA`,
        description: destination.description?.substring(0, 155) || `Plan your trip to ${destination.name} with ITINARA.`,
        openGraph: {
            images: destination.image_url ? [destination.image_url] : [],
        }
    };
}

export default async function DestinationPage(props: PageProps) {
    const params = await props.params;
    const supabase = createClient();
    const { data: destination } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!destination) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#2C2121]">
            {/* Navigation (Simplified for landing) */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto border-b border-[#2C2121]/5">
                <Link href="/" className="text-2xl font-bold tracking-tight">ITINARA</Link>
                <div className="flex gap-4">
                    <Link href="/login" className="px-5 py-2 rounded-full border border-[#2C2121]/10 hover:bg-[#2C2121]/5 text-sm font-medium transition-colors">
                        Log in
                    </Link>
                    <Link href="/signup" className="px-5 py-2 rounded-full bg-[#E35435] text-white text-sm font-medium hover:bg-[#C13F23] transition-colors shadow-lg shadow-[#E35435]/20">
                        Sign up
                    </Link>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <header className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white">
                <Image
                    src={destination.image_url || "/images/hero-bg.png"}
                    alt={destination.name}
                    fill
                    className="object-cover absolute inset-0 z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="relative z-20 max-w-4xl px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold mb-6">
                        <MapPin className="w-4 h-4" /> Indonesia
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        {destination.name} <br /> Travel Itinerary
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Curated routes to explore {destination.name} independently, with intention and ease.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard" className="px-8 py-4 bg-[#E35435] text-white rounded-full font-bold text-lg hover:bg-[#C13F23] transition-colors shadow-xl">
                            Download Itinerary
                        </Link>
                        <Link href="#pricing" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                {/* 2. City Snapshot */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#2C2121]/5 -mt-32 relative z-30 flex flex-wrap md:flex-nowrap justify-between gap-8 animate-fade-in-up">
                    <div className="flex items-start gap-4 flex-1 min-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Best Time</h3>
                            <p className="text-[#2C2121]/60 text-sm">Dry Season (Apr-Oct)</p>
                        </div>
                    </div>
                    <div className="w-px bg-[#2C2121]/10 hidden md:block"></div>
                    <div className="flex items-start gap-4 flex-1 min-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Ideal Trip</h3>
                            <p className="text-[#2C2121]/60 text-sm">5-7 Days</p>
                        </div>
                    </div>
                    <div className="w-px bg-[#2C2121]/10 hidden md:block"></div>
                    <div className="flex items-start gap-4 flex-1 min-w-[200px]">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Budget</h3>
                            <p className="text-[#2C2121]/60 text-sm">Medium ($50-150/day)</p>
                        </div>
                    </div>
                </section>

                {/* 3. About the City */}
                <section className="py-20 mb-12">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E35435] text-white flex items-center justify-center text-sm font-bold">1</span>
                        About {destination.name}
                    </h2>
                    <div className="prose prose-lg prose-stone max-w-none text-[#2C2121]/80">
                        <p>{destination.description}</p>
                        <p>
                            Beyond the postcards, {destination.name} offers a deep connection to nature and culture.
                            Whether you are seeking spiritual grounding or adrenaline-pumping adventures, this destination captures the essence of Indonesia's diversity.
                        </p>
                    </div>
                </section>

                {/* 4. Top Experiences */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E35435] text-white flex items-center justify-center text-sm font-bold">2</span>
                        Top Experiences
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-white border border-[#2C2121]/5 hover:border-[#E35435]/30 transition-colors">
                                <h3 className="font-bold text-lg mb-2 group-hover:text-[#E35435] transition-colors">Experience Highlight {i}</h3>
                                <p className="text-sm text-[#2C2121]/60">A brief description of why this specific activity is a must-do in {destination.name}. Curated for quality.</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Itinerary Teaser */}
                <section className="mb-24 p-8 md:p-12 bg-[#2C2121] text-white rounded-3xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Day 1: Arrival & Immersion</h2>
                        <div className="space-y-6 max-w-2xl border-l border-white/20 pl-8 ml-2">
                            <div className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#E35435] border-4 border-[#2C2121]"></span>
                                <h4 className="font-bold text-lg">09:00 AM — Morning Market Exploration</h4>
                                <p className="text-white/60">Start slow with local flavors and authentic interactions.</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#2C2121]"></span>
                                <h4 className="font-bold text-lg">01:00 PM — Hidden Heritage Lunch</h4>
                                <p className="text-white/60">Dining at a legendary spot favored by locals.</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#2C2121]"></span>
                                <h4 className="font-bold text-lg">05:30 PM — Sunset at the Temple</h4>
                                <p className="text-white/60">The perfect golden hour spot away from the major crowds.</p>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="italic text-white/50 mb-6">...unlock 6 more days of curated plans.</p>
                            <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#E35435] font-bold hover:text-white transition-colors">
                                Unlock Full Itinerary <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 7. FAQ (Partial) */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold mb-8">Traveler FAQ</h2>
                    <div className="space-y-4">
                        <div className="p-6 bg-white rounded-2xl border border-[#2C2121]/5">
                            <h4 className="font-bold mb-2">Is {destination.name} safe for solo travelers?</h4>
                            <p className="text-sm text-[#2C2121]/70">Yes, it is generally very safe. We recommend adhering to standard travel precautions and respecting local customs.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-[#2C2121]/5">
                            <h4 className="font-bold mb-2">Do I need a tour guide?</h4>
                            <p className="text-sm text-[#2C2121]/70">No, our itinerary is capable of guiding you independently. However, for specific historical sites, a local guide can be hired on arrival.</p>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <div className="text-center py-20 border-t border-[#2C2121]/10">
                    <h2 className="text-4xl font-bold mb-6">Ready to go?</h2>
                    <p className="mb-8 text-[#2C2121]/60">Download your complete guide to {destination.name} today.</p>
                    <Link href="/dashboard" className="px-10 py-5 bg-[#E35435] text-white rounded-full font-bold text-xl hover:bg-[#C13F23] transition-colors shadow-xl">
                        Get the Itinerary
                    </Link>
                </div>

            </main>

            <footer className="border-t border-[#2C2121]/10 py-12 bg-white">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-sm text-[#2C2121]/60">
                        © {new Date().getFullYear()} ITINARA. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-[#2C2121]/80">
                        <Link href="/terms" className="hover:text-[#E35435] transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-[#E35435] transition-colors">Privacy Policy</Link>
                        <Link href="/disclaimer" className="hover:text-[#E35435] transition-colors">Disclaimer</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

