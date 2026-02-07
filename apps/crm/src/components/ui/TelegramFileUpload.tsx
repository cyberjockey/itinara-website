"use client";

import { useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import Image from "next/image";

interface TelegramFileUploadProps {
    onUpload: (files: string[]) => void;
    defaultValue?: string[];
    maxFiles?: number;
    accept?: string;
    type?: "photo" | "document";
    label?: string;
    description?: string;
}

export default function TelegramFileUpload({
    onUpload,
    defaultValue = [],
    maxFiles = 10,
    accept = "image/*",
    type = "photo",
    label = "Upload Files",
    description = "Drag & drop files here, or click to select files"
}: TelegramFileUploadProps) {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>(defaultValue);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check max files limit
        if (uploadedFiles.length + files.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("type", type);

        Array.from(files).forEach((file) => {
            formData.append("file", file);
        });

        try {
            const response = await fetch("/api/upload/telegram", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            // data.files is array of { file_id, url }
            // For now, we store the file_id or the proxy URL?
            // The component usage expects URLs (based on Cloudinary usage).
            // But we ideally want to store file_ids in DB.
            // Let's store the file_id, but the parent form might need to know.
            // Wait, our proxy URL is effectively the URL. Let's use file_id as the value we store, 
            // but for preview we need the proxy URL. 
            // The `onUpload` prop expects string[].
            // If we pass file_ids, the parent will save file_ids.
            // When we load back, `defaultValue` will be file_ids.
            // We need a way to convert file_id -> proxy URL for preview.
            // Our proxy route is `/api/proxy/images/telegram/[file_id]`.
            // So if the value looks like a URL, use it. If it's a raw ID, construct proxy URL.

            const newIds = data.files.map((f: { file_id: string }) => f.file_id);
            const updated = [...uploadedFiles, ...newIds];
            setUploadedFiles(updated);
            onUpload(updated);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong uploading files.");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const removeFile = (index: number) => {
        const updated = [...uploadedFiles];
        updated.splice(index, 1);
        setUploadedFiles(updated);
        onUpload(updated);
    };

    const getPreviewUrl = (idOrUrl: string) => {
        if (idOrUrl.startsWith("http")) return idOrUrl;
        return `/api/proxy/images/telegram/${idOrUrl}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <span className="text-xs text-gray-500">{uploadedFiles.length} / {maxFiles} files</span>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors bg-gray-50">
                <input
                    type="file"
                    multiple
                    accept={accept}
                    onChange={handleFileSelect}
                    disabled={isUploading || uploadedFiles.length >= maxFiles}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : (
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">
                        {isUploading ? "Uploading..." : "Click or drag files to upload"}
                    </div>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
            )}

            {/* Previews */}
            {uploadedFiles.length > 0 && (
                <div className={`grid gap-4 ${type === 'photo' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                            {type === 'photo' ? (
                                <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                                    <Image
                                        src={getPreviewUrl(file)}
                                        alt={`Upload ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-2">
                                    <div className="p-2 bg-red-50 rounded text-red-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate text-gray-700">Document {index + 1}</p>
                                        <p className="text-[10px] text-gray-400 font-mono truncate">{file.slice(0, 10)}...</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-red-500 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
