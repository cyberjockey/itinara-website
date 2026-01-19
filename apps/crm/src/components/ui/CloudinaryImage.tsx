'use client';

import { CldImage, CldImageProps } from 'next-cloudinary';

interface CloudinaryImageWrapperProps extends Omit<CldImageProps, 'src'> {
    src: string;
    alt: string;
}

export default function CloudinaryImage({ src, alt, ...props }: CloudinaryImageWrapperProps) {
    // If it's not a cloudinary URL or public ID (simple check), maybe fall back?
    // But CldImage handles external URLs if configured.
    // For now, assume we're passing valid references.
    return (
        <CldImage
            src={src}
            alt={alt}
            width={props.width || 800}
            height={props.height || 600}
            {...props}
        />
    );
}
