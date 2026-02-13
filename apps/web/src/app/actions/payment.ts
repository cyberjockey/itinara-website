"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createPayPalOrder, capturePayPalOrder } from "@/services/paypal";

interface PayPalCaptureResult {
    status: string;
    purchase_units?: {
        payments?: {
            captures?: {
                amount?: {
                    value: string;
                    currency_code: string;
                };
            }[];
        };
    }[];
    metadata?: {
        userEmail?: string;
    };
}

interface QuotaUpdates {
    premium_trips_remaining?: number;
    vip_trips_remaining?: number;
    lifetime_trips_purchased: number;
    paid_trips_remaining: number;
    updated_at: string;
}
import { validateCoupon } from "./campaign";
import { revalidatePath } from "next/cache";

// Send Telegram notification for new payment
const sendPaymentNotification = async (
    amountInCents: number,
    credits: number,
    packageType: string,
    creditType: string,
    payerEmail?: string,
    paypalOrderId?: string
) => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error("Telegram notification failed: Missing vars", { hasToken: !!botToken, hasChatId: !!chatId });
            return;
        }

        console.log("Sending Telegram notification...");

        const message = `💰 *New Payment Received!*\n\n` +
            `📦 *Package:* ${packageType}\n` +
            `💎 *Credits:* ${credits} (${creditType.toUpperCase()})\n` +
            `💵 *Amount:* $${(amountInCents / 100).toFixed(2)}\n` +
            `📧 *User:* ${payerEmail || "Unknown"}\n` +
            `🆔 *PayPal ID:* \`${paypalOrderId || "N/A"}\`\n\n` +
            `_Check dashboard for details._`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });
    } catch (error) {
        console.error('Telegram notification error:', error);
    }
};

// Credit package definitions - maps to config/pricing.ts
const CREDIT_PACKAGES = {
    // Single trip credits
    starter: { credits: 1, price: "9.00", name: "Premium Trip", creditType: "premium" },
    explorer: { credits: 1, price: "9.00", name: "Premium Trip", creditType: "premium" },
    adventurer: { credits: 1, price: "30.00", name: "VIP Trip", creditType: "vip" },
    // Premium bundles
    premium_3: { credits: 3, price: "24.00", name: "Explorer Pack", creditType: "premium" },
    premium_5: { credits: 5, price: "35.00", name: "Adventurer Pack", creditType: "premium" },
    // VIP bundles
    vip_2: { credits: 2, price: "50.00", name: "VIP Duo", creditType: "vip" },
    vip_3: { credits: 3, price: "70.00", name: "Digital Nomad", creditType: "vip" },
} as const;

type PackageType = keyof typeof CREDIT_PACKAGES;

// Create a checkout order and record transaction
export async function createCheckoutOrder(packageType: PackageType, couponCode?: string) {
    // Get user and verify auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Reconcile package type (handle mapped Keys from PricingClient)
    let pkg = CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];

    // Fallback: If generic key was passed (e.g. 'premium', which doesn't exist in CREDIT_PACKAGES)
    // We map 'premium' -> 'starter' and 'vip' -> 'adventurer' to be safe
    if (!pkg) {
        if ((packageType as string) === 'premium') pkg = CREDIT_PACKAGES.starter;
        else if ((packageType as string) === 'vip') pkg = CREDIT_PACKAGES.adventurer;
    }

    if (!pkg) {
        console.error(`Invalid package type: ${packageType}`);
        throw new Error("Invalid package type");
    }

    const { credits: creditsToAdd, name: packageTypeDisplay, creditType } = pkg;
    let amountCents = Math.round(parseFloat(pkg.price) * 100);

    // Apply Coupon
    let discountAmount = 0;
    let finalAmount = amountCents;
    let couponId: string | undefined;

    if (couponCode) {
        const couponResult = await validateCoupon(couponCode);
        if (couponResult.valid) {
            couponId = couponResult.couponId;
            if (couponResult.discountType === 'percentage') {
                discountAmount = Math.round(amountCents * (couponResult.discountValue! / 100));
            } else {
                discountAmount = Math.round(couponResult.discountValue! * 100); // Fixed amount in cents
            }
            finalAmount = Math.max(0, amountCents - discountAmount);
        } else {
            throw new Error(couponResult.message || "Invalid coupon");
        }
    }

    // Handle 100% Discount (Direct Grant)
    if (finalAmount <= 0) {
        // Create completed transaction
        const { data: transaction, error } = await supabase
            .from("payment_transactions")
            .insert({
                user_id: user.id,
                amount_total: amountCents,
                // @ts-ignore - Columns added in migration
                final_amount: 0,
                discount_amount: amountCents,
                coupon_id: couponId,
                currency: "USD",
                payment_status: "completed",
                payment_method: "coupon_100",
                payer_email: user.email,
                completed_at: new Date().toISOString(),
                package_type: packageType,
                metadata: {
                    credits: pkg.credits,
                    creditType: pkg.creditType,
                    coupon_code: couponCode
                }
            })
            .select()
            .single();

        if (error) {
            console.error("100% off transaction error:", error);
            throw new Error("Failed to process free redemption");
        }

        // Add credits to user_quotas table using Admin Client
        const adminSupabase = await createAdminClient();
        const { data: quota } = await adminSupabase.from("user_quotas").select("*").eq("user_id", user.id).single();
        const isVip = creditType === 'vip';

        if (!quota) {
            await adminSupabase.from("user_quotas").insert({
                user_id: user.id,
                premium_trips_remaining: isVip ? 0 : creditsToAdd,
                vip_trips_remaining: isVip ? creditsToAdd : 0,
                lifetime_trips_purchased: creditsToAdd,
                paid_trips_remaining: creditsToAdd
            });
        } else {
            const updates: QuotaUpdates = {
                lifetime_trips_purchased: (quota.lifetime_trips_purchased || 0) + creditsToAdd,
                paid_trips_remaining: (quota.paid_trips_remaining || 0) + creditsToAdd,
                updated_at: new Date().toISOString()
            };
            if (isVip) {
                updates.vip_trips_remaining = (quota.vip_trips_remaining || 0) + creditsToAdd;
            } else {
                updates.premium_trips_remaining = (quota.premium_trips_remaining || 0) + creditsToAdd;
            }
            await adminSupabase.from("user_quotas").update(updates).eq("user_id", user.id);
        }

        // Increment coupon usage
        if (couponCode) {
            await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
        }

        // Notify
        await sendPaymentNotification(0, creditsToAdd, packageTypeDisplay, creditType, user.email, "COUPON-100");

        revalidatePath("/dashboard");

        return {
            orderId: "COUPON-GRANT",
            transactionId: transaction.id,
        };
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(
        finalAmount, // Use discounted amount
        "USD",
        {
            userId: user.id,
            userEmail: user.email || "",
            planType: pkg.creditType as 'premium' | 'vip',
            tripCount: pkg.credits
        }
    );

    // Record pending transaction - use correct column names
    const { data: transaction, error } = await supabase
        .from("payment_transactions")
        .insert({
            user_id: user.id,
            amount_total: amountCents,
            // @ts-ignore
            final_amount: finalAmount,
            discount_amount: discountAmount,
            coupon_id: couponId,
            currency: "USD",
            payment_status: "pending",
            paypal_order_id: paypalOrder.orderId,
            payer_email: null,
            package_type: packageType,
            metadata: {
                credits: pkg.credits,
                creditType: pkg.creditType,
                coupon_code: couponCode
            }
        })
        .select()
        .single();

    if (error) {
        console.error("Transaction record error:", error);
        throw new Error("Failed to initialize transaction");
    }

    return {
        orderId: paypalOrder.orderId,
        transactionId: transaction.id,
    };
}

// Check status and capture payment
export async function capturePayment(orderId: string) {
    if (!orderId) {
        return { success: false, error: "No order ID provided" };
    }

    // Capture payment
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Capture the PayPal order first
    const captureResult = await capturePayPalOrder(orderId);

    if (captureResult.status !== "COMPLETED") {
        throw new Error("Payment capture failed");
    }

    // Get package info from the capture result
    const purchaseUnits = (captureResult as unknown as PayPalCaptureResult).purchase_units?.[0];
    const capturedAmount = purchaseUnits?.payments?.captures?.[0]?.amount;

    let packageType = "starter"; // Default
    let creditsToAdd = 1; // Default
    let creditType = "premium"; // Default
    let packageTypeDisplay = "Premium Trip"; // Default

    // Try to find existing transaction by looking for pending status
    const { data: transactions } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("user_id", user.id)
        .or("payment_status.eq.pending,payment_status.is.null")
        .order("created_at", { ascending: false })
        .limit(5);

    // Find transaction with matching paypal_order_id in metadata
    const transaction = transactions?.find(t =>
        t.metadata?.paypal_order_id === orderId || t.paypal_order_id === orderId
    );

    if (transaction) {
        packageType = transaction.package_type || transaction.metadata?.package_type || "starter";
        creditsToAdd = transaction.metadata?.credits || 1;
        creditType = transaction.metadata?.creditType || "premium";
        packageTypeDisplay = CREDIT_PACKAGES[packageType as PackageType]?.name || "Unknown Package";

        // Update transaction as completed
        await supabase
            .from("payment_transactions")
            .update({
                payment_status: "completed",
                payer_email: captureResult.metadata?.userEmail,
                completed_at: new Date().toISOString(),
            })
            .eq("id", transaction.id);
    } else {
        // If no pending transaction found, try to infer from package type
        const pkg = CREDIT_PACKAGES[packageType as PackageType];
        if (pkg) {
            creditsToAdd = pkg.credits;
            creditType = pkg.creditType;
            packageTypeDisplay = pkg.name;
        }

        // Create transaction record if it doesn't exist
        await supabase
            .from("payment_transactions")
            .insert({
                user_id: user.id,
                amount_total: Math.round(parseFloat(capturedAmount?.value || "9.00") * 100),
                currency: capturedAmount?.currency_code || "USD",
                payment_status: "completed",
                paypal_order_id: orderId,
                payer_email: captureResult.metadata?.userEmail,
                completed_at: new Date().toISOString(),
                package_type: packageType,
                metadata: {
                    credits: creditsToAdd,
                    creditType: creditType,
                }
            });
    }

    // Send Telegram notification immediately after confirmed payment
    await sendPaymentNotification(
        Math.round(parseFloat(capturedAmount?.value || "9.00") * 100),
        creditsToAdd,
        packageTypeDisplay,
        creditType,
        captureResult.metadata?.userEmail,
        orderId
    );

    // Increment coupon usage if applicable
    const couponCode = transaction?.metadata?.coupon_code;
    if (couponCode) {
        await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
    }

    // Add credits to user_quotas table
    // Use Admin Client to bypass RLS
    const adminSupabase = await createAdminClient();

    // Check if quota record exists
    const { data: quota } = await adminSupabase
        .from("user_quotas")
        .select("*")
        .eq("user_id", user.id)
        .single();

    const isVip = creditType === 'vip';

    if (!quota) {
        console.log("Quota record not found, creating new for user:", user.id);

        const { error: createError } = await adminSupabase
            .from("user_quotas")
            .insert({
                user_id: user.id,
                premium_trips_remaining: isVip ? 0 : creditsToAdd,
                vip_trips_remaining: isVip ? creditsToAdd : 0,
                lifetime_trips_purchased: creditsToAdd,
                paid_trips_remaining: creditsToAdd // Assuming all purchased are 'paid'
            });

        if (createError) {
            console.error("Failed to create quota:", createError);
            throw new Error("Failed to initialize user quotas.");
        }
    } else {
        const currentPremium = quota.premium_trips_remaining || 0;
        const currentVip = quota.vip_trips_remaining || 0;
        const currentLifetime = quota.lifetime_trips_purchased || 0;
        const currentPaid = quota.paid_trips_remaining || 0;

        const updates: QuotaUpdates = {
            lifetime_trips_purchased: currentLifetime + creditsToAdd,
            paid_trips_remaining: currentPaid + creditsToAdd,
            updated_at: new Date().toISOString()
        };

        if (isVip) {
            updates.vip_trips_remaining = currentVip + creditsToAdd;
            console.log(`Updating VIP quotas: ${currentVip} + ${creditsToAdd} = ${updates.vip_trips_remaining}`);
        } else {
            updates.premium_trips_remaining = currentPremium + creditsToAdd;
            console.log(`Updating Premium quotas: ${currentPremium} + ${creditsToAdd} = ${updates.premium_trips_remaining}`);
        }

        const { error: updateError } = await adminSupabase
            .from("user_quotas")
            .update(updates)
            .eq("user_id", user.id);

        if (updateError) {
            console.error("Quota update error:", updateError);
            throw new Error("Payment successful but failed to update quotas. Please contact support.");
        }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/purchase");

    return {
        success: true,
        credits: creditsToAdd,
        transactionId: transaction?.id,
    };
}

// Get user's transaction history
export async function getTransactionHistory() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch transactions");

    return data;
}

// Get credit packages for display
export async function getCreditPackages() {
    return Object.entries(CREDIT_PACKAGES).map(([key, value]) => ({
        id: key,
        ...value,
    }));
}

export async function requestInvoice(tripId: string, planType: 'premium' | 'vip', amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Send Telegram notification
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (botToken && chatId) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🧾 *New Invoice Request*\n\nUser: ${user.email}\nPlan: ${planType}\nAmount: $${(amount / 100).toFixed(2)}\nTrip ID: ${tripId}`,
                    parse_mode: 'Markdown',
                }),
            });
        }
    } catch (e) {
        console.error("Failed to send telegram notification for invoice request", e);
    }

    return { success: true };
}
