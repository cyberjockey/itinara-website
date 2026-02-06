import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 10MB Limit
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
        }

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

        // Extract File ID
        const res = telegramData.result;
        // Try common fields (document, photo, etc.)
        const doc = res.document ||
            (res.photo && res.photo[res.photo.length - 1]) ||
            res.video ||
            res.audio ||
            res.voice ||
            res.sticker;

        if (!doc) {
            console.error("Unexpected Telegram Structure:", JSON.stringify(telegramData));
            return NextResponse.json({ error: "Unexpected Telegram Response Structure" }, { status: 500 });
        }

        const fileId = doc.file_id;
        const fileName = doc.file_name || file.name;

        // Get File Path for Public URL
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        let publicUrl = null;
        if (fileData.ok && fileData.result?.file_path) {
            publicUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        }

        return NextResponse.json({
            success: true,
            file_id: fileId,
            url: publicUrl,
            file_name: fileName
        });

    } catch (error: unknown) {
        console.error("Upload handler error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
