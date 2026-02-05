import { createClient } from "@/lib/supabase/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Separate credentials for file storage (CDN)
const FILES_BOT_TOKEN = process.env.TELEGRAM_FILES_BOT_TOKEN || BOT_TOKEN;
const FILES_CHAT_ID = process.env.TELEGRAM_FILES_CHAT_ID || CHAT_ID;

export async function sendTelegramNotification(message: string, buttons?: { text: string; url: string }[]) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn("Telegram credentials not found in environment variables.");
        return;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const payload: any = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
    };

    if (buttons && buttons.length > 0) {
        payload.reply_markup = {
            inline_keyboard: buttons.map(btn => [{
                text: btn.text,
                url: btn.url
            }])
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Failed to send Telegram message:", error);
        }
    } catch (err) {
        console.error("Error sending Telegram message:", err);
    }
}

export async function getTelegramFileUrl(fileId: string): Promise<string | null> {
    if (!FILES_BOT_TOKEN) return null;

    try {
        // 1. Get file path from file_id
        const fileInfoUrl = `https://api.telegram.org/bot${FILES_BOT_TOKEN}/getFile?file_id=${fileId}`;

        const response = await fetch(fileInfoUrl);
        const data = await response.json();

        if (!data.ok || !data.result?.file_path) {
            console.error("Failed to get Telegram file info:", data);
            return null;
        }

        // 2. Construct download URL
        return `https://api.telegram.org/file/bot${FILES_BOT_TOKEN}/${data.result.file_path}`;
    } catch (error) {
        console.error("Error fetching Telegram file URL:", error);
        return null;
    }
}

export async function uploadToTelegram(file: Blob, fileName: string, type: 'photo' | 'document' = 'document'): Promise<{ file_id: string } | null> {
    if (!FILES_BOT_TOKEN || !FILES_CHAT_ID) {
        console.warn("Telegram file storage credentials missing.");
        return null;
    }

    const formData = new FormData();
    formData.append("chat_id", FILES_CHAT_ID);

    // Append file with filename
    if (type === 'photo') {
        formData.append("photo", file, fileName);
    } else {
        formData.append("document", file, fileName);
    }

    const endpoint = type === 'photo' ? 'sendPhoto' : 'sendDocument';
    const url = `https://api.telegram.org/bot${FILES_BOT_TOKEN}/${endpoint}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!data.ok) {
            // Handle auto-migration of groups to supergroups
            if (data.error_code === 400 && data.parameters?.migrate_to_chat_id) {
                console.warn(`Telegram chat migrated. Retrying with new ID: ${data.parameters.migrate_to_chat_id}`);
                formData.set("chat_id", data.parameters.migrate_to_chat_id);

                const retryResponse = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });
                const retryData = await retryResponse.json();

                if (retryData.ok) {
                    // Replace data with retryData and proceed
                    return parseTelegramResponse(retryData, type);
                } else {
                    console.error(`Telegram retry failed (${endpoint}):`, retryData);
                    return null;
                }
            }

            console.error(`Telegram upload failed (${endpoint}):`, data);
            return null;
        }

        return parseTelegramResponse(data, type);

    } catch (error) {
        console.error("Error uploading to Telegram:", error);
        return null;
    }
}

function parseTelegramResponse(data: any, type: 'photo' | 'document'): { file_id: string } | null {
    let fileId = '';
    if (type === 'photo') {
        const photos = data.result.photo;
        if (photos && photos.length > 0) {
            fileId = photos[photos.length - 1].file_id;
        }
    } else {
        fileId = data.result.document?.file_id;
    }

    if (!fileId) {
        console.error("No file_id found in Telegram response", data);
        return null;
    }

    return { file_id: fileId };
}
