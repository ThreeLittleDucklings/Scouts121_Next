'use client'

import { useQuery, gql } from '@apollo/client'
import Link from 'next/link'
import styles from './TakNavBase.module.css'

interface TakAttributes {
  numberID: number
  actief: boolean
  naam: string
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
          numberID
          actief
          naam
        }
      }
    }
  }
`

export default function TakNavBase({ linkPrefix, excludeId }: {
  linkPrefix: string
  excludeId?: string
}) {
  const { loading, error, data } = useQuery(TAKKEN)

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen takken</p>

  const sortedTakken = (data.takken.data as Tak[])
    .filter((tak) => tak.attributes.actief)
    .filter((tak) => !excludeId || tak.id !== excludeId)
    .sort((a, b) => a.attributes.numberID - b.attributes.numberID)

  return (
    <div className={styles.nav}>
      <ul className={styles.navList}>
        {sortedTakken.map((tak) => (
          <li key={tak.id}>
            <Link href={`/${linkPrefix}/${tak.id}`}>
              {tak.attributes.naam}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}