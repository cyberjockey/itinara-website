"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2, Loader2, AlertCircle } from "lucide-react";
import { deleteTrip } from "@/app/dashboard/trips/actions";
import { useRouter } from "next/navigation";

interface TripCardActionsProps {
    tripId: string;
    title: string;
}

export function TripCardActions({ tripId, title }: TripCardActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteTrip(tripId);
                setShowDeleteConfirm(false);
                // Optional: Toast success
            } catch (error) {
                console.error(error);
                alert("Failed to delete trip");
            }
        });
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-gray hover:text-terracotta shrink-0 transition-colors p-1 rounded-full hover:bg-stone-50"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-gray/10 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setShowDeleteConfirm(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Trip
                        </button>
                    </div>
                </>
            )}

            {/* Custom Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-gray/10" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-deep-teak text-center mb-2">Delete Trip?</h3>
                        <p className="text-stone-gray text-center text-sm mb-6">
                            Are you sure you want to delete <span className="font-bold text-deep-teak">"{title}"</span>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isPending}
                                className="flex-1 py-2.5 text-stone-gray font-bold text-sm bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 py-2.5 text-white font-bold text-sm bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
