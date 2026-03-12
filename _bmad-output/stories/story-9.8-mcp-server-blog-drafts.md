# Story 9.8: MCP Server for Blog Draft Creation

Status: draft

## Story

As a **content creator using Claude Code**,
I want **to create blog post drafts directly from Claude via MCP tools**,
so that **I can seamlessly draft content without leaving my development environment**.

## Acceptance Criteria

1. **AC1: MCP server connects to production database**
   - Given I have `.env.production.local` with the Neon connection string
   - When I start the MCP server
   - Then it connects to the production Payload database

2. **AC2: Create draft post tool**
   - Given I invoke the `create_draft_post` tool with title, content (markdown), and optional excerpt/categories/tags
   - When the tool executes
   - Then a new post is created with status `draft` (never published)
   - And the post appears in the Payload admin panel

3. **AC3: Content is converted to Lexical format**
   - Given I provide content as markdown
   - When the post is created
   - Then the content is properly converted to Payload's Lexical rich text format

4. **AC4: List posts tool**
   - Given I invoke the `list_posts` tool
   - When the tool executes
   - Then I see a list of posts with title, slug, status, and publishedAt date

5. **AC5: Get post tool**
   - Given I invoke the `get_post` tool with a slug or ID
   - When the tool executes
   - Then I see the full post details including content

6. **AC6: Update draft tool**
   - Given I invoke the `update_draft` tool with a post ID and updated fields
   - When the tool executes
   - Then the post is updated
   - And the status cannot be changed to published via this tool

7. **AC7: Categories and tags auto-creation**
   - Given I create a post with category/tag names that don't exist
   - When the tool executes
   - Then new categories/tags are created automatically
   - And the post is linked to them

## Tasks / Subtasks

- [ ] Task 1: Set up MCP server infrastructure (AC: #1)
  - [ ] 1.1 Create `mcp-server/` directory structure
  - [ ] 1.2 Initialize MCP server with `@modelcontextprotocol/sdk`
  - [ ] 1.3 Configure Payload client initialization with production database
  - [ ] 1.4 Create `.env.production.local.example` documenting required variables
  - [ ] 1.5 Add `.env.production.local` to `.gitignore` (verify)

- [ ] Task 2: Implement markdown to Lexical conversion (AC: #3)
  - [ ] 2.1 Research/implement markdown-to-Lexical conversion utility
  - [ ] 2.2 Handle headings, paragraphs, code blocks, lists, links, bold/italic
  - [ ] 2.3 Test conversion with various markdown inputs

- [ ] Task 3: Implement `create_draft_post` tool (AC: #2, #3, #7)
  - [ ] 3.1 Define tool schema (title, content, excerpt, categories, tags)
  - [ ] 3.2 Implement category/tag lookup or creation
  - [ ] 3.3 Convert markdown content to Lexical
  - [ ] 3.4 Create post with hardcoded `status: 'draft'`
  - [ ] 3.5 Return created post details

- [ ] Task 4: Implement `list_posts` tool (AC: #4)
  - [ ] 4.1 Define tool schema (optional status filter, limit)
  - [ ] 4.2 Query posts collection with pagination
  - [ ] 4.3 Return formatted list with key fields

- [ ] Task 5: Implement `get_post` tool (AC: #5)
  - [ ] 5.1 Define tool schema (slug or id)
  - [ ] 5.2 Fetch post with populated relationships
  - [ ] 5.3 Return full post details

- [ ] Task 6: Implement `update_draft` tool (AC: #6)
  - [ ] 6.1 Define tool schema (id, updatable fields)
  - [ ] 6.2 Explicitly exclude `status` from updatable fields
  - [ ] 6.3 Validate post exists and is a draft
  - [ ] 6.4 Update post and return updated details

- [ ] Task 7: Claude Code MCP configuration (AC: #1)
  - [ ] 7.1 Document MCP server registration in Claude Code settings
  - [ ] 7.2 Create npm script for running MCP server
  - [ ] 7.3 Test end-to-end: Claude Code invokes tool, post appears in admin

- [ ] Task 8: Documentation (AC: all)
  - [ ] 8.1 Create `docs/mcp-server.md` with setup instructions
  - [ ] 8.2 Document each tool with examples
  - [ ] 8.3 Document security considerations (prod DB access)
  - [ ] 8.4 Add troubleshooting section

- [ ] Task 9: Testing (AC: all)
  - [ ] 9.1 Unit tests for markdown-to-Lexical conversion
  - [ ] 9.2 Integration tests for each MCP tool against test database
  - [ ] 9.3 Test category/tag auto-creation
  - [ ] 9.4 Test that status cannot be set to published
  - [ ] 9.5 Test error handling (invalid input, DB connection issues)

## Dev Notes

### MCP Server Architecture

```
mcp-server/
├── index.ts              # MCP server entry point
├── payload-client.ts     # Payload initialization
├── tools/
│   ├── create-draft-post.ts
│   ├── list-posts.ts
│   ├── get-post.ts
│   └── update-draft.ts
├── utils/
│   └── markdown-to-lexical.ts
└── __tests__/
    ├── markdown-to-lexical.test.ts
    └── tools.test.ts
```

### Key Dependencies

```json
{
  "@modelcontextprotocol/sdk": "latest",
  "marked": "for markdown parsing (or similar)"
}
```

### Security Constraints

1. **Draft-only**: The `status` field is ALWAYS set to `draft` on create, and cannot be changed to `published` via MCP tools
2. **Production credentials**: `.env.production.local` is gitignored and contains sensitive Neon connection string
3. **Local only**: MCP server runs locally via stdio, no network exposure

### Claude Code Configuration

Add to Claude Code MCP settings:
```json
{
  "mcpServers": {
    "payload-cms": {
      "command": "npx",
      "args": ["tsx", "mcp-server/index.ts"],
      "env": {
        "DOTENV_CONFIG_PATH": ".env.production.local"
      }
    }
  }
}
```

### Markdown to Lexical Conversion

Payload uses Lexical for rich text. We need to convert markdown to Lexical JSON structure:

```typescript
// Input (markdown)
"# Hello\n\nThis is **bold** text."

// Output (Lexical JSON)
{
  root: {
    children: [
      { type: "heading", tag: "h1", children: [{ type: "text", text: "Hello" }] },
      { type: "paragraph", children: [
        { type: "text", text: "This is " },
        { type: "text", text: "bold", format: 1 },
        { type: "text", text: " text." }
      ]}
    ]
  }
}
```

Consider using `@payloadcms/richtext-lexical` utilities if available, or build minimal converter.

### Testing Strategy

- **Unit tests**: Markdown conversion edge cases
- **Integration tests**: Use test database (not production) for tool tests
- **Manual testing**: End-to-end with Claude Code

## References

- [MCP SDK Documentation](https://modelcontextprotocol.io/docs)
- [Payload Lexical Rich Text](https://payloadcms.com/docs/rich-text/lexical)
- Existing seed script: `scripts/seed-ci.ts` (example of Payload Local API usage)
