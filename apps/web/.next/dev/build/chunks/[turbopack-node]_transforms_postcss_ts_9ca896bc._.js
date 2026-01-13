module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/itinara-website/apps/web/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/itinara-website_a3a8df9d._.js",
  "chunks/[root-of-the-server]__9f4160b9._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/itinara-website/apps/web/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];