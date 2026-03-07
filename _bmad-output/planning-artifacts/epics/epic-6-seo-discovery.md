---
epic: 6
title: 'SEO & Discovery'
status: backlog
storyCount: 5
stories: ['6.1', '6.2', '6.3', '6.4', '6.5']
frs: ['FR27', 'FR28', 'FR29', 'FR30', 'FR31']
nfrs: []
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 6: SEO & Discovery

Site is discoverable via search engines and social sharing. Site ranks well in search, social shares display rich previews.

## Story 6.1: Configure Meta Tags and Page Metadata

As a **search engine**,
I want **proper meta tags on each page**,
So that **the site can be indexed correctly** (FR27).

**Acceptance Criteria:**

**Given** Next.js metadata API
**When** I configure the root layout metadata
**Then** default title, description, and keywords are set
**And** the title follows the pattern "Ben [LastName] | Portfolio"

**Given** the homepage
**When** metadata is generated
**Then** the title accurately describes the page
**And** the description summarizes Ben's expertise (under 160 characters)
**And** keywords include relevant skills and job titles

**Given** the privacy policy page
**When** metadata is generated
**Then** the page has unique title and description
**And** metadata is appropriate for the page content

**Given** canonical URLs
**When** pages are rendered
**Then** canonical link tags are included
**And** URLs use the production domain

## Story 6.2: Configure Open Graph Tags for Social Sharing

As a **visitor sharing the site**,
I want **rich previews when sharing on social media**,
So that **shared links look professional** (FR28).

**Acceptance Criteria:**

**Given** Open Graph configuration
**When** I add OG tags to the metadata
**Then** og:title, og:description, og:image, og:url are set
**And** og:type is set to "website"

**Given** the OG image
**When** creating the default image
**Then** an image exists at `/public/og-image.png`
**And** the image dimensions are 1200x630 (recommended)
**And** the image includes Ben's name and headline visually

**Given** Twitter card configuration
**When** I add Twitter meta tags
**Then** twitter:card is set to "summary_large_image"
**And** twitter:title and twitter:description are set
**And** twitter:image references the OG image

**Given** a link is shared on LinkedIn or Twitter
**When** the platform fetches metadata
**Then** a rich preview displays with image, title, and description

## Story 6.3: Generate Sitemap

As a **search engine crawler**,
I want **a sitemap.xml file**,
So that **all pages can be discovered** (FR29).

**Acceptance Criteria:**

**Given** Next.js sitemap generation
**When** I configure the sitemap
**Then** a sitemap.xml is generated at build time
**And** the sitemap is accessible at `/sitemap.xml`

**Given** the sitemap contents
**When** generated
**Then** it includes the homepage URL
**And** it includes the privacy policy URL
**And** URLs use the production domain

**Given** sitemap format
**When** the file is generated
**Then** it follows the XML sitemap protocol
**And** each URL includes lastmod, changefreq, and priority (optional)

**Given** search engines
**When** they request `/sitemap.xml`
**Then** the file is served with correct content-type
**And** the sitemap is valid and parseable

## Story 6.4: Add Structured Data (Person Schema)

As a **search engine**,
I want **structured data about the portfolio owner**,
So that **rich results can be displayed** (FR30).

**Acceptance Criteria:**

**Given** JSON-LD structured data
**When** I add Person schema to the homepage
**Then** the schema includes: @type Person, name, jobTitle, url
**And** optional fields: image, sameAs (social links), description

**Given** the JSON-LD script
**When** rendered on the page
**Then** it's placed in the head or body as a script tag
**And** the JSON is valid and follows schema.org spec

**Given** sameAs property
**When** social links are configured
**Then** the sameAs array includes LinkedIn, GitHub URLs
**And** URLs match the SocialLinks collection data

**Given** search engines
**When** they crawl the page
**Then** they can parse the structured data
**And** rich results may display Ben's info in search

## Story 6.5: Configure robots.txt

As a **search engine crawler**,
I want **a robots.txt file**,
So that **I know what to crawl** (FR31).

**Acceptance Criteria:**

**Given** robots.txt configuration
**When** I create `/public/robots.txt`
**Then** the file allows all crawlers by default
**And** the sitemap URL is referenced

**Given** the robots.txt content
**When** configured
**Then** it includes `User-agent: *` and `Allow: /`
**And** it includes `Sitemap: https://[domain]/sitemap.xml`

**Given** admin panel protection
**When** configuring robots.txt
**Then** `/admin` paths may be disallowed (optional, security consideration)
**And** API routes are typically not crawled anyway

**Given** search engines
**When** they visit `/robots.txt`
**Then** the file is served correctly
**And** crawlers follow the directives

---
