"use client";

import { updateTemplate, deleteTemplate } from "@/app/dashboard/templates/actions";
import { useActionState, useState, useRef, useEffect, useTransition } from "react";
import { Save, Loader2, Check, Trash2 } from "lucide-react";
import TelegramMultiUploader from "@/components/ui/TelegramMultiUploader";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

interface TemplateDetailsFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template: any;
}

const initialState = {
    message: "",
};

export function TemplateDetailsForm({ template }: TemplateDetailsFormProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, startTransition] = useTransition();

    // @ts-expect-error - Known type mismatch
    const [state, formAction, isPending] = useActionState((state, formData) => updateTemplate(template.id, formData), initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // State for uploads
    const [featuredImage, setFeaturedImage] = useState<string>(template.featured_image || "");
    const [galleryImages, setGalleryImages] = useState<string[]>(template.gallery_images || []);
    const [guideMaterials, setGuideMaterials] = useState<string[]>(
        template.guide_materials?.length > 0
            ? template.guide_materials
            : (template.guide_material_url ? [template.guide_material_url] : [])
    );

    // Auto-save logic
    const [lastChange, setLastChange] = useState<number>(0);
    const debouncedChange = useDebounce(lastChange, 2000); // 2s delay
    const isFirstRender = useRef(true);

    const handleFormChange = () => {
        setLastChange(Date.now());
    };

    // Watch for upload state changes too
    useEffect(() => {
        handleFormChange();
    }, [featuredImage, galleryImages, guideMaterials]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (debouncedChange > 0 && formRef.current) {
            formRef.current.requestSubmit();
        }
    }, [debouncedChange]);

    const handleFeaturedImageUpload = (ids: string[]) => {
        setFeaturedImage(ids[0] || "");
    };

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteTemplate(template.id);
                router.push('/dashboard/templates');
                router.refresh();
            } catch (err) {
                console.error("Delete failed", err);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <form ref={formRef} action={formAction} onChange={handleFormChange} className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    {state?.message && (
                        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-lg flex items-center justify-between">
                            <span>{state.message}</span>
                            <Check className="w-4 h-4" />
                        </div>
                    )}

                    {/* Hidden inputs to submit arrays */}
                    <input type="hidden" name="featured_image" value={featuredImage} />
                    <input type="hidden" name="gallery_images" value={JSON.stringify(galleryImages)} />
                    <input type="hidden" name="guide_materials" value={JSON.stringify(guideMaterials)} />

                    <div>
                        <div className="space-y-6">
                            <div>
                                <TelegramMultiUploader
                                    label="Featured Image (Main Photo)"
                                    accept="image/*"
                                    maxFiles={1}
                                    type="image"
                                    defaultValue={featuredImage ? [featuredImage] : []}
                                    onUpload={handleFeaturedImageUpload}
                                />
                            </div>

                            <div>
                                <TelegramMultiUploader
                                    label="Gallery Images (Max 10)"
                                    accept="image/*"
                                    maxFiles={10}
                                    type="image"
                                    defaultValue={galleryImages}
                                    onUpload={setGalleryImages}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Exclusive Guide Material (PDF)</h3>
                        <p className="text-sm text-gray-500 mb-4">Upload PDFs containing exclusive tips, maps, or vouchers for travelers.</p>
                        <TelegramMultiUploader
                            label="Guide Materials (PDF, Max 10)"
                            accept="application/pdf"
                            maxFiles={10}
                            type="file"
                            defaultValue={guideMaterials}
                            onUpload={setGuideMaterials}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">General Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Trip Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    defaultValue={template.title}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    defaultValue={template.description || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulty Level
                                </label>
                                <select
                                    id="difficulty_level"
                                    name="difficulty_level"
                                    defaultValue={template.difficulty_level || 'moderate'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="challenging">Challenging</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Publication Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={template.status}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending_review">Submit for Review</option>
                                    <option value="published">Published (Admin only)</option>
                                    <option value="archived">Archived</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {template.status === 'published'
                                        ? "Visible to all travelers."
                                        : "Only visible to you."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="mr-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Template
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span>All changes saved</span>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Save Now
                    </button>
                </div>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Template"
                description={`Are you sure you want to delete "${template.title}"? This will remove the entire trip guide. This action cannot be undone.`}
                isPending={isDeleting}
            />
        </div>
    );
}
