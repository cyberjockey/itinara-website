
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Config should be loaded from process.env via --env-file
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath, publicId) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: `itinara/blog/${publicId}`,
            folder: 'itinara/blog',
        });
        console.log(`UPLOAD_SUCCESS: ${publicId} -> ${result.secure_url}`);
    } catch (error) {
        console.error(`UPLOAD_ERROR: ${publicId} ->`, error.message);
    }
};

const main = async () => {
    const images = [
        { file: 'public/images/blog/bali-waterfall.png', id: 'bali-waterfall' },
        { file: 'public/images/blog/padang-food.png', id: 'padang-food' },
        { file: 'public/images/blog/komodo-dragon.png', id: 'komodo-dragon' },
    ];

    for (const img of images) {
        await uploadImage(path.resolve(process.cwd(), img.file), img.id);
    }
};

main();
