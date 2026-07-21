# Story 10.6: Latest writing section

Status: done

## Story
As a visitor, I want the three latest posts on the homepage, so that I can see Ben writes and jump in.

## Acceptance Criteria (epics-redesign.md FR-R13)
1. >=1 published post: up to three PostCards (mono date, title, ~120-char excerpt, `read ->`) + `all posts ->` link to /blog.
2. Zero posts: section renders nothing (FR-R15).

## Dev Notes
- New PostCard is the redesign treatment (whole card is the link); BlogPostCard remains for /blog until story 11.1 restyles the index.
- Excerpt clamped ~120 chars; date via mono short format.

## Dev Agent Record
- Files: src/components/PostCard.tsx (new), src/components/LatestPostsSection.tsx (rewrite)
