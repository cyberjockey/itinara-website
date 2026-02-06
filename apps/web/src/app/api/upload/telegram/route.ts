import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Get Telegram bot credentials
        const botToken = process.env.TELEGRAM_FILES_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_FILES_CHAT_ID;

        if (!botToken || !chatId) {
            return NextResponse.json({ error: "Telegram Configuration Missing" }, { status: 500 });
        }

        // Send to Telegram
        const telegramFormData = new FormData();
        telegramFormData.append("chat_id", chatId);
        telegramFormData.append("document", file);

        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: telegramFormData,
        });

        const telegramData = await telegramRes.json();

        if (!telegramData.ok) {
            console.error("Telegram Upload Error:", telegramData);
            return NextResponse.json({ error: "Failed to upload to storage provider", details: telegramData }, { status: 500 });
        }

        // Extract file ID
        const res = telegramData.result;
        const fileId = res.document?.file_id || res.photo?.[res.photo.length - 1]?.file_id;

        if (!fileId) {
            console.error("Unexpected Telegram Structure:", JSON.stringify(telegramData));
            return NextResponse.json({ error: "Unexpected Telegram Response Structure" }, { status: 500 });
        }

        // Get File Path for Public URL
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        if (!fileData.ok || !fileData.result?.file_path) {
            return NextResponse.json({ error: "Failed to retrieve file path" }, { status: 500 });
        }

        const publicUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;

        return NextResponse.json({
            file_id: fileId,
            url: publicUrl, // RETURN THE URL
            filename: file.name,
            size: file.size,
            type: file.type
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
