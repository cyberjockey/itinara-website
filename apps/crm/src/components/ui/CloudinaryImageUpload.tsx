'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface CloudinaryResource {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    resource_type: string;
}

interface CloudinaryImageUploadProps {
    onUpload: (urls: string[]) => void;
    defaultValue?: string[];
    maxFiles?: number;
    folder?: string;
    label?: string;
}

export default function CloudinaryImageUpload({
    onUpload,
    defaultValue = [],
    maxFiles = 1,
    folder = 'itinara/places',
    label = 'Upload Images'
}: CloudinaryImageUploadProps) {
    const [uploadedImages, setUploadedImages] = useState<string[]>(defaultValue);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUploadSuccess = (result: any) => {
        const info = result.info as CloudinaryResource;
        const newImages = [...uploadedImages, info.secure_url];
        setUploadedImages(newImages);
        onUpload(newImages);
    };

    const handleRemove = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);
        onUpload(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {uploadedImages.map((url, index) => (
                    <div key={url} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                        <Image
                            src={getImageUrl(url)}
                            alt="Uploaded"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {(uploadedImages.length < maxFiles) && (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                        maxFiles: maxFiles - uploadedImages.length,
                        folder: folder,
                        sources: ['local', 'url', 'camera'],
                        resourceType: 'image',
                    }}
                    onSuccess={handleUploadSuccess}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <ImagePlus className="w-8 h-8 mb-2" />
                            <span className="text-xs font-medium">{label}</span>
                        </button>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
}
