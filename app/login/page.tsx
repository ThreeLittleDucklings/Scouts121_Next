'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const success = await login(identifier, password)
    if (success) {
      router.push('/')
    } else {
      setError('Ongeldig e-mailadres of wachtwoord')
    }
    setLoading(false)
  }

return (
  <div className="textelement">
    <h1>Login voor leiding</h1>
    <div className={styles.form}>
      <input
        className={styles.input}
        type="email"
        placeholder="E-mailadres"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button
        className={styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Laden...' : 'Inloggen'}
      </button>
      <a
        href="https://api.scouts121.be/admin"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.strapiLink}
      >
        Naar Strapi admin →
      </a>
    </div>
  </div>
)
}