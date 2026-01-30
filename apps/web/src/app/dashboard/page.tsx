import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Calendar, MapPin, MoreHorizontal, Sparkles } from "lucide-react";
import { QuotaWidget } from "@/components/dashboard/QuotaWidget";
import { RankBadge } from "@/components/ui/RankBadge";

import { verifyStripePurchase } from "../actions/stripe";

// ...

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user profile with rank data
    const { data: profile } = await supabase
        .from('profiles')
        .select('rank_points, rank_tier')
        .eq('id', user?.id)
        .single();

    // Handle Payment Success
    const resolvedParams = await searchParams;
    let paymentMessage = null;
    if (resolvedParams?.payment === 'success' && typeof resolvedParams.session_id === 'string') {
        const result = await verifyStripePurchase(resolvedParams.session_id);
        paymentMessage = result.message;
    }

    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 pt-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-2">My Trips</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-lg text-stone-gray/80">Welcome back, {user?.user_metadata?.first_name || 'Traveler'}!</p>
                        {profile && (
                            <RankBadge
                                tier={profile.rank_tier || 'Pendatang'}
                                points={profile.rank_points || 0}
                                compact
                            />
                        )}
                    </div>
                </div>
                <div className="md:min-w-[280px]">
                    <QuotaWidget />
                </div>

            </header>

            {paymentMessage && (
                <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 shadow-sm flex items-center justify-between">
                    <span className="font-medium">{paymentMessage}</span>
                    <Link href="/dashboard" className="text-sm underline opacity-70 hover:opacity-100">Dismiss</Link>
                </div>
            )}

            {trips && trips.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip: any) => {
                        const activityCount = trip.activity_count || 0;
                        const maxActivities = trip.max_activities;
                        const isVIP = trip.trip_type === 'vip';
                        const isNearLimit = !isVIP && maxActivities && activityCount >= maxActivities * 0.8;
                        const isAtLimit = !isVIP && maxActivities && activityCount >= maxActivities;

                        return (
                            <Link href={`/dashboard/trips/${trip.id}`} key={trip.id} className="block group">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 pr-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {isVIP ? (
                                                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit">
                                                            <span>👑</span> VIP
                                                        </div>
                                                    ) : (
                                                        <div className="bg-stone-gray/5 text-terracotta border border-stone-gray/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                                                            <Sparkles className="w-3 h-3" /> Premium
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-xl text-deep-teak group-hover:text-terracotta transition-colors line-clamp-2 leading-tight">{trip.title}</h3>
                                            </div>
                                            <button className="text-stone-gray hover:text-terracotta shrink-0 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-stone-gray/80 font-medium">Activity Limit</span>
                                                <span className={`font-bold ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-stone-gray'}`}>
                                                    {activityCount}{isVIP ? '' : `/${maxActivities || 10}`}
                                                    {isVIP && <span className="text-amber-600 ml-1">∞</span>}
                                                </span>
                                            </div>
                                            {!isVIP && maxActivities && (
                                                <div className="w-full h-1.5 bg-stone-gray/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-terracotta'}`}
                                                        style={{ width: `${Math.min((activityCount / maxActivities) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 text-sm text-stone-gray/80 mt-auto pt-4 border-t border-stone-gray/5">
                                            <div className="flex items-center gap-2.5">
                                                <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                                                <span className="truncate font-medium">{trip.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Calendar className="w-4 h-4 text-terracotta shrink-0" />
                                                <span className="font-medium">
                                                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-gray/20 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center mb-6">
                        <MapPin className="w-10 h-10 text-terracotta/50" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">No trips planned yet</h3>
                    <p className="text-stone-gray max-w-sm mb-8">
                        Ready to explore Indonesia? Start by creating your first itinerary.
                    </p>
                    <Link href="/dashboard/trips/new" className="px-8 py-3 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                        Create New Trip
                    </Link>
                </div>
            )
            }
        </div >
    );
}
