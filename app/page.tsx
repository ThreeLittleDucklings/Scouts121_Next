'use client'

import { useState } from 'react'
import Instagram from '@/components/instagram'
import SliderWidget from '@/components/sliderWidget/SliderWidget'
import { useAuth } from '@/components/AuthContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function Homepage() {
  const [eventCount, setEventCount] = useState<number | null>(null)
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      {eventCount === 0 ? (
        <div className={styles.instagramFull}>
          {user && (
            <Link href="/evenementen/beheren" className={styles.manageButton}>
              + Evenementen beheren
            </Link>
          )}
          <Instagram />
        </div>
      ) : (
        <div className={styles.top}>
          <div className={eventCount === 1 ? styles.sliderSmall : styles.slider}>
            {user && (
              <Link href="/evenementen/beheren" className={styles.manageButton}>
                + Evenementen beheren
              </Link>
            )}
            <SliderWidget onEventCount={setEventCount} />
          </div>
          <div className={eventCount === 1 ? styles.instagramLarge : styles.instagram}>
            <Instagram />
          </div>
        </div>
      )}
    </div>
  )
}