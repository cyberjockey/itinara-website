-- Update CNY Content to "Year of the Fire Horse"
-- Includes updates for both Landing Page and Carousel

-- 1. Update Landing Page (slug='cny')
-- Replaces "Snake" with "Fire Horse" and updates the banner image.
UPDATE public.landing_pages
SET 
  title = 'Chinese New Year Campaign 2026 - Fire Horse',
  meta_description = 'Celebrate the Year of the Fire Horse with exclusive travel deals. Get 30% OFF VIP plans.',
  content = jsonb_set(
    content, 
    '{0, data, html}', 
    to_jsonb(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    content->0->'data'->>'html', 
                    'Year of the Snake', 
                    'Year of the Fire Horse'
                  ),
                  'cny_snake_banner.png',
                  'cny_fire_horse_square.jpeg'
                ),
                'cny_fire_horse_banner.png', 
                'cny_fire_horse_square.jpeg'
              ),
              'bg-gradient-to-b from-[#A31621]/90 via-[#A31621]/80', 
              'bg-black/40'
            ),
            'bg-gradient-to-b from-[#A31621]/30 via-[#A31621]/30', 
            'bg-black/40'
          ),
          'bg-[#A31621]', 
          'bg-neutral-900'
        ),
        'opacity: 0.2;', 
        'opacity: 1;'
      )
    )
  )
WHERE slug = 'cny';

-- 2. Update Carousel Item
-- Updates the CNY slide with the new design provided, adapted for Fire Horse.
-- We target the slide that likely contains "Chinese New Year" or "Snake" in the title or content.

UPDATE public.promo_carousel_items
SET 
    title = 'CNY 2026 Year of the Fire Horse',
    html_content = '<div class="promo-container cny-slide">
    <div class="promo-background"></div>
    <div class="standard-margin-wrapper">
        <div class="promo-content-card">
            <div className="badge-wrapper">
                 <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-full text-sm font-semibold mb-6 border border-yellow-400/30">
                    <span>✨</span> Year of the Fire Horse 2026
                 </div>
            </div>
            <h1>Embrace Energy & <br/>Passion in Indonesia</h1>
            <p>Experience the dynamic spirit of the archipelago this Chinese New Year. Exclusive "Fire Horse" themed itineraries exploring ancient temples and lush rainforests.</p>
            <div class="cta-wrapper">
                <a href="/cny" class="promo-btn primary">Explore Itineraries <span>→</span></a>
                <a href="/promotions" class="promo-btn secondary">View All Deals</a>
            </div>
        </div>
    </div>
</div>',
    css_content = '/* Container filling the carousel slide */
.cny-slide.promo-container {
    position: relative;
    width: 100%;
    min-height: 300px; /* Reduced height as requested */
    height: 350px; /* Approximately half of previous 600-650px */
    display: flex;
    align-items: center;
    overflow: hidden;
    color: #fff;
    font-family: var(--font-sans, "Inter", sans-serif);
}

/* Background Image Layer */
.cny-slide .promo-background {
    position: absolute;
    inset: 0;
    background-image: url("/images/cny_fire_horse_banner.png");
    background-size: cover;
    background-position: center; /* Revert to center for better balance with wider image */
    z-index: 1;
    /* Enhance image visual quality */
    filter: contrast(1.05) saturate(1.05);
    image-rendering: -webkit-optimize-contrast;
}

/* Gradient Overlay */
.cny-slide .promo-background::after {
    content: "";
    position: absolute;
    inset: 0;
    /* Gradient focused on the left, fading out faster to reveal the horse */
    background: linear-gradient(90deg, rgba(88, 12, 12, 0.9) 0%, rgba(88, 12, 12, 0.5) 40%, rgba(88, 12, 12, 0) 70%);
}

/* Standard Margin Framework */
.cny-slide .standard-margin-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Content Card styling */
.cny-slide .promo-content-card {
    max-width: 600px;
    animation: fadeInSlide 0.8s ease-out;
}

.cny-slide .promo-container h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: #FDF4E3;
    letter-spacing: -0.025em;
}

.cny-slide .promo-container h1 span {
    color: #facc15;
}

.cny-slide .promo-container p {
    font-size: 1.25rem;
    line-height: 1.6;
    color: #fef3c7;
    margin-bottom: 2.5rem;
    max-width: 90%;
}

.cny-slide .cta-wrapper {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Buttons */
.cny-slide .promo-btn {
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: 700;
    text-decoration: none;
    font-size: 1.125rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cny-slide .promo-btn.primary {
    background: #facc15;
    color: #7f1d1d;
    box-shadow: 0 10px 15px -3px rgba(250, 204, 21, 0.2);
}

.cny-slide .promo-btn.primary:hover {
    background: #fde047;
    transform: translateY(-2px);
}

.cny-slide .promo-btn.secondary {
    background: transparent;
    border: 2px solid #facc15;
    color: #facc15;
}

.cny-slide .promo-btn.secondary:hover {
    background: rgba(250, 204, 21, 0.1);
}

@keyframes fadeInSlide {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 768px) {
    /* Mobile Layout Fixes: Ensure buttons are accessible by reducing vertical space usage */
    .cny-slide.promo-container { 
        height: auto; 
        min-height: 400px; /* Reduced min-height */
        padding: 1.5rem 0; /* Significantly reduced padding */
        align-items: flex-start; 
    }
    
    .cny-slide .promo-background {
        background-position: 70% center; 
    }

    .cny-slide .promo-background::after { 
        background: linear-gradient(180deg, rgba(88, 12, 12, 0.95) 0%, rgba(88, 12, 12, 0.8) 60%, rgba(88, 12, 12, 0.5) 100%); 
    }

    .cny-slide .promo-container h1 { 
        font-size: 1.75rem; /* Reduced from 2.25rem */
        line-height: 1.2;
        margin-bottom: 0.75rem; /* Reduced margin */
        max-width: 100%; 
    }
    
    .cny-slide .promo-container p {
        font-size: 0.9rem; /* Reduced from 1rem */
        line-height: 1.4;
        max-width: 100%;
        margin-bottom: 1.5rem; /* Reduced margin */
    }

    .cny-slide .standard-margin-wrapper { 
        text-align: left;
        padding: 0 1.25rem;
    }
    
    .cny-slide .promo-content-card { 
        margin: 0; 
        max-width: 100%; 
    }
    
    .cny-slide .cta-wrapper { 
        justify-content: flex-start; 
        gap: 0.75rem;
    }
    
    .cny-slide .badge-wrapper {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 1rem; /* Reduced margin */
    }
    
    /* Make buttons smaller on mobile */
    .cny-slide .promo-btn {
        padding: 0.75rem 1.25rem;
        font-size: 0.95rem;
    }
}'
WHERE 
    title ILIKE '%Snake%' OR 
    html_content ILIKE '%Year of the Snake%' OR
    title = 'Chinese New Year Campaign 2026';

-- 3. Optimize ALL Carousel Slides for Web & Mobile
-- We explicitly update the CSS for known slides to ensure they are responsive and look good on all devices.

-- A) Update Local Guide Slide
UPDATE public.promo_carousel_items
SET 
  html_content = '<div class="promo-container guide-slide">
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
  css_content = '
.guide-slide.promo-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: #fff;
    font-family: var(--font-sans, "Inter", sans-serif);
}

.guide-slide .promo-background {
    position: absolute;
    inset: 0;
    background-image: url("/images/local_guide_promo_bg.png");
    background-size: cover;
    background-position: center;
    z-index: 1;
}

.guide-slide .promo-background::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(6, 78, 59, 0.9) 0%, rgba(6, 78, 59, 0.5) 50%, rgba(6, 78, 59, 0) 100%);
}

.guide-slide .standard-margin-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
}

.guide-slide .promo-content-card {
    max-width: 600px;
    animation: fadeInSlide 0.8s ease-out;
}

.guide-slide .badge-wrapper { margin-bottom: 1.5rem; }

.guide-slide h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #fff, #6ee7b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.guide-slide p {
    font-size: 1.25rem;
    line-height: 1.6;
    color: #ecfdf5;
    margin-bottom: 2.5rem;
    max-width: 90%;
}

.guide-slide .cta-wrapper { display: flex; gap: 1rem; flex-wrap: wrap; }

.guide-slide .promo-btn {
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: 700;
    text-decoration: none;
    font-size: 1.125rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.guide-slide .promo-btn.primary {
    background: #10b981;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}
.guide-slide .promo-btn.primary:hover { background: #059669; transform: translateY(-2px); }

@media (max-width: 768px) {
    .guide-slide.promo-container { padding: 2rem 0; }
    .guide-slide .promo-background::after { background: linear-gradient(180deg, rgba(6, 78, 59, 0.85) 0%, rgba(6, 78, 59, 0.5) 100%); }
    .guide-slide h1 { font-size: 2.25rem; margin-bottom: 1rem; }
    .guide-slide p { font-size: 1rem; line-height: 1.5; margin-bottom: 1.5rem; }
    .guide-slide .standard-margin-wrapper { text-align: center; padding: 0 1.5rem; }
    .guide-slide .promo-content-card { margin: 0 auto; }
    .guide-slide .cta-wrapper { justify-content: center; }
    .guide-slide .badge-wrapper { display: flex; justify-content: center; }
}
'
WHERE title = 'Local Guide Registration';

-- B) Update Vlogger Slide
UPDATE public.promo_carousel_items
SET 
  html_content = '<div class="promo-container vlogger-slide">
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
  css_content = '
.vlogger-slide.promo-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: #fff;
    font-family: var(--font-sans, "Inter", sans-serif);
}

.vlogger-slide .promo-background {
    position: absolute;
    inset: 0;
    background-image: url("/images/vlogger_promo_bg.png");
    background-size: cover;
    background-position: center;
    z-index: 1;
}

.vlogger-slide .promo-background::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(30, 10, 60, 0.9) 0%, rgba(30, 10, 60, 0.5) 50%, rgba(30, 10, 60, 0) 100%);
}

.vlogger-slide .standard-margin-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
}

.vlogger-slide .promo-content-card {
    max-width: 600px;
    animation: fadeInSlide 0.8s ease-out;
}

.vlogger-slide .badge-wrapper { margin-bottom: 1.5rem; }

.vlogger-slide h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #fff, #d8b4fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.vlogger-slide p {
    font-size: 1.25rem;
    line-height: 1.6;
    color: #f3e8ff;
    margin-bottom: 2.5rem;
    max-width: 90%;
}

.vlogger-slide .cta-wrapper { display: flex; gap: 1rem; flex-wrap: wrap; }

.vlogger-slide .promo-btn {
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-weight: 700;
    text-decoration: none;
    font-size: 1.125rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.vlogger-slide .promo-btn.primary {
    background: #d946ef;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(217, 70, 239, 0.3);
}
.vlogger-slide .promo-btn.primary:hover { background: #c026d3; transform: translateY(-2px); }

@media (max-width: 768px) {
    .vlogger-slide.promo-container { padding: 2rem 0; }
    .vlogger-slide .promo-background::after { background: linear-gradient(180deg, rgba(30, 10, 60, 0.85) 0%, rgba(30, 10, 60, 0.5) 100%); }
    .vlogger-slide h1 { font-size: 2.25rem; margin-bottom: 1rem; }
    .vlogger-slide p { font-size: 1rem; line-height: 1.5; margin-bottom: 1.5rem; }
    .vlogger-slide .standard-margin-wrapper { text-align: center; padding: 0 1.5rem; }
    .vlogger-slide .promo-content-card { margin: 0 auto; }
    .vlogger-slide .cta-wrapper { justify-content: center; }
    .vlogger-slide .badge-wrapper { display: flex; justify-content: center; }
}
'
WHERE title = 'Vlogger Giveaway Campaign' OR title = 'Travel Vlogger Promotion';

-- C) Clean up Fire Horse Slide (Ensure unit-less height matches others)
UPDATE public.promo_carousel_items
SET 
    css_content = REPLACE(
        REPLACE(css_content, 'height: 350px;', 'height: 100%;'),
        'min-height: 300px;', 'min-height: 100%;'
    )
WHERE title = 'CNY 2026 Year of the Fire Horse';
