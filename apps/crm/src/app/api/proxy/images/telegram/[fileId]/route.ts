import { NextRequest, NextResponse } from "next/server";
import { getTelegramFileUrl } from "@/services/telegram";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return new NextResponse("File ID required", { status: 400 });
    }

    try {
        const fileUrl = await getTelegramFileUrl(fileId);

        if (!fileUrl) {
            return new NextResponse("File not found or Telegram error", { status: 404 });
        }

        const imageResponse = await fetch(fileUrl);

        if (!imageResponse.ok) {
            return new NextResponse("Failed to fetch image from Telegram", { status: imageResponse.status });
        }

        const contentType = imageResponse.headers.get("content-type") || "application/octet-stream";
        const buffer = await imageResponse.arrayBuffer();

        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error("Error proxying Telegram image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
