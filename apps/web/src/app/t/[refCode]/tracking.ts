/**
 * Client-side tracking utilities for referral events
 */

// Generate or retrieve a session ID for anonymous tracking
export function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem('itinara_session_id');

    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('itinara_session_id', sessionId);
    }

    return sessionId;
}

// Track a referral event
export async function trackReferralEvent(
    refCode: string,
    eventType: 'view' | 'click' | 'purchase',
    metadata: Record<string, any> = {}
) {
    try {
        const sessionId = getSessionId();

        // Send to internal API
        const response = await fetch('/api/track/referral', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ref_code: refCode,
                event_type: eventType,
                session_id: sessionId,
                metadata: {
                    ...metadata,
                    page_url: window.location.href,
                    timestamp: new Date().toISOString(),
                },
            }),
        });

        // Send to Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', `referral_${eventType}`, {
                event_category: 'Referral',
                event_label: refCode,
                value: eventType === 'purchase' ? 1 : 0
            });
        }

        if (!response.ok) {
            console.error('Failed to track event:', await response.text());
        }
    } catch (error) {
        console.error('Error tracking referral event:', error);
    }
}
