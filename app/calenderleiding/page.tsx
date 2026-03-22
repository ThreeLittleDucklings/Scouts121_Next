'use client'


import styles from './page.module.css'

import AuthGuard from '@/components/AuthGuard'

export default function CalendarPage() {
  return (
    <AuthGuard>
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
    </AuthGuard>
  )
}