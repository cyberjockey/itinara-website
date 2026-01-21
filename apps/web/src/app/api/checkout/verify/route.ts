import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { processStripePurchase } from '@/services/stripe';

export async function POST(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing Bearer Token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Initialize Supabase Client with the user's token
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // Call the shared service
        // Note: processStripePurchase expects a Supabase client.
        // We pass our authenticated client.
        const result = await processStripePurchase(sessionId, supabase, user.id);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);

    } catch (e: any) {
        console.error("Verification Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
