import Link from "next/link";
import { Plus, MapPin, Calendar, Star } from "lucide-react";
import { getTemplates } from "./actions";

export default async function TemplatesPage() {
    const templates = await getTemplates();

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Templates</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your curated trip itineraries.</p>
                </div>
                <Link href="/dashboard/templates/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Template
                </Link>
            </header>

            {templates.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                    <p className="text-gray-500 mb-6">Start by creating your first trip template to share with travelers.</p>
                    <Link href="/dashboard/templates/new" className="text-blue-600 font-medium hover:underline">
                        Create your first template
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {templates.map((template: any) => (
                        <Link
                            key={template.id}
                            href={`/dashboard/templates/${template.id}`}
                            className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden"
                        >
                            <div className="h-40 bg-gray-200 relative">
                                {template.featured_image ? (
                                    <img
                                        src={template.featured_image}
                                        alt={template.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <MapPin className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-700 uppercase">
                                    {template.status}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{template.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {template.destinations?.name || 'Unknown'}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {template.duration_days} Days
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                                    {template.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-yellow-500  text-xs font-medium">
                                        <Star className="w-3 h-3 fill-current" />
                                        {template.rating || 'New'}
                                    </div>
                                    <span className="text-xs font-medium text-blue-600 group-hover:underline">Edit Itinerary →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
