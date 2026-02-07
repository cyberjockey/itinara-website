"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check, Crown, Sparkles, Shield, Loader2 } from "lucide-react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { createCheckoutOrder, capturePayment } from "@/app/actions/payment";

interface PayPalCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageType: "starter" | "explorer" | "adventurer";
    packageDetails: {
        name: string;
        credits: number;
        price: string;
        features?: string[];
    };
    onSuccess?: (credits: number) => void;
}

export function PayPalCheckoutModal({
    isOpen,
    onClose,
    packageType,
    packageDetails,
    onSuccess,
}: PayPalCheckoutModalProps) {
    const [{ isPending }] = usePayPalScriptReducer();
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatus("idle");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setErrorMessage("");
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleCreateOrder = async () => {
        try {
            const result = await createCheckoutOrder(packageType);
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
            if (onSuccess) {
                onSuccess(result.credits || 0);
            }
            // Auto-close after success
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
        switch (packageType) {
            case "starter":
                return <CreditCard className="w-8 h-8 text-terracotta" />;
            case "explorer":
                return <Sparkles className="w-8 h-8 text-sunrise-gold" />;
            case "adventurer":
                return <Crown className="w-8 h-8 text-deep-teak" />;
            default:
                return <CreditCard className="w-8 h-8" />;
        }
    };

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
                                            {packageDetails.name}
                                        </h2>
                                        <p className="text-white/70 text-sm">
                                            {packageDetails.credits} Trip Credit{packageDetails.credits > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">${packageDetails.price}</span>
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
                                            {packageDetails.credits} credit{packageDetails.credits > 1 ? "s" : ""} added to your account.
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
                                        {/* Features */}
                                        {packageDetails.features && (
                                            <div className="mb-6 space-y-2">
                                                {packageDetails.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {errorMessage && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* PayPal Buttons */}
                                        <div className="min-h-[150px]">
                                            {isPending ? (
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
