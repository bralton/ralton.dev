import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import type { DatabaseAdapterObj } from 'payload'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || 'file:./payload.db'
const isLocalDev = databaseUrl.startsWith('file:')

// Dynamic import to avoid bundling SQLite native deps in production
const getDbAdapter = async (): Promise<DatabaseAdapterObj> => {
  if (isLocalDev) {
    const { sqliteAdapter } = await import('@payloadcms/db-sqlite')
    return sqliteAdapter({
      client: {
        url: databaseUrl,
      },
    })
  } else {
    const { vercelPostgresAdapter } = await import('@payloadcms/db-vercel-postgres')
    // Let adapter auto-detect Vercel's POSTGRES_* env vars
    return vercelPostgresAdapter({})
  }
}

const dbAdapter = await getDbAdapter()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: dbAdapter,
  sharp,
  plugins: [],
})
