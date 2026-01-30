"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Block types for landing pages
export type BlockType = 'hero' | 'features' | 'cta' | 'gallery' | 'richtext';

export type HeroBlock = {
    type: 'hero';
    data: {
        title: string;
        subtitle?: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaUrl?: string;
    };
};

export type FeaturesBlock = {
    type: 'features';
    data: {
        title?: string;
        items: Array<{
            icon?: string;
            title: string;
            description: string;
        }>;
    };
};

export type CTABlock = {
    type: 'cta';
    data: {
        title: string;
        description?: string;
        buttonText: string;
        buttonUrl: string;
        backgroundColor?: string;
    };
};

export type GalleryBlock = {
    type: 'gallery';
    data: {
        images: string[];
    };
};

export type RichtextBlock = {
    type: 'richtext';
    data: {
        content: string; // Markdown/HTML
    };
};

export type PageBlock = HeroBlock | FeaturesBlock | CTABlock | GalleryBlock | RichtextBlock;

export type LandingPage = {
    id: string;
    slug: string;
    title: string;
    content: PageBlock[];
    meta_title: string | null;
    meta_description: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

export async function getLandingPages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching landing pages:", error);
        return [];
    }
    return data as LandingPage[];
}

export async function getLandingPage(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching landing page:", error);
        return null;
    }
    return data as LandingPage;
}

export async function createLandingPage(data: {
    slug: string;
    title: string;
    content: PageBlock[];
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published' | 'archived';
}) {
    const supabase = await createClient();

    const { error } = await supabase.from("landing_pages").insert([
        {
            ...data,
            published_at: data.status === 'published' ? new Date().toISOString() : null,
        },
    ]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/landing-pages");
    redirect("/dashboard/landing-pages");
}

export async function updateLandingPage(id: string, data: {
    slug: string;
    title: string;
    content: PageBlock[];
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published' | 'archived';
}) {
    const supabase = await createClient();

    // Get existing page to check published_at
    const { data: existing } = await supabase
        .from("landing_pages")
        .select("published_at")
        .eq("id", id)
        .single();

    const { error } = await supabase
        .from("landing_pages")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
            published_at: data.status === 'published' && !existing?.published_at
                ? new Date().toISOString()
                : existing?.published_at,
        })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/landing-pages");
    redirect("/dashboard/landing-pages");
}

export async function deleteLandingPage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("landing_pages")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/landing-pages");
}
