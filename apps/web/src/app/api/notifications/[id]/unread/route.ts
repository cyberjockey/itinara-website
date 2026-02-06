import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Mark notification as unread
        const { error } = await supabase
            .from("notifications")
            .update({ read: false })
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error marking notification as unread:", error);
            return NextResponse.json({ error: "Failed to mark as unread" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark unread API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
