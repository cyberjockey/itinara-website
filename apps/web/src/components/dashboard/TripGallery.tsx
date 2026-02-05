"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

interface TripGalleryProps {
    images: string[];
}

export function TripGallery({ images }: TripGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const openGallery = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const closeGallery = () => setIsOpen(false);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + images.length - 1) % images.length);
    };

    if (!images || images.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-deep-teak mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-terracotta" />
                Trip Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => openGallery(idx)}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                    >
                        <Image
                            src={getImageUrl(img)}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Lightbox / Zoom View */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={closeGallery}>
                    {/* Close Button */}
                    <button
                        onClick={closeGallery}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image Container */}
                    <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                            <Image
                                src={getImageUrl(images[photoIndex])}
                                alt={`Gallery image ${photoIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium">
                        {photoIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
