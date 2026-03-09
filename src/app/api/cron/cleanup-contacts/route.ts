import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const RETENTION_DAYS = 90

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')

  // Allow unauthenticated requests in development for testing
  if (process.env.NODE_ENV !== 'development') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('[Cron/Cleanup] Unauthorized request attempted')
      return new Response('Unauthorized', { status: 401 })
    }
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
