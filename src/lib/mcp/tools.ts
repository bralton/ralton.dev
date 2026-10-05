/**
 * Blog MCP tools
 *
 * Lets Claude draft blog posts in Payload. Every write is draft-only: posts
 * are created with status `draft`, published posts cannot be edited, and no
 * tool accepts a status. Publishing always happens in the admin panel.
 */

import type { McpServer, ServerContext } from '@modelcontextprotocol/server'
import {
  convertLexicalToMarkdown,
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import { randomBytes } from 'crypto'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { getBaseUrl } from '@/lib/mcp/oauth'
import { slugify } from '@/lib/slugify'
import type { Category, Post, Tag } from '@/payload-types'

function result(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function failure(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true }
}

/** Runs a tool body, turning thrown errors (e.g. a duplicate slug) into tool errors. */
async function attempt(name: string, run: () => Promise<ReturnType<typeof result>>) {
  try {
    return await run()
  } catch (error) {
    console.error(`[MCP] ${name} failed:`, error)
    return failure(error instanceof Error ? error.message : 'Unexpected error')
  }
}

type LexicalNode = Post['content']['root']['children'][number]

/** Languages the editor's Code block accepts (Payload's CodeBlock defaults). */
const CODE_LANGUAGES = new Set(
  'abap apex azcli bat bicep cameligo clojure coffee cpp csharp csp css cypher dart dockerfile ecl elixir flow9 freemarker2 fsharp go graphql handlebars hcl html ini java javascript julia kotlin less lexon liquid lua m3 markdown mdx mips msdax mysql objective-c pascal pascaligo perl pgsql php pla plaintext postiats powerquery powershell protobuf pug python qsharp r razor redis redshift restructuredtext ruby rust sb scala scheme scss shell solidity sophia sparql sql st swift systemverilog tcl twig typescript typespec vb wgsl xml yaml'.split(
    ' '
  )
)

/** Common fence info strings that differ from the editor's language keys. */
const CODE_LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  console: 'shell',
  py: 'python',
  yml: 'yaml',
  md: 'markdown',
  'c++': 'cpp',
  c: 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  docker: 'dockerfile',
  tf: 'hcl',
  terraform: 'hcl',
  rb: 'ruby',
  rs: 'rust',
  golang: 'go',
  kt: 'kotlin',
  ps1: 'powershell',
  postgres: 'pgsql',
  postgresql: 'pgsql',
  toml: 'ini',
}

/** Maps a fence info string to a language the Code block will accept. */
function codeLanguage(info: string): string {
  const language = CODE_LANGUAGE_ALIASES[info] ?? info
  return CODE_LANGUAGES.has(language) ? language : 'plaintext'
}

function isCodeBlock(node: LexicalNode): boolean {
  const fields = node.fields as { blockType?: string } | undefined
  return node.type === 'block' && fields?.blockType === 'Code'
}

function rootOf(children: LexicalNode[]): Post['content'] {
  return {
    root: { type: 'root', children, direction: null, format: '', indent: 0, version: 1 },
  }
}

/**
 * Converts markdown to the Posts editor's Lexical format.
 *
 * Fenced code is split out and turned into the editor's Code block (the one
 * the site renders with Shiki); everything between fences goes through
 * Payload's markdown converter.
 */
async function markdownToLexical(payload: Payload, markdown: string): Promise<Post['content']> {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const children: LexicalNode[] = []
  let prose: string[] = []

  const flushProse = () => {
    const text = prose.join('\n').trim()
    prose = []
    if (!text) return
    const converted = convertMarkdownToLexical({ editorConfig, markdown: text })
    children.push(...(converted.root.children as LexicalNode[]))
  }

  let fence: { marker: string; language: string; lines: string[] } | null = null
  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (fence) {
      const closing = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(line)
      if (
        closing &&
        closing[1][0] === fence.marker[0] &&
        closing[1].length >= fence.marker.length
      ) {
        children.push(codeBlock(fence.language, fence.lines.join('\n')))
        fence = null
      } else {
        fence.lines.push(line)
      }
      continue
    }

    const opening = /^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)[^`]*$/.exec(line)
    if (opening) {
      flushProse()
      fence = { marker: opening[1], language: opening[2].toLowerCase(), lines: [] }
    } else {
      prose.push(line)
    }
  }
  // An unclosed fence runs to the end of the document
  if (fence) children.push(codeBlock(fence.language, fence.lines.join('\n')))
  flushProse()

  return rootOf(children)
}

function codeBlock(language: string, code: string): LexicalNode {
  return {
    type: 'block',
    version: 2,
    format: '',
    fields: {
      id: randomBytes(12).toString('hex'),
      blockName: '',
      blockType: 'Code',
      language: codeLanguage(language),
      code,
    },
  }
}

/** The reverse of markdownToLexical: Code blocks come back as fenced code. */
async function lexicalToMarkdown(payload: Payload, content: Post['content']): Promise<string> {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const parts: string[] = []
  let prose: LexicalNode[] = []

  const flushProse = () => {
    if (prose.length) {
      parts.push(convertLexicalToMarkdown({ editorConfig, data: rootOf(prose) }))
      prose = []
    }
  }

  for (const node of content.root.children) {
    if (!isCodeBlock(node)) {
      prose.push(node)
      continue
    }
    flushProse()
    const { language, code } = node.fields as { language?: string; code?: string }
    parts.push(`\`\`\`${language ?? ''}\n${code ?? ''}\n\`\`\``)
  }
  flushProse()

  return parts.join('\n\n')
}

/** Resolves category/tag names to IDs, creating any that don't exist yet. */
async function resolveTerms(
  payload: Payload,
  collection: 'categories' | 'tags',
  names: string[]
): Promise<number[]> {
  const ids: number[] = []
  for (const rawName of names) {
    const name = rawName.trim()
    const slug = slugify(name)
    if (!slug) continue

    const existing = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const id =
      existing.docs[0]?.id ?? (await payload.create({ collection, data: { name, slug } })).id
    if (!ids.includes(id)) ids.push(id)
  }
  return ids
}

function termNames(terms: Post['categories'] | Post['tags']): string[] {
  return (terms ?? [])
    .filter((term): term is Category | Tag => typeof term === 'object')
    .map((term) => term.name)
}

function summarize(post: Post, ctx: ServerContext) {
  const baseUrl = ctx.http?.req ? getBaseUrl(ctx.http.req) : ''
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    publishedAt: post.publishedAt ?? null,
    updatedAt: post.updatedAt,
    adminUrl: `${baseUrl}/admin/collections/posts/${post.id}`,
  }
}

const termList = z.array(z.string().min(1).max(100)).max(20)

export function registerBlogTools(server: McpServer): void {
  server.registerTool(
    'list_posts',
    {
      title: 'List blog posts',
      description: 'List blog posts on ralton.dev, newest first. Includes drafts.',
      inputSchema: z.object({
        status: z.enum(['draft', 'published']).optional().describe('Only posts with this status'),
        limit: z.number().int().min(1).max(50).default(20),
      }),
      annotations: { readOnlyHint: true },
    },
    ({ status, limit }, ctx) =>
      attempt('list_posts', async () => {
        const payload = await getPayload({ config })
        const posts = await payload.find({
          collection: 'posts',
          where: status ? { status: { equals: status } } : {},
          sort: '-updatedAt',
          limit,
          depth: 0,
        })
        return result({
          total: posts.totalDocs,
          posts: posts.docs.map((post) => summarize(post, ctx)),
        })
      })
  )

  server.registerTool(
    'get_post',
    {
      title: 'Get blog post',
      description:
        'Fetch one blog post by ID or slug, with its content as markdown, excerpt, categories and tags.',
      inputSchema: z.object({
        id: z.number().int().optional().describe('Post ID'),
        slug: z.string().optional().describe('Post slug (used when no ID is given)'),
      }),
      annotations: { readOnlyHint: true },
    },
    ({ id, slug }, ctx) =>
      attempt('get_post', async () => {
        if (id === undefined && !slug) return failure('Provide either id or slug.')

        const payload = await getPayload({ config })
        const { docs } = await payload.find({
          collection: 'posts',
          where: id !== undefined ? { id: { equals: id } } : { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        })
        const post = docs[0]
        if (!post) return failure('Post not found.')

        return result({
          ...summarize(post, ctx),
          excerpt: post.excerpt ?? null,
          categories: termNames(post.categories),
          tags: termNames(post.tags),
          content: await lexicalToMarkdown(payload, post.content),
        })
      })
  )

  server.registerTool(
    'create_draft_post',
    {
      title: 'Create draft blog post',
      description:
        'Create a new blog post as a draft. It is never published by this tool: the site owner reviews and publishes it in the admin panel. Content is markdown (headings, lists, links, bold/italic, fenced code blocks). Do not repeat the title as a heading in the content.',
      inputSchema: z.object({
        title: z.string().min(1).max(200),
        content: z.string().min(1).describe('Post body in markdown'),
        excerpt: z.string().max(500).optional().describe('Short summary for listing pages'),
        slug: z
          .string()
          .max(200)
          .optional()
          .describe('URL slug; generated from the title if omitted'),
        categories: termList.optional().describe('Category names; missing ones are created'),
        tags: termList.optional().describe('Tag names; missing ones are created'),
      }),
    },
    ({ title, content, excerpt, slug, categories, tags }, ctx) =>
      attempt('create_draft_post', async () => {
        const payload = await getPayload({ config })
        const post = await payload.create({
          collection: 'posts',
          depth: 0,
          data: {
            title,
            slug: slug ? slugify(slug) : slugify(title),
            content: await markdownToLexical(payload, content),
            excerpt,
            status: 'draft',
            categories: categories ? await resolveTerms(payload, 'categories', categories) : [],
            tags: tags ? await resolveTerms(payload, 'tags', tags) : [],
          },
        })
        console.log(`[MCP] Draft created: ${post.slug} (${post.id})`)
        return result(summarize(post, ctx))
      })
  )

  server.registerTool(
    'update_draft',
    {
      title: 'Update draft blog post',
      description:
        'Update an existing draft. Only the fields provided are changed; content, categories and tags replace the current values. Published posts cannot be edited, and this tool cannot publish.',
      inputSchema: z.object({
        id: z.number().int().describe('ID of the draft to update'),
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1).optional().describe('New post body in markdown'),
        excerpt: z.string().max(500).optional(),
        categories: termList.optional().describe('Category names; missing ones are created'),
        tags: termList.optional().describe('Tag names; missing ones are created'),
      }),
      annotations: { idempotentHint: true },
    },
    ({ id, title, content, excerpt, categories, tags }, ctx) =>
      attempt('update_draft', async () => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
          collection: 'posts',
          where: { id: { equals: id } },
          limit: 1,
          depth: 0,
        })
        const existing = docs[0]
        if (!existing) return failure('Post not found.')
        if (existing.status !== 'draft') {
          return failure('This post is published. Only drafts can be edited through MCP.')
        }

        const post = await payload.update({
          collection: 'posts',
          id,
          depth: 0,
          data: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content: await markdownToLexical(payload, content) }),
            ...(excerpt !== undefined && { excerpt }),
            ...(categories && {
              categories: await resolveTerms(payload, 'categories', categories),
            }),
            ...(tags && { tags: await resolveTerms(payload, 'tags', tags) }),
            status: 'draft',
          },
        })
        console.log(`[MCP] Draft updated: ${post.slug} (${post.id})`)
        return result(summarize(post, ctx))
      })
  )
}
