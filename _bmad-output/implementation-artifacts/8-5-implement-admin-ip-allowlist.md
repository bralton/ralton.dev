# Story 8.5: Implement Admin IP Allowlist

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As **Ben (admin)**,
I want **the `/admin` route restricted to my dedicated IP address**,
So that **unauthorized access to the CMS is blocked at the edge**.

## Acceptance Criteria

1. **Given** Vercel Edge Middleware
   **When** I create/update `middleware.ts`
   **Then** requests to `/admin` and `/admin/*` paths are intercepted

2. **Given** the Cloudflare to Vercel architecture
   **When** extracting the client IP
   **Then** the `CF-Connecting-IP` header is checked first
   **And** fallback to `x-forwarded-for` header (first IP in list)
   **And** fallback to `x-real-ip` if others unavailable

3. **Given** the allowed IP configuration
   **When** setting up the allowlist
   **Then** the allowed IP is stored in `ADMIN_ALLOWED_IP` environment variable
   **And** the variable is set in Vercel project settings (not committed to repo)

4. **Given** a request to `/admin` from an allowed IP
   **When** the middleware checks the IP
   **Then** the request proceeds to the Next.js app normally

5. **Given** a request to `/admin` from a disallowed IP
   **When** the middleware checks the IP
   **Then** a 404 Not Found response is returned (not 403 Forbidden)
   **And** the custom 404 page from Story 8.4 is displayed
   **And** the response does not reveal that `/admin` exists (security through obscurity)
   **And** the blocked attempt is logged server-side (IP, timestamp, path)

6. **Given** the middleware configuration
   **When** matching paths
   **Then** only `/admin` routes are protected
   **And** all other routes (homepage, API, etc.) are unaffected

7. **Given** no `ADMIN_ALLOWED_IP` is configured
   **When** any request to `/admin` is made
   **Then** access is denied (fail secure)

## Tasks / Subtasks

- [x] Task 1: Create middleware file (AC: #1, #6)
  - [x] Create `src/middleware.ts` file
  - [x] Export middleware function
  - [x] Configure matcher to only intercept `/admin` and `/admin/*` paths
  - [x] Ensure other routes pass through unaffected

- [x] Task 2: Implement IP extraction logic (AC: #2)
  - [x] Create `getClientIP()` helper function
  - [x] Check `CF-Connecting-IP` header first (Cloudflare)
  - [x] Fallback to `x-forwarded-for` (first IP in comma-separated list)
  - [x] Fallback to `x-real-ip` header
  - [x] Return 'unknown' if no IP headers found

- [x] Task 3: Implement IP allowlist check (AC: #3, #4, #5, #7)
  - [x] Read `ADMIN_ALLOWED_IP` from environment variables
  - [x] If no IP configured, deny all (fail secure)
  - [x] Compare client IP against allowed IP
  - [x] Allow access if IPs match
  - [x] Block access if IPs don't match

- [x] Task 4: Implement 404 response for blocked requests (AC: #5)
  - [x] Use `NextResponse.rewrite()` to show 404 page
  - [x] Return 404 status code (not 403)
  - [x] Ensure response reveals nothing about admin existence

- [x] Task 5: Implement server-side logging (AC: #5)
  - [x] Log all admin access attempts (IP, timestamp, path)
  - [x] Log blocked attempts with warning level
  - [x] Log successful access with info level
  - [x] Log when ADMIN_ALLOWED_IP is not configured

- [x] Task 6: Test middleware behavior (AC: #1-7)
  - [x] Verify /admin routes are protected
  - [x] Verify other routes are not affected
  - [x] Test with CF-Connecting-IP header
  - [x] Test with x-forwarded-for header
  - [x] Test with x-real-ip header
  - [x] Test blocked access shows 404 (not 403)
  - [x] Test fail-secure when no IP configured

## Dev Notes

### Implementation Specification

**File to create:** `src/middleware.ts`

This is a Next.js middleware file that runs at the Edge before requests reach the application. It must be placed at the `src/` root level (or project root if no `src/` directory).

**Complete implementation from design document:**

```typescript
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

  // No IP found
  return 'unknown'
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

  // Check if IP is allowed
  if (clientIP !== allowedIP) {
    console.warn(`[Middleware] Blocked admin access - IP: ${clientIP}, expected: ${allowedIP}`)
    return createNotFoundResponse(request)
  }

  // IP matches, allow access
  console.log(`[Middleware] Admin access granted for IP: ${clientIP}`)
  return NextResponse.next()
}

function createNotFoundResponse(request: NextRequest): NextResponse {
  // Return 404 instead of 403 to hide admin existence
  // Use rewrite to 404 page while maintaining URL
  return NextResponse.rewrite(new URL('/404', request.url), {
    status: 404,
  })
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
```

### Architecture Context

**Request Flow:**
```
Visitor -> Cloudflare CDN/DNS -> Vercel Edge (middleware runs here) -> Next.js App -> Payload CMS
```

**IP Detection Priority:**
| Priority | Header | Source | Notes |
|----------|--------|--------|-------|
| 1 | `CF-Connecting-IP` | Cloudflare | True client IP through CF proxy |
| 2 | `x-forwarded-for` | Various proxies | First IP in comma-separated list |
| 3 | `x-real-ip` | Nginx/some proxies | Fallback |

**Why CF-Connecting-IP First:**
The site uses Cloudflare in front of Vercel. The `x-forwarded-for` header may contain intermediate IPs, but `CF-Connecting-IP` always contains the original client IP set by Cloudflare.

### Security Design Decisions

| Decision | Rationale |
|----------|-----------|
| Return 404 (not 403) | Hides admin panel existence from attackers |
| Fail closed (no IP = deny) | Security over convenience |
| Single IP (not CIDR) | Simpler, more secure for single admin |
| Log all attempts | Audit trail in Axiom/Vercel logs |
| Edge middleware | Blocks before hitting app server |

### Environment Variable Setup

**Name:** `ADMIN_ALLOWED_IP`
**Location:** Vercel Project Settings (not committed to repo)
**Format:** Single IPv4 address (e.g., `203.0.113.42`)

**Setup Steps:**
1. Find your dedicated IP (run `curl ifconfig.me` or check with ISP)
2. Go to Vercel -> Project -> Settings -> Environment Variables
3. Add `ADMIN_ALLOWED_IP` with your IP value
4. Set for Production environment only (or all if needed)

### Integration with Story 8.4 (Custom 404 Page)

The 404 page at `src/app/(frontend)/not-found.tsx` is already implemented:
- Generic design that reveals nothing about admin panel
- ASCII art "404" boxes with "Page Not Found" heading
- "Back to Home" CTA button
- Fully accessible (WCAG AA compliant)

The middleware rewrites blocked requests to `/404` which renders this page while keeping the original URL in the browser.

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**

**File Naming:**
- Middleware file: `middleware.ts` (lowercase, Next.js convention)

**Imports:**
- Use `@/` path alias if needed (not required for middleware-only dependencies)
- Import from `next/server` for middleware types

**TypeScript:**
- Use proper Next.js types: `NextRequest`, `NextResponse`
- Export middleware function as default export
- Export config object for matcher

**Logging:**
- Use `console.log` for info level (admin access granted)
- Use `console.warn` for warnings (blocked access, missing config)
- Logs appear in Vercel Functions logs and Axiom

### Project Structure Notes

**File location:** `src/middleware.ts`

This follows Next.js conventions:
- Middleware must be at `src/middleware.ts` (or `middleware.ts` at project root)
- Only one middleware file per project
- Runs at the Edge before every request (filtered by matcher)

**Matcher configuration:**
```typescript
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
```
- `/admin` - matches exactly `/admin`
- `/admin/:path*` - matches `/admin/anything/nested/paths`

**Existing relevant files:**
- `src/app/(payload)/` - Payload admin panel route group
- `src/app/(frontend)/not-found.tsx` - Custom 404 page (Story 8.4)

### Technical Requirements

**Edge Runtime:**
Middleware runs in the Edge runtime which has restrictions:
- No Node.js APIs (fs, path, etc.)
- Limited to Web APIs
- Environment variables accessed via `process.env`
- `console.log` for logging (appears in Vercel logs)

**Response Types:**
- `NextResponse.next()` - Continue to application
- `NextResponse.rewrite(url)` - Rewrite to different URL (keeps original URL in browser)
- `NextResponse.redirect(url)` - Redirect to different URL

**For blocked requests, we use rewrite with 404 status:**
```typescript
NextResponse.rewrite(new URL('/404', request.url), { status: 404 })
```

### Previous Story Intelligence

**From Story 8.4 (Custom 404 Page):**
- 404 page is implemented at `src/app/(frontend)/not-found.tsx`
- Page is generic and reveals nothing about admin panel existence
- Uses ASCII art, semantic HTML, and WCAG AA compliant colors
- Page renders correctly when accessed via rewrite

**Git commits reference:**
```
420047a feat(ui): add custom 404 page with ASCII art
```

**Learned patterns:**
- Use JetBrains Mono (`font-mono`) for code-style elements
- Focus states: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
- Color scheme: teal-700 primary, teal-800 hover

### Git Intelligence

**Recent commits:**
```
420047a feat(ui): add custom 404 page with ASCII art
912daea docs(security): add branch protection rules documentation
76b6420 ci(deps): configure Dependabot for security updates
e180d5c ci(discord): add PR notification workflow
```

**Commit conventions observed:**
- `feat(...)`: New features
- `fix(...)`: Bug fixes
- `docs(...)`: Documentation
- `ci(...)`: CI/CD changes

**Suggested commit message for this story:**
```
feat(security): add admin IP allowlist middleware

Implement Edge middleware to protect /admin routes:
- Check CF-Connecting-IP header first (Cloudflare)
- Fall back to x-forwarded-for and x-real-ip headers
- Return 404 (not 403) for blocked IPs (security obscurity)
- Fail secure: deny all if ADMIN_ALLOWED_IP not configured
- Log all access attempts for audit trail
```

### Testing & Verification

**Local Testing:**
```bash
# Test with no IP set (should block - shows 404)
curl -I http://localhost:3000/admin

# Test with CF-Connecting-IP header
curl -I -H "CF-Connecting-IP: 127.0.0.1" http://localhost:3000/admin

# Test with x-forwarded-for header
curl -I -H "x-forwarded-for: 127.0.0.1" http://localhost:3000/admin

# Test non-admin path (should work normally)
curl -I http://localhost:3000/
```

**Production Verification:**
1. Access `/admin` from allowed IP - should load Payload admin panel
2. Access `/admin` from different IP/VPN - should show 404 page
3. Check Vercel logs for middleware output
4. Verify 404 page is identical to regular 404 (no admin hints)

**Note:** Set `ADMIN_ALLOWED_IP=127.0.0.1` in `.env.local` for local testing.

### Risk Assessment

**Risk Level:** Medium

**Rationale:**
- Middleware affects routing for admin paths
- Incorrect implementation could lock out admin access
- IP header spoofing is not a concern (Cloudflare strips/overwrites headers)

**Potential Issues:**
- IP changes (dynamic IP) - user needs to update Vercel env var
- IPv6 - current implementation assumes IPv4 (acceptable for personal site)
- Local development - need to set env var or use header injection

**Mitigation:**
- Test thoroughly before production deployment
- Have fallback access method (database direct access if locked out)
- Document IP update procedure

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-ci-devops-security-documentation.md#Story 8.5]
- [Source: _bmad-output/planning-artifacts/epic-8-design-document.md#Section 6]
- [Source: CLAUDE.md - Project structure and patterns]
- [Source: src/app/(frontend)/not-found.tsx - Custom 404 page implementation]
- [Reference: Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Reference: Cloudflare True-Client-IP](https://developers.cloudflare.com/fundamentals/reference/http-request-headers/)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified successfully with `npx next build`
- Middleware recognized as "Proxy (Middleware)" in build output
- TypeScript compilation passed without errors

### Completion Notes List

- Created `src/middleware.ts` with Edge middleware for admin IP allowlist
- Implemented `getClientIP()` helper with header priority: CF-Connecting-IP > x-forwarded-for > x-real-ip
- Implemented `isProtectedPath()` helper to check `/admin` and `/admin/*` paths
- Implemented `createNotFoundResponse()` to return 404 via NextResponse.rewrite()
- Configured matcher to only intercept `/admin` routes
- Added logging for all access attempts (granted/blocked)
- Fail-secure behavior: blocks all admin access if ADMIN_ALLOWED_IP not configured
- Build completed successfully, middleware integrated properly

### File List

- `src/middleware.ts` (new) - Edge middleware for admin IP allowlist protection

### Change Log

- 2026-03-11: Created admin IP allowlist middleware implementation (Story 8.5)
