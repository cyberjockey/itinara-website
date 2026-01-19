'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { FileText, X, UploadCloud } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CloudinaryFileSystemResource {
    secure_url: string;
    public_id: string;
    format: string;
    resource_type: string;
    original_filename: string;
}

interface CloudinaryFileUploadProps {
    onUpload: (url: string | null) => void;
    defaultValue?: string | null;
    label?: string;
    resourceType?: 'auto' | 'raw' | 'image';
}

export default function CloudinaryFileUpload({
    onUpload,
    defaultValue = null,
    label = 'Upload File',
    resourceType = 'auto'
}: CloudinaryFileUploadProps) {
    const [fileUrl, setFileUrl] = useState<string | null>(defaultValue);

    // Sync internal state if defaultValue changes
    useEffect(() => {
        setFileUrl(defaultValue);
    }, [defaultValue]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUploadSuccess = (result: any) => {
        const info = result.info as CloudinaryFileSystemResource;
        const newUrl = info.secure_url;
        setFileUrl(newUrl);
        onUpload(newUrl);
    };

    const handleRemove = () => {
        setFileUrl(null);
        onUpload(null);
    };

    return (
        <div className="space-y-2">
            {fileUrl ? (
                <div className="relative flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50 group">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {fileUrl.split('/').pop() || "Uploaded File"}
                        </p>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            View File
                        </a>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                        maxFiles: 1,
                        folder: 'itinara/documents',
                        sources: ['local', 'url'],
                        resourceType: resourceType,
                        clientAllowedFormats: ['pdf'], // Restrict to PDF for now based on requirement
                    }}
                    onSuccess={handleUploadSuccess}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all font-medium gap-2"
                        >
                            <UploadCloud className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
}
