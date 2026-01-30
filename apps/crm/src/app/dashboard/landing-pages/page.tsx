import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, Eye, Layout, Calendar } from "lucide-react";
import { format } from "date-fns";
import { DeleteLandingPageButton } from "@/components/landing-pages/DeleteLandingPageButton";

export default async function LandingPagesListPage() {
    const supabase = await createClient();

    const { data: pages, error } = await supabase
        .from("landing_pages")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching landing pages:", error);
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
                    <p className="text-sm text-gray-500 mt-1">Create campaign pages without deployment</p>
                </div>
                <Link
                    href="/dashboard/landing-pages/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Landing Page
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pages && pages.length > 0 ? (
                            pages.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <Layout className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1">{page.title}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">/promotion/{page.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${page.status === 'published' ? 'bg-green-100 text-green-800' :
                                                page.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {page.published_at ? format(new Date(page.published_at), 'MMM d, yyyy') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/landing-pages/${page.id}`}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            {page.status === 'published' && (
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/promotion/${page.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="View Live"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            )}
                                            <DeleteLandingPageButton pageId={page.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No landing pages found. Create your first campaign!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
