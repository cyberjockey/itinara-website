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
        console.error("Signup error:", error);
        // Supabase specific error handling for clearer messages
        if (error.message.includes("Error sending confirmation email")) {
            return { message: "Failed to send confirmation email. Please check Supabase SMTP settings or try again later." };
        }
        return { message: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard?event=sign_up");
}
