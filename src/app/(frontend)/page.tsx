import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="flex flex-1 flex-col items-center justify-center">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && (
          <h1 className="my-10 text-center text-4xl font-bold md:text-6xl">
            Welcome to your new project.
          </h1>
        )}
        {user && (
          <h1 className="my-10 text-center text-4xl font-bold md:text-6xl">
            Welcome back, {user.email}
          </h1>
        )}
        <div className="flex items-center gap-3">
          <a
            className="rounded bg-foreground px-3 py-1 text-background no-underline hover:opacity-80"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="rounded border border-foreground px-3 py-1 no-underline hover:opacity-80"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="m-0">Update this page by editing</p>
        <a className="rounded bg-muted px-2 no-underline" href={fileURL}>
          <code className="font-mono">app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
