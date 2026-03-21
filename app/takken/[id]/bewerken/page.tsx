'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useQuery, gql } from '@apollo/client'
import styles from './page.module.css'

const GET_TAK = gql`
  query GetTak($id: ID!) {
    tak(id: $id) {
      data {
        id
        attributes {
          naam
          description
        }
      }
    }
  }
`

export default function BewerkTakPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { token } = useAuth()
  const router = useRouter()
  const { data, loading } = useQuery(GET_TAK, { variables: { id } })

  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (data) {
      setDescription(data.tak.data.attributes.description ?? '')
    }
  }, [data])

  const handleSubmit = async () => {
    if (!token) {
      setError('Je bent niet ingelogd')
      return
    }
    if (!description.trim()) {
      setError('Beschrijving mag niet leeg zijn')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/takken/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { description }
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message ?? 'Er is iets misgegaan')
        return
      }

      router.push(`/takken/${id}`)
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Laden...</p>

  return (
    <div className="textelement">
      <h1>Beschrijving bewerken</h1>
      <h2>{data?.tak?.data?.attributes?.naam}</h2>
      <div className={styles.form}>
        <label>Beschrijving *</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={12}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} onClick={handleSubmit} disabled={saving}>
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
        <button className={styles.cancelButton} onClick={() => router.push(`/takken/${id}`)}>
          Annuleren
        </button>
      </div>
    </div>
  )
}