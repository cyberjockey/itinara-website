'use server' // Force rebuild

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const betaCode = formData.get('betaCode') as string

    // Verify Beta Access Code
    const VALID_BETA_CODE = process.env.BETA_ACCESS_CODE || "BETA_2026";
    if (betaCode !== VALID_BETA_CODE) {
        return { error: "Invalid Beta Access Code" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
