// src/middleware.js

import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for automatic token refresh and route protection
 * Runs on every request before reaching the page
 */
export async function middleware(request) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const { pathname } = request.nextUrl;

    // Define public routes (no auth required)
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Define protected routes (auth required)
    const protectedRoutes = ['/profile', '/settings', '/dashboard', '/orders', '/vendors/saved'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // --- SCENARIO 1: User accessing public auth pages while logged in ---
    if (isPublicRoute && accessToken) {
        // Redirect logged-in users away from login/register pages
        return NextResponse.redirect(new URL('/', request.url));
    }

    // --- SCENARIO 2: User accessing protected routes without any tokens ---
    if (isProtectedRoute && !accessToken && !refreshToken) {
        // Redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // --- SCENARIO 3: AccessToken expired but refreshToken exists ---
    if (!accessToken && refreshToken) {
        try {
            // Call Express refresh endpoint
            const response = await fetch(`${process.env.BACKEND_URL}/user/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json();

                // Create response and set new cookies
                const res = NextResponse.next();

                res.cookies.set('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15 minutes
                    path: '/',
                });

                res.cookies.set('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                });

                return res;
            } else {
                // Refresh failed, clear cookies and redirect to login if on protected route
                const res = isProtectedRoute 
                    ? NextResponse.redirect(new URL('/auth/login', request.url))
                    : NextResponse.next();

                res.cookies.delete('accessToken');
                res.cookies.delete('refreshToken');

                return res;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);

            // On error, clear cookies and redirect if on protected route
            const res = isProtectedRoute
                ? NextResponse.redirect(new URL('/auth/login', request.url))
                : NextResponse.next();

            res.cookies.delete('accessToken');
            res.cookies.delete('refreshToken');

            return res;
        }
    }

    // --- SCENARIO 4: Everything is fine, proceed normally ---
    return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 * Exclude static files, images, and Next.js internals
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes (optional, remove if you want middleware on API routes)
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
};