import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('trip_comments').select('*').limit(50).order('created_at', { ascending: false });

    return NextResponse.json({ data, error });
}
