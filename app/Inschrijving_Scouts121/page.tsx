import type { Metadata } from 'next'
import LidWorden from '@/components/LidWorden'

export const metadata: Metadata = {
  title: 'Lid Worden | Scouts 121 Oude-God Mortsel',
  description: 'Inschrijvingen voor Scouts 121 Oude-God Mortsel',
}

export default function LidWordenPage() {
  return <LidWorden />
}