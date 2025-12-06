import { NextResponse } from 'next/server';

const ROUTES = {
    // User routes
    userPublic: ['/auth/login', '/auth/register', '/auth/forgot-password'],
    userProtected: ['/profile', '/settings', '/dashboard', '/orders', '/saved-vendors'],

    // Vendor routes
    vendorPublic: ['/auth/vendor/login', '/auth/vendor/register'],
    vendorProtected: ['/vendor/'],

    // Admin routes
    adminPublic: ['/auth/admin/login'],
    adminProtected: ['/admin/'],
};

const TOKEN_CONFIG = {
    access: {
        maxAge: 15 * 60, // 15 minutes
    },
    refresh: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // Get all tokens
    const userTokens = {
        access: request.cookies.get('accessToken_user')?.value,
        refresh: request.cookies.get('refreshToken_user')?.value,
    };
    const vendorTokens = {
        access: request.cookies.get('accessToken_vendor')?.value,
        refresh: request.cookies.get('refreshToken_vendor')?.value,
    };
    const adminTokens = {
        access: request.cookies.get('accessToken_admin')?.value,
        refresh: request.cookies.get('refreshToken_admin')?.value,
    };

    // Check route types
    const isUserPublic = ROUTES.userPublic.some(route => pathname.startsWith(route));
    const isUserProtected = ROUTES.userProtected.some(route => pathname.startsWith(route));

    const isVendorPublic = ROUTES.vendorPublic.some(route => pathname.startsWith(route));
    const isVendorProtected = ROUTES.vendorProtected.some(route => pathname.startsWith(route));

    const isAdminPublic = ROUTES.adminPublic.some(route => pathname.startsWith(route));
    const isAdminProtected = ROUTES.adminProtected.some(route => pathname.startsWith(route));

    // ====================================================
    // USER ROUTES
    // ====================================================

    // Logged-in user trying to access login/register
    if (isUserPublic && userTokens.access) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protected route - handle token refresh
    if (isUserProtected) {
        // Has valid access token - allow through
        if (userTokens.access) {
            return NextResponse.next();
        }

        // No access token but has refresh token - try to refresh
        if (!userTokens.access && userTokens.refresh) {
            const refreshResult = await refreshToken(userTokens.refresh);

            if (refreshResult.success) {
                // Create response and set new cookies
                const response = NextResponse.next();
                setAuthCookies(response, 'user', refreshResult.tokens);
                return response;
            }

            // Refresh failed - redirect to login
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // No tokens at all - redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // ====================================================
    // VENDOR ROUTES
    // ====================================================

    // Logged-in vendor trying to access login/register
    if (isVendorPublic && vendorTokens.access) {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    }

    // Protected route - handle token refresh
    if (isVendorProtected) {
        // Has valid access token - allow through
        if (vendorTokens.access) {
            return NextResponse.next();
        }

        // No access token but has refresh token - try to refresh
        if (!vendorTokens.access && vendorTokens.refresh) {
            const refreshResult = await refreshToken(vendorTokens.refresh);

            if (refreshResult.success) {
                const response = NextResponse.next();
                setAuthCookies(response, 'vendor', refreshResult.tokens);
                return response;
            }

            // Refresh failed - redirect to login
            return NextResponse.redirect(new URL('/auth/vendor/login', request.url));
        }

        // No tokens at all - redirect to login
        return NextResponse.redirect(new URL('/auth/vendor/login', request.url));
    }

    // ====================================================
    // ADMIN ROUTES
    // ====================================================

    if (isAdminPublic && adminTokens.access) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Protected route - handle token refresh
    if (isAdminProtected) {
        // Has valid access token - allow through
        if (adminTokens.access) {
            return NextResponse.next();
        }

        // No access token but has refresh token - try to refresh
        if (!adminTokens.access && adminTokens.refresh) {
            const refreshResult = await refreshToken(adminTokens.refresh);

            if (refreshResult.success) {
                const response = NextResponse.next();
                setAuthCookies(response, 'admin', refreshResult.tokens);
                return response;
            }

            // Refresh failed - redirect to login
            return NextResponse.redirect(new URL('/auth/admin/login', request.url));
        }

        // No tokens at all - redirect to login
        return NextResponse.redirect(new URL('/auth/admin/login', request.url));
    }

    // ====================================================
    // Allow all other requests
    // ====================================================
    return NextResponse.next();
}

/**
 * Refresh access token using refresh token
 */
async function refreshToken(refreshToken) {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/util/refresh-token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            return { success: false };
        }

        const data = await response.json();

        return {
            success: true,
            tokens: {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            },
        };
    } catch (error) {
        console.error('[Proxy] Token refresh error:', error);
        return { success: false };
    }
}

/**
 * Set authentication cookies for a role
 */
function setAuthCookies(response, role, tokens) {
    const isProduction = process.env.NODE_ENV === 'production';

    const baseOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
    };

    response.cookies.set(`accessToken_${role}`, tokens.accessToken, {
        ...baseOptions,
        maxAge: TOKEN_CONFIG.access.maxAge,
    });

    response.cookies.set(`refreshToken_${role}`, tokens.refreshToken, {
        ...baseOptions,
        maxAge: TOKEN_CONFIG.refresh.maxAge,
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon)
         * - public folder
         * - api routes (they handle their own auth)
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
};
