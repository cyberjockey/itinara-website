"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function AuthTracker() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const event = searchParams.get("event");

        if (event === "login" || event === "sign_up") {
            // Track event
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', event, {
                    method: event === 'sign_up' ? 'email' : 'email' // Defaulting to email for now
                });
            }

            // Mark as processed to avoid double firing in strict mode
            processedRef.current = true;

            // Clean up URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete("event");

            // Replace URL without refresh
            const query = params.toString();
            const url = query ? `${pathname}?${query}` : pathname;
            router.replace(url as any, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    return null;
}
