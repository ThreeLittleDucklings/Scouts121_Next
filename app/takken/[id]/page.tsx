'use client'

import { use } from 'react'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import TakNav from '@/components/TakNav'
import gridStyles from '@/components/Grid.module.css'

// --- Types ---
interface LeidingAttributes {
  naam: string
  totem: string
  bijnaam: string
  ervaring: number
  foto: {
    data: {
      attributes: { url: string }
    } | null
  }
}

interface Leiding {
  id: string
  attributes: LeidingAttributes
}

// --- Queries ---
const GET_TAK = gql`
  query GetTak($id: ID!) {
    tak(id: $id) {
      data {
        id
        attributes {
          naam
          description
        }
      }
    }
  }
`

const GET_LEIDING = gql`
  query GetLeiding($id: ID!) {
    tak(id: $id) {
      data {
        id
        attributes {
          naam
          leidings {
            data {
              id
              attributes {
                naam
                totem
                bijnaam
                ervaring
                foto {
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
      }
    }
  }
`

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

// --- TakInfo subcomponent ---
function TakInfo({ id }: { id: string }) {
  const { loading, error, data } = useQuery(GET_TAK, { variables: { id } })

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen tak info</p>

  const tak = data.tak.data
  const paragraphs = (tak.attributes.description as string)
    .split('\n')
    .filter((line: string) => line.trim() !== '')

  return (
    <div>
      <h1>{tak.attributes.naam}</h1>
      <div className="takinfo">
        {paragraphs.map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

// --- Leiding subcomponent ---
import leidingStyles from '@/components/LeidingCard.module.css'

function Leiding({ id }: { id: string }) {
  const { loading, error, data } = useQuery(GET_LEIDING, { variables: { id } })

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen leiding</p>

  const leidings: Leiding[] = data.tak?.data?.attributes?.leidings?.data ?? []

  if (leidings.length === 0) return <p>Geen leiding gevonden</p>

  return (
    <div className={gridStyles.leidingGrid}>
      {leidings.map((leiding) => (
        <div key={leiding.id} className={leidingStyles.card}>
          <div className={leidingStyles.imageWrapper}>
            {leiding.attributes.foto?.data && (
  <Image
    className={leidingStyles.image}
    src={`${STRAPI_URL}${leiding.attributes.foto.data.attributes.url}`}
    alt={leiding.attributes.naam}
    fill
    sizes="(max-width: 800px) 50vw, 25vw"
    style={{ objectFit: 'cover' }}
  />
)}
          </div>
          <p className={leidingStyles.title}>{leiding.attributes.naam}</p>
          <div className={leidingStyles.info}>
            <h2>{leiding.attributes.naam}</h2>
            <p>Bijnaam: {leiding.attributes.bijnaam}</p>
            <p>Totem: {leiding.attributes.totem}</p>
            <p>
              {leiding.attributes.ervaring}
              {leiding.attributes.ervaring === 1 ? 'ste' : 'de'} jaar leiding
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// --- Page ---
export default function TakPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div>
      <TakNav />
      <div className="textelement">
        <TakInfo id={id} />
      </div>
      <div style={{ maxWidth: '2000px', margin: '0 auto', padding: '0 2vw' }}>
  <Leiding id={id} />
</div>
    </div>
  )
}