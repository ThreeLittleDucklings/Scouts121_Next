'use client'

import styles from './instagram.module.css'

export default function InstagramEmbed() {
  return (
    <div className={styles.wrapper}>
      <iframe
        src="https://www.instagram.com/scouts121/embed"
        className={styles.frame}
       
        allow="encrypted-media"
        title="Instagram scouts121"
        scrolling="no"
      />
    </div>
  )
}