import { getCustomers } from "./actions";
import Link from "next/link";
import { Search, User } from "lucide-react";

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params.q || "";
    const customers = await getCustomers(query);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage users and view their trip history.</p>
                </div>
            </header>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <form className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                    />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500">User</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Contact</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Total Trips</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Total Spend</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {customer.avatar_url ? (
                                            <img
                                                src={customer.avatar_url}
                                                alt={customer.full_name || "User"}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="font-medium text-gray-900">{customer.full_name || "Unnamed User"}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {customer.total_trips} Trips
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ${customer.total_spend.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/dashboard/customers/${customer.id}`}
                                        className="text-[#2C5F88] hover:text-[#1a3a53] font-medium text-xs hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
