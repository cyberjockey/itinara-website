-- Seed CMS entry for Focused CNY Promo (Replaces previous version)
INSERT INTO public.landing_pages (slug, title, meta_title, meta_description, status, content)
VALUES (
    'cny',
    'Chinese New Year Campaign 2026',
    'Chinese New Year 2026 Specials - Itinara',
    'Celebrate the Year of the Snake with exclusive travel deals. Get 30% OFF VIP plans.',
    'published',
    '[
        {
            "type": "raw_html",
            "data": {
                "html": "<div class=\"min-h-screen text-white overflow-hidden relative font-sans\" style=\"background-color: #A31621\"><div class=\"absolute inset-0\" style=\"background-image: url(&#39;/images/cny_snake_banner.png&#39;); background-size: cover; background-position: center; opacity: 0.3;\"></div><div class=\"absolute inset-0\" style=\"background: linear-gradient(to bottom, rgba(163, 22, 33, 0.9), rgba(163, 22, 33, 0.8), #A31621);\"></div><div class=\"relative z-10 container mx-auto px-4 pt-32 pb-20 text-center\"><div class=\"inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-full text-sm font-semibold mb-6 border border-yellow-400/30\"><span>✨</span> Happy Chinese New Year 2026</div><h1 class=\"text-5xl md:text-7xl font-bold mb-6 tracking-tight text-[#FDF4E3]\">Explore Indonesia <br /><span class=\"text-yellow-400\">Prosper & Travel</span></h1><p class=\"text-xl text-yellow-100 max-w-2xl mx-auto mb-16\">Celebrate the Year of the Snake with exclusive travel deals. Uncover hidden gems in Bali, Java, and beyond.</p><div class=\"max-w-md mx-auto bg-red-900/30 backdrop-blur-md border border-red-700 p-8 rounded-3xl relative overflow-hidden shadow-2xl\"><div class=\"absolute top-0 right-0 p-4 opacity-10\"><span class=\"text-9xl text-yellow-500 transform rotate-12 block\">⭐</span></div><div class=\"relative z-10\"><h3 class=\"text-2xl font-bold text-yellow-400 mb-2\">Limited Time Offer</h3><div class=\"text-5xl font-bold text-white mb-6\">30% OFF <span class=\"text-2xl text-red-200 block\">VIP Plans</span></div><div class=\"bg-red-950/30 rounded-xl p-4 mb-8 border border-red-800/50\"><p class=\"text-red-200 text-sm mb-2\">Use code at checkout:</p><div class=\"flex items-center justify-center gap-3\"><code class=\"font-mono text-3xl font-bold text-yellow-400 tracking-wider\">CNY30</code><button onclick=\"navigator.clipboard.writeText(&#39;CNY30&#39;); this.innerHTML = &#39;Copied!&#39;; setTimeout(() =&gt; this.innerHTML = &#39;Copy&#39;, 2000);\" class=\"px-3 py-1 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-xs font-bold rounded-lg transition border border-yellow-400/30 cursor-pointer\">Copy</button></div></div><a href=\"/auth/register\" class=\"block w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 font-bold rounded-xl text-xl hover:from-yellow-300 hover:to-yellow-400 transition shadow-lg shadow-yellow-400/20 transform hover:-translate-y-1\">Claim Offer Now</a><p class=\"mt-4 text-xs text-red-300\">New users only. Valid until Feb 15th.</p></div></div></div></div>"
            }
        }
    ]'::jsonb
)
ON CONFLICT (slug) 
DO UPDATE SET 
    content = EXCLUDED.content,
    title = EXCLUDED.title,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;
