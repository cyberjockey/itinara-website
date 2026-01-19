import Link from 'next/link'
import { Plus, MapPin, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { getDestinations, deleteDestination } from './actions'
import Image from 'next/image'

export default async function DestinationsPage() {
    const destinations = await getDestinations()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage cities and regions available for trips</p>
                </div>
                <Link
                    href="/dashboard/destinations/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Destination
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                    <div key={dest.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="relative h-48 w-full bg-gray-100">
                            {dest.image_url ? (
                                <Image
                                    src={dest.image_url}
                                    alt={dest.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <MapPin className="w-8 h-8" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Link
                                    href={`/dashboard/destinations/${dest.id}`}
                                    className="p-2 bg-white/90 rounded-full shadow-sm hover:text-blue-600"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{dest.name}</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                    {dest.country}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {dest.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                <span>{dest.guide_count || 0} guides</span>
                                <span>{dest.template_count || 0} templates</span>
                            </div>
                        </div>
                    </div>
                ))}

                {destinations.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <MapPin className="w-12 h-12 mb-3 opacity-20" />
                        <p>No destinations found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
