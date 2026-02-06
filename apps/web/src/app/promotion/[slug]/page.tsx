import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LandingPageRenderer, type LandingPage } from "@/components/cms/LandingPageRenderer";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: page } = await supabase
        .from("landing_pages")
        .select("title, meta_title, meta_description")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!page) {
        return { title: 'Page Not Found' };
    }

    return {
        title: page.meta_title || page.title,
        description: page.meta_description || undefined,
    };
}

export default async function LandingPageRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: page, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !page) {
        notFound();
    }

    return <LandingPageRenderer page={page as unknown as LandingPage} />;
}
