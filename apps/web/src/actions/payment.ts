"use server";

import { createClient } from "@/lib/supabase/server";
import { createPayPalOrder, capturePayPalOrder } from "@/services/paypal";
import { sendTelegramNotification } from "@/services/telegram";
import { TRIP_TYPES, CREDIT_BUNDLES } from "@/config/pricing";

/**
 * Create a PayPal checkout order
 */
export async function createCheckoutOrder(
    planType: 'premium' | 'vip',
    tripCount: number = 1,
    tripId?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // Calculate price
    let amountCents: number;
    if (tripCount === 1) {
        const tripType = planType === 'vip' ? TRIP_TYPES.VIP : TRIP_TYPES.PREMIUM;
        amountCents = tripType.price;
    } else {
        // Find bundle
        const bundle = CREDIT_BUNDLES.find(
            b => b.tripType === planType && b.tripCount === tripCount
        );
        if (!bundle) {
            throw new Error(`Invalid bundle: ${planType} x${tripCount}`);
        }
        amountCents = bundle.price;
    }

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder(amountCents, 'USD', {
        userId: user.id,
        userEmail: user.email || '',
        planType,
        tripCount,
        tripId,
    });

    // Create pending transaction record
    await supabase.from('payment_transactions').insert({
        user_id: user.id,
        paypal_order_id: orderId,
        amount_total: amountCents,
        currency: 'USD',
        payment_status: 'pending',
        payment_method: 'paypal',
        metadata: {
            plan_type: planType,
            trip_count: tripCount,
            trip_id: tripId,
            user_email: user.email,
        },
    });

    return { orderId, approvalUrl };
}

/**
 * Capture payment and add trip credits
 */
export async function capturePayment(orderId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // Capture the PayPal order
    const result = await capturePayPalOrder(orderId);

    if (!result.success) {
        // Update transaction as failed
        await supabase
            .from('payment_transactions')
            .update({ payment_status: 'failed' })
            .eq('paypal_order_id', orderId);

        throw new Error("Payment capture failed");
    }

    // Get transaction details
    const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('paypal_order_id', orderId)
        .single();

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    const planType = transaction.metadata?.plan_type || 'premium';
    const tripCount = transaction.metadata?.trip_count || 1;

    // Add trip credits
    const { error: creditError } = await supabase.rpc('add_trip_credits_by_type', {
        p_user_id: user.id,
        p_trip_type: planType,
        p_credits: tripCount,
    });

    if (creditError) {
        console.error("Failed to add credits:", creditError);
        // Still mark as completed, but log the issue
    }

    // Update transaction as completed
    await supabase
        .from('payment_transactions')
        .update({
            payment_status: 'completed',
            invoice_id: result.captureId,
        })
        .eq('paypal_order_id', orderId);

    // Send notification
    const message = `
*Payment Completed* ✅
*User:* ${user.email}
*Plan:* ${planType.toUpperCase()} x${tripCount}
*Amount:* $${(transaction.amount_total / 100).toFixed(2)}
*PayPal Order:* \`${orderId}\`
    `.trim();

    await sendTelegramNotification(message);

    return {
        success: true,
        planType,
        tripCount,
        amount: transaction.amount_total / 100,
    };
}

// Keep legacy function for backward compatibility
export async function requestInvoice(tripId: string, planType: 'premium' | 'vip', amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .insert({
            user_id: user.id,
            amount_total: amount,
            currency: 'USD',
            payment_status: 'request',
            payment_method: 'paypal_manual',
            metadata: {
                trip_id: tripId,
                plan_type: planType,
                user_email: user.email
            }
        })
        .select()
        .single();

    if (error) {
        console.error("Transaction creation failed:", error);
        throw new Error("Failed to create transaction request");
    }

    const message = `
*New Invoice Request* 📝
*User:* ${user.email}
*Plan:* ${planType}
*Amount:* $${(amount / 100).toFixed(2)}
*Trip ID:* \`${tripId}\`

Please check CRM to generate invoice.
    `.trim();

    const crmUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/transactions`;

    await sendTelegramNotification(message, [
        { text: "Open CRM", url: crmUrl }
    ]);

    return { success: true, id: transaction.id };
}

/**
 * Get current user's transaction history
 */
export async function getUserTransactions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data: transactions, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }

    return transactions;
}
