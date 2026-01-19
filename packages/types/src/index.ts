// Export shared types here
export type UserRole = 'traveler' | 'local_guide' | 'admin';

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string;
    email: string;
}
