
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Metadata } from "next";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { DestinationContent } from "@/components/destinations/DestinationContent";

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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: destination.name,
        description: destination.description,
        image: destination.image_url ? [destination.image_url] : [],
        url: `https://itinara.com/destinations/${params.slug}`,
        touristType: [
            "AdventureTourism",
            "CulturalTourism"
        ],
        isAccessibleForFree: true,
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#2C2121]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Navigation (Simplified for landing) */}

            {/* 1. Hero Section */}
            <DestinationHero
                name={destination.name}
                description={destination.description}
                imageUrl={destination.image_url}
            />

            <DestinationContent destination={destination} />
        </div>
    );
}
