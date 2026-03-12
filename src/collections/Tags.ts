import type { CollectionConfig } from 'payload'
import { revalidateBlogAfterChange, revalidateBlogAfterDelete } from '@/lib/payloadHooks'
import { createSlugHook } from '@/lib/slugify'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    description: 'Blog post tags for content tagging',
  },
  defaultSort: 'name',
  hooks: {
    afterChange: [revalidateBlogAfterChange],
    afterDelete: [revalidateBlogAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Tag name displayed on the site',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
      },
      hooks: {
        beforeValidate: [createSlugHook('name')],
      },
    },
  ],
}
