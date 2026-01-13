# ITINARA - Project Plan & Development Guide
## Indonesian Itinerary Management Platform for International Travelers

---

## 📋 PROJECT OVERVIEW

**App Name:** ITINARA  
**Category:** Travel & Local Experience  
**Target Market:** European, US, Australian travelers + digital nomads  
**Brand Tone:** Smart, warm, curated, reliable  
**Key Differentiator:** Authentic Indonesian experiences with modern UX

---

## 🎨 DESIGN SYSTEM & VISUAL IDENTITY

### Color Palette
```
Primary Colors:
- Warm Terracotta: #D4654F (Indonesian clay/pottery inspired)
- Deep Teak: #8B4513 (Traditional wood)
- Sunrise Gold: #F4A460 (Golden hour in Bali)

Secondary Colors:
- Ocean Turquoise: #40B5AD (Indonesian seas)
- Rice Paddy Green: #90C695 (Terraced fields)
- Batik Indigo: #2C5F88 (Traditional textile)

Neutrals:
- Warm White: #FFF9F5 (Background)
- Stone Gray: #4A4A4A (Text)
- Light Sand: #F5EDE4 (Cards/sections)
```

### Typography
```
Headings: 'Plus Jakarta Sans' (Indonesian-designed font)
Body: 'Inter' (Clean, readable)
Accents: 'Crimson Pro' (For elegant touches)

Font Sizes:
H1: 3.5rem (56px) - Hero titles
H2: 2.5rem (40px) - Section headers
H3: 1.75rem (28px) - Card titles
Body: 1rem (16px) - Regular text
Small: 0.875rem (14px) - Captions
```

### Indonesian Design Elements
- Batik patterns (subtle, as texture/background)
- Wayang shadow puppet silhouettes (decorative elements)
- Organic, flowing shapes (inspired by rice terraces)
- Traditional ornamental borders (for section dividers)
- Natural textures (woven rattan, wood grain overlays)

---

## 🗺️ WEBSITE STRUCTURE & USER JOURNEY

### Homepage
```
┌─────────────────────────────────────┐
│  Hero Section (Fullscreen)          │
│  - Parallax background (Bali rice   │
│    terraces or Komodo islands)      │
│  - Animated headline reveal         │
│  - Scroll indicator                 │
└─────────────────────────────────────┘
         ↓ (Smooth scroll)
┌─────────────────────────────────────┐
│  "How It Works" (3-step process)    │
│  - Icon animations on scroll        │
│  - Staggered card reveals           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  "Discover Indonesia" (Destinations)│
│  - Interactive map with hover       │
│  - Region cards with parallax       │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Features Showcase                  │
│  - Bento grid layout                │
│  - Micro-interactions               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Social Proof (Testimonials)        │
│  - Carousel with photos             │
│  - Auto-play with pause on hover    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  CTA Section                        │
│  - Email capture                    │
│  - Launch notification signup       │
└─────────────────────────────────────┘
```

### App Dashboard (Post-Login)
```
┌──────────────────────────────────────────┐
│  Sidebar Navigation                      │
│  - My Trips                              │
│  - Explore Destinations                  │
│  - Saved Experiences                     │
│  - Travel Community                      │
│  - Profile & Settings                    │
└──────────────────────────────────────────┘

Main Dashboard:
┌──────────────────────────────────────────┐
│  Active Trip Timeline (Horizontal scroll)│
│  - Day-by-day breakdown                  │
│  - Drag-and-drop reordering              │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│  Quick Actions (Cards)                   │
│  - Add Experience                        │
│  - Find Local Guide                      │
│  - View Map                              │
│  - Share Itinerary                       │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│  Recommendations (AI-powered)            │
│  - Based on preferences                  │
│  - Similar traveler suggestions          │
│  - Seasonal highlights                   │
└──────────────────────────────────────────┘
```

---

## 🎬 ANIMATION & INTERACTION GUIDELINES

### Page Load Animations
```javascript
1. Hero Section:
   - Background image: Fade in + subtle zoom (3s)
   - Headline: Slide up + fade (stagger 0.1s per word)
   - CTA button: Scale bounce (delay 0.5s)

2. Scroll Animations:
   - Parallax: Background moves at 0.5x scroll speed
   - Cards: Fade up when 20% in viewport
   - Icons: Draw SVG paths on reveal
   - Numbers: Count-up animation

3. Hover States:
   - Cards: Lift with shadow (transform: translateY(-8px))
   - Buttons: Color shift + scale (1.05)
   - Images: Zoom in slightly (1.1)
```

### Micro-interactions
```
- Calendar date selection: Ripple effect
- Checkbox: Checkmark draw animation
- Toggle switch: Smooth slide with color transition
- Drag-and-drop: Item lifts, background dims
- Loading states: Skeleton screens (not spinners)
- Success feedback: Confetti burst + checkmark
```

### Parallax Effects
```
Sections with parallax:
1. Hero background (mountain/ocean scenes)
2. Destination region cards (image shifts on scroll)
3. Feature showcase (layered elements at different speeds)
4. Footer (subtle texture movement)

Performance: Use transform and will-change properties
```

---

## 🤖 DETAILED AI PROMPTING STRATEGY

### Phase 1: Brand & Visual Design

**Prompt 1.1 - Logo Design**
```
Create a modern logo for "ITINARA" - an Indonesian itinerary management app 
targeting international travelers. The logo should:
- Incorporate subtle Indonesian elements (batik pattern, wayang silhouette, or temple gate)
- Be minimal and professional, suitable for app icons
- Use warm, earthy colors (terracotta, teak, gold)
- Work well in both color and monochrome
- Include both symbol + wordmark versions
- Be scalable from 16px to large format

Style: Modern, warm, trustworthy, cultural without being cliché
Output: SVG format, multiple variations
```

**Prompt 1.2 - Hero Section Background**
```
Generate a hero background image for a travel website featuring:
- Indonesian landscape: Choose from Bali rice terraces at golden hour OR 
  Komodo islands aerial view OR Borobudur temple silhouette at sunrise
- High resolution (2560x1440px)
- Warm color grading (golden/terracotta tones)
- Slightly desaturated for text overlay readability
- Professional travel photography style
- Optimized for parallax scrolling effect

Mood: Inspiring, serene, adventurous, authentic
```

**Prompt 1.3 - Iconography Set**
```
Design a custom icon set (24 icons) for ITINARA app with:
Icons needed: Calendar, Map Pin, Compass, Airplane, Camera, Restaurant,
Hotel, Beach, Mountain, Temple, Food, Guide, Chat, Heart, Share, 
Edit, Search, Filter, User, Settings, Bookmark, Star, Clock, Weather

Style:
- Line icons with 2px stroke weight
- Rounded line caps for friendly feel
- Organic, flowing lines (not rigid geometric)
- Subtle Indonesian motifs where appropriate
- 24x24px base size, exportable to multiple sizes
- Consistent visual weight across set

Color: Single color (to be applied via CSS)
Format: SVG with clean paths
```

### Phase 2: Landing Page Development

**Prompt 2.1 - Hero Section (HTML/CSS/JS)**
```
Create a hero section for ITINARA travel app with:

HTML Structure:
- Full viewport height
- Background image with parallax effect
- Headline: "Your Indonesia, Perfectly Planned"
- Subheadline: "Curated itineraries that blend iconic sights with 
  hidden gems. Built for travelers who want more than just temples."
- CTA buttons: "Start Planning" (primary) + "Explore Destinations" (secondary)
- Scroll indicator (animated arrow)

CSS Requirements:
- Parallax background using transform: translateY
- Text with subtle drop shadow for readability
- Gradient overlay on image (bottom to transparent)
- Mobile responsive (stacked layout on small screens)
- Smooth font rendering

JavaScript:
- Parallax scroll effect (background moves at 0.5x speed)
- Fade in animation on page load (staggered text reveal)
- Smooth scroll to next section on arrow click
- Intersection Observer for scroll-triggered animations

Technologies: Vanilla JS, CSS Grid, CSS Custom Properties
Performance: Lazy load background image, use will-change sparingly
```

**Prompt 2.2 - "How It Works" Section**
```
Build an interactive 3-step process section:

Steps:
1. "Choose Your Vibe" - Select travel style (adventure, culture, relaxation, foodie)
2. "We Curate" - AI suggests personalized itinerary based on preferences
3. "Explore Freely" - Adjust, share, and book experiences

Design:
- Horizontal layout on desktop (3 columns)
- Vertical on mobile (stacked cards)
- Each step has: Icon (large, 80px), Title, Description (2-3 lines)
- Connecting lines/dots between steps (animated on scroll)
- Cards elevate on hover

Animations:
- Cards fade up sequentially when scrolling into view (0.2s stagger)
- Icons animate in (draw effect for SVG or scale bounce)
- Connecting line draws from left to right
- Hover: Card lifts, icon bounces slightly

Styling:
- Light sand background (#F5EDE4)
- White cards with subtle shadow
- Warm color accents for icons
- 'Plus Jakarta Sans' for headings

Use: Intersection Observer API for scroll animations, CSS transitions
```

**Prompt 2.3 - Interactive Indonesia Map**
```
Create an interactive SVG map of Indonesia showing key regions:

Regions to highlight:
- Bali & Nusa Islands
- Java (Yogyakarta, Jakarta)
- Sumatra (Lake Toba, Banda Aceh)
- Sulawesi (Toraja, Bunaken)
- Komodo & Flores
- Raja Ampat & Papua

Interactions:
- Hover: Region highlights with color change + tooltip
- Click: Opens modal/card with region info and popular experiences
- Animated path drawing on page load
- Pulsing location markers on key cities

Styling:
- Minimalist map outline (not detailed, stylized)
- Ocean in turquoise (#40B5AD, 20% opacity)
- Land in warm white (#FFF9F5)
- Hover state: Warm terracotta (#D4654F)
- Smooth transitions (300ms ease-in-out)

Technical:
- SVG with <path> elements for regions
- JavaScript for hover/click events
- Responsive scaling (viewBox)
- Accessible (ARIA labels, keyboard navigation)

Include: Tooltips with region name, preview image, and "Learn More" button
```

**Prompt 2.4 - Features Showcase (Bento Grid)**
```
Design a bento-style grid showcasing ITINARA features:

Features (6 cards with varying sizes):
1. "AI-Powered Curation" (large card, 2x2) - Shows sample itinerary
2. "Local Guide Network" (medium, 2x1) - Guide profiles
3. "Offline Access" (small, 1x1) - Icon + text
4. "Real-Time Updates" (medium, 1x2) - Notification preview
5. "Drag & Drop Planning" (medium, 2x1) - Interactive demo
6. "Community Reviews" (small, 1x1) - Star ratings

Layout:
- CSS Grid with mixed sizes (use grid-template-areas)
- Gap between cards (24px)
- Responsive: Collapses to single column on mobile
- Each card has subtle gradient background

Animations:
- Cards fade in with stagger based on position
- Hover: Scale up slightly (1.02), lift shadow
- Some cards have subtle looping animations (e.g., pulse, float)

Interactivity:
- Large cards can have embedded mini-demos (e.g., draggable items)
- Click expands card to modal with full feature explanation

Styling:
- Mix of images, illustrations, and UI mockups
- Consistent border radius (12px)
- Frosted glass effect on some cards (backdrop-filter: blur)
- Use brand colors for accents
```

**Prompt 2.5 - Testimonial Carousel**
```
Build an auto-playing testimonial carousel with:

Content (5 testimonials):
- Traveler photo (circular, 80px)
- Name + origin country
- Trip type (e.g., "2-week Java & Bali Adventure")
- Quote (3-4 lines max)
- 5-star rating

Features:
- Auto-advance every 5 seconds
- Pause on hover or focus
- Dot navigation below
- Swipe gestures on mobile
- Smooth fade transition between slides

Layout:
- Centered content, max-width 800px
- Photo on left, text on right (desktop)
- Stacked on mobile
- Subtle background pattern (batik texture, 5% opacity)

Accessibility:
- Keyboard navigation (arrow keys)
- Screen reader announcements
- Pause button
- ARIA labels for carousel controls

Styling:
- Soft shadow on carousel container
- Brand color for active dot indicator
- Italic quote text ('Crimson Pro' font)
- Smooth animations (no jarring jumps)

Technical: Use CSS transforms for slide transitions, JavaScript for auto-play
```

### Phase 3: App Dashboard & Core Features

**Prompt 3.1 - Dashboard Layout**
```
Create a modern dashboard layout for ITINARA app:

Structure:
- Sidebar navigation (240px wide, collapsible)
- Top bar with: Logo, search, notifications, user profile
- Main content area (fluid width)
- Quick actions floating button (bottom right)

Sidebar Navigation:
Items:
1. 🏠 Dashboard (home)
2. ✈️ My Trips
3. 🗺️ Explore
4. 💝 Saved
5. 👥 Community
6. ⚙️ Settings

Active state: Background color + left border accent
Hover: Subtle background change
Icons: Custom set from earlier prompt

Top Bar:
- Search with autocomplete (destinations, experiences)
- Notification bell with badge count
- User avatar with dropdown menu

Responsive:
- Mobile: Sidebar becomes bottom tab bar
- Tablet: Sidebar collapses to icons only

Styling:
- White/light sand background for main area
- Sidebar: Slightly darker (#F5EDE4)
- Smooth transitions for collapse/expand
- Sticky top bar on scroll
- Elevation/shadows for depth

Use: CSS Grid for layout, media queries for responsive behavior
```

**Prompt 3.2 - Trip Timeline Component**
```
Build an interactive trip timeline/itinerary view:

Layout:
- Horizontal scrollable timeline showing days
- Each day is a card (300px wide, 500px tall)
- Days connected by visual line/path
- Current day highlighted

Day Card Contents:
- Date (large, prominent)
- Weather forecast icon
- Morning/Afternoon/Evening sections
- Activities with: Icon, name, time, location
- Add activity button
- Notes section (collapsible)

Interactions:
- Drag to reorder activities within a day
- Drag to move activities between days
- Click activity to expand details (modal)
- Swipe/scroll between days
- Smooth snap-to-card scrolling

Visual Design:
- Gradient background based on day theme (beach=blue, culture=warm)
- Activity cards with rounded corners, shadows
- Time indicated by position/spacing
- Haptic feedback on mobile (if supported)

States:
- Empty state: Illustration + "Add your first activity"
- Loading: Skeleton screens
- Past days: Slightly grayed out with checkmarks

Technical:
- Use Sortable.js or similar for drag-and-drop
- Intersection Observer for current day indicator
- Local storage for offline access
- Optimistic UI updates

Accessibility: Keyboard drag-drop alternative, ARIA live regions
```

**Prompt 3.3 - Activity Search & Filter**
```
Create a search/filter interface for finding activities:

Search Bar:
- Autocomplete with instant results
- Search by: Activity name, location, category, keyword
- Recent searches saved locally
- Clear button

Filters (Sidebar or Collapsible Panel):
Categories:
- Cultural (temples, museums, workshops)
- Adventure (diving, hiking, surfing)
- Culinary (cooking classes, food tours, restaurants)
- Nature (waterfalls, beaches, parks)
- Nightlife (bars, clubs, night markets)
- Wellness (yoga, spa, meditation)

Additional Filters:
- Price range (slider)
- Duration (1hr, 2-4hrs, half day, full day)
- Group size (solo-friendly, small group, private)
- Time of day (morning, afternoon, evening, flexible)
- Accessibility (wheelchair accessible, family-friendly)

Results Display:
- Card grid (3 columns desktop, 1 mobile)
- Each card: Image, title, location, price, rating, duration
- Hover: Reveal quick-add button
- Infinite scroll or pagination
- Sort options: Popular, Price, Rating, Distance

Animations:
- Filter panel slides in/out
- Results fade in with stagger
- Loading shimmer effect
- Empty state illustration if no results

Technical:
- Debounced search (300ms)
- URL parameters for shareable filtered states
- Virtualization for long lists (react-window)
```

**Prompt 3.4 - Activity Detail Modal**
```
Design a comprehensive activity detail view (modal or page):

Header:
- Image gallery (3-5 photos, swipeable carousel)
- Bookmark/save icon (top right)
- Back button

Content Sections:
1. Overview
   - Activity name (large heading)
   - Location (with map pin icon, clickable)
   - Rating (stars + review count)
   - Price (prominent, with currency)
   - Duration
   - Quick info badges (group size, difficulty, language)

2. Description
   - Full text (3-4 paragraphs)
   - "What's Included" list
   - "What to Bring" list

3. Availability
   - Calendar selector
   - Time slot options
   - Real-time availability status

4. Reviews
   - Average rating breakdown (5 star, 4 star, etc.)
   - Recent reviews (3 shown, load more button)
   - Each review: Avatar, name, date, rating, text, helpful button

5. Location
   - Embedded mini map
   - Address with copy button
   - "Get Directions" link

6. Similar Activities
   - Horizontal scroll of 4-5 related activities

Footer (Sticky):
- Primary CTA: "Add to Trip" or "Book Now"
- Secondary: "Share" button

Interactions:
- Smooth modal entrance (fade + slide up)
- Image gallery: Tap to fullscreen, pinch to zoom
- Calendar: Disable past dates, highlight available dates
- Review helpful button: Animate count increase

Responsive:
- Desktop: Modal (max-width 1000px)
- Mobile: Full screen with native-feeling navigation

Technical: Portal for modal, lazy load images, cache API responses
```

**Prompt 3.5 - Itinerary Sharing Feature**
```
Build a shareable itinerary view optimized for non-users:

Public Itinerary Page:
- Hero: Trip title, destination, dates, creator name
- Cover photo (chosen by user or auto-selected)
- Overview stats: Total days, activities, estimated budget
- Day-by-day breakdown (expandable accordion)
- Each activity: Photo, name, description, time, location
- Map view toggle (shows all locations pinned)
- "Use This Itinerary" CTA (prompts sign-up)

Sharing Options:
- Generate unique shareable link
- QR code (for offline sharing)
- Social media cards (Open Graph tags)
- Export as PDF (formatted for printing)
- Email to friend(s)
- Collaborate mode (invite others to edit)

Privacy Settings:
- Public (searchable, anyone with link)
- Unlisted (anyone with link, not searchable)
- Private (only specific users)

Visual Design:
- Clean, magazine-style layout
- High-quality images
- Print-friendly version (remove navigation, optimize spacing)
- Mobile-optimized (easy to reference on the go)

SEO Optimization:
- Descriptive meta tags
- Structured data (JSON-LD for Travel Itinerary)
- Optimized page load speed
- Server-side rendering for initial load

Technical:
- Generate unique slug (e.g., itinara.com/trip/sunset-bali-adventure-xj92k)
- Analytics tracking (views, clicks)
- Rate limiting on API endpoints
```

### Phase 4: AI-Powered Features

**Prompt 4.1 - AI Itinerary Generator (Backend Logic)**
```
Design the AI curation algorithm for personalized itineraries:

Inputs (User Preferences):
- Destinations (select up to 3 regions)
- Duration (days)
- Travel style (adventure, culture, relaxation, foodie, mix)
- Budget level (budget, mid-range, luxury)
- Travel pace (fast-paced, moderate, slow)
- Interests (select multiple: temples, beaches, food, nature, nightlife, etc.)
- Traveling with (solo, couple, family, friends)
- Accessibility needs

Algorithm Considerations:
1. Geographical optimization (minimize backtracking)
2. Activity distribution (balance energy levels throughout day)
3. Time of day appropriateness (sunrise temple visit, night market after dark)
4. Weather/seasonality (rainy season alternatives)
5. Cultural appropriateness (ceremony days, dress codes)
6. Rest periods (avoid burnout)
7. Popular but not overcrowded (suggest alternative times/locations)

Output Structure:
- Day-by-day itinerary
- Morning/afternoon/evening activities
- Travel time between locations
- Meal suggestions (breakfast, lunch, dinner spots)
- Budget breakdown
- Alternative options for each activity
- Insider tips for each day

AI Prompting for Claude API:
"You are an expert Indonesia travel curator. Given the following traveler 
preferences: [INSERT PREFERENCES], generate a detailed [X]-day itinerary 
that balances iconic experiences with hidden gems. For each day, provide:
- 2-3 main activities with specific names and locations
- Meal recommendations (local favorites, not tourist traps)
- Realistic timing (account for Indonesian traffic and distances)
- Local insights and cultural tips
- Budget estimate in USD

Optimize for authentic experiences while ensuring practical logistics. 
Avoid overcrowded tourist spots during peak hours. Format response as 
structured JSON for easy parsing."

Human Review:
- Flagging system for AI suggestions requiring verification
- Manual override capability
- A/B testing different curation approaches
- Feedback loop (user ratings improve algorithm)
```

**Prompt 4.2 - Conversational Trip Planner (Chatbot UI)**
```
Create a conversational interface for trip planning:

Chat Interface:
- Left sidebar: Conversation thread
- Right panel: Live itinerary preview (updates as user chats)
- Typing indicators, message status (sent/read)
- Quick reply buttons for common responses

Conversation Flow:
1. Greeting: "Hi! I'm here to help plan your Indonesian adventure. 
   Where are you thinking of going?"
2. Follow-up questions (dynamic based on responses):
   - How many days?
   - What's your travel style?
   - Any specific interests?
   - Budget range?
3. Present initial itinerary
4. Refinement: "Want to add/remove anything? Swap out an activity?"
5. Finalization: "Your trip looks amazing! Save it to start booking."

AI Personality:
- Warm, enthusiastic but not pushy
- Uses travel insights ("Pro tip: Visit Borobudur at sunrise")
- Occasionally uses Bahasa Indonesia phrases (explained in English)
- Adapts tone to user (formal for business travelers, casual for backpackers)

Smart Features:
- Context awareness (remembers earlier messages)
- Proactive suggestions ("Since you like temples, you might love Prambanan")
- Clarifying questions ("By 'adventure', do you mean hiking or water sports?")
- Emoji usage (subtle, matching user's style)

Visual Elements:
- Activity cards embedded in chat (preview, click to expand)
- Map snippets showing suggested route
- Photos of recommended places
- Calendar widget for date selection

Technical:
- WebSocket for real-time updates
- Streaming responses (shows AI "thinking")
- Message persistence (resume conversation later)
- Export chat as PDF alongside itinerary

Prompt Engineering for AI:
"You are ITINARA's friendly travel assistant specializing in Indonesia. 
Engage users in natural conversation to understand their preferences, 
then suggest personalized itineraries. Your responses should:
- Be conversational, warm, and enthusiastic
- Ask one question at a time (avoid overwhelming)
- Provide specific place names, not vague suggestions
- Include brief context (e.g., 'Tanah Lot is best at sunset')
- Adapt to user's budget and style
- Occasionally use Bahasa phrases like 'Selamat datang' (welcome)

Current user context: [INSERT USER MESSAGES AND PREFERENCES]
Generate the next message in the conversation."
```

**Prompt 4.3 - Smart Recommendations Engine**
```
Build a recommendation system for "You might also like":

Data Inputs:
- User's current trip destinations and activities
- Previous trips and ratings
- Saved/bookmarked items
- Similar user profiles (collaborative filtering)
- Trending activities in selected regions
- Seasonal events and festivals

Recommendation Types:
1. Similar Activities
   - Same category, different location
   - Example: User likes cooking class in Bali → Suggest Jogja cooking class

2. Complementary Experiences
   - Pairs well with existing activities
   - Example: Booked diving → Suggest underwater photography workshop

3. Hidden Gems
   - Less popular but highly rated
   - Off-the-beaten-path alternatives

4. Time-Based
   - "Also free on Tuesday afternoon"
   - Fills gaps in itinerary

5. Budget-Conscious
   - Free/cheaper alternatives to paid activities
   - "Similar vibe, half the price"

6. Local Favorites
   - Aggregated from community reviews
   - "Where locals actually go"

Display Format:
- Card carousel (horizontal scroll)
- Each card: Image, title, location, price, match score
- Hover: Quick-add to trip
- "Why recommended" tag (e.g., "Popular with adventure travelers")

Personalization Levels:
- New users: Trending + category-based
- Returning users: Behavior-based
- Power users: Collaborative filtering + surprise discoveries

Machine Learning Approach (Pseudo-code):
```python
# Feature engineering
user_vector = [
    travel_style_scores,  # Normalized 0-1 for each style
    budget_preference,    # Low, mid, high
    pace_preference,      # Fast, moderate, slow
    interest_tags,        # Multi-hot encoding
    previous_ratings      # Historical preferences
]

activity_vector = [
    category_tags,
    price_point,
    energy_level,
    group_size,
    location_cluster,
    user_ratings_avg
]

# Similarity calculation
def calculate_match(user_vector, activity_vector):
    cosine_similarity = dot(user_vector, activity_vector) / (norm(user) * norm(activity))
    contextual_boost = check_complementary_activities()
    trending_factor = get_recent_popularity()
    
    return weighted_score(cosine_similarity, contextual_boost, trending_factor)
```

Testing & Optimization:
- A/B test different algorithms
- Click-through rate tracking
- Conversion to booking rate
- User feedback ("Was this helpful?")
```

**Prompt 4.4 - AI-Powered Photo Tagging & Trip Memories**
```
Create an intelligent photo organization system for post-trip:

Upload Flow:
- Bulk upload (drag-and-drop or album select)
- Automatic chronological sorting
- Associate with specific days/activities in itinerary

AI Analysis (using image recognition):
1. Location Detection
   - Landmark recognition (e.g., "Tanah Lot Temple")
   - Match to itinerary activities
   - Suggest adding unplanned stops discovered via photos

2. Activity Classification
   - Beach, hiking, food, temple, city, etc.
   - Auto-tag based on content

3. Subject Recognition
   - People counting (group size)
   - Object detection (surfboard = surfing, plate = food experience)

4. Quality Filtering
   - Identify best photos (composition, lighting)
   - Suggest cover photo for trip
   - Flag blurry/duplicate images

Trip Memory Features:
- Auto-generated highlight reel (video from photos)
- Day-by-day photo album mapped to itinerary
- "Create Shareable Story" (Instagram-style carousel)
- Stats: "You visited 12 temples, tried 47 dishes, traveled 850km"
- Export as photo book (integrate with print services)

AI Prompting for Claude Vision:
"Analyze this travel photo from Indonesia. Identify:
1. Location/landmark (if recognizable)
2. Activity type (beach, temple, food, hiking, city, cultural)
3. Time of day (morning, afternoon, evening, night)
4. Mood/aesthetic (adventurous, peaceful, vibrant, cultural)
5. Key subjects (people count, main focus)
6. Quality score (1-10 for sharpness, composition, lighting)

Return as JSON with confidence scores for each identification."

Privacy:
- All processing done securely
- Option to mark photos private (not included in shares)
- Face blur option for public sharing
- EXIF data stripped when sharing externally
```

### Phase 5: Community & Social Features

**Prompt 5.1 - Community Feed**
```
Design a community/social feed for travelers:

Feed Algorithm:
Show mix of:
- Trips from users with similar interests (collaborative filtering)
- Recently returned travelers (fresh perspectives)
- Top-rated itineraries in user's next destination
- Community discussions/questions
- Local guide posts (insider tips)
- Seasonal highlights ("Best time to visit Raja Ampat")

Post Types:
1. Trip Reports
   - User shares completed itinerary with photos, review
   - Can "clone" their trip as starting point

2. Questions
   - "Is 3 days enough for Komodo?"
   - Upvoting system for helpful answers
   - Mark as "solved"

3. Tips & Tricks
   - Short-form advice ("Best ATMs in Bali with no fees")
   - Save for later feature

4. Local Events
   - Community-submitted festivals, ceremonies
   - Date, location, what to expect

Feed Card Design:
- Compact layout (not overwhelming)
- Preview image (if applicable)
- User avatar + name + credibility badge (e.g., "Verified Traveler")
- Engagement: Likes, comments, saves
- Quick actions: Save, Share, Comment

Interactions:
- Infinite scroll with lazy loading
- Pull-to-refresh
- Filter by: Post type, destination, recent/popular
- Report inappropriate content

Gamification:
- User levels: Wanderer → Explorer → Adventurer → Legend
- Badges: "Temple Hunter", "Foodie", "First to Review"
- Contribution score (posts, helpful answers, reviews)

Moderation:
- AI pre-screening for spam/inappropriate content
- Community flagging
- Human review for flagged items
- Clear community guidelines
```

**Prompt 5.2 - Local Guide Profiles & Booking**
```
Create a local guide marketplace integration:

Guide Profile Components:
- Professional photo
- Name, location, languages spoken
- Specialties (cultural tours, adventure, food, photography)
- Experience (years, certifications)
- Introduction video (1-2 min)
- Availability calendar
- Hourly/daily rate
- Reviews and ratings
- Sample itineraries they've created
- Response time badge
- Verification status (ID, certifications checked)

Search & Filter:
- Location (city or region)
- Language preference
- Specialty
- Price range
- Availability (date range)
- Rating threshold

Booking Flow:
1. Send inquiry with: Dates, group size, interests, message
2. Guide responds (proposal with suggested itinerary)
3. Negotiate/refine
4. Confirm booking
5. Payment processing (escrow until service completed)
6. In-app messaging for trip coordination
7. Post-trip review

Safety Features:
- Verified guide badges
- Emergency contact system
- Share trip details with emergency contact
- In-app SOS button
- Insurance information
- Cancellation policy clear upfront

Guide Dashboard:
- Inquiry management
- Calendar management
- Earnings tracker
- Client reviews
- Marketing tools (share profile link)
- Resources (destination guides, best practices)

Commission Structure:
- ITINARA takes 15-20% per booking
- Guides receive payout after successful trip completion
- Tiered system (lower commission for high-volume guides)

Legal Considerations:
- Terms of service for guides
- Liability disclaimers
- Insurance requirements
- Tax documentation (W-9/W-8 forms for payouts)
```

### Phase 6: Additional Tools & Integrations

**Prompt 6.1 - Budget Tracker**
```
Build a comprehensive trip budget management tool:

Budget Setup:
- Set total trip budget
- Auto-suggest based on: Destination, duration, travel style
- Category breakdown:
  * Accommodation (%)
  * Food & Drink (%)
  * Activities & Tours (%)
  * Transportation (%)
  * Shopping & Misc (%)

Expense Tracking:
- Manual entry: Amount, category, date, note
- Receipt photo upload (OCR for automatic data extraction)
- Multi-currency support (auto-convert to home currency)
- Split expenses (group travel)

Visualizations:
- Pie chart: Budget by category
- Bar chart: Planned vs. actual spending
- Line graph: Daily spending trend
- Progress bar: "You've spent 67% of your budget"

Smart Alerts:
- "You're spending faster than planned"
- "Great job! Under budget so far"
- Daily spending limit based on remaining budget and days
- Category-specific warnings

Insights:
- "Your biggest expense category was Activities (42%)"
- "You saved $230 compared to average traveler"
- Cost per day breakdown
- Most expensive/cheapest day

Export Options:
- CSV for personal records
- PDF expense report (for reimbursement)
- Share with travel companions

Currency Exchange:
- Current rates (updated daily)
- Historical rates (for past trip analysis)
- "Best places to exchange in [city]" tips
```

**Prompt 6.2 - Offline Mode & Progressive Web App**
```
Implement robust offline functionality:

Offline Capabilities:
1. View saved trips (read-only when offline)
2. Access activity details, maps, and directions
3. View photos and trip notes
4. Check budget and expenses
5. Read community tips and guides

Service Worker Strategy:
```javascript
// Cache strategy for different resource types
const CACHE_STRATEGY = {
  app_shell: 'cache-first',        // Core app UI
  itineraries: 'network-first',    // User data, stale-while-revalidate
  images: 'cache-first',           // Photos, lazy load
  api_calls: 'network-first'       // Fresh data preferred
}

// Offline page fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
```

Data Syncing:
- Queue actions taken offline (adding activity, editing trip)
- Auto-sync when connection restored
- Conflict resolution (local changes vs. server changes)
- Visual indicator: "Syncing..." → "All caught up!"

Offline Map Access:
- Download specific regions for offline use
- Uses Mapbox offline SDK or similar
- Size estimates before download
- Auto-delete after trip dates pass

PWA Features:
- Install prompt on mobile/desktop
- App icon on home screen
- Splash screen
- Push notifications (trip reminders, suggestions)
- Background sync

Performance Optimizations:
- Lazy load non-critical images
- Compress cached data
- Limit cache size (clear old data)
- Preload next likely pages

Testing Offline:
- Chrome DevTools (simulate offline)
- Test on actual poor connection (3G throttling)
- Ensure graceful degradation
```

**Prompt 6.3 - Multi-language Support (i18n)**
```
Implement internationalization for key markets:

Supported Languages:
- English (primary)
- Spanish
- French
- German
- Dutch
- Mandarin
- Japanese
- Portuguese
- Italian

Translation Strategy:
1. UI strings: Full translation
2. User-generated content: Optional auto-translate (Google Translate API)
3. Activity descriptions: English + professional translations
4. Community posts: Show in original language + translate button

Implementation:
```javascript
// Using i18next or similar library
import i18n from 'i18next';

i18n.init({
  lng: 'en',  // Default language
  fallbackLng: 'en',
  resources: {
    en: { translation: require('./locales/en.json') },
    es: { translation: require('./locales/es.json') },
    // ...
  }
});

// Usage in React components
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome_message')}</h1>;
}
```

Date & Number Formatting:
- Locale-aware date formats (MM/DD vs. DD/MM)
- Currency display ($ vs. €)
- Number formatting (1,000 vs. 1.000)
- 12hr vs. 24hr time

Language Switcher:
- Flag dropdown in header
- Persists across sessions (localStorage)
- Auto-detect browser language on first visit
- URL structure: /en/trips/bali or itinara.com/es/trips/bali

Cultural Considerations:
- Right-to-left (RTL) support for future Arabic addition
- Idiom-aware translations (not literal)
- Local payment methods by country
- Privacy laws (GDPR for EU users)

Content Strategy:
- Blog posts: Manually translated by native speakers
- SEO: Separate pages per language (hreflang tags)
- Customer support: Multilingual chat (auto-translate + human fallback)
```

### Phase 7: Testing & Launch Strategy

**Prompt 7.1 - Testing Checklist**
```
Comprehensive testing plan before launch:

1. Functional Testing:
   - User authentication (sign-up, login, password reset)
   - Trip creation and editing (CRUD operations)
   - Activity search and filtering
   - Booking flow (end-to-end)
   - Payment processing (use test API keys)
   - File uploads (photos, documents)
   - Sharing and permissions
   - Offline mode

2. Cross-Browser Testing:
   - Chrome (latest 2 versions)
   - Firefox (latest 2 versions)
   - Safari (desktop & mobile)
   - Edge (latest)
   - Test on Windows, macOS, iOS, Android

3. Responsive Testing:
   - Mobile: 375px, 414px (iPhone sizes)
   - Tablet: 768px, 1024px (iPad)
   - Desktop: 1440px, 1920px
   - Ultra-wide: 2560px+

4. Performance Testing:
   - Lighthouse scores: >90 for all metrics
   - Load time: <3s on 3G, <1s on WiFi
   - Time to Interactive (TTI): <3.5s
   - Largest Contentful Paint (LCP): <2.5s
   - Bundle size optimization

5. Accessibility Testing (WCAG 2.1 Level AA):
   - Screen reader compatibility (NVDA, JAWS, VoiceOver)
   - Keyboard navigation (all interactive elements)
   - Color contrast ratios (4.5:1 minimum)
   - Focus indicators visible
   - ARIA labels present
   - Form validation accessible

6. Security Testing:
   - SQL injection prevention
   - XSS (Cross-Site Scripting) protection
   - CSRF tokens
   - Secure password storage (bcrypt)
   - HTTPS everywhere
   - API rate limiting
   - Input sanitization

7. Usability Testing:
   - 10-15 users from target demographic
   - Task completion: "Plan a 7-day trip to Bali"
   - Think-aloud protocol
   - Measure: Time to complete, errors, satisfaction
   - Iterate based on feedback

8. Load Testing:
   - Simulate 1000 concurrent users
   - Stress test API endpoints
   - Database query optimization
   - CDN performance
   - Server response times under load

Tools to Use:
- Selenium/Playwright for automated testing
- BrowserStack for cross-browser
- Lighthouse CI for performance
- axe DevTools for accessibility
- Postman for API testing
- K6 or JMeter for load testing
```

**Prompt 7.2 - Launch Plan & Marketing Website Copy**
```
Pre-launch and go-to-market strategy:

Phase 1: Soft Launch (Beta)
- Invite-only access (500-1000 users)
- Collect feedback via in-app surveys
- Monitor analytics: usage patterns, drop-off points
- Fix critical bugs
- Refine AI curation based on user ratings
- Duration: 4-6 weeks

Phase 2: Public Launch
- Open registration to all
- Press release to travel publications
- Product Hunt launch
- Social media campaign (Instagram, TikTok, Facebook)
- Influencer partnerships (travel bloggers/vloggers)
- Google Ads & Facebook Ads (targeted campaigns)

Marketing Website Copy:

Homepage Hero:
"Your Indonesia, Perfectly Planned"
Subhead: "Skip the hours of research. Get a curated itinerary that 
blends iconic sights with hidden gems—built by AI, perfected by you."
CTA: "Start Planning Free"

Value Propositions:
1. "Authentic Experiences"
   - "We don't just show you the temples. We connect you with local 
      guides, hidden beaches, and the warungs where locals actually eat."

2. "Smart Curation"
   - "Our AI considers your interests, budget, and travel style to 
      suggest the perfect balance of adventure and relaxation."

3. "Stress-Free Planning"
   - "Drag, drop, done. Build your dream trip in minutes, not days. 
      All your bookings, maps, and notes in one place."

Social Proof:
- "Trusted by 10,000+ travelers from 50+ countries"
- User testimonials with photos
- Average rating: 4.8/5 stars

Call-to-Action Sections:
- "Ready to Explore Indonesia?" → Sign up form
- "Download the app" → iOS & Android links
- "Questions?" → Link to FAQ or live chat

Email Capture (Pre-Launch):
- "Be the first to plan your perfect Indonesian adventure. Join the waitlist."
- Offer: "Get 20% off your first guide booking when we launch"
- Collect: Email, dream destination in Indonesia

Content Marketing:
- Blog: "Ultimate Guide to Bali in 2026", "Hidden Gems in Java"
- YouTube: "How to Use ITINARA" tutorials, destination highlights
- Instagram: User-generated travel photos, tips carousel posts
- TikTok: Quick tips, travel hacks, cultural insights

Partnerships:
- Collaborate with Indonesia tourism board
- Hostels, hotels (affiliate commissions on bookings)
- Travel insurance companies (referral program)
- Airlines (sponsored content, flight deals integration)

Metrics to Track Post-Launch:
- Sign-ups per day
- Trip creation rate
- Activity booking conversion
- User retention (7-day, 30-day)
- Net Promoter Score (NPS)
- Organic vs. paid traffic
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
```

---

## 🛠️ TECH STACK RECOMMENDATIONS

### Frontend
```
Framework: React 18+ (for component reusability, large ecosystem)
OR Next.js 14+ (if SSR/SEO is priority for marketing pages)

State Management: 
- Zustand (lightweight, simple)
- Redux Toolkit (if complex state needed)

Styling:
- Tailwind CSS (rapid development, consistent design system)
- Framer Motion (smooth animations, parallax)
- GSAP (complex scroll animations if needed)

UI Components:
- Radix UI or Headless UI (accessible primitives)
- Custom components for unique brand feel

Map Integration:
- Mapbox GL JS (customizable, offline support)

Image Optimization:
- Next/Image or react-lazy-load-image-component
- Cloudinary or ImageKit for CDN

PWA:
- Workbox (service worker management)
- next-pwa plugin if using Next.js

Forms:
- React Hook Form (performance, DX)
- Zod (validation)
```

### Backend
```
Runtime: Node.js (18+)
Framework: Express.js or Fastify

API Style: RESTful (+ GraphQL for complex queries if needed)

Database:
- PostgreSQL (main relational data: users, trips, bookings)
- Redis (caching, session management)
- MongoDB or Firestore (flexible data like reviews, community posts)

File Storage:
- AWS S3 or Google Cloud Storage (photos, documents)

Authentication:
- NextAuth.js or Auth0
- JWT tokens with refresh mechanism

Payment Processing:
- Stripe (international cards)
- Local payment gateways (Indonesian methods: GoPay, OVO, Dana)

Email Service:
- SendGrid or Amazon SES (transactional emails)

AI Integration:
- Anthropic Claude API (trip curation, chatbot)
- OpenAI DALL-E or Stable Diffusion (image generation if needed)
- Google Cloud Vision API (photo analysis)

Real-time Features:
- Socket.io (chat, live itinerary collaboration)
```

### DevOps & Hosting
```
Hosting:
- Vercel (frontend, if using Next.js)
- AWS EC2 or Google Cloud Run (backend)
- Database: AWS RDS or Supabase

CDN: Cloudflare (global distribution, DDoS protection)

CI/CD:
- GitHub Actions (automated testing, deployment)
- Docker (containerization)

Monitoring:
- Sentry (error tracking)
- Google Analytics + Mixpanel (user analytics)
- Datadog or New Relic (performance monitoring)

Version Control: Git + GitHub
```

### AI & Machine Learning
```
Recommendation Engine:
- Python (scikit-learn, TensorFlow)
- AWS SageMaker or Google Vertex AI (model hosting)

Natural Language Processing:
- Anthropic Claude API (conversational AI)
- spaCy (text analysis, if custom NLP needed)

Computer Vision:
- Google Cloud Vision API (photo tagging)
- OpenCV (custom image processing if needed)
```

---

## 📅 DEVELOPMENT TIMELINE (12-16 weeks)

**Week 1-2: Foundation & Design**
- Finalize brand identity (logo, colors, typography)
- Create design system in Figma
- Build component library (buttons, cards, forms)
- Set up development environment

**Week 3-4: Landing Page & Marketing**
- Develop homepage with animations
- Hero section with parallax
- Features showcase (bento grid)
- Testimonials carousel
- Email capture form
- Deploy to production

**Week 5-7: Core App (MVP)**
- User authentication system
- Dashboard layout
- Trip creation flow
- Activity search & browsing
- Basic itinerary builder (drag-and-drop)
- Activity detail pages

**Week 8-9: AI Integration**
- Integrate Claude API for curation
- Implement conversational trip planner
- Build recommendation engine
- Test AI outputs for quality

**Week 10-11: Advanced Features**
- Community feed
- Sharing & collaboration
- Budget tracker
- Photo upload & tagging
- Offline mode (PWA)

**Week 12-13: Guides & Booking**
- Local guide marketplace
- Booking flow
- Payment integration (Stripe)
- Messaging system

**Week 14: Polish & Testing**
- Bug fixes
- Performance optimization
- Accessibility improvements
- Cross-browser testing
- User acceptance testing

**Week 15-16: Launch Preparation**
- Beta launch to select users
- Collect feedback and iterate
- Marketing materials finalized
- Public launch!

---

## 💰 ESTIMATED BUDGET

### Development Costs
```
Design (Logo, UI/UX, Branding): $5,000 - $8,000
Frontend Development: $15,000 - $25,000
Backend Development: $12,000 - $20,000
AI Integration: $3,000 - $5,000
Testing & QA: $3,000 - $5,000

Total Development: $38,000 - $63,000
```

### Ongoing Costs (Monthly)
```
Hosting & Infrastructure: $200 - $500
Anthropic Claude API: $100 - $500 (based on usage)
Database: $50 - $200
CDN: $50 - $150
Third-party Services (Auth, Payment, Email): $100 - $200
Monitoring & Analytics: $50 - $100

Total Monthly: $550 - $1,650
```

### Marketing Budget (First 6 Months)
```
Social Media Ads: $2,000 - $5,000/month
Influencer Partnerships: $3,000 - $10,000
Content Creation: $1,000 - $2,000/month
SEO/SEM: $500 - $1,500/month

Total Marketing (6mo): $39,000 - $111,000
```

---

## 📊 SUCCESS METRICS (KPIs)

**User Acquisition**
- Monthly Active Users (MAU) target: 10,000 by month 6
- Sign-up conversion rate: >5% of landing page visitors
- App installs (PWA): Track adoption rate

**Engagement**
- Average trips created per user: >2
- Time spent in app: >15 minutes per session
- Return visit rate: >40% within 30 days

**Monetization**
- Activity booking conversion: >10% of created trips
- Average booking value: $200+
- Guide booking rate: >5% of users
- Revenue per user: $50+ in first 90 days

**Satisfaction**
- Net Promoter Score (NPS): >50
- App store rating: >4.5 stars
- User reviews mentioning "easy to use": >60%

**Technical Performance**
- Page load time: <2 seconds
- API response time: <200ms
- Uptime: >99.9%
- Error rate: <1%

---

## 🚀 FUTURE ENHANCEMENTS (Post-MVP)

**Phase 2 Features (Month 6-12)**
- Multi-country support (expand beyond Indonesia to Southeast Asia)
- Group trip planning (collaborative editing, polls)
- Gamification (achievement badges, travel challenges)
- AR features (point phone at landmark for info)
- Voice assistant integration
- Travel journal with rich text editor
- Integration with booking platforms (Booking.com, Airbnb API)

**Phase 3 (Year 2)**
- Mobile native apps (React Native or Flutter)
- Offline-first architecture
- Blockchain-based guide verification
- Carbon footprint calculator
- Sustainable travel recommendations
- Virtual tours (360° previews)
- Live guide video calls during trips

---

## 📝 LEGAL & COMPLIANCE

**Terms of Service & Privacy Policy**
- GDPR compliance (EU users)
- CCPA compliance (California users)
- Cookie consent banner
- Data retention policies
- User data export option

**Business Structure**
- Register company (LLC or Corp)
- Business licenses for travel services
- Insurance (professional liability, cyber)
- Tax registration (for international sales)

**Intellectual Property**
- Trademark "ITINARA" name and logo
- Copyright website content and design
- User-generated content ownership clause

**Payment & Refunds**
- Clear refund policy
- Dispute resolution process
- Escrow for guide payments
- PCI DSS compliance for payment data

---

## 🎯 FINAL AI PROMPT TEMPLATE

For any new feature development, use this structured prompt format:

```
FEATURE: [Name of feature]

CONTEXT:
- User need: [What problem does this solve?]
- User flow: [Step-by-step journey]
- Success criteria: [How do we know it works?]

DESIGN REQUIREMENTS:
- Visual style: [Reference ITINARA design system]
- Layout: [Desktop/mobile specifications]
- Animations: [Describe transitions, hover states]
- Accessibility: [WCAG requirements]

TECHNICAL REQUIREMENTS:
- Frontend: [React components, state management]
- Backend: [API endpoints, database schema]
- Third-party integrations: [APIs, services]
- Performance: [Load time targets, optimization needs]

AI INTEGRATION (if applicable):
- Claude API prompt: [Exact prompt text]
- Expected output: [Format, structure]
- Fallback behavior: [If API fails]
- Human review: [When/how to escalate]

USER TESTING PLAN:
- Test scenarios: [3-5 tasks to validate]
- Success metrics: [Quantifiable goals]
- Edge cases: [What could go wrong?]

GENERATE:
[Specific request: code, design, copy, etc.]
```

---

## 📞 NEXT STEPS

1. **Validate MVP Concept**
   - Survey target users (Europeans, Americans, Australians)
   - What are their biggest pain points planning Indonesia trips?
   - Would they pay for guide services? How much?

2. **Secure Funding (if needed)**
   - Bootstrap vs. seek investors
   - Estimate runway (how long can you develop without revenue?)

3. **Assemble Team**
   - Hire or partner with: Frontend dev, backend dev, designer
   - Consider Indonesian co-founder (local expertise, guide network)

4. **Build Partnerships**
   - Reach out to Indonesia Tourism Board
   - Connect with local guide associations
   - Negotiate with activity providers (commissions)

5. **Legal Setup**
   - Register business entity
   - Open business bank account
   - Set up payment processing

6. **Start Development**
   - Set up repositories (GitHub)
   - Begin with landing page (validate demand)
   - Build MVP in phases per timeline above

---

**Good luck building ITINARA! This plan should give you a comprehensive roadmap from concept to launch. Remember: start with MVP, get real user feedback early, and iterate based on data. The AI prompting strategies will help you work efficiently with development tools and APIs to bring this vision to life.**

---

*Document Version: 1.0*  
*Last Updated: January 2026*  
*Created by: Claude (Anthropic) for ITINARA Project*
