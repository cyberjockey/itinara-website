"use client";

import { useState } from "react";
import { Calendar, DollarSign, Sparkles, ArrowRight, BookOpen, Anchor, ChefHat } from "lucide-react";
import Link from "next/link";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

interface DestinationContentProps {
    destination: any; // Using any for agility, ideally strictly typed
}

export function DestinationContent({ destination }: DestinationContentProps) {
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<{ title: string; url: string }>({ title: "", url: "" });

    const openPdf = (title: string, url: string) => {
        setSelectedPdf({ title, url });
        setPdfModalOpen(true);
    };

    return (
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

            {/* NEW SECTION: Deep Dive Guides (Culture, Heritage, Culinary) */}
            <section className="mb-24">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E35435] text-white flex items-center justify-center text-sm font-bold">2</span>
                    Explore Deeper
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1: Local Culture */}
                    <button
                        onClick={() => openPdf(`Local Culture of ${destination.name}`, `/pdfs/${destination.slug}_culture.pdf`)}
                        className="group relative h-64 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-deep-teak/20 group-hover:bg-deep-teak/10 transition-colors z-0" />
                        {/* Placeholder generic image if specific not available, using color block for now or maybe duplicate dest image */}
                        <div className="absolute inset-0 bg-[#8B4513]" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-1">Local Culture</h3>
                            <p className="text-white/80 text-sm line-clamp-2">Traditions, arts, and the daily life of the locals.</p>
                            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-sunrise-gold border-b border-transparent group-hover:border-sunrise-gold transition-all">Read Guide</span>
                        </div>
                    </button>

                    {/* Card 2: Local Heritage */}
                    <button
                        onClick={() => openPdf(`Heritage Sites of ${destination.name}`, `/pdfs/${destination.slug}_heritage.pdf`)}
                        className="group relative h-64 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-[#5D4037]" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Anchor className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-1">Local Heritage</h3>
                            <p className="text-white/80 text-sm line-clamp-2">Historical landmarks and ancient stories.</p>
                            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-sunrise-gold border-b border-transparent group-hover:border-sunrise-gold transition-all">Read Guide</span>
                        </div>
                    </button>

                    {/* Card 3: Legendary Culinary */}
                    <button
                        onClick={() => openPdf(`Culinary Legends of ${destination.name}`, `/pdfs/${destination.slug}_culinary.pdf`)}
                        className="group relative h-64 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-[#D4654F]" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ChefHat className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-1">Legendary Culinary</h3>
                            <p className="text-white/80 text-sm line-clamp-2">Must-try dishes and hidden street food gems.</p>
                            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-sunrise-gold border-b border-transparent group-hover:border-sunrise-gold transition-all">Read Guide</span>
                        </div>
                    </button>
                </div>
            </section>

            {/* 4. Top Experiences */}


            {/* 5. Itinerary Teaser */}
            <section className="mb-24 p-8 md:p-12 bg-[#2C2121] text-white rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-8">Sample 3-Day Highlights</h2>

                    {destination.sample_itinerary && Array.isArray(destination.sample_itinerary) ? (
                        <div className="space-y-8 max-w-2xl border-l border-white/20 pl-8 ml-2">
                            {destination.sample_itinerary.map((day: any, index: number) => (
                                <div key={index} className="relative">
                                    <span className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-[#2C2121] ${index === 0 ? 'bg-[#E35435]' : 'bg-white'}`}></span>
                                    <h4 className="font-bold text-lg text-[#E35435] mb-1">Day {day.day}: {day.title}</h4>
                                    <p className="text-white/80 leading-relaxed">{day.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/60 italic">Itinerary details coming soon.</p>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="italic text-white/50 mb-6">...customize this itinerary to your pace.</p>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#E35435] font-bold hover:text-white transition-colors">
                            Start Planning <ArrowRight className="w-5 h-5" />
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

            <PdfViewerModal
                isOpen={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                title={selectedPdf.title}
                pdfUrl={selectedPdf.url}
            />
        </main>
    );
}
