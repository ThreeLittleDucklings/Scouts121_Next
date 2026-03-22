'use client'

import { use } from 'react'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import styles from './page.module.css'
import { renderMarkdownText } from '@/lib/renderMarkdownText'
// --- Types ---
interface EventAttributes {
  title: string
  datum: string
  description: string
  thumbnail: {
    data: {
      attributes: { url: string }
    } | null
  }
}

// --- Query ---
const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      data {
        id
        attributes {
          title
          datum
          description
          thumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

// --- Helpers ---
// Renders a line with markdown links converted to <a> tags
const renderLine = (line: string, i: number) => (
  <p key={i}>{renderMarkdownText(line)}</p>
)

// --- Page ---
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { loading, error, data } = useQuery(GET_EVENT, { variables: { id } })

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen evenement</p>

  const event = data.event.data.attributes

  const paragraphs = event.description
    .split('\n')
    .filter((line: string) => line.trim() !== '')

  return (
    <div className="textelement">
      <div className={styles.header}>
        {event.thumbnail?.data && (
          <Image
            src={`${STRAPI_URL}${event.thumbnail.data.attributes.url}`}
            alt={event.title}
            width={0}
            height={0}
            sizes="100vw"
            className={styles.image}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        <div className={styles.dateBadge}>
          <p>{format(parseISO(event.datum), 'MMM')}</p>
          <h2>{format(parseISO(event.datum), 'd')}</h2>
          <p>{format(parseISO(event.datum), 'yyyy')}</p>
        </div>
      </div>
      <h1>{event.title}</h1>
      <div className={styles.description}>
        {paragraphs.map((line: string, i: number) => renderLine(line, i))}
      </div>
    </div>
  )
}