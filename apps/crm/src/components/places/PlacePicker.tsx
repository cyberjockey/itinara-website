"use client";

import { useState, useEffect } from "react";
import { Check, Plus, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPlace, getPlaces, type Place } from "@/app/dashboard/places/actions";
import { useActionState } from "react";

interface PlacePickerProps {
    destinationId: string;
    value?: string; // place_id
    onChange: (place: Place) => void;
    onCancel: () => void;
}

export function PlacePicker({ destinationId, value, onChange }: PlacePickerProps) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // Fetch places with server-side search - debounced
    useEffect(() => {
        if (!destinationId) {
            setPlaces([]);
            setLoading(false);
            return;
        }

        const tLoading = setTimeout(() => setLoading(true), 0);
        const timeoutId = setTimeout(() => {
            getPlaces(destinationId, 1, 100, searchTerm || undefined).then(data => {
                setPlaces(data.data);
                setLoading(false);
            });
        }, 300); // Debounce 300ms

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(tLoading);
        };
    }, [destinationId, searchTerm]);

    // --- Create New Place Logic ---
    const [createState, createAction, isCreatePending] = useActionState(async (prev: unknown, formData: FormData) => {
        const result = await createPlace(prev, formData);
        if (result.place) {
            setPlaces([...places, result.place]);
            onChange(result.place);
            setIsCreating(false);
        }
        return result;
    }, { message: "" });

    if (isCreating) {
        return (
            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-blue-900">Create New Place</h4>
                    <button onClick={() => setIsCreating(false)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                </div>
                <form action={createAction} className="space-y-3">
                    <input type="hidden" name="destination_id" value={destinationId} />

                    <div>
                        <input
                            name="name"
                            placeholder="Place Name"
                            required
                            className="w-full text-sm px-3 py-2 border rounded-md"
                            defaultValue={searchTerm}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <select name="type" className="text-sm px-3 py-2 border rounded-md w-full">
                            <option value="Sightseeing">Sightseeing</option>
                            <option value="Food">Food</option>
                            <option value="Culture">Culture</option>
                            <option value="Nature">Nature</option>
                            <option value="Activity">Activity</option>
                        </select>
                        <input
                            name="location"
                            placeholder="Address / Area"
                            className="w-full text-sm px-3 py-2 border rounded-md"
                        />
                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full text-sm px-3 py-2 border rounded-md"
                        rows={2}
                    />

                    <div className="flex justify-end pt-2">
                        <button
                            disabled={isCreatePending}
                            className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            {isCreatePending && <Loader2 className="w-3 h-3 animate-spin bg-white" />}
                            Create & Select
                        </button>
                    </div>
                    {createState?.message && <p className="text-xs text-red-500">{createState.message}</p>}
                </form>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="relative mb-2">
                <input
                    type="text"
                    placeholder="Search existing activities..."
                    className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg bg-white shadow-sm divide-y divide-gray-50">
                {!destinationId ? (
                    <div className="p-4 text-center text-amber-600 text-xs bg-amber-50">
                        ⚠️ Please select a destination for this template first
                    </div>
                ) : loading ? (
                    <div className="p-4 text-center text-gray-400 text-xs">Loading activities for this destination...</div>
                ) : places.length > 0 ? (
                    places.map((place) => (
                        <button
                            key={place.id}
                            onClick={() => onChange(place)}
                            className={cn(
                                "w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors",
                                value === place.id ? "bg-blue-50" : ""
                            )}
                        >
                            <div>
                                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{place.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {place.location || "No location info"}
                                </div>
                            </div>
                            {value === place.id && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                    ))
                ) : (
                    <div className="p-2">
                        {searchTerm ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center justify-between group transition-colors"
                            >
                                <div>
                                    <div className="text-sm font-medium">Create &quot;{searchTerm}&quot;</div>
                                    <div className="text-xs text-blue-500">Add this as a new activity</div>
                                </div>
                                <Plus className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-500">No activities found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsCreating(true)}
                className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Create New Activity
            </button>
        </div>
    );
}
