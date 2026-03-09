import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Hero } from './collections/Hero'
import { About } from './collections/About'
import { GitHubData } from './collections/GitHubData'
import { Experiences } from './collections/Experiences'
import { Education } from './collections/Education'
import { Projects } from './collections/Projects'
import { Skills } from './collections/Skills'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { SocialLinks } from './collections/SocialLinks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * SECURITY: PAYLOAD_SECRET is required for session encryption.
 * This secret should ONLY be defined in .env/.env.local (server-side).
 * NEVER import this file in client components (NFR12).
 */
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}

export default buildConfig({
  /**
   * Admin Panel Configuration
   *
   * SECURITY NOTES:
   * - Admin panel accessible at /admin (not publicly linked from main site)
   * - Uses built-in Payload authentication (NFR9)
   * - Session cookies are HTTP-only (Payload default)
   * - CSRF protection is enabled by default
   * - HTTPS enforced by Vercel deployment (NFR8)
   */
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Experiences, Education, Projects, Skills, ContactSubmissions, SocialLinks],
  globals: [Hero, About, GitHubData],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [],
})
