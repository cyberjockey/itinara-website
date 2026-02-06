import { getTransactions, getTransactionStats } from "./actions";
import { DollarSign, Clock, CheckCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const status = params.status || "all";
    const search = params.search || "";

    const [{ data: transactions, count }, stats] = await Promise.all([
        getTransactions(page, 20, status, search),
        getTransactionStats(),
    ]);

    const totalPages = Math.ceil((count || 0) / 20);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500 text-sm">View all payment transactions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${stats.totalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <form className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by email or PayPal order ID..."
                                defaultValue={search}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <select
                        name="status"
                        defaultValue={status}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                        Filter
                    </button>
                </form>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PayPal ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(tx.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                        <div className="text-xs text-gray-400">
                                            {new Date(tx.created_at).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {tx.payer_email || "Customer"}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">
                                            {tx.user_id?.slice(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-900">
                                            {tx.package_type || "—"}
                                        </span>
                                        {tx.metadata?.credits && (
                                            <div className="text-xs text-gray-500">
                                                {tx.metadata.credits} credits
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                        ${((tx.amount_total || 0) / 100).toFixed(2)} {(tx.currency || "USD").toUpperCase()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.payment_status === "completed" || tx.payment_status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : tx.payment_status === "pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {tx.payment_status || "unknown"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                                        {tx.paypal_order_id ? tx.paypal_order_id.slice(0, 12) + "..." : "—"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {page} of {totalPages} ({count} total)
                        </div>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <Link
                                    href={`/dashboard/transactions?page=${page - 1}&status=${status}&search=${search}`}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link
                                    href={`/dashboard/transactions?page=${page + 1}&status=${status}&search=${search}`}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
