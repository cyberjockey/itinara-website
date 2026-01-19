import { getCustomer } from "../actions";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Calendar, CreditCard, Mail } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <Link href="/dashboard/customers" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Customers
                </Link>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {customer.avatar_url ? (
                            <img
                                src={customer.avatar_url}
                                alt={customer.full_name || "User"}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User className="w-8 h-8" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{customer.full_name || "Unnamed User"}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {customer.email}
                                </div>
                                <div>
                                    Joined {new Date(customer.joined_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Summary</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-500">Total Spend</div>
                                <div className="text-2xl font-bold text-[#2C5F88]">${customer.total_spend.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Total Trips Planned</div>
                                <div className="text-xl font-semibold text-gray-900">{customer.total_trips}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Trip History */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#40B5AD]" />
                            Trip History
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {customer.trips.length > 0 ? (
                                <ul className="divide-y divide-gray-50">
                                    {customer.trips.map(trip => (
                                        <li key={trip.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{trip.title}</h3>
                                                    <p className="text-sm text-gray-500">{trip.destination}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${trip.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                            trip.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                    {trip.start_date && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(trip.start_date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="p-8 text-center text-gray-500 text-sm">No trips found.</p>
                            )}
                        </div>
                    </div>

                    {/* Purchase History */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#D4654F]" />
                            Purchase History
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {customer.purchases.length > 0 ? (
                                <ul className="divide-y divide-gray-50">
                                    {customer.purchases.map(purchase => (
                                        <li key={purchase.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 uppercase text-xs tracking-wide">{purchase.package_id}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(purchase.purchased_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    ${Number(purchase.amount_paid).toFixed(2)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="p-8 text-center text-gray-500 text-sm">No purchases recorded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
