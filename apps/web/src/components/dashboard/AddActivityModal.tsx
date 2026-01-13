"use client";

import { useState } from "react";
import { createActivity } from "@/app/dashboard/trips/[id]/actions";
import { useActionState } from "react";
import { X, Clock, MapPin, AlignLeft, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripId: string;
    dayNumber: number;
}

const initialState = {
    message: "",
};

export function AddActivityModal({ isOpen, onClose, tripId, dayNumber }: AddActivityModalProps) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await createActivity(prev, formData);
        if (result.message === "success") {
            onClose();
            return { message: "" };
        }
        return result;
    }, initialState);

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
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[500px] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-stone-gray/10 flex justify-between items-center">
                            <h2 className="text-xl font-heading font-bold text-deep-teak">Add Activity - Day {dayNumber}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-stone-gray/5 rounded-full text-stone-gray">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form action={formAction} className="p-6 overflow-y-auto flex-1 space-y-5">
                            <input type="hidden" name="tripId" value={tripId} />
                            <input type="hidden" name="dayNumber" value={dayNumber} />

                            <div>
                                <label className="block text-sm font-medium text-stone-gray mb-1">
                                    Activity Title
                                </label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                    placeholder="e.g., Visit Borobudur Temple"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-stone-gray mb-1">
                                        Time
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray/50" />
                                        <input
                                            name="startTime"
                                            type="time"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-stone-gray mb-1">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray/50" />
                                        <select
                                            name="category"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50 appearance-none"
                                        >
                                            <option value="sightseeing">Sightseeing</option>
                                            <option value="food">Food & Drink</option>
                                            <option value="adventure">Adventure</option>
                                            <option value="relax">Relaxation</option>
                                            <option value="transport">Transport</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-gray mb-1">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-gray/50" />
                                    <input
                                        name="location"
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                                        placeholder="Specific address or place name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-gray mb-1">
                                    Notes
                                </label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-stone-gray/50" />
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50 resize-none"
                                        placeholder="Any details, booking numbers, or tips..."
                                    />
                                </div>
                            </div>

                            {state?.message && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                    {state.message}
                                </div>
                            )}

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-full text-stone-gray font-bold hover:bg-stone-gray/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-8 py-3 rounded-full bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
                                >
                                    {isPending ? "Adding..." : "Add Activity"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
