"use client";

import { updateTemplate } from "@/app/dashboard/templates/actions";
import { useActionState, useState, useRef, useEffect } from "react";
import { Save, Loader2, Check } from "lucide-react";
import TelegramFileUpload from "@/components/ui/TelegramFileUpload";
import { useDebounce } from "@/hooks/use-debounce";

interface TemplateDetailsFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template: any;
}

const initialState = {
    message: "",
};

export function TemplateDetailsForm({ template }: TemplateDetailsFormProps) {
    // @ts-expect-error - Known type mismatch
    const [state, formAction, isPending] = useActionState((state, formData) => updateTemplate(template.id, formData), initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // State for uploads
    const [featuredImage, setFeaturedImage] = useState<string>(template.featured_image || "");
    const [galleryImages, setGalleryImages] = useState<string[]>(template.gallery_images || []);
    const [guideMaterials, setGuideMaterials] = useState<string[]>(template.guide_materials || (template.guide_material_url ? [template.guide_material_url] : []));

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

    const handleFeaturedImageUpload = (files: string[]) => {
        setFeaturedImage(files[0] || "");
    };

    return (
        <form ref={formRef} action={formAction} onChange={handleFormChange} className="max-w-3xl mx-auto p-8 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {state?.message && (
                    <div className="bg-green-50 text-green-700 text-sm p-4 rounded-lg">
                        {state.message}
                    </div>
                )}

                {/* Hidden inputs to submit the arrays/strings */}
                <input type="hidden" name="featured_image" value={featuredImage} />
                <input type="hidden" name="gallery_images" value={JSON.stringify(galleryImages)} />
                <input type="hidden" name="guide_materials" value={JSON.stringify(guideMaterials)} />

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-black mb-4">Featured Image</h3>
                        <TelegramFileUpload
                            onUpload={handleFeaturedImageUpload}
                            defaultValue={featuredImage ? [featuredImage] : []}
                            maxFiles={1}
                            type="photo"
                            label="Upload Cover Photo"
                            description="Main image displayed on cards. Max 10MB."
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-black mb-4">Gallery Images (Up to 10)</h3>
                        <TelegramFileUpload
                            onUpload={setGalleryImages}
                            defaultValue={galleryImages}
                            maxFiles={10}
                            type="photo"
                            label="Upload Gallery Photos"
                            description="Additional photos for the trip gallery. Max 10MB each."
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-black mb-4">Exclusive Guide Materials (PDF)</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload up to 10 PDF guides, maps, or vouchers. Max 20MB each.</p>
                    <TelegramFileUpload
                        onUpload={setGuideMaterials}
                        defaultValue={guideMaterials}
                        maxFiles={10}
                        accept="application/pdf"
                        type="document"
                        label="Upload Guide PDFs"
                        description="PDF files only."
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-black mb-4">General Information</h3>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-gray-400"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-black mb-4">Settings</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty Level
                            </label>
                            <select
                                id="difficulty_level"
                                name="difficulty_level"
                                defaultValue={template.difficulty_level || 'moderate'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
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

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Details
                </button>
            </div>
        </form>
    );
}
