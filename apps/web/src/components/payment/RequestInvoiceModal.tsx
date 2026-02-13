"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, FileText } from "lucide-react";
import { requestInvoice } from "@/app/actions/payment";
import { toast } from "sonner";

interface RequestInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripId: string;
    planType: 'premium' | 'vip';
    amount: number;
    destination?: string;
}

export function RequestInvoiceModal({ isOpen, onClose, tripId, planType, amount, destination }: RequestInvoiceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRequest = async () => {
        setIsLoading(true);
        try {
            await requestInvoice(tripId, planType, amount);
            setIsSuccess(true);
            toast.success("Invoice request sent successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Request {planType === 'vip' ? 'VIP' : 'Premium'} Upgrade</DialogTitle>
                            <DialogDescription>
                                We currently process payments via PayPal Invoice.
                                Click below to request an invoice sent to your email.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="bg-stone-gray/5 p-4 rounded-lg my-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-gray font-medium">Plan:</span>
                                <span className="font-bold text-deep-teak uppercase">{planType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-gray font-medium">Destination:</span>
                                <span className="font-bold text-deep-teak">{destination || 'Selected Trip'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-stone-gray/10 pt-2 mt-2">
                                <span className="text-stone-gray font-medium">Total:</span>
                                <span className="font-bold text-lg text-terracotta">${(amount / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                            <Button onClick={handleRequest} disabled={isLoading} className="bg-deep-teak hover:bg-terracotta text-white">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Request Invoice
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-deep-teak mb-2">Request Sent!</h3>
                                <p className="text-stone-gray text-sm max-w-xs mx-auto">
                                    Our team will send a PayPal invoice to your email shortly.
                                    Once paid, your trip will be upgraded automatically.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={onClose} className="w-full bg-stone-gray text-white">Close</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
