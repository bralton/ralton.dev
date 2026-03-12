# Story 9.4: Create Category and Tag Filtering

Status: review

## Story

As a **visitor**,
I want **to filter blog posts by category or tag**,
So that **I can find content on specific topics**.

## Acceptance Criteria

1. **AC1: Category filter page displays filtered posts**
   - Given I click on a category link
   - When I navigate to `/blog/category/[slug]`
   - Then I see only posts assigned to that category
   - And the page title indicates the active category filter

2. **AC2: Tag filter page displays filtered posts**
   - Given I click on a tag link
   - When I navigate to `/blog/tag/[slug]`
   - Then I see only posts assigned to that tag
   - And the page title indicates the active tag filter

3. **AC3: Empty state for no matching posts**
   - Given no posts match the selected category or tag
   - When the filter page loads
   - Then I see a friendly empty state message

4. **AC4: Clear filter navigation**
   - Given I am on a filtered view
   - When I want to see all posts
   - Then I can navigate back to `/blog` to clear the filter

## Tasks / Subtasks

- [x] Task 1: Create category filter page route (AC: #1, #3, #4)
  - [x] 1.1 Create `/src/app/(frontend)/blog/category/[slug]/page.tsx`
  - [x] 1.2 Implement `generateStaticParams` for all categories
  - [x] 1.3 Fetch category by slug, return `notFound()` if category doesn't exist
  - [x] 1.4 Query posts where category relationship includes the category ID
  - [x] 1.5 Display category name in page heading (e.g., "Posts in: DevOps")
  - [x] 1.6 Implement pagination with `/blog/category/[slug]?page=N` pattern
  - [x] 1.7 Display friendly empty state when no posts match (reuse pattern from blog listing)
  - [x] 1.8 Add "View all posts" link to clear filter

- [x] Task 2: Create tag filter page route (AC: #2, #3, #4)
  - [x] 2.1 Create `/src/app/(frontend)/blog/tag/[slug]/page.tsx`
  - [x] 2.2 Implement `generateStaticParams` for all tags
  - [x] 2.3 Fetch tag by slug, return `notFound()` if tag doesn't exist
  - [x] 2.4 Query posts where tags relationship includes the tag ID
  - [x] 2.5 Display tag name in page heading (e.g., "Posts tagged: #kubernetes")
  - [x] 2.6 Implement pagination with `/blog/tag/[slug]?page=N` pattern
  - [x] 2.7 Display friendly empty state when no posts match
  - [x] 2.8 Add "View all posts" link to clear filter

- [x] Task 3: Add SEO metadata (AC: #1, #2)
  - [x] 3.1 Implement `generateMetadata` for category pages with dynamic title/description
  - [x] 3.2 Implement `generateMetadata` for tag pages with dynamic title/description
  - [x] 3.3 Set canonical URLs: `/blog/category/[slug]` and `/blog/tag/[slug]`
  - [x] 3.4 Add OpenGraph metadata for social sharing

- [x] Task 4: Update blog revalidation hooks (AC: #1, #2)
  - [x] 4.1 Update `revalidateBlogAfterChange` in `payloadHooks.ts` to revalidate category pages
  - [x] 4.2 Update `revalidateBlogAfterDelete` to revalidate category pages
  - [x] 4.3 Add revalidation for tag pages when posts change

## Dev Notes

### URL Structure (per architecture.md)

```
app/(frontend)/blog/
├── page.tsx                  # Blog listing (Story 9.2) DONE
├── [slug]/
│   └── page.tsx              # Individual post (Story 9.3) DONE
├── category/
│   └── [slug]/
│       └── page.tsx          # Posts by category (THIS STORY)
└── tag/
    └── [slug]/
        └── page.tsx          # Posts by tag (THIS STORY)
```

### Payload Query Pattern for Relationship Filtering

To filter posts by category or tag relationship, use Payload's `in` operator with the ID:

```typescript
// Category filtering
const category = await payload.findGlobal({
  slug: 'categories',
  where: { slug: { equals: categorySlug } },
})

const posts = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
    categories: { contains: category.id },
  },
  sort: '-publishedAt',
  limit: POSTS_PER_PAGE,
  page: currentPage,
  depth: 1,
})
```

**Note:** Use `contains` operator for hasMany relationships (categories, tags). Payload's relationship queries work with IDs.

### Categories Collection Fields (from Categories.ts)

- `name` (text, required) - Display name
- `slug` (text, required, unique) - URL identifier
- `description` (textarea, optional) - Category description

### Tags Collection Fields (from Tags.ts)

- `name` (text, required) - Display name
- `slug` (text, required, unique) - URL identifier

### Reusing Existing Components

The filter pages should reuse the same components as the main blog listing:

- `BlogPostCard` - Already handles category display, image optimization
- `Pagination` - Already supports custom `basePath` prop
- `Navigation` / `Footer` - Standard layout components

### Empty State Pattern (from blog/page.tsx)

```tsx
<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
  <FileText className="mb-4 h-16 w-16 text-zinc-600" aria-hidden="true" />
  <h2 className="mb-2 text-xl font-semibold text-foreground">No Posts Found</h2>
  <p className="mb-4 max-w-md text-text-secondary">
    No posts have been published in this {category/tag} yet.
  </p>
  <Link
    href="/blog"
    className="rounded-md bg-teal-700 px-4 py-2 text-white transition-colors hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
  >
    View All Posts
  </Link>
</div>
```

### SEO Metadata Pattern

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  // Fetch category/tag...

  return {
    title: `${category.name} | Blog`,
    description: category.description || `Articles about ${category.name}`,
    openGraph: {
      type: 'website',
      title: `${category.name} | Blog | Ben Ralton`,
      // ...
    },
    alternates: {
      canonical: `/blog/category/${slug}`,
    },
  }
}
```

### Revalidation Hook Updates

The `payloadHooks.ts` file already calls `revalidatePath('/blog')`. Add revalidation for category and tag pages:

```typescript
// In revalidateBlogAfterChange
revalidatePath('/blog/category/[slug]', 'page')
revalidatePath('/blog/tag/[slug]', 'page')
```

### Performance Requirements

- **LCP < 1.5s** (NFR29) - Use same patterns as blog listing
- **Static generation** via `generateStaticParams` for all categories/tags
- **Pagination** at 10 posts per page (consistent with blog listing)

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**

1. **Accessibility (WCAG 2.1 AA)**:
   - Use `teal-700` for primary accent, `teal-800` for hover
   - Focus states: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`
   - Semantic HTML: `<h1>` for page heading, `<ul role="list">` for post list
   - Use `aria-label` on navigation elements and lists

2. **Component Naming**: PascalCase for components

3. **Imports**: Use `@/` path alias for all imports from `src/`

4. **Page Title Format**:
   - Category: "Posts in: {Category Name}"
   - Tag: "Posts tagged: #{Tag Name}"

5. **No emojis in source code**

### Project Structure Notes

**Alignment with Unified Project Structure:**
- Both filter pages follow identical structure to `blog/page.tsx`
- Reuse existing `BlogPostCard` and `Pagination` components
- No new components needed (reduces code duplication)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-blog-platform.md#Story 9.4]
- [Source: _bmad-output/planning-artifacts/prd.md#FR41] - Visitors can filter blog posts by category
- [Source: _bmad-output/planning-artifacts/prd.md#FR42] - Visitors can filter blog posts by tag
- [Source: _bmad-output/planning-artifacts/architecture.md#Blog URL Structure] - `/blog/category/[slug]`, `/blog/tag/[slug]` routes
- [Source: _bmad-output/planning-artifacts/architecture.md#Blog Performance] - LCP < 1.5s, static generation
- [Source: CLAUDE.md#Accessibility] - teal-700/teal-800 color patterns, focus states

### Previous Story Intelligence (Story 9.3)

From Story 9.3 implementation:

1. **Data Fetching Pattern:**
   ```typescript
   import { getPayload } from 'payload'
   import config from '@payload-config'

   const payload = await getPayload({ config })
   ```

2. **generateStaticParams Pattern:**
   ```typescript
   export async function generateStaticParams(): Promise<{ slug: string }[]> {
     const payload = await getPayload({ config })
     const categories = await payload.find({
       collection: 'categories',
       limit: 1000,
       select: { slug: true },
     })
     return categories.docs.map((cat) => ({ slug: cat.slug }))
   }
   ```

3. **Navigation/Layout Pattern:**
   - Import `Navigation` and `Footer` components
   - Use `<main id="main-content" className="pt-24">` for skip-link target

4. **Category/Tag Type Guards:**
   ```typescript
   const categories = post.categories?.filter(
     (cat): cat is Category => typeof cat !== 'number' && cat !== null
   ) || []
   ```

5. **Revalidation Already Configured:**
   - `revalidateBlogAfterChange` and `revalidateBlogAfterDelete` hooks in `src/lib/payloadHooks.ts`
   - Needs update to include category/tag filter pages

### Git Intelligence (Recent Commits)

Recent commits show Story 9.2 and 9.3 patterns:

- `4593fb4` feat(blog): add blog post page with Shiki syntax highlighting
- `20f81c5` feat(blog): add blog listing page with pagination
- `e379b12` feat(blog): add Posts, Categories, and Tags collections

**Key Patterns from Recent Work:**
- Consistent commit message format: `feat(blog): ...`
- Page files named `page.tsx` in appropriate route directories
- Components reused across pages (BlogPostCard, Pagination)
- Static params generation for SSG

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation completed successfully without debugging issues.

### Completion Notes List

1. **Category Filter Page**: Created `/blog/category/[slug]/page.tsx` with full functionality:
   - Static generation via `generateStaticParams` for all categories
   - Dynamic filtering of posts by category relationship using `contains` operator
   - Pagination support with query parameter pattern
   - Empty state for categories with no posts
   - "View all posts" link back to `/blog`
   - SEO metadata with OpenGraph and Twitter cards

2. **Tag Filter Page**: Created `/blog/tag/[slug]/page.tsx` with full functionality:
   - Static generation via `generateStaticParams` for all tags
   - Dynamic filtering of posts by tag relationship using `contains` operator
   - Pagination support with query parameter pattern
   - Empty state for tags with no posts
   - "View all posts" link back to `/blog`
   - SEO metadata with OpenGraph and Twitter cards

3. **Revalidation Updates**: Updated `src/lib/revalidate.ts` to include category and tag page revalidation when blog content changes

4. **Sitemap Updates**: Updated `src/app/sitemap.ts` to dynamically include all category and tag filter pages

5. **Bug Fix**: Fixed pre-existing TypeScript error in `src/lib/shiki.ts` where 'text' was not a valid BundledLanguage (changed fallback to 'bash')

### File List

New files:
- src/app/(frontend)/blog/category/[slug]/page.tsx
- src/app/(frontend)/blog/tag/[slug]/page.tsx

Modified files:
- src/lib/revalidate.ts (added category/tag page revalidation)
- src/app/sitemap.ts (added dynamic category/tag pages to sitemap)
- src/lib/shiki.ts (fixed TypeScript error - changed 'text' fallback to 'bash')

### Change Log

- 2026-03-11: Implemented Story 9.4 - Category and Tag Filtering
  - Created category filter page at `/blog/category/[slug]`
  - Created tag filter page at `/blog/tag/[slug]`
  - Added SEO metadata (title, description, OpenGraph, Twitter, canonical URLs)
  - Updated revalidation hooks for category/tag pages
  - Updated sitemap to include all category and tag pages dynamically
  - Fixed shiki.ts TypeScript error (pre-existing issue)

---

## Post-Implementation Review Notes

**Review Date:** 2026-03-12

**Gaps Caught in Review:**

The following testing gaps were identified during post-sprint review and were NOT implemented as part of the original story:

1. **E2E Tests Missing** - No Playwright E2E tests were created for category/tag filtering. Tests should verify:
   - Category page shows filtered posts
   - Tag page shows filtered posts
   - "View all posts" link works
   - 404 returned for non-existent category/tag slugs

2. **Lighthouse CI Not Updated** - The Lighthouse configuration was not updated to include `/blog/category/[slug]` pages.

**Remediation:** These gaps have been addressed in a follow-up commit adding:
- `e2e/blog-filtering.spec.ts` - E2E tests for category and tag filtering
- Updated `lighthouserc.json` with category page URL
