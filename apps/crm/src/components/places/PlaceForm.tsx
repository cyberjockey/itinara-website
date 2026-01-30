"use client";

import { useState, useEffect, useActionState } from "react";
import { createPlace, updatePlace, generateCoordinates, generatePlaceDescription } from "@/app/dashboard/places/actions";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Wand2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CloudinaryImageUpload from "@/components/ui/CloudinaryImageUpload";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { useRef } from "react";

function DescriptionGenerator() {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

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
        setCompleted(false);
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
                setCompleted(true);
                setTimeout(() => setCompleted(false), 3000);
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
            className={`text-xs flex items-center gap-1 font-medium transition-colors px-2.5 py-1 rounded-md ${completed
                ? "text-green-600 bg-green-100 hover:bg-green-200"
                : "text-[#D4654F] hover:text-[#b85642] bg-[#D4654F]/10 hover:bg-[#D4654F]/20"
                }`}
        >
            {completed ? <Sparkles className="w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
            {loading ? "Writing..." : completed ? "Completed" : "Write with AI"}
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    mode: 'create' | 'edit';
}

export function PlaceForm({ destinations, initialData, mode }: PlaceFormProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    const [socialLinks, setSocialLinks] = useState<Record<string, string>>(initialData?.social_media || {});

    const action = mode === 'create'
        ? createPlace
        : updatePlace.bind(null, initialData.id);

    // Provide a valid initial state that matches the return type of the action
    const initialState = { message: "" };

    const [state, formAction, isPending] = useActionState(async (prev: unknown, formData: FormData) => {
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

                        {/* Extended Details Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Extended Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone / Whatsapp
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={initialData?.phone}
                                        placeholder="+62 812 3456 7890"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                        Website
                                    </label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        defaultValue={initialData?.website}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price_level" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price Range
                                    </label>
                                    <select
                                        id="price_level"
                                        name="price_level"
                                        defaultValue={initialData?.price_level || ""}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all bg-white text-black"
                                    >
                                        <option value="">Select Price Range...</option>
                                        <option value="$">Low ($)</option>
                                        <option value="$$">Medium ($$)</option>
                                        <option value="$$$">High ($$$)</option>
                                        <option value="Free">Free</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Social Media
                                    </label>
                                    <div className="space-y-2">
                                        {Object.entries(socialLinks).map(([platform, url], index) => (
                                            <div key={index} className="flex gap-2">
                                                <select
                                                    value={platform}
                                                    onChange={(e) => {
                                                        const newLinks = { ...socialLinks };
                                                        const newPlatform = e.target.value;
                                                        const currentUrl = newLinks[platform];
                                                        delete newLinks[platform];
                                                        newLinks[newPlatform] = currentUrl;
                                                        setSocialLinks(newLinks);
                                                    }}
                                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C5F88] outline-none bg-white text-black"
                                                >
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="TikTok">TikTok</option>
                                                    <option value="YouTube">YouTube</option>
                                                    <option value="Twitter">Twitter/X</option>
                                                    <option value="Website">Website</option>
                                                </select>
                                                <input
                                                    type="url"
                                                    value={url as string}
                                                    onChange={(e) => {
                                                        const newLinks = { ...socialLinks, [platform]: e.target.value };
                                                        setSocialLinks(newLinks);
                                                    }}
                                                    placeholder="https://..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2C5F88] outline-none text-black"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newLinks = { ...socialLinks };
                                                        delete newLinks[platform];
                                                        setSocialLinks(newLinks);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const platform = `New Platform ${Object.keys(socialLinks).length + 1}`;
                                            setSocialLinks({ ...socialLinks, [platform]: "" });
                                        }}
                                        className="text-sm text-[#2C5F88] hover:text-[#234b6b] font-medium flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Social Link
                                    </button>
                                    <input
                                        type="hidden"
                                        name="social_media"
                                        value={JSON.stringify(socialLinks)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="what_to_expect" className="block text-sm font-medium text-gray-700 mb-1">
                                    What to Expect
                                </label>
                                <textarea
                                    id="what_to_expect"
                                    name="what_to_expect"
                                    rows={3}
                                    defaultValue={initialData?.what_to_expect}
                                    placeholder="Brief summary of what visitors should expect..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                                />
                            </div>

                            <div>
                                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                                    Highlight & Tips (JSON Array)
                                </label>
                                {/* Using Amenities field for Highlights/Tips as per migration plan */}
                                <textarea
                                    id="amenities"
                                    name="amenities"
                                    rows={10}
                                    defaultValue={JSON.stringify(initialData?.amenities || [], null, 2)}
                                    placeholder='["Wear comfortable shoes", "Best visited at sunset"]'
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#2C5F88] outline-none transition-all text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <DescriptionGenerator />
                            </div>
                            <MarkdownEditor
                                id="description"
                                ref={textareaRef}
                                name="description"
                                rows={15}
                                defaultValue={initialData?.description}
                                placeholder="What makes this place special? Tips for visitors?"
                                className="z-20 relative"
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
