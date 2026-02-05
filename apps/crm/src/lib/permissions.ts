/**
 * CRM Permission System
 * Defines all permissions and role-to-permission mappings
 */

// All available permissions in the CRM
export const Permission = {
    // Dashboard
    ACCESS_CRM: 'access_crm',

    // Destinations
    VIEW_DESTINATIONS: 'view_destinations',
    MANAGE_DESTINATIONS: 'manage_destinations',

    // Places/Activities  
    VIEW_PLACES: 'view_places',
    MANAGE_PLACES: 'manage_places',
    MANAGE_ALL_PLACES: 'manage_all_places', // Admin can edit any place

    // Templates
    VIEW_TEMPLATES: 'view_templates',
    MANAGE_TEMPLATES: 'manage_templates',
    MANAGE_ALL_TEMPLATES: 'manage_all_templates', // Admin can edit any template
    APPROVE_TEMPLATES: 'approve_templates',

    // Blog
    VIEW_BLOG: 'view_blog',
    MANAGE_BLOG: 'manage_blog',

    // Static Pages
    VIEW_PAGES: 'view_pages',
    MANAGE_PAGES: 'manage_pages',

    // Landing Pages
    VIEW_LANDING_PAGES: 'view_landing_pages',
    MANAGE_LANDING_PAGES: 'manage_landing_pages',

    // Customers
    VIEW_CUSTOMERS: 'view_customers',

    // User Management
    VIEW_USERS: 'view_users',
    MANAGE_USERS: 'manage_users',
    INVITE_USERS: 'invite_users',

    // Moderation
    VIEW_MODERATION: 'view_moderation',
    MODERATE_CONTENT: 'moderate_content',

    // Profile
    VIEW_OWN_PROFILE: 'view_own_profile',
    EDIT_OWN_PROFILE: 'edit_own_profile',
} as const;

export type PermissionType = typeof Permission[keyof typeof Permission];

// User roles
export const Role = {
    ADMIN: 'admin',
    LOCAL_GUIDE: 'local_guide',
    TRAVELER: 'traveler',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
    [Role.ADMIN]: [
        // Full CRM access
        Permission.ACCESS_CRM,

        // Destinations - full control
        Permission.VIEW_DESTINATIONS,
        Permission.MANAGE_DESTINATIONS,

        // Places - full control over all places
        Permission.VIEW_PLACES,
        Permission.MANAGE_PLACES,
        Permission.MANAGE_ALL_PLACES,

        // Templates - full control including approval
        Permission.VIEW_TEMPLATES,
        Permission.MANAGE_TEMPLATES,
        Permission.MANAGE_ALL_TEMPLATES,
        Permission.APPROVE_TEMPLATES,

        // Blog - full control
        Permission.VIEW_BLOG,
        Permission.MANAGE_BLOG,

        // Pages - full control
        Permission.VIEW_PAGES,
        Permission.MANAGE_PAGES,

        // Landing Pages - full control
        Permission.VIEW_LANDING_PAGES,
        Permission.MANAGE_LANDING_PAGES,

        // Customers - view
        Permission.VIEW_CUSTOMERS,

        // User Management - full control
        Permission.VIEW_USERS,
        Permission.MANAGE_USERS,
        Permission.INVITE_USERS,

        // Moderation - full control
        Permission.VIEW_MODERATION,
        Permission.MODERATE_CONTENT,

        // Profile
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
    ],

    [Role.LOCAL_GUIDE]: [
        // Limited CRM access
        Permission.ACCESS_CRM,

        // Destinations - view only
        Permission.VIEW_DESTINATIONS,

        // Places - own places only
        Permission.VIEW_PLACES,
        Permission.MANAGE_PLACES,

        // Templates - own templates only
        Permission.VIEW_TEMPLATES,
        Permission.MANAGE_TEMPLATES,

        // Profile
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
    ],

    [Role.TRAVELER]: [
        // No CRM access - travelers use the main web app
        // Empty permissions array
    ],
};

/**
 * Route to required permissions mapping
 * Used for middleware-level route protection
 */
export const ROUTE_PERMISSIONS: Record<string, PermissionType[]> = {
    '/dashboard': [Permission.ACCESS_CRM],
    '/dashboard/destinations': [Permission.VIEW_DESTINATIONS],
    '/dashboard/places': [Permission.VIEW_PLACES],
    '/dashboard/templates': [Permission.VIEW_TEMPLATES],
    '/dashboard/blog': [Permission.VIEW_BLOG],
    '/dashboard/pages': [Permission.VIEW_PAGES],
    '/dashboard/landing-pages': [Permission.VIEW_LANDING_PAGES],
    '/dashboard/customers': [Permission.VIEW_CUSTOMERS],
    '/dashboard/users': [Permission.VIEW_USERS],
    '/dashboard/moderation': [Permission.VIEW_MODERATION],
    '/dashboard/profile': [Permission.VIEW_OWN_PROFILE],
};
