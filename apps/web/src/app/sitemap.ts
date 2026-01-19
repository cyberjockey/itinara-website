import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://itinaravacation.com'; // Production URL

    // Static Routes
    const routes = [
        '',
        '/login',
        '/signup',
        '/terms',
        '/privacy',
        '/disclaimer',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Destination Routes
    const supabase = createClient();
    const { data: destinations } = await supabase
        .from('destinations')
        .select('slug, created_at');

    const destinationRoutes = (destinations || []).map((destination) => ({
        url: `${baseUrl}/destinations/${destination.slug}`,
        lastModified: destination.created_at || new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Dynamic Blog Routes
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, published_at')
        .eq('status', 'published');

    const blogRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.published_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...destinationRoutes, ...blogRoutes];
}
