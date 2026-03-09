# Story 5.2: Create Contact API Endpoint with Storage

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **system**,
I want **to store contact form submissions in the CMS**,
So that **Ben has a backup record of all inquiries** (FR13).

## Acceptance Criteria

1. **Given** the Payload CMS is configured **When** I create the ContactSubmissions collection **Then** it has fields: name, email, message, ip, submittedAt **And** the collection is not exposed publicly (admin only)

2. **Given** the `/api/contact` route exists **When** a valid form submission is received **Then** the data is validated server-side **And** the submission is stored in ContactSubmissions **And** the IP address is recorded for rate limiting **And** submittedAt timestamp is set automatically

3. **Given** server-side validation **When** invalid data is received **Then** a 400 error response is returned with `{ error: "message" }` **And** the submission is not stored

4. **Given** successful storage **When** the submission is saved **Then** a 200 response is returned with `{ success: true }`

5. **Given** a server error occurs **When** storage fails **Then** a 500 error response is returned **And** the error is logged to Axiom **And** no sensitive data is exposed to the client (NFR12)

## Tasks / Subtasks

- [x] Task 1: Create ContactSubmissions Payload collection (AC: #1)
  - [x] 1.1: Create `src/collections/ContactSubmissions.ts`
  - [x] 1.2: Define fields: name (text, required), email (email, required), message (textarea, required), ip (text, readOnly), submittedAt (date, required, readOnly)
  - [x] 1.3: Configure access control: read/update/delete require authenticated user, create is public (API can create)
  - [x] 1.4: Set admin panel options: useAsTitle='email', description, defaultColumns

- [x] Task 2: Register collection in payload.config.ts (AC: #1)
  - [x] 2.1: Import ContactSubmissions from './collections/ContactSubmissions'
  - [x] 2.2: Add ContactSubmissions to collections array

- [x] Task 3: Generate Payload types and run migrations (AC: #1, #2)
  - [x] 3.1: Run `pnpm payload generate:types` to update payload-types.ts
  - [x] 3.2: Run `pnpm payload migrate:create` to generate migration file
  - [x] 3.3: Run `pnpm payload migrate` to apply migration locally (via dev mode push)
  - [x] 3.4: Verify collection appears in Payload admin panel

- [x] Task 4: Create /api/contact route handler (AC: #2, #3, #4, #5)
  - [x] 4.1: Create `src/app/api/contact/route.ts`
  - [x] 4.2: Import getPayload, config, and contactFormSchema
  - [x] 4.3: Implement POST handler with try/catch
  - [x] 4.4: Parse and validate request body with Zod safeParse
  - [x] 4.5: Return 400 with error details if validation fails
  - [x] 4.6: Extract client IP from x-forwarded-for or x-real-ip headers
  - [x] 4.7: Store submission with payload.create()
  - [x] 4.8: Return 200 with { success: true } on successful storage
  - [x] 4.9: Catch errors, log with console.error prefix `[Contact]`, return 500

- [x] Task 5: Test all scenarios (All ACs)
  - [x] 5.1: Test valid submission stores data in database
  - [x] 5.2: Test invalid data returns 400 with error message
  - [x] 5.3: Test successful submission returns { success: true }
  - [x] 5.4: Test IP address is captured correctly
  - [x] 5.5: Test submittedAt timestamp is set
  - [x] 5.6: Verify submissions visible in Payload admin panel

## Dev Notes

### Complete Code Specifications (from Design Document)

**ContactSubmissions Collection - `src/collections/ContactSubmissions.ts`:**
```typescript
import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    description: 'Contact form submissions from visitors',
    defaultColumns: ['name', 'email', 'submittedAt'],
  },
  access: {
    // Only admins can view submissions
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // API can create
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the person who submitted the form',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address for replies',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Message content',
      },
    },
    {
      name: 'ip',
      type: 'text',
      admin: {
        description: 'IP address for rate limiting',
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the form was submitted',
        readOnly: true,
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],
}
```

**Register in payload.config.ts:**
```typescript
import { ContactSubmissions } from './collections/ContactSubmissions'

// Add to collections array:
collections: [Users, Media, Experiences, Education, Projects, Skills, ContactSubmissions],
```

**API Route Handler - `src/app/api/contact/route.ts`:**
```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactFormSchema } from '@/lib/validations/contact'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    const payload = await getPayload({ config })

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
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

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

**Files to Create:**
- `src/collections/ContactSubmissions.ts` - Payload collection for submissions
- `src/app/api/contact/route.ts` - API route handler

**Files to Modify:**
- `src/payload.config.ts` - Register ContactSubmissions collection

**Existing Files (from Story 5.1):**
- `src/lib/validations/contact.ts` - Zod schema (already exists, reuse for server validation)
- `src/components/ContactForm.tsx` - Client form (already expects /api/contact endpoint)

### Architecture Compliance

**From payload.config.ts Analysis:**
- Collections registered in `collections` array (not globals)
- Import pattern: `import { CollectionName } from './collections/CollectionName'`
- Collection files located in `src/collections/` directory
- Current collections: Users, Media, Experiences, Education, Projects, Skills
- Globals: Hero, About, GitHubData

**API Route Pattern:**
- Routes in `src/app/api/[endpoint]/route.ts`
- Use NextRequest/NextResponse from 'next/server'
- Use getPayload with config import from '@payload-config'
- Console logging with `[ComponentPrefix]` for Axiom

**Error Handling Pattern:**
- Log full error details with console.error and `[Contact]` prefix
- Return generic message to client (NFR12 - no sensitive data exposure)
- Use try/catch for all database operations
- Status codes: 200 (success), 400 (validation), 500 (server error)

### Previous Story Intelligence

**From Story 5.1:**
- Validation schema already exists at `src/lib/validations/contact.ts`
- ContactForm component expects `/api/contact` endpoint
- Expected success response: `{ success: true }`
- Expected error response: `{ error: "message" }`
- Toast notifications handle both success and error cases

**Dependencies Installed in Story 5.1:**
- react-hook-form@7.71.2
- zod@4.3.6
- @hookform/resolvers@5.2.2

**No additional dependencies needed for Story 5.2** - all server-side functionality uses Payload and Next.js built-ins.

### Git Intelligence (Recent Commits)

```
3c7b067 feat(contact): add contact form with React Hook Form and Zod validation
f415f6d docs(github): verify and mark story 4.4 graceful fallback as done
fd2165f docs(github): mark story 4.3 as done
```

**Commit Pattern:** `feat(component): description` for new features

**Recommended commit for this story:**
```
feat(contact): add contact API endpoint with Payload storage
```

### Database Migration Notes

**CRITICAL:** After creating the ContactSubmissions collection:
1. Run `pnpm payload generate:types` to update TypeScript types
2. Run `pnpm payload migrate:create` to generate migration
3. Run `pnpm payload migrate` to apply migration locally
4. Commit migration file before deployment
5. Vercel deployment will auto-run migrations

**From Epic 4 Retrospective:**
- Always generate migrations before deployment
- Test migrations locally first
- Migration files should be committed to version control

### Testing Strategy

**Local Development Testing:**
```bash
# Run dev server
pnpm dev

# Test with curl - valid submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello world test message"}'

# Expected response: {"success":true}

# Test with curl - invalid data (missing required field)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"T","email":"invalid","message":"Hi"}'

# Expected response: {"error":"Invalid form data","details":{...}} with status 400
```

**Verification in Payload Admin:**
1. Navigate to http://localhost:3000/admin
2. Log in with admin credentials
3. Navigate to "Contact Submissions" collection
4. Verify test submission appears with correct data

### Risk Assessment

**Risk Level:** Low

**Rationale:**
- Uses established Payload collection patterns from existing codebase
- Reuses validation schema from Story 5.1
- Complete code specifications in design document
- API route follows Next.js 15 app router conventions

**Potential Issues:**
- PostgreSQL migration might fail if collection slug conflicts (unlikely)
- IP extraction might return 'unknown' in development (acceptable)

### Story Dependencies

**Depends On:**
- Story 5.1 (completed) - Provides contactFormSchema and ContactForm component

**Blocks:**
- Story 5.3 (Rate Limiting) - Depends on this story for /api/contact route and IP storage
- Story 5.4 (Notifications) - Depends on this story for contact API endpoint

### API Response Contract

| Status | Meaning | Response Body |
|--------|---------|---------------|
| 200 | Success | `{ success: true }` |
| 400 | Validation Error | `{ error: "Invalid form data", details: {...} }` |
| 500 | Server Error | `{ error: "An unexpected error occurred" }` |

**Note:** Rate limiting (429) will be added in Story 5.3.

### NFR Compliance Checklist

- [x] **NFR12 (Sensitive Data):** No sensitive data exposed in error responses
- [x] **FR13 (Backup Record):** All submissions stored in CMS
- [x] **Logging:** Use `[Contact]` prefix for Axiom traceability

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-contact-communication.md#Story 5.2] - User story and acceptance criteria
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 2.1] - Payload collection specification
- [Source: _bmad-output/planning-artifacts/epic-5-design-document.md#Section 2.2] - API route handler specification
- [Source: _bmad-output/implementation-artifacts/5-1-create-contact-form-with-validation.md] - Previous story context
- [Source: src/payload.config.ts] - Existing collection registration pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript compilation: PASSED (no errors)
- Build verification: PASSED (Next.js build successful)
- API test - valid submission: HTTP 200, `{"success":true}`
- API test - invalid data: HTTP 400, validation errors returned
- API test - IP extraction: IP correctly extracted from x-forwarded-for header

### Completion Notes List

1. Created ContactSubmissions Payload collection with all required fields (name, email, message, ip, submittedAt)
2. Configured access control: admin-only read/update/delete, public create for API
3. Registered collection in payload.config.ts
4. Generated TypeScript types via `pnpm payload generate:types`
5. Created migration file `20260309_095049_add_contact_submissions.ts`
6. Created API route handler at `src/app/api/contact/route.ts`
7. Implemented server-side validation using existing Zod schema from `src/lib/validations/contact.ts`
8. Verified all acceptance criteria via curl tests:
   - AC1: Collection created with correct fields and admin-only access
   - AC2: Valid submissions stored with IP and timestamp
   - AC3: Invalid data returns 400 with error details
   - AC4: Success returns `{ success: true }`
   - AC5: Errors logged with `[Contact]` prefix, generic message returned to client

### Change Log

- 2026-03-09: Initial implementation of Story 5.2 - Contact API endpoint with Payload storage

### File List

**New Files:**
- src/collections/ContactSubmissions.ts
- src/app/api/contact/route.ts
- src/migrations/20260309_095049_add_contact_submissions.ts
- src/migrations/20260309_095049_add_contact_submissions.json

**Modified Files:**
- src/payload.config.ts (added ContactSubmissions import and registration)
- src/payload-types.ts (auto-generated types for ContactSubmission)
- src/migrations/index.ts (auto-updated migration index)
