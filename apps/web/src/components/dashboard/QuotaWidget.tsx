'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap, Plus, AlertCircle, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

interface Quota {
    premium_trips_remaining: number;
    vip_trips_remaining: number;
    total_trips_created: number;
}

export function QuotaWidget() {
    const [quota, setQuota] = useState<Quota | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuota();

        // Subscribe to real-time updates
        const supabase = createClient();
        const channel = supabase
            .channel('quota-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_quotas',
                },
                () => {
                    fetchQuota();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchQuota = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('user_quotas')
                    .select('premium_trips_remaining, vip_trips_remaining, total_trips_created')
                    .eq('user_id', user.id)
                    .single();

                if (!error && data) {
                    setQuota(data);
                }
            }
        } catch (error) {
            console.error('Error fetching quota:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !quota) return null;

    const totalRemaining = quota.premium_trips_remaining + quota.vip_trips_remaining;
    const isLow = totalRemaining <= 1;
    const isZero = totalRemaining === 0;
    const hasVIP = quota.vip_trips_remaining > 0;

    return (
        <div className={`rounded-2xl p-5 border-2 transition-all duration-300 ${isZero
                ? 'bg-red-50 border-red-300 shadow-md'
                : hasVIP
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
                    : isLow
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gradient-to-br from-rice-paddy-green/10 to-ocean-turquoise/10 border-stone-gray/20'
            }`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isZero
                            ? 'bg-red-200'
                            : hasVIP
                                ? 'bg-gradient-to-br from-amber-200 to-yellow-200'
                                : isLow
                                    ? 'bg-orange-200'
                                    : 'bg-white shadow-sm'
                        }`}>
                        {isZero ? (
                            <AlertCircle className="w-5 h-5 text-red-700" />
                        ) : hasVIP ? (
                            <Crown className="w-5 h-5 text-amber-700" />
                        ) : (
                            <Zap className={`w-5 h-5 ${isLow ? 'text-orange-600' : 'text-terracotta'}`} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-deep-teak text-sm flex items-center gap-2">
                            Trip Credits
                            {hasVIP && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                                    VIP
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-stone-gray/80">
                            {isZero ? (
                                <span className="text-red-700 font-medium">No credits remaining</span>
                            ) : (
                                <>
                                    <span className="font-bold text-deep-teak">{totalRemaining}</span>
                                    {' '}{totalRemaining === 1 ? 'trip' : 'trips'} left
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {(isLow || isZero) && (
                    <Link
                        href="/dashboard/purchase"
                        className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md ${isZero
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-terracotta text-white hover:bg-deep-teak'
                            }`}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Buy More</span>
                        <span className="sm:hidden">Buy</span>
                    </Link>
                )}
            </div>

            {/* Breakdown */}
            {totalRemaining > 0 && (quota.premium_trips_remaining > 0 || quota.vip_trips_remaining > 0) && (
                <div className="mt-3 pt-3 border-t border-stone-gray/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-stone-gray/80">
                        {quota.premium_trips_remaining > 0 && (
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-terracotta" />
                                {quota.premium_trips_remaining} Premium
                            </span>
                        )}
                        {quota.vip_trips_remaining > 0 && (
                            <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-600" />
                                {quota.vip_trips_remaining} VIP
                            </span>
                        )}
                    </div>
                    {!isLow && (
                        <Link
                            href="/dashboard/purchase"
                            className="text-terracotta hover:text-deep-teak font-medium transition-colors"
                        >
                            Get more →
                        </Link>
                    )}
                </div>
            )}

            {/* Zero state message */}
            {isZero && (
                <div className="mt-3 pt-3 border-t border-red-200 text-xs text-red-800">
                    <p className="font-medium">Purchase credits to create more trips</p>
                </div>
            )}
        </div>
    );
}
