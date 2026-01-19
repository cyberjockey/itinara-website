import { getAllPackages, TRIP_TYPES, CREDIT_BUNDLES, formatPrice } from "@/config/pricing";
import { Check, Sparkles, Crown } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/stripe";

export default function PurchasePage() {
    const premium = TRIP_TYPES.PREMIUM;
    const vip = TRIP_TYPES.VIP;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-deep-teak mb-3">
                    Top Up Your Credits
                </h1>
                <p className="text-lg text-stone-gray max-w-2xl mx-auto">
                    Purchase credits to create more itineraries. No expiration.
                </p>
            </div>

            {/* Single Trip Tiers */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                {/* Premium Tier */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-terracotta" />
                    </div>

                    <div className="relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-deep-teak">{premium.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-deep-teak">{formatPrice(premium.price)}</span>
                                <span className="text-stone-gray text-sm">/ trip</span>
                            </div>
                        </div>
                        <p className="text-stone-gray mb-6 text-sm">{premium.description}</p>

                        <form action={async () => {
                            'use server';
                            await createCheckoutSession(premium.stripePriceId, {
                                type: 'credit_purchase',
                                creditType: 'premium',
                                amount: 1
                            });
                        }}>
                            <button type="submit" className="w-full py-3 rounded-xl bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors mb-6 shadow-lg shadow-terracotta/20">
                                Buy 1 Credit
                            </button>
                        </form>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-deep-teak uppercase tracking-wider">Includes:</p>
                            {premium.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="bg-terracotta/10 p-1 rounded-full shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 text-terracotta" />
                                    </div>
                                    <span className="text-stone-gray text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* VIP Tier */}
                <div className="bg-deep-teak rounded-3xl p-6 border border-deep-teak shadow-xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Crown className="w-24 h-24 text-white" />
                    </div>

                    {vip.badge && (
                        <div className="absolute top-5 right-5 bg-amber-400 text-deep-teak text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {vip.badge}
                        </div>
                    )}

                    <div className="relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {vip.name} <Crown className="w-4 h-4 text-amber-400" />
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">{formatPrice(vip.price)}</span>
                                <span className="text-gray-300 text-sm">/ trip</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 text-sm">{vip.description}</p>

                        <form action={async () => {
                            'use server';
                            await createCheckoutSession(vip.stripePriceId, {
                                type: 'credit_purchase',
                                creditType: 'vip',
                                amount: 1
                            });
                        }}>
                            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-deep-teak font-bold hover:brightness-110 transition-all mb-6 shadow-lg shadow-amber-500/20">
                                Buy 1 VIP Credit
                            </button>
                        </form>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Everything in Premium, plus:</p>
                            {vip.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="bg-amber-400/20 p-1 rounded-full shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 text-amber-400" />
                                    </div>
                                    <span className="text-gray-200 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Bundles */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-bold text-deep-teak text-center mb-6">Save with Credit Bundles</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CREDIT_BUNDLES.map((bundle) => (
                        <div key={bundle.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                {bundle.rating && (
                                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {bundle.rating}
                                    </div>
                                )}
                                {bundle.badge && (
                                    <div className="bg-red-50 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                                        {bundle.badge}
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-base text-deep-teak mb-1">{bundle.name}</h3>
                            <p className="text-xs text-stone-gray mb-4">{bundle.tripCount} {bundle.tripType === 'vip' ? 'VIP' : 'Premium'} Trips</p>

                            <div className="mt-auto">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-xl font-bold text-deep-teak">{formatPrice(bundle.price)}</span>
                                    {bundle.savings > 0 && (
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            Save {bundle.savings}%
                                        </span>
                                    )}
                                </div>

                                <button className="w-full py-2 rounded-lg border-2 border-deep-teak text-deep-teak font-bold hover:bg-deep-teak hover:text-white transition-colors text-xs">
                                    Buy Bundle
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
