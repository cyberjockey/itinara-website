import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/settings/', '/api/'], // Protect private/API routes
        },
        sitemap: 'https://itinara.com/sitemap.xml',
    };
}
