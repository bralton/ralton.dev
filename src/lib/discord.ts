// Maximum length for message field in Discord embed
const DISCORD_MESSAGE_MAX_LENGTH = 500

export interface DiscordNotificationParams {
  name: string
  email: string
  message: string
}

/**
 * Sanitize user input for Discord to prevent markdown injection and mention abuse.
 * Escapes Discord markdown special characters and prevents @everyone/@here mentions.
 */
function sanitizeForDiscord(input: string): string {
  return (
    input
      // Escape markdown characters
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/\|/g, '\\|')
      // Escape mentions (@everyone, @here, <@user>, <@&role>)
      .replace(/@(everyone|here)/gi, '@\u200B$1')
      .replace(/<@/g, '<\u200B@')
  )
}

export async function sendDiscordNotification({
  name,
  email,
  message,
}: DiscordNotificationParams): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[Discord] DISCORD_WEBHOOK_URL not configured')
    return false
  }

  // Sanitize and truncate message for Discord
  const sanitizedMessage = sanitizeForDiscord(message)
  const truncatedMessage =
    sanitizedMessage.length > DISCORD_MESSAGE_MAX_LENGTH
      ? sanitizedMessage.substring(0, DISCORD_MESSAGE_MAX_LENGTH - 3) + '...'
      : sanitizedMessage

  // Sanitize name and email fields, provide fallback for empty values
  const safeName = sanitizeForDiscord(name) || '(not provided)'
  const safeEmail = sanitizeForDiscord(email) || '(not provided)'
  const safeMessage = truncatedMessage || '(empty message)'

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
              { name: 'Name', value: safeName, inline: true },
              { name: 'Email', value: safeEmail, inline: true },
              { name: 'Message', value: safeMessage },
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
