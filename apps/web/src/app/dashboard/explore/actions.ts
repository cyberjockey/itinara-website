"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleSaveDestination(destinationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    // Check if already saved
    const { data: existing } = await supabase
        .from('saved_destinations')
        .select('*')
        .eq('user_id', user.id)
        .eq('destination_id', destinationId)
        .single();

    if (existing) {
        // Unsave
        await supabase
            .from('saved_destinations')
            .delete()
            .eq('user_id', user.id)
            .eq('destination_id', destinationId);

        revalidatePath('/dashboard/explore');
        revalidatePath('/dashboard/saved');
        revalidatePath(`/dashboard/explore/${destinationId}`);
        return { message: "unsaved" };
    } else {
        // Save
        await supabase
            .from('saved_destinations')
            .insert({
                user_id: user.id,
                destination_id: destinationId
            });

        revalidatePath('/dashboard/explore');
        revalidatePath('/dashboard/saved');
        revalidatePath(`/dashboard/explore/${destinationId}`);
        return { message: "saved" };
    }
}
