-- Seeding "The Ultimate Indonesia Itinerary for US Travelers"
-- This post targets "Indonesia Itinerary", "US Itinerary", and "Indonesia Trip".

DELETE FROM posts WHERE slug = 'ultimate-indonesia-itinerary-for-us-travelers-2026';

WITH author AS (
    SELECT id FROM auth.users LIMIT 1
)
INSERT INTO posts (title, slug, content, excerpt, featured_image, status, meta_title, meta_description, published_at, author_id)
SELECT 
    'The Ultimate Indonesia Itinerary for US Travelers (2026 Edition)',
    'ultimate-indonesia-itinerary-for-us-travelers-2026',
    E'<p>For US travelers, a trip to Indonesia is the adventure of a lifetime. It’s a long journey across the Pacific, but the reward is a paradise of volcanoes, dragons, and turquoise waters. If you are flying 20+ hours, you want to make it count.</p>
    <p>This <strong>12-Day Indonesia Itinerary</strong> is designed specifically for Americans looking to maximize their time, covering the absolute highlights: <strong>Bali</strong> and <strong>Komodo National Park</strong>.</p>

    <h2>Before You Go: Logistics for US Citizens</h2>
    <ul>
        <li><strong>Visa:</strong> US citizens can get a <strong>Visa on Arrival (VOA)</strong> at major airports (CGK, DPS). It costs IDR 500,000 (approx. $35 USD) and is valid for 30 days. You can also apply for the e-VOA online beforehand to skip the queue.</li>
        <li><strong>Flights:</strong> The most common routes are via Singapore (Singapore Airlines), Taipei (EVA Air/China Airlines), or Doha/Dubai (Qatar/Emirates). Destination: <strong>Denpasar (DPS)</strong> in Bali.</li>
        <li><strong>Currency:</strong> The Indonesian Rupiah (IDR). 1 USD ≈ 15,000 IDR. ATMs are widely available, but bring a card with no foreign transaction fees (like Chase Sapphire or Capital One).</li>
    </ul>

    <hr />

    <h2>Days 1-5: The Culture & Jungles of Bali (Ubud)</h2>
    <p>Land in Denpasar and head straight to <strong>Ubud</strong>, the spiritual heart of Bali. Recover from jet lag in a jungle villa surrounded by rice paddies.</p>
    
    <h3>Highlights:</h3>
    <ul>
        <li><strong>Tegalalang Rice Terrace:</strong> Go at sunrise (6 AM) to beat the crowds and get that iconic photo.</li>
        <li><strong>Sacred Monkey Forest:</strong> Walk among hundreds of long-tailed macaques in an ancient temple complex.</li>
        <li><strong>Waterfalls:</strong> Visit <em>Tibumana</em> for a swim or <em>Tukad Cepung</em> for the cave light rays.</li>
    </ul>

    <h2>Days 6-8: Island Life (Nusa Penida)</h2>
    <p>Take a 45-minute fast boat from Sanur to <strong>Nusa Penida</strong>. This island is wild, rugged, and features the most famous view in Indonesia.</p>
    
    <h3>Highlights:</h3>
    <ul>
        <li><strong>Kelingking Beach:</strong> The famous T-Rex shaped cliff. The hike down is steep but worth it.</li>
        <li><strong>Diamond Beach:</strong> A white sand beach flanked by towering limestone cliffs.</li>
        <li><strong>Note:</strong> Roads here can be bumpy. We recommend hiring a private driver for the day (approx. $40-50 USD).</li>
    </ul>

    <h2>Days 9-11: Dragons & Pink Beaches (Komodo National Park)</h2>
    <p>Fly from Bali to <strong>Labuan Bajo (LBJ)</strong> (1 hour). This is the gateway to Komodo National Park, a UNESCO World Heritage site.</p>
    
    <h3>The Experience:</h3>
    <p>Book a full-day speedboat tour or a multi-day <strong>Phinisi boat</strong> liveaboard. You will see:</p>
    <ul>
        <li><strong>Komodo Dragons:</strong> See the world''s largest lizards in the wild on Komodo or Rinca Island.</li>
        <li><strong>Padar Island:</strong> Hike to the summit for a view of three different colored beaches (white, black, and pink).</li>
        <li><strong>Pink Beach:</strong> One of the few beaches in the world with genuine pink sand from red coral fragments.</li>
    </ul>

    <h2>Day 12: The Farewell</h2>
    <p>Fly back to Bali/Denpasar for your international connection. If you have a late flight, spend the afternoon in <strong>Uluwatu</strong> for a final sunset at Single Fin or the Rock Bar.</p>

    <h2>Total Estimated Cost (Excluding Flights)</h2>
    <p>For a comfortable "flashpacker" to mid-range luxury trip:</p>
    <ul>
        <li><strong>Accommodation:</strong> $50 - $150 / night</li>
        <li><strong>Food:</strong> $20 - $40 / day</li>
        <li><strong>Activities/Transport:</strong> $300 - $500 total</li>
        <li><strong>Total:</strong> Approx. $1,500 - $2,500 per person for 12 days.</li>
    </ul>',
    'Planning a trip from the USA? This ultimate 12-day Indonesia itinerary covers Bali, Nusa Penida, and Komodo National Park. Includes flight tips, visa requirements for US citizens, and budget breakdowns.',
    'https://res.cloudinary.com/delz2y4av/image/upload/v1770669299/itinara/blog/blog_komodo_phinisi_boat.jpg',
    'published',
    'The Ultimate Indonesia Itinerary for US Travelers (2026)',
    'A perfect 12-day Indonesia trip plan for Americans. From Bali cultural hubs to Komodo dragons. Learn about flights, visas, and costs.',
    NOW(),
    (SELECT id FROM author)
    FROM author;
