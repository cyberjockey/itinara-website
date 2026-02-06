import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use dynamic to ensure environment variables are loaded at runtime
export const dynamic = 'force-dynamic';

/**
 * Public API endpoint for tracking referral events
 * POST /api/track/referral
 * 
 * Body: {
 *   ref_code: string,
 *   event_type: 'view' | 'click' | 'purchase',
 *   session_id: string,
 *   user_id?: string,
 *   metadata?: object
 * }
 */
export async function POST(request: NextRequest) {
    // Use service role for public insert operations
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    try {
        const body = await request.json();
        const { ref_code, event_type, session_id, user_id, metadata = {} } = body;

        // Validate required fields
        if (!ref_code || !event_type || !session_id) {
            return NextResponse.json(
                { error: "Missing required fields: ref_code, event_type, session_id" },
                { status: 400 }
            );
        }

        // Validate event_type
        if (!['view', 'click', 'purchase'].includes(event_type)) {
            return NextResponse.json(
                { error: "Invalid event_type. Must be 'view', 'click', or 'purchase'" },
                { status: 400 }
            );
        }

        // Verify ref_code exists
        const { data: refLink, error: refError } = await supabase
            .from("template_referral_links")
            .select("ref_code")
            .eq("ref_code", ref_code)
            .single();

        if (refError || !refLink) {
            return NextResponse.json(
                { error: "Invalid ref_code" },
                { status: 404 }
            );
        }

        // Add request metadata
        const enrichedMetadata = {
            ...metadata,
            user_agent: request.headers.get("user-agent"),
            referer: request.headers.get("referer"),
            ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
            timestamp: new Date().toISOString(),
        };

        // Insert tracking event
        const { error: insertError } = await supabase
            .from("template_referral_events")
            .insert({
                ref_code,
                event_type,
                session_id,
                user_id: user_id || null,
                metadata: enrichedMetadata,
            });

        if (insertError) {
            console.error("Error inserting tracking event:", insertError);
            return NextResponse.json(
                { error: "Failed to record event" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Tracking API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
