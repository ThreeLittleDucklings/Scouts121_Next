import React from 'react'

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
      <a key={j} href={child.url} target="_blank" rel="noopener noreferrer">
        {child.children?.map((c, k) => <span key={k}>{c.text}</span>)}
      </a>
    )
  }
  return <span key={j}>{child.text}</span>
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

export const renderRichText = (blocks: RichTextBlock[]) => {
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
    const children = block.children.map((child, j) => renderChild(child, j))

    switch (block.type) {
      case 'heading':
        const Tag = `h${block.level ?? 2}` as React.ElementType
        return <Tag key={i}>{children}</Tag>
      case 'paragraph':
        return <p key={i}>{children}</p>
      default:
        return null
    }
  })
}