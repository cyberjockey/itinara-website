"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic"; // ⬅️ WAJIB

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    const supabase = createClient();

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error("OAuth error:", error.message);
        router.replace("/login?error=oauth_failed");
        return;
      }

      // ✅ selalu ke dashboard
      router.replace("/dashboard");
    });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-gray">Signing you in…</p>
    </div>
  );
}
