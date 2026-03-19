import type { Metadata } from 'next'
import DeGroep from '@/components/DeGroep'

export const metadata: Metadata = {
  title: 'De Groep | Scouts 121 Oude-God Mortsel',
  description: 'Scouts 121 bestaat sinds 2014 en is ontstaan uit de fusie van twee oudere scoutsen...',
}

export default function DeGroepPage() {
  return <DeGroep />
}