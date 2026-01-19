"use client";

import { createTemplate } from "@/app/dashboard/templates/actions";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

// Add specific types for props if needed
interface TemplateBasicInfoFormProps {
    destinations: { id: string; name: string }[];
}

const initialState = {
    message: "",
};

export function TemplateBasicInfoForm({ destinations }: TemplateBasicInfoFormProps) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(createTemplate, initialState);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {state?.message && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6">
                    {state.message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Hidden Gems of Kyoto"
                    />
                </div>

                <div>
                    <label htmlFor="destination_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Destination
                    </label>
                    <select
                        id="destination_id"
                        name="destination_id"
                        required
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="">Select a destination...</option>
                        {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                                {dest.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (Days)
                        </label>
                        <input
                            id="duration_days"
                            name="duration_days"
                            type="number"
                            min="1"
                            max="30"
                            required
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="3"
                        />
                    </div>
                    <div>
                        <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                        </label>
                        <select
                            id="difficulty_level"
                            name="difficulty_level"
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="easy">Easy (Relaxed)</option>
                            <option value="moderate">Moderate (Active)</option>
                            <option value="challenging">Challenging (Intense)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="trip_preference" className="block text-sm font-medium text-gray-700 mb-1">
                            Trip Preference
                        </label>
                        <select
                            id="trip_preference"
                            name="trip_preference"
                            defaultValue="Adventure"
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Select Preference...</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Relax">Relax</option>
                            <option value="Culture">Culture</option>
                            <option value="Foodie">Foodie</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Family">Family</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Briefly describe what makes this trip special..."
                    />
                </div>

                <div>
                    <label htmlFor="estimated_budget" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Budget
                    </label>
                    <input
                        id="estimated_budget"
                        name="estimated_budget"
                        type="text"
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. IDR 2.500k, $500-800"
                    />
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? "Creating..." : "Start Building Itinerary"}
                </button>
            </div>
        </form>
    );
}
