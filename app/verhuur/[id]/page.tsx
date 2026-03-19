'use client'

import { use } from 'react'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import gridStyles from '@/components/Grid.module.css'

interface VerhuurItemAttributes {
  item: string
  beschrijving: string
  foto: {
    data: {
      attributes: { url: string }
    } | null
  }
}

interface VerhuurItem {
  id: string
  attributes: VerhuurItemAttributes
}

const VERHUUR = gql`
  query GetVerhuurCategory($id: ID!) {
    verhuurcategory(id: $id) {
      data {
        id
        attributes {
          type
          beschrijving
          verhuurs {
            data {
              id
              attributes {
                item
                beschrijving
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

export default function VerhuurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { loading, error, data } = useQuery(VERHUUR, { variables: { id } })

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen verhuur info: {error.message}</p>

  const items: VerhuurItem[] = data.verhuurcategory?.data?.attributes?.verhuurs?.data ?? []

  return (
    <div className={gridStyles.masterGrid}>
      {items.length === 0 ? (
        <p>Geen items beschikbaar</p>
      ) : (
        items.map((verhuur) => (
          <div key={verhuur.id} className={gridStyles.card}>
            <h2>{verhuur.attributes.item}</h2>
            {verhuur.attributes.foto?.data && (
              <Image
                src={`${STRAPI_URL}${verhuur.attributes.foto.data.attributes.url}`}
                alt={verhuur.attributes.item}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            <p>{verhuur.attributes.beschrijving}</p>
          </div>
        ))
      )}
    </div>
  )
}