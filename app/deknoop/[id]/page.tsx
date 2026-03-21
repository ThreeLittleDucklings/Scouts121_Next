'use client'

import { useQuery, gql } from '@apollo/client'
import { isAfter, isBefore, subDays, addDays, format, parseISO } from 'date-fns'
import { use } from 'react'
import Link from 'next/link'
import KnoopNav from '@/components/KnoopNav'
import { useAuth } from '@/components/AuthContext'
import styles from './page.module.css'

// --- Types ---
interface KnoopAttributes {
  knoopEntry: string
  eindUur: string
  startUur: string
  datum: string
  weekend_kamp: boolean
  einddatum_nietinvullen: string | null
}

interface Knoop {
  id: number
  attributes: KnoopAttributes
}

// --- Query ---
const KNOOP = gql`
  query GetKnoop($id: ID!) {
    tak(id: $id) {
      data {
        id
        attributes {
          naam
          knoops(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                knoopEntry
                eindUur
                startUur
                datum
                weekend_kamp
                einddatum_nietinvullen
              }
            }
          }
        }
      }
    }
  }
`

// --- Helpers ---
const formatTimeTo24Hour = (timeString: string | null): string => {
  if (!timeString) return ''
  const timeParts = timeString.split(':')
  if (timeParts.length < 2) return 'Ongeldige tijd'
  const hours = parseInt(timeParts[0], 10)
  const minutes = parseInt(timeParts[1], 10)
  if (isNaN(hours) || isNaN(minutes)) return 'Ongeldige tijd'
  return `${hours}u${minutes < 10 ? `0${minutes}` : minutes}`
}

const formatDateToDDMMYYYY = (dateString: string | null): string => {
  if (!dateString) return ''
  return format(parseISO(dateString), 'dd/MM/yyyy')
}

// --- Component ---
export default function DeKnoopDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()

  const { loading, error, data } = useQuery(KNOOP, {
    variables: { id },
  })

  if (loading) return (
    <div>
      <KnoopNav />
      <div className="textelement knoop">
        <p>Laden...</p>
      </div>
    </div>
  )

  if (error) return (
    <div>
      <KnoopNav />
      <div className="textelement knoop">
        <p>Fout bij ophalen gegevens: {error.message}</p>
      </div>
    </div>
  )

  const naam: string = data.tak?.data?.attributes?.naam ?? 'Onbekende tak'
  const knoops: Knoop[] = data.tak?.data?.attributes?.knoops?.data ?? []

  const today = new Date()
  const last7Days = subDays(today, 7)
  const next30Days = addDays(today, 30)

  const filteredKnoops = knoops
    .filter((knoop) => {
      const knoopDate = new Date(knoop.attributes.datum)
      return isAfter(knoopDate, last7Days) && isBefore(knoopDate, next30Days)
    })
    .sort((a, b) =>
      new Date(a.attributes.datum).getTime() - new Date(b.attributes.datum).getTime()
    )

  return (
    <div>
      <KnoopNav />
      <div className="textelement">
        <h1>{naam}</h1>
        {user && (
          <Link href={`/deknoop/${id}/nieuw`} className={styles.addButton}>
            +
          </Link>
        )}
        {filteredKnoops.length === 0 ? (
          <p>Oeps, er zijn geen toekomstige vergaderingen te vinden</p>
        ) : (
          filteredKnoops.map((knoop) => (
            <div key={knoop.id} className="knoop-card">
              <h2>
                {formatDateToDDMMYYYY(knoop.attributes.datum)}
                {knoop.attributes.weekend_kamp && knoop.attributes.einddatum_nietinvullen && (
                  ` - ${formatDateToDDMMYYYY(knoop.attributes.einddatum_nietinvullen)}`
                )}
              </h2>
              <h3>
                {formatTimeTo24Hour(knoop.attributes.startUur)} -{' '}
                {formatTimeTo24Hour(knoop.attributes.eindUur)}
              </h3>
              <p>{knoop.attributes.knoopEntry}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}