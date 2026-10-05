import type { CollectionConfig, FieldAccess } from 'payload'

const never: FieldAccess = () => false

/**
 * MCP Grants - OAuth connections to the blog MCP server (/api/mcp)
 *
 * One document per Claude client the site owner has approved on the
 * /oauth/authorize consent screen. Rows are written only by the OAuth
 * endpoints through the Local API; the admin panel can view and delete them.
 * Deleting a grant revokes that connection immediately.
 *
 * SECURITY: Only SHA-256 hashes of codes and tokens are stored, and they are
 * never returned through the REST/GraphQL APIs.
 */
export const McpGrants: CollectionConfig = {
  slug: 'mcp-grants',
  labels: { singular: 'MCP Connection', plural: 'MCP Connections' },
  admin: {
    useAsTitle: 'clientId',
    defaultColumns: ['clientId', 'redirectUri', 'createdAt', 'updatedAt'],
    description:
      'Claude clients authorised to create and edit blog drafts. Delete a connection to revoke it.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'clientId',
      type: 'text',
      required: true,
      admin: { readOnly: true, description: 'OAuth client that was approved' },
    },
    {
      name: 'redirectUri',
      type: 'text',
      required: true,
      admin: { readOnly: true, description: 'Where the authorisation code was sent' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, description: 'Admin who approved the connection' },
    },
    { name: 'scope', type: 'text', admin: { readOnly: true } },
    {
      name: 'codeHash',
      type: 'text',
      index: true,
      access: { read: never },
      admin: { hidden: true },
    },
    { name: 'codeChallenge', type: 'text', access: { read: never }, admin: { hidden: true } },
    { name: 'codeExpiresAt', type: 'date', admin: { hidden: true } },
    {
      name: 'accessTokenHash',
      type: 'text',
      index: true,
      access: { read: never },
      admin: { hidden: true },
    },
    { name: 'accessTokenExpiresAt', type: 'date', admin: { hidden: true } },
    {
      name: 'refreshTokenHash',
      type: 'text',
      index: true,
      access: { read: never },
      admin: { hidden: true },
    },
    {
      name: 'refreshTokenExpiresAt',
      type: 'date',
      admin: { readOnly: true, description: 'Connection lapses if unused past this date' },
    },
  ],
}
