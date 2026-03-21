'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

// --- Types ---
interface EventAttributes {
  title: string
  datum: string
  description: string
  thumbnail: {
    data: {
      id: number
      attributes: { url: string }
    } | null
  }
}

interface Event {
  id: string
  attributes: EventAttributes
}

// --- Upload photo helper ---
const uploadPhoto = async (file: File, token: string): Promise<number | null> => {
  const formData = new FormData()
  formData.append('files', file)

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) return null
  const data = await res.json()
  return data[0]?.id ?? null
}

// --- Event Form ---
function EventForm({ event, token, onSave, onCancel }: {
  event?: Event
  token: string
  onSave: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(event?.attributes.title ?? '')
  const [datum, setDatum] = useState(event?.attributes.datum ?? '')
  const [description, setDescription] = useState(event?.attributes.description ?? '')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    event?.attributes.thumbnail?.data
      ? `${STRAPI_URL}${event.attributes.thumbnail.data.attributes.url}`
      : null
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!title.trim() || !datum || !description.trim()) {
      setError('Titel, datum en beschrijving zijn verplicht')
      return
    }

    setSaving(true)
    setError('')

    try {
      let thumbnailId = event?.attributes.thumbnail?.data?.id ?? null

      if (fotoFile) {
        thumbnailId = await uploadPhoto(fotoFile, token)
        if (!thumbnailId) {
          setError('Foto upload mislukt')
          setSaving(false)
          return
        }
      }

      const body = {
        data: {
          title,
          datum,
          description,
          ...(thumbnailId && { thumbnail: thumbnailId }),
        }
      }

      const url = event
        ? `${STRAPI_URL}/api/events/${event.id}`
        : `${STRAPI_URL}/api/events`

      const res = await fetch(url, {
        method: event ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message ?? 'Er is iets misgegaan')
        return
      }

      onSave()
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.formRow}>
        <label>Titel *</label>
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.formRow}>
        <label>Datum *</label>
        <input
          className={styles.input}
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
        />
      </div>
      <div className={styles.formRow}>
        <label>Beschrijving *</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Beschrijving van het evenement..."
        />
      </div>
      <div className={styles.formRow}>
        <label>Afbeelding</label>
        {fotoPreview && (
          <div className={styles.fotoPreview}>
            <Image
              src={fotoPreview}
              alt="Preview"
              width={200}
              height={120}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className={styles.fileInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={handleSave} disabled={saving}>
          {saving ? 'Opslaan...' : event ? 'Opslaan' : 'Toevoegen'}
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Annuleren
        </button>
      </div>
    </div>
  )
}

// --- Page ---
export default function EventenBeheerPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${STRAPI_URL}/api/events?populate=thumbnail&sort=datum:desc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setEvents(data.data ?? [])
    } catch {
      setError('Fout bij ophalen evenementen')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  const handleDelete = async (id: string) => {
    if (!confirm('Ben je zeker dat je dit evenement wil verwijderen?')) return

    try {
      const res = await fetch(`${STRAPI_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!res.ok) {
        setError('Verwijderen mislukt')
        return
      }

      fetchData()
    } catch {
      setError('Er is iets misgegaan')
    }
  }

  if (loading) return <p>Laden...</p>

  return (
    <div className="textelement">
      <h1>Evenementen beheren</h1>
      {error && <p className={styles.error}>{error}</p>}

      {showNew && (
        <EventForm
          token={token!}
          onSave={() => { setShowNew(false); fetchData() }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {!showNew && (
        <button className={styles.addButton} onClick={() => setShowNew(true)}>
          + Nieuw evenement toevoegen
        </button>
      )}

      <div className={styles.eventList}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventItem}>
            {editingId === event.id ? (
              <EventForm
                event={event}
                token={token!}
                onSave={() => { setEditingId(null); fetchData() }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className={styles.eventRow}>
                <div className={styles.eventLeft}>
                  {event.attributes.thumbnail?.data && (
                    <Image
                      src={`${STRAPI_URL}${event.attributes.thumbnail.data.attributes.url}`}
                      alt={event.attributes.title}
                      width={80}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                  <div className={styles.eventInfo}>
                    <strong>{event.attributes.title}</strong>
                    <span>{event.attributes.datum}</span>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.editBtn} onClick={() => setEditingId(event.id)}>✏️</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(event.id)}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={styles.backButton} onClick={() => router.back()}>
        Terug
      </button>
    </div>
  )
}