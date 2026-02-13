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
    return { message: error.message || "An unknown error occurred" };
  }

  revalidatePath("/", "layout");

  const next = formData.get("next") as string;
  if (next && next.startsWith("/")) {
    redirect(next);
  }

  return redirect("/dashboard?event=login");
}
