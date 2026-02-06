import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;
    const botToken = process.env.TELEGRAM_FILES_BOT_TOKEN;

    if (!botToken) {
        return new NextResponse("Telegram Configuration Missing", { status: 500 });
    }

    try {
        // Get file path from Telegram
        const getFileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const getFileData = await getFileRes.json();

        if (!getFileData.ok) {
            console.error("Telegram getFile error:", getFileData);
            return new NextResponse("File not found on Telegram", { status: 404 });
        }

        const filePath = getFileData.result.file_path;

        // Get the actual file from Telegram
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
            return new NextResponse("Failed to fetch file", { status: 500 });
        }

        const fileBuffer = await fileRes.arrayBuffer();

        // Return file with appropriate headers
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": fileRes.headers.get("Content-Type") || "application/octet-stream",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("File proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
