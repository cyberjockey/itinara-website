"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
    isPending?: boolean;
}

export function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    isPending = false
}: DeleteModalProps) {
    const [confirmText, setConfirmText] = useState("");

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (confirmText !== "DELETE") return;
        await onConfirm();
        setConfirmText("");
        onClose();
    };

    const handleClose = () => {
        setConfirmText("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>

                    <div className="w-full">
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="w-full text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Type &quot;DELETE&quot; to confirm</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 font-bold placeholder:font-normal placeholder:text-gray-300 transition-all text-sm"
                            placeholder="DELETE"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${confirmText === 'DELETE'
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
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
    );
}
