'use client';

import { useState } from 'react';
import { Check, Sparkles, Crown, Zap, Users, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TRIP_TYPES, CREDIT_BUNDLES, formatPrice } from '@/config/pricing';

export default function PurchasePage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        setLoading(packageId);

        // TODO: Implement Stripe checkout when ready
        console.log('Purchase:', packageId);

        // For now, just show alert
        alert(`Purchase ${packageId} - Stripe integration coming next!`);
        setLoading(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            {/* Header */}
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4">
                    Choose Your Adventure
                </h1>
                <p className="text-lg text-stone-gray/80 max-w-2xl mx-auto">
                    Plan your Indonesian journey with flexible pricing. Pay only for what you need.
                </p>
            </header>

            {/* Main Comparison: Premium vs VIP */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Premium Trip */}
                <div className="relative rounded-3xl p-8 border-2 border-terracotta bg-white shadow-lg hover:shadow-xl transition-all">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-terracotta text-white text-sm font-bold rounded-full">
                        Most Popular
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-terracotta/10">
                            <Sparkles className="w-8 h-8 text-terracotta" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-deep-teak">Premium Trip</h2>
                            <p className="text-sm text-stone-gray/80">Perfect for weekend getaways</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-terracotta">${TRIP_TYPES.PREMIUM.price / 100}</span>
                            <span className="text-stone-gray/80">per trip</span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {TRIP_TYPES.PREMIUM.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                                <span className="text-stone-gray/90">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePurchase('premium')}
                        disabled={loading === 'premium'}
                        className="w-full py-4 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading === 'premium' ? 'Processing...' : 'Get Premium Trip'}
                    </button>
                </div>

                {/* VIP Trip */}
                <div className="relative rounded-3xl p-8 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg hover:shadow-xl transition-all">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-md">
                        Best for Long Trips
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-200 to-yellow-200">
                            <Crown className="w-8 h-8 text-amber-700" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-deep-teak">VIP Trip</h2>
                            <p className="text-sm text-stone-gray/80">Unlimited adventures</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-amber-700">${TRIP_TYPES.VIP.price / 100}</span>
                            <span className="text-stone-gray/80">per trip</span>
                        </div>
                        <p className="text-sm text-amber-700 font-semibold mt-1">Unlimited everything!</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {TRIP_TYPES.VIP.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <span className="text-stone-gray/90 font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePurchase('vip')}
                        disabled={loading === 'vip'}
                        className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading === 'vip' ? 'Processing...' : 'Get VIP Trip'}
                    </button>
                </div>
            </div>

            {/* Bundles Section */}
            <div className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-deep-teak mb-2">Save with Bundles</h2>
                    <p className="text-stone-gray/80">Get more trips and save big</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CREDIT_BUNDLES.map((bundle) => {
                        const isPremium = bundle.tripType === 'premium';

                        return (
                            <div
                                key={bundle.id}
                                className={`relative rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${bundle.popular
                                        ? 'border-terracotta bg-terracotta/5 scale-105'
                                        : isPremium
                                            ? 'border-stone-gray/20 bg-white'
                                            : 'border-amber-300 bg-amber-50'
                                    }`}
                            >
                                {bundle.badge && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${isPremium
                                            ? 'bg-terracotta text-white'
                                            : 'bg-amber-500 text-white'
                                        }`}>
                                        {bundle.badge}
                                    </div>
                                )}

                                <div className="text-center mb-4">
                                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isPremium ? 'bg-terracotta/10' : 'bg-amber-100'
                                        }`}>
                                        {isPremium ? (
                                            <Sparkles className="w-6 h-6 text-terracotta" />
                                        ) : (
                                            <Crown className="w-6 h-6 text-amber-600" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-deep-teak mb-1">{bundle.name}</h3>
                                    <p className="text-xs text-stone-gray/80 mb-3">{bundle.description}</p>

                                    <div className="text-3xl font-bold text-deep-teak mb-1">
                                        {formatPrice(bundle.price)}
                                    </div>
                                    <p className="text-sm text-stone-gray/80">
                                        {formatPrice(Math.round(bundle.price / bundle.tripCount))} per trip
                                    </p>
                                    {bundle.savings > 0 && (
                                        <p className="text-sm font-bold text-green-600 mt-1">
                                            Save {bundle.savings}%
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className={`text-center py-2 rounded-lg ${isPremium ? 'bg-terracotta/10' : 'bg-amber-100'
                                        }`}>
                                        <span className="font-bold text-deep-teak">{bundle.tripCount}</span>
                                        <span className="text-sm text-stone-gray/80 ml-1">
                                            {isPremium ? 'Premium' : 'VIP'} {bundle.tripCount === 1 ? 'Trip' : 'Trips'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePurchase(bundle.id)}
                                    disabled={loading === bundle.id}
                                    className={`w-full py-3 rounded-full font-bold transition-all ${bundle.popular
                                            ? 'bg-terracotta text-white hover:bg-deep-teak shadow-md hover:shadow-lg'
                                            : isPremium
                                                ? 'bg-stone-gray/10 text-deep-teak hover:bg-terracotta hover:text-white'
                                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading === bundle.id ? 'Processing...' : 'Purchase'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Trust Signals */}
            <div className="grid md:grid-cols-3 gap-8 text-center bg-warm-white rounded-3xl p-8">
                <div>
                    <Zap className="w-12 h-12 text-terracotta mx-auto mb-3" />
                    <h4 className="font-bold text-deep-teak mb-2">Instant Access</h4>
                    <p className="text-sm text-stone-gray/80">Credits added immediately after payment</p>
                </div>
                <div>
                    <Users className="w-12 h-12 text-terracotta mx-auto mb-3" />
                    <h4 className="font-bold text-deep-teak mb-2">Trusted by Travelers</h4>
                    <p className="text-sm text-stone-gray/80">Join thousands planning Indonesian adventures</p>
                </div>
                <div>
                    <Shield className="w-12 h-12 text-terracotta mx-auto mb-3" />
                    <h4 className="font-bold text-deep-teak mb-2">Secure Payment</h4>
                    <p className="text-sm text-stone-gray/80">Powered by Stripe, your data is protected</p>
                </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-12 text-center">
                <p className="text-stone-gray/80 mb-4">Need help choosing?</p>
                <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 text-terracotta hover:text-deep-teak font-bold transition-colors"
                >
                    View FAQ <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
