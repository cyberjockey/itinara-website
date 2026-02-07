import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Share2 } from "lucide-react";
import { TripViewToggle } from "@/components/dashboard/TripViewToggle";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/UserAvatar";
// import { Button } from "@/components/ui/button";

export default async function PublicTripPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // Fetch trip details with profile
    const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select("*, profiles(*)")
        .eq("id", params.id)
        .eq("is_public", true)
        .single();

    if (tripError || !trip) {
        return notFound();
    }

    // Fetch activities
    const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .eq("trip_id", params.id)
        .order("day_number", { ascending: true })
        .order("start_time", { ascending: true });


    return (
        <div className="h-screen flex flex-col bg-warm-white">
            {/* Header for Public View */}
            <div className="bg-white border-b border-stone-gray/10 px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    {/* Logo or Brand */}
                    <Link href="/" className="font-heading font-bold text-2xl text-terracotta">
                        ITINARA
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="px-4 py-2 rounded-full text-stone-gray hover:text-deep-teak font-medium transition-colors">
                        Sign In
                    </Link>
                    <Link href="/register" className="px-6 py-2 bg-deep-teak hover:bg-deep-teak/90 text-white rounded-full font-medium transition-colors">
                        Start Planning
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-0 px-6 pt-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-xs uppercase font-bold text-terracotta tracking-wider mb-2">Public Itinerary</div>
                            <h1 className="text-3xl font-heading font-bold text-deep-teak">{trip.title}</h1>
                            <div className="flex items-center gap-4 text-stone-gray mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-terracotta" />
                                    {trip.destination}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-terracotta" />
                                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Guide Section */}
                        <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-full border border-stone-gray/10 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    avatarUrl={trip.profiles?.avatar_url}
                                    size="sm"
                                />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-stone-gray tracking-wider">Hosted by</p>
                                    <p className="text-sm font-bold text-deep-teak transition-colors">
                                        {trip.profiles?.full_name || 'Guide'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reuse TripViewToggle in readOnly mode */}
                <TripViewToggle trip={trip} activities={activities || []} readOnly={true} />
            </div>
        </div>
    );
}
