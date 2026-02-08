import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // ⬇️ response HARUS dibuat dulu
  const response = NextResponse.redirect(`${origin}/dashboard`);

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  return response;
}
