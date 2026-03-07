---
epic: 5
title: 'Contact & Communication'
status: backlog
storyCount: 6
stories: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6']
frs: ['FR11', 'FR12', 'FR13', 'FR14', 'FR15']
nfrs: ['NFR11', 'NFR14', 'NFR24', 'NFR25']
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 5: Contact & Communication

Visitors can reach out to Ben easily. Contact form submissions are stored, Ben receives email notifications, and visitors see social links.

## Story 5.1: Create Contact Form with Validation

As a **visitor**,
I want **to submit a contact form with my name, email, and message**,
So that **I can reach out to Ben about opportunities** (FR11).

**Acceptance Criteria:**

**Given** the Contact section exists
**When** I create the ContactForm component
**Then** it displays fields for name, email, and message
**And** all fields are required
**And** the form uses shadcn Input and Textarea components

**Given** the form has validation
**When** a visitor blurs a field without filling it
**Then** an inline error message appears
**And** errors are styled in red below the field

**Given** email validation
**When** a visitor enters an invalid email format
**Then** an error message indicates the email is invalid
**And** the form cannot be submitted until corrected

**Given** the form is submitted
**When** validation passes
**Then** the form data is sent to POST `/api/contact`
**And** the submit button shows a loading spinner
**And** the button is disabled during submission

**Given** successful submission
**When** the API returns success
**Then** a success toast notification appears (NFR24 - within 3 seconds)
**And** the form fields are cleared
**And** the visitor sees confirmation their message was sent

**Given** submission error
**When** the API returns an error
**Then** an error toast notification appears
**And** the form data is preserved for retry

**Given** accessibility requirements
**When** the form renders
**Then** all fields have associated labels
**And** error messages are announced to screen readers
**And** the form is keyboard navigable (FR32)

## Story 5.2: Create Contact API Endpoint with Storage

As a **system**,
I want **to store contact form submissions in the CMS**,
So that **Ben has a backup record of all inquiries** (FR13).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the ContactSubmissions collection
**Then** it has fields: name, email, message, ip, submittedAt
**And** the collection is not exposed publicly (admin only)

**Given** the `/api/contact` route exists
**When** a valid form submission is received
**Then** the data is validated server-side
**And** the submission is stored in ContactSubmissions
**And** the IP address is recorded for rate limiting
**And** submittedAt timestamp is set automatically

**Given** server-side validation
**When** invalid data is received
**Then** a 400 error response is returned with `{ error: "message" }`
**And** the submission is not stored

**Given** successful storage
**When** the submission is saved
**Then** a 200 response is returned with `{ success: true }`

**Given** a server error occurs
**When** storage fails
**Then** a 500 error response is returned
**And** the error is logged to Axiom
**And** no sensitive data is exposed to the client (NFR12)

## Story 5.3: Implement Rate Limiting for Contact Form

As a **system**,
I want **to rate limit contact form submissions**,
So that **spam and abuse are prevented** (NFR11).

**Acceptance Criteria:**

**Given** rate limiting is configured
**When** a submission is received at `/api/contact`
**Then** the system checks ContactSubmissions for recent submissions from the same IP

**Given** the rate limit threshold (5 submissions per IP per hour)
**When** a visitor has submitted fewer than 5 times in the past hour
**Then** the submission is accepted and processed normally

**Given** the rate limit is exceeded
**When** a visitor has submitted 5 or more times in the past hour
**Then** a 429 error response is returned with `{ error: "Too many requests" }`
**And** the submission is not stored
**And** the visitor sees an appropriate error message

**Given** rate limit checking
**When** querying ContactSubmissions
**Then** the query filters by IP and submittedAt > (now - 1 hour)
**And** the query is efficient and doesn't slow down responses

## Story 5.4: Integrate Email Notifications with Resend

As **Ben (admin)**,
I want **to receive email notifications when someone submits the contact form**,
So that **I can respond to inquiries promptly** (FR14).

**Acceptance Criteria:**

**Given** Resend is configured
**When** I set up the email integration
**Then** RESEND_API_KEY environment variable is used
**And** a helper function exists in `/lib/email.ts`

**Given** a contact form is submitted successfully
**When** the submission is stored
**Then** an email notification is sent to Ben's configured email
**And** the email includes: sender name, sender email, message content
**And** the email has a clear subject line (e.g., "New Contact Form Submission")

**Given** email delivery requirements (NFR25)
**When** the notification is sent
**Then** delivery occurs within 60 seconds of form submission
**And** the API response doesn't wait for email delivery (async)

**Given** email sending fails
**When** Resend returns an error
**Then** the error is logged to Axiom
**And** the contact submission is still saved (email failure doesn't block storage)
**And** the visitor still sees success (they submitted successfully)

## Story 5.5: Implement Auto-Delete for Contact Submissions

As a **system**,
I want **to auto-delete contact submissions after 90 days**,
So that **data retention requirements are met** (FR15, NFR14).

**Acceptance Criteria:**

**Given** the data retention requirement
**When** I implement the auto-delete mechanism
**Then** submissions older than 90 days are deleted

**Given** implementation options
**When** choosing the deletion approach
**Then** either a Vercel cron job runs daily to clean up old submissions
**Or** a Payload hook/lifecycle method handles cleanup
**And** the chosen approach is reliable and automated

**Given** the cleanup job runs
**When** checking ContactSubmissions
**Then** entries with submittedAt > 90 days ago are identified
**And** those entries are deleted from the database
**And** deletion is logged for audit purposes

**Given** deletion occurs
**When** old submissions are removed
**Then** the deletion doesn't affect recent submissions
**And** the system continues to function normally

## Story 5.6: Create Social Links Display

As a **visitor**,
I want **to see social links to Ben's LinkedIn and GitHub profiles**,
So that **I can connect with him on other platforms** (FR12).

**Acceptance Criteria:**

**Given** the Payload CMS is configured
**When** I create the SocialLinks collection
**Then** it has fields: platform (e.g., "LinkedIn", "GitHub"), url, icon (optional), isVisible
**And** entries can be managed via admin

**Given** SocialLinks entries exist
**When** the footer or contact section renders
**Then** social links display as icon buttons
**And** each link shows the appropriate platform icon
**And** only isVisible=true links are displayed

**Given** a visitor clicks a social link
**When** the link is activated
**Then** the platform opens in a new tab
**And** links have `rel="noopener noreferrer"`
**And** links have accessible labels (e.g., "Visit LinkedIn profile")

**Given** responsive design
**When** social links render on any device
**Then** icons are appropriately sized (minimum 44x44px touch target)
**And** spacing is consistent

**Given** accessibility requirements
**When** social links render
**Then** they are keyboard focusable
**And** focus indicators are visible
**And** screen readers announce the link purpose

---
