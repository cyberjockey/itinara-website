'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createDestination, updateDestination, deleteDestination, type Destination } from '@/app/dashboard/destinations/actions';
import CloudinaryImageUpload from '@/components/ui/CloudinaryImageUpload';
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { DeleteModal } from '@/components/ui/DeleteModal';

interface DestinationFormProps {
    destination?: Destination;
    isEditing?: boolean;
}

export default function DestinationForm({ destination, isEditing = false }: DestinationFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>(destination?.image_url ? [destination.image_url] : []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Add image URL if available
        if (images.length > 0) {
            formData.set('image_url', images[0]);
        }

        try {
            const result = isEditing && destination
                ? await updateDestination(destination.id, formData)
                : await createDestination(formData);

            if (result && 'error' in result) {
                setError(result.error);
                setIsSubmitting(false);
            } else {
                // Success handled by redirect in action
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!destination) return;

        startTransition(async () => {
            try {
                const result = await deleteDestination(destination.id);
                if (result && result.error) {
                    setError(result.error);
                } else {
                    router.push('/dashboard/destinations');
                    router.refresh();
                }
            } catch (err) {
                console.error(err);
                setError('Failed to delete destination');
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/dashboard/destinations"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Destinations
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? `Edit ${destination?.name}` : 'New Destination'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={destination?.name}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                            placeholder="e.g., Bali"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            name="country"
                            type="text"
                            required
                            defaultValue={destination?.country}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                            placeholder="e.g., Indonesia"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={destination?.description}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                            placeholder="Brief description of the destination..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Image
                        </label>
                        <CloudinaryImageUpload
                            onUpload={setImages}
                            defaultValue={images}
                            maxFiles={1}
                            folder="itinara/destinations"
                            label="Upload Hero Image"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="mr-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    )}

                    <Link
                        href="/dashboard/destinations"
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Destination
                            </>
                        )}
                    </button>
                </div>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Destination"
                description={`Are you sure you want to delete ${destination?.name}? All regions and linked places will remain but this destination entry will be removed. This action cannot be undone.`}
                isPending={isDeleting}
            />
        </div>
    );
}
