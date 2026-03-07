/**
 * OpenTelemetry Node.js Instrumentation
 *
 * Configures distributed tracing with Axiom as the backend.
 * Falls back to noop processor if Axiom credentials are not configured.
 * This file is loaded only on the server runtime.
 */

import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { SimpleSpanProcessor, NoopSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { resourceFromAttributes } from '@opentelemetry/resources'

const axiomToken = process.env.AXIOM_TOKEN
const axiomDataset = process.env.AXIOM_DATASET
const axiomDomain = process.env.AXIOM_DOMAIN || 'api.axiom.co'

const useAxiom = axiomToken && axiomDataset

// Configure span processor - use SimpleSpanProcessor for serverless (sends immediately)
const spanProcessor = useAxiom
  ? new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: `https://${axiomDomain}/v1/traces`,
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          'X-Axiom-Dataset': axiomDataset,
        },
      })
    )
  : new NoopSpanProcessor()

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: 'personal-website',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]:
      process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  }),
  spanProcessor,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable fs instrumentation to reduce noise
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      // Configure HTTP instrumentation
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (request) => {
          // Ignore health check and static asset requests
          const url = request.url || ''
          return (
            url.includes('/_next/') ||
            url.includes('/favicon.ico') ||
            url === '/health' ||
            url === '/api/health'
          )
        },
      },
    }),
  ],
})

sdk.start()

// Graceful shutdown
process.on('SIGTERM', async () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) => console.error('Error shutting down OpenTelemetry SDK', error))
    .finally(() => process.exit(0))
})

if (useAxiom) {
  console.log('OpenTelemetry initialized with Axiom')
}
