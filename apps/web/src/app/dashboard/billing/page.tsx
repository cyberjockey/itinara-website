import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CreditCard, Check, Clock, X, ArrowLeft, Receipt, Crown, Sparkles, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's transactions
    const { data: transactions } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Fetch user's current credits
    const { data: profile } = await supabase
        .from("profiles")
        .select("trip_credits")
        .eq("id", user.id)
        .single();

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

    return (
        <div className="min-h-screen bg-warm-white">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-stone-gray" />
                    </Link>
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-deep-teak">Billing & Credits</h1>
                        <p className="text-stone-gray text-sm">Manage your trip credits and view payment history</p>
                    </div>
                </div>

                {/* Credit Balance Card - Updated Design */}
                <div className="bg-white rounded-2xl p-6 mb-8 border border-stone-gray/10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* VIP Credits */}
                        <div className="flex items-center gap-4">
                            <Crown className="w-8 h-8 text-amber-500" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-deep-teak">{profile?.trip_credits || 0}</span>
                                <span className="text-sm font-bold text-amber-500 uppercase">VIP</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 bg-stone-gray/20"></div>

                        {/* Premium Credits (Placeholder) */}
                        <div className="flex items-center gap-4">
                            <Sparkles className="w-8 h-8 text-rose-500" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-deep-teak">101</span>
                                <span className="text-sm font-bold text-rose-500 uppercase">PREM</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/purchase"
                            className="p-2 hover:bg-stone-50 rounded-full transition-colors"
                            title="Buy More Credits"
                        >
                            <Plus className="w-8 h-8 text-terracotta" />
                        </Link>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl border border-stone-gray/10 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-stone-gray/10 flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-terracotta" />
                        <h2 className="font-bold text-lg text-deep-teak">Transaction History</h2>
                    </div>

                    {transactions && transactions.length > 0 ? (
                        <div className="divide-y divide-stone-gray/10">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 hover:bg-stone-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-terracotta" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-deep-teak capitalize">
                                                    {(tx.package_type || tx.metadata?.package_type || "Credit Purchase").replace("_", " ")}
                                                </div>
                                                <div className="text-xs text-stone-gray">
                                                    {format(new Date(tx.created_at), "MMM d, yyyy 'at' h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-deep-teak">
                                                ${((tx.amount_total || tx.amount || 0) / 100).toFixed(2)} {tx.currency || "USD"}
                                            </div>
                                            <div className="mt-1">{getStatusBadge(tx.payment_status || tx.status)}</div>
                                        </div>
                                    </div>
                                    {(tx.metadata?.credits || tx.credits_purchased) && (tx.payment_status === "completed" || tx.status === "completed" || tx.payment_status === "paid") && (
                                        <div className="mt-2 ml-14 text-sm text-green-600">
                                            +{tx.metadata?.credits || tx.credits_purchased} credit{(tx.metadata?.credits || tx.credits_purchased) > 1 ? "s" : ""} added
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Receipt className="w-6 h-6 text-stone-400" />
                            </div>
                            <p className="text-stone-gray">No transactions yet</p>
                            <Link
                                href="/dashboard/purchase"
                                className="inline-block mt-3 text-terracotta hover:underline text-sm font-medium"
                            >
                                Purchase your first credits
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
