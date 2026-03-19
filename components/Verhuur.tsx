'use client'

import { useQuery, gql } from '@apollo/client'
import Link from 'next/link'
import gridStyles from '@/components/Grid.module.css'

interface VerhuurCategoryAttributes {
  type: string
  beschrijving: string
}

interface VerhuurCategory {
  id: string
  attributes: VerhuurCategoryAttributes
}

const VERHUUR_QUERY = gql`
  query GetVerhuurCategorieen {
    verhuurcategories {
      data {
        id
        attributes {
          type
          beschrijving
        }
      }
    }
  }
`

export default function Verhuur() {
  const { loading, error, data } = useQuery(VERHUUR_QUERY)

  if (loading) return <p>Laden...</p>
  if (error) return <p>Fout bij ophalen verhuur categorieën</p>

  const verhuurCategorieen = data.verhuurcategories.data as VerhuurCategory[]

  return (
  <div className={gridStyles.verhuurGrid}>
    {verhuurCategorieen.map((verhuurcategory) => (
      <div className={gridStyles.verhuurCard} key={verhuurcategory.id}>
        <Link href={`/verhuur/${verhuurcategory.id}`}>
          <h2 className="link">{verhuurcategory.attributes.type}</h2>
        </Link>
        <p>{verhuurcategory.attributes.beschrijving}</p>
      </div>
    ))}
  </div>
)
}