# Epic 5 Design Document: Contact & Communication

**Date:** 2026-03-09
**Epic:** 5 - Contact & Communication
**Status:** Design Complete
**Purpose:** Enable autonomous story execution by front-loading all technical decisions

---

## Executive Summary

This document provides all technical specifications needed to implement Epic 5 autonomously. It covers:
- Contact form with React Hook Form + Zod validation
- ContactSubmissions Payload collection with server-side validation
- Rate limiting (5 submissions per IP per hour)
- Email notifications via Resend API (admin only for MVP)
- Discord webhook for instant alerts
- Auto-delete mechanism for 90-day data retention
- Social links collection and display

**With this document, Epic 5 stories can execute autonomously like Epics 2, 3, and 4.**

---

## 1. Contact Form Design

### 1.1 Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| name | text | Min 2 chars, max 100 chars | Yes |
| email | email | Valid email format | Yes |
| message | textarea | Min 10 chars, max 2000 chars | Yes |

### 1.2 Libraries

**React Hook Form + Zod:**
```bash
pnpm add react-hook-form zod @hookform/resolvers
```

### 1.3 Zod Schema

**File:** `src/lib/validations/contact.ts`

```typescript
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

### 1.4 Contact Form Component

**File:** `src/components/ContactForm.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      toast({
        title: 'Message sent!',
        description: 'Thanks for reaching out. I\'ll get back to you soon.',
      })
      reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <Textarea
          id="message"
          rows={5}
          {...register('message')}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
```

### 1.5 Accessibility Requirements

- All form fields have associated `<label>` elements
- Error messages use `role="alert"` for screen reader announcement
- `aria-invalid` indicates field validation state
- `aria-describedby` links fields to error messages
- Form is fully keyboard navigable
- Focus states visible on all interactive elements

---

## 2. Contact API Endpoint

### 2.1 Payload Collection

**File:** `src/collections/ContactSubmissions.ts`

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

### 2.2 API Route Handler

**File:** `src/app/api/contact/route.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactNotifications } from '@/lib/notifications'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // Max 5 submissions per IP per hour

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

    // Check rate limit
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)

    const recentSubmissions = await payload.find({
      collection: 'contact-submissions',
      where: {
        ip: { equals: ip },
        submittedAt: { greater_than: oneHourAgo.toISOString() },
      },
      limit: RATE_LIMIT_MAX + 1,
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

    // Send notifications (non-blocking)
    sendContactNotifications({ name, email, message }).catch((error) => {
      console.error('[Contact] Failed to send notifications:', error)
    })

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

---

## 3. Notification System

### 3.1 Resend Email Integration

**Install Resend SDK:**
```bash
pnpm add resend
```

**File:** `src/lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailParams {
  name: string
  email: string
  message: string
}

export async function sendContactEmail({ name, email, message }: ContactEmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error('[Email] RESEND_API_KEY not configured')
    return false
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'ben@ralton.dev'

  try {
    const { error } = await resend.emails.send({
      from: 'Contact Form <noreply@ralton.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
        <hr />
        <p><em>Reply directly to this email to respond to ${name}.</em></p>
      `,
      text: `
New Contact Form Submission

From: ${name} (${email})

Message:
${message}

---
Reply directly to this email to respond to ${name}.
      `,
    })

    if (error) {
      console.error('[Email] Resend error:', error)
      return false
    }

    console.log('[Email] Contact notification sent successfully')
    return true
  } catch (error) {
    console.error('[Email] Failed to send email:', error)
    return false
  }
}
```

### 3.2 Discord Webhook Integration

**File:** `src/lib/discord.ts`

```typescript
interface DiscordNotificationParams {
  name: string
  email: string
  message: string
}

export async function sendDiscordNotification({ name, email, message }: DiscordNotificationParams): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[Discord] DISCORD_WEBHOOK_URL not configured')
    return false
  }

  // Truncate message for Discord (max 2000 chars for content)
  const truncatedMessage = message.length > 500
    ? message.substring(0, 497) + '...'
    : message

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: 'New Contact Form Submission',
            color: 0x0d9488, // teal-600
            fields: [
              { name: 'Name', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Message', value: truncatedMessage },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error('[Discord] Webhook failed:', response.status, response.statusText)
      return false
    }

    console.log('[Discord] Contact notification sent successfully')
    return true
  } catch (error) {
    console.error('[Discord] Failed to send notification:', error)
    return false
  }
}
```

### 3.3 Unified Notification Function

**File:** `src/lib/notifications.ts`

```typescript
import { sendContactEmail } from './email'
import { sendDiscordNotification } from './discord'

interface NotificationParams {
  name: string
  email: string
  message: string
}

export async function sendContactNotifications(params: NotificationParams): Promise<void> {
  // Send both notifications in parallel (non-blocking)
  const [emailResult, discordResult] = await Promise.allSettled([
    sendContactEmail(params),
    sendDiscordNotification(params),
  ])

  // Log results but don't throw - these are non-critical
  if (emailResult.status === 'rejected') {
    console.error('[Notifications] Email notification failed:', emailResult.reason)
  }

  if (discordResult.status === 'rejected') {
    console.error('[Notifications] Discord notification failed:', discordResult.reason)
  }
}
```

---

## 4. Rate Limiting

### 4.1 Implementation Details

**Strategy:** IP-based rate limiting using ContactSubmissions collection

**Limits:**
- 5 submissions per IP address per hour
- Check performed before storing new submission
- 429 status returned when limit exceeded

**Why Database-Based (Not In-Memory):**
- Works across Vercel serverless functions
- No additional infrastructure needed
- Rate limit data persists across deployments
- Automatically cleaned up by auto-delete mechanism

### 4.2 Rate Limit Query

```typescript
const recentSubmissions = await payload.find({
  collection: 'contact-submissions',
  where: {
    ip: { equals: ip },
    submittedAt: { greater_than: oneHourAgo.toISOString() },
  },
  limit: RATE_LIMIT_MAX + 1, // Only need to know if >= 5
})
```

---

## 5. Auto-Delete Mechanism

### 5.1 Design Decision

**Approach:** Vercel Cron Job (daily cleanup)

**Rationale:**
- Consistent with Epic 4's cron pattern
- Runs independently of user traffic
- Easy to monitor via logs
- Single point of configuration

### 5.2 Cron Configuration

**Update:** `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/github",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/cleanup-contacts",
      "schedule": "0 3 * * *"
    }
  ]
}
```

**Schedule:** `0 3 * * *` = Every day at 3:00 AM UTC (1 hour after GitHub cron)

### 5.3 Cleanup Route Handler

**File:** `src/app/api/cron/cleanup-contacts/route.ts`

```typescript
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const RETENTION_DAYS = 90

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Cron/Cleanup] Unauthorized request attempted')
    return new Response('Unauthorized', { status: 401 })
  }

  console.log('[Cron/Cleanup] Starting contact submissions cleanup')

  try {
    const payload = await getPayload({ config })

    // Calculate cutoff date (90 days ago)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS)

    // Find old submissions
    const oldSubmissions = await payload.find({
      collection: 'contact-submissions',
      where: {
        submittedAt: { less_than: cutoffDate.toISOString() },
      },
      limit: 1000, // Process in batches if needed
    })

    if (oldSubmissions.docs.length === 0) {
      console.log('[Cron/Cleanup] No old submissions to delete')
      return Response.json({
        success: true,
        message: 'No old submissions to delete',
        deleted: 0,
      })
    }

    // Delete old submissions
    let deletedCount = 0
    for (const submission of oldSubmissions.docs) {
      await payload.delete({
        collection: 'contact-submissions',
        id: submission.id,
      })
      deletedCount++
    }

    console.log(`[Cron/Cleanup] Deleted ${deletedCount} old submissions`)

    return Response.json({
      success: true,
      message: `Deleted ${deletedCount} submissions older than ${RETENTION_DAYS} days`,
      deleted: deletedCount,
    })
  } catch (error) {
    console.error('[Cron/Cleanup] Unexpected error:', error)
    return Response.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
```

---

## 6. Social Links Collection

### 6.1 Payload Collection

**File:** `src/collections/SocialLinks.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  admin: {
    useAsTitle: 'platform',
    description: 'Social media profile links',
    defaultColumns: ['platform', 'url', 'isVisible'],
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'GitHub', value: 'github' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Email', value: 'email' },
      ],
      admin: {
        description: 'Social media platform',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to profile (or mailto: for email)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this link on the site',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers first)',
      },
    },
  ],
}
```

### 6.2 Social Links Component

**File:** `src/components/SocialLinks.tsx`

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  email: EmailIcon,
}

const platformLabels: Record<string, string> = {
  github: 'GitHub profile',
  linkedin: 'LinkedIn profile',
  twitter: 'Twitter profile',
  email: 'Send email',
}

export async function SocialLinks() {
  const payload = await getPayload({ config })

  const socialLinks = await payload.find({
    collection: 'social-links',
    where: {
      isVisible: { equals: true },
    },
    sort: 'order',
  })

  if (socialLinks.docs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Social media links">
      <ul className="flex items-center gap-4" role="list">
        {socialLinks.docs.map((link) => {
          const Icon = platformIcons[link.platform] || DefaultIcon
          const label = platformLabels[link.platform] || link.platform

          return (
            <li key={link.id}>
              <a
                href={link.url}
                target={link.platform === 'email' ? undefined : '_blank'}
                rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
                className="flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background transition-colors"
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Icon components
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function DefaultIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
```

---

## 7. Environment Variables

### 7.1 New Variables Required

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key for email notifications |
| `DISCORD_WEBHOOK_URL` | Yes | Discord webhook URL for instant alerts |
| `ADMIN_EMAIL` | No | Email to receive notifications (defaults to ben@ralton.dev) |

### 7.2 Update .env Files

**File:** `.env.local`
```bash
# Contact & Communication (Epic 5)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx
ADMIN_EMAIL=ben@ralton.dev
```

**File:** `.env.example`
```bash
# Contact & Communication (Epic 5)
RESEND_API_KEY=
DISCORD_WEBHOOK_URL=
ADMIN_EMAIL=
```

### 7.3 Vercel Environment Variables

Already configured by Ben:
- `RESEND_API_KEY` (Production + Preview)
- `DISCORD_WEBHOOK_URL` (Production + Preview)

---

## 8. Error Handling Patterns

### 8.1 API Response Codes

| Status | Meaning | Response Body |
|--------|---------|---------------|
| 200 | Success | `{ success: true }` |
| 400 | Validation Error | `{ error: "message", details: {...} }` |
| 429 | Rate Limited | `{ error: "Too many requests..." }` |
| 500 | Server Error | `{ error: "An unexpected error occurred" }` |

### 8.2 Notification Failures

**Pattern:** Non-blocking, log errors

```typescript
// Notifications are sent in parallel, failures are logged but don't fail the request
sendContactNotifications(params).catch((error) => {
  console.error('[Contact] Failed to send notifications:', error)
})

// User still sees success - their submission was saved
return NextResponse.json({ success: true })
```

### 8.3 Console Logging Prefixes

| Prefix | Component |
|--------|-----------|
| `[Contact]` | Contact API route |
| `[Email]` | Resend email integration |
| `[Discord]` | Discord webhook integration |
| `[Notifications]` | Unified notification system |
| `[Cron/Cleanup]` | Auto-delete cron job |

---

## 9. Testing Strategy

### 9.1 Local Development Testing

**Test Contact Form:**
```bash
# Run dev server
pnpm dev

# Submit form via UI or curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello world test message"}'
```

**Test Rate Limiting:**
```bash
# Submit 6 times rapidly to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Rate limit test '$i'"}'
  echo ""
done
```

**Test Cleanup Cron (skip auth in dev):**
```bash
curl http://localhost:3000/api/cron/cleanup-contacts
```

### 9.2 Manual Verification Checklist

**Story 5.1 (Contact Form):**
- [ ] Form renders with all fields
- [ ] Validation errors show inline on blur
- [ ] Submit button shows loading state
- [ ] Success toast appears after submission
- [ ] Form clears after success
- [ ] Error toast appears on failure
- [ ] Form is keyboard navigable
- [ ] Screen reader announces errors

**Story 5.2 (API + Storage):**
- [ ] Submissions stored in database
- [ ] IP address recorded
- [ ] submittedAt timestamp correct
- [ ] Invalid data returns 400
- [ ] Server errors return 500

**Story 5.3 (Rate Limiting):**
- [ ] First 5 submissions succeed
- [ ] 6th submission returns 429
- [ ] After 1 hour, submissions work again

**Story 5.4 (Notifications):**
- [ ] Email received with correct content
- [ ] Discord message posted with embed
- [ ] Submission succeeds even if notifications fail

**Story 5.5 (Auto-Delete):**
- [ ] Cron endpoint rejects unauthorized requests
- [ ] Old submissions (90+ days) deleted
- [ ] Recent submissions preserved
- [ ] Deletion count logged

**Story 5.6 (Social Links):**
- [ ] Links render in correct order
- [ ] Only visible links shown
- [ ] Links open in new tab (except email)
- [ ] Focus states visible
- [ ] Touch targets >= 44x44px

---

## 10. File Summary

### New Files to Create

| File | Story | Purpose |
|------|-------|---------|
| `src/lib/validations/contact.ts` | 5.1 | Zod schema for form validation |
| `src/components/ContactForm.tsx` | 5.1 | Contact form component |
| `src/collections/ContactSubmissions.ts` | 5.2 | Payload collection for submissions |
| `src/app/api/contact/route.ts` | 5.2, 5.3 | Contact form API endpoint |
| `src/lib/email.ts` | 5.4 | Resend email helper |
| `src/lib/discord.ts` | 5.4 | Discord webhook helper |
| `src/lib/notifications.ts` | 5.4 | Unified notification system |
| `src/app/api/cron/cleanup-contacts/route.ts` | 5.5 | Auto-delete cron job |
| `src/collections/SocialLinks.ts` | 5.6 | Payload collection for social links |
| `src/components/SocialLinks.tsx` | 5.6 | Social links component |

### Files to Modify

| File | Story | Change |
|------|-------|--------|
| `src/payload.config.ts` | 5.2, 5.6 | Add ContactSubmissions and SocialLinks |
| `src/app/(frontend)/page.tsx` | 5.1, 5.6 | Add ContactForm and SocialLinks |
| `vercel.json` | 5.5 | Add cleanup cron schedule |
| `.env.local` | 5.4 | Add RESEND_API_KEY, DISCORD_WEBHOOK_URL |
| `.env.example` | 5.4 | Document new env vars |

### Dependencies to Install

```bash
pnpm add react-hook-form zod @hookform/resolvers resend
```

---

## 11. Implementation Sequence

### Recommended Story Order

1. **Story 5.1: Create Contact Form with Validation**
   - Install dependencies (react-hook-form, zod)
   - Create validation schema
   - Create ContactForm component
   - Add to homepage

2. **Story 5.2: Create Contact API Endpoint with Storage**
   - Create ContactSubmissions collection
   - Create /api/contact route
   - Add server-side validation

3. **Story 5.3: Implement Rate Limiting**
   - Add rate limit logic to /api/contact
   - Test rate limiting behavior

4. **Story 5.4: Integrate Notifications**
   - Install Resend SDK
   - Create email helper
   - Create Discord webhook helper
   - Create unified notification system
   - Integrate with contact API

5. **Story 5.5: Implement Auto-Delete**
   - Create cleanup cron route
   - Add to vercel.json
   - Test cleanup behavior

6. **Story 5.6: Create Social Links Display**
   - Create SocialLinks collection
   - Create SocialLinks component
   - Add to footer/contact section

---

## 12. References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Resend Documentation](https://resend.com/docs)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)

---

*Design document completed 2026-03-09*
