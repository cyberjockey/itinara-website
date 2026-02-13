"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCarouselItems() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('promo_carousel_items')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function getCarouselItem(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('promo_carousel_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function createCarouselItem(data: {
    title: string;
    html_content: string;
    css_content?: string;
    cta_link?: string;
    order_index?: number;
    is_active?: boolean;
}) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('promo_carousel_items')
        .insert(data);

    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/promotions');
}

export async function updateCarouselItem(id: string, data: {
    title?: string;
    html_content?: string;
    css_content?: string;
    cta_link?: string;
    order_index?: number;
    is_active?: boolean;
}) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('promo_carousel_items')
        .update(data)
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/promotions');
}

export async function deleteCarouselItem(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('promo_carousel_items')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/promotions');
}

export async function toggleCarouselItemStatus(id: string, isActive: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('promo_carousel_items')
        .update({ is_active: isActive })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/promotions');
}
