'use server';

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe, processStripePurchase } from "@/services/stripe";

export async function createCheckoutSession(priceId: string, metadata: any) {
    if (!stripe) {
        console.error("Stripe not initialized");
        redirect('/pricing?error=stripe_not_configured');
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login?next=/pricing');
    }

    if (!priceId) {
        console.error("Missing Stripe Price ID");
        redirect('/pricing?error=missing_price_id');
    }

    const headersList = await headers();
    const host = headersList.get("host"); // e.g. localhost:3000
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing?payment=cancelled`,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            ...metadata
        },
        client_reference_id: user.id,
    });

    if (session.url) {
        redirect(session.url);
    }
}

export async function getPurchaseHistory() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching purchase history:", error);
        return [];
    }

    return data;
}

export async function verifyStripePurchase(sessionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized" };

    // Use shared logic
    return await processStripePurchase(sessionId, supabase, user.id);
}
