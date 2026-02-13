"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
    const supabase = await createClient();

    const { data: coupons, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching coupons:", error);
        return [];
    }

    return coupons;
}

export async function createCoupon(formData: FormData) {
    const supabase = await createClient();

    const code = formData.get("code") as string;
    const discountType = formData.get("discountType") as "percentage" | "fixed";
    const discountValue = parseFloat(formData.get("discountValue") as string);
    const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;
    const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string).toISOString() : null;

    if (!code || !discountType || isNaN(discountValue)) {
        return { success: false, error: "Invalid input" };
    }

    const { error } = await supabase.from("coupons").insert({
        code: code.toUpperCase(),
        discount_type: discountType,
        discount_value: discountValue,
        max_uses: maxUses,
        expires_at: expiresAt,
        is_active: true
    });

    if (error) {
        console.error("Error creating coupon:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/campaigns");
    return { success: true };
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("coupons")
        .update({ is_active: !currentStatus })
        .eq("id", id);

    if (error) {
        console.error("Error toggling coupon:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/campaigns");
    return { success: true };
}
