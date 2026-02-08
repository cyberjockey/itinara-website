"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission, Permission } from "@/lib/rbac";

export async function getTemplates() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('trip_templates')
        .select(`
            *,
            destinations (name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching templates:", error);
        return [];
    }

    return data;
}

export async function getTemplate(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('trip_templates')
        .select(`
            *,
            destinations (name, id, country)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching template for id ${id}:`, JSON.stringify(error, null, 2));
        return null;
    }

    return data;
}

export async function createTemplate(prevState: unknown, formData: FormData) {
    // RBAC: Guides and admins can create templates
    await requirePermission(Permission.MANAGE_TEMPLATES);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    const title = formData.get('title') as string;
    const destination_id = formData.get('destination_id') as string;
    const description = formData.get('description') as string;
    const duration_days = parseInt(formData.get('duration_days') as string);
    const difficulty_level = formData.get('difficulty_level') as string;
    const trip_type = (formData.get('trip_type') as string) || 'standard';
    const estimated_budget = formData.get('estimated_budget') as string;
    const trip_preference = formData.get('trip_preference') as string;

    // Quota Check & Deduction for VIP
    if (trip_type === 'vip') {
        const { data: isDeducted, error: quotaError } = await supabase
            .rpc('deduct_trip_by_type', {
                p_user_id: user.id,
                p_trip_type: 'vip'
            });

        if (quotaError) {
            console.error("Error deducting VIP quota:", quotaError);
            return { message: "System error checking quotas." };
        }

        if (!isDeducted) {
            return { message: "Insufficient VIP Quota. Please purchase more VIP credits." };
        }
    }

    // Initial itinerary skeleton
    const itinerary = {
        days: Array.from({ length: duration_days }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}`,
            activities: []
        }))
    };

    const { data, error } = await supabase
        .from('trip_templates')
        .insert({
            guide_id: user.id,
            title,
            destination_id,
            description,
            duration_days,
            difficulty_level,
            trip_type,
            estimated_budget,
            trip_preference,
            itinerary,
            status: 'draft'
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating template:", error);
        if (trip_type === 'vip') {
            await supabase.rpc('add_trip_credits_by_type', {
                p_user_id: user.id,
                p_trip_type: 'vip',
                p_credits: 1
            });
        }
        return { message: "Failed to create template" };
    }

    revalidatePath('/dashboard/templates');
    redirect(`/dashboard/templates/${data.id}`);
}

export async function updateTemplate(id: string, formData: FormData) {
    // RBAC: Guides and admins can update templates
    await requirePermission(Permission.MANAGE_TEMPLATES);

    const supabase = await createClient();

    const updates: Record<string, unknown> = {};
    if (formData.has('title')) updates.title = formData.get('title') as string;
    if (formData.has('description')) updates.description = formData.get('description') as string;
    if (formData.has('status')) updates.status = formData.get('status') as string;
    if (formData.has('difficulty_level')) updates.difficulty_level = formData.get('difficulty_level') as string;
    if (formData.has('featured_image')) updates.featured_image = formData.get('featured_image') as string;
    if (formData.has('estimated_budget')) updates.estimated_budget = formData.get('estimated_budget') as string;
    if (formData.has('trip_preference')) updates.trip_preference = formData.get('trip_preference') as string;

    if (formData.has('gallery_images')) {
        try {
            updates.gallery_images = JSON.parse(formData.get('gallery_images') as string);
        } catch (e) {
            console.error("Invalid gallery_images JSON", e);
            updates.gallery_images = [];
        }
    }

    if (formData.has('guide_materials')) {
        try {
            updates.guide_materials = JSON.parse(formData.get('guide_materials') as string);
        } catch (e) {
            console.error("Invalid guide_materials JSON", e);
            updates.guide_materials = [];
        }
    }

    if (formData.has('itinerary_json')) {
        try {
            updates.itinerary = JSON.parse(formData.get('itinerary_json') as string);
        } catch (e) {
            console.error("Invalid JSON itinerary", e);
        }
    }

    const { error } = await supabase
        .from('trip_templates')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error("Error updating template:", error);
        return { message: "Failed to update template" };
    }

    revalidatePath('/dashboard/templates');
    revalidatePath(`/dashboard/templates/${id}`);
    return { message: "Template updated successfully" };
}

export async function deleteTemplate(id: string) {
    // RBAC: Guides and admins can delete templates
    await requirePermission(Permission.MANAGE_TEMPLATES);

    const supabase = await createClient();

    const { error } = await supabase
        .from('trip_templates')
        .delete()
        .eq('id', id);

    if (error) {
        return { message: "Failed to delete template" };
    }

    revalidatePath('/dashboard/templates');
    return { message: "Template deleted" };
}

export async function publishTemplate(id: string) {
    // RBAC: Guides and admins can publish templates
    await requirePermission(Permission.MANAGE_TEMPLATES);

    const supabase = await createClient();

    const { error } = await supabase
        .from('trip_templates')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error("Error publishing template:", error);
        throw new Error("Failed to publish template");
    }

    revalidatePath(`/dashboard/templates/${id}`);
    revalidatePath('/dashboard/templates');
}

export async function unpublishTemplate(id: string) {
    // RBAC: Guides and admins can unpublish templates
    await requirePermission(Permission.MANAGE_TEMPLATES);

    const supabase = await createClient();

    const { error } = await supabase
        .from('trip_templates')
        .update({ status: 'draft' })
        .eq('id', id);

    if (error) {
        throw new Error("Failed to unpublish template");
    }

    revalidatePath(`/dashboard/templates/${id}`);
    revalidatePath('/dashboard/templates');
}

export async function getPendingTemplates() {
    // RBAC: Only admins can view pending templates
    await requirePermission(Permission.APPROVE_TEMPLATES);

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('trip_templates')
        .select(`
            *,
            destinations (name),
            profiles!guide_id (full_name, email)
        `)
        .eq('status', 'pending_review')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Error fetching pending templates:", error);
        return [];
    }

    return data;
}

export async function approveTemplate(id: string) {
    // RBAC: Only admins can approve templates
    await requirePermission(Permission.APPROVE_TEMPLATES);

    const supabase = await createClient();

    const { error } = await supabase
        .from('trip_templates')
        .update({
            status: 'published',
            published_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) {
        console.error("Error approving template:", error);
        throw new Error("Failed to approve template");
    }

    revalidatePath('/dashboard/moderation');
    revalidatePath(`/dashboard/templates/${id}`);
}

export async function rejectTemplate(id: string) {
    // RBAC: Only admins can reject templates
    await requirePermission(Permission.APPROVE_TEMPLATES);

    const supabase = await createClient();

    const { error } = await supabase
        .from('trip_templates')
        .update({ status: 'draft' }) // Send back to draft
        .eq('id', id);

    if (error) {
        console.error("Error rejecting template:", error);
        throw new Error("Failed to reject template");
    }

    revalidatePath('/dashboard/moderation');
    revalidatePath(`/dashboard/templates/${id}`);
}
