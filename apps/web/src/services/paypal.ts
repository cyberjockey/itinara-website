"use server";

/**
 * PayPal REST API Service
 * Handles OAuth token generation and order management
 */

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

interface PayPalAccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface PayPalOrderResponse {
    id: string;
    status: string;
    links: Array<{ href: string; rel: string; method: string }>;
}

interface PayPalCaptureResponse {
    id: string;
    status: string;
    purchase_units: Array<{
        reference_id: string;
        payments: {
            captures: Array<{
                id: string;
                status: string;
                amount: { currency_code: string; value: string };
                custom_id?: string;
            }>;
        };
    }>;
    payer: {
        email_address: string;
        payer_id: string;
        name: { given_name: string; surname: string };
    };
}

interface OrderMetadata {
    userId: string;
    userEmail: string;
    planType: 'premium' | 'vip';
    tripCount: number;
    tripId?: string;
}

/**
 * Generate PayPal OAuth2 Access Token
 */
export async function getPayPalAccessToken(): Promise<string> {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal OAuth error:', error);
        throw new Error('Failed to get PayPal access token');
    }

    const data: PayPalAccessToken = await response.json();
    return data.access_token;
}

/**
 * Create a PayPal Order
 */
export async function createPayPalOrder(
    amountCents: number,
    currency: string,
    metadata: OrderMetadata
): Promise<{ orderId: string; approvalUrl: string }> {
    const accessToken = await getPayPalAccessToken();
    const amountValue = (amountCents / 100).toFixed(2);

    const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: amountValue,
                },
                description: `ITINARA ${metadata.planType.toUpperCase()} Trip Credit${metadata.tripCount > 1 ? 's' : ''} (x${metadata.tripCount})`,
                custom_id: JSON.stringify({
                    userId: metadata.userId,
                    planType: metadata.planType,
                    tripCount: metadata.tripCount,
                    tripId: metadata.tripId,
                }),
            },
        ],
        application_context: {
            brand_name: 'ITINARA',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal create order error:', error);
        throw new Error('Failed to create PayPal order');
    }

    const order: PayPalOrderResponse = await response.json();
    const approvalLink = order.links?.find((link: { rel: string; href: string }) => link.rel === 'approve');

    return {
        orderId: order.id,
        approvalUrl: approvalLink?.href || '',
    };
}

/**
 * Capture a PayPal Order (after user approval)
 */
export async function capturePayPalOrder(orderId: string): Promise<{
    success: boolean;
    captureId?: string;
    status?: string;
    metadata?: OrderMetadata;
}> {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('PayPal capture error:', error);
        return { success: false };
    }

    const capture: PayPalCaptureResponse = await response.json();
    const captureDetails = capture.purchase_units?.[0]?.payments?.captures?.[0];

    // Parse custom metadata
    let metadata: OrderMetadata | undefined;
    try {
        const customId = captureDetails?.custom_id || capture.purchase_units?.[0]?.reference_id;
        // Note: The original HEAD code had a more complex check for customId
        if (customId && customId.startsWith('{')) {
            metadata = JSON.parse(customId);
        }
    } catch (e) {
        console.error('Failed to parse order metadata:', e);
    }

    return {
        success: capture.status === 'COMPLETED',
        captureId: captureDetails?.id,
        status: capture.status,
        metadata,
    };
}

/**
 * Get PayPal Order Details
 */
export async function getPayPalOrderDetails(orderId: string): Promise<unknown> {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get PayPal order details');
    }

    return response.json();
}
