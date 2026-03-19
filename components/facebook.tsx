'use client'

import { useEffect } from 'react'
import styles from './facebook.module.css'

declare global {
  interface Window {
    FB?: {
      init: (options: { xfbml: boolean; version: string }) => void
      XFBML: { parse: () => void }
    }
  }
}

export default function Facebook() {
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      if (window.FB) window.FB.XFBML.parse()
      return
    }

    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/nl_NL/sdk.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      window.FB?.init({ xfbml: true, version: 'v20.0' })
      window.FB?.XFBML.parse()
    }

    return () => {
      document.getElementById('facebook-jssdk')?.remove()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div
          className="fb-page"
          data-href="https://www.facebook.com/scouts121OudeGod"
          data-tabs="timeline"
          data-width="500"
          data-height="600"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
          style={{ width: '100%', height: '100%' }}
        >
          <blockquote
            cite="https://www.facebook.com/scouts121OudeGod"
            className="fb-xfbml-parse-ignore"
            style={{ width: '100%', height: '100%', margin: 0 }}
          >
            <a href="https://www.facebook.com/scouts121OudeGod">Scouts 121</a>
          </blockquote>
        </div>
      </div>
    </div>
  )
}