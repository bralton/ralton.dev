/**
 * Fetches a remote image for the blog MCP server's `upload_image` tool.
 *
 * SECURITY: The URL comes from an MCP client, so this is a server-side request
 * to an address someone else chose. Only https is allowed, every hostname
 * (including each redirect hop) must resolve to public addresses, and the
 * response must be a reasonably sized raster image.
 */

import { lookup } from 'dns/promises'
import { BlockList, isIP } from 'net'

const MAX_BYTES = 10 * 1024 * 1024
const MAX_REDIRECTS = 3
const TIMEOUT_MS = 15_000

/** SVG is deliberately excluded: next/image will not render it. */
const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const blocked = new BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
  ['224.0.0.0', 3],
] as const) {
  blocked.addSubnet(network, prefix, 'ipv4')
}
for (const [network, prefix] of [
  ['::', 127],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  blocked.addSubnet(network, prefix, 'ipv6')
}

function isPublicAddress(address: string): boolean {
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address)
  if (mapped) return !blocked.check(mapped[1], 'ipv4')
  return !blocked.check(address, isIP(address) === 6 ? 'ipv6' : 'ipv4')
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(host)
    ? [host]
    : (await lookup(host, { all: true })).map((entry) => entry.address)

  if (addresses.length === 0 || !addresses.every(isPublicAddress)) {
    throw new Error('That URL does not point at a public address.')
  }
}

export interface FetchedImage {
  data: Buffer
  mimetype: string
  extension: string
}

export async function fetchImage(source: string): Promise<FetchedImage> {
  let url: URL
  try {
    url = new URL(source)
  } catch {
    throw new Error('That is not a valid URL.')
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (url.protocol !== 'https:' || url.username || url.password) {
      throw new Error('Only plain https URLs are allowed.')
    }
    await assertPublicHost(url.hostname)

    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'image/*' },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) throw new Error('The URL redirected without a destination.')
      url = new URL(location, url)
      continue
    }
    if (!response.ok) throw new Error(`The image URL returned HTTP ${response.status}.`)

    const mimetype = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    const extension = EXTENSIONS[mimetype]
    if (!extension) {
      throw new Error(
        `Unsupported image type "${mimetype || 'unknown'}". Use PNG, JPEG, WebP or GIF.`
      )
    }
    if (Number(response.headers.get('content-length') ?? 0) > MAX_BYTES) {
      throw new Error('The image is larger than 10 MB.')
    }

    const chunks: Buffer[] = []
    let size = 0
    const reader = response.body?.getReader()
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) {
        await reader.cancel()
        throw new Error('The image is larger than 10 MB.')
      }
      chunks.push(Buffer.from(value))
    }
    if (size === 0) throw new Error('The image URL returned no data.')

    return { data: Buffer.concat(chunks), mimetype, extension }
  }

  throw new Error('The URL redirected too many times.')
}
