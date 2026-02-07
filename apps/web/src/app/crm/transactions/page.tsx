import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CreditCard, Check, Clock, X, DollarSign } from "lucide-react";
import Link from "next/link";

interface Transaction {
    id: string;
    status: string;
    amount: number;
    currency: string;
    credits_purchased: number;
    paypal_order_id: string;
    created_at: string;
    payer_email?: string;
    profiles?: {
        full_name: string;
        email: string;
        avatar_url?: string;
    };
    package_type?: string;
}

export default async function TransactionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin (you may want to add proper RBAC)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin" && profile?.role !== "guide") {
        redirect("/dashboard");
    }

    // Fetch all transactions
    const { data: transactions } = await supabase
        .from("payment_transactions")
        .select(`
            *,
            profiles:user_id(full_name, email, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3" /> Completed
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <X className="w-3 h-3" /> Failed
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                        {status}
                    </span>
                );
        }
    };

    // Calculate totals
    const completedTransactions = transactions?.filter(t => t.status === "completed") || [];
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalCredits = completedTransactions.reduce((sum, t) => sum + (t.credits_purchased || 0), 0);

    return (
        <div className="min-h-screen bg-warm-white">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-deep-teak">Transactions</h1>
                        <p className="text-stone-gray text-sm">View and manage all payment transactions</p>
                    </div>
                    <Link
                        href="/crm"
                        className="px-4 py-2 text-sm text-stone-gray hover:text-deep-teak transition-colors"
                    >
                        ← Back to CRM
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-stone-gray/10 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-gray text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-deep-teak">${totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-stone-gray/10 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-gray text-sm">Total Transactions</p>
                                <p className="text-2xl font-bold text-deep-teak">{transactions?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-terracotta/10 rounded-xl">
                                <CreditCard className="w-6 h-6 text-terracotta" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-stone-gray/10 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-gray text-sm">Credits Sold</p>
                                <p className="text-2xl font-bold text-deep-teak">{totalCredits}</p>
                            </div>
                            <div className="p-3 bg-sunrise-gold/10 rounded-xl">
                                <Check className="w-6 h-6 text-sunrise-gold" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl border border-stone-gray/10 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-stone-gray/10 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-deep-teak">All Transactions</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b border-stone-gray/10">
                                <tr>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">User</th>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">Package</th>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">Amount</th>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">Status</th>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">PayPal Order</th>
                                    <th className="text-left p-4 text-xs font-bold text-stone-gray uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-gray/10">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((tx: Transaction) => (
                                        <tr key={tx.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta font-bold text-sm">
                                                        {tx.profiles?.full_name?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-deep-teak text-sm">
                                                            {tx.profiles?.full_name || "Unknown"}
                                                        </div>
                                                        <div className="text-xs text-stone-gray">
                                                            {tx.payer_email || tx.profiles?.email || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="capitalize font-medium text-sm">
                                                    {tx.package_type?.replace("_", " ") || "-"}
                                                </span>
                                                {tx.credits_purchased && (
                                                    <div className="text-xs text-stone-gray">
                                                        {tx.credits_purchased} credit{tx.credits_purchased > 1 ? "s" : ""}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="font-bold text-deep-teak">
                                                    ${tx.amount?.toFixed(2)}
                                                </span>
                                                <span className="text-xs text-stone-gray ml-1">{tx.currency}</span>
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(tx.status)}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                                    {tx.paypal_order_id?.slice(0, 12) || "-"}...
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-stone-gray">
                                                {format(new Date(tx.created_at), "MMM d, yyyy")}
                                                <div className="text-xs">{format(new Date(tx.created_at), "h:mm a")}</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-stone-gray">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
