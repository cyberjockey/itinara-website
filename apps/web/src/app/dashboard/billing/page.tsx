import { getUserTransactions } from "@/actions/payment";
import { CheckCircle, Clock, XCircle, CreditCard, Receipt } from "lucide-react";

export default async function BillingPage() {
    const transactions = await getUserTransactions();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>;
            case 'request':
            case 'pending':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3.5 h-3.5" /> Pending</span>;
            case 'invoice_sent':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"><Receipt className="w-3.5 h-3.5" /> Invoiced</span>;
            case 'cancelled':
            case 'failed':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-deep-teak font-heading">Billing History</h1>
                    <p className="text-stone-gray text-sm">View your past transactions and purchases.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 text-stone-gray font-semibold border-b border-stone-gray/10">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Ref ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-gray/10">
                            {transactions.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {getStatusBadge(tx.payment_status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {tx.metadata?.plan_type && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${tx.metadata.plan_type === 'vip' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
                                                    {tx.metadata.plan_type}
                                                </span>
                                            )}
                                            <span className="font-medium text-deep-teak">
                                                {tx.metadata?.trip_count > 1
                                                    ? `${tx.metadata.trip_count} Trips Bundle`
                                                    : 'Trip Credit'}
                                            </span>
                                        </div>
                                        {tx.payment_method && (
                                            <div className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" />
                                                {tx.payment_method === 'paypal' ? 'PayPal' : 'Manual Invoice'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-deep-teak">
                                        {(tx.amount_total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </td>
                                    <td className="px-6 py-4 text-stone-gray">
                                        {new Date(tx.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-stone-400">
                                        {tx.invoice_id || tx.paypal_order_id || tx.id.slice(0, 8)}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-stone-gray border-dashed border-stone-gray/10">
                                        No transaction history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
