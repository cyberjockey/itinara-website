"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    const fullName = formData.get("fullName")?.toString();
    const website = formData.get("website")?.toString();
    const avatarUrl = formData.get("avatarUrl")?.toString(); // Simplified for MVP (text input), ideally file upload

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: fullName,
            website: website,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error("Profile Update Error:", error);
        return { message: "Failed to update profile." };
    }

    revalidatePath('/dashboard');
    return { message: "success" };
}
