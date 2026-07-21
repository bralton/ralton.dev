# Story 11.2: Blog posts with author card and onward path

Status: done

## Story
As a reader arriving from a shared link, I want a comfortable reading experience that ends with who wrote it and where to go next, so that every post is a soft entry point to the site.

## Acceptance Criteria (epics-redesign.md FR-R16 post half, FR-R17)
1. Post page on new tokens + condensed nav; single reading column retained (800px article col); prose Inter, mono only for dates/meta/code.
2. Post ends with AuthorFooterCard (avatar, one-line pitch, home link) + "more posts" row; row suppresses when no other posts.
3. Blog routes in Lighthouse CI (verified: accessibility workflow audits sitemap-discovered URLs incl. blog).

## Dev Notes
- AuthorFooterCard is a server component fetching Hero global (name/tagline), About global (photo), and up to 3 other published posts.
- Back link now mono `<- all posts`; date/reading-time meta mono; tag badges on border tokens.
- Draft preview banner and all SEO metadata untouched.

## Dev Agent Record
- Files: src/components/AuthorFooterCard.tsx (new), src/app/(frontend)/blog/[slug]/page.tsx
