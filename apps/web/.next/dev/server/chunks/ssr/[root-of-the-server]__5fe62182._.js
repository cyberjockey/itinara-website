module.exports = [
"[project]/itinara-website/apps/web/src/app/favicon.ico.mjs { IMAGE => \"[project]/itinara-website/apps/web/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/itinara-website/apps/web/src/app/favicon.ico.mjs { IMAGE => \"[project]/itinara-website/apps/web/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/itinara-website/apps/web/src/app/icon.png.mjs { IMAGE => \"[project]/itinara-website/apps/web/src/app/icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/itinara-website/apps/web/src/app/icon.png.mjs { IMAGE => \"[project]/itinara-website/apps/web/src/app/icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/itinara-website/apps/web/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/itinara-website/apps/web/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/itinara-website/apps/web/src/app/dashboard/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/layout.tsx [app-rsc] (ecmascript)"));
}),
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
"[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommunityPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/globe.js [app-rsc] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/calendar.js [app-rsc] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-rsc] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/date-fns/format.js [app-rsc] (ecmascript) <locals>");
;
;
;
;
;
;
;
async function CommunityPage() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Fetch User for likes
    const { data: { user } } = await supabase.auth.getUser();
    // Fetch public trips with profiles and like count
    // specific count syntax might vary, usually logic is needed or verify if Supabase supports foreign count in select like this
    // Simple approach: Fetch raw then client side or use RPC. 
    // Standard Supabase JS: .select('*, trip_likes(count)') returns an array of objects if not careful, or count. 
    // Let's stick to simple linking first to solve the user's immediate confusion, and add LikeButton if possible.
    const { data: trips, error: tripsError } = await supabase.from('trips').select('*, profiles!trips_user_id_fkey(full_name, avatar_url)').eq('is_public', true).eq('status', 'upcoming') // Or any status
    .order('created_at', {
        ascending: false
    });
    if (tripsError) {
        console.error("Community Fetch Error:", tripsError);
    }
    // Fetch user likes to show "red heart" state
    let likedTripIds = new Set();
    if (user) {
        const { data: userLikes } = await supabase.from('trip_likes').select('trip_id').eq('user_id', user.id);
        userLikes?.forEach((l)=>likedTripIds.add(l.trip_id));
    }
    // Fetch like counts (separate query to avoid complex joins if count not easy)
    // Actually, let's just let the Detail page handle the heavy lifting for now to be safe, 
    // BUT user wants to know where to like. 
    // I will wrap the card in a Link so they can GET to the detail page.
    // I will adds a visual "Like" icon with count if I can, or just the Link first.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mb-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-block p-3 rounded-full bg-rice-paddy-green/10 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                            className: "w-8 h-8 text-rice-paddy-green"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-heading font-bold text-deep-teak mb-4",
                        children: "Discover Community Trips"
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-stone-gray text-lg max-w-2xl mx-auto",
                        children: "Explore itineraries crafted by fellow travelers. Click on a card to view details, like, and comment."
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 max-w-md mx-auto relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search destinations...",
                                className: "w-full pl-12 pr-4 py-3 rounded-full border border-stone-gray/20 focus:border-deep-teak focus:ring-1 focus:ring-deep-teak outline-none shadow-sm text-black placeholder:text-stone-gray/50"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                lineNumber: 62,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this),
            trips && trips.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                children: trips.map((trip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: `/dashboard/trips/${trip.id}`,
                        className: "block bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-md transition-all hover:-translate-y-1 group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-48 w-full overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        src: trip.image_url || "/images/hero-bg.png",
                                        alt: trip.title,
                                        fill: true,
                                        className: "object-cover transition-transform duration-700 group-hover:scale-105"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-4 left-4 right-4 flex justify-between items-end text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 41
                                                }, this),
                                                " ",
                                                trip.destination
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                            lineNumber: 88,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                lineNumber: 79,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-deep-teak mb-2 line-clamp-1 group-hover:text-terracotta transition-colors",
                                        children: trip.title
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-sm text-stone-gray mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                className: "w-4 h-4 mr-2 text-terracotta"
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                lineNumber: 99,
                                                columnNumber: 37
                                            }, this),
                                            trip.start_date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(trip.start_date), "MMM d") : "TBD",
                                            trip.end_date && ` - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(trip.end_date), "MMM d")}`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between pt-4 border-t border-stone-gray/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 rounded-full bg-stone-gray/10 overflow-hidden",
                                                        children: trip.profiles?.avatar_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                            src: trip.profiles.avatar_url,
                                                            alt: "Avatar",
                                                            width: 32,
                                                            height: 32
                                                        }, void 0, false, {
                                                            fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 49
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full h-full flex items-center justify-center text-xs font-bold text-stone-gray",
                                                            children: trip.profiles?.full_name?.[0] || "?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                        lineNumber: 107,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium text-deep-teak",
                                                        children: trip.profiles?.full_name || "Unknown Traveler"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-1 rounded-full",
                                                children: "View Trip"
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                                lineNumber: 95,
                                columnNumber: 29
                            }, this)
                        ]
                    }, trip.id, true, {
                        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                        lineNumber: 73,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                lineNumber: 71,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 bg-white rounded-3xl border border-dashed border-stone-gray/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-stone-gray",
                    children: "No public trips found yet. Be the first to publish one!"
                }, void 0, false, {
                    fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                    lineNumber: 130,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
                lineNumber: 129,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx",
        lineNumber: 49,
        columnNumber: 9
    }, this);
}
}),
"[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/itinara-website/apps/web/src/app/dashboard/community/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5fe62182._.js.map