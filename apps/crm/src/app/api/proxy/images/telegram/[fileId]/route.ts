import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        console.error("Missing TELEGRAM_BOT_TOKEN");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        // Get file path from Telegram
        const fileInfoResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );

        const fileInfo = await fileInfoResponse.json();

        if (!fileInfo.ok || !fileInfo.result?.file_path) {
            console.error("Failed to get file info:", fileInfo);
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Fetch the actual file
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
        const imageResponse = await fetch(fileUrl);

        if (!imageResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Telegram proxy error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
