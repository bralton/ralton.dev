import { Resend } from 'resend'

// Lazy initialization to avoid creating client with undefined API key
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

/**
 * Escape HTML entities to prevent XSS in email HTML content
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export interface ContactEmailParams {
  name: string
  email: string
  message: string
}

export async function sendContactEmail({
  name,
  email,
  message,
}: ContactEmailParams): Promise<boolean> {
  const resend = getResendClient()

  if (!resend) {
    console.error('[Email] RESEND_API_KEY not configured')
    return false
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'devops@ralton.dev'

  // Escape user input for HTML to prevent XSS
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)

  try {
    const { error } = await resend.emails.send({
      from: 'Contact Form <noreply@ralton.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br />')}</p>
        <hr />
        <p><em>Reply directly to this email to respond to ${safeName}.</em></p>
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
