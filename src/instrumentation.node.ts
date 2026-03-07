import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { BatchSpanProcessor, NoopSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { resourceFromAttributes } from '@opentelemetry/resources'

const axiomToken = process.env.AXIOM_TOKEN
const axiomDataset = process.env.AXIOM_DATASET

const useAxiom = axiomToken && axiomDataset

const spanProcessor = useAxiom
  ? new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: 'https://api.axiom.co/v1/traces',
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
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (request) => {
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

if (useAxiom) {
  console.log('✓ OpenTelemetry initialized with Axiom')
}
