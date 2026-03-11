# Story 7.2: Document Data Collection Practices

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **the privacy policy to explain data handling**,
So that **I can make informed decisions about submitting my information** (FR26).

## Acceptance Criteria

1. **Given** data collection section
   **When** the privacy policy explains what data is collected
   **Then** it lists: name, email, message (from contact form)
   **And** it mentions IP address collection for rate limiting

2. **Given** data usage section
   **When** the privacy policy explains how data is used
   **Then** it states data is used to respond to inquiries
   **And** it clarifies IP is used for spam prevention only

3. **Given** data retention section
   **When** the privacy policy explains retention
   **Then** it states contact submissions are deleted after 90 days
   **And** it matches the actual retention policy (FR15, NFR14)

4. **Given** data sharing section
   **When** the privacy policy explains sharing
   **Then** it states no data is shared with third parties
   **And** it may mention service providers (Vercel, Resend) if applicable

5. **Given** contact information
   **When** visitors have questions
   **Then** the policy includes how to contact Ben about privacy concerns

6. **Given** the content
   **When** reviewing for accuracy
   **Then** all statements match actual data handling practices
   **And** the policy is written in plain language (not legalese)

## Tasks / Subtasks

- [x] Task 1: Update "Information We Collect" section (AC: #1)
  - [x] Replace placeholder text with actual data collection details
  - [x] List contact form fields: name, email, message
  - [x] Explain IP address collection for rate limiting purposes
  - [x] Use clear, plain language (avoid legal jargon)

- [x] Task 2: Update "How We Use Your Information" section (AC: #2)
  - [x] Replace placeholder text with usage explanations
  - [x] State that contact form data is used to respond to inquiries
  - [x] Clarify IP address is used only for spam prevention/rate limiting
  - [x] Mention email notifications are sent to Ben when form is submitted

- [x] Task 3: Update "Data Retention" section (AC: #3)
  - [x] Replace placeholder text with retention period details
  - [x] State contact submissions are automatically deleted after 90 days
  - [x] Explain this is an automated daily cleanup process
  - [x] Verify wording matches actual implementation (90 days in cleanup-contacts cron)

- [x] Task 4: Update "Third-Party Services" section (AC: #4)
  - [x] Replace placeholder text with service provider information
  - [x] Mention Vercel for hosting (infrastructure provider)
  - [x] Mention Resend for email delivery (notification service)
  - [x] State no data is sold or shared with third parties for marketing
  - [x] Clarify these services only process data as needed for site operation

- [x] Task 5: Update "Contact" section (AC: #5)
  - [x] Ensure contact section explains how to reach Ben about privacy
  - [x] Reference the contact form on the homepage
  - [x] Use welcoming, approachable language

- [x] Task 6: Verify content accuracy (AC: #6)
  - [x] Review all content against actual implementations in codebase
  - [x] Ensure 90-day retention matches `RETENTION_DAYS = 90` in cleanup-contacts
  - [x] Ensure rate limiting description matches actual behavior (5/IP/hour)
  - [x] Confirm service providers listed are actually used (Vercel, Resend)
  - [x] Run `pnpm lint` to verify code quality
  - [x] Test page renders correctly at `/privacy`

## Dev Notes

### Implementation Specification

**Files to modify:**
- `src/app/(frontend)/privacy/page.tsx` - Update placeholder content with actual privacy policy text

**No files to create** - the page structure already exists from Story 7.1

### Current Page Structure

The privacy page from Story 7.1 has these placeholder sections that need content:
- Overview (keep as-is, already has good intro text)
- Information We Collect (placeholder)
- How We Use Your Information (placeholder)
- Data Retention (placeholder)
- Third-Party Services (placeholder)
- Contact (basic placeholder)

### Content Guidelines

**Tone & Style:**
- Plain language, conversational but professional
- Short paragraphs (2-3 sentences max)
- Use bullet points for lists
- Avoid legal jargon (no "hereinafter", "pursuant to", etc.)
- First-person where appropriate ("I collect", "I use")
- Friendly but honest

**Example Tone:**
```
GOOD: "When you fill out the contact form, I collect your name, email address, and message."
BAD: "The data subject hereby acknowledges that personally identifiable information including but not limited to..."
```

### Actual Data Handling (from codebase analysis)

**Contact Form Data Collection** (`src/app/api/contact/route.ts`):
- Name (required, 2-100 characters)
- Email (required, valid email format)
- Message (required, 10-2000 characters)
- IP Address (from `x-forwarded-for` or `x-real-ip` headers)
- Submission timestamp

**Rate Limiting Implementation:**
- 5 submissions per IP address per hour
- Checked against `contactSubmissions` collection
- Returns 429 status when exceeded

**Data Storage** (`src/collections/ContactSubmissions.ts`):
- Stored in PostgreSQL via Payload CMS
- Only admins can view/edit/delete submissions
- API can create (for form submissions)

**Data Retention** (`src/app/api/cron/cleanup-contacts/route.ts`):
- 90-day retention period (`RETENTION_DAYS = 90`)
- Daily automated cleanup via Vercel Cron (3:00 AM UTC)
- Deletes submissions older than 90 days

**Notifications** (`src/lib/notifications.ts`):
- Email via Resend to Ben
- Discord webhook notification
- Non-blocking (doesn't affect form submission)

**Service Providers Used:**
- **Vercel**: Hosting, serverless functions, cron jobs, PostgreSQL database
- **Resend**: Transactional email delivery for contact notifications
- **Discord**: Webhook notifications (internal, no visitor data shared)

### Suggested Content

**Information We Collect:**
```
When you use the contact form on this site, I collect:

- Your name (so I know who I'm talking to)
- Your email address (so I can reply to you)
- Your message (the reason you're reaching out)
- Your IP address (to prevent spam and abuse)

I don't use cookies for tracking, and I don't collect any other personal information.
```

**How We Use Your Information:**
```
I use your contact form information to:

- Read and respond to your message
- Prevent spam by limiting how many messages can be sent from one IP address

That's it. I don't use your information for marketing, I don't build profiles, and I don't sell or share your data.
```

**Data Retention:**
```
Contact form submissions are automatically deleted after 90 days. This happens through an automated daily cleanup process.

If you'd like your submission deleted sooner, just let me know through the contact form (ironic, I know) and I'll remove it manually.
```

**Third-Party Services:**
```
To keep this site running, I use a few service providers:

- **Vercel** hosts the website and database
- **Resend** delivers email notifications when someone contacts me

These services only process your data as needed to provide their services. I don't sell or share your information with anyone for marketing purposes.
```

**Contact:**
```
Questions about this privacy policy? Want to know what data I have about you, or want it deleted? Just use the contact form on the homepage and I'll be happy to help.
```

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**
- Use `@/` path alias for imports (no imports needed for this story)
- Maintain proper heading hierarchy (H1 > H2 already established in 7.1)
- Use semantic HTML (already in place from 7.1)
- Use consistent text colors (`text-text-secondary` for body text)
- Do NOT add teal-600 for links (use teal-700 or default link styling)

### Architecture Compliance

From `architecture.md`:
- **Privacy & Legal (FR25-26):** Privacy policy page with data practices disclosure
- **Security (NFR14):** Contact form submissions auto-deleted after 90 days

### Previous Story Intelligence (Story 7.1)

**Key learnings:**
- Privacy page structure is already in place at `src/app/(frontend)/privacy/page.tsx`
- Page uses semantic HTML with `<article>`, `<header>`, `<main>`, `<section>` elements
- Typography follows site design: `text-text-primary` for headings, `text-text-secondary` for body
- Sections use `space-y-8` for vertical spacing
- Each section has `<h2>` with `text-2xl font-semibold text-text-primary`
- Body text uses `mt-4 text-text-secondary`
- "Last updated" date is set to March 11, 2026

**Existing section structure to preserve:**
```tsx
<section>
  <h2 className="text-text-primary text-2xl font-semibold">Section Title</h2>
  <p className="mt-4 text-text-secondary">
    Content here...
  </p>
</section>
```

**For bullet lists, use:**
```tsx
<ul className="mt-4 list-disc pl-5 space-y-2 text-text-secondary">
  <li>Item one</li>
  <li>Item two</li>
</ul>
```

### Git Intelligence

**Recent commit pattern from Story 7.1:**
- `feat(privacy): add privacy policy page and footer link`

**Suggested commit message for this story:**
```
feat(privacy): document data collection practices in privacy policy
```

### Risk Assessment

**Risk Level:** Low

**Rationale:**
- Content-only changes (no new functionality)
- No database interactions
- No external API calls
- Simple text updates to existing page
- No JavaScript changes required

**Potential Issues:**
- Ensure content accurately reflects actual implementation
- Verify "Last updated" date is current when deploying

### Testing Verification

**Local testing:**
1. Run `pnpm dev`
2. Navigate to `http://localhost:3000/privacy`
3. Verify all sections have content (no placeholder text remaining)
4. Verify content is readable and well-formatted
5. Test responsive design at mobile, tablet, desktop breakpoints
6. Run `pnpm lint` to check for errors

**Content accuracy checklist:**
- [x] 90-day retention matches `RETENTION_DAYS = 90`
- [x] Rate limiting description matches 5/IP/hour
- [x] Service providers (Vercel, Resend) are correctly listed
- [x] No mention of services not actually used

### Project Structure Notes

**File location:** `src/app/(frontend)/privacy/page.tsx`
- Uses `(frontend)` route group for public pages
- Inherits layout from `src/app/(frontend)/layout.tsx`
- No new files or routes needed

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-7-privacy-legal-compliance.md#Story 7.2]
- [Source: _bmad-output/planning-artifacts/prd.md#Privacy & Data Handling]
- [Source: _bmad-output/planning-artifacts/architecture.md#Security (NFR8-14)]
- [Source: _bmad-output/implementation-artifacts/7-1-create-privacy-policy-page.md]
- [Source: src/app/(frontend)/privacy/page.tsx - current page structure]
- [Source: src/app/api/contact/route.ts - contact form implementation]
- [Source: src/collections/ContactSubmissions.ts - data schema]
- [Source: src/app/api/cron/cleanup-contacts/route.ts - 90-day cleanup]
- [Source: src/lib/notifications.ts - notification services]
- [Source: vercel.json - cron schedule configuration]
- [Source: CLAUDE.md - dev standards]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None required - content-only changes with no debugging needed.

### Completion Notes List

- Replaced all placeholder content in the privacy policy page with actual data handling documentation
- Used plain language and first-person tone as specified in story requirements
- Added bullet lists with proper accessibility attributes (role="list", aria-label)
- Verified all statements match actual codebase implementations:
  - 90-day retention matches `RETENTION_DAYS = 90` in cleanup-contacts/route.ts
  - Rate limiting of 5/IP/hour matches `RATE_LIMIT_MAX = 5` in contact/route.ts
  - Service providers (Vercel, Resend) accurately reflect actual dependencies
- Build verified successful with `npx next build` - privacy page renders as static content
- All 6 acceptance criteria satisfied

### Change Log

- 2026-03-11: Documented data collection practices in privacy policy (Story 7.2)

### File List

- src/app/(frontend)/privacy/page.tsx (modified)
