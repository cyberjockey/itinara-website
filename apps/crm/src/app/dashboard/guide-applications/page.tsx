import { getGuideApplications, updateApplicationStatus } from "./actions";
import { Check, X, ExternalLink, Calendar, MapPin, Briefcase } from "lucide-react";
import Link from 'next/link';

async function StatusButton({ id, status, currentStatus }: { id: string; status: 'approved' | 'rejected', currentStatus: string }) {
    "use server";

    if (currentStatus !== 'pending') return null;

    return (
        <form action={async () => {
            "use server";
            await updateApplicationStatus(id, status);
        }}>
            <button
                type="submit"
                className={`p-2 rounded-lg transition-colors ${status === 'approved' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                title={status === 'approved' ? "Approve" : "Reject"}
            >
                {status === 'approved' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
        </form>
    );
}

export default async function GuideApplicationsPage() {
    const applications = await getGuideApplications();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Guide Applications</h1>
                    <p className="text-gray-500 text-sm">Review incoming applications from local guides</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Portfolio</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No applications found yet.</td>
                            </tr>
                        ) : applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{app.full_name}</span>
                                        <span className="text-sm text-gray-500">{app.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={app.experience_notes}>
                                    {app.experience_notes}
                                </td>
                                <td className="px-6 py-4 text-sm text-blue-600">
                                    {app.portfolio_url ? (
                                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                                            Link <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : <span className="text-gray-400">—</span>}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                        ${app.status === 'approved' ? "bg-green-100 text-green-800" :
                                            app.status === 'rejected' ? "bg-red-100 text-red-800" :
                                                "bg-amber-100 text-amber-800"}`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <StatusButton id={app.id} status="approved" currentStatus={app.status} />
                                        <StatusButton id={app.id} status="rejected" currentStatus={app.status} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
