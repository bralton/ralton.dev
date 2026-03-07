import { trace } from '@opentelemetry/api'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const tracer = trace.getTracer('test-otel')

  return tracer.startActiveSpan('test-otel-span', async (span) => {
    try {
      span.setAttribute('test.attribute', 'hello-from-vercel')
      console.log('[test-otel] Creating test span...')

      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log('[test-otel] Span created, returning response')

      return NextResponse.json({
        success: true,
        message: 'OTel test span created',
        timestamp: new Date().toISOString(),
      })
    } finally {
      span.end()
      console.log('[test-otel] Span ended')
    }
  })
}
