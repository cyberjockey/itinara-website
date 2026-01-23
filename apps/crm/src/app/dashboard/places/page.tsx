import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { getPlaces } from "@/app/dashboard/places/actions";
import { Pagination } from "@/components/ui/Pagination";
import { PlaceSearch } from "@/components/places/PlaceSearch";
import { PlacesTable } from "@/components/places/PlacesTable";

export default async function PlacesPage(props: { searchParams: Promise<{ page?: string; limit?: string; query?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 3;
    const query = searchParams?.query || "";

    // Fetch places with pagination and search
    // Note: getPlaces signature is (destinationId, page, limit, query)
    const { data: places, count } = await getPlaces(undefined, page, limit, query);

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Activities</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage hidden gems and local activities.</p>
                </div>
                <Link href="/dashboard/places/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Activity
                </Link>
            </header>

            {/* Show empty state logic ONLY if there are no places AND no active query. 
                If searching, we want to show "No results found" instead of "Add your first place" */}
            {places.length === 0 && count === 0 && !query ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities added</h3>
                    <p className="text-gray-500 mb-6">Add unique local activities to include in your trip templates.</p>
                    <Link href="/dashboard/places/new" className="text-blue-600 font-medium hover:underline">
                        Add your first activity
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <PlaceSearch />
                    </div>

                    <PlacesTable
                        places={places}
                        pagination={
                            <Pagination
                                key="places-pagination"
                                totalItems={count}
                                currentPage={page}
                                pageSize={limit}
                            />
                        }
                    />
                </div>
            )}
        </div>
    );
}
