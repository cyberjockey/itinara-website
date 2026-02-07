import Link from "next/link";
import Image from "next/image";
import { Plus, MapPin, Calendar, Star } from "lucide-react";
import { getTemplates } from "./actions";
import { getImageUrl } from "@/lib/utils";

export default async function TemplatesPage() {
    const templates = await getTemplates();

    return (
        <div>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Templates</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your curated trip itineraries.</p>
                </div>
                <Link href="/dashboard/templates/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors w-full md:w-auto">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Template</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uses</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {templates.map((template: any) => (
                                <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                {template.featured_image ? (
                                                    <Image
                                                        src={getImageUrl(template.featured_image)}
                                                        alt={template.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <MapPin className="w-5 h-5 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/templates/${template.id}`} className="font-medium text-gray-900 line-clamp-1 hover:text-blue-600 hover:underline">
                                                    {template.title}
                                                </Link>
                                                <p className="text-xs text-gray-500 line-clamp-1">{template.description || 'No description'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{template.destinations?.name || 'Unknown'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{template.duration_days} Days</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{template.use_count || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${template.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : template.status === 'pending_review'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {template.status === 'pending_review' ? 'Pending' : template.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/dashboard/templates/${template.id}`}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Edit →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
