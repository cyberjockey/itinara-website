import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  // ✅ FIX: selalu ke dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
