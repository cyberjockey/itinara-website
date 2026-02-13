-- Seed distinct Promotional Slides for Local Guides and Vlogger Giveaway
-- 1. Local Guide Registration Slide
INSERT INTO public.promo_carousel_items (title, html_content, css_content, cta_link, is_active, order_index)
VALUES (
    'Local Guide Registration',
    '<div class="promo-container guide-slide">
    <div class="promo-background"></div>
    <div class="standard-margin-wrapper">
        <div class="promo-content-card">
            <div className="badge-wrapper">
                 <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold mb-6 border border-emerald-400/30">
                    <span>🌿</span> Turn Passion Into Income
                 </div>
            </div>
            <h1>Become a <br/>Local Guide</h1>
            <p>Share your hidden gems, create premium itineraries, and earn royalties. Join the community of top-rated Indonesian experts.</p>
            <div class="cta-wrapper">
                <a href="/guides/apply" class="promo-btn primary">Register Now <span>→</span></a>
            </div>
        </div>
    </div>
</div>',
    '/* Guide Slide Styles */
.guide-slide .promo-background {
    background-image: url("/images/local_guide_promo_bg.png");
    background-size: cover;
    background-position: center;
}

.guide-slide .promo-background::after {
    background: linear-gradient(90deg, rgba(6, 78, 59, 0.9) 0%, rgba(6, 78, 59, 0.5) 50%, rgba(6, 78, 59, 0) 100%);
}

.guide-slide h1 {
    background: linear-gradient(to right, #fff, #6ee7b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.guide-slide .promo-btn.primary {
    background: #10b981; /* emerald-500 */
    color: white;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.guide-slide .promo-btn.primary:hover {
    background: #059669; /* emerald-600 */
    transform: translateY(-2px);
}
',
    '/guides/apply',
    true,
    1
);

-- 2. Vlogger Giveaway Slide (Updating existing or inserting new)
INSERT INTO public.promo_carousel_items (title, html_content, css_content, cta_link, is_active, order_index)
VALUES (
    'Vlogger Giveaway Campaign',
    '<div class="promo-container vlogger-giveaway-slide">
    <div class="promo-background"></div>
    <div class="standard-margin-wrapper">
        <div class="promo-content-card">
            <div className="badge-wrapper">
                 <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-400/30">
                    <span>🎬</span> Creator Challenge 2026
                 </div>
            </div>
            <h1>Get 10 Free <br/>VIP Trip Quotas</h1>
            <p>Power up your channel with premium AI itineraries. Join our Creator Program today and claim your free quotas instantly.</p>
            <div class="cta-wrapper">
                <a href="/promotion/vlogger-giveaway" class="promo-btn primary">Claim Free Quotas <span>→</span></a>
            </div>
        </div>
    </div>
</div>',
    '/* Vlogger Giveaway Slide Styles */
.vlogger-giveaway-slide .promo-background {
    background-image: url("/images/vlogger_promo_bg.png");
    background-size: cover;
    background-position: center;
}

.vlogger-giveaway-slide .promo-background::after {
    background: linear-gradient(90deg, rgba(30, 10, 60, 0.9) 0%, rgba(30, 10, 60, 0.5) 50%, rgba(30, 10, 60, 0) 100%);
}

.vlogger-giveaway-slide h1 {
    background: linear-gradient(to right, #fff, #d8b4fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.vlogger-giveaway-slide .promo-btn.primary {
    background: #d946ef; /* fuchsia-500 */
    color: white;
    box-shadow: 0 10px 15px -3px rgba(217, 70, 239, 0.3);
}

.vlogger-giveaway-slide .promo-btn.primary:hover {
    background: #c026d3; /* fuchsia-600 */
    transform: translateY(-2px);
}
',
    '/promotion/vlogger-giveaway',
    true,
    2
);
