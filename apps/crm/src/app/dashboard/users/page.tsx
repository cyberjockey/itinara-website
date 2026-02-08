import { getUsers, verifyGuide } from "./actions";
import { getInvitations } from "./invitation-actions";
import { Check, UserCog } from "lucide-react";
import Image from "next/image";
// import { UserRoleBadge } from "../../../components/users/UserRoleBadge";
import { UsersClient } from "./UsersClient";

interface User {
    id: string;
    full_name: string | null;
    email: string | null;
    username: string | null;
    avatar_url: string | null;
    role: string;
    guide_verified: boolean;
}

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
    const params = await searchParams;
    const roleFilter = params.role || undefined;
    const users: User[] = await getUsers(roleFilter);

    // Fetch pending invitations for admins
    let invitations: Awaited<ReturnType<typeof getInvitations>> = [];
    try {
        invitations = await getInvitations();
    } catch (e) {
        // Non-admins won't have permission - that's fine
        console.error("Failed to fetch invitations", e);
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage user roles and verify local guides.</p>
                </div>
                <UsersClient initialInvitations={invitations} />
            </header>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
                    {/* Filters - Simple Tabs */}
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        <a href="/dashboard/users" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!roleFilter ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
                            All
                        </a>
                        <a href="/dashboard/users?role=local_guide" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${roleFilter === 'local_guide' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
                            Guides
                        </a>
                        <a href="/dashboard/users?role=admin" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${roleFilter === 'admin' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}>
                            Admins
                        </a>
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user: User) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt={user.full_name || ""} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <UserCog className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.full_name || "Unnamed User"}</div>
                                            <div className="text-gray-500 text-xs">{user.email || user.username || "No email visible"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'local_guide' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {user.role || 'traveler'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role === 'local_guide' && (
                                        user.guide_verified ? (
                                            <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">
                                                <Check className="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium">
                                                Pending
                                            </span>
                                        )
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {user.role === 'local_guide' && !user.guide_verified && (
                                            <form action={async () => {
                                                "use server";
                                                await verifyGuide(user.id);
                                            }}>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                    Approve
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No users found matching filters.
                    </div>
                )}
            </div>
        </div>
    );
}

