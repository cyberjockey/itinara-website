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
"[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40bbc1c35eda05fd7353aab58f4963da9e1b8cb492":"createTripFromAI","60e230bd440c76455bb51754150550cdc04dde5fa2":"createTrip"},"",""] */ __turbopack_context__.s([
    "createTrip",
    ()=>createTrip,
    "createTripFromAI",
    ()=>createTripFromAI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function createTrip(prevState, formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            message: "You must be logged in to create a trip."
        };
    }
    const title = formData.get("title");
    const destination = formData.get("destination");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    // Ensure profile exists (in case trigger missed it or user pre-dated schema)
    const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        // We can try to grab metadata if available, or just leave other fields null
        full_name: user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() : user.email?.split('@')[0],
        email: user.email
    }, {
        onConflict: 'id'
    }).select().single();
    if (profileError && profileError.code !== 'PGRST116') {
        // Ignore "JSON object requested, multiple (or no) rows returned" if using .single() on upsert sometimes
        console.warn("Could not ensure profile exists:", profileError);
    }
    const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        status: "upcoming"
    });
    if (error) {
        console.error("Error creating trip:", error);
        return {
            message: "Failed to create trip. Please try again."
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
}
async function createTripFromAI(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    const jsonString = formData.get("itinerary");
    const itinerary = JSON.parse(jsonString);
    // 1. Create Trip
    const today = new Date();
    // Default to a trip starting next Monday
    const startDate = new Date(today.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + itinerary.days.length - 1);
    // Note: 'image_url' is not in the schema yet, omitting it to prevent errors.
    const { data: trip, error: tripError } = await supabase.from('trips').insert({
        user_id: user.id,
        title: itinerary.title,
        destination: "Derived from AI",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'upcoming'
    }).select().single();
    if (tripError || !trip) {
        console.error("Trip Creation Error", tripError);
        throw new Error("Failed to create trip");
    }
    // 2. Create Activities
    for (const day of itinerary.days){
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + (day.day_number - 1));
        const dateStr = dayDate.toISOString().split('T')[0];
        // activities table has: trip_id, day_number, start_time, title, location, category, notes
        const activitiesToInsert = day.activities.map((act)=>({
                trip_id: trip.id,
                day_number: day.day_number,
                title: act.title,
                location: act.location,
                notes: act.description,
                start_time: act.time,
                category: 'sightseeing' // Default category
            }));
        if (activitiesToInsert.length > 0) {
            const { error: actError } = await supabase.from('activities').insert(activitiesToInsert);
            if (actError) {
                console.error("Activity Insert Error", actError);
            // We continue inserting other days even if one fails, or we could throw.
            }
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/dashboard/trips/${trip.id}`);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createTrip,
    createTripFromAI
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTrip, "60e230bd440c76455bb51754150550cdc04dde5fa2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTripFromAI, "40bbc1c35eda05fd7353aab58f4963da9e1b8cb492", null);
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$new$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40bbc1c35eda05fd7353aab58f4963da9e1b8cb492",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$new$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTripFromAI"],
    "60e230bd440c76455bb51754150550cdc04dde5fa2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$new$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTrip"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$trips$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$new$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/itinara-website/apps/web/.next-internal/server/app/dashboard/trips/new/page/actions.js { ACTIONS_MODULE0 => "[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$app$2f$dashboard$2f$trips$2f$new$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/trips/new/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=itinara-website_apps_web_f2c6b624._.js.map