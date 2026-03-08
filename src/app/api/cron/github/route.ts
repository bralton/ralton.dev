import type { NextRequest } from 'next/server'
import { updateGitHubData } from '@/lib/github'

// GitHub username - configurable via environment variable
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'bralton'

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')

  // Allow unauthenticated requests in development for testing
  if (process.env.NODE_ENV !== 'development') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('[Cron/GitHub] Unauthorized request attempted')
      return new Response('Unauthorized', { status: 401 })
    }
  }

  console.log('[Cron/GitHub] Starting daily GitHub data refresh')

  try {
    const success = await updateGitHubData(GITHUB_USERNAME)

    if (success) {
      console.log('[Cron/GitHub] Successfully refreshed GitHub data')
      return Response.json({
        success: true,
        message: 'GitHub data refreshed',
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error('[Cron/GitHub] Failed to refresh GitHub data')
      return Response.json(
        {
          success: false,
          message: 'Failed to refresh GitHub data',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[Cron/GitHub] Unexpected error:', error)
    return Response.json(
      {
        success: false,
        message: 'Unexpected error during refresh',
      },
      { status: 500 }
    )
  }
}
