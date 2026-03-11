import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require IP allowlist protection
const PROTECTED_PATHS = ['/admin']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function getClientIP(request: NextRequest): string {
  // Priority 1: Cloudflare's true client IP (most reliable with CF proxy)
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }

  // Priority 2: x-forwarded-for (first IP in chain)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0]
    return firstIP.trim()
  }

  // Priority 3: x-real-ip fallback
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  // No IP found - will be denied (fail secure)
  return 'unknown'
}

function createNotFoundResponse(request: NextRequest): NextResponse {
  // Rewrite to a non-existent path to trigger the not-found.tsx page
  // This maintains the original URL in the browser but shows 404 content
  // Security through obscurity: user cannot distinguish blocked admin from real 404
  const notFoundUrl = new URL('/--admin-blocked--', request.url)
  return NextResponse.rewrite(notFoundUrl)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only check protected paths
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const allowedIP = process.env.ADMIN_ALLOWED_IP
  const clientIP = getClientIP(request)

  // Log attempt (for Axiom/Vercel logs)
  console.log(`[Middleware] Admin access attempt from IP: ${clientIP}, path: ${pathname}`)

  // If no allowlist configured, deny all (fail secure)
  if (!allowedIP) {
    console.warn('[Middleware] ADMIN_ALLOWED_IP not configured - blocking all admin access')
    return createNotFoundResponse(request)
  }

  // Deny if IP is unknown (could not be extracted from headers)
  // This prevents bypass via missing headers or misconfigured proxies
  if (clientIP === 'unknown') {
    console.warn('[Middleware] Blocked admin access - could not determine client IP')
    return createNotFoundResponse(request)
  }

  // Check if IP is allowed
  if (clientIP !== allowedIP) {
    console.warn(`[Middleware] Blocked admin access from IP: ${clientIP}`)
    return createNotFoundResponse(request)
  }

  // IP matches, allow access
  console.log(`[Middleware] Admin access granted for IP: ${clientIP}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
