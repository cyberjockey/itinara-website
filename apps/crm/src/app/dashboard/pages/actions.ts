"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission, Permission } from "@/lib/rbac";

export type StaticPage = {
    id: string;
    slug: string;
    title: string;
    content: string | null;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

export async function getStaticPages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching static pages:", error);
        return [];
    }
    return data as StaticPage[];
}

export async function getStaticPage(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching static page:", error);
        return null;
    }
    return data as StaticPage;
}

export async function createStaticPage(formData: FormData) {
    // RBAC: Only admins can manage static pages
    await requirePermission(Permission.MANAGE_PAGES);

    const supabase = await createClient();

    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const meta_title = formData.get("meta_title") as string;
    const meta_description = formData.get("meta_description") as string;
    const is_published = formData.get("is_published") === "true";

    const { error } = await supabase.from("static_pages").insert([
        {
            slug,
            title,
            content,
            meta_title,
            meta_description,
            is_published,
        },
    ]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/pages");
    redirect("/dashboard/pages");
}

export async function updateStaticPage(id: string, formData: FormData) {
    // RBAC: Only admins can manage static pages
    await requirePermission(Permission.MANAGE_PAGES);

    const supabase = await createClient();

    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const meta_title = formData.get("meta_title") as string;
    const meta_description = formData.get("meta_description") as string;
    const is_published = formData.get("is_published") === "true";

    const { error } = await supabase
        .from("static_pages")
        .update({
            slug,
            title,
            content,
            meta_title,
            meta_description,
            is_published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/pages");
    redirect("/dashboard/pages");
}

export async function deleteStaticPage(id: string) {
    // RBAC: Only admins can manage static pages
    await requirePermission(Permission.MANAGE_PAGES);

    const supabase = await createClient();

    const { error } = await supabase
        .from("static_pages")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/pages");
}
