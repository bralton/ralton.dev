import type { GlobalConfig } from 'payload'

export const GitHubData: GlobalConfig = {
  slug: 'github-data',
  admin: {
    description: 'Cached GitHub contribution data fetched daily via cron job',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      admin: {
        description: 'GitHub username to fetch contributions for',
      },
    },
    {
      name: 'totalContributions',
      type: 'number',
      admin: {
        description: 'Total contributions in the past year',
        readOnly: true,
      },
    },
    {
      name: 'contributionData',
      type: 'json',
      admin: {
        description: 'JSON array of weekly contribution data',
        readOnly: true,
      },
    },
    {
      name: 'lastFetched',
      type: 'date',
      admin: {
        description: 'Timestamp of last successful data fetch',
        readOnly: true,
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],
}
