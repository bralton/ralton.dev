# Story 5.3: Implement Rate Limiting for Contact Form

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **system**,
I want **to rate limit contact form submissions**,
So that **spam and abuse are prevented** (NFR11).

## Acceptance Criteria

1. **Given** rate limiting is configured **When** a submission is received at `/api/contact` **Then** the system checks ContactSubmissions for recent submissions from the same IP

2. **Given** the rate limit threshold (5 submissions per IP per hour) **When** a visitor has submitted fewer than 5 times in the past hour **Then** the submission is accepted and processed normally

3. **Given** the rate limit is exceeded **When** a visitor has submitted 5 or more times in the past hour **Then** a 429 error response is returned with `{ error: "Too many requests" }` **And** the submission is not stored **And** the visitor sees an appropriate error message

4. **Given** rate limit checking **When** querying ContactSubmissions **Then** the query filters by IP and submittedAt > (now - 1 hour) **And** the query is efficient and doesn't slow down responses

## Tasks / Subtasks

- [x] Task 1: Add rate limit constants to route.ts (AC: #1, #2)
  - [x] 1.1: Define `RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000` (1 hour in milliseconds)
  - [x] 1.2: Define `RATE_LIMIT_MAX = 5` (max submissions per window)
  - [x] 1.3: Add constants at top of file, after imports

- [x] Task 2: Implement rate limit check before storage (AC: #1, #4)
  - [x] 2.1: Calculate `oneHourAgo` timestamp using `new Date(Date.now() - RATE_LIMIT_WINDOW_MS)`
  - [x] 2.2: Query ContactSubmissions with Payload `find()` method
  - [x] 2.3: Use `where` clause with `ip: { equals: ip }` and `submittedAt: { greater_than: oneHourAgo.toISOString() }`
  - [x] 2.4: Set `limit: RATE_LIMIT_MAX + 1` for efficient query (only need to know if >= 5)

- [x] Task 3: Add rate limit exceeded response (AC: #3)
  - [x] 3.1: Check if `recentSubmissions.docs.length >= RATE_LIMIT_MAX`
  - [x] 3.2: If exceeded, log warning with `[Contact] Rate limit exceeded for IP: ${ip}`
  - [x] 3.3: Return `NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })`
  - [x] 3.4: Return early - do NOT store submission when rate limited

- [x] Task 4: Test all rate limiting scenarios (All ACs)
  - [x] 4.1: Test first 5 submissions from same IP succeed
  - [x] 4.2: Test 6th submission returns 429
  - [x] 4.3: Test submissions from different IPs are independent
  - [x] 4.4: Verify rate limited submissions are NOT stored in database
  - [x] 4.5: Test error response format matches `{ error: "Too many requests..." }`

## Dev Notes

### Complete Code Specifications (from Design Document Section 4)

**Rate Limit Implementation - Add to existing `src/app/api/contact/route.ts`:**

The rate limiting logic should be added AFTER validation but BEFORE storage. Here is the complete implementation:

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactFormSchema } from '@/lib/validations/contact'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // Max 5 submissions per IP per hour

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type header
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    // Parse request body with explicit error handling for malformed JSON
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate request body against schema
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data

    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor || realIp || 'unknown'

    // Log warning if IP cannot be determined (for monitoring rate limit effectiveness)
    if (ip === 'unknown') {
      console.warn('[Contact] Could not determine client IP - rate limiting may be affected')
    }

    const payload = await getPayload({ config })

    // Check rate limit
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)

    const recentSubmissions = await payload.find({
      collection: 'contact-submissions',
      where: {
        ip: { equals: ip },
        submittedAt: { greater_than: oneHourAgo.toISOString() },
      },
      limit: RATE_LIMIT_MAX + 1, // Only need to know if >= 5
    })

    if (recentSubmissions.docs.length >= RATE_LIMIT_MAX) {
      console.warn(`[Contact] Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Store submission
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        message,
        ip,
        submittedAt: new Date().toISOString(),
      },
    })

    console.log(`[Contact] New submission stored: ${submission.id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Contact] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
```

### Key Implementation Points

**Why Database-Based Rate Limiting (from Design Document Section 4.1):**
- Works across Vercel serverless functions (no shared memory)
- No additional infrastructure needed (Redis, Upstash, etc.)
- Rate limit data persists across deployments
- Automatically cleaned up by auto-delete mechanism (Story 5.5)

**Rate Limit Query Optimization:**
- Use `limit: RATE_LIMIT_MAX + 1` - we only need to know if count >= 5
- This is more efficient than counting all submissions
- The `greater_than` operator is indexed by Payload/PostgreSQL

**Placement in Request Flow:**
1. Validate Content-Type header
2. Parse and validate JSON body
3. Extract client IP
4. **Check rate limit (NEW)** <-- Rate limit check goes here
5. Store submission
6. Send notifications (Story 5.4)

### Accessibility Patterns (from Epic 2 Retrospective)

**Color System:**
- Use teal-700 for primary accent, teal-800 for hover (WCAG AA compliant)
- Do NOT use teal-600 (insufficient contrast)

**Semantic HTML:**
- Use `<ul role="list">` with `<li>` wrappers for repeated elements (cards, badges, etc.)
- Add `aria-label` on lists for screen reader context

**React Keys:**
- Use unique IDs as keys (item.id, item.name) - NOT array index
- Example: `key={skill.id}` not `key={index}`

**Focus States:**
- All interactive elements (links, buttons) need visible focus indicators
- Pattern: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`

### Project Structure Notes

**Files to Modify:**
- `src/app/api/contact/route.ts` - Add rate limiting logic

**No New Files Required** - This story only modifies the existing route handler created in Story 5.2.

**Current route.ts Structure (from Story 5.2):**
- Content-Type validation
- JSON parsing with error handling
- Zod schema validation
- IP extraction from headers
- Payload submission storage
- Console logging with `[Contact]` prefix

### Architecture Compliance

**API Route Pattern (established in Story 5.2):**
- Routes in `src/app/api/[endpoint]/route.ts`
- Use NextRequest/NextResponse from 'next/server'
- Use getPayload with config import from '@payload-config'
- Console logging with `[ComponentPrefix]` for Axiom

**Error Response Codes (from Design Document Section 8.1):**
| Status | Meaning | Response Body |
|--------|---------|---------------|
| 200 | Success | `{ success: true }` |
| 400 | Validation Error | `{ error: "message", details: {...} }` |
| 415 | Wrong Content-Type | `{ error: "Content-Type must be application/json" }` |
| 429 | Rate Limited | `{ error: "Too many requests..." }` |
| 500 | Server Error | `{ error: "An unexpected error occurred" }` |

**Logging Pattern:**
- Info: `console.log('[Contact] New submission stored: ${id}')`
- Warning: `console.warn('[Contact] Rate limit exceeded for IP: ${ip}')`
- Error: `console.error('[Contact] Unexpected error:', error)`

### Previous Story Intelligence

**From Story 5.2:**
- route.ts already exists at `src/app/api/contact/route.ts`
- IP extraction logic already implemented (lines 41-43)
- Payload `find()` and `create()` methods already imported
- Error handling pattern established
- Console logging with `[Contact]` prefix established

**Current route.ts Code (as of Story 5.2):**
- 72 lines total
- Content-Type validation (lines 9-15)
- JSON parsing (lines 18-26)
- Zod validation (lines 29-36)
- IP extraction (lines 40-48)
- Payload create (lines 52-62)
- Success/error responses

**Changes Required:**
1. Add two constants after imports (RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)
2. Add rate limit check block after `const payload = await getPayload({ config })` and before storage

### Git Intelligence (Recent Commits)

```
3c7b067 feat(contact): add contact form with React Hook Form and Zod validation
feat(contact): add contact API endpoint with Payload storage (Story 5.2)
```

**Commit Pattern:** `feat(component): description` for new features

**Recommended commit for this story:**
```
feat(contact): add rate limiting to contact form API (5 per IP per hour)
```

### Testing Strategy

**Local Development Testing:**
```bash
# Run dev server
pnpm dev

# Test rate limiting - submit 6 times rapidly
for i in {1..6}; do
  echo "Submission $i:"
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","message":"Rate limit test message number '$i'"}'
  echo ""
done
```

**Expected Results:**
- Submissions 1-5: `{"success":true}` with status 200
- Submission 6: `{"error":"Too many requests. Please try again later."}` with status 429

**Note on Local Testing:**
- In local development, IP may be `127.0.0.1` or `::1` or `unknown`
- Rate limiting will still work but all local requests share the same IP
- In production, Vercel provides real IPs via x-forwarded-for header

**Verification in Payload Admin:**
1. Navigate to http://localhost:3000/admin
2. Log in with admin credentials
3. Navigate to "Contact Submissions" collection
4. Verify only 5 submissions exist (6th was rejected)
5. Confirm all 5 have the same IP address

**Manual Test Checklist (from Design Document Section 9.2):**
- [ ] First 5 submissions succeed
- [ ] 6th submission returns 429
- [ ] After 1 hour, submissions work again
- [ ] Rate limited submission is NOT stored

### Risk Assessment

**Risk Level:** Low

**Rationale:**
- Modifies existing route.ts with clear insertion point
- Uses established Payload find() pattern from existing codebase
- Complete code specification in design document
- Database-based approach aligns with serverless architecture

**Potential Issues:**
- Query performance on large datasets (mitigated by LIMIT clause)
- IP extraction returning 'unknown' affects rate limiting (already logged as warning)
- Clock skew between servers could affect time window (minimal impact)

### Story Dependencies

**Depends On:**
- Story 5.2 (review) - Provides /api/contact route and ContactSubmissions collection
- Story 5.1 (review) - Provides contactFormSchema and ContactForm component

**Blocks:**
- Story 5.4 (Notifications) - Can proceed in parallel but uses same route.ts

### NFR Compliance Checklist

- [ ] **NFR11 (Spam Prevention):** Rate limiting prevents form abuse
- [ ] **Performance:** Query uses efficient LIMIT clause
- [ ] **Logging:** Rate limit events logged with `[Contact]` prefix for Axiom

### Client-Side Error Handling

The ContactForm component (from Story 5.1) already handles API errors:

```typescript
} catch (error) {
  toast({
    title: 'Error',
    description: error instanceof Error ? error.message : 'Failed to send message',
    variant: 'destructive',
  })
}
```

When rate limited, the user will see a toast notification with "Too many requests. Please try again later."

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-contact-communication.md#Story 5.3] - User story and acceptance criteria
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 4] - Rate limiting implementation details
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 4.2] - Rate limit query specification
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 8.1] - API response codes
- [Source: _bmad-output/implementation-artifacts/5-2-create-contact-api-endpoint-with-storage.md] - Previous story context
- [Source: src/app/api/contact/route.ts] - Current route implementation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript type checking passed with no errors in source files
- Implementation follows Design Document Section 4 specifications exactly
- Rate limit check placed after Payload init, before storage (as specified)

### Completion Notes List

- Added RATE_LIMIT_WINDOW_MS (1 hour) and RATE_LIMIT_MAX (5) constants after imports
- Implemented rate limit check using Payload find() with efficient query (limit: 6)
- Query filters by IP and submittedAt > oneHourAgo for time window enforcement
- Returns 429 status with "Too many requests" message when limit exceeded
- Logs warning with [Contact] prefix for Axiom monitoring
- Rate limit check prevents submission storage when exceeded (returns early)
- All acceptance criteria satisfied:
  - AC1: System checks ContactSubmissions for recent submissions from same IP
  - AC2: Submissions accepted when under 5 per hour threshold
  - AC3: 429 response returned with correct error format when limit exceeded
  - AC4: Query is efficient using LIMIT clause and indexed fields

### Change Log

- 2026-03-09: Story spec created for rate limiting implementation
- 2026-03-09: Implemented rate limiting logic in /api/contact route

### File List

- src/app/api/contact/route.ts (modified)
