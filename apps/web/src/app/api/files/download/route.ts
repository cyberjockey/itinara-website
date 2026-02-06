"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("file_id");

    if (!fileId) {
        return NextResponse.json({ error: "Missing file_id" }, { status: 400 });
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

        // Proxy file content securely
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
            return NextResponse.json({ error: "Failed to download file from Telegram" }, { status: 502 });
        }

        // Stream the response
        const contentType = fileRes.headers.get("content-type") || "application/octet-stream";
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=3600");

        return new NextResponse(fileRes.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error fetching file:", error);
        return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }
}
