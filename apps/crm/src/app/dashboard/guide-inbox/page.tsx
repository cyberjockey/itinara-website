import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GuideInboxClient } from "./GuideInboxClient";

export default async function GuideInboxPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Check if user is a guide
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, guide_verified")
        .eq("id", user.id)
        .single();

    if (!profile || (profile.role !== "local_guide" && profile.role !== "admin")) {
        redirect("/dashboard");
    }

    // Fetch conversations assigned to this guide
    const { data: conversations, error } = await supabase
        .from("guide_conversations")
        .select(`
            *,
            tourist:profiles!guide_conversations_tourist_id_fkey(id, full_name, avatar_url, email),
            trip:trips(id, title, destination, start_date, end_date, status),
            latest_message:guide_messages(id, content, sender_role, created_at, read_at)
        `)
        .eq("guide_id", user.id)
        .order("last_message_at", { ascending: false });

    // Get unread counts
    const { data: unreadCounts } = await supabase
        .from("guide_messages")
        .select("conversation_id")
        .is("read_at", null)
        .eq("sender_role", "tourist");

    // Calculate unread count per conversation
    const unreadByConversation: Record<string, number> = {};
    unreadCounts?.forEach(msg => {
        unreadByConversation[msg.conversation_id] = (unreadByConversation[msg.conversation_id] || 0) + 1;
    });

    // Process conversations
    const processedConversations = conversations?.map(conv => ({
        ...conv,
        unreadCount: unreadByConversation[conv.id] || 0,
        latestMessage: conv.latest_message?.[0] || null
    })) || [];

    return <GuideInboxClient conversations={processedConversations} guideId={user.id} />;
}
