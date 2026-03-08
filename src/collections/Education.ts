import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '@/lib/payloadHooks'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    useAsTitle: 'degree',
    defaultColumns: ['degree', 'institution', 'startDate', 'isVisible'],
    description: 'Education entries displayed on your portfolio',
    livePreview: {
      url: () =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&slug=/`,
    },
  },
  defaultSort: '-startDate',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'institution',
      type: 'text',
      required: true,
      admin: {
        description: 'School, university, or institution name',
      },
    },
    {
      name: 'degree',
      type: 'text',
      required: true,
      admin: {
        description: 'Degree or certification obtained (e.g., B.S. Computer Science)',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'When you started this program',
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'When you completed this program (leave empty if current)',
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Notable achievements, coursework, or activities',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this education entry on the site',
        components: {
          Cell: '/admin/VisibilityCell#VisibilityCell',
        },
      },
    },
  ],
}
