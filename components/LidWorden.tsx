'use client'

import { useQuery, gql } from '@apollo/client'
import { renderRichText, RichTextBlock } from '@/lib/renderRichText'
import Link from 'next/link'

function getCurrentSchoolYear(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

const GET_PAGE = gql`
  query {
    page(id: 2) {
      data {
        id
        attributes {
          text
          inschrijvingenOpen
        }
      }
    }
  }
`

export default function LidWorden() {
  const { data, loading, error } = useQuery(GET_PAGE)

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen inhoud</p>

  const blocks: RichTextBlock[] = data?.page?.data?.attributes?.text ?? []
  const inschrijvingenOpen: boolean = data?.page?.data?.attributes?.inschrijvingenOpen ?? false

  return (
    <div className="textelement">
      <h2>{getCurrentSchoolYear()}</h2>
      {inschrijvingenOpen && (
        <Link href="/inschrijven" className="orange" style={{ display: 'inline-block', marginBottom: '1rem', fontWeight: 'bold' }}>
          → Inschrijven
        </Link>
      )}
      {renderRichText(blocks, inschrijvingenOpen)}
    </div>
  )
}