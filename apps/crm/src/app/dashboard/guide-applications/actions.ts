"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGuideApplications() {
    const supabase = await createClient();

    const { data: applications, error } = await supabase
        .from("guide_applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching guide applications:", error);
        return [];
    }

    return applications;
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = await createClient();

    const { error } = await supabase
        .from("guide_applications")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Error updating application status:", error);
        return { success: false, error: error.message };
    }

    // If approved, we might want to automatically upgrade the user's role to 'local_guide'
    if (status === 'approved') {
        const { data: app } = await supabase.from("guide_applications").select("user_id").eq("id", id).single();
        if (app) {
            const { error: roleError } = await supabase
                .from("profiles")
                .update({ role: "local_guide", guide_verified: true })
                .eq("id", app.user_id);

            if (roleError) {
                console.error("Failed to upgrade user role:", roleError);
                // We don't fail the whole action, but log it.
            }
        }
    }

    revalidatePath("/dashboard/guide-applications");
    return { success: true };
}
