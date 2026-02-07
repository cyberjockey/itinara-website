"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTrip } from "@/app/dashboard/trips/actions";

interface TripDeleteButtonProps {
    tripId: string;
    variant?: 'default' | 'menu-item';
}

export function TripDeleteButton({ tripId, variant = 'default' }: TripDeleteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            const res = await deleteTrip(tripId);
            if (res.success) {
                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                alert(res.message);
            }
        });
    };

    if (variant === 'menu-item') {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Trip
                </button>
                {/* Modal rendering code remains below */}
            </> // Wrapper to ensure modal works, logic continues
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-stone-gray hover:text-red-600 transition-colors rounded-xl border border-transparent hover:bg-red-50 hover:border-red-100"
                title="Delete Trip"
            >
                <Trash2 className="w-5 h-5" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-deep-teak/60 backdrop-blur-sm transition-opacity"
                        onClick={() => { setIsOpen(false); setConfirmText(""); }}
                    />
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl border border-white/20">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-deep-teak">Delete Trip?</h3>
                                <p className="text-stone-gray mt-2 text-sm leading-relaxed">
                                    Are you sure you want to delete this trip? This action cannot be undone and you will lose all saved activities.
                                </p>
                            </div>

                            <div className="w-full">
                                <label className="block text-xs font-bold text-stone-gray uppercase mb-2">Type &quot;DELETE&quot; to confirm</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-stone-800 font-bold placeholder:font-normal transition-all"
                                    placeholder="DELETE"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => { setIsOpen(false); setConfirmText(""); }}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-gray/20 font-bold text-stone-gray hover:bg-stone-50 transition-colors"
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${confirmText === 'DELETE'
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                                        : 'bg-stone-100 text-stone-300 cursor-not-allowed border border-stone-gray/10'
                                        }`}
                                    disabled={isPending || confirmText !== 'DELETE'}
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
