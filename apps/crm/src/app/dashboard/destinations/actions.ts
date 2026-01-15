'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type Destination = {
    id: string
    name: string
    country: string
    description?: string
    image_url?: string
    currency?: string
    language?: string
    managed_by?: string
    guide_count?: number
    template_count?: number
}

export async function getDestinations() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching destinations:', error)
        return []
    }

    return data as Destination[]
}

export async function getDestination(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching destination:', error)
        return null
    }

    return data as Destination
}

export async function createDestination(formData: FormData) {
    const supabase = await createClient()

    // Check auth and role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Ideally check for admin role here too or rely on RLS

    const name = formData.get('name') as string
    const country = formData.get('country') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    const { error } = await supabase
        .from('destinations')
        .insert({
            name,
            country,
            description,
            image_url,
            managed_by: user.id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/destinations')
    redirect('/dashboard/destinations')
}

export async function updateDestination(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const country = formData.get('country') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    const { error } = await supabase
        .from('destinations')
        .update({
            name,
            country,
            description,
            image_url
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/destinations')
    redirect('/dashboard/destinations')
}

export async function deleteDestination(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/destinations')
}
