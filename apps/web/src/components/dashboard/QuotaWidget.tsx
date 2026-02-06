import { createClient } from "@/lib/supabase/server";
import { Sparkles, Crown, Plus } from "lucide-react";
import Link from "next/link";

export async function QuotaWidget() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch credits directly from user_quotas table
    // This is the source of truth for trip limits
    const { data: quota, error } = await supabase
        .from("user_quotas")
        .select("premium_trips_remaining, vip_trips_remaining")
        .eq("user_id", user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found error, treat as 0
        console.error("Error fetching quotas:", error);
        return null;
    }

    // Default to 0 if null
    const premiumCredits = quota?.premium_trips_remaining || 0;
    const vipCredits = quota?.vip_trips_remaining || 0;

    return (
        <div className="bg-white rounded-2xl p-4 border border-stone-gray/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-gray uppercase tracking-wider">Your Balance</span>
                <Link href="/dashboard/purchase" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Buy Credits
                </Link>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-terracotta/5 border border-terracotta/10">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1.5 rounded-md shadow-sm">
                            <Sparkles className="w-4 h-4 text-terracotta" />
                        </div>
                        <span className="text-sm font-bold text-deep-teak">Premium</span>
                    </div>
                    <span className="text-lg font-bold text-terracotta">{premiumCredits}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-1.5 rounded-md shadow-sm">
                            <Crown className="w-4 h-4 text-amber-500" />
                        </div>
                        <span className="text-sm font-bold text-deep-teak">VIP</span>
                    </div>
                    <span className="text-lg font-bold text-amber-500">{vipCredits}</span>
                </div>
            </div>
        </div>
    );
}
