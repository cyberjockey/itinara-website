import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
}

export function getPublicIdFromUrl(url: string): string | null {
    try {
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/sample.jpg
        // We want: folder/sample
        const regex = /\/v\d+\/(.+)\.[a-z]+$/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    } catch (e) {
        console.error("Error parsing public ID:", e);
        return null;
    }
}

export async function deleteImages(urls: string[]) {
    const results = [];
    for (const url of urls) {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
            try {
                const result = await deleteImage(publicId);
                results.push({ url, success: true, result });
            } catch (e) {
                results.push({ url, success: false, error: e });
            }
        }
    }
    return results;
}
