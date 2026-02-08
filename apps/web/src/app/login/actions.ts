"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(
  prevState: { message: string },
  formData: FormData,
) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/", "layout");

  const next = formData.get("next") as string;
  if (next && next.startsWith("/")) {
    redirect(next);
  }

  redirect("/dashboard?event=login");
}

export async function loginWithGoogle(next?: string) {
  const supabase = await createClient();

  const redirectTo = next
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error(error);
    redirect("/login?error=google_login_failed");
  }

  redirect(data.url);
}
