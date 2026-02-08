"use server";

import { createClient } from "@/lib/supabase/server";

export interface Transaction {
    id: string;
    user_id: string;
    amount_total: number;
    currency: string;
    payment_status: string;
    package_type: string | null;
    paypal_order_id: string | null;
    payer_email: string | null;
    created_at: string;
    completed_at: string | null;
    metadata?: {
        credits?: number;
    };
}

export async function getTransactions(
    page = 1,
    limit = 20,
    status?: string,
    _search?: string
) {
    const supabase = await createClient();

    let query = supabase
        .from("payment_transactions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (status && status !== "all") {
        query = query.eq("payment_status", status);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching transactions:", error);
        return { data: [], count: 0 };
    }

    // Transform data to normalize fields
    const transactions = (data || []).map(tx => ({
        ...tx,
        amount_total: tx.amount_total || 0,
        currency: tx.currency || "USD",
        payment_status: tx.payment_status || "unknown",
        package_type: tx.package_type || tx.metadata?.package_type || null,
        paypal_order_id: tx.paypal_order_id || tx.metadata?.paypal_order_id || null,
        payer_email: tx.payer_email || tx.metadata?.payer_email || null,
    }));

    return { data: transactions as Transaction[], count: count || 0 };
}

export async function getTransactionStats() {
    const supabase = await createClient();

    // Get totals
    const { data: completed } = await supabase
        .from("payment_transactions")
        .select("amount_total")
        .eq("payment_status", "completed");

    const { data: pending } = await supabase
        .from("payment_transactions")
        .select("id")
        .eq("payment_status", "pending");

    // Sum amount_total (cents) and divide by 100
    const totalRevenueCents = completed?.reduce((sum, t) => sum + (t.amount_total || 0), 0) || 0;
    const totalRevenue = totalRevenueCents / 100;

    const pendingCount = pending?.length || 0;
    const completedCount = completed?.length || 0;

    return {
        totalRevenue,
        pendingCount,
        completedCount,
    };
}
