"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLatestPosts(limit: number = 3) {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from("posts")
        .select(`
            id,
            title,
            slug,
            excerpt,
            published_at,
            featured_image,
            author:author_id (
                full_name
            )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching latest posts:", error);
        return [];
    }

    return posts;
}
