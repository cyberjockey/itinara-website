import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread_only") === "true";

    try {
        // Build query
        let query = supabase
            .from("notifications")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (unreadOnly) {
            query = query.eq("read", false);
        }

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.range(start, end);

        const { data: notifications, count, error } = await query;

        if (error) {
            console.error("Error fetching notifications:", error);
            return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
        }

        // Get unread count
        const { count: unreadCount } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("read", false);

        return NextResponse.json({
            notifications: notifications || [],
            unreadCount: unreadCount || 0,
            total: count || 0,
            page,
            limit
        });
    } catch (error) {
        console.error("Notifications API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Mark all notifications as read
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("user_id", user.id)
            .eq("read", false);

        if (error) {
            console.error("Error marking notifications as read:", error);
            return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark all read API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
