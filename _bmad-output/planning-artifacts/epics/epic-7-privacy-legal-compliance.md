---
epic: 7
title: 'Privacy & Legal Compliance'
status: backlog
storyCount: 2
stories: ['7.1', '7.2']
frs: ['FR25', 'FR26']
nfrs: []
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 7: Privacy & Legal Compliance

Site meets legal requirements for data collection disclosure. Visitors can understand how their data is handled.

## Story 7.1: Create Privacy Policy Page

As a **visitor**,
I want **to view a privacy policy page**,
So that **I understand how my data is handled** (FR25).

**Acceptance Criteria:**

**Given** the privacy policy route
**When** I create `/app/(frontend)/privacy/page.tsx`
**Then** the page is accessible at `/privacy`
**And** the page uses the same layout as other pages

**Given** the page content
**When** the privacy policy renders
**Then** it displays a clear heading "Privacy Policy"
**And** it includes the last updated date
**And** the content is readable and well-formatted

**Given** navigation
**When** a visitor wants to access the privacy policy
**Then** a link exists in the footer
**And** the link is accessible from any page

**Given** responsive design
**When** viewed on any device
**Then** the content is readable
**And** proper typography is used (consistent with site design)

**Given** accessibility
**When** the page renders
**Then** proper heading hierarchy is used
**And** the page is keyboard navigable
**And** content is accessible to screen readers

## Story 7.2: Document Data Collection Practices

As a **visitor**,
I want **the privacy policy to explain data handling**,
So that **I can make informed decisions about submitting my information** (FR26).

**Acceptance Criteria:**

**Given** data collection section
**When** the privacy policy explains what data is collected
**Then** it lists: name, email, message (from contact form)
**And** it mentions IP address collection for rate limiting

**Given** data usage section
**When** the privacy policy explains how data is used
**Then** it states data is used to respond to inquiries
**And** it clarifies IP is used for spam prevention only

**Given** data retention section
**When** the privacy policy explains retention
**Then** it states contact submissions are deleted after 90 days
**And** it matches the actual retention policy (FR15, NFR14)

**Given** data sharing section
**When** the privacy policy explains sharing
**Then** it states no data is shared with third parties
**And** it may mention service providers (Vercel, Resend) if applicable

**Given** contact information
**When** visitors have questions
**Then** the policy includes how to contact Ben about privacy concerns

**Given** the content
**When** reviewing for accuracy
**Then** all statements match actual data handling practices
**And** the policy is written in plain language (not legalese)
