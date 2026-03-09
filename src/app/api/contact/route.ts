import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactNotifications } from '@/lib/notifications'

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

    // Send notifications (non-blocking)
    sendContactNotifications({ name, email, message }).catch((error) => {
      console.error('[Contact] Failed to send notifications:', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Contact] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
