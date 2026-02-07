export interface Place {
    id: string;
    name: string;
    location: string | null;
    destination_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    full_address?: string | null;
    description?: string | null;
    rating?: number | null;
    social_media?: Record<string, string> | null;
    price_level?: string | null;
    ticket_price?: string | null;
    what_to_expect?: string | null;
    phone?: string | null;
    website?: string | null;
    amenities?: string[] | null;
    [key: string]: unknown;
}

export interface Activity {
    id: string;
    day_number: number;
    start_time: string | null;
    title: string;
    location: string | null;
    category: string | null;
    notes: string | null;
    trip_id?: string;
    place_name?: string | null;
    order_index?: number;
    place_id?: string | null;
    place?: Place | null;
    [key: string]: unknown;
}

export interface Trip {
    id: string;
    title: string;
    description?: string | null;
    destination: string;
    start_date: string;
    end_date: string;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    is_public?: boolean;
    source_template_id?: string | null;
    guide_materials?: string[] | null;
    guide_material_url?: string | null;
    metadata?: Record<string, unknown>;
}
