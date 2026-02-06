"use client";

import { useState } from "react";
import { Trash2, MoreVertical, Loader2 } from "lucide-react";
import { deleteTrip } from "@/app/dashboard/trips/actions";

interface TripCardActionsProps {
    tripId: string;
    tripName: string;
}

export function TripCardActions({ tripId, tripName }: TripCardActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmText !== "DELETE") return;
        setIsDeleting(true);
        try {
            await deleteTrip(tripId);
            // Redirect happens in server action
        } catch (error) {
            console.error("Delete error:", error);
            setIsDeleting(false);
            setShowConfirm(false);
            setConfirmText("");
        }
    };

    return (
        <div className="relative">
            {/* Menu Toggle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
                <MoreVertical className="w-4 h-4 text-stone-gray" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && !showConfirm && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-stone-gray/10 py-1 z-20 min-w-[140px]">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Trip
                        </button>
                    </div>
                </>
            )}

            {/* Confirmation Dialog */}
            {showConfirm && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => {
                            setShowConfirm(false);
                            setIsOpen(false);
                            setConfirmText("");
                        }}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 z-50 w-[90%] max-w-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-lg text-deep-teak mb-2">Delete Trip?</h3>
                            <div className="w-full text-left mb-6">
                                <label className="block text-[10px] font-bold text-stone-gray uppercase mb-1.5 opacity-60">Type "DELETE" to confirm</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-stone-800 font-bold placeholder:font-normal transition-all text-sm"
                                    placeholder="DELETE"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirm(false);
                                        setIsOpen(false);
                                        setConfirmText("");
                                    }}
                                    className="flex-1 px-4 py-2 border border-stone-gray/20 rounded-xl text-stone-gray hover:bg-stone-50 transition-colors font-medium text-sm"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || confirmText !== 'DELETE'}
                                    className={`flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm ${confirmText === 'DELETE'
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                                        : 'bg-stone-100 text-stone-300 cursor-not-allowed border border-stone-gray/10'
                                        }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
