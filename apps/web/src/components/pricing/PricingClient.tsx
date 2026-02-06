"use client";

import { useState } from "react";
import { Check, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { TRIP_TYPES, CREDIT_BUNDLES, formatPrice } from "@/config/pricing";
import { PayPalCheckoutModal } from "@/components/billing/PayPalCheckoutModal";
import { PayPalProvider } from "@/components/providers/PayPalProvider";

type PackageType = "starter" | "explorer" | "adventurer" | "premium_3" | "premium_5" | "vip_2" | "vip_3";

interface SelectedPackage {
    type: PackageType;
    name: string;
    credits: number;
    price: string;
    features: string[];
}

// Map our pricing config to PayPal package types
const PAYPAL_PACKAGES: Record<string, SelectedPackage> = {
    premium: {
        type: "starter",
        name: "Premium Trip",
        credits: 1,
        price: "9.00",
        features: [...TRIP_TYPES.PREMIUM.features],
    },
    vip: {
        type: "adventurer",
        name: "VIP Trip",
        credits: 1,
        price: "30.00",
        features: [...TRIP_TYPES.VIP.features],
    },
    // Bundle mappings
    PREMIUM_3: {
        type: "premium_3",
        name: "Explorer Pack",
        credits: 3,
        price: "24.00",
        features: ["3 Premium Trip Credits", "Save 11%", "Never expires"],
    },
    PREMIUM_5: {
        type: "premium_5",
        name: "Adventurer Pack",
        credits: 5,
        price: "35.00",
        features: ["5 Premium Trip Credits", "Save 22%", "Best value"],
    },
    VIP_2: {
        type: "vip_2",
        name: "VIP Duo",
        credits: 2,
        price: "50.00",
        features: ["2 VIP Trip Credits", "Save 17%", "Unlimited adventures"],
    },
    VIP_3: {
        type: "vip_3",
        name: "Digital Nomad",
        credits: 3,
        price: "70.00",
        features: ["3 VIP Trip Credits", "Save 22%", "Ultimate package"],
    },
};

function PricingContent() {
    const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);

    const premium = TRIP_TYPES.PREMIUM;
    const vip = TRIP_TYPES.VIP;

    const handlePurchase = (packageId: string) => {
        const pkg = PAYPAL_PACKAGES[packageId];
        if (pkg) {
            setSelectedPackage(pkg);
            setShowCheckout(true);
        }
    };

    const handleSuccess = (credits: number) => {
        // Refresh page or show success message
        window.location.href = "/dashboard?payment=success";
    };

    return (
        <div className="min-h-screen bg-stone-50 py-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-stone-gray max-w-2xl mx-auto">
                        Pay per trip. No subscription required. Your credits never expire.
                    </p>
                </div>

                {/* Single Trip Tiers */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                    {/* Premium Tier */}
                    <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-32 h-32 text-terracotta" />
                        </div>

                        <div className="relative">
                            <h3 className="text-2xl font-bold text-deep-teak mb-2">{premium.name}</h3>
                            <p className="text-stone-gray mb-6 h-12">{premium.description}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-deep-teak">{formatPrice(premium.price)}</span>
                                <span className="text-stone-gray">/ trip</span>
                            </div>

                            <button
                                onClick={() => handlePurchase("premium")}
                                className="w-full py-3 rounded-xl bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors mb-8 shadow-lg shadow-terracotta/20"
                            >
                                Buy 1 Credit
                            </button>

                            <div className="space-y-4">
                                <p className="text-sm font-bold text-deep-teak uppercase tracking-wider">Includes:</p>
                                {premium.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="bg-terracotta/10 p-1 rounded-full shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-terracotta" />
                                        </div>
                                        <span className="text-stone-gray">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* VIP Tier */}
                    <div className="bg-deep-teak rounded-3xl p-8 border border-deep-teak shadow-xl relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Crown className="w-32 h-32 text-white" />
                        </div>

                        {vip.badge && (
                            <div className="absolute top-5 right-5 bg-amber-400 text-deep-teak text-xs font-bold px-3 py-1 rounded-full">
                                {vip.badge}
                            </div>
                        )}

                        <div className="relative">
                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                {vip.name} <Crown className="w-5 h-5 text-amber-400" />
                            </h3>
                            <p className="text-gray-300 mb-6 h-12">{vip.description}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">{formatPrice(vip.price)}</span>
                                <span className="text-gray-300">/ trip</span>
                            </div>

                            <button
                                onClick={() => handlePurchase("vip")}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-deep-teak font-bold hover:brightness-110 transition-all mb-8 shadow-lg shadow-amber-500/20"
                            >
                                Buy 1 VIP Credit
                            </button>

                            <div className="space-y-4">
                                <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">Everything in Premium, plus:</p>
                                {vip.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="bg-amber-400/20 p-1 rounded-full shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-amber-400" />
                                        </div>
                                        <span className="text-gray-200">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Bundles */}
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-deep-teak text-center mb-8">Save with Credit Bundles</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CREDIT_BUNDLES.map((bundle) => (
                            <div key={bundle.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col">

                                {bundle.badge && (
                                    <div className="self-start bg-red-50 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 border border-red-100">
                                        {bundle.badge}
                                    </div>
                                )}

                                <h3 className="font-bold text-lg text-deep-teak">{bundle.name}</h3>
                                <p className="text-sm text-stone-gray mb-4">{bundle.tripCount} {bundle.tripType === 'vip' ? 'VIP' : 'Premium'} Trips</p>

                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-2xl font-bold text-deep-teak">{formatPrice(bundle.price)}</span>
                                        {bundle.savings > 0 && (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                Save {bundle.savings}%
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handlePurchase(bundle.id)}
                                        className="w-full py-2.5 rounded-lg border-2 border-deep-teak text-deep-teak font-bold hover:bg-deep-teak hover:text-white transition-colors text-sm"
                                    >
                                        Buy Bundle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/dashboard" className="text-stone-gray hover:text-deep-teak underline decoration-stone-gray/30 hover:decoration-deep-teak">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* PayPal Checkout Modal */}
            {selectedPackage && (
                <PayPalCheckoutModal
                    isOpen={showCheckout}
                    onClose={() => setShowCheckout(false)}
                    packageType={selectedPackage.type}
                    packageDetails={selectedPackage}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}

export function PricingClient() {
    return (
        <PayPalProvider>
            <PricingContent />
        </PayPalProvider>
    );
}
