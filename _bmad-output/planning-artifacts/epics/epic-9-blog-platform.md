---
documentType: epic
epicNumber: 9
epicTitle: Blog Platform
storyCount: 7
frsConvered: [FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54]
nfrsAddressed: [NFR29, NFR30, NFR31, NFR32]
date: 2026-03-11
status: ready
---

# Epic 9: Blog Platform

Visitors can discover and read Ben's technical articles, tutorials, and thought leadership content. Blog posts feature code syntax highlighting, category/tag organization, and RSS subscription. Ben can create, edit, and publish posts with a draft/preview workflow through the existing Payload CMS admin.

**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54

**NFRs addressed:** NFR29, NFR30, NFR31, NFR32

**Implementation Notes:**

- 3 new Payload collections: Posts, Categories, Tags
- Payload Lexical for rich text content with code blocks
- Shiki for build-time syntax highlighting (zero client JS)
- Reading time calculated via Payload hook at save time
- RSS feed via `/api/rss` endpoint
- Blog routes: `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`
- Pagination (10 posts per page)
- Draft/published workflow via status field

---

## Story 9.1: Create Blog Collections (Posts, Categories, Tags)

As a **site admin**,
I want **Payload CMS collections for blog posts, categories, and tags**,
So that **I can create and manage blog content through the admin panel**.

**Acceptance Criteria:**

**Given** I am logged into the Payload admin panel
**When** I navigate to the Collections menu
**Then** I see Posts, Categories, and Tags collections available
**And** each collection has appropriate fields configured

**Given** I am creating a new blog post
**When** I fill in the post form
**Then** I can set: title, slug, content (rich text), excerpt, featured image, status (draft/published), categories, and tags
**And** reading time is automatically calculated when I save

**Given** I am managing categories
**When** I create/edit a category
**Then** I can set name, slug, and description

**Given** I am managing tags
**When** I create/edit a tag
**Then** I can set name and slug

**Given** I set a post status to "draft"
**When** I save the post
**Then** the post is not visible on the public blog listing

---

## Story 9.2: Create Blog Listing Page

As a **visitor**,
I want **a blog listing page showing published posts**,
So that **I can browse and discover Ben's articles**.

**Acceptance Criteria:**

**Given** I navigate to `/blog`
**When** the page loads
**Then** I see a list of published blog posts (drafts are hidden)
**And** each post card shows title, excerpt, published date, reading time, and categories
**And** the page loads within 1.5 seconds (LCP)

**Given** there are more than 10 published posts
**When** I view the blog listing
**Then** I see pagination controls
**And** I can navigate between pages via `/blog?page=2`

**Given** there are no published posts
**When** I visit `/blog`
**Then** I see a friendly empty state message

---

## Story 9.3: Create Blog Post Page with Syntax Highlighting

As a **visitor**,
I want **to read individual blog posts with properly highlighted code**,
So that **I can learn from Ben's technical content with readable code examples**.

**Acceptance Criteria:**

**Given** I click on a blog post from the listing
**When** the post page loads at `/blog/[slug]`
**Then** I see the full post content with title, published date, reading time, categories, and tags
**And** the page achieves Lighthouse Performance Score above 90

**Given** the post contains code blocks
**When** the page renders
**Then** code blocks display with Shiki syntax highlighting
**And** highlighting does not cause layout shift (CLS < 0.1)
**And** code blocks are rendered at build time (no client-side JS for highlighting)

**Given** I view a post with a featured image
**When** the page loads
**Then** the featured image displays appropriately

**Given** I navigate to a non-existent post slug
**When** the page loads
**Then** I see a 404 page

---

## Story 9.4: Create Category and Tag Filtering

As a **visitor**,
I want **to filter blog posts by category or tag**,
So that **I can find content on specific topics**.

**Acceptance Criteria:**

**Given** I click on a category link
**When** I navigate to `/blog/category/[slug]`
**Then** I see only posts assigned to that category
**And** the page title indicates the active category filter

**Given** I click on a tag link
**When** I navigate to `/blog/tag/[slug]`
**Then** I see only posts assigned to that tag
**And** the page title indicates the active tag filter

**Given** no posts match the selected category or tag
**When** the filter page loads
**Then** I see a friendly empty state message

**Given** I am on a filtered view
**When** I want to see all posts
**Then** I can navigate back to `/blog` to clear the filter

---

## Story 9.5: Add Blog Post SEO and Open Graph

As a **content creator**,
I want **each blog post to have proper SEO metadata**,
So that **posts are discoverable via search engines and display rich previews when shared**.

**Acceptance Criteria:**

**Given** a blog post exists
**When** search engines or social platforms fetch the page
**Then** the page includes meta title (post title + site name)
**And** meta description (post excerpt or auto-generated)
**And** Open Graph tags (og:title, og:description, og:image, og:type=article)
**And** Twitter card tags

**Given** a post has a featured image
**When** the page is shared on social media
**Then** the featured image appears in the preview

**Given** a post does not have a featured image
**When** the page is shared
**Then** a default OG image is used

**Given** blog posts exist
**When** the sitemap is generated
**Then** all published blog posts are included in sitemap.xml

---

## Story 9.6: Create RSS Feed

As a **visitor**,
I want **an RSS feed of blog posts**,
So that **I can subscribe and receive updates in my RSS reader**.

**Acceptance Criteria:**

**Given** I navigate to `/api/rss`
**When** the request is processed
**Then** I receive a valid RSS 2.0 XML feed
**And** the response includes proper `Content-Type: application/rss+xml` header
**And** the feed generates within 3 seconds

**Given** published posts exist
**When** the RSS feed is generated
**Then** each post includes title, description (excerpt), pubDate, link, and author
**And** posts are ordered by published date (newest first)

**Given** I am on the blog listing or post pages
**When** I look for the RSS link
**Then** I can find a link to subscribe via RSS

---

## Story 9.7: Configure Blog Draft Preview

As a **site admin**,
I want **to preview draft blog posts before publishing**,
So that **I can review content appearance without making it public**.

**Acceptance Criteria:**

**Given** I am editing a draft post in Payload admin
**When** I click the preview button
**Then** I am taken to a preview URL showing the draft post as it will appear when published

**Given** I am not logged in as admin
**When** I try to access a draft post URL directly
**Then** I see a 404 page (draft is not publicly accessible)

**Given** I have previewed a draft
**When** I make changes and preview again
**Then** I see the updated content in the preview
