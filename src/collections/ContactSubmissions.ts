import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    description: 'Contact form submissions from visitors',
    defaultColumns: ['name', 'email', 'submittedAt'],
  },
  access: {
    // Only admins can view submissions
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // API can create
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
      admin: {
        description: 'Name of the person who submitted the form',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address for replies',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 2000,
      admin: {
        description: 'Message content',
      },
    },
    {
      name: 'ip',
      type: 'text',
      admin: {
        description: 'IP address for rate limiting',
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the form was submitted',
        readOnly: true,
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],
}
