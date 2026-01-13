(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Navbar() {
    _s();
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleScroll = {
                "Navbar.useEffect.handleScroll": ()=>{
                    setIsScrolled(window.scrollY > 20);
                }
            }["Navbar.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            return ({
                "Navbar.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].nav, {
                initial: {
                    y: -100
                },
                animate: {
                    y: 0
                },
                className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-3 group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-10 h-10 overflow-hidden rounded-full border-2 border-white/20 group-hover:border-terracotta/50 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/logo.png",
                                        alt: "ITINARA Logo",
                                        fill: true,
                                        className: "object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                        lineNumber: 33,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                    lineNumber: 32,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `font-heading font-bold text-2xl tracking-tight ${isScrolled ? "text-deep-teak" : "text-white"}`,
                                    children: "ITINARA"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                    lineNumber: 40,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 31,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center gap-8",
                            children: [
                                [
                                    "Destinations",
                                    "How it Works",
                                    "Community",
                                    "About"
                                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `#${item.toLowerCase().replace(/\s+/g, '-')}`,
                                        className: `text-sm font-medium transition-colors hover:text-terracotta ${isScrolled ? "text-stone-gray" : "text-white/90"}`,
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                        lineNumber: 48,
                                        columnNumber: 29
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    className: `text-sm font-medium transition-colors hover:text-terracotta mr-2 ${isScrolled ? "text-stone-gray" : "text-white/90"}`,
                                    children: "Log In"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                    lineNumber: 57,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/signup",
                                    className: `px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 ${isScrolled ? "bg-terracotta text-white hover:bg-deep-teak" : "bg-white text-deep-teak hover:bg-white/90"}`,
                                    children: "Start Planning"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                    lineNumber: 63,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 46,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "md:hidden p-2",
                            onClick: ()=>setIsMobileMenuOpen(true),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                className: `w-6 h-6 ${isScrolled ? "text-deep-teak" : "text-white"}`
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                lineNumber: 79,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 75,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        x: "100%"
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    exit: {
                        opacity: 0,
                        x: "100%"
                    },
                    transition: {
                        type: "spring",
                        damping: 25,
                        stiffness: 200
                    },
                    className: "fixed inset-0 z-[60] bg-warm-white flex flex-col justify-center items-center gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsMobileMenuOpen(false),
                            className: "absolute top-6 right-6 p-2 text-deep-teak",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-8 h-8"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                lineNumber: 98,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 94,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-20 h-20 mb-4 rounded-full overflow-hidden border-4 border-terracotta/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo.png",
                                alt: "ITINARA",
                                fill: true,
                                className: "object-cover"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                lineNumber: 102,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 101,
                            columnNumber: 25
                        }, this),
                        [
                            "Destinations",
                            "How it Works",
                            "Community",
                            "About"
                        ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `#${item.toLowerCase().replace(/\s+/g, '-')}`,
                                onClick: ()=>setIsMobileMenuOpen(false),
                                className: "text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors",
                                children: item
                            }, item, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                                lineNumber: 106,
                                columnNumber: 29
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/login",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            className: "text-2xl font-heading font-bold text-deep-teak hover:text-terracotta transition-colors",
                            children: "Log In"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 116,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/signup",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            className: "mt-4 px-8 py-4 rounded-full bg-terracotta text-white font-bold text-lg hover:bg-deep-teak transition-transform active:scale-95",
                            children: "Start Planning"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                            lineNumber: 124,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                    lineNumber: 87,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/itinara-website/apps/web/src/components/layout/Navbar.tsx",
                lineNumber: 85,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(Navbar, "0+zEKVBL95ILuBb5rHE6ViYOHu8=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/itinara-website/apps/web/src/components/landing/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hero",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Hero() {
    _s();
    const { scrollY } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"])();
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(scrollY, [
        0,
        1000
    ], [
        0,
        400
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative h-screen w-full overflow-hidden flex items-center justify-center text-warm-white bg-deep-teak",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                style: {
                    y
                },
                className: "absolute inset-0 z-0 h-[120%] w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hero-bg.png",
                        alt: "Bali Rice Terraces",
                        fill: true,
                        className: "object-cover object-center",
                        priority: true,
                        quality: 90
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 18,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: "w-4 h-4 text-sunrise-gold"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                    lineNumber: 37,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium tracking-wide uppercase",
                                    children: "Every Journey Begins With a Feeling"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                    lineNumber: 38,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                            lineNumber: 36,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8,
                            delay: 0.2
                        },
                        className: "text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight tracking-tight drop-shadow-lg",
                        children: [
                            "Explore Indonesia ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                lineNumber: 48,
                                columnNumber: 39
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sunrise-gold italic font-accent",
                                children: "with intention."
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                lineNumber: 49,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8,
                            delay: 0.4
                        },
                        className: "text-lg md:text-2xl max-w-3xl font-light text-warm-white/90 drop-shadow-md",
                        children: "ITINARA helps you discover the beauty of Indonesia authentically. Curated itineraries that guide without dictating, for travelers who value freedom and depth."
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 30
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.8,
                            delay: 0.6
                        },
                        className: "flex flex-col sm:flex-row gap-4 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "h-14 px-8 rounded-full bg-terracotta hover:bg-deep-teak text-white font-semibold text-lg transition-all shadow-lg hover:scale-105 flex items-center gap-2 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                        lineNumber: 69,
                                        columnNumber: 25
                                    }, this),
                                    "Start Planning"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                lineNumber: 68,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                        lineNumber: 73,
                                        columnNumber: 25
                                    }, this),
                                    "Explore Destinations"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    delay: 1.5,
                    duration: 1
                },
                className: "absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm uppercase tracking-widest font-medium text-[10px]",
                        children: "Scroll to Explore"
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 86,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            y: [
                                0,
                                8,
                                0
                            ]
                        },
                        transition: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                            className: "w-6 h-6"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                            lineNumber: 91,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                        lineNumber: 87,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
                lineNumber: 80,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/itinara-website/apps/web/src/components/landing/Hero.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
_s(Hero, "sZC7D7RRTAF+ZcJsaIkRSEitHwo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HowItWorks",
    ()=>HowItWorks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/map.js [app-client] (ecmascript) <export default as Map>");
"use client";
;
;
;
const steps = [
    {
        id: 1,
        title: "Choose Your Vibe",
        description: "Tell us what you love—whether it's surfing in Uluwatu, hiking Mount Bromo, or culinary tours in Jakarta.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"],
        color: "bg-ocean-turquoise"
    },
    {
        id: 2,
        title: "We Curate",
        description: "Our AI, trained on local insights, builds a personalized itinerary that balances major sights with hidden gems.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"],
        color: "bg-terracotta"
    },
    {
        id: 3,
        title: "Explore Freely",
        description: "Get a day-by-day plan with maps, smart routes, and tips. Change anything, anytime. It's your trip, your rules.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "bg-sunrise-gold"
    }
];
function HowItWorks() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-24 bg-warm-white relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-0 top-0 w-[500px] h-[500px] bg-terracotta rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 bottom-0 w-[500px] h-[500px] bg-ocean-turquoise rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center max-w-2xl mx-auto mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                whileInView: {
                                    opacity: 1,
                                    y: 0
                                },
                                viewport: {
                                    once: true
                                },
                                className: "text-terracotta font-bold tracking-widest uppercase text-sm",
                                children: "Simple Process"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                lineNumber: 41,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h2, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                whileInView: {
                                    opacity: 1,
                                    y: 0
                                },
                                viewport: {
                                    once: true
                                },
                                transition: {
                                    delay: 0.1
                                },
                                className: "text-4xl md:text-5xl font-heading font-bold text-deep-teak mt-3 mb-6",
                                children: "How ITINARA Works"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                lineNumber: 49,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                whileInView: {
                                    opacity: 1,
                                    y: 0
                                },
                                viewport: {
                                    once: true
                                },
                                transition: {
                                    delay: 0.2
                                },
                                className: "text-stone-gray/80 text-lg",
                                children: "Planning a trip to Indonesia doesn't have to be overwhelming. We make it effortless."
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                lineNumber: 58,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-3 gap-8 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[2px] bg-stone-gray/10 z-0"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                lineNumber: 71,
                                columnNumber: 21
                            }, this),
                            steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 30
                                    },
                                    whileInView: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    viewport: {
                                        once: true
                                    },
                                    transition: {
                                        delay: index * 0.2
                                    },
                                    className: "relative z-10 flex flex-col items-center text-center group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-24 h-24 rounded-2xl ${step.color} bg-opacity-10 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-sm`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `absolute inset-0 ${step.color} opacity-10 rounded-2xl`
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(step.icon, {
                                                    className: `w-10 h-10 text-stone-gray`,
                                                    strokeWidth: 1.5
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-deep-teak border border-stone-gray/10",
                                                    children: step.id
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                            lineNumber: 82,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold text-deep-teak mb-3 group-hover:text-terracotta transition-colors",
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                            lineNumber: 92,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-stone-gray leading-relaxed max-w-xs",
                                            children: step.description
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                            lineNumber: 95,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, step.id, true, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                                    lineNumber: 74,
                                    columnNumber: 25
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                        lineNumber: 69,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/itinara-website/apps/web/src/components/landing/HowItWorks.tsx",
        lineNumber: 32,
        columnNumber: 9
    }, this);
}
_c = HowItWorks;
var _c;
__turbopack_context__.k.register(_c, "HowItWorks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DestinationsMap",
    ()=>DestinationsMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/react-simple-maps/dist/index.umd.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$tooltip$2f$dist$2f$react$2d$tooltip$2e$min$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/react-tooltip/dist/react-tooltip.min.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// Lower resolution for lightweight performance but sufficient detail
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
// Updated with real coordinates [longitude, latitude]
const regions = [
    {
        id: "bali",
        name: "Bali",
        coordinates: [
            115.1889,
            -8.4095
        ],
        description: "Island of the Gods. Beaches, temples, and vibrant culture."
    },
    {
        id: "java",
        name: "Java",
        coordinates: [
            110.3695,
            -7.7956
        ],
        description: "The heart of Indonesia. Ancient temples, volcanoes, and bustling cities."
    },
    {
        id: "komodo",
        name: "Komodo",
        coordinates: [
            119.4828,
            -8.5909
        ],
        description: "Home of the dragons. Pink beaches and world-class diving."
    },
    {
        id: "raja-ampat",
        name: "Raja Ampat",
        coordinates: [
            130.5167,
            -0.2333
        ],
        description: "The Last Paradise. Unrivaled marine biodiversity."
    },
    {
        id: "sumatra",
        name: "Sumatra",
        coordinates: [
            101.3431,
            -0.5897
        ],
        description: "Wild jungles, orangutans, and Lake Toba."
    }
];
function DestinationsMap() {
    _s();
    const [activeRegion, setActiveRegion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        coordinates: [
            118,
            -2
        ],
        zoom: 1
    });
    const handleZoomIn = ()=>{
        if (position.zoom >= 4) return;
        setPosition((pos)=>({
                ...pos,
                zoom: pos.zoom * 1.2
            }));
    };
    const handleZoomOut = ()=>{
        if (position.zoom <= 1) return;
        setPosition((pos)=>({
                ...pos,
                zoom: pos.zoom / 1.2
            }));
    };
    const handleReset = ()=>{
        setPosition({
            coordinates: [
                118,
                -2
            ],
            zoom: 1
        });
        setActiveRegion(null);
    };
    const handleRegionClick = (region)=>{
        setActiveRegion(region);
        setPosition({
            coordinates: region.coordinates,
            zoom: 2.5
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-24 bg-light-sand relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-turquoise/10 text-ocean-turquoise text-sm font-bold mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                    lineNumber: 81,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Discover Destinations"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                    lineNumber: 82,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 75,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h2, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                delay: 0.1
                            },
                            className: "text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4",
                            children: "Explore the Archipelago"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 84,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                delay: 0.2
                            },
                            className: "text-stone-gray/80 text-lg max-w-2xl mx-auto",
                            children: "From the jungles of Sumatra to the reefs of Raja Ampat, discover the diversity of over 17,000 islands."
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                    lineNumber: 74,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.95
                    },
                    whileInView: {
                        opacity: 1,
                        scale: 1
                    },
                    viewport: {
                        once: true
                    },
                    transition: {
                        duration: 0.8
                    },
                    className: "relative w-full aspect-[16/9] md:aspect-[2.2/1] bg-gradient-to-b from-ocean-turquoise/5 to-white/50 rounded-3xl overflow-hidden border border-ocean-turquoise/20 flex items-center justify-center shadow-inner group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-10 right-10 w-32 h-32 bg-ocean-turquoise/5 rounded-full blur-3xl"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-10 left-10 w-48 h-48 bg-terracotta/5 rounded-full blur-3xl"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 114,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-6 right-6 flex flex-col gap-2 z-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleZoomIn,
                                    className: "p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 122,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                    lineNumber: 118,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleZoomOut,
                                    className: "p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 128,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                    lineNumber: 124,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleReset,
                                    className: "p-2 bg-white rounded-lg shadow-md hover:bg-stone-50 text-deep-teak transition-colors",
                                    title: "Reset View",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 135,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                    lineNumber: 130,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 117,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposableMap"], {
                            projection: "geoMercator",
                            projectionConfig: {
                                scale: 2000
                            },
                            className: "w-full h-full z-10 transition-transform duration-700 ease-in-out",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZoomableGroup"], {
                                zoom: position.zoom,
                                center: position.coordinates,
                                onMoveEnd: (position)=>setPosition(position),
                                maxZoom: 5,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Geographies"], {
                                        geography: geoUrl,
                                        children: ({ geographies })=>geographies.filter((geo)=>geo.properties.name === "Indonesia" || geo.id === "360").map((geo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Geography"], {
                                                    geography: geo,
                                                    fill: "#C7B299",
                                                    stroke: "#FFF",
                                                    strokeWidth: 0.5,
                                                    style: {
                                                        default: {
                                                            fill: "#D4654F",
                                                            outline: "none",
                                                            transition: "all 0.5s ease"
                                                        },
                                                        hover: {
                                                            fill: "#8B4513",
                                                            outline: "none",
                                                            cursor: "pointer"
                                                        },
                                                        pressed: {
                                                            fill: "#8B4513",
                                                            outline: "none"
                                                        }
                                                    }
                                                }, geo.rsmKey, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 45
                                                }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 154,
                                        columnNumber: 29
                                    }, this),
                                    regions.map((region)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                                            coordinates: region.coordinates,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    handleRegionClick(region);
                                                },
                                                onMouseEnter: ()=>setActiveRegion(region),
                                                className: "cursor-pointer group",
                                                "data-tooltip-id": "region-tooltip",
                                                "data-tooltip-content": region.name,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        r: 8 / position.zoom,
                                                        fill: "#F4A460",
                                                        opacity: 0.4,
                                                        className: "group-hover:opacity-80 transition-opacity duration-300"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        r: 6 / position.zoom,
                                                        fill: "rgba(244, 164, 96, 0.8)",
                                                        stroke: "#FFF",
                                                        strokeWidth: 1,
                                                        className: "group-hover:scale-110 transition-transform duration-300 ease-out"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        r: 3 / position.zoom,
                                                        fill: "#8B4513"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                lineNumber: 177,
                                                columnNumber: 37
                                            }, this)
                                        }, region.id, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                            lineNumber: 176,
                                            columnNumber: 33
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                lineNumber: 146,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 139,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$react$2d$tooltip$2f$dist$2f$react$2d$tooltip$2e$min$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            id: "region-tooltip",
                            style: {
                                backgroundColor: "#8B4513",
                                color: "#FFF",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                fontSize: "12px"
                            },
                            border: "1px solid rgba(255,255,255,0.2)"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 198,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: activeRegion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.95
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1
                                },
                                exit: {
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95
                                },
                                transition: {
                                    duration: 0.3
                                },
                                className: "absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6 border border-stone-gray/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xl font-bold font-heading text-deep-teak",
                                                children: activeRegion.name
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                lineNumber: 216,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 bg-terracotta/10 rounded-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    className: "w-5 h-5 text-terracotta"
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                lineNumber: 217,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 215,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-stone-gray leading-relaxed mb-6",
                                        children: activeRegion.description
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 222,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "flex-1 py-3 bg-deep-teak text-white rounded-xl font-bold text-sm tracking-wide hover:bg-terracotta transition-colors flex items-center justify-center gap-2 group",
                                                children: [
                                                    "Explore ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                        className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                lineNumber: 226,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleReset,
                                                className: "px-4 py-3 bg-stone-gray/10 text-stone-gray rounded-xl font-bold text-sm hover:bg-stone-gray/20 transition-colors",
                                                title: "Close & Reset Map",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                                lineNumber: 229,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                        lineNumber: 225,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, activeRegion.id, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                                lineNumber: 207,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                            lineNumber: 205,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
                    lineNumber: 105,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
            lineNumber: 73,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/itinara-website/apps/web/src/components/landing/DestinationsMap.tsx",
        lineNumber: 72,
        columnNumber: 9
    }, this);
}
_s(DestinationsMap, "av7IvAMN0TbWHwTafOJu8pi1gYw=");
_c = DestinationsMap;
var _c;
__turbopack_context__.k.register(_c, "DestinationsMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeaturesGrid",
    ()=>FeaturesGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
"use client";
;
;
;
function FeaturesGrid() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-24 bg-warm-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4",
                            children: "Why Choose ITINARA?"
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 11,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-stone-gray/80 text-lg max-w-2xl mx-auto",
                            children: "We fuse advanced AI with local expertise to give you a travel experience like no other."
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 14,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                    lineNumber: 10,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[600px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-terracotta to-deep-teak rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 28,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative z-10 h-full flex flex-col justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                        className: "w-6 h-6 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                        lineNumber: 32,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                    lineNumber: 31,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-3xl font-bold mb-4 font-heading",
                                                    children: "AI-Powered Curation"
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                    lineNumber: 34,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/80 text-lg leading-relaxed",
                                                    children: "Input your travel style, budget, and interests. Our AI instantly generates a tailor-made itinerary that feels handcrafted by a local expert."
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                    lineNumber: 35,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                            lineNumber: 30,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm mt-8 translate-y-4 group-hover:translate-y-2 transition-transform duration-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-2 w-1/3 bg-white/40 rounded-full mb-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                    lineNumber: 41,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-10 w-full bg-white/20 rounded-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                            lineNumber: 43,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-10 w-full bg-white/20 rounded-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                            lineNumber: 44,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                    lineNumber: 42,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                            lineNumber: 40,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 29,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 22,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                delay: 0.1
                            },
                            className: "md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-stone-gray/10 relative overflow-hidden group hover:shadow-md transition-shadow",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row gap-6 items-start md:items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 bg-ocean-turquoise/10 rounded-xl flex items-center justify-center text-ocean-turquoise shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                            lineNumber: 60,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                        lineNumber: 59,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-deep-teak mb-2",
                                                children: "Expert Local Insights"
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                lineNumber: 63,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-stone-gray text-sm",
                                                children: "Access hidden gems and authentic experiences recommended by our network of local experts."
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                lineNumber: 64,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                        lineNumber: 62,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                lineNumber: 58,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 51,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                delay: 0.2
                            },
                            className: "bg-rice-paddy-green/20 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-rice-paddy-green/30 transition-colors cursor-default",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                    className: "w-8 h-8 text-deep-teak mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 79,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-deep-teak mb-1",
                                    children: "100% Offline"
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-stone-gray",
                                    children: "Access maps & tickets anywhere."
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 81,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: true
                            },
                            transition: {
                                delay: 0.3
                            },
                            className: "md:row-span-1 bg-white rounded-3xl p-6 shadow-sm border border-stone-gray/10 flex flex-col justify-center group hover:border-terracotta/30 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-full bg-sunrise-gold/20 flex items-center justify-center text-deep-teak",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                                lineNumber: 94,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                            lineNumber: 93,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-deep-teak",
                                            children: "Cultural Wisdom"
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                            lineNumber: 96,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 92,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-stone-gray",
                                    children: "Local etiquette, dress codes, and customs included for every destination."
                                }, void 0, false, {
                                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                                    lineNumber: 98,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                            lineNumber: 85,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
                    lineNumber: 19,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
            lineNumber: 9,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/itinara-website/apps/web/src/components/landing/FeaturesGrid.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
_c = FeaturesGrid;
var _c;
__turbopack_context__.k.register(_c, "FeaturesGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Testimonials",
    ()=>Testimonials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/itinara-website/apps/web/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        origin: "United Kingdom",
        text: "I wanted to see the real Bali, not just the tourist traps. ITINARA guided me to a local family for a cooking class I'll never forget.",
        trip: "2-week Bali & Lombok",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        name: "Marcus Thorne",
        origin: "Australia",
        text: "The AI suggestions were spot on. It found surf spots in Sumba that weren't on any blog. The offline maps saved us multiple times!",
        trip: "10-day Sumba Surf Trip",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        origin: "Spain",
        text: "Planning a honeymoon was stressful until we found ITINARA. The romantic dinner recommendations were absolutely perfect.",
        trip: "Luxury Java & Bali",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
];
function Testimonials() {
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isPaused, setIsPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Testimonials.useEffect": ()=>{
            if (isPaused) return;
            const interval = setInterval({
                "Testimonials.useEffect.interval": ()=>{
                    setCurrentIndex({
                        "Testimonials.useEffect.interval": (prev)=>(prev + 1) % testimonials.length
                    }["Testimonials.useEffect.interval"]);
                }
            }["Testimonials.useEffect.interval"], 5000);
            return ({
                "Testimonials.useEffect": ()=>clearInterval(interval)
            })["Testimonials.useEffect"];
        }
    }["Testimonials.useEffect"], [
        isPaused
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-24 bg-light-sand overflow-hidden relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                className: "absolute top-12 left-8 w-40 h-40 text-terracotta/5 rotate-12 z-0"
            }, void 0, false, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                lineNumber: 55,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 relative z-10 max-w-4xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-terracotta transform uppercase tracking-widest text-sm font-bold",
                                children: "Community Stories"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                lineNumber: 59,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-4xl font-heading font-bold text-deep-teak mt-2",
                                children: "Loved by Travelers"
                            }, void 0, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                lineNumber: 60,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative min-h-[300px]",
                        onMouseEnter: ()=>setIsPaused(true),
                        onMouseLeave: ()=>setIsPaused(false),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    x: 20
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: -20
                                },
                                transition: {
                                    duration: 0.5
                                },
                                className: "bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-gray/5 text-center flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-20 h-20 mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: testimonials[currentIndex].image,
                                            alt: testimonials[currentIndex].name,
                                            fill: true,
                                            className: "object-cover rounded-full border-4 border-warm-white shadow-md"
                                        }, void 0, false, {
                                            fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                            lineNumber: 80,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                        lineNumber: 79,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1 mb-6 text-sunrise-gold",
                                        children: [
                                            ...Array(5)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "w-5 h-5 fill-current"
                                            }, i, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                                lineNumber: 90,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                        lineNumber: 88,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                        className: "text-xl md:text-2xl font-accent italic text-stone-gray mb-6 leading-relaxed",
                                        children: [
                                            '"',
                                            testimonials[currentIndex].text,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                        lineNumber: 94,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-deep-teak text-lg",
                                                children: testimonials[currentIndex].name
                                            }, void 0, false, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                                lineNumber: 99,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-stone-gray/60 text-sm mt-1",
                                                children: [
                                                    testimonials[currentIndex].origin,
                                                    " • ",
                                                    testimonials[currentIndex].trip
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                                lineNumber: 100,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                        lineNumber: 98,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, currentIndex, true, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                lineNumber: 71,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                            lineNumber: 70,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-3 mt-8",
                        children: testimonials.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$itinara$2d$website$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentIndex(index),
                                className: `h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-terracotta" : "w-2 bg-stone-gray/20 hover:bg-terracotta/50"}`,
                                "aria-label": `Go to testimonial ${index + 1}`
                            }, index, false, {
                                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                                lineNumber: 109,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                        lineNumber: 107,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
                lineNumber: 57,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/itinara-website/apps/web/src/components/landing/Testimonials.tsx",
        lineNumber: 53,
        columnNumber: 9
    }, this);
}
_s(Testimonials, "tBAQciKvCchUTDGnHclMGmg/DYY=");
_c = Testimonials;
var _c;
__turbopack_context__.k.register(_c, "Testimonials");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=itinara-website_apps_web_src_components_2adb559a._.js.map