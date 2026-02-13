"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


interface ProfileUpdates {
    id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    website?: string;
    updated_at: string;
    avatar_url?: string;
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const phoneNumber = formData.get("phoneNumber")?.toString();
    const fullName = formData.get("fullName")?.toString();
    const website = formData.get("website")?.toString();

    // Handle File Upload
    const avatarFile = formData.get("avatarFile") as File | null;
    let avatarUrl = undefined;

    if (avatarFile && avatarFile.size > 0) {
        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(avatarFile.type)) {
            return { message: "Invalid file type. Only JPG, PNG, and WebP are allowed." };
        }

        if (avatarFile.size > 2 * 1024 * 1024) {
            return { message: "File size too large. Max 2MB." };
        }

        try {
            const ext = avatarFile.type.split('/')[1];
            const timestamp = Date.now();
            const filename = `${user.id}/${timestamp}.${ext}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase
                .storage
                .from('avatars')
                .upload(filename, avatarFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error("Supabase Storage Upload Error:", uploadError);
                throw uploadError;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filename);

            avatarUrl = publicUrl;

        } catch (error) {
            console.error("Avatar upload failed:", error);
            return { message: "Failed to upload avatar image." };
        }
    }

    const updates: ProfileUpdates = {
        id: user.id,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        website: website,
        updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
        updates.avatar_url = avatarUrl;
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(updates);

    if (error) {
        console.error("Profile Update Error:", error);
        return { message: "Failed to update profile." };
    }

    revalidatePath('/dashboard');
    return { message: "success" };
}
