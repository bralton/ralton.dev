import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/payloadHooks'

export const Hero: GlobalConfig = {
  slug: 'hero',
  admin: {
    description: 'Configure your portfolio hero section content - the first thing visitors see.',
    livePreview: {
      url: () =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&slug=/`,
    },
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Your full name displayed prominently in the hero section',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: "Your professional title or role (e.g., 'Senior Software Engineer')",
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A brief one-liner about what you do or your expertise',
      },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      admin: {
        description: "Call-to-action buttons below your intro (e.g., 'Contact Me', 'View Resume')",
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Button text displayed to visitors',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description:
              'Link destination (use # for section anchors, / for pages, https:// for external)',
          },
        },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          defaultValue: 'primary',
          required: true,
          admin: {
            description: 'Visual style of the button',
          },
        },
      ],
    },
  ],
}
