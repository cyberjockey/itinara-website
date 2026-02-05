
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('file_id');

    if (!fileId) {
        return NextResponse.json({ error: "Missing file_id" }, { status: 400 });
    }

    const token = process.env.TELEGRAM_FILES_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        // 1. Get file path from Telegram
        const response = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        const data = await response.json();

        if (!data.ok || !data.result?.file_path) {
            console.error("Telegram getFile error:", data);
            return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
        }

        const filePath = data.result.file_path;

        // 2. Construct download URL
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

        // 3. Redirect to the actual file
        return NextResponse.redirect(downloadUrl);

    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
