import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LandingPageRenderer, type LandingPage } from "@/components/cms/LandingPageRenderer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chinese New Year 2026 Specials - Itinara',
    description: 'Celebrate the Year of the Snake with exclusive travel deals.',
};

export default async function CNYCampaignPage() {
    const supabase = await createClient();

    const { data: page, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", "cny")
        .eq("status", "published")
        .single();

    if (error || !page) {
        // Fallback for dev/build time if migration hasn't run yet, 
        // OR better: redirect to home or show 404.
        // For smoother dev experience, we might want to return 404 
        // but since this is a specific campaign page, the user expects it to be there.
        console.error("CNY Page content not found in CMS:", error);
        notFound();
    }

    return <LandingPageRenderer page={page as unknown as LandingPage} />;
}
