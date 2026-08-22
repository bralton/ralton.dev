import type { CollectionConfig } from 'payload'
import { revalidateProjectAfterChange, revalidateProjectAfterDelete } from '@/lib/payloadHooks'
import { createSlugHook } from '@/lib/slugify'

/** Link types a project can expose. Labels are rendered on the project card. */
export const PROJECT_LINK_TYPES = [
  { label: 'GitHub', value: 'github' },
  { label: 'Live site', value: 'live' },
  { label: 'App Store', value: 'appStore' },
  { label: 'Google Play', value: 'googlePlay' },
  { label: 'Other', value: 'other' },
] as const

export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number]['value']

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'techStack', 'isVisible'],
    description: 'Portfolio projects displayed on your site',
    livePreview: {
      url: () =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&slug=/`,
    },
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [revalidateProjectAfterChange],
    afterDelete: [revalidateProjectAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project name or title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title). Used for sub-pages.',
      },
      hooks: {
        beforeValidate: [createSlugHook('title')],
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed description of the project and your role',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      admin: {
        description: 'Technologies used in this project',
      },
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
          admin: {
            description: 'Technology name (e.g., React, TypeScript, Node.js)',
          },
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        description:
          'External links shown on the project card (GitHub, live site, app stores, etc.)',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'github',
              options: [...PROJECT_LINK_TYPES],
              admin: { width: '30%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '70%' },
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Custom link text (only used for "Other"; defaults to the type label)',
            condition: (_data, siblingData) => siblingData?.type === 'other',
          },
        },
      ],
    },
    {
      name: 'privacyPolicy',
      type: 'richText',
      admin: {
        description:
          'Optional privacy policy for this project (e.g. a mobile app). When set, it is published at /projects/<slug>/privacy and linked from the card.',
      },
    },
    {
      name: 'privacyPolicyUpdatedAt',
      type: 'date',
      admin: {
        description: 'Shown as "Last updated" on the privacy policy page',
        condition: (data) => Boolean(data?.privacyPolicy),
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Project screenshot or thumbnail (16:9 aspect ratio recommended)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this project on the site',
        components: {
          Cell: '/admin/VisibilityCell#VisibilityCell',
        },
      },
    },
  ],
}
