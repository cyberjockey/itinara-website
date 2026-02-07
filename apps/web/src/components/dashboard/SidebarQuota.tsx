"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Crown, Loader2, Plus, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SidebarQuota() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState<{ vip: number; premium: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchCredits() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('user_quotas')
                    .select('vip_trips_remaining, premium_trips_remaining')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setCredits({
                        vip: data.vip_trips_remaining || 0,
                        premium: data.premium_trips_remaining || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching quota:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCredits();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="px-4 py-2">
                <div className="h-12 w-full bg-stone-gray/5 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!credits) return null;

    return (
        <div className="px-4 py-2 relative group">
            <div
                className="bg-white border border-stone-gray/10 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-default relative overflow-hidden group-hover:border-terracotta/30"
            >
                {/* Compact View */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" title="VIP Trip Quota">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-deep-teak">{credits.vip}</span>
                            <span className="text-[10px] font-bold text-amber-600/80 uppercase tracking-tight">VIP</span>
                        </div>
                        <div className="w-px h-4 bg-stone-gray/20" />
                        <div className="flex items-center gap-1.5" title="Premium Trip Quota">
                            <Sparkles className="w-4 h-4 text-terracotta" />
                            <span className="font-bold text-deep-teak">{credits.premium}</span>
                            <span className="text-[10px] font-bold text-terracotta/80 uppercase tracking-tight">Prem</span>
                        </div>
                    </div>

                    <Link href="/dashboard/purchase" className="p-1 hover:bg-stone-gray/5 rounded-full transition-colors">
                        <Plus className="w-4 h-4 text-terracotta" />
                    </Link>
                </div>

                {/* Hover Details / "Pop-up" effect could be added here, but the compact view already shows everything important. 
                    The user asked for "hover rounded widget". 
                    Maybe they meant the DETAILS appear on hover?
                    
                    Let's add a tooltip-like expansion.
                */}
                <div className="absolute bottom-full left-0 w-full mb-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-deep-teak text-white text-xs p-2 rounded-lg shadow-xl text-center">
                        Manage Credits & Top Up
                    </div>
                </div>
            </div>
        </div>
    );
}
