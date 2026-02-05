/**
 * RBAC Utility Functions
 * Server-side permission checking utilities
 */

import { createClient } from '@/lib/supabase/server';
import { ROLE_PERMISSIONS, Permission, Role, type PermissionType, type RoleType } from './permissions';

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: RoleType | string | null | undefined, permission: PermissionType): boolean {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role as RoleType];
    if (!permissions) return false;
    return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: RoleType | string | null | undefined, permissions: PermissionType[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: RoleType | string | null | undefined, permissions: PermissionType[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get the current user's role from Supabase
 * Returns null if not authenticated or profile not found
 */
export async function getUserRole(): Promise<RoleType | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return (profile?.role as RoleType) || null;
}

/**
 * Get the current user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === Role.ADMIN;
}

/**
 * Check if current user is a local guide
 */
export async function isLocalGuide(): Promise<boolean> {
    const role = await getUserRole();
    return role === Role.LOCAL_GUIDE;
}

/**
 * Check if current user is a local guide or admin
 */
export async function isGuideOrAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === Role.ADMIN || role === Role.LOCAL_GUIDE;
}

/**
 * Require a specific permission - throws Error if not authorized
 * Use in server actions to protect mutations
 */
export async function requirePermission(permission: PermissionType): Promise<void> {
    const role = await getUserRole();

    if (!role) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasPermission(role, permission)) {
        throw new Error(`Forbidden: Missing permission '${permission}'`);
    }
}

/**
 * Require any of the specified permissions - throws Error if not authorized
 */
export async function requireAnyPermission(permissions: PermissionType[]): Promise<void> {
    const role = await getUserRole();

    if (!role) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasAnyPermission(role, permissions)) {
        throw new Error(`Forbidden: Missing required permissions`);
    }
}

/**
 * Check if current user can access/modify a specific resource
 * Admins can access any resource, guides can only access their own
 */
export async function canAccessResource(resourceOwnerId: string): Promise<boolean> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role;

    // Admins can access any resource
    if (role === Role.ADMIN) return true;

    // Others can only access their own resources
    return user.id === resourceOwnerId;
}

/**
 * Require ownership or admin role for resource access
 * Throws Error if not authorized
 */
export async function requireResourceAccess(resourceOwnerId: string): Promise<void> {
    const canAccess = await canAccessResource(resourceOwnerId);
    if (!canAccess) {
        throw new Error('Forbidden: You do not have access to this resource');
    }
}

// Re-export Permission and Role for convenience
export { Permission, Role, type PermissionType, type RoleType };
