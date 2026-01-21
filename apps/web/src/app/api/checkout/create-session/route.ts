import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { stripe } from '@/services/stripe';

export async function POST(req: Request) {
    if (!stripe) {
        return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
    }

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
        const { priceId, successUrl, cancelUrl, metadata } = body;

        if (!priceId) {
            return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl || 'https://itinara.com', // Default to web if not provided, but mobile should provide deep link
            cancel_url: cancelUrl || 'https://itinara.com',
            customer_email: user.email,
            metadata: {
                userId: user.id,
                ...metadata
            },
            client_reference_id: user.id,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });

    } catch (e: any) {
        console.error("Stripe Create Session Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
