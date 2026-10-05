# Story 9.8: MCP Server for Blog Draft Creation

Status: done

> **Design change (2026-10-05):** This story was originally specced as a local stdio MCP server in `mcp-server/` that connected straight to the production database. It was built instead as a remote MCP endpoint inside the Next.js app, with the site acting as its own OAuth authorization server, so it works from claude.ai as well as Claude Code and needs no local setup. The acceptance criteria and tasks below describe what was built. See [Deviations from the original spec](#deviations-from-the-original-spec).

## Story

As a **content creator using Claude**,
I want **to create blog post drafts directly from Claude via MCP tools**,
so that **I can draft content from claude.ai or Claude Code without opening the admin panel**.

## Acceptance Criteria

1. **AC1: Remote MCP endpoint**
   - Given the site is deployed
   - When an MCP client connects to `https://www.ralton.dev/api/mcp` over Streamable HTTP
   - Then it can list and call the blog tools
   - And no local process, checkout or database credentials are needed on the client machine

2. **AC2: OAuth sign-in that claude.ai and Claude Code can complete**
   - Given a Claude client connects without a token
   - When the server answers `401` with a `WWW-Authenticate` header pointing at the discovery metadata
   - Then the client can discover the authorization server, send the owner to `/oauth/authorize`, and exchange the code at `/oauth/token` using PKCE (S256)
   - And clients identify themselves with a Client ID Metadata Document (no client registration step)

3. **AC3: Only the site owner can approve a connection**
   - Given a connection request reaches `/oauth/authorize`
   - When the visitor is not a signed-in Payload admin on the allowlisted IP
   - Then no authorization code is issued
   - And authorization codes are only ever sent to Claude's hosted callback or a loopback `/callback` URL

4. **AC4: Connections are visible and revocable**
   - Given a connection has been approved
   - When I open **MCP Connections** in the admin panel
   - Then I see it, and deleting it revokes access immediately
   - And only hashes of codes and tokens are stored

5. **AC5: Create draft post tool**
   - Given I invoke `create_draft_post` with title, content (markdown), and optional excerpt/slug/categories/tags
   - When the tool executes
   - Then a new post is created with status `draft` (never published)
   - And the post appears in the Payload admin panel

6. **AC6: Content is converted to Lexical format**
   - Given I provide content as markdown
   - When the post is created or updated
   - Then it is converted to Payload's Lexical rich text format
   - And fenced code becomes the editor's Code block, which the blog renders with Shiki

7. **AC7: List posts tool**
   - Given I invoke `list_posts`
   - When the tool executes
   - Then I see posts with title, slug, status, and publishedAt date

8. **AC8: Get post tool**
   - Given I invoke `get_post` with a slug or ID
   - When the tool executes
   - Then I see the full post details, with content returned as markdown

9. **AC9: Update draft tool**
   - Given I invoke `update_draft` with a post ID and updated fields
   - When the tool executes
   - Then the draft is updated
   - And published posts cannot be edited, and the status cannot be changed to published

10. **AC10: Categories and tags auto-creation**
    - Given I create or update a post with category/tag names that don't exist
    - When the tool executes
    - Then new categories/tags are created automatically (matched by slug)
    - And the post is linked to them

## Tasks / Subtasks

- [x] Task 1: MCP endpoint (AC: #1)
  - [x] 1.1 Add `mcp-handler` and `@modelcontextprotocol/server`
  - [x] 1.2 Create `src/app/api/mcp/route.ts` (GET/POST/DELETE)
  - [x] 1.3 Answer prompt and resource listings with empty results (see Completion Notes)

- [x] Task 2: OAuth authorization server (AC: #2, #3)
  - [x] 2.1 Discovery metadata: `/.well-known/oauth-protected-resource[/api/mcp]` and `/.well-known/oauth-authorization-server`
  - [x] 2.2 `/oauth/authorize` consent screen (admin session, signed consent form, origin check)
  - [x] 2.3 `/oauth/token` with `authorization_code` and `refresh_token` grants, PKCE, rotating refresh tokens
  - [x] 2.4 Redirect URI allowlist (Claude hosted callback, loopback `/callback` on any port)
  - [x] 2.5 Add `/oauth/authorize` to the admin IP allowlist in `src/middleware.ts`
  - [x] 2.6 Build all advertised URLs from the request host

- [x] Task 3: McpGrants collection (AC: #4)
  - [x] 3.1 Create `src/collections/McpGrants.ts` (read/delete only in admin; hashes hidden)
  - [x] 3.2 Migration `20261005_100000_mcp_grants`
  - [x] 3.3 Regenerate `payload-types.ts`

- [x] Task 4: Markdown to Lexical conversion (AC: #6)
  - [x] 4.1 Convert prose with `convertMarkdownToLexical`
  - [x] 4.2 Split out fenced code into the editor's Code block, mapping fence languages to the block's language options
  - [x] 4.3 Reverse conversion for `get_post`

- [x] Task 5: Tools (AC: #5, #7, #8, #9, #10)
  - [x] 5.1 `list_posts`
  - [x] 5.2 `get_post`
  - [x] 5.3 `create_draft_post` (status hardcoded to `draft`)
  - [x] 5.4 `update_draft` (drafts only; no status input)
  - [x] 5.5 Category/tag lookup-or-create by slug

- [x] Task 6: Testing (AC: all)
  - [x] 6.1 `e2e/mcp.spec.ts`: unauthenticated challenge, discovery metadata, token endpoint rejection
  - [x] 6.2 Manual end-to-end against a local Postgres (dev server and production build)
  - [x] 6.3 Live verification from Claude Code and claude.ai
  - [ ] 6.4 Unit tests for markdown conversion — not done (no unit test framework in the repo)
  - [ ] 6.5 Automated tests for the authenticated tool calls — not done (covered manually only)

- [x] Task 7: Documentation
  - [x] 7.1 Update `CLAUDE.md` (project structure, Key Patterns)
  - [ ] 7.2 `docs/mcp-server.md` — not written; setup is two steps (see Connecting)

## Dev Notes

### Architecture

```
src/
├── app/
│   ├── api/mcp/route.ts                               # MCP endpoint (auth-wrapped)
│   ├── oauth/
│   │   ├── authorize/route.ts                         # Consent screen (GET) + decision (POST)
│   │   └── token/route.ts                             # Code exchange + refresh
│   └── .well-known/
│       ├── oauth-protected-resource/[[...path]]/route.ts
│       └── oauth-authorization-server/route.ts
├── collections/McpGrants.ts                           # One row per approved connection
├── lib/mcp/
│   ├── oauth.ts                                       # Allowlists, tokens, consent signing, grant storage
│   └── tools.ts                                       # The four tools + markdown conversion
└── migrations/20261005_100000_mcp_grants.ts
```

### Security Constraints

1. **Draft-only**: `status` is always `draft` on create, no tool accepts a status, and published posts cannot be edited. Nothing can be published or deleted through MCP.
2. **Owner-only approval**: `/oauth/authorize` needs a Payload admin session and is behind the same IP allowlist as `/admin`. `/oauth/token` is deliberately not IP-restricted, because Claude calls it from Anthropic's servers.
3. **Redirect allowlist**: codes are only delivered to `https://claude.ai/api/mcp/auth_callback`, `https://claude.com/api/mcp/auth_callback`, or `http://localhost|127.0.0.1|[::1]:<any port>/callback`. The client's metadata document is not fetched, so there is no SSRF surface.
4. **Token storage**: codes and tokens are random 256-bit values stored as SHA-256 hashes. Access tokens last 1 hour; refresh tokens last 30 days and rotate on every use.
5. **CSRF**: the consent form carries an HMAC (keyed with `PAYLOAD_SECRET`) over the admin ID and the exact request, and the POST checks `Origin`.

### Configuration

No new environment variables. The OAuth consent signature uses `PAYLOAD_SECRET`. Advertised URLs are built from the request host, not `NEXT_PUBLIC_SITE_URL`.

### Connecting

- **claude.ai**: Customize > Connectors > Add custom connector, URL `https://www.ralton.dev/api/mcp`, authentication **Sign in now**, OAuth client **Use Claude's published identity**. Approve from the allowlisted IP.
- **Claude Code**: picks up the claude.ai connector automatically when signed in with the same account. To connect directly instead: `claude mcp add --transport http --scope user blog https://www.ralton.dev/api/mcp`, then `/mcp`.
- The URL must use `www`: the bare `ralton.dev` redirects, and clients drop the sign-in token on a cross-host redirect.

### Known Limitations

- **Code languages**: the editor's Code block has a fixed language list with no JSON, Bash or TSX. Bash maps to Shell and TSX to TypeScript; JSON and unknown languages fall back to plain text.
- **Approving from another network**: a new connection cannot be approved away from the allowlisted IP.
- **No registration endpoint**: only clients that support Client ID Metadata Documents can connect (Claude's do).
- **One token pair per connection**: a refresh invalidates the previous access token immediately.

## Deviations from the original spec

| Original spec | What was built | Why |
| --- | --- | --- |
| Local stdio server in `mcp-server/`, run with `npx tsx` | HTTP endpoint at `/api/mcp` in the Next.js app | Always available, no per-project setup, works from claude.ai |
| Reads `.env.production.local` with the Neon connection string | No credentials on the client; runs inside the deployed app | Keeps prod DB credentials off the laptop; always matches the migrated schema; revalidation hooks run normally |
| No authentication (local only) | OAuth 2.1 with PKCE, owner consent, revocable grants | Required for a public endpoint and for claude.ai |
| `marked` or a custom markdown converter | Payload's own `convertMarkdownToLexical`, plus fence handling | Matches the editor's node format |
| Unit and integration test suites | Playwright API spec for unauthenticated behaviour; manual testing for the rest | No unit test framework is configured in the repo |
| `docs/mcp-server.md` | Not written | Setup reduced to adding one URL |

## Dev Agent Record

### Agent Model Used

Claude Fable 5.1 (claude-fable-5-1)

### Completion Notes List

- **Verified locally** against a throwaway Postgres on both the dev server and a production build: sign-in redirect, approve and deny, PKCE and client checks, single-use codes, refresh rotation, all four tools, the markdown round trip, and rendering of code blocks on the blog page. The consent screen was driven in real Chrome.
- **Migration** was hand-written and its resulting schema diffed against the schema Payload generates itself; they match.
- **Checks passed**: `tsc --noEmit`, `pnpm lint`, `npx next build`, `e2e/mcp.spec.ts` (5 tests × 2 projects).
- **Verified live** on 2026-10-05: connected from Claude Code (`list_posts` returned successfully) and from claude.ai (confirmed working by the site owner).
- **Production fix 1 (`a593e27`)**: the discovery metadata advertised `http://localhost:3000` because `NEXT_PUBLIC_SITE_URL` is not set in production. URLs are now built from the request host. This also surfaced that the canonical host is `www.ralton.dev`.
- **Production fix 2 (`b63a75a`)**: claude.ai reported "no MCP endpoint was found". Under the 2026-07-28 protocol the SDK answers an unimplemented method with HTTP 404, so `prompts/list` and `resources/list` on a tools-only server looked like a missing endpoint. The server now declares both capabilities and returns empty lists. Claude Code was unaffected because it used the older protocol.
- **Related fix**: `src/lib/lexicalSerializer.tsx` checked for block type `code`, but Payload's Code block slug is `Code`, so code blocks were not rendering. It now accepts both.
- **Not done**: unit tests for markdown conversion, automated tests for authenticated tool calls, `docs/mcp-server.md`.

### File List

**Added**

- `src/app/api/mcp/route.ts`
- `src/app/oauth/authorize/route.ts`
- `src/app/oauth/token/route.ts`
- `src/app/.well-known/oauth-protected-resource/[[...path]]/route.ts`
- `src/app/.well-known/oauth-authorization-server/route.ts`
- `src/collections/McpGrants.ts`
- `src/lib/mcp/oauth.ts`
- `src/lib/mcp/tools.ts`
- `src/migrations/20261005_100000_mcp_grants.ts`
- `e2e/mcp.spec.ts`

**Modified**

- `src/payload.config.ts` (register McpGrants)
- `src/payload-types.ts` (regenerated)
- `src/migrations/index.ts`
- `src/middleware.ts` (protect `/oauth/authorize`)
- `src/lib/slugify.ts` (export `slugify`)
- `src/lib/lexicalSerializer.tsx` (Code block type check)
- `package.json`, `pnpm-lock.yaml`
- `CLAUDE.md`

### Change Log

- 2026-10-05: `6449c83` feat(blog): MCP server for drafting posts from Claude
- 2026-10-05: `a593e27` fix(blog): build MCP OAuth URLs from the request host
- 2026-10-05: `b63a75a` fix(blog): answer MCP prompt and resource listings with empty results

## References

- [Claude connector authentication requirements](https://claude.com/docs/connectors/building/authentication)
- [Claude connector troubleshooting](https://claude.com/docs/connectors/building/troubleshooting)
- [mcp-handler](https://github.com/vercel/mcp-handler)
- [Payload Lexical Rich Text](https://payloadcms.com/docs/rich-text/lexical)
