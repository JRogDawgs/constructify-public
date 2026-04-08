import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const APP_LOGIN_URL = "https://app.constructifylabs.com/login"

/** Procore embedded iframe: allow parent origins (override via env, space-separated CSP sources). */
const DEFAULT_PROCORE_FRAME_ANCESTORS =
  "'self' https://sandbox.procore.com https://app.procore.com"

function procoreFrameAncestors(): string {
  const raw = process.env.NEXT_PUBLIC_PROCORE_FRAME_ANCESTORS?.trim()
  if (!raw) return DEFAULT_PROCORE_FRAME_ANCESTORS
  return raw
}

const BASE_CSP =
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com; " +
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://accounts.google.com https://*.cloudfunctions.net https://www.googleapis.com; " +
  "frame-src 'self' https://accounts.google.com https://constructify-463219-ee7d8.firebaseapp.com https://www.youtube.com https://www.youtube-nocookie.com; " +
  "img-src 'self' data: https:; " +
  "style-src 'self' 'unsafe-inline'; " +
  "media-src 'self' blob:;"

function isProcorePath(pathname: string): boolean {
  return pathname === "/procore" || pathname.startsWith("/procore/")
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    return NextResponse.redirect(APP_LOGIN_URL)
  }

  const response = NextResponse.next()
  const procore = isProcorePath(pathname)

  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )

  if (procore) {
    response.headers.set(
      "Content-Security-Policy",
      `${BASE_CSP} frame-ancestors ${procoreFrameAncestors()};`
    )
  } else {
    response.headers.set("Content-Security-Policy", BASE_CSP)
    response.headers.set("X-Frame-Options", "SAMEORIGIN")
  }

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
