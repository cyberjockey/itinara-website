"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const betaCode = formData.get("betaCode") as string;

    // Verify Beta Access Code
    const VALID_BETA_CODE = process.env.BETA_ACCESS_CODE || "BETA_2026";
    if (betaCode !== VALID_BETA_CODE) {
        return { message: "Invalid Beta Access Code. Please contact support." };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
            },
        },
    });

    if (error) {
        return { message: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
