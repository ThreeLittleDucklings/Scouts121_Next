'use client'

import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import Instagram from '@/components/instagram'
import SliderWidget from '@/components/sliderWidget/SliderWidget'
import styles from './page.module.css'

export default function Homepage() {
  const [eventCount, setEventCount] = useState<number | null>(null)

  return (
    <div className={styles.page}>
      {eventCount === 0 ? (
        <div className={styles.instagramFull}>
          <Instagram />
        </div>
      ) : (
        <div className={styles.top}>
          <div className={
            eventCount === 1
              ? styles.sliderSmall
              : styles.slider
          }>
            <SliderWidget onEventCount={setEventCount} />
          </div>
          <div className={
            eventCount === 1
              ? styles.instagramLarge
              : styles.instagram
          }>
            <Instagram />
          </div>
        </div>
      )}
    </div>
  )
}