import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConversationDetailClient } from "./ConversationDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch conversation with full details
    const { data: conversation, error } = await supabase
        .from("guide_conversations")
        .select(`
            *,
            tourist:profiles!guide_conversations_tourist_id_fkey(id, full_name, avatar_url, email),
            guide:profiles!guide_conversations_guide_id_fkey(id, full_name, avatar_url),
            trip:trips(id, title, destination, start_date, end_date, status, user_id)
        `)
        .eq("id", id)
        .single();

    if (error || !conversation) {
        redirect("/dashboard/guide-inbox");
    }

    // Verify user is the guide for this conversation
    if (conversation.guide_id !== user.id) {
        redirect("/dashboard/guide-inbox");
    }

    // Fetch all messages
    const { data: messages } = await supabase
        .from("guide_messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

    // Mark unread messages as read
    const unreadMessages = messages?.filter(m =>
        m.sender_id !== user.id && !m.read_at
    );

    if (unreadMessages && unreadMessages.length > 0) {
        await supabase
            .from("guide_messages")
            .update({ read_at: new Date().toISOString() })
            .in("id", unreadMessages.map(m => m.id));
    }

    return (
        <ConversationDetailClient
            conversation={conversation}
            initialMessages={messages || []}
            guideId={user.id}
        />
    );
}
