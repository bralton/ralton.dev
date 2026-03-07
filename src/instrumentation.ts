import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

export function register() {
  if (!process.env.AXIOM_TOKEN || !process.env.AXIOM_DATASET) {
    console.log('[OTel] Skipping - AXIOM_TOKEN or AXIOM_DATASET not set')
    return
  }

  const exporter = new OTLPTraceExporter({
    url: 'https://api.axiom.co/v1/traces',
    headers: {
      Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
      'X-Axiom-Dataset': process.env.AXIOM_DATASET,
    },
  })

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'personal-website',
    }),
    traceExporter: exporter,
  })

  sdk.start()
}
