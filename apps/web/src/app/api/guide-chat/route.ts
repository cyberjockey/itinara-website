import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/guide-chat?tripId=xxx
 * Fetches the conversation and messages for a trip
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    if (!tripId) {
        return NextResponse.json({ error: "Missing tripId" }, { status: 400 });
    }

    // Get conversation for this trip
    const { data: conversation, error: convError } = await supabase
        .from("guide_conversations")
        .select(`
            *,
            guide:profiles!guide_conversations_guide_id_fkey(id, full_name, avatar_url, guide_bio, guide_expertise, guide_verified),
            tourist:profiles!guide_conversations_tourist_id_fkey(id, full_name, avatar_url)
        `)
        .eq("trip_id", tripId)
        .single();

    if (convError && convError.code !== "PGRST116") {
        console.error("Conversation fetch error:", convError);
        return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
    }

    // If no conversation exists yet, return empty
    if (!conversation) {
        // Get trip info to show guide details even without conversation
        const { data: trip } = await supabase
            .from("trips")
            .select(`*, source_template_id`)
            .eq("id", tripId)
            .single();

        let guide = null;

        if (trip?.source_template_id) {
            // Get template and guide info
            const { data: template } = await supabase
                .from("trip_templates")
                .select("id, guide_id")
                .eq("id", trip.source_template_id)
                .single();

            if (template?.guide_id) {
                // Fetch guide profile directly
                const { data: guideProfile } = await supabase
                    .from("profiles")
                    .select("id, full_name, avatar_url, guide_bio, guide_expertise, guide_verified")
                    .eq("id", template.guide_id)
                    .single();

                // Fetch trip count for guide
                const { count } = await supabase
                    .from('trips')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', template.guide_id);

                guide = { ...guideProfile, total_trips: count || 0 };
            }
        }
        return NextResponse.json({
            conversation: null,
            messages: [],
            guide,
            isCurated: !!trip?.source_template_id || trip?.trip_type === 'vip',
            canChat: !!trip?.source_template_id || trip?.trip_type === 'vip'
        });
    }

    // Get messages for this conversation
    const { data: messages, error: msgError } = await supabase
        .from("guide_messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

    if (msgError) {
        console.error("Messages fetch error:", msgError);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    // Mark unread messages as read for the current user
    const unreadMessages = messages?.filter(m =>
        m.sender_id !== user.id && !m.read_at
    );

    if (unreadMessages && unreadMessages.length > 0) {
        await supabase
            .from("guide_messages")
            .update({ read_at: new Date().toISOString() })
            .in("id", unreadMessages.map(m => m.id));

        // Refresh dashboard cache
        revalidatePath('/dashboard');
    }

    return NextResponse.json({
        conversation,
        messages: messages || [],
        guide: conversation.guide,
        canChat: true
    });
}

/**
 * POST /api/guide-chat
 * Send a new message
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tripId, content, attachment_url, attachment_type, attachment_filename } = body;

    if (!tripId || (!content?.trim() && !attachment_url)) {
        return NextResponse.json({ error: "Missing tripId or content/attachment" }, { status: 400 });
    }

    // Get trip to verify it's active and has a template
    const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select(`*, source_template_id`)
        .eq("id", tripId)
        .single();

    // Fetch template separately to get guide_id
    let template = null;
    if (trip?.source_template_id) {
        const { data: tmpl } = await supabase
            .from("trip_templates")
            .select("id, guide_id")
            .eq("id", trip.source_template_id)
            .single();
        template = tmpl;
    }

    if (tripError || !trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.status !== 'active') {
        return NextResponse.json({ error: "Trip must be active to chat" }, { status: 400 });
    }

    // Get or create conversation (Attempt to find existing first)
    let { data: conversation } = await supabase
        .from("guide_conversations")
        .select("id, guide_id")
        .eq("trip_id", tripId)
        .single();

    if (!conversation) {
        // If creating new, require template and guide_id
        if (!trip.source_template_id || !template?.guide_id) {
            return NextResponse.json({ error: "This trip is not linked to a guide" }, { status: 400 });
        }

        // Create new conversation
        const { data: newConv, error: createError } = await supabase
            .from("guide_conversations")
            .insert({
                trip_id: tripId,
                guide_id: template!.guide_id,
                tourist_id: trip.user_id,
                status: 'active'
            })
            .select("id, guide_id")
            .single();

        if (createError) {
            console.error("Failed to create conversation:", createError);
            return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
        }

        conversation = newConv;
    }

    // Determine sender role
    const isGuide = user.id === conversation!.guide_id;
    const isTourist = user.id === trip.user_id;

    if (!isGuide && !isTourist) {
        return NextResponse.json({ error: "Not authorized for this conversation" }, { status: 403 });
    }

    const senderRole = isGuide ? 'guide' : 'tourist';

    // Insert message
    const { data: message, error: msgError } = await supabase
        .from("guide_messages")
        .insert({
            conversation_id: conversation!.id,
            sender_id: user.id,
            sender_role: senderRole,
            content: content?.trim() || '',
            attachment_url,
            attachment_type,
            attachment_filename
        })
        .select()
        .single();

    if (msgError) {
        console.error("Failed to send message:", msgError);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message });
}
