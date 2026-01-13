module.exports = [
"[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://tnlttmhhatpmvzhhrpyp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubHR0bWhoYXRwbXZ6aGhycHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMTQ0NjgsImV4cCI6MjA4Mzc5MDQ2OH0.sb6Ap1mYXhvnIztQm6ECLq5z7we8CI4PEzuggzcOu3M"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"408604574426c96d292f85fb042d5c9fb987e7a1ec":"toggleLike","601a4c167d31abad0e5f682883ec6c5488bb53e50c":"deleteComment","606e1dcf9bfb42c477d60a0e8e46336aa4a5acf4eb":"toggleCommentLike","60a96496461265f5abdd6e532920c17caf3c1dee75":"toggleTripVisibility","706f6dc43a0c471049bb24dd23ef4186370a9c2dbc":"editComment","70d99a0ab01257958a57f5a24698a70e65b5b3523a":"addComment","78634308f1a3b5c4825c6ebfce14fa62180b9634be":"fetchComments"},"",""] */ __turbopack_context__.s([
    "addComment",
    ()=>addComment,
    "deleteComment",
    ()=>deleteComment,
    "editComment",
    ()=>editComment,
    "fetchComments",
    ()=>fetchComments,
    "toggleCommentLike",
    ()=>toggleCommentLike,
    "toggleLike",
    ()=>toggleLike,
    "toggleTripVisibility",
    ()=>toggleTripVisibility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function toggleTripVisibility(tripId, isPublic) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    const { error } = await supabase.from('trips').update({
        is_public: isPublic
    }).eq('id', tripId).eq('user_id', user.id);
    if (error) {
        console.error("Error updating trip visibility:", error);
        throw new Error("Failed to update visibility");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/community');
}
async function toggleLike(tripId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    // Check if already liked
    const { data: existingLike } = await supabase.from('trip_likes').select('*').eq('user_id', user.id).eq('trip_id', tripId).single();
    if (existingLike) {
        // Unlike
        await supabase.from('trip_likes').delete().eq('user_id', user.id).eq('trip_id', tripId);
    } else {
        // Like
        await supabase.from('trip_likes').insert({
            user_id: user.id,
            trip_id: tripId
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/community');
}
async function addComment(tripId, content, parentId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const payload = {
        user_id: user.id,
        trip_id: tripId,
        content: content
    };
    if (parentId) {
        payload.parent_id = parentId;
    }
    const { error } = await supabase.from('trip_comments').insert(payload);
    if (error) {
        console.error("Comment error:", error);
        throw new Error("Failed to post comment");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
}
async function editComment(commentId, newContent, tripId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { error } = await supabase.from('trip_comments').update({
        content: newContent,
        updated_at: new Date().toISOString()
    }).eq('id', commentId).eq('user_id', user.id); // Security: only update own
    if (error) throw new Error("Failed to edit comment");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
}
async function deleteComment(commentId, tripId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    // RLS ensures they can only delete their own
    await supabase.from('trip_comments').delete().eq('id', commentId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
}
async function toggleCommentLike(commentId, tripId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: existing } = await supabase.from('comment_likes').select('*').eq('user_id', user.id).eq('comment_id', commentId).single();
    if (existing) {
        await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId);
    } else {
        await supabase.from('comment_likes').insert({
            user_id: user.id,
            comment_id: commentId
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
}
async function fetchComments(tripId, offset = 0, limit = 3, sortBy = 'recent') {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    // Query builder
    let query = supabase.from('trip_comments').select(`
            *,
            profiles!trip_comments_user_id_profiles_fkey(full_name, avatar_url),
            comment_likes(user_id)
        `).eq('trip_id', tripId).is('parent_id', null) // Only fetch root comments for pagination
    .range(offset, offset + limit - 1);
    if (sortBy === 'recent') {
        query = query.order('created_at', {
            ascending: false
        });
    } else {
        query = query.order('created_at', {
            ascending: false
        });
    }
    const { data: rootComments, error } = await query;
    if (error) {
        console.error("Fetch comments error:", error);
        return {
            comments: [],
            total: 0
        };
    }
    const rootIds = rootComments.map((c)=>c.id);
    if (rootIds.length === 0) return {
        comments: [],
        total: 0
    };
    const { data: replies } = await supabase.from('trip_comments').select(`
            *,
            profiles!trip_comments_user_id_profiles_fkey(full_name, avatar_url),
            comment_likes(user_id)
        `).in('parent_id', rootIds).order('created_at', {
        ascending: true
    });
    const allFetched = [
        ...rootComments,
        ...replies || []
    ];
    const processed = allFetched.map((c)=>({
            ...c,
            likeCount: c.comment_likes?.length || 0,
            likedByCurrentUser: !!user && c.comment_likes?.some((l)=>l.user_id === user.id),
            profiles: c.profiles
        }));
    const trees = processed.filter((c)=>!c.parent_id).map((root)=>({
            ...root,
            replies: processed.filter((r)=>r.parent_id === root.id)
        }));
    if (sortBy === 'popular') {
        trees.sort((a, b)=>b.likeCount - a.likeCount);
    }
    return {
        comments: trees,
        total: 100
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    toggleTripVisibility,
    toggleLike,
    addComment,
    editComment,
    deleteComment,
    toggleCommentLike,
    fetchComments
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleTripVisibility, "60a96496461265f5abdd6e532920c17caf3c1dee75", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleLike, "408604574426c96d292f85fb042d5c9fb987e7a1ec", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addComment, "70d99a0ab01257958a57f5a24698a70e65b5b3523a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(editComment, "706f6dc43a0c471049bb24dd23ef4186370a9c2dbc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteComment, "601a4c167d31abad0e5f682883ec6c5488bb53e50c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleCommentLike, "606e1dcf9bfb42c477d60a0e8e46336aa4a5acf4eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchComments, "78634308f1a3b5c4825c6ebfce14fa62180b9634be", null);
}),
"[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60455fdc2147b9b0b3f13f69f6d92afd5f07881df6":"createActivity"},"",""] */ __turbopack_context__.s([
    "createActivity",
    ()=>createActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createActivity(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const tripId = formData.get("tripId");
    const dayNumber = parseInt(formData.get("dayNumber"));
    const title = formData.get("title");
    const startTime = formData.get("startTime"); // Optional
    const location = formData.get("location"); // Optional
    const notes = formData.get("notes"); // Optional
    const category = formData.get("category"); // Optional
    // Basic validation
    if (!tripId || !title || !dayNumber) {
        return {
            message: "Missing required fields."
        };
    }
    const { error } = await supabase.from("activities").insert({
        trip_id: tripId,
        day_number: dayNumber,
        title,
        start_time: startTime || null,
        location: location || null,
        category: category || "other",
        notes: notes || null
    });
    if (error) {
        console.error("Error creating activity:", error);
        return {
            message: "Failed to create activity. Please try again."
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/trips/${tripId}`);
    return {
        message: "success"
    }; // Signal success to client
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createActivity
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createActivity, "60455fdc2147b9b0b3f13f69f6d92afd5f07881df6", null);
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f5b$id$5d2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "408604574426c96d292f85fb042d5c9fb987e7a1ec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleLike"],
    "601a4c167d31abad0e5f682883ec6c5488bb53e50c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteComment"],
    "60455fdc2147b9b0b3f13f69f6d92afd5f07881df6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f5b$id$5d2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createActivity"],
    "606e1dcf9bfb42c477d60a0e8e46336aa4a5acf4eb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleCommentLike"],
    "60a96496461265f5abdd6e532920c17caf3c1dee75",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleTripVisibility"],
    "706f6dc43a0c471049bb24dd23ef4186370a9c2dbc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["editComment"],
    "70d99a0ab01257958a57f5a24698a70e65b5b3523a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addComment"],
    "78634308f1a3b5c4825c6ebfce14fa62180b9634be",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchComments"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$trips$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f5b$id$5d2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f5b$id$5d2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/[id]/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=itinara-website_apps_web_099a179b._.js.map