"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requirePermission, Permission } from "@/lib/rbac";

export async function deletePost(id: string) {
    // RBAC: Only admins can manage blog posts
    await requirePermission(Permission.MANAGE_BLOG);

    const supabase = await createClient();

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/blog");
}
