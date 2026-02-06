/**
 * ITINARA Pricing Configuration (2-Tier Model)
 * 
 * IMPORTANT: This is the single source of truth for all pricing logic.
 * Modify this file to adjust pricing, limits, or add new tiers.
 * 
 * All business logic reads from this config, so changes propagate automatically.
 */

// ============================================
// TRIP TYPES (2-Tier Model)
// ============================================

export const TRIP_TYPES = {
    PREMIUM: {
        id: 'premium',
        name: 'Premium Trip',
        displayName: 'Standard',
        description: 'Perfect for weekend getaways and city explorations',
        price: 900, // $9.00 in cents

        // Limits
        maxDays: 7,
        maxActivities: 10,

        // Features
        features: [
            'Up to 7 days',
            'Up to 10 activities',
            'AI itinerary generator',
            'Offline access',
            'Community reviews',
            'Email support',
        ],

        // UI
        badge: null,
        popular: true,
        color: 'terracotta', // For UI theming
    },

    VIP: {
        id: 'vip',
        name: 'VIP Trip',
        displayName: 'Extended',
        description: 'For multi-city adventures and long vacations',
        price: 3000, // $30.00 in cents

        // Limits (unlimited)
        maxDays: null,
        maxActivities: null,

        // Features
        features: [
            'Unlimited duration',
            'Unlimited activities',
            'Priority AI curation',
            'Concierge support',
            'Custom PDF exports',
            'Collaboration tools',
            'Premium templates',
        ],

        // UI
        badge: 'Best for Long Trips',
        popular: false,
        color: 'deep-teak',
    },
} as const;

// ============================================
// CREDIT BUNDLES
// ============================================

export const CREDIT_BUNDLES = [
    // Premium bundles
    {
        id: 'PREMIUM_3',
        name: 'Explorer Pack',
        description: 'Great for multiple destinations',
        tripType: 'premium',
        tripCount: 3,
        price: 2400, // $24 (save $3 = 11%)
        savings: 11,
        badge: 'Popular',
        popular: true,
    },
    {
        id: 'PREMIUM_5',
        name: 'Adventurer Pack',
        description: 'Best value for frequent travelers',
        tripType: 'premium',
        tripCount: 5,
        price: 3500, // $35 (save $10 = 22%)
        savings: 22,
        badge: 'Best Value',
        popular: false,
    },

    // VIP bundles
    {
        id: 'VIP_2',
        name: 'VIP Duo',
        description: 'Two unlimited adventures',
        tripType: 'vip',
        tripCount: 2,
        price: 5000, // $50 (save $10 = 17%)
        savings: 17,
        badge: null,
        popular: false,
    },
    {
        id: 'VIP_3',
        name: 'Digital Nomad',
        description: 'Ultimate package for serial travelers',
        tripType: 'vip',
        tripCount: 3,
        price: 7000, // $70 (save $20 = 22%)
        savings: 22,
        badge: 'Ultimate',
        popular: false,
    },
];

// ============================================
// FREE TIER CONFIGURATION
// ============================================

export const FREE_TIER = {
    enabled: true,
    tripsIncluded: 1,
    tripType: 'premium', // Free trip follows premium limits
    features: [
        '1 free trip credit',
        'Up to 7 days',
        'Up to 10 activities',
        'Basic AI suggestions',
        'Community access',
    ],
};

// ============================================
// BUSINESS RULES
// ============================================

export const PRICING_RULES = {
    // Credit management
    creditExpiryMonths: 12,
    deductionOrder: ['free', 'paid'] as const, // Use free credits first

    // Alerts & Prompts
    lowCreditThreshold: 1,
    showUpgradeOnNoCredits: true,
    showUpgradeOnActivityLimit: true,

    // Trip creation
    allowMixedTripTypes: true, // Users can have both premium & VIP trips

    // Refund policy
    refundWindowDays: 7,
};

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURES = {
    enableBundles: true,
    enableVIPTier: true,
    enableReferrals: false, // Future
    enableSeasonalPricing: false, // Future
    enableGiftCards: false, // Future
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(0)}`;
};

export const calculatePricePerTrip = (bundleId: string): string => {
    const bundle = CREDIT_BUNDLES.find((b) => b.id === bundleId);
    if (!bundle) return '$0';
    return formatPrice(Math.round(bundle.price / bundle.tripCount));
};

export const getTripTypeById = (id: string) => {
    return Object.values(TRIP_TYPES).find((t) => t.id === id);
};

export const getBundleById = (id: string) => {
    return CREDIT_BUNDLES.find((b) => b.id === id);
};

export const getMaxActivities = (tripType: 'premium' | 'vip' | null): number | null => {
    if (!tripType) return TRIP_TYPES.PREMIUM.maxActivities;
    return TRIP_TYPES[tripType.toUpperCase() as keyof typeof TRIP_TYPES].maxActivities;
};

export const getMaxDays = (tripType: 'premium' | 'vip' | null): number | null => {
    if (!tripType) return TRIP_TYPES.PREMIUM.maxDays;
    return TRIP_TYPES[tripType.toUpperCase() as keyof typeof TRIP_TYPES].maxDays;
};

// Get all packages (single + bundles) for pricing page
export const getAllPackages = () => {
    const singles = Object.values(TRIP_TYPES).map(trip => ({
        id: trip.id,
        name: trip.name,
        description: trip.description,
        tripType: trip.id,
        tripCount: 1,
        price: trip.price,
        savings: 0,
        badge: trip.badge,
        popular: trip.popular,
        features: trip.features,
    }));

    return [...singles, ...CREDIT_BUNDLES];
};

// ============================================
// TYPE EXPORTS
// ============================================

export type TripType = keyof typeof TRIP_TYPES;
export type TripTypeId = typeof TRIP_TYPES[TripType]['id'];
export type BundleId = typeof CREDIT_BUNDLES[number]['id'];
export type PackageId = TripTypeId | BundleId;
