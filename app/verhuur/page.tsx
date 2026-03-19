import type { Metadata } from 'next'
import Verhuur from '@/components/Verhuur'

export const metadata: Metadata = {
  title: 'Verhuur | Scouts 121 Oude-God Mortsel',
  description: 'Wel eens nood gehad aan een hele grote pot die je zelf niet in de kast hebt staan?...',
}

export default function VerhuurPage() {
  return <Verhuur />
}