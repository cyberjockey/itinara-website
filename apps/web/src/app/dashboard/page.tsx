import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus, Calendar, MapPin, Sparkles } from "lucide-react";
import { QuotaWidget } from "@/components/dashboard/QuotaWidget";
import { TripCardActions } from "@/components/dashboard/TripCardActions";
import { ClientAnalytics } from "@/components/analytics/ClientAnalytics";

interface Trip {
    id: string;
    title: string;
    status: 'active' | 'planning' | 'completed' | 'cancelled';
    destination: string;
    start_date: string;
    end_date: string;
    activity_count?: number;
    max_activities?: number;
    trip_type?: 'standard' | 'vip';
    source_template_id?: string | null;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch user profile with rank data
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name') // Select something safe or just '*'
        .eq('id', user?.id)
        .single();

    // Handle Payment Success (from PayPal redirect)
    const resolvedParams = await searchParams;
    let paymentMessage = null;
    if (resolvedParams?.payment === 'success') {
        paymentMessage = "Payment successful! Your credits have been added.";
    }

    // Handle Auth Events
    const authEvent = resolvedParams?.event;

    // Fetch unread messages count per trip
    const { data: conversations } = await supabase
        .from('guide_conversations')
        .select('id, trip_id')
        .eq('tourist_id', user.id);

    const { data: unreadMessages } = await supabase
        .from('guide_messages')
        .select('conversation_id')
        .eq('sender_role', 'guide')
        .is('read_at', null)
        .in('conversation_id', conversations?.map(c => c.id) || []);

    const unreadByTrip: Record<string, number> = {};
    unreadMessages?.forEach(msg => {
        const tripId = conversations?.find(c => c.id === msg.conversation_id)?.trip_id;
        if (tripId) {
            unreadByTrip[tripId] = (unreadByTrip[tripId] || 0) + 1;
        }
    });

    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    // Sort and Group Trips
    const now = new Date();

    const activeTripsRaw = (trips as Trip[] | null)?.filter((t: Trip) => t.status === 'active') || [];
    const planningTrips = (trips as Trip[] | null)?.filter((t: Trip) => t.status === 'planning') || [];
    const closedTrips = (trips as Trip[] | null)?.filter((t: Trip) => t.status === 'completed' || t.status === 'cancelled') || [];

    const activeTrips = activeTripsRaw.filter((t: Trip) => new Date(t.end_date) >= now);
    const expiredActiveTrips = activeTripsRaw.filter((t: Trip) => new Date(t.end_date) < now);

    const mainTrips = [...activeTrips, ...planningTrips];
    const inactiveTrips = [...closedTrips, ...expiredActiveTrips];

    const renderTripCard = (trip: Trip) => {
        const activityCount = trip.activity_count || 0;
        const maxActivities = trip.max_activities;
        const isVIP = trip.trip_type === 'vip';
        const isNearLimit = !isVIP && maxActivities && activityCount >= maxActivities * 0.8;
        const isAtLimit = !isVIP && maxActivities && activityCount >= maxActivities;
        const unreadCount = unreadByTrip[trip.id] || 0;

        return (
            <div key={trip.id} className="block group relative">
                <Link href={`/dashboard/trips/${trip.id}`}>
                    <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 cursor-pointer h-full flex flex-col ${trip.status === 'active' ? 'border-terracotta ring-1 ring-terracotta/10 shadow-md' : 'border-stone-gray/10 hover:shadow-xl hover:-translate-y-1'
                        }`}>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-3">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {trip.status === 'active' && (
                                            <div className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Active
                                            </div>
                                        )}
                                        {trip.status === 'completed' && (
                                            <div className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit uppercase tracking-wider">
                                                Completed
                                            </div>
                                        )}

                                        {isVIP ? (
                                            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit">
                                                <span>👑</span> VIP
                                            </div>
                                        ) : trip.source_template_id ? (
                                            <div className="bg-stone-gray/5 text-terracotta border border-stone-gray/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                                                <Sparkles className="w-3 h-3" /> Curated Trip
                                            </div>
                                        ) : null}

                                        {unreadCount > 0 && (
                                            <div className="bg-red-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-fit animate-pulse">
                                                {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-xl text-deep-teak group-hover:text-terracotta transition-colors line-clamp-2 leading-tight">{trip.title}</h3>
                                </div>
                                <div className="z-20 relative">
                                    <TripCardActions tripId={trip.id} tripName={trip.title} />
                                </div>
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
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 pt-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-2">My Trips</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-lg text-stone-gray/80">Welcome back, {user?.user_metadata?.first_name || 'Traveler'}!</p>
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

            {authEvent && (
                <ClientAnalytics
                    event={authEvent as string}
                    params={{ method: 'email' }}
                />
            )}

            {trips && trips.length > 0 ? (
                <div className="space-y-12">
                    {/* Active & Planning Trips */}
                    {mainTrips.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-deep-teak mb-6 flex items-center gap-2">
                                Current Trips
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {mainTrips.map(renderTripCard)}
                            </div>
                        </div>
                    )}

                    {/* Inactive Trips - Collapsible */}
                    {inactiveTrips.length > 0 && (
                        <div className="border-t border-stone-gray/10 pt-8">
                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer list-none text-stone-gray hover:text-deep-teak font-medium transition-colors mb-6">
                                    <span className="text-xl font-bold">Past & Cancelled Trips</span>
                                    <span className="text-sm bg-stone-gray/10 px-2 py-0.5 rounded-full">{inactiveTrips.length}</span>
                                    <div className="transition-transform group-open:rotate-180">▼</div>
                                </summary>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {inactiveTrips.map(renderTripCard)}
                                </div>
                            </details>
                        </div>
                    )}

                    {!mainTrips.length && !inactiveTrips.length && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-gray/20 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center mb-6">
                                <Plus className="w-10 h-10 text-terracotta/50" />
                            </div>
                            <h3 className="text-xl font-bold text-deep-teak mb-2">No trips planned yet</h3>
                            <p className="text-stone-gray max-w-sm mb-8">
                                Ready to explore Indonesia? Start by creating your first itinerary.
                            </p>
                            <Link href="/dashboard/trips/new" className="px-8 py-3 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                                Create New Trip
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-gray/20 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center mb-6">
                        <Plus className="w-10 h-10 text-terracotta/50" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">No trips planned yet</h3>
                    <p className="text-stone-gray max-w-sm mb-8">
                        Ready to explore Indonesia? Start by creating your first itinerary.
                    </p>
                    <Link href="/dashboard/trips/new" className="px-8 py-3 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                        Create New Trip
                    </Link>
                </div>
            )}
        </div>
    );
}
