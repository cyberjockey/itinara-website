"use server";

import { createClient } from "@/lib/supabase/server";
import { requirePermission, Permission } from "@/lib/rbac";

export type Customer = {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    total_trips: number;
    total_spend: number;
    joined_at: string;
};

export type Trip = {
    id: string;
    title: string;
    destination: string;
    start_date: string | null;
    status: string;
};

export type Purchase = {
    id: string;
    package_id: string;
    amount_paid: number;
    purchased_at: string;
    status: string;
};

export type CustomerDetail = Customer & {
    trips: Trip[];
    purchases: Purchase[];
};

export async function getCustomers(query?: string) {
    // RBAC: Only admins can view customers
    await requirePermission(Permission.VIEW_CUSTOMERS);

    const supabase = await createClient();

    // Fetch profiles
    let dbQuery = supabase
        .from('profiles')
        .select(`
            id, 
            full_name, 
            email, 
            avatar_url,
            updated_at
        `)
        .order('updated_at', { ascending: false });

    if (query) {
        dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
    }

    const { data: profiles, error } = await dbQuery;

    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    // For a real production app with many users, we'd use a SQL view or aggregated query.
    // For now, doing parallel fetches or a second query is fine for MVP scale.
    // Let's try to get aggregate data efficiently.

    // Get trip counts
    const { data: trips } = await supabase
        .from('trips')
        .select('user_id');

    // Get purchase sums
    const { data: purchases } = await supabase
        .from('trip_purchases')
        .select('user_id, amount_paid');

    // Aggregate in memory (MVP optimized)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers: Customer[] = profiles.map((profile: any) => { // TODO: Define strict type
        const userTrips = trips?.filter(t => t.user_id === profile.id) || [];
        const userPurchases = purchases?.filter(p => p.user_id === profile.id) || [];
        const totalSpend = userPurchases.reduce((sum, p) => sum + Number(p.amount_paid), 0);

        return {
            id: profile.id,
            full_name: profile.full_name || 'Unknown',
            email: profile.email || '',
            avatar_url: profile.avatar_url,
            total_trips: userTrips.length,
            total_spend: totalSpend,
            joined_at: profile.updated_at || new Date().toISOString() // Fallback
        };
    });

    return customers;
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
    // RBAC: Only admins can view customer details
    await requirePermission(Permission.VIEW_CUSTOMERS);

    const supabase = await createClient();

    // Fetch profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !profile) {
        return null;
    }

    // Fetch trips
    const { data: trips } = await supabase
        .from('trips')
        .select('id, title, destination, start_date, status')
        .eq('user_id', id)
        .order('start_date', { ascending: false });

    // Fetch purchases
    const { data: purchases } = await supabase
        .from('trip_purchases')
        .select('id, package_id, amount_paid, purchased_at, status')
        .eq('user_id', id)
        .order('purchased_at', { ascending: false });

    const totalSpend = purchases?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;

    return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        total_trips: trips?.length || 0,
        total_spend: totalSpend,
        joined_at: profile.updated_at,
        trips: (trips as Trip[]) || [],
        purchases: (purchases as Purchase[]) || []
    };
}
