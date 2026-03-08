import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '@/lib/payloadHooks'

export const About: GlobalConfig = {
  slug: 'about',
  admin: {
    description: 'Manage your About section content - your bio, photo, and key highlights.',
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
      name: 'bio',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Your professional biography - use rich text formatting for paragraphs and emphasis',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo displayed in the About section',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: 'Key specialties or focus areas displayed as badges',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: "Short highlight text (e.g., 'TypeScript', 'React', 'Cloud Architecture')",
          },
        },
      ],
    },
  ],
}
