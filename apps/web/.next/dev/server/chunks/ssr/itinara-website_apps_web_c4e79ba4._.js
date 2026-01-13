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
"[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4095b4fbeca32d022222cd484c1e78af298329f327":"toggleSaveDestination"},"",""] */ __turbopack_context__.s([
    "toggleSaveDestination",
    ()=>toggleSaveDestination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function toggleSaveDestination(destinationId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            message: "Unauthorized"
        };
    }
    // Check if already saved
    const { data: existing } = await supabase.from('saved_destinations').select('*').eq('user_id', user.id).eq('destination_id', destinationId).single();
    if (existing) {
        // Unsave
        await supabase.from('saved_destinations').delete().eq('user_id', user.id).eq('destination_id', destinationId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/explore');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/saved');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/explore/${destinationId}`);
        return {
            message: "unsaved"
        };
    } else {
        // Save
        await supabase.from('saved_destinations').insert({
            user_id: user.id,
            destination_id: destinationId
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/explore');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard/saved');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/explore/${destinationId}`);
        return {
            message: "saved"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    toggleSaveDestination
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleSaveDestination, "4095b4fbeca32d022222cd484c1e78af298329f327", null);
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/saved/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$explore$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/saved/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4095b4fbeca32d022222cd484c1e78af298329f327",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$explore$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleSaveDestination"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$saved$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$explore$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/saved/page/actions.js { ACTIONS_MODULE0 => "[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$explore$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/explore/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=itinara-website_apps_web_c4e79ba4._.js.map