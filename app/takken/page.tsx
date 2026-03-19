import type { Metadata } from 'next'
import Takken from '@/components/Takken'

export const metadata: Metadata = {
  title: 'Takken en Leiding | Scouts 121 Oude-God Mortsel',
  description: 'Wat staat er allemaal te gebeuren deze maand?...',
}

export default function TakkenPage() {
  return <Takken />
}