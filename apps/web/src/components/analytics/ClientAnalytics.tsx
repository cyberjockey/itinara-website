"use client";

import { useEffect, useRef } from "react";

interface ClientAnalyticsProps {
    event: string;
    params: Record<string, unknown>;
}

export function ClientAnalytics({ event, params }: ClientAnalyticsProps) {
    const hasFired = useRef(false);

    useEffect(() => {
        if (hasFired.current) return;

        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
        if (typeof window !== 'undefined' && gtag) {
            gtag('event', event, params);
            hasFired.current = true;
        } else {
            // Retry once after a short delay in case script loads late
            const timer = setTimeout(() => {
                const retryGtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
                if (typeof window !== 'undefined' && retryGtag) {
                    retryGtag('event', event, params);
                    hasFired.current = true;
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [event]); // Intentionally omitting params to avoid re-firing

    return null;
}
