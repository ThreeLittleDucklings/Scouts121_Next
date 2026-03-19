'use client'

import { useEffect } from 'react'
import styles from './instagram.module.css'

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void }
    }
  }
}

export default function InstagramEmbed() {
  useEffect(() => {
    const processEmbeds = () => {
      if (window.instgrm) window.instgrm.Embeds.process()
    }

    const addInstagramScript = () => {
      if (document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
        processEmbeds()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      script.onload = processEmbeds
      document.body.appendChild(script)
    }

    addInstagramScript()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/scouts121/"
          data-instgrm-version="12"
          style={{ width: '100%', height: '100%', margin: '0' }}
        />
      </div>
    </div>
  )
}