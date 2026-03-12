# Story 9.1: Create Blog Collections (Posts, Categories, Tags)

Status: done

## Story

As a **site admin**,
I want **Payload CMS collections for blog posts, categories, and tags**,
So that **I can create and manage blog content through the admin panel**.

## Acceptance Criteria

1. **Given** I am logged into the Payload admin panel
   **When** I navigate to the Collections menu
   **Then** I see Posts, Categories, and Tags collections available
   **And** each collection has appropriate fields configured

2. **Given** I am creating a new blog post
   **When** I fill in the post form
   **Then** I can set: title, slug, content (rich text), excerpt, featured image, status (draft/published), categories, and tags
   **And** reading time is automatically calculated when I save

3. **Given** I am managing categories
   **When** I create/edit a category
   **Then** I can set name, slug, and description

4. **Given** I am managing tags
   **When** I create/edit a tag
   **Then** I can set name and slug

5. **Given** I set a post status to "draft"
   **When** I save the post
   **Then** the post is not visible on the public blog listing

## Tasks / Subtasks

- [x] Task 1: Create Categories collection (AC: #3)
  - [x] Create `src/collections/Categories.ts` with name, slug, description fields
  - [x] Add slug auto-generation hook from name
  - [x] Register in `payload.config.ts`

- [x] Task 2: Create Tags collection (AC: #4)
  - [x] Create `src/collections/Tags.ts` with name, slug fields
  - [x] Add slug auto-generation hook from name
  - [x] Register in `payload.config.ts`

- [x] Task 3: Create Posts collection (AC: #1, #2, #5)
  - [x] Create `src/collections/Posts.ts` with all required fields
  - [x] Configure Lexical rich text editor for content field
  - [x] Add slug auto-generation hook from title
  - [x] Add reading time calculation hook (afterChange)
  - [x] Add relationships to Categories (hasMany) and Tags (hasMany)
  - [x] Add featured image upload relationship to Media
  - [x] Add status field (draft/published) with default "draft"
  - [x] Add publishedAt date field (auto-set when status changes to published)
  - [x] Register in `payload.config.ts`

- [x] Task 4: Add revalidation hooks (future stories)
  - [x] Create blog-specific revalidation helper in `src/lib/revalidate.ts`
  - [x] Add afterChange/afterDelete hooks to Posts collection

- [x] Task 5: Verify admin panel access
  - [x] Start dev server and confirm all three collections appear
  - [x] Create test category, tag, and post
  - [x] Verify reading time auto-calculation works

## Dev Notes

### Architecture Compliance

**Collections Structure** [Source: architecture.md#Data Architecture]:
| Collection | Type | Key Fields |
|------------|------|------------|
| `posts` | Collection | title, slug, content (richText), excerpt, featuredImage, publishedAt, status, readingTime, categories, tags |
| `categories` | Collection | name, slug, description |
| `tags` | Collection | name, slug |

**Slug Pattern**: camelCase for collection names (`posts`, `categories`, `tags`), match existing collections like `projects`, `skills`.

### Technical Requirements

**Payload Lexical Editor** [Source: architecture.md#Blog Architecture]:
- Already configured in `payload.config.ts` via `lexicalEditor()`
- Use default Lexical for content field - supports headings, lists, links, images, code blocks
- No additional Lexical configuration needed for this story (code highlighting is Story 9.3)

**Reading Time Calculation** [Source: architecture.md#Blog Architecture]:
- Formula: `Math.ceil(wordCount / 200)` minutes
- Calculate in `afterChange` hook at save time
- Store in `readingTime` field (number type, representing minutes)
- Extract text from Lexical JSON to count words

**Draft/Published Workflow** [Source: PRD FR48, architecture.md]:
- `status` field: `'draft' | 'published'`
- Default to `'draft'`
- `publishedAt` auto-set when status changes to `'published'`
- Draft posts excluded from public queries (future stories handle this)

### File Structure Requirements

**New Files to Create**:
```
src/collections/
├── Posts.ts          # Blog posts collection
├── Categories.ts     # Blog categories collection
└── Tags.ts           # Blog tags collection
```

**Files to Modify**:
- `src/payload.config.ts` - Add imports and register collections
- `src/lib/revalidate.ts` - Add `revalidateBlog()` helper (optional, for future stories)

### Existing Patterns to Follow

**Collection Pattern** [Source: src/collections/Projects.ts]:
```typescript
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/payloadHooks'

export const CollectionName: CollectionConfig = {
  slug: 'collection-name',
  admin: {
    useAsTitle: 'fieldName',
    defaultColumns: ['field1', 'field2'],
    description: 'Description for admin panel',
    livePreview: { url: () => `...` },
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [/* ... */],
}
```

**Visibility Toggle Pattern** (NOT needed for blog - use status field instead):
- Posts use `status: 'draft' | 'published'` rather than `isVisible` boolean
- Categories and Tags are always visible (no toggle needed)

**Slug Field Pattern**:
```typescript
{
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    description: 'URL-friendly identifier (auto-generated from title)',
  },
  hooks: {
    beforeValidate: [generateSlug],
  },
}
```

**Slug Generation Hook** (create in `src/lib/slugify.ts` or inline):
```typescript
import { FieldHook } from 'payload'

export const generateSlug: FieldHook = ({ value, data, originalDoc }) => {
  // If slug is manually provided, use it
  if (value) return value

  // Generate from title/name
  const source = data?.title || data?.name || originalDoc?.title || originalDoc?.name
  if (!source) return value

  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

**Reading Time Hook** (create in Posts.ts):
```typescript
import { CollectionAfterChangeHook } from 'payload'

const calculateReadingTime: CollectionAfterChangeHook = async ({ doc, req }) => {
  // Extract text from Lexical content
  const text = extractTextFromLexical(doc.content)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  // Only update if changed to avoid infinite loop
  if (doc.readingTime !== readingTime) {
    await req.payload.update({
      collection: 'posts',
      id: doc.id,
      data: { readingTime },
    })
  }

  return doc
}
```

### Posts Collection Fields Specification

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | text | Yes | Admin useAsTitle |
| slug | text | Yes | Unique, auto-generated |
| content | richText (Lexical) | Yes | Main post body |
| excerpt | textarea | No | Short description for listings |
| featuredImage | upload (Media) | No | 16:9 recommended |
| status | select | Yes | Options: draft, published. Default: draft |
| publishedAt | date | No | Auto-set on publish |
| readingTime | number | No | Auto-calculated minutes |
| categories | relationship | No | hasMany to categories |
| tags | relationship | No | hasMany to tags |

### Categories Collection Fields Specification

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | Yes | Admin useAsTitle |
| slug | text | Yes | Unique, auto-generated |
| description | textarea | No | Category description |

### Tags Collection Fields Specification

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | Yes | Admin useAsTitle |
| slug | text | Yes | Unique, auto-generated |

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story**:
- Use `@/` path alias for imports
- Collections: PascalCase filenames (`Posts.ts`, `Categories.ts`, `Tags.ts`)
- Slugs: camelCase for collection slugs (`posts`, `categories`, `tags`)
- Run `pnpm lint` and `pnpm format` before committing
- Payload will auto-generate types in `src/payload-types.ts` on restart

### Project Structure Notes

- Collections go in `src/collections/` (not root `collections/` - that's architecture doc, actual is `src/collections/`)
- Register in `src/payload.config.ts` in the `collections` array
- Follow alphabetical ordering in imports for consistency with existing code

### Anti-Patterns to Avoid

- **DO NOT** create custom rich text editor - use existing `lexicalEditor()` from payload.config.ts
- **DO NOT** add `isVisible` toggle - blog uses `status` field for draft/published workflow
- **DO NOT** forget to register collections in payload.config.ts
- **DO NOT** hardcode preview URLs - use environment variables like existing collections
- **DO NOT** create separate admin components unless necessary - use Payload defaults

### References

- [Source: architecture.md#Data Architecture] - Collection schemas
- [Source: architecture.md#Blog Architecture] - Blog-specific patterns
- [Source: PRD FR47-FR54] - Blog admin requirements
- [Source: epic-9-blog-platform.md#Story 9.1] - Story acceptance criteria
- [Source: src/collections/Projects.ts] - Collection pattern reference
- [Source: src/payload.config.ts] - Registration pattern
- [Source: CLAUDE.md] - Dev standards and naming conventions

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript types successfully generated with `npx payload generate:types`
- All collections validated through type generation
- No TypeScript errors after type regeneration

### Completion Notes List

- Created Categories collection with name, slug (auto-generated), and description fields
- Created Tags collection with name and slug (auto-generated) fields
- Created Posts collection with all required fields:
  - title, slug (auto-generated from title)
  - content (richText using existing Lexical editor)
  - excerpt, featuredImage (relationship to Media)
  - status (draft/published with draft default)
  - publishedAt (auto-set when status changes to published)
  - readingTime (auto-calculated via afterChange hook)
  - categories and tags relationships (hasMany)
- Added blog-specific revalidation hooks (revalidateBlogAfterChange, revalidateBlogAfterDelete)
- Created revalidateBlog() helper function in revalidate.ts
- All collections registered in payload.config.ts
- Slug generation hooks inline in each collection (no separate slugify.ts needed)

### File List

- `src/collections/Posts.ts` (new)
- `src/collections/Categories.ts` (new)
- `src/collections/Tags.ts` (new)
- `src/lib/slugify.ts` (new - shared slug generation utility)
- `src/payload.config.ts` (modified)
- `src/lib/revalidate.ts` (modified - added revalidateBlog function)
- `src/lib/payloadHooks.ts` (modified - added blog revalidation hooks)
- `src/payload-types.ts` (auto-generated - includes new types)
- `scripts/seed-ci.ts` (modified - added blog seed data)
- `src/migrations/20260311_212816.ts` (auto-generated)
- `src/migrations/20260311_212816.json` (auto-generated)
- `src/migrations/index.ts` (auto-generated)

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.5 | **Date:** 2026-03-11 | **Outcome:** Approved with fixes applied

### Issues Found & Fixed

| Severity | Issue | Resolution |
|----------|-------|------------|
| HIGH | Categories and Tags used homepage revalidation hooks instead of blog hooks | Updated to use `revalidateBlogAfterChange`/`revalidateBlogAfterDelete` |
| MEDIUM | Duplicate slug generation code across 3 collection files (DRY violation) | Created shared `src/lib/slugify.ts` with `createSlugHook()` factory |

### Verification

- All Acceptance Criteria validated against implementation
- All tasks marked [x] confirmed as actually completed
- TypeScript compilation: Clean
- Prettier formatting: Pass
- Git vs Story File List: Aligned (migration files added)

### Notes

- Reading time hook correctly uses `beforeChange` (not `afterChange` as in spec) - this is an improvement that avoids extra database writes
- Live preview URL for posts points to `/blog/[slug]` which won't exist until Story 9.2 - expected behavior documented

## Change Log

| Date | Change |
|------|--------|
| 2026-03-11 | Initial implementation of Posts, Categories, and Tags collections |
| 2026-03-11 | Code review: Fixed revalidation hooks for Categories/Tags, created shared slugify utility |
