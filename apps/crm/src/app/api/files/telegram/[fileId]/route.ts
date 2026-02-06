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
        // 1. Get File Path
        const getFileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const getFileData = await getFileRes.json();

        if (!getFileData.ok || !getFileData.result?.file_path) {
            console.error("Telegram getFile error:", getFileData);
            return new NextResponse("File not found on Telegram", { status: 404 });
        }

        const filePath = getFileData.result.file_path;

        // 2. Fetch File Content
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
            return new NextResponse("Failed to fetch file content", { status: fileRes.status });
        }

        // 3. Proxy Response
        const contentType = fileRes.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await fileRes.arrayBuffer();

        // Cache for 1 hour? Or forever since file_id usually doesn't change content?
        // Telegram file paths expire though? No, paths are usually stable for a while, but let's cache for 1 hour.

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600",
                "Content-Disposition": `inline; filename="${fileId}"` // Or try to get original name usage?
            }
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
