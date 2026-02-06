import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require CRM access (admin or local_guide role)
const CRM_PROTECTED_ROUTES = ['/dashboard'];

// Routes that only admins can access
const ADMIN_ONLY_ROUTES = [
    '/dashboard/users',
    '/dashboard/customers',
    '/dashboard/blog',
    '/dashboard/pages',
    '/dashboard/landing-pages',
    '/dashboard/moderation',
];

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
            cookieOptions: {
                name: 'itinara-crm-auth',
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname;

    // Protect dashboard routes - require authentication
    if (pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Redirect logged-in users away from login
    if (pathname.startsWith('/auth/login') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow invitation acceptance without role check
    if (pathname.startsWith('/auth/accept-invite')) {
        return response;
    }

    // RBAC: Check role-based access for CRM routes
    if (user && pathname.startsWith('/dashboard')) {
        // Fetch user role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const userRole = profile?.role;

        // Block travelers from CRM entirely
        if (!userRole || userRole === 'traveler') {
            return NextResponse.redirect(new URL('/auth/access-denied', request.url))
        }

        // Check admin-only routes
        const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some(route =>
            pathname === route || pathname.startsWith(route + '/')
        );

        if (isAdminOnlyRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
