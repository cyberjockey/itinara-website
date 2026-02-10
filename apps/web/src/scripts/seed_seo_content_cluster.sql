-- Seeding SEO Content Cluster
-- 1. Celebrating Chinese New Year (Seasonal Traffic)
-- 2. 7 Days in Bali (High Volume Keyword)

-- Clean up existing placeholders if they exist
DELETE FROM posts WHERE slug IN ('celebrating-chinese-new-year-indonesia-2026', '7-days-in-bali-itinerary');

WITH author AS (
    SELECT id FROM auth.users LIMIT 1
)
INSERT INTO posts (title, slug, content, excerpt, featured_image, status, meta_title, meta_description, published_at, author_id)
SELECT * FROM (
    -- POST 1: Chinese New Year
    SELECT 
        'Celebrating Chinese New Year (Imlek) in Indonesia: Best Spots for 2026' as title,
        'celebrating-chinese-new-year-indonesia-2026' as slug,
        E'<p>Gong Xi Fa Cai! Chinese New Year, known locally as <strong>Imlek</strong>, is a massive celebration in Indonesia. As a nation with a vibrant Chinese-Indonesian heritage, the archipelago lights up with red lanterns, lion dances (Barongsai), and delicious festive foods.</p>
        
        <h2>Where to Celebrate Imlek in Indonesia</h2>
        
        <h3>1. Glodok, Jakarta (Chinatown)</h3>
        <p>The oldest Chinatown in Indonesia. The <em>Vihara Dharma Bhakti</em> temple is the center of the action. Expect narrow streets packed with incense smoke, red candles, and the rhythmic beating of drums for the Barongsai performances.</p>

        <h3>2. Singkawang, West Kalimantan</h3>
        <p>Known as the "City of a Thousand Temples," Singkawang hosts the most intense Imlek celebration in Southeast Asia: <strong>Cap Go Meh</strong>. The highlight is the <em>Tatung</em> parade, where mediums in trance perform feats of invulnerability.</p>

        <h3>3. Semarang, Central Java</h3>
        <p>Visit the iconic <strong>Sam Poo Kong</strong> temple. This massive complex honors Admiral Zheng He and blends Chinese and Javanese architectural styles. The midnight prayer ceremony here is magical.</p>

        <h2>Traditions & Food</h2>
        <p>Don''t miss eating <em>Lontong Cap Go Meh</em> (rice cakes with rich coconut curry) and <em>Kue Keranjang</em> (sweet sticky rice cake). It’s a time for family, forgiveness, and feasting.</p>' as content,
        'Where is the best place to celebrate Chinese New Year 2026 in Indonesia? From the lantern-lit streets of Glodok to the mystical parades of Singkawang.' as excerpt,
        'https://res.cloudinary.com/delz2y4av/image/upload/v1770669304/itinara/blog/blog_cny_indonesia_lanterns.jpg',
        'published' as status,
        'Chinese New Year in Indonesia 2026: Glodok, Singkawang & Traditions',
        'Guide to celebrating Imlek (Chinese New Year) in Indonesia. Discover the best spots in Jakarta, Singkawang, and Semarang for 2026 festivities.' as meta_description,
        NOW() - INTERVAL '2 days', -- Backdate slightly to create cadence
        id as author_id
    FROM author

    UNION ALL

    -- POST 2: 7 Days in Bali
    SELECT 
        '7 Days in Bali: The Perfect Mix of Culture, Beaches & Nature',
        '7-days-in-bali-itinerary',
        E'<p>One week in Bali. Is it enough? Absolutely, if you plan it right. This diverse itinerary gives you a taste of everything the Island of the Gods has to offer without feeling rushed.</p>

        <h2>Days 1-3: Ubud (Culture & Jungle)</h2>
        <p>Start in the uplands. Ubud is the artistic soul of Bali.</p>
        <ul>
            <li><strong>Day 1:</strong> Exploring the <strong>Tegalalang Rice Terraces</strong> at dawn (light rays!), followed by the Sacred Monkey Forest.</li>
            <li><strong>Day 2:</strong> Chasing waterfalls. <em>Kanto Lampo</em> for photos, <em>Tibumana</em> for swimming.</li>
            <li><strong>Day 3:</strong> Wellness. Take a yoga class at The Yoga Barn and get a traditional Balinese massage.</li>
        </ul>

        <h2>Days 4-6: Uluwatu (Beaches & Cliffs)</h2>
        <p>Head south for the world''s best beaches and dramatic sunsets.</p>
        <ul>
            <li><strong>Day 4:</strong> Beach hopping. Padang Padang, Bingin, and Suluban Beach.</li>
            <li><strong>Day 5:</strong> The Culture. Visit Pura Luhur Uluwatu temple on the cliff edge for the mesmerizing <em>Kecak Fire Dance</em> at sunset.</li>
            <li><strong>Day 6:</strong> Beach Clubs. Relax at Sundays Beach Club or Palmilla.</li>
        </ul>

        <h2>Day 7: Seminyak (Eat, Shop, Leave)</h2>
        <p>Spend your final day in Seminyak or Canggu. Enjoy brunch at a trendy cafe, shop for souvenirs at the artisan markets, and catch one last sunset at La Plancha before your flight.</p>

        <p><strong>Where to Stay?</strong> We recommend splitting your stay: 3 nights in a jungle villa in Ubud, 3 nights in a cliffside hotel in Uluwatu.</p>' as content,
        'Only have one week? This perfect 7-day Bali itinerary balances the lush jungles of Ubud with the stunning cliffside beaches of Uluwatu.' as excerpt,
        'https://res.cloudinary.com/delz2y4av/image/upload/v1770669309/itinara/blog/blog_bali_tegalalang_dawn.jpg',
        'published' as status,
        '7 Days in Bali Itinerary: The Perfect One Week Trip (2026)',
        'From Ubud jungles to Uluwatu sunsets. The ultimate 1 week Bali itinerary for first-timers looking for culture, relaxation, and adventure.' as meta_description,
        NOW() - INTERVAL '4 days',
        id
    FROM author
) AS new_posts
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    featured_image = EXCLUDED.featured_image,
    status = EXCLUDED.status,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();
