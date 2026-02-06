import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_FILES_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        return NextResponse.json({ error: "Bot token not configured" }, { status: 500 });
    }

    try {
        // Get file path from Telegram
        const fileInfoRes = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );
        const fileInfo = await fileInfoRes.json();

        if (!fileInfo.ok || !fileInfo.result?.file_path) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Fetch the actual file
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
        const fileResponse = await fetch(fileUrl);

        if (!fileResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
        }

        const contentType = fileResponse.headers.get("content-type") || "image/jpeg";
        const buffer = await fileResponse.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error proxying Telegram image:", error);
        return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
    }
}
