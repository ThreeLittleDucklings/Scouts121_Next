import type { Metadata } from 'next'
import KnoopNav from '@/components/KnoopNav'

export const metadata: Metadata = {
  title: 'De Knoop | Scouts 121 Oude-God Mortsel',
  description: 'Wat staat er allemaal te gebeuren deze maand?...',
}

export default function DeKnoopPage() {
  return (
    <div>
      <KnoopNav />
      <div className="textelement knoop">
        <p>Selecteer een tak om het programma te bekijken.</p>
      </div>
    </div>
  )
}