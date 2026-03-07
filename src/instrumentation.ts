import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

export function register() {
  if (!process.env.AXIOM_TOKEN || !process.env.AXIOM_DATASET) {
    return
  }

  const traceExporter = new OTLPTraceExporter({
    url: 'https://api.axiom.co/v1/traces',
    headers: {
      Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
      'X-Axiom-Dataset': process.env.AXIOM_DATASET,
    },
  })

  const sdk = new NodeSDK({
    spanProcessor: new BatchSpanProcessor(traceExporter),
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'personal-website',
    }),
  })

  sdk.start()
}
