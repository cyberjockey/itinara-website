import { getPendingTemplates, approveTemplate, rejectTemplate } from "../templates/actions";
import Link from "next/link";
import { CheckCircle, XCircle, FileText, User, MapPin, Clock } from "lucide-react";

export default async function ModerationPage() {
    const pendingTemplates = await getPendingTemplates();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Content Moderation
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {pendingTemplates.length} Pending
                    </span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Review and approve trip templates submitted by guides.</p>
            </header>

            <div className="grid gap-4">
                {pendingTemplates.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pendingTemplates.map((template: any) => (
                        <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                Pending Review
                                            </span>
                                            {template.trip_type === 'vip' && (
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                    VIP
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                            <Link href={`/dashboard/templates/${template.id}`} className="hover:underline">
                                                {template.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{template.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4" />
                                            <span className="text-gray-700 font-medium">{template.profiles?.full_name || 'Unknown Guide'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {template.destinations?.name || 'Unknown Location'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {template.duration_days} Days
                                        </div>
                                    </div>

                                    {template.guide_material_url && (
                                        <div className="inline-flex items-center gap-2 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                            <FileText className="w-3 h-3" />
                                            <span>Has Exclusive PDF Material</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <form action={async () => {
                                        "use server";
                                        await approveTemplate(template.id);
                                    }}>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                    </form>

                                    <form action={async () => {
                                        "use server";
                                        await rejectTemplate(template.id);
                                    }}>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                        <p className="text-gray-500">No templates currently pending review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
