import type { CollectionConfig, FieldHook, CollectionBeforeChangeHook } from 'payload'
import { revalidateBlogAfterChange, revalidateBlogAfterDelete } from '@/lib/payloadHooks'
import { createSlugHook } from '@/lib/slugify'

/**
 * Extracts plain text from Lexical JSON content.
 * Recursively processes the node tree to get text content.
 */
function extractTextFromLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const root = content as { root?: { children?: unknown[] } }
  if (!root.root?.children) return ''

  function extractFromNodes(nodes: unknown[]): string {
    let text = ''
    for (const node of nodes) {
      if (typeof node !== 'object' || node === null) continue

      const typedNode = node as { type?: string; text?: string; children?: unknown[] }

      if (typedNode.type === 'text' && typeof typedNode.text === 'string') {
        text += typedNode.text + ' '
      }

      if (Array.isArray(typedNode.children)) {
        text += extractFromNodes(typedNode.children)
      }
    }
    return text
  }

  return extractFromNodes(root.root.children)
}

/**
 * Calculates reading time based on word count.
 * Uses 200 words per minute as the average reading speed.
 */
const calculateReadingTime: CollectionBeforeChangeHook = async ({ data }) => {
  if (data.content) {
    const text = extractTextFromLexical(data.content)
    const wordCount = text.split(/\s+/).filter(Boolean).length
    data.readingTime = Math.max(1, Math.ceil(wordCount / 200))
  }
  return data
}

/**
 * Sets publishedAt date when status changes to 'published'.
 */
const setPublishedAt: FieldHook = ({ value, data, originalDoc }) => {
  // If manually set, use that value
  if (value) return value

  // If status is changing to 'published' and publishedAt isn't set, set it now
  const newStatus = data?.status
  const oldStatus = originalDoc?.status
  const wasNotPublished = oldStatus !== 'published'
  const isNowPublished = newStatus === 'published'

  if (wasNotPublished && isNowPublished) {
    return new Date().toISOString()
  }

  return value
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'readingTime'],
    description: 'Blog posts for your site',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&slug=/blog/${data?.slug || ''}`,
    },
  },
  defaultSort: '-publishedAt',
  hooks: {
    beforeChange: [calculateReadingTime],
    afterChange: [revalidateBlogAfterChange],
    afterDelete: [revalidateBlogAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Blog post title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [createSlugHook('title')],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main blog post content',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description for blog listing pages',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the post (16:9 aspect ratio recommended)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Publication status (draft posts are not visible publicly)',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Publication date (auto-set when published)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeValidate: [setPublishedAt],
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time in minutes (auto-calculated)',
        readOnly: true,
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Categories this post belongs to',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Tags for this post',
      },
    },
  ],
}
