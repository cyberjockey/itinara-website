-- SQL to seed "Moneymaker" Blog Posts
-- INSTRUCTIONS:
-- 1. Upload the generated images to your storage (Supabase/Cloudinary) and replace the 'featured_image' placeholders below.
-- 2. Run this SQL in your Supabase SQL Editor.

WITH author AS (
    SELECT id FROM auth.users LIMIT 1
)
INSERT INTO posts (title, slug, content, excerpt, featured_image, status, meta_title, meta_description, published_at, author_id)
SELECT * FROM (
    SELECT 
        'The Ultimate 14-Day Indonesia Itinerary: Bali, Java, and Beyond' as title,
        'ultimate-14-day-indonesia-itinerary' as slug,
        E'<p>Planning a trip to Indonesia can be overwhelming. With over 17,000 islands, where do you even start? For most first-time travelers, the perfect balance of culture, adventure, and relaxation can be found in a two-week journey across the archipelago''s most iconic islands: <strong>Bali</strong> and <strong>Java</strong>.</p>
        
        <h2>Days 1-4: The Heart of Bali</h2>
        <p>Start your journey in <strong>Ubud</strong>, the cultural capital. Spend your days exploring the Tegalalang Rice Terraces, the Sacred Monkey Forest, and the myriad of waterfalls like Tibumana and Tukad Cepung.</p>
        <ul>
            <li><strong>Stay:</strong> A jungle villa just outside Ubud text center.</li>
            <li><strong>Eat:</strong> Babi Guling at Ibu Oka.</li>
            <li><strong>Do:</strong> Sunrise ridge walk at Campuhan.</li>
        </ul>

        <h2>Days 5-7: Island Hopping to Nusa Penida</h2>
        <p>Take a fast boat from Sanur to <strong>Nusa Penida</strong>. This rugged island offers some of the most dramatic coastal views in the world. Don''t miss Kelingking Beach (the T-Rex) and Diamond Beach.</p>

        <h2>Days 8-10: Ancient Java & Heritage</h2>
        <p>Fly from Denpasar to Yogyakarta. This is the soul of Java. Wake up early for the sunrise at <strong>Borobudur Temple</strong>, the world''s largest Buddhist temple. In the afternoon, visit the Hindu temple complex of <strong>Prambanan</strong>.</p>

        <h2>Days 11-14: Volcanic Adventures in East Java</h2>
        <p>Take the train to East Java for the grand finale. witnessing the sunrise over <strong>Mount Bromo</strong> is a bucket-list experience. If you have the energy, trek into the <strong>Ijen Crater</strong> to see the electric blue flames.</p>

        <h2>Conclusion</h2>
        <p>This 14-day itinerary offers a taste of everything that makes Indonesia magical. From the spiritual incense of Bali to the raw volcanic power of Java, you''ll leave with memories to last a lifetime.</p>' as content,
        'Discover the perfect 2-week route through Indonesia. From the rice terraces of Bali to the ancient temples of Java and volcanic sunrises, this prepared itinerary covers it all.' as excerpt,
        'https://res.cloudinary.com/delz2y4av/image/upload/v1770599364/itinara/blog/blog/indonesia_itinerary_hero.jpg' as featured_image,
        'published' as status,
        'The Ultimate 14-Day Indonesia Itinerary: Bali, Java, & Beyond' as meta_title,
        'Plan your perfect 2-week trip to Indonesia. A complete day-by-day guide covering Bali, Nusa Penida, Yogyakarta, and Mount Bromo.' as meta_description,
        NOW() as published_at,
        id as author_id
    FROM author

    UNION ALL

    SELECT 
        'Bali vs. Java: Which Indonesia Destination is Right for You?',
        'bali-vs-java-indonesia-destination-guide',
        E'<p>Indonesia is vast, but two islands capture the most attention: <strong>Bali</strong> and <strong>Java</strong>. While they sit right next to each other, they couldn''t be more different. Choosing between them depends entirely on your travel style.</p>

        <h2>The Vibe</h2>
        <p><strong>Bali</strong> is the land of the gods, but also the land of digital nomads, beach clubs, and smoothie bowls. It is accessible, tourist-friendly, and incredibly aesthetic. If you want ease, luxury, and a mix of party and peace, Bali is king.</p>
        <p><strong>Java</strong> is the raw, beating heart of Indonesia. It is chaotic, historical, and deeply adventurous. Here you find ancient empires, active volcanoes, and bustling cities. It feels more "undiscovered" compared to Bali.</p>

        <h2>Cost Comparison</h2>
        <p>Generally, <strong>Java is cheaper</strong> than Bali. Accommodation, food (warungs), and transport cost significantly less in Java. Bali prices have risen with its popularity, especially in hotspots like Canggu and Uluwatu.</p>

        <h2>The Verdict</h2>
        <ul>
            <li><strong>Choose Bali if:</strong> You want beautiful beaches, easy tourism infrastructure, yoga, nightlife, and world-class dining.</li>
            <li><strong>Choose Java if:</strong> You love history, trekking volcanoes, train journeys, and authentic local street food.</li>
        </ul>
        <p><strong>Pro Tip:</strong> Don''t choose! It''s easy to combine both. A ferry across the Bali Strait takes only 45 minutes.</p>',
        'Can''t decide between Bali and Java? We break down the differences in cost, vibe, and attractions to help you plan your ideal Indonesian adventure.',
        'https://res.cloudinary.com/delz2y4av/image/upload/v1770599365/itinara/blog/blog/bali_vs_java_hero.jpg',
        'published',
        'Bali vs. Java: Which Indonesia Destination is Right for You?',
        'Bali or Java? We compare the two most famous Indonesian islands to help you decide where to go based on budget, adventure, and culture.',
        NOW() - INTERVAL '1 day',
        id
    FROM author

    UNION ALL

    SELECT 
        'Estimated Travel Budget for Indonesia 2026: Hidden Costs Revealed',
        'indonesia-travel-budget-2026',
        E'<p>Is Indonesia still a budget destination in 2026? Yes, but costs are shifting. While you can still survive on $20 a day, getting the full experience requires a bit more planning. Here is a realistic breakdown.</p>

        <h2>Daily Budgets</h2>
        <ul>
            <li><strong>The Backpacker ($30/day):</strong> Hostel dorm beds ($10), street food ($5), scooter rental ($5), and free activities.</li>
            <li><strong>The Flashpacker ($70/day):</strong> Private guesthouse rooms ($35), cafe meals ($20), occasional taxi/driver, and paid entrance fees.</li>
            <li><strong>The Luxury Traveler ($200+/day):</strong> Private pool villas, fine dining, private drivers, and spa treatments.</li>
        </ul>

        <h2>Hidden Costs to Watch Out For</h2>
        <p><strong>1. Fast Boats:</strong> Getting to islands like Nusa Penida or Gili affects the budget. A return ticket can cost $30-$50.</p>
        <p><strong>2. Entrance Fees:</strong> Major sights like Borobudur now have tiered pricing for foreigners (approx $25+), which adds up.</p>
        <p><strong>3. Alcohol:</strong> Imported alcohol in Indonesia is heavily taxed. A glass of wine might cost as much as your dinner!</p>

        <h2>Money Saving Tips</h2>
        <p>Eat at <em>Warungs</em> (local eateries) instead of western cafes. Use Ride-hailing apps like GoJek or Grab instead of local street taxis. Book domestic flights in advance.</p>',
        'Planning your 2026 trip? We break down the real costs of traveling in Indonesia, from backpacker budgets to luxury stays, including hidden fees.',
        'https://res.cloudinary.com/delz2y4av/image/upload/v1770599367/itinara/blog/blog/indonesia_budget_travel_hero.jpg',
        'published',
        'Estimated Travel Budget for Indonesia 2026: The Real Costs',
        'Is Indonesia expensive? Detailed travel budget guide for 2026 covering accommodation, food, transport, and hidden costs for every traveler type.',
        NOW() - INTERVAL '2 days',
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
