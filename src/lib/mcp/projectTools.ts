/**
 * Project MCP tools
 *
 * Lets Claude draft project cards for the /projects section. The Projects
 * collection has no draft status; what keeps a project off the site is the
 * `isVisible` flag, which every public query filters on. So every write here
 * sets `isVisible: false`, visible projects cannot be edited, and no tool
 * accepts the flag. Making a project visible always happens in the admin
 * panel, where it can also be dragged into position.
 */

import type { McpServer, ServerContext } from '@modelcontextprotocol/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { PROJECT_LINK_TYPES } from '@/collections/Projects'
import { getBaseUrl } from '@/lib/mcp/oauth'
import {
  assertImagesExist,
  attempt,
  failure,
  imageId,
  lexicalToMarkdown,
  markdownToLexical,
  result,
} from '@/lib/mcp/tools'
import { slugify } from '@/lib/slugify'
import type { Project } from '@/payload-types'

const linkTypes = PROJECT_LINK_TYPES.map((type) => type.value) as [
  (typeof PROJECT_LINK_TYPES)[number]['value'],
  ...(typeof PROJECT_LINK_TYPES)[number]['value'][],
]

const techStack = z
  .array(z.string().min(1).max(60))
  .max(20)
  .describe('Technology names shown on the card, in display order')

const links = z
  .array(
    z.object({
      type: z.enum(linkTypes).describe('github, live, appStore, googlePlay or other'),
      url: z.string().url().max(500),
      label: z
        .string()
        .min(1)
        .max(60)
        .optional()
        .describe('Link text; only used when type is "other"'),
    })
  )
  .max(10)
  .describe('Links shown on the card')

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe('Date as YYYY-MM-DD')

const DESCRIPTION_HINT =
  'The description is markdown. Its first paragraph is the one-line teaser shown on the card, so it must stand alone; the full text appears when the card is expanded.'

function describeProject(project: Project, ctx: ServerContext) {
  const baseUrl = ctx.http?.req ? getBaseUrl(ctx.http.req) : ''
  const image = project.image
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    // Mirrors the blog tools' status field so clients can treat both alike
    status: project.isVisible ? 'visible' : 'draft',
    techStack: (project.techStack ?? []).map((entry) => entry.technology),
    links: (project.links ?? []).map(({ type, url, label }) => ({
      type,
      url,
      label: label ?? null,
    })),
    image: typeof image === 'object' && image ? image.id : (image ?? null),
    hasPrivacyPolicy: Boolean(project.privacyPolicyMarkdown || project.privacyPolicy),
    updatedAt: project.updatedAt,
    adminUrl: `${baseUrl}/admin/collections/projects/${project.id}`,
  }
}

export function registerProjectTools(server: McpServer): void {
  server.registerTool(
    'list_projects',
    {
      title: 'List projects',
      description:
        'List the projects on ralton.dev, newest first, including hidden drafts. Check this before creating a project so an existing card is updated rather than duplicated.',
      inputSchema: z.object({
        status: z
          .enum(['draft', 'visible'])
          .optional()
          .describe('Only hidden drafts, or only projects shown on the site'),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      annotations: { readOnlyHint: true },
    },
    ({ status, limit }, ctx) =>
      attempt('list_projects', async () => {
        const payload = await getPayload({ config })
        const projects = await payload.find({
          collection: 'projects',
          ...(status && { where: { isVisible: { equals: status === 'visible' } } }),
          sort: '-createdAt',
          limit,
          depth: 0,
        })
        return result({
          total: projects.totalDocs,
          projects: projects.docs.map((project) => describeProject(project, ctx)),
        })
      })
  )

  server.registerTool(
    'get_project',
    {
      title: 'Get project',
      description:
        'Get one project with its description and privacy policy as markdown. Call this before update_draft_project so existing text is edited rather than replaced blind.',
      inputSchema: z.object({ id: z.number().int() }),
      annotations: { readOnlyHint: true },
    },
    ({ id }, ctx) =>
      attempt('get_project', async () => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
          collection: 'projects',
          where: { id: { equals: id } },
          limit: 1,
          depth: 0,
        })
        const project = docs[0]
        if (!project) return failure('Project not found.')
        return result({
          ...describeProject(project, ctx),
          description: await lexicalToMarkdown(payload, project.description),
          privacyPolicyMarkdown: project.privacyPolicyMarkdown ?? null,
          privacyPolicyUpdatedAt: project.privacyPolicyUpdatedAt ?? null,
        })
      })
  )

  server.registerTool(
    'create_draft_project',
    {
      title: 'Create draft project',
      description: `Create a project card for the /projects section as a hidden draft. It is never shown on the site by this tool: the site owner reviews it in the admin panel, makes it visible and drags it into position. ${DESCRIPTION_HINT} The image is a 16:9 title card; upload it first with create_image_upload or upload_image and pass its id.`,
      inputSchema: z.object({
        title: z.string().min(1).max(200),
        description: z.string().min(1).describe('Card description in markdown'),
        slug: z
          .string()
          .max(200)
          .optional()
          .describe('URL slug, usually the repo name; generated from the title if omitted'),
        techStack: techStack.optional(),
        links: links.optional(),
        image: imageId.optional().describe('Media id of the 16:9 title card'),
        privacyPolicyMarkdown: z
          .string()
          .optional()
          .describe(
            'Privacy policy in markdown, for apps that collect anything. Published at /projects/<slug>/privacy once the project is visible.'
          ),
        privacyPolicyUpdatedAt: dateOnly
          .optional()
          .describe('"Last updated" date shown on the privacy policy; defaults to today'),
      }),
    },
    (
      {
        title,
        description,
        slug,
        techStack,
        links,
        image,
        privacyPolicyMarkdown,
        privacyPolicyUpdatedAt,
      },
      ctx
    ) =>
      attempt('create_draft_project', async () => {
        const payload = await getPayload({ config })
        if (image) await assertImagesExist(payload, [image])
        const hasPolicy = Boolean(privacyPolicyMarkdown?.trim())
        const project = await payload.create({
          collection: 'projects',
          depth: 0,
          data: {
            title,
            slug: slug ? slugify(slug) : slugify(title),
            description: await markdownToLexical(payload, description),
            techStack: (techStack ?? []).map((technology) => ({ technology })),
            links: links ?? [],
            image,
            ...(hasPolicy && {
              privacyPolicyMarkdown,
              privacyPolicyUpdatedAt: privacyPolicyUpdatedAt ?? today(),
            }),
            isVisible: false,
          },
        })
        console.log(`[MCP] Draft project created: ${project.slug} (${project.id})`)
        return result(describeProject(project, ctx))
      })
  )

  server.registerTool(
    'update_draft_project',
    {
      title: 'Update draft project',
      description: `Update a hidden draft project. Only the fields provided are changed; techStack and links replace the current lists. Call get_project first and edit the markdown it returns. ${DESCRIPTION_HINT} Projects already visible on the site cannot be edited, and this tool cannot make a project visible.`,
      inputSchema: z.object({
        id: z.number().int().describe('ID of the draft project to update'),
        title: z.string().min(1).max(200).optional(),
        description: z.string().min(1).optional().describe('New card description in markdown'),
        techStack: techStack.optional(),
        links: links.optional(),
        image: imageId.optional().describe('Media id of the 16:9 title card'),
        privacyPolicyMarkdown: z
          .string()
          .optional()
          .describe('New privacy policy in markdown; an empty string removes the markdown source'),
        privacyPolicyUpdatedAt: dateOnly
          .optional()
          .describe('"Last updated" date; defaults to today when the policy text changes'),
      }),
      annotations: { idempotentHint: true },
    },
    (
      {
        id,
        title,
        description,
        techStack,
        links,
        image,
        privacyPolicyMarkdown,
        privacyPolicyUpdatedAt,
      },
      ctx
    ) =>
      attempt('update_draft_project', async () => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
          collection: 'projects',
          where: { id: { equals: id } },
          limit: 1,
          depth: 0,
        })
        const existing = docs[0]
        if (!existing) return failure('Project not found.')
        if (existing.isVisible) {
          return failure(
            'This project is visible on the site. Only hidden drafts can be edited through MCP.'
          )
        }

        if (image) await assertImagesExist(payload, [image])
        const policyChanged =
          privacyPolicyMarkdown !== undefined &&
          privacyPolicyMarkdown.trim() !== (existing.privacyPolicyMarkdown ?? '').trim()

        const project = await payload.update({
          collection: 'projects',
          id,
          depth: 0,
          data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && {
              description: await markdownToLexical(payload, description),
            }),
            ...(techStack && { techStack: techStack.map((technology) => ({ technology })) }),
            ...(links && { links }),
            ...(image !== undefined && { image }),
            ...(privacyPolicyMarkdown !== undefined && { privacyPolicyMarkdown }),
            ...(privacyPolicyUpdatedAt !== undefined
              ? { privacyPolicyUpdatedAt }
              : policyChanged && { privacyPolicyUpdatedAt: today() }),
            isVisible: false,
          },
        })
        console.log(`[MCP] Draft project updated: ${project.slug} (${project.id})`)
        return result(describeProject(project, ctx))
      })
  )
}

/** Today's date in the form the Payload date field stores for a day-only picker. */
function today(): string {
  return new Date().toISOString()
}
