"use server";

// PayPal API Configuration
const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

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
            }>;
        };
    }>;
    payer: {
        email_address: string;
        payer_id: string;
        name: { given_name: string; surname: string };
    };
}

// Get PayPal access token
export async function getPayPalAccessToken(): Promise<string> {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("PayPal token error:", error);
        throw new Error("Failed to get PayPal access token");
    }

    const data: PayPalAccessToken = await response.json();
    return data.access_token;
}

// Create PayPal order
export async function createPayPalOrder(
    amount: string,
    currency: string = "USD",
    description: string
): Promise<PayPalOrderResponse> {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                    description: description,
                },
            ],
            application_context: {
                brand_name: "Itinara",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/purchase?payment=cancelled`,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("PayPal create order error:", error);
        throw new Error("Failed to create PayPal order");
    }

    return response.json();
}

// Capture PayPal order (after user approves)
export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResponse> {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("PayPal capture error:", error);
        throw new Error("Failed to capture PayPal order");
    }

    return response.json();
}

// Get order details
export async function getPayPalOrderDetails(orderId: string): Promise<any> {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to get PayPal order details");
    }

    return response.json();
}
