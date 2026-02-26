import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_LOGIN_URL = 'https://app.constructifylabs.com/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    return NextResponse.redirect(APP_LOGIN_URL);
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Add CORS headers for Firebase Auth
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add Content Security Policy for Google APIs and Firebase
  response.headers.set(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com; " +
    "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://accounts.google.com; " +
            "frame-src 'self' https://accounts.google.com https://constructify-463219-ee7d8.firebaseapp.com; " +
    "img-src 'self' data: https:; " +
    "style-src 'self' 'unsafe-inline';"
  );
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Changed from DENY to allow Google OAuth popup
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 