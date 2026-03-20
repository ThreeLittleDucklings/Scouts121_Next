'use client'

import { useQuery, gql } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import gridStyles from '@/components/Grid.module.css'

interface TakAttributes {
  naam: string
  numberID: number
  actief: boolean
  logo: {
    data: {
      id: number
      attributes: { url: string }
    } | null
  }
}

interface Tak {
  id: string
  attributes: TakAttributes
}

const TAKKEN = gql`
  query GetTakken {
    takken {
      data {
        id
        attributes {
          naam
          numberID
          actief
          logo {
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

export default function TakkenEnLeiding() {
  const { loading, error, data } = useQuery(TAKKEN)

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen takken</p>

  const sortedTakken = (data.takken.data as Tak[])
    .filter((tak) => tak.attributes.actief)
    .sort((a, b) => a.attributes.numberID - b.attributes.numberID)

  return (
    <div className={gridStyles.masterGrid}>
      {sortedTakken.map((tak) => (
        <div className={gridStyles.takCard} key={tak.id}>
          {tak.attributes.logo?.data && (
            <Image
              src={`${STRAPI_URL}${tak.attributes.logo.data.attributes.url}`}
              alt={tak.attributes.naam}
              width={0}
              height={0}
              sizes="100vw"
              
            />
          )}
          <Link className="link" href={`/takken/${tak.id}`}>
            <h2>{tak.attributes.naam}</h2>
          </Link>
        </div>
      ))}
    </div>
  )
}