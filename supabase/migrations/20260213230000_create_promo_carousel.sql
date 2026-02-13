-- Create promotional carousel items table
CREATE TABLE IF NOT EXISTS public.promo_carousel_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, -- Internal use
    html_content TEXT NOT NULL, -- Raw HTML for the slide
    css_content TEXT, -- Optional raw CSS
    cta_link TEXT, -- Optional link for the whole slide or tracking
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.promo_carousel_items ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public can view active items
CREATE POLICY "Public can view active carousel items" 
ON public.promo_carousel_items FOR SELECT 
TO public 
USING (is_active = true);

-- Admins/Service Role can do everything
CREATE POLICY "Admins can manage carousel items" 
ON public.promo_carousel_items FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users with role 'admin' or 'super_admin' to manage
CREATE POLICY "Admins can manage carousel items (auth)"
ON public.promo_carousel_items FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'role' IN ('admin', 'super_admin') OR
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.promo_carousel_items;

-- Trigger for updated_at
CREATE TRIGGER update_promo_carousel_items_updated_at
    BEFORE UPDATE ON public.promo_carousel_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
