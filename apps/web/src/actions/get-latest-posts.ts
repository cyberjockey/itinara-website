"use server";

import { createClient } from "@/lib/supabase/server";

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string;
    created_at: string;
    author: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
};

export async function getLatestPosts(limit: number = 3) {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at,
            created_at,
            author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching latest posts:", error);
        return [];
    }

    // Map author array to single object if needed
    const formattedPosts = posts?.map((post: any) => ({
        ...post,
        author: Array.isArray(post.author) ? post.author[0] : post.author
    })) || [];

    return formattedPosts as BlogPost[];
}
