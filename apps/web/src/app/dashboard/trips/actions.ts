"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleTripVisibility(tripId: string, isPublic: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from('trips')
        .update({ is_public: isPublic })
        .eq('id', tripId)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error updating trip visibility:", error);
        throw new Error("Failed to update visibility");
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
    revalidatePath('/dashboard/community');
}

export async function toggleLike(tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('trip_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('trip_id', tripId)
        .single();

    if (existingLike) {
        // Unlike
        await supabase
            .from('trip_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('trip_id', tripId);
    } else {
        // Like
        await supabase
            .from('trip_likes')
            .insert({ user_id: user.id, trip_id: tripId });
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
    revalidatePath('/dashboard/community');
}

export async function addComment(tripId: string, content: string, parentId?: string, attachmentUrl?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const payload: any = {
        user_id: user.id,
        trip_id: tripId,
        content: content,
        attachment_url: attachmentUrl
    };
    if (parentId) {
        payload.parent_id = parentId;
    }

    const { error } = await supabase
        .from('trip_comments')
        .insert(payload);

    if (error) {
        console.error("Comment error:", error);
        throw new Error("Failed to post comment");
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
}

export async function editComment(commentId: string, newContent: string, tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('trip_comments')
        .update({
            content: newContent,
            updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user.id);

    if (error) throw new Error("Failed to edit comment");
    revalidatePath(`/dashboard/trips/${tripId}`);
}

export async function deleteComment(commentId: string, tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    await supabase
        .from('trip_comments')
        .delete()
        .eq('id', commentId);

    revalidatePath(`/dashboard/trips/${tripId}`);
}

export async function toggleCommentLike(commentId: string, tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: existing } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

    if (existing) {
        await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId);
    } else {
        await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId });
    }
    revalidatePath(`/dashboard/trips/${tripId}`);
}

export async function fetchComments(
    tripId: string,
    offset: number = 0,
    limit: number = 3,
    sortBy: 'recent' | 'popular' = 'recent'
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
        .from('trip_comments')
        .select(`
            *,
            profiles!trip_comments_user_id_profiles_fkey(full_name, avatar_url),
            comment_likes(user_id)
        `)
        .eq('trip_id', tripId)
        .is('parent_id', null)
        .range(offset, offset + limit - 1);

    if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: rootComments, error } = await query;

    if (error) {
        console.error("Fetch comments error:", error);
        return { comments: [], total: 0 };
    }

    const rootIds = rootComments.map(c => c.id);

    if (rootIds.length === 0) return { comments: [], total: 0 };

    const { data: replies } = await supabase
        .from('trip_comments')
        .select(`
            *,
            profiles!trip_comments_user_id_profiles_fkey(full_name, avatar_url),
            comment_likes(user_id)
        `)
        .in('parent_id', rootIds)
        .order('created_at', { ascending: true });

    const allFetched = [...rootComments, ...(replies || [])];

    const processed = allFetched.map((c: any) => ({
        ...c,
        likeCount: c.comment_likes?.length || 0,
        likedByCurrentUser: !!user && c.comment_likes?.some((l: any) => l.user_id === user.id),
        profiles: c.profiles
    }));

    const trees = processed
        .filter(c => !c.parent_id)
        .map(root => ({
            ...root,
            replies: processed.filter(r => r.parent_id === root.id)
        }));

    if (sortBy === 'popular') {
        trees.sort((a, b) => b.likeCount - a.likeCount);
    }

    return { comments: trees, total: 100 };
}


export async function updateActivityPosition(
    activityId: string,
    tripId: string,
    newDayNumber: number,
    newIndex: number
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('activities')
        .update({
            day_number: newDayNumber,
            order_index: newIndex
        })
        .eq('id', activityId)
        .eq('trip_id', tripId);

    if (error) {
        console.error("Error updating activity position:", error);
        throw new Error("Failed to update activity position");
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
}

export async function deleteTrip(tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized", success: false };
    }

    // 1. Verify Ownership
    const { data: trip } = await supabase
        .from("trips")
        .select("user_id")
        .eq("id", tripId)
        .single();

    if (!trip) {
        return { message: "Trip not found", success: false };
    }

    if (trip.user_id !== user.id) {
        return { message: "You are not authorized to delete this trip.", success: false };
    }

    // 2. Delete Trip (Cascading delete handles activities)
    const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", tripId);

    if (error) {
        console.error("Error deleting trip:", error);
        return { message: "Failed to delete trip.", success: false };
    }

    // 3. Revalidate
    revalidatePath("/dashboard");
    return { message: "Trip deleted successfully.", success: true };
}

/**
 * Commit/activate a trip - locks the itinerary and enables travel-mode features
 * Changes status from 'upcoming' to 'active'
 */
export async function commitTrip(tripId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized", success: false };
    }

    // 1. Verify Ownership
    const { data: trip } = await supabase
        .from("trips")
        .select("user_id, status")
        .eq("id", tripId)
        .single();

    if (!trip) {
        return { message: "Trip not found", success: false };
    }

    if (trip.user_id !== user.id) {
        return { message: "You are not authorized to commit this trip.", success: false };
    }

    // Already committed
    if (trip.status === 'active' || trip.status === 'completed') {
        return { message: "Trip is already committed.", success: true };
    }

    // 2. Update status to 'active'
    const { error } = await supabase
        .from("trips")
        .update({ status: 'active' })
        .eq("id", tripId);

    if (error) {
        console.error("Error committing trip:", error);
        return { message: "Failed to commit trip.", success: false };
    }

    // 3. Revalidate
    revalidatePath(`/dashboard/trips/${tripId}`);
    revalidatePath("/dashboard");
    return { message: "Trip committed successfully!", success: true };
}
