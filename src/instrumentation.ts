/**
 * Next.js Instrumentation
 *
 * This file is automatically executed once when the Next.js server starts.
 * It's the ideal place to initialize modules and set up global configurations.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize OpenTelemetry instrumentation
    try {
      await import('./instrumentation.node')
    } catch (error) {
      // Telemetry must not stop the application from serving requests.
      console.error('OpenTelemetry initialization failed:', error)
    }
  }
}
