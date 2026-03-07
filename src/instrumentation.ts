import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

export function register() {
  const token = process.env.AXIOM_TOKEN
  const dataset = process.env.AXIOM_DATASET

  if (!token || !dataset) {
    return
  }

  const traceExporter = new OTLPTraceExporter({
    url: 'https://api.axiom.co/v1/traces',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Axiom-Dataset': dataset,
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
