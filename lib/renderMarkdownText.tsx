import React from 'react'

// Renders a line of text with markdown links converted to <a> tags
export const renderMarkdownText = (text: string) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g)
  return parts.map((part, j) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/)
    if (match) {
      return (
        <a key={j} href={match[2]} target="_blank" rel="noopener noreferrer" className="orange">
          {match[1]}
        </a>
      )
    }
    return <span key={j}>{part}</span>
  })
}