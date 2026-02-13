import { getCoupons, toggleCouponStatus } from "./actions";
import { CreateCouponModal } from "./CreateCouponModal";
import { Ticket, Users, DollarSign, Calendar, ToggleLeft, ToggleRight } from "lucide-react";

async function CouponToggle({ id, isActive }: { id: string; isActive: boolean }) {
    "use server";
    return (
        <form action={async () => {
            "use server";
            await toggleCouponStatus(id, isActive);
        }}>
            <button type="submit" className={`p-1 rounded transition-colors ${isActive ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500"}`}>
                {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </button>
        </form>
    );
}

export default async function CampaignsPage() {
    const coupons = await getCoupons();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Campaigns & Coupons</h1>
                    <p className="text-gray-500 text-sm">Manage discount codes and promotions</p>
                </div>
                <CreateCouponModal />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Coupons</p>
                        <p className="text-2xl font-bold">{coupons.filter(c => c.is_active).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Redemptions</p>
                        <p className="text-2xl font-bold">{coupons.reduce((acc, c) => acc + (c.used_count || 0), 0)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expires</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No coupons found. Create one to get started.</td>
                            </tr>
                        ) : coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{coupon.code}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} OFF`}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.used_count} / {coupon.max_uses ? coupon.max_uses : '∞'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${coupon.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                        {coupon.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <CouponToggle id={coupon.id} isActive={coupon.is_active} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
