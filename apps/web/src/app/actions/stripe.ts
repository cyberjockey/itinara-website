'use server';

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
    apiVersion: "2024-12-18.acacia", // Use latest or pinned version
}) : null;

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
        // Redirect back with error query param to show toast? 
        // Or just return (but this is a server action void/url redirect).
        // Let's redirect to pricing with error.
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

export async function verifyStripePurchase(sessionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized" };

    try {
        // 1. Check if already processed
        const { data: existing } = await supabase
            .from('payment_transactions')
            .select('id')
            .eq('stripe_session_id', sessionId)
            .single();

        if (existing) {
            return { success: true, message: "Payment already processed" };
        }

        if (!stripe) {
            console.error("Stripe not initialized during verification");
            return { success: false, message: "System error: Payment configuration missing" };
        }

        // 2. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return { success: false, message: "Payment not completed" };
        }

        // 3. Log transaction
        const { error: logError } = await supabase
            .from('payment_transactions')
            .insert({
                user_id: user.id,
                stripe_session_id: sessionId,
                amount_total: session.amount_total,
                currency: session.currency,
                payment_status: session.payment_status,
                metadata: session.metadata
            });

        if (logError) {
            console.error("Error logging transaction:", logError);
            throw new Error("Failed to record transaction");
        }

        // 4. Add Credits
        const type = session.metadata?.type;
        const amount = parseInt(session.metadata?.amount || '0');
        const creditType = session.metadata?.creditType; // 'premium' or 'vip'

        if (amount > 0 && (creditType === 'premium' || creditType === 'vip')) {
            const { error: creditError } = await supabase.rpc('add_trip_credits_by_type', {
                p_user_id: user.id,
                p_trip_type: creditType,
                p_credits: amount
            });

            if (creditError) {
                console.error("Error adding credits:", creditError);
                // We logged the transaction but failed to add credits. 
                // In a real app, this needs manual reconciliation or retry logic.
                return { success: false, message: "Payment recorded but credit addition failed. Contact support." };
            }
        }

        return { success: true, message: "Credits added successfully!" };

    } catch (e) {
        console.error("Verification error:", e);
        return { success: false, message: "Failed to verify payment" };
    }
}
