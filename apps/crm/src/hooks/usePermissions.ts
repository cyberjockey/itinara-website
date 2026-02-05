"use client";

/**
 * Client-side permission hooks
 * For conditional UI rendering based on user permissions
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ROLE_PERMISSIONS, type PermissionType, type RoleType } from '@/lib/permissions';

interface PermissionState {
    role: RoleType | null;
    permissions: PermissionType[];
    isLoading: boolean;
}

/**
 * Hook to get current user's permissions
 */
export function usePermissions(): PermissionState {
    const [state, setState] = useState<PermissionState>({
        role: null,
        permissions: [],
        isLoading: true,
    });

    useEffect(() => {
        async function fetchPermissions() {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setState({ role: null, permissions: [], isLoading: false });
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const role = (profile?.role as RoleType) || null;
            const permissions = role ? (ROLE_PERMISSIONS[role] || []) : [];

            setState({ role, permissions, isLoading: false });
        }

        fetchPermissions();
    }, []);

    return state;
}

/**
 * Hook to check if current user has a specific permission
 */
export function useHasPermission(permission: PermissionType): boolean {
    const { permissions, isLoading } = usePermissions();

    if (isLoading) return false;
    return permissions.includes(permission);
}

/**
 * Hook to check if current user has any of the specified permissions
 */
export function useHasAnyPermission(permissionsToCheck: PermissionType[]): boolean {
    const { permissions, isLoading } = usePermissions();

    if (isLoading) return false;
    return permissionsToCheck.some(p => permissions.includes(p));
}

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin(): boolean {
    const { role, isLoading } = usePermissions();

    if (isLoading) return false;
    return role === 'admin';
}

/**
 * Hook to check if current user is a local guide
 */
export function useIsLocalGuide(): boolean {
    const { role, isLoading } = usePermissions();

    if (isLoading) return false;
    return role === 'local_guide';
}
