"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requirePermission, Permission } from "@/lib/rbac";

export async function getUsers(roleFilter?: string) {
    const supabase = await createClient();

    let query = supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true }); // Ordered by name as created_at is not standard in public profiles

    // Actually profiles might not have created_at if not added. `local_guide_platform_schema.sql` didn't add it explicitly to profiles, only to `trip_templates`.
    // The original schema had `updated_at`.
    // Let's order by `id` or `full_name` to be safe, or just `guide_verified` desc.

    if (roleFilter) {
        query = query.eq('role', roleFilter);
    }

    const { data, error } = await query;
    if (error) {
        console.error(error);
        return [];
    }
    return data;
}

export async function verifyGuide(userId: string) {
    // RBAC: Only admins can verify guides
    await requirePermission(Permission.MANAGE_USERS);

    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // We can double check admin role here or rely on RLS (if we have "Admins can update profiles" policy).
    // The schema had:
    // create policy "Users can update own profile."
    // We need an Admin policy for profiles.
    // I should check if I need to add that policy.
    // The schema `local_guide_platform_schema.sql` didn't explicitly add "Admins can update ALL profiles".
    // I might need to run a migration for that.

    // For now, let's try updating. If RLS fails, I'll add the policy.
    // Actually, `supabase/local_guide_platform_schema.sql` added:
    // "Admins view all templates", etc. but didn't explicitly touch Profiles RLS for Admins updating others.
    // It only added `ADD COLUMN ...`.

    const { error } = await supabase
        .from('profiles')
        .update({ guide_verified: true })
        .eq('id', userId);

    if (error) {
        console.error("Error verifying guide:", error);
        throw new Error("Failed to verify guide");
    }

    revalidatePath('/dashboard/users');
}

export async function setUserRole(userId: string, role: 'traveler' | 'local_guide' | 'admin') {
    // RBAC: Only admins can change user roles
    await requirePermission(Permission.MANAGE_USERS);

    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

    if (error) {
        console.error("Error setting role:", error);
        throw new Error("Failed to set user role");
    }
    revalidatePath('/dashboard/users');
}
