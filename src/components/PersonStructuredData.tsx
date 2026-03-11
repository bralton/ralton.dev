import { getPayload } from 'payload'
import config from '@payload-config'

interface PersonSchema {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle?: string
  url: string
  description?: string
  image?: string
  sameAs?: string[]
}

/**
 * Helper to extract plain text from Lexical rich text structure.
 * Recursively traverses nodes to extract text content.
 */
function extractTextFromRichText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') {
    return ''
  }

  const root = (richText as { root?: unknown }).root
  if (!root || typeof root !== 'object') {
    return ''
  }

  const children = (root as { children?: unknown[] }).children
  if (!Array.isArray(children)) {
    return ''
  }

  const extractText = (nodes: unknown[]): string => {
    return nodes
      .map((node) => {
        if (!node || typeof node !== 'object') return ''

        const typedNode = node as { type?: string; text?: string; children?: unknown[] }

        // Text node
        if (typedNode.type === 'text' && typeof typedNode.text === 'string') {
          return typedNode.text
        }

        // Paragraph or other container with children
        if (Array.isArray(typedNode.children)) {
          return extractText(typedNode.children)
        }

        return ''
      })
      .join(' ')
  }

  return extractText(children).replace(/\s+/g, ' ').trim()
}

export async function PersonStructuredData() {
  try {
    const payload = await getPayload({ config })
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

    // Fetch Hero for name and headline
    const heroData = await payload.findGlobal({ slug: 'hero' })

    // Fetch About for description
    const aboutData = await payload.findGlobal({ slug: 'about' })

    // Fetch visible social links for sameAs (exclude email)
    const socialLinks = await payload.find({
      collection: 'social-links',
      where: {
        isVisible: { equals: true },
      },
      sort: 'order',
      limit: 10,
    })

    // Build sameAs array from social links (exclude email - not a social profile URL)
    const sameAs = socialLinks.docs
      .filter((link) => link.platform !== 'email')
      .map((link) => link.url)

    // Build Person schema with required fields
    const personSchema: PersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: heroData?.name || 'Ben Ralton',
      url: siteUrl,
    }

    // Add optional fields if available
    if (heroData?.headline) {
      personSchema.jobTitle = heroData.headline
    }

    if (aboutData?.bio) {
      // Extract plain text from rich text and limit to 160 chars for description
      const bioText = extractTextFromRichText(aboutData.bio)
      if (bioText) {
        personSchema.description = bioText.substring(0, 160)
      }
    }

    if (sameAs.length > 0) {
      personSchema.sameAs = sameAs
    }

    // Add image if og-image exists
    personSchema.image = `${siteUrl}/og-image.png`

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
    )
  } catch (error) {
    console.error('[PersonStructuredData] Failed to generate structured data:', error)
    return null
  }
}
