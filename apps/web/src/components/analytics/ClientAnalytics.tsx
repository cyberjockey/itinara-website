"use client";

import { useEffect, useRef } from "react";

interface ClientAnalyticsProps {
    event: string;
    params: Record<string, any>;
}

export function ClientAnalytics({ event, params }: ClientAnalyticsProps) {
    const hasFired = useRef(false);

    useEffect(() => {
        if (hasFired.current) return;

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event, params);
            hasFired.current = true;
        } else {
            // Retry once after a short delay in case script loads late
            const timer = setTimeout(() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', event, params);
                    hasFired.current = true;
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [event]); // Intentionally omitting params to avoid re-firing

    return null;
}
