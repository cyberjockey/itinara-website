"use client";

import { updateTemplate } from "@/app/dashboard/templates/actions";
import { useActionState, useState } from "react";
import { Save, Loader2, ImageIcon } from "lucide-react";
import CloudinaryImageUpload from "@/components/ui/CloudinaryImageUpload";
import CloudinaryFileUpload from "@/components/ui/CloudinaryFileUpload";

interface TemplateDetailsFormProps {
    template: any;
}

const initialState = {
    message: "",
};

export function TemplateDetailsForm({ template }: TemplateDetailsFormProps) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState((state, formData) => updateTemplate(template.id, formData), initialState);

    // State for the uploaded image URL
    const [featuredImage, setFeaturedImage] = useState<string>(template.featured_image || "");
    const [pdfUrl, setPdfUrl] = useState<string | null>(template.guide_material_url || null);

    const handleImageUpload = (urls: string[]) => {
        if (urls.length > 0) {
            setFeaturedImage(urls[0]);
        } else {
            setFeaturedImage("");
        }
    };

    return (
        <form action={formAction} className="max-w-3xl mx-auto p-8 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {state?.message && (
                    <div className="bg-green-50 text-green-700 text-sm p-4 rounded-lg">
                        {state.message}
                    </div>
                )}

                {/* Hidden input to submit the image URL */}
                <input type="hidden" name="featured_image" value={featuredImage} />

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Image</h3>
                    <CloudinaryImageUpload
                        onUpload={handleImageUpload}
                        defaultValue={featuredImage ? [featuredImage] : []}
                        maxFiles={1}
                        folder="itinara/templates"
                        label="Upload Cover Photo"
                    />
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Exclusive Guide Material (PDF)</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload a PDF containing exclusive tips, maps, or vouchers for travelers who book this trip.</p>
                    <input type="hidden" name="guide_material_url" value={pdfUrl || ""} />
                    <CloudinaryFileUpload
                        onUpload={setPdfUrl}
                        defaultValue={pdfUrl}
                        label="Upload Guide PDF"
                        resourceType="auto"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
