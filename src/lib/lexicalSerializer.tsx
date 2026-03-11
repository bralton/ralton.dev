/**
 * Lexical Rich Text Serializer
 *
 * Server component that renders Payload Lexical content to React.
 * Provides custom handling for code blocks with Shiki syntax highlighting.
 *
 * Features:
 * - Build-time syntax highlighting for code blocks
 * - Dark theme prose styling with Tailwind typography
 * - Handles text, paragraph, heading, list, link, image, quote nodes
 * - Accessible semantic HTML output
 */

import { Fragment, type JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import type { Media } from '@/payload-types'

// Lexical node type definitions
interface SerializedTextNode {
  type: 'text'
  text: string
  format: number
  version: number
}

interface SerializedLinebreakNode {
  type: 'linebreak'
  version: number
}

interface SerializedParagraphNode {
  type: 'paragraph'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: string
  indent: number
  textFormat: number
  version: number
}

interface SerializedHeadingNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: string
  indent: number
  version: number
}

interface SerializedListNode {
  type: 'list'
  listType: 'bullet' | 'number' | 'check'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: string
  indent: number
  start: number
  tag: 'ul' | 'ol'
  version: number
}

interface SerializedListItemNode {
  type: 'listitem'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: string
  indent: number
  value: number
  version: number
}

interface SerializedLinkNode {
  type: 'link'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  fields: {
    url?: string
    linkType?: 'custom' | 'internal'
    newTab?: boolean
    doc?: {
      value: string | number
      relationTo: string
    }
  }
  format: string
  indent: number
  version: number
}

interface SerializedAutoLinkNode {
  type: 'autolink'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  fields: {
    url: string
    linkType?: 'custom' | 'internal'
    newTab?: boolean
  }
  format: string
  indent: number
  version: number
}

interface SerializedQuoteNode {
  type: 'quote'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: string
  indent: number
  version: number
}

interface SerializedUploadNode {
  type: 'upload'
  relationTo: string
  value: Media | number
  fields?: Record<string, unknown>
  version: number
}

interface SerializedHorizontalRuleNode {
  type: 'horizontalrule'
  version: number
}

interface SerializedBlockNode {
  type: 'block'
  fields: {
    blockType: string
    code?: string
    language?: string
    [key: string]: unknown
  }
  format: string
  version: number
}

type SerializedLexicalNode =
  | SerializedTextNode
  | SerializedLinebreakNode
  | SerializedParagraphNode
  | SerializedHeadingNode
  | SerializedListNode
  | SerializedListItemNode
  | SerializedLinkNode
  | SerializedAutoLinkNode
  | SerializedQuoteNode
  | SerializedUploadNode
  | SerializedHorizontalRuleNode
  | SerializedBlockNode

interface LexicalContent {
  root: {
    children: SerializedLexicalNode[] | { type: unknown; version: number; [k: string]: unknown }[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    type: string
    version: number
  }
  [k: string]: unknown
}

// Text format bitmask values (from Lexical)
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

/**
 * Renders formatted text with appropriate HTML tags based on format bitmask.
 */
function renderFormattedText(text: string, format: number): JSX.Element {
  let element: JSX.Element = <>{text}</>

  if (format & IS_CODE) {
    element = (
      <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-teal-400">
        {element}
      </code>
    )
  }
  if (format & IS_BOLD) {
    element = <strong>{element}</strong>
  }
  if (format & IS_ITALIC) {
    element = <em>{element}</em>
  }
  if (format & IS_STRIKETHROUGH) {
    element = <s>{element}</s>
  }
  if (format & IS_UNDERLINE) {
    element = <u>{element}</u>
  }
  if (format & IS_SUBSCRIPT) {
    element = <sub>{element}</sub>
  }
  if (format & IS_SUPERSCRIPT) {
    element = <sup>{element}</sup>
  }

  return element
}

/**
 * Recursively serializes a single Lexical node to JSX.
 */
async function serializeNode(node: SerializedLexicalNode, index: number): Promise<JSX.Element> {
  switch (node.type) {
    case 'text':
      return (
        <Fragment key={index}>{renderFormattedText(node.text, node.format)}</Fragment>
      )

    case 'linebreak':
      return <br key={index} />

    case 'paragraph': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      return <p key={index}>{children}</p>
    }

    case 'heading': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      const Tag = node.tag
      return <Tag key={index}>{children}</Tag>
    }

    case 'list': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={index} role="list">
          {children}
        </Tag>
      )
    }

    case 'listitem': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      return <li key={index}>{children}</li>
    }

    case 'link':
    case 'autolink': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      const url = node.fields?.url || '#'
      const isExternal = url.startsWith('http') || url.startsWith('//')
      const newTab = node.fields?.newTab ?? isExternal

      if (isExternal) {
        return (
          <a
            key={index}
            href={url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className="text-teal-400 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          key={index}
          href={url}
          className="text-teal-400 no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background"
        >
          {children}
        </Link>
      )
    }

    case 'quote': {
      const children = await Promise.all(
        node.children.map((child, i) => serializeNode(child, i))
      )
      return (
        <blockquote
          key={index}
          className="border-l-4 border-teal-700 pl-4 italic text-text-secondary"
        >
          {children}
        </blockquote>
      )
    }

    case 'upload': {
      const media = typeof node.value !== 'number' ? node.value : null
      if (!media?.url) {
        return <Fragment key={index} />
      }
      return (
        <figure key={index} className="my-6">
          <Image
            src={media.url}
            alt={media.alt || 'Blog image'}
            width={media.width || 800}
            height={media.height || 450}
            className="rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </figure>
      )
    }

    case 'horizontalrule':
      return <hr key={index} className="my-8 border-zinc-800" />

    case 'block': {
      // Handle CodeBlock from Payload's premade blocks
      if (node.fields?.blockType === 'code' && typeof node.fields.code === 'string') {
        const language = (node.fields.language as string) || 'text'
        return (
          <CodeBlock key={index} code={node.fields.code} language={language} />
        )
      }
      // Unknown block type
      return <Fragment key={index} />
    }

    default: {
      // Handle unknown node types gracefully
      console.warn(`Unknown Lexical node type: ${(node as { type: string }).type}`)
      return <Fragment key={index} />
    }
  }
}

/**
 * Serializes Lexical editor content to React elements.
 * This is an async server component for build-time code highlighting.
 */
async function serializeNodes(nodes: SerializedLexicalNode[]): Promise<JSX.Element[]> {
  return Promise.all(nodes.map((node, index) => serializeNode(node, index)))
}

interface RichTextProps {
  content: LexicalContent
  className?: string
}

/**
 * Rich Text Serializer Component
 *
 * Renders Payload Lexical JSON content as accessible React elements.
 * Uses build-time Shiki highlighting for code blocks to prevent CLS.
 */
export async function RichText({ content, className = '' }: RichTextProps) {
  // Get the root from content
  const root = content.root

  if (!root?.children || root.children.length === 0) {
    return null
  }

  const serializedContent = await serializeNodes(root.children as SerializedLexicalNode[])

  return (
    <div
      className={`prose prose-invert prose-zinc max-w-none prose-headings:text-foreground prose-p:text-text-secondary prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1 prose-code:text-teal-400 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-900 ${className}`}
    >
      {serializedContent}
    </div>
  )
}
