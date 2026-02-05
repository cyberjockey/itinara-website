"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTransactions, updateTransactionStatus } from "@/actions/transactions";
import { Loader2, CheckCircle, XCircle, Clock, FileText, Send, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
    id: string;
    created_at: string;
    payment_status: string;
    amount_total: number;
    currency: string;
    invoice_id?: string;
    paypal_order_id?: string;
    payment_method?: string;
    metadata: {
        plan_type?: string;
        user_email?: string;
        trip_id?: string;
        trip_count?: number;
    };
    user?: {
        email: string;
    };
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data || []);
        } catch (error) {
            toast.error("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        setProcessingId(id);
        try {
            // If marking as invoice sent, we might want to prompt for ID, but for now auto-generate or leaving simple
            const invoiceId = status === 'invoice_sent' ? `INV-${Date.now().toString().slice(-6)}` : undefined;

            await updateTransactionStatus(id, status, invoiceId);
            toast.success(`Transaction marked as ${status}`);
            loadData(); // Reload to see changes
            router.refresh(); // Refresh Server Components
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>;
            case 'request':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3.5 h-3.5" /> Request</span>;
            case 'invoice_sent':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"><Send className="w-3.5 h-3.5" /> Sent</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500 text-sm">Manage invoice requests and payments.</p>
                </div>
                <button onClick={loadData} className="text-sm text-gray-600 hover:text-gray-900 underline">Refresh</button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">PayPal / Invoice</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {getStatusBadge(tx.payment_status)}
                                            <div className="text-[10px] text-gray-400 mt-1">{new Date(tx.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{tx.metadata?.user_email || tx.user?.email || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                {tx.metadata?.plan_type === 'vip' ? (
                                                    <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">VIP</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Premium</span>
                                                )}
                                                {tx.metadata?.trip_count && tx.metadata.trip_count > 1 && (
                                                    <span className="text-xs text-gray-500">x{tx.metadata.trip_count}</span>
                                                )}
                                            </div>
                                            {tx.metadata?.trip_id && <span className="font-mono text-[10px] text-gray-400 block mt-1">Trip: {tx.metadata.trip_id.slice(0, 8)}</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {(tx.amount_total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {tx.payment_method && (
                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${tx.payment_method === 'paypal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                                        {tx.payment_method === 'paypal' ? 'PayPal' : tx.payment_method === 'paypal_manual' ? 'Manual' : tx.payment_method}
                                                    </span>
                                                )}
                                                {tx.paypal_order_id && (
                                                    <div className="font-mono text-[10px] text-gray-500" title={tx.paypal_order_id}>
                                                        Order: {tx.paypal_order_id.slice(0, 12)}...
                                                    </div>
                                                )}
                                                {tx.invoice_id && (
                                                    <div className="font-mono text-[10px] text-gray-500">
                                                        Inv: {tx.invoice_id}
                                                    </div>
                                                )}
                                                {!tx.paypal_order_id && !tx.invoice_id && <span className="text-gray-400">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end">
                                                {processingId === tx.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'invoice_sent')}>
                                                                <Send className="w-3.5 h-3.5 mr-2 text-blue-600" /> Mark Invoice Sent
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'completed')}>
                                                                <CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Mark Completed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'cancelled')}>
                                                                <XCircle className="w-3.5 h-3.5 mr-2 text-gray-500" /> Cancel Request
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 border-dashed border-gray-200">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusBadge(tx.payment_status)}
                                            <span className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="font-medium text-gray-900">{tx.metadata?.user_email || tx.user?.email || 'Unknown'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 text-lg">
                                            {(tx.amount_total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5 mt-1">
                                            {tx.payment_method && (
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${tx.payment_method === 'paypal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {tx.payment_method === 'paypal' ? 'PayPal' : 'Manual'}
                                                </span>
                                            )}
                                            {tx.paypal_order_id && <div className="font-mono text-[10px] text-gray-400">Order: {tx.paypal_order_id.slice(0, 8)}...</div>}
                                            {tx.invoice_id && <div className="font-mono text-[10px] text-gray-400">Inv: {tx.invoice_id}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                                    <div className="flex items-center gap-2">
                                        {tx.metadata?.plan_type === 'vip' ? (
                                            <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">VIP</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Premium</span>
                                        )}
                                        {tx.metadata?.trip_id && <span className="font-mono text-xs text-gray-400">ID: {tx.metadata.trip_id.slice(0, 4)}...</span>}
                                    </div>

                                    <div className="flex">
                                        {processingId === tx.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                                    Actions <MoreHorizontal className="w-3.5 h-3.5" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'invoice_sent')}>
                                                        <Send className="w-3.5 h-3.5 mr-2 text-blue-600" /> Mark Invoice Sent
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'completed')}>
                                                        <CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Mark Completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(tx.id, 'cancelled')}>
                                                        <XCircle className="w-3.5 h-3.5 mr-2 text-gray-500" /> Cancel Request
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-8 text-center text-gray-500">
                                No transactions found
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
