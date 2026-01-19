-- Insert Dummy Blog Posts
-- Refined content with clean Markdown formatting for better prose rendering.

INSERT INTO posts (title, slug, excerpt, content, featured_image, status, author_id, published_at)
VALUES 
(
    'Hidden Gems of Bali: Beyond the Beaches',
    'hidden-gems-bali',
    'Discover the secret waterfalls, ancient temples, and lush jungles that most tourists miss in this comprehensive guide.',
    '# Hidden Gems of Bali
Bali is famous for its beaches, but the real magic lies inland. Away from the crowds of Kuta and Seminyak, you will find a landscape that feels timeless and spiritual.

## Sekumpul Waterfall
Located in the north, this majestic waterfall requires a trek but is worth every step. The sound of the water crashing down is deafening in the best way possible.

> "The hike down is steep, but the view at the bottom is nothing short of spiritual."

![Bali Waterfall](https://res.cloudinary.com/delz2y4av/image/upload/v1768838246/itinara/blog/itinara/blog/bali-waterfall.jpg)

## Sidemen Valley
Experience the **"old Bali"** with terraced rice fields and Mount Agung as your backdrop. It''s quieter here, more spiritual. The air is cooler, and the pace of life slows down.

### Why Visit Sidemen?
*   **Authentic Culture**: See daily life unchanged by mass tourism.
*   **Stunning Views**: Mount Agung dominates the skyline.
*   **Peace & Quiet**: No traffic jams, just the sound of nature.

### Travel Tips
1.  **Rent a Scooter**: It gives you the freedom to explore narrow lanes.
2.  **Respect Local Customs**: Dress modestly when visiting temples.
3.  **Wake Up Early**: The morning light over the rice terraces is magical.',
    'https://res.cloudinary.com/delz2y4av/image/upload/v1768838246/itinara/blog/itinara/blog/bali-waterfall.jpg',
    'published',
    auth.uid(),
    NOW() - INTERVAL '2 days'
),
(
    'A Culinary Journey Through Padang',
    'culinary-journey-padang',
    'Spicy, savory, and unforgettable. Exploring the world-famous Nasi Padang in its birthplace.',
    '# The Flavor of Padang
West Sumatra serves up some of the most flavorful food in the world. It is bold, spicy, and rich with coconut milk.

![Nasi Padang](https://res.cloudinary.com/delz2y4av/image/upload/v1768838247/itinara/blog/itinara/blog/padang-food.jpg)

## Rendang: King of Curries
Often voted the world''s most delicious food, authentic **Rendang** is slow-cooked for hours until the meat is tender and the spices are rich. The dark color signifies the caramelization of the coconut milk.

## Sate Padang
Skewers of beef tongue or meat served in a thick, yellow, curry-like sauce. It''s usually served with *ketupat* (rice cakes) and topped with fried shallots.

### Dining Etiquette
*   **Wash Your Hands**: Most people eat with their right hand.
*   **Hidang Style**: Dozens of small plates are stacked on your table. You only pay for what you eat.

> "To eat Padang food is to taste the soul of Sumatra."',
    'https://res.cloudinary.com/delz2y4av/image/upload/v1768838247/itinara/blog/itinara/blog/padang-food.jpg',
    'published',
    auth.uid(),
    NOW() - INTERVAL '5 days'
),
(
    'Komodo Island: Walking with Dragons',
    'komodo-island-dragons',
    'An encounter with the world''s largest lizards in their natural habitat.',
    '# Dragon Territory
Komodo National Park is a UNESCO World Heritage site and home to the legendary **Komodo Dragon**. These prehistoric giants can grow up to 3 meters long.

![Komodo Dragon](https://res.cloudinary.com/delz2y4av/image/upload/v1768838248/itinara/blog/itinara/blog/komodo-dragon.jpg)

## Pink Beach
One of only seven pink beaches in the world, the sand gets its color from microscopic animals called *Foraminifera*. It creates a stunning contrast against the turquoise water.

## Diving World-Class Sites
The waters around Komodo offer some of the best diving in Indonesia.

*   **Manta Point**: Swim with giant manta rays.
*   **Batu Bolong**: A pinnacle teeming with life.
*   **Tatawa Besar**: A drift dive over colorful coral gardens.',
    'https://res.cloudinary.com/delz2y4av/image/upload/v1768838248/itinara/blog/itinara/blog/komodo-dragon.jpg',
    'published',
    auth.uid(),
    NOW() - INTERVAL '1 week'
)
ON CONFLICT (slug) DO UPDATE SET 
    featured_image = EXCLUDED.featured_image,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt;
