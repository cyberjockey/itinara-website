"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface PlaceGalleryProps {
    photos: string[];
    placeName: string;
}

export function PlaceGallery({ photos, placeName }: PlaceGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!photos || photos.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="font-bold text-lg text-deep-teak mb-4">Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-64 md:h-80">
                {/* Main large image */}
                <div
                    className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(photos[0])}
                >
                    <Image
                        src={photos[0]}
                        alt={`${placeName} 1`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Secondary images */}
                {photos.slice(1, 5).map((photo, index) => (
                    <div
                        key={index}
                        className="relative rounded-xl overflow-hidden cursor-pointer group h-full bg-stone-gray/10"
                        onClick={() => setSelectedImage(photo)}
                    >
                        <Image
                            src={photo}
                            alt={`${placeName} ${index + 2}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay for "View all" on the last item if there are more */}
                        {index === 3 && photos.length > 5 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                +{photos.length - 5}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative w-full max-w-5xl h-[80vh]">
                        <Image
                            src={selectedImage}
                            alt={placeName}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
