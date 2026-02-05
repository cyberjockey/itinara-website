import { NextRequest, NextResponse } from "next/server";
import { getTelegramFileUrl } from "@/services/telegram";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return new NextResponse("File ID is required", { status: 400 });
    }

    try {
        // 1. Get the real download URL from Telegram
        const telegramUrl = await getTelegramFileUrl(fileId);

        if (!telegramUrl) {
            return new NextResponse("Failed to resolve Telegram file URL", { status: 404 });
        }

        // 2. Fetch the image
        const imageResponse = await fetch(telegramUrl);

        if (!imageResponse.ok) {
            return new NextResponse("Failed to fetch image from Telegram", { status: imageResponse.status });
        }

        const contentType = imageResponse.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Return image with caching headers (cache for 1 year)
        // Telegram file paths change over time, but file_id is persistent our side. 
        // We rely on browser cache. If Telegram link expires, next request hits our API again.
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });

    } catch (error) {
        console.error("Error proxying Telegram image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
