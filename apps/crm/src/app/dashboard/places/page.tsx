import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { getPlaces } from "@/app/dashboard/places/actions";
import { Pagination } from "@/components/ui/Pagination";
import { PlaceSearch } from "@/components/places/PlaceSearch";

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
                    <h2 className="text-2xl font-bold text-gray-900">My Places</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage hidden gems and local spots.</p>
                </div>
                <Link href="/dashboard/places/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Place
                </Link>
            </header>

            {/* Show empty state logic ONLY if there are no places AND no active query. 
                If searching, we want to show "No results found" instead of "Add your first place" */}
            {places.length === 0 && count === 0 && !query ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No places added</h3>
                    <p className="text-gray-500 mb-6">Add unique local spots to include in your trip templates.</p>
                    <Link href="/dashboard/places/new" className="text-blue-600 font-medium hover:underline">
                        Add your first place
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 flex gap-2">
                            <PlaceSearch />
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {places.map((place) => (
                                    <tr key={place.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{place.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                {place.type || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{place.location || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/places/${place.id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Control */}
                    <Pagination
                        totalItems={count}
                        currentPage={page}
                        pageSize={limit}
                    />
                </div>
            )}
        </div>
    );
}
