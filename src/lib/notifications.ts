import { sendContactEmail, type ContactEmailParams } from './email'
import { sendDiscordNotification, type DiscordNotificationParams } from './discord'

// Re-export for convenience - all notification params are identical
export type NotificationParams = ContactEmailParams & DiscordNotificationParams

export async function sendContactNotifications(params: NotificationParams): Promise<void> {
  // Send both notifications in parallel (non-blocking)
  const [emailResult, discordResult] = await Promise.allSettled([
    sendContactEmail(params),
    sendDiscordNotification(params),
  ])

  // Log results but don't throw - these are non-critical
  // Check both rejection AND resolved=false (functions return false on failure, don't throw)
  if (emailResult.status === 'rejected') {
    console.error('[Notifications] Email notification threw error:', emailResult.reason)
  } else if (emailResult.value === false) {
    console.warn(
      '[Notifications] Email notification returned failure (see [Email] logs for details)'
    )
  }

  if (discordResult.status === 'rejected') {
    console.error('[Notifications] Discord notification threw error:', discordResult.reason)
  } else if (discordResult.value === false) {
    console.warn(
      '[Notifications] Discord notification returned failure (see [Discord] logs for details)'
    )
  }
}
