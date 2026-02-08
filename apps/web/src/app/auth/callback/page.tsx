export const dynamic = "force-dynamic";

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                const next = searchParams.get("next");
                router.replace(
                    next && next.startsWith("/") ? next : "/dashboard"
                );
            } else {
                router.replace("/login");
            }
        });
    }, []);

    return <p className="p-8">Signing you in…</p>;
}
