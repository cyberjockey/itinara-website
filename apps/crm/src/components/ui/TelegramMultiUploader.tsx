"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TelegramMultiUploaderProps {
    label: string;
    accept: string;
    maxFiles?: number;
    maxSizeMB?: number; // Defaults to 10
    defaultValue?: string[]; // Array of File IDs
    onUpload: (fileIds: string[]) => void;
    type: "image" | "file";
}

export default function TelegramMultiUploader({
    label,
    accept,
    maxFiles = 10,
    maxSizeMB = 10,
    defaultValue = [],
    onUpload,
    type
}: TelegramMultiUploaderProps) {
    const [fileIds, setFileIds] = useState<string[]>(defaultValue);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (fileIds.length + files.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        setError(null);
        setIsUploading(true);

        const newIds: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.size > maxSizeMB * 1024 * 1024) {
                    setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit.`);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload/telegram", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    console.error("Upload failed", data);
                    setError(data.error || "Failed to upload file.");
                } else {
                    newIds.push(data.file_id);
                }
            }

            const updatedIds = [...fileIds, ...newIds];
            setFileIds(updatedIds);
            onUpload(updatedIds);

        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Upload error occurred.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeFile = (idToRemove: string) => {
        const updated = fileIds.filter(id => id !== idToRemove);
        setFileIds(updated);
        onUpload(updated);
    };

    const getPreviewUrl = (id: string) => {
        if (id.startsWith("http") || id.startsWith("https")) return id;
        return `/api/files/telegram/${id}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <span className="text-xs text-gray-500">{fileIds.length} / {maxFiles}</span>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-2 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fileIds.map((id) => (
                    <div key={id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {type === 'image' ? (
                            <Image
                                src={getPreviewUrl(id)}
                                alt="Uploaded"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-2">
                                <FileText className="w-8 h-8 mb-2" />
                                <span className="text-[10px] text-center break-all line-clamp-2">{id.slice(0, 10)}...</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => removeFile(id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {fileIds.length < maxFiles && (
                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={cn(
                            "aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50",
                            isUploading && "opacity-50 cursor-wait"
                        )}
                    >
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-xs font-medium">Upload</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
