"use server";

import { createClient } from "@/lib/supabase/client";

export async function getActivePromotions() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('promo_carousel_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error("Error fetching promotions:", error);
        return [];
    }
    return data;
}
