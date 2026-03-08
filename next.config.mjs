import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Next.js Configuration
 *
 * SECURITY NOTES (Story 3.1, NFR8, NFR12):
 * - HTTPS is enforced by Vercel deployment (all traffic redirected to HTTPS)
 * - CSP headers configured to restrict script/style sources
 * - Frame-ancestors set to 'none' to prevent clickjacking
 * - Strict referrer policy for privacy
 * - Admin panel at /admin is NOT publicly linked (see Navigation/Footer components)
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.github.com https://api.resend.com https://*.axiom.co https://*.vercel-insights.com https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
