
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "All Destinations | ITINARA",
    description: "Explore our curated collection of travel destinations in Indonesia.",
};

export default async function DestinationsIndexPage() {
    const supabase = createClient();
    const { data: destinations } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

    if (!destinations || destinations.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDF8F5] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-bold text-[#2C2121] mb-4">No Destinations Found</h1>
                <p className="text-[#2C2121]/70 mb-8">We are currently curating more amazing places for you. Check back soon!</p>
                <Link href="/" className="text-[#E35435] hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#E35435]/10 text-[#E35435] text-sm font-bold tracking-wide uppercase mb-4">
                        Discover Indonesia
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C2121] mb-6">Explore All Destinations</h1>
                    <p className="text-lg text-[#2C2121]/70 max-w-2xl mx-auto">
                        From the cultural heart of Java to the pristine beaches of Bali, start your journey here.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((destination) => (
                        <Link
                            key={destination.id}
                            href={`/destinations/${destination.slug}`}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#2C2121]/5 hover:-translate-y-1 block h-full flex flex-col"
                        >
                            <div className="relative h-64 overflow-hidden bg-gray-200">
                                {destination.image_url ? (
                                    <Image
                                        src={getImageUrl(destination.image_url)}
                                        alt={destination.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                                        <MapPin className="w-12 h-12 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-4 left-6 text-white">
                                    <h3 className="text-2xl font-bold font-heading">{destination.name}</h3>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-[#2C2121]/70 line-clamp-3 mb-6 flex-grow">
                                    {destination.description || "Explore the wonders of this amazing destination."}
                                </p>

                                <div className="flex items-center text-[#E35435] font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    View Itinerary
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
