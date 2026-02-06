"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}

export async function updateProfile(prevState: unknown, formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Update Profile Auth Error:", authError);
        return { message: "Unauthorized: Please log in again." };
    }

    const full_name = formData.get('full_name') as string;
    const guide_bio = formData.get('guide_bio') as string;
    const avatar_url = formData.get('avatar_url') as string;

    // Parse guide_expertise from comma-separated string or handle array
    // For simplicity, let's assume it comes as a string and we split it if needed, 
    // or just store it as text array if the DB supports it.
    // The schema says TEXT[].
    const expertiseRaw = formData.get('guide_expertise') as string;
    const guide_expertise = expertiseRaw ? expertiseRaw.split(',').map(s => s.trim()).filter(s => s) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {
        full_name,
        guide_bio,
        guide_expertise,
        updated_at: new Date().toISOString(),
    };

    if (avatar_url) {
        updates.avatar_url = avatar_url;
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { message: "Failed to update profile" };
    }

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/layout'); // Update avatar in sidebar
    return { message: "Profile updated successfully" };
}
