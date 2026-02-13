"use server";

import { createClient } from "@/lib/supabase/server";

export interface CouponValidationResult {
    valid: boolean;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    couponId?: string;
    message?: string;
}

export async function validateCoupon(code: string): Promise<CouponValidationResult> {
    const supabase = await createClient();

    // Normalize code
    const normalizedCode = code.trim().toUpperCase();

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', normalizedCode)
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, message: "Invalid or inactive coupon code." };
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, message: "Coupon has expired." };
    }

    // Check usage limits
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
        return { valid: false, message: "Coupon usage limit reached." };
    }

    return {
        valid: true,
        discountType: coupon.discount_type,
        discountValue: Number(coupon.discount_value),
        couponId: coupon.id,
        message: "Coupon applied successfully!"
    };
}

export async function submitGuideApplication(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to apply.");
    }

    const application = {
        user_id: user.id,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        portfolio_url: formData.get("portfolioUrl") as string,
        experience_notes: formData.get("experience") as string,
    };

    const { error } = await supabase.from('guide_applications').insert(application);

    if (error) {
        console.error("Guide application error:", error);
        throw new Error("Failed to submit application. Please try again.");
    }

    return { success: true };
}
