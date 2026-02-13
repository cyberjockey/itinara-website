"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check, Crown, Sparkles, Shield, Loader2 } from "lucide-react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { createCheckoutOrder, capturePayment } from "@/app/actions/payment";
import { validateCoupon } from "@/app/actions/campaign";

interface PayPalCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planType: 'premium' | 'vip';
    tripCount: number;
    amount: number; // in cents
    tripId?: string;
    destination?: string;
}

export function PayPalCheckoutModal({
    isOpen,
    onClose,
    planType,
    tripCount,
    amount,
    tripId,
    destination
}: PayPalCheckoutModalProps) {
    const [{ isPending }] = usePayPalScriptReducer();
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; finalPrice: number } | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState("");

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setStatus("idle");
            setErrorMessage("");
            setCouponCode("");
            setAppliedCoupon(null);
            setCouponMessage("");
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsValidatingCoupon(true);
        setCouponMessage("");
        setErrorMessage("");

        try {
            const result = await validateCoupon(couponCode);

            if (result.valid) {
                // amount is in cents, convert to dollars for calculation
                const priceInDollars = amount / 100;

                let discount = 0;
                if (result.discountType === 'percentage') {
                    discount = priceInDollars * (result.discountValue! / 100);
                } else {
                    discount = result.discountValue!;
                }
                const finalPrice = Math.max(0, priceInDollars - discount);

                setAppliedCoupon({
                    code: couponCode,
                    discountAmount: discount,
                    finalPrice
                });
                setCouponMessage(result.message || "Coupon applied!");
            } else {
                setAppliedCoupon(null);
                setCouponMessage(result.message || "Invalid coupon");
            }
        } catch (error) {
            console.error(error);
            setCouponMessage("Failed to validate coupon");
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleCreateOrder = async () => {
        try {
            // Logic to find package key based on planType and tripCount (Simple heuristic)
            let packageKey = planType === 'vip' ? 'adventurer' : 'starter'; // Default 1 credit
            if (tripCount > 1) {
                if (planType === 'premium') {
                    if (tripCount === 3) packageKey = 'premium_3';
                    if (tripCount === 5) packageKey = 'premium_5';
                }
                if (planType === 'vip') {
                    if (tripCount === 2) packageKey = 'vip_2';
                    if (tripCount === 3) packageKey = 'vip_3';
                }
                // If exact match not found, server might default to something else or fail. 
                // But since PricingClient uses CREDIT_BUNDLES, limits are known.
            }

            // @ts-ignore
            const result = await createCheckoutOrder(packageKey, appliedCoupon?.code);

            if (result.orderId === "COUPON-GRANT") {
                setStatus("success");
                setTimeout(() => onClose(), 2000);
                return "";
            }

            return result.orderId;
        } catch (error) {
            console.error("Create order error:", error);
            setErrorMessage("Failed to create order. Please try again.");
            throw error;
        }
    };

    const handleApprove = async (data: { orderID: string }) => {
        setStatus("processing");
        try {
            const result = await capturePayment(data.orderID);
            setStatus("success");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Capture error:", error);
            setStatus("error");
            setErrorMessage("Payment failed. Please contact support.");
        }
    };

    const handleError = (err: unknown) => {
        console.error("PayPal error:", err);
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
    };

    const getPackageIcon = () => {
        switch (planType) {
            case "premium":
                return <Sparkles className="w-8 h-8 text-sunrise-gold" />;
            case "vip":
                return <Crown className="w-8 h-8 text-deep-teak" />;
            default:
                return <CreditCard className="w-8 h-8" />;
        }
    };

    const displayPrice = appliedCoupon ? appliedCoupon.finalPrice.toFixed(2) : (amount / 100).toFixed(2);
    const isFree = appliedCoupon && appliedCoupon.finalPrice <= 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-deep-teak/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
                    >
                        <div className="bg-warm-white w-full max-w-md max-h-[90vh] rounded-3xl overflow-hidden overflow-y-auto shadow-2xl pointer-events-auto border border-white/20 my-auto">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-deep-teak to-deep-teak/90 text-white p-6 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        {getPackageIcon()}
                                    </div>
                                    <div>
                                        <h2 className="font-heading font-bold text-xl">
                                            {planType === 'vip' ? 'VIP Trip' : 'Premium Trip'}
                                        </h2>
                                        <p className="text-white/70 text-sm">
                                            {tripCount} Trip Credit{tripCount > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-baseline gap-1">
                                    {appliedCoupon ? (
                                        <>
                                            <span className="text-3xl font-bold text-sunrise-gold">${displayPrice}</span>
                                            <span className="text-white/50 text-sm line-through">${(amount / 100).toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold">${(amount / 100).toFixed(2)}</span>
                                    )}
                                    <span className="text-white/70 text-sm">USD</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {status === "success" ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="font-bold text-xl text-deep-teak mb-2">Payment Successful!</h3>
                                        <p className="text-stone-gray">
                                            Credits added to your account.
                                        </p>
                                    </div>
                                ) : status === "processing" ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
                                        <h3 className="font-bold text-lg text-deep-teak">Processing Payment...</h3>
                                        <p className="text-stone-gray text-sm">Please wait while we confirm your payment.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Coupon Input */}
                                        <div className="mb-6">
                                            <label className="text-xs font-bold text-stone-gray uppercase tracking-wider mb-2 block">
                                                Coupon Code
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="Enter code"
                                                    disabled={!!appliedCoupon}
                                                    className="flex-1 px-4 py-2 border border-stone-200 rounded-xl text-deep-teak focus:outline-none focus:ring-2 focus:ring-terracotta/20 disabled:bg-stone-50 disabled:text-stone-400 uppercase"
                                                />
                                                {appliedCoupon ? (
                                                    <button
                                                        onClick={() => {
                                                            setAppliedCoupon(null);
                                                            setCouponCode("");
                                                            setCouponMessage("");
                                                        }}
                                                        className="px-4 py-2 bg-stone-100 text-stone-500 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleApplyCoupon}
                                                        disabled={isValidatingCoupon || !couponCode}
                                                        className="px-4 py-2 bg-deep-teak text-white rounded-xl font-bold text-sm hover:bg-deep-teak/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                                                    >
                                                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
                                                    </button>
                                                )}
                                            </div>
                                            {couponMessage && (
                                                <p className={`text-xs mt-2 ${appliedCoupon ? "text-green-600" : "text-red-500"}`}>
                                                    {couponMessage}
                                                </p>
                                            )}
                                        </div>

                                        {/* Error Message */}
                                        {errorMessage && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Payment Buttons */}
                                        <div className="min-h-[150px]">
                                            {isFree ? (
                                                <button
                                                    onClick={handleCreateOrder}
                                                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    Claim for Free
                                                </button>
                                            ) : isPending ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                                                </div>
                                            ) : (
                                                <PayPalButtons
                                                    style={{
                                                        layout: "vertical",
                                                        color: "gold",
                                                        shape: "rect",
                                                        label: "paypal",
                                                        height: 45,
                                                    }}
                                                    createOrder={handleCreateOrder}
                                                    onApprove={handleApprove}
                                                    onError={handleError}
                                                    onCancel={() => setStatus("idle")}
                                                    forceReRender={[appliedCoupon, amount]}
                                                />
                                            )}
                                        </div>

                                        {/* Security Note */}
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
                                            <Shield className="w-3.5 h-3.5" />
                                            Secured by PayPal
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
