import { NextRequest, NextResponse } from "next/server";
import { uploadToTelegram } from "@/services/telegram";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = Array.from(formData.entries()).filter(([key]) => key === "file").map(([, value]) => value as File);
        const type = formData.get("type") as "photo" | "document" || "document";

        if (files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const uploadedFiles: { file_id: string; url: string; name: string }[] = [];

        for (const file of files) {
            // Validate limits
            if (type === "photo" && file.size > 10 * 1024 * 1024) { // 10MB
                console.error(`File ${file.name} too large for photo`);
                continue;
            }
            if (type === "document" && file.size > 20 * 1024 * 1024) { // 20MB
                console.error(`File ${file.name} too large for document`);
                continue;
            }

            const result = await uploadToTelegram(file, file.name, type);

            if (result) {
                uploadedFiles.push({
                    file_id: result.file_id,
                    url: `/api/proxy/images/telegram/${result.file_id}`,
                    name: file.name
                });
            }
        }

        if (uploadedFiles.length === 0) {
            return NextResponse.json({ error: "Upload failed for all files" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
            file_id: uploadedFiles[0]?.file_id,
            url: uploadedFiles[0]?.url
        });

    } catch (error) {
        console.error("Error in upload route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
