import React from 'react'
import Link from 'next/link'

interface RichTextChild {
  text: string
  type: string
  url?: string
  children?: RichTextChild[]
}

export interface RichTextBlock {
  type: 'paragraph' | 'heading' | 'list' | 'list-item'
  level?: number
  format?: 'ordered' | 'unordered'
  children: RichTextChild[]
}

// Renders a single child — handles plain text and links
const renderChild = (child: RichTextChild, j: number) => {
  if (child.type === 'link' && child.url) {
    return (
      <a key={j} href={child.url} target="_blank" rel="noopener noreferrer" className="orange">
        {child.children?.map((c, k) => <span key={k}>{c.text}</span>)}
      </a>
    )
  }
  return <span key={j}>{child.text}</span>
}

// Replaces "hier" with a link in a block's children when sign-up is open
const renderChildrenWithHierLink = (children: RichTextChild[]) => {
  return children.map((child, j) => {
    if (child.type !== 'text' || !child.text.includes('hier op de website online komt')) {
      return renderChild(child, j)
    }
    const parts = child.text.split('hier op de website online komt')
    return (
      <span key={j}>
        {parts[0]}
        <Link href="/inschrijven" className="orange">hier</Link>
        {' op de website online komt'}
        {parts[1]}
      </span>
    )
  })
}

// Renders a paragraph, replacing "hier" with a link if sign-up is open
const renderParagraph = (block: RichTextBlock, i: number, inschrijvingenOpen: boolean) => {
  const fullText = block.children.map(c => c.text ?? '').join('')

  if (inschrijvingenOpen && fullText.includes('hier op de website online komt')) {
    return <p key={i}>{renderChildrenWithHierLink(block.children)}</p>
  }

  return <p key={i}>{block.children.map((child, j) => renderChild(child, j))}</p>
}

// Groups consecutive list blocks of same format into one list
const groupBlocks = (blocks: RichTextBlock[]): (RichTextBlock | RichTextBlock[])[] => {
  const result: (RichTextBlock | RichTextBlock[])[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'list') {
      const group: RichTextBlock[] = [block]
      while (
        i + 1 < blocks.length &&
        blocks[i + 1].type === 'list' &&
        blocks[i + 1].format === block.format
      ) {
        i++
        group.push(blocks[i])
      }
      result.push(group)
    } else {
      result.push(block)
    }
    i++
  }

  return result
}

export const renderRichText = (blocks: RichTextBlock[], inschrijvingenOpen: boolean = false) => {
  const grouped = groupBlocks(blocks)

  return grouped.map((item, i) => {
    // Grouped list
    if (Array.isArray(item)) {
      const format = item[0].format
      const items = item.map((listBlock, j) =>
        listBlock.children.map((child, k) => (
          <li key={`${j}-${k}`}>
            {child.children
              ? child.children.map((c, l) => renderChild(c, l))
              : renderChild(child, k)}
          </li>
        ))
      )
      return format === 'ordered'
        ? <ol key={i}>{items}</ol>
        : <ul key={i}>{items}</ul>
    }

    // Single block
    const block = item as RichTextBlock
    const fullText = block.children.map(c => c.text ?? '').join('')

    switch (block.type) {
      case 'heading':
        const Tag = `h${block.level ?? 2}` as React.ElementType
        if (inschrijvingenOpen && fullText.includes('hier op de website online komt')) {
          return <Tag key={i}>{renderChildrenWithHierLink(block.children)}</Tag>
        }
        return <Tag key={i}>{block.children.map((child, j) => renderChild(child, j))}</Tag>
      case 'paragraph':
        return renderParagraph(block, i, inschrijvingenOpen)
      default:
        return null
    }
  })
}