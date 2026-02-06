"use client";

import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/app/actions/payment";
import { Loader2, Receipt } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    package_type: string;
    credits_purchased: number;
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
                <thead className="bg-stone-gray/5 text-deep-teak font-semibold border-b border-stone-gray/10">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-gray/10">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-stone-gray/5 transition-colors">
                            <td className="px-4 py-3 text-stone-gray">
                                {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 font-medium text-deep-teak">
                                {tx.package_type?.includes('vip') ? 'VIP' : 'Premium'} Credits ({tx.credits_purchased})
                            </td>
                            <td className="px-4 py-3 text-deep-teak">
                                ${tx.amount?.toFixed(2)} {tx.currency?.toUpperCase()}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                    ${tx.status === 'completed' ? 'bg-rice-paddy-green/20 text-deep-teak' :
                                        tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                                `}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
