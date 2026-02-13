-- Seed a sample Travel Vlogger promotional slide
INSERT INTO public.promo_carousel_items (title, html_content, css_content, cta_link, is_active, order_index)
VALUES (
    'Travel Vlogger Promotion',
    '<div class="promo-container vlogger-slide">
    <div class="promo-background"></div>
    <div class="standard-margin-wrapper">
        <div class="promo-content-card">
            <div className="badge-wrapper">
                 <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-400/30">
                    <span>🎥</span> For Travel Creators
                 </div>
            </div>
            <h1>Get 10 Free <br/>VIP Trip Quotas</h1>
            <p>Power up your content. Join our Creator Program to get 10 free VIP trip quotas. Create and share premium AI itineraries with your audience.</p>
            <div class="cta-wrapper">
                <a href="/promotion/vlogger-giveaway" class="promo-btn primary">Claim Free Quotas <span>→</span></a>
            </div>
        </div>
    </div>
</div>',
    '/* Slide Specific Styles */
.vlogger-slide .promo-background {
    background-image: url("/images/travel_vlogger_bg.png");
    background-size: cover;
    background-position: center;
}

.vlogger-slide .promo-background::after {
    background: linear-gradient(90deg, rgba(30, 10, 60, 0.9) 0%, rgba(30, 10, 60, 0.5) 50%, rgba(30, 10, 60, 0) 100%);
}

.vlogger-slide h1 {
    background: linear-gradient(to right, #fff, #d8b4fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.vlogger-slide .promo-btn.primary {
    background: #a855f7; /* purple-500 */
    color: white;
    box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
}

.vlogger-slide .promo-btn.primary:hover {
    background: #9333ea; /* purple-600 */
    transform: translateY(-2px);
}
',
    '/promotion/vlogger-giveaway',
    true,
    1
);
