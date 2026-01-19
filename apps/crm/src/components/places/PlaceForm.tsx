"use client";

import { useState, useEffect, useActionState } from "react";
import { createPlace, updatePlace, generateCoordinates, generatePlaceDescription } from "@/app/dashboard/places/actions";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CloudinaryImageUpload from "@/components/ui/CloudinaryImageUpload";

function DescriptionGenerator() {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        const destSelect = document.getElementById('destination_id') as HTMLSelectElement;

        if (!nameInput?.value) {
            alert("Please enter a Place Name first.");
            return;
        }

        setLoading(true);
        try {
            const destText = destSelect.options[destSelect.selectedIndex]?.text || "";
            const queryLocation = locationInput?.value || destText || "Indonesia";
            const type = typeSelect?.value || "Place";

            const description = await generatePlaceDescription(nameInput.value, queryLocation, type);

            if (description) {
                const descInput = document.getElementById('description') as HTMLTextAreaElement;
                if (descInput) {
                    descInput.value = description;
                    // Trigger input event to ensure state updates if managed (though here it's uncontrolled mostly)
                    descInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else {
                alert("Failed to generate description. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Error generating description.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs flex items-center gap-1 text-[#D4654F] hover:text-[#b85642] font-medium transition-colors bg-[#D4654F]/10 hover:bg-[#D4654F]/20 px-2.5 py-1 rounded-md"
        >
            <Wand2 className="w-3 h-3" />
            {loading ? "Writing..." : "Write with AI"}
        </button>
    );
}

function CoordinateGenerator() {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;
        const destSelect = document.getElementById('destination_id') as HTMLSelectElement;

        if (!nameInput?.value) {
            alert("Please enter a Place Name first.");
            return;
        }

        setLoading(true);
        try {
            // Combine name + location + destination text for better accuracy
            const destText = destSelect.options[destSelect.selectedIndex]?.text || "";
            const queryLocation = locationInput?.value || destText || "Indonesia";

            const coords = await generateCoordinates(nameInput.value, queryLocation);

            if (coords) {
                const latInput = document.getElementById('lat') as HTMLInputElement;
                const lngInput = document.getElementById('lng') as HTMLInputElement;
                if (latInput) latInput.value = coords.lat.toString();
                if (lngInput) lngInput.value = coords.lng.toString();
            } else {
                alert("Could not find coordinates for this place. Please enter manually.");
            }
        } catch (e) {
            console.error(e);
            alert("Error generating coordinates.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs flex items-center gap-1 text-[#40B5AD] hover:text-[#369992] font-medium transition-colors bg-[#40B5AD]/10 hover:bg-[#40B5AD]/20 px-2.5 py-1 rounded-md"
        >
            <Sparkles className="w-3 h-3" />
            {loading ? "Locating..." : "Find Coordinates"}
        </button>
    );
}

interface PlaceFormProps {
    destinations: { id: string, name: string }[];
    initialData?: any;
    mode: 'create' | 'edit';
}

export function PlaceForm({ destinations, initialData, mode }: PlaceFormProps) {
    const router = useRouter();
    const [images, setImages] = useState<string[]>(() => {
        if (initialData?.cloudinary_images && initialData.cloudinary_images.length > 0) {
            return initialData.cloudinary_images;
        }
        if (initialData?.photos && Array.isArray(initialData.photos) && initialData.photos.length > 0) {
            return initialData.photos;
        }
        if (initialData?.image_url) {
            return [initialData.image_url];
        }
        return [];
    });

    const action = mode === 'create'
        ? createPlace
        : updatePlace.bind(null, initialData.id);

    // Provide a valid initial state that matches the return type of the action
    const initialState = { message: "" };

    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await action(prev, formData);

        if ((mode === 'create' && 'place' in result && result.place) ||
            (mode === 'edit' && 'success' in result && result.success)) {
            router.push('/dashboard/places');
        }
        return result;
    }, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/places" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Activities
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">
                    {mode === 'create' ? "Add New Activity" : "Edit Activity"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {mode === 'create' ? "Share a unique activity with the world." : "Update information about this activity."}
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form action={formAction} className="space-y-6">
                    {state?.message &&
                        !('success' in state && state.success) &&
                        !('place' in state && state.place) && (
                            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
                                {state.message}
                            </div>
                        )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Activity Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                defaultValue={initialData?.name}
                                placeholder="e.g. Warung Bu Ageng"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
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
                                defaultValue={initialData?.destination_id || ""}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all bg-white text-black"
                            >
                                <option value="">Select a region...</option>
                                {destinations.map(dest => (
                                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={initialData?.type || "Sightseeing"}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all bg-white text-black"
                                >
                                    <option value="Sightseeing">Sightseeing</option>
                                    <option value="Food">Food & Dining</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Activity">Activity</option>
                                    <option value="Accommodation">Accommodation</option>
                                    <option value="Relax">Relax</option>
                                    <option value="Club">Club</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location / Address
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    defaultValue={initialData?.location}
                                    placeholder="e.g. Jalan Tirtodipuran No. 13"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                                />
                            </div>
                        </div>

                        {/* Coordinates Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium text-gray-900">Coordinates</h3>
                                <CoordinateGenerator />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="lat" className="block text-xs font-medium text-gray-500 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        id="lat"
                                        name="lat"
                                        type="number"
                                        step="any"
                                        defaultValue={initialData?.coordinates?.lat}
                                        placeholder="-8.12345"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2C5F88] outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lng" className="block text-xs font-medium text-gray-500 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        id="lng"
                                        name="lng"
                                        type="number"
                                        step="any"
                                        defaultValue={initialData?.coordinates?.lng}
                                        placeholder="115.12345"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2C5F88] outline-none text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <DescriptionGenerator />
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={initialData?.description}
                                placeholder="What makes this place special? Tips for visitors?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photos (Max 5)
                            </label>
                            <input type="hidden" name="cloudinary_images_json" value={JSON.stringify(images)} />
                            <CloudinaryImageUpload
                                onUpload={setImages}
                                defaultValue={images}
                                maxFiles={5}
                                folder="itinara/places"
                                label="Add Photos"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50">
                        <Link href="/dashboard/places" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 bg-[#2C5F88] text-white font-medium rounded-lg hover:bg-[#234b6b] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isPending ? "Saving..." : "Save Place"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
