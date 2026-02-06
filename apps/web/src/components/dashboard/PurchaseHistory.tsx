"use client";

import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/app/actions/payment";
import { Loader2, Receipt, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface Transaction {
    id: string;
    amount_total: number;
    currency: string;
    payment_status: string;
    created_at: string;
    metadata: any;
    package_type?: string;
    payer_email?: string;
}

export function PurchaseHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const data = await getTransactionHistory();
                setTransactions(data || []);
            } catch (error) {
                console.error("Failed to load purchase history", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed':
            case 'paid':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Paid</span>;
            case 'pending':
            case 'request':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> {s === 'request' ? 'Requested' : 'Pending'}</span>;
            case 'invoice_sent':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><Receipt className="w-3 h-3" /> Invoice Sent</span>;
            case 'cancelled':
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-terracotta" /></div>;
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center p-8 border border-stone-gray/10 rounded-xl bg-stone-gray/5">
                <Receipt className="w-10 h-10 text-stone-gray/40 mx-auto mb-3" />
                <p className="text-stone-gray font-medium">No purchase history found.</p>
                <p className="text-sm text-stone-gray/60">Your transactions will appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden border border-stone-gray/10 rounded-xl">
            <table className="w-full text-left text-sm">
                <thead className="bg-rice-paddy-green/5 text-deep-teak font-semibold border-b border-stone-gray/10">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-gray/10">
                    {transactions.map((tx) => {
                        const planType = tx.metadata?.plan_type || tx.metadata?.creditType || (tx.package_type?.includes('vip') ? 'vip' : 'premium');
                        const credits = tx.metadata?.trip_count || tx.metadata?.credits || 1;

                        return (
                            <tr key={tx.id} className="hover:bg-stone-gray/5 transition-colors">
                                <td className="px-4 py-3 text-stone-gray whitespace-nowrap">
                                    {new Date(tx.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 font-medium text-deep-teak">
                                    <div className="flex flex-col">
                                        <span>{planType === 'vip' ? 'VIP' : 'Premium'} Credits Pack</span>
                                        <span className="text-[10px] text-stone-gray font-normal">{credits} Trip{credits > 1 ? 's' : ''}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-bold text-deep-teak">
                                    {(tx.amount_total / 100).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: tx.currency ? tx.currency.toUpperCase() : 'USD'
                                    })}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(tx.payment_status)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
