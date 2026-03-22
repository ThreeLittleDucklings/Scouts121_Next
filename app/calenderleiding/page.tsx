'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './page.module.css'

export default function CalendarPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return <p>Laden...</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Kalender leiding</h1>
      <div className={styles.calendarWrapper}>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=c_uhnibhkcefkai53o8brdk6bdvg%40group.calendar.google.com&ctz=Europe%2FBrussels"
          className={styles.calendar}
          frameBorder={0}
          scrolling="no"
          title="Kalender leiding"
        />
      </div>
    </div>
  )
}