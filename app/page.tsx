import type { Metadata } from 'next'
import Instagram from '@/components/instagram'
import Facebook from '@/components/facebook'
import SliderWidget from '@/components/sliderWidget/SliderWidget'
import gridStyles from '@/components/Grid.module.css'

export const metadata: Metadata = {
  title: 'Scouts 121 Oude-God Mortsel',
  description: 'Wat staat er allemaal te gebeuren deze maand?...',
}

export default function Homepage() {
  return (
    <div className={gridStyles.masterGrid}>
      <SliderWidget />
      <Facebook />
      <Instagram />
    </div>
  )
}