/**
 * Centralized Logger with OpenTelemetry Trace Correlation
 *
 * Uses Winston for structured logging with automatic batching to Axiom.
 * Falls back to console-only logging when Axiom is not configured.
 *
 * Features:
 * - Automatic trace context injection (trace_id, span_id)
 * - Batched log shipping to Axiom
 * - Console fallback for local development
 */

import winston from 'winston'
import { trace, context } from '@opentelemetry/api'

const axiomToken = process.env.AXIOM_TOKEN
const axiomDataset = process.env.AXIOM_DATASET

// Custom format to inject OpenTelemetry trace context
const traceContextFormat = winston.format((info) => {
  const span = trace.getSpan(context.active())
  if (span) {
    const spanContext = span.spanContext()
    info.trace_id = spanContext.traceId
    info.span_id = spanContext.spanId
    info.trace_flags = spanContext.traceFlags
  }
  return info
})

// Initialize Axiom transport if configured
async function initAxiomTransport(): Promise<winston.transport | null> {
  if (!axiomToken || !axiomDataset) {
    return null
  }

  try {
    const { WinstonTransport } = await import('@axiomhq/winston')
    return new WinstonTransport({
      dataset: axiomDataset,
      token: axiomToken,
    })
  } catch (error) {
    console.error('Failed to initialize Axiom transport:', error)
    return null
  }
}

// Create Winston logger instance
function createLogger(): winston.Logger {
  const transports: winston.transport[] = [
    // Always log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, trace_id, ...meta } = info
          const traceStr = typeof trace_id === 'string' ? trace_id.slice(0, 8) : ''
          const traceInfo = traceStr ? ` [trace:${traceStr}]` : ''
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
          return `${timestamp} ${level}${traceInfo}: ${message}${metaStr}`
        })
      ),
    }),
  ]

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      traceContextFormat(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: {
      service: 'personal-website',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    },
    transports,
  })
}

// Create the logger instance
const logger = createLogger()

// Initialize Axiom transport asynchronously
initAxiomTransport().then((transport) => {
  if (transport) {
    logger.add(transport)
    logger.info('Axiom logging transport initialized')
  }
})

/**
 * Flush all pending logs and close transports.
 * Call this during graceful shutdown.
 */
export async function flushLogs(): Promise<void> {
  return new Promise((resolve) => {
    logger.on('finish', resolve)
    logger.end()
  })
}

/**
 * Log helper functions with automatic trace context
 */
export const log = {
  info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta),
  error: (message: string, meta?: Record<string, unknown>) => logger.error(message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta),

  /**
   * Create a child logger with additional default metadata
   */
  child: (meta: Record<string, unknown>) => logger.child(meta),
}

// Export the raw Winston logger for advanced use cases
export { logger }

// Default export for convenience
export default log
