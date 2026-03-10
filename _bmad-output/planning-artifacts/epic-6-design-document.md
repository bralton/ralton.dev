# Epic 6 Design Document: SEO & Discovery

**Date:** 2026-03-10
**Epic:** 6 - SEO & Discovery
**Status:** Ready for Implementation

---

## Overview

Epic 6 implements SEO and social sharing features to make the site discoverable via search engines and professional when shared on social platforms.

**Stories:**
- 6.1: Configure Meta Tags and Page Metadata
- 6.2: Configure Open Graph Tags for Social Sharing
- 6.3: Generate Sitemap
- 6.4: Add Structured Data (Person Schema)
- 6.5: Configure robots.txt

**Dependencies:**
- OG Image: `public/og-image.png` (1200x630) - READY
- Privacy page metadata deferred to Epic 7 (Story 7.1)

---

## Section 1: Meta Tags and Page Metadata (Story 6.1)

### 1.1 Next.js Metadata API

Next.js App Router uses the `metadata` export for SEO configuration.

**Current State (`src/app/(frontend)/layout.tsx`):**
```typescript
export const metadata = {
  description: "Ben's personal portfolio website",
  title: 'B.Ralton',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}
```

### 1.2 Enhanced Metadata Configuration

**Replace with comprehensive metadata in `src/app/(frontend)/layout.tsx`:**

```typescript
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ben Ralton | Development & Operations',
    template: '%s | Ben Ralton',
  },
  description:
    'Personal portfolio of Ben Ralton - Development & Operations professional specializing in full-stack web development, DevOps, and cloud infrastructure.',
  keywords: [
    'Ben Ralton',
    'Software Developer',
    'DevOps',
    'Full Stack Developer',
    'Web Development',
    'Cloud Infrastructure',
    'Next.js',
    'TypeScript',
    'React',
  ],
  authors: [{ name: 'Ben Ralton', url: siteUrl }],
  creator: 'Ben Ralton',
  publisher: 'Ben Ralton',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  // Open Graph - see Section 2
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ben Ralton',
    title: 'Ben Ralton | Development & Operations',
    description:
      'Personal portfolio of Ben Ralton - Development & Operations professional specializing in full-stack web development, DevOps, and cloud infrastructure.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ben Ralton - Development & Operations',
      },
    ],
  },
  // Twitter Card - see Section 2
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Ralton | Development & Operations',
    description:
      'Personal portfolio of Ben Ralton - Development & Operations professional.',
    images: ['/og-image.png'],
  },
}
```

### 1.3 Environment Variable

**Add to `.env.example` and `.env.local`:**
```bash
# Site URL (for canonical URLs and OG tags)
NEXT_PUBLIC_SITE_URL=https://ralton.dev
```

### 1.4 Privacy Page Metadata (Deferred to Epic 7)

When Story 7.1 creates the privacy page, it should include:

```typescript
// src/app/(frontend)/privacy/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Ben Ralton\'s portfolio website. Learn how your data is collected, used, and protected.',
}
```

---

## Section 2: Open Graph Tags (Story 6.2)

### 2.1 OG Image

**File:** `public/og-image.png`
**Dimensions:** 1200x630 pixels
**Status:** READY (resized from Card_D.png)

### 2.2 Open Graph Configuration

Already included in Section 1.2 metadata. Key properties:

```typescript
openGraph: {
  type: 'website',
  locale: 'en_US',
  url: siteUrl,
  siteName: 'Ben Ralton',
  title: 'Ben Ralton | Development & Operations',
  description: '...',
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Ben Ralton - Development & Operations',
    },
  ],
},
```

### 2.3 Twitter Card Configuration

Already included in Section 1.2 metadata:

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Ben Ralton | Development & Operations',
  description: '...',
  images: ['/og-image.png'],
},
```

### 2.4 Testing Social Previews

**Validation Tools:**
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

---

## Section 3: Sitemap Generation (Story 6.3)

### 3.1 Next.js Built-in Sitemap

Create `src/app/sitemap.ts` using Next.js App Router's built-in sitemap generation:

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Privacy page will be added in Epic 7
    // {
    //   url: `${siteUrl}/privacy`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.3,
    // },
  ]
}
```

### 3.2 Sitemap Output

The sitemap will be automatically available at `/sitemap.xml`.

**Expected Output:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ralton.dev</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
```

---

## Section 4: Structured Data - Person Schema (Story 6.4)

### 4.1 JSON-LD Implementation

Create a reusable component for structured data:

**File: `src/components/JsonLd.tsx`**
```typescript
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### 4.2 Person Schema Data

**File: `src/lib/structured-data.ts`**
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPersonSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

  // Fetch social links from Payload CMS
  const payload = await getPayload({ config })
  const socialLinks = await payload.find({
    collection: 'social-links',
    where: {
      isVisible: { equals: true },
    },
  })

  // Build sameAs array from social links
  const sameAs = socialLinks.docs
    .filter((link) => link.platform !== 'email')
    .map((link) => link.url)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ben Ralton',
    url: siteUrl,
    jobTitle: 'Development & Operations Professional',
    description:
      'Full-stack web developer and DevOps professional specializing in modern web technologies and cloud infrastructure.',
    sameAs,
    image: `${siteUrl}/og-image.png`,
  }
}
```

### 4.3 Integration in Homepage

**Update `src/app/(frontend)/page.tsx`:**
```typescript
import { JsonLd } from '@/components/JsonLd'
import { getPersonSchema } from '@/lib/structured-data'

export default async function HomePage() {
  const personSchema = await getPersonSchema()

  return (
    <>
      <JsonLd data={personSchema} />
      {/* ... existing page content ... */}
    </>
  )
}
```

### 4.4 Expected JSON-LD Output

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ben Ralton",
  "url": "https://ralton.dev",
  "jobTitle": "Development & Operations Professional",
  "description": "Full-stack web developer and DevOps professional...",
  "sameAs": [
    "https://github.com/bralton",
    "https://linkedin.com/in/benralton"
  ],
  "image": "https://ralton.dev/og-image.png"
}
```

### 4.5 Testing Structured Data

**Validation Tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

## Section 5: robots.txt (Story 6.5)

### 5.1 Static robots.txt

**File: `public/robots.txt`**
```
# robots.txt for ralton.dev

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://ralton.dev/sitemap.xml

# Disallow admin panel (optional security measure)
Disallow: /admin
Disallow: /api/
```

### 5.2 Alternative: Dynamic robots.txt

If dynamic generation is preferred, create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ralton.dev'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

**Recommendation:** Use the static `public/robots.txt` for simplicity.

---

## Section 6: File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Sitemap generation |
| `src/components/JsonLd.tsx` | JSON-LD script component |
| `src/lib/structured-data.ts` | Person schema generator |
| `public/robots.txt` | Crawler directives |

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/(frontend)/layout.tsx` | Enhanced metadata with OG/Twitter |
| `src/app/(frontend)/page.tsx` | Add JsonLd component |
| `.env.example` | Add NEXT_PUBLIC_SITE_URL |
| `.env.local` | Add NEXT_PUBLIC_SITE_URL |

### Files Already Ready

| File | Status |
|------|--------|
| `public/og-image.png` | READY (1200x630) |

---

## Section 7: Testing Checklist

### Story 6.1 - Meta Tags
- [ ] Title displays correctly in browser tab
- [ ] Description appears in page source
- [ ] Keywords present in meta tags
- [ ] Canonical URL resolves correctly

### Story 6.2 - Open Graph
- [ ] OG image displays in LinkedIn preview
- [ ] OG image displays in Twitter preview
- [ ] Title and description appear in social shares
- [ ] Image dimensions correct (1200x630)

### Story 6.3 - Sitemap
- [ ] `/sitemap.xml` accessible
- [ ] XML format valid
- [ ] Homepage URL included
- [ ] Production domain used in URLs

### Story 6.4 - Structured Data
- [ ] JSON-LD present in page source
- [ ] Google Rich Results Test passes
- [ ] Social links populated in sameAs
- [ ] Schema.org validation passes

### Story 6.5 - robots.txt
- [ ] `/robots.txt` accessible
- [ ] Sitemap URL correct
- [ ] Admin/API paths disallowed
- [ ] Crawlers allowed on public pages

---

## Section 8: Implementation Order

**Recommended sequence:**

1. **Story 6.5** - robots.txt (simplest, no dependencies)
2. **Story 6.1** - Meta tags (foundation for OG)
3. **Story 6.2** - Open Graph tags (builds on 6.1)
4. **Story 6.3** - Sitemap (independent)
5. **Story 6.4** - Structured data (requires social links fetch)

---

## Section 9: Environment Variables

### Required
```bash
NEXT_PUBLIC_SITE_URL=https://ralton.dev
```

### Existing (no changes needed)
```bash
DATABASE_URL=...
PAYLOAD_SECRET=...
# etc.
```

---

## Section 10: Console Logging Prefixes

| Prefix | Component |
|--------|-----------|
| `[SEO]` | SEO-related operations |
| `[Schema]` | Structured data generation |

---

## Section 11: Risk Assessment

**Risk Level:** Low

**Rationale:**
- All patterns use Next.js built-in features
- No external service dependencies
- Static files + metadata exports
- Well-documented APIs

**Potential Issues:**
- Social preview caching (platforms cache OG images - may need cache bust)
- Domain configuration must match `NEXT_PUBLIC_SITE_URL`

---

*Design document created 2026-03-10*
