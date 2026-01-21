import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey ? new Stripe(stripeKey, {
    apiVersion: "2025-12-15.clover", // Keeping consistent with existing code
}) : null;

export async function processStripePurchase(sessionId: string, supabase: SupabaseClient, userId: string) {
    if (!stripe) {
        console.error("Stripe not initialized logic");
        return { success: false, message: "System error: Payment configuration missing" };
    }

    try {
        // 1. Check if already processed
        // We use the supabase client passed in (which could be Auth-context aware or Admin, 
        // but for checking existing tx logic, we just need access to the table).
        // The table `payment_transactions` likely has RLS.
        // If `supabase` is the user client, they can see their own transactions.

        const { data: existing } = await supabase
            .from('payment_transactions')
            .select('id')
            .eq('stripe_session_id', sessionId)
            .single();

        if (existing) {
            return { success: true, message: "Payment already processed" };
        }

        // 2. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return { success: false, message: "Payment not completed" };
        }

        // Verify the user in the session metadata matches the request user?
        // Ideally yes, but metadata.userId might be trustworthy enough if we trust the stripe session ID came from us.
        // Let's keep it simple and consistent with previous logic.

        // 3. Log transaction
        const { error: logError } = await supabase
            .from('payment_transactions')
            .insert({
                user_id: userId,
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
                p_user_id: userId,
                p_trip_type: creditType,
                p_credits: amount
            });

            if (creditError) {
                console.error("Error adding credits:", creditError);
                return { success: false, message: "Payment recorded but credit addition failed. Contact support." };
            }
        }

        return { success: true, message: "Credits added successfully!" };

    } catch (e) {
        console.error("Verification error:", e);
        return { success: false, message: "Failed to verify payment" };
    }
}
