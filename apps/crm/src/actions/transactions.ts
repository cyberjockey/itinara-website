"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
    const supabase = await createClient();

    // Fetch transactions with basic user info from metadata or join if possible (currently metadata contains email)
    const { data: transactions, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

    // Note: Join with auth.users might fail if permissions aren't set up for the service role to read users, 
    // or if the relation isn't explicit in Postgrest. 
    // However, we stored user_email in metadata as backup. 

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    return (transactions || []) as unknown[];
}

export async function updateTransactionStatus(id: string, status: string, invoiceId?: string) {
    const supabase = await createClient();

    const updateData: Record<string, string> = { payment_status: status };
    if (invoiceId) {
        updateData.invoice_id = invoiceId;
    }

    const { error } = await supabase
        .from('payment_transactions')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error("Error updating transaction:", error);
        throw new Error("Failed to update transaction status");
    }

    revalidatePath('/dashboard/transactions');
    return { success: true };
}
