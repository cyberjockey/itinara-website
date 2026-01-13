import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Calendar, MapPin, MoreHorizontal } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-deep-teak">My Trips</h1>
                    <p className="text-stone-gray">Welcome back, {user?.user_metadata?.first_name || 'Traveler'}!</p>
                </div>
            </header>

            {trips && trips.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip: any) => (
                        <Link href={`/dashboard/trips/${trip.id}`} key={trip.id} className="block group">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-gray/10 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                                <div className="h-48 bg-gray-200 relative shrink-0">
                                    {/* Placeholder image - ideally this would come from the destination or Unsplash */}
                                    <div className="absolute inset-0 bg-stone-gray/10 flex items-center justify-center">
                                        <MapPin className="w-12 h-12 text-stone-gray/20" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-deep-teak uppercase tracking-wider">
                                        {trip.status}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-deep-teak group-hover:text-terracotta transition-colors line-clamp-1">{trip.title}</h3>
                                        <button className="text-stone-gray hover:text-deep-teak shrink-0 ml-2"><MoreHorizontal className="w-5 h-5" /></button>
                                    </div>
                                    <div className="space-y-2 text-sm text-stone-gray mt-auto">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                                            <span className="truncate">{trip.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-terracotta shrink-0" />
                                            <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
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
            )}
        </div>
    );
}
