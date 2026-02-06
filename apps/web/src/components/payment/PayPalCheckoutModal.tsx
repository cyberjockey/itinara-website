"use client";

import { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { createCheckoutOrder, capturePayment } from "@/actions/payment";
import { toast } from "sonner";
import { formatPrice } from "@/config/pricing";

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
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [{ isPending }] = usePayPalScriptReducer();

    const handleCreateOrder = async () => {
        try {
            const result = await createCheckoutOrder(planType, tripCount, tripId);
            return result.orderId;
        } catch (error) {
            console.error("Create order error:", error);
            toast.error("Failed to create order. Please try again.");
            throw error;
        }
    };

    const handleApprove = async (data: { orderID: string }) => {
        setIsProcessing(true);
        try {
            const result = await capturePayment(data.orderID);
            if (result.success) {
                // Track purchase
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'purchase', {
                        transaction_id: data.orderID,
                        value: amount / 100,
                        currency: 'USD',
                        items: [{
                            item_id: `plan_${planType}_${tripCount}`,
                            item_name: `${planType.toUpperCase()} Plan (${tripCount} Credits)`,
                            price: amount / 100,
                            quantity: 1
                        }]
                    });
                }
                setIsSuccess(true);
                toast.success(`${result.tripCount} ${result.planType} credit(s) added!`);
            }
        } catch (error) {
            console.error("Capture error:", error);
            toast.error("Payment failed. Please contact support.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleError = (err: any) => {
        console.error("PayPal error:", err);
        toast.error("Payment error. Please try again.");
    };

    const handleCancel = () => {
        toast.info("Payment cancelled");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {planType === 'vip' ? (
                                    <>
                                        <Crown className="w-5 h-5 text-amber-500" />
                                        VIP Trip Credits
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 text-terracotta" />
                                        Premium Trip Credits
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Complete your purchase with PayPal
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-stone-50 p-4 rounded-lg my-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-gray font-medium">Plan:</span>
                                <span className="font-bold text-deep-teak uppercase">{planType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-gray font-medium">Credits:</span>
                                <span className="font-bold text-deep-teak">{tripCount} trip{tripCount > 1 ? 's' : ''}</span>
                            </div>
                            {destination && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-gray font-medium">For:</span>
                                    <span className="font-bold text-deep-teak">{destination}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm border-t border-stone-200 pt-2 mt-2">
                                <span className="text-stone-gray font-medium">Total:</span>
                                <span className="font-bold text-xl text-terracotta">{formatPrice(amount)}</span>
                            </div>
                        </div>

                        <div className="min-h-[150px] flex items-center justify-center">
                            {isPending || isProcessing ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-stone-gray" />
                                    <span className="text-sm text-stone-gray">
                                        {isProcessing ? 'Processing payment...' : 'Loading PayPal...'}
                                    </span>
                                </div>
                            ) : (
                                <PayPalButtons
                                    style={{
                                        layout: "vertical",
                                        shape: "rect",
                                        color: "gold",
                                    }}
                                    createOrder={handleCreateOrder}
                                    onApprove={handleApprove}
                                    onError={handleError}
                                    onCancel={handleCancel}
                                    disabled={isProcessing}
                                />
                            )}
                        </div>

                        <p className="text-xs text-center text-stone-gray mt-2">
                            Secure payment powered by PayPal
                        </p>
                    </>
                ) : (
                    <>
                        <DialogHeader className="sr-only">
                            <DialogTitle>Payment Successful</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-deep-teak mb-2">Payment Successful!</h3>
                                <p className="text-stone-gray text-sm max-w-xs mx-auto">
                                    {tripCount} {planType} credit{tripCount > 1 ? 's have' : ' has'} been added to your account.
                                    You can now create your trip!
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-4 px-6 py-2 bg-deep-teak text-white rounded-lg font-medium hover:bg-terracotta transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
