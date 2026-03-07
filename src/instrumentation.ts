export async function register() {
  console.log('[OTel] register() called, NEXT_RUNTIME:', process.env.NEXT_RUNTIME)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[OTel] Loading instrumentation.node.ts...')
    await import('./instrumentation.node')
  }
}
