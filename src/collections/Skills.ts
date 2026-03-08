import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/payloadHooks'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isVisible'],
    description: 'Technical skills displayed on your portfolio, grouped by category',
    livePreview: {
      url: () =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&slug=/`,
    },
  },
  defaultSort: 'category',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Skill name (e.g., TypeScript, React, Docker)',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Category for grouping (e.g., Languages, Frameworks, Tools, DevOps)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this skill on the site',
        components: {
          Cell: '/admin/VisibilityCell#VisibilityCell',
        },
      },
    },
  ],
}
