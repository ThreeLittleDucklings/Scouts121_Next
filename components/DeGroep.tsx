'use client'

import { useQuery, gql } from '@apollo/client'
import { renderRichText, RichTextBlock } from '@/lib/renderRichText'

const GET_PAGE = gql`
  query {
    page(id: 1) {
      data {
        id
        attributes {
          text
        }
      }
    }
  }
`

export default function DeGroep() {
  const { data, loading, error } = useQuery(GET_PAGE)

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen inhoud</p>

 const blocks: RichTextBlock[] = data?.page?.data?.attributes?.text ?? []
console.log('blocks:', JSON.stringify(blocks, null, 2))

  return (
    <div className="textelement">
      {renderRichText(blocks)}
    </div>
  )
}