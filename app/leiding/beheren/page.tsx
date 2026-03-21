'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

// --- Types ---
interface Tak {
  id: string
  attributes: { naam: string }
}

interface LeidingAttributes {
  naam: string
  totem: string
  bijnaam: string | null
  ervaring: number
  foto: {
    data: {
      id: number
      attributes: { url: string }
    } | null
  }
  taks: {
    data: Tak[]
  }
}

interface Leiding {
  id: string
  attributes: LeidingAttributes
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

// --- Leiding Form ---
function LeidingForm({ leiding, takken, token, onSave, onCancel }: {
  leiding?: Leiding
  takken: Tak[]
  token: string
  onSave: () => void
  onCancel: () => void
}) {
  const [naam, setNaam] = useState(leiding?.attributes.naam ?? '')
  const [totem, setTotem] = useState(leiding?.attributes.totem ?? '')
  const [bijnaam, setBijnaam] = useState(leiding?.attributes.bijnaam ?? '')
  const [ervaring, setErvaring] = useState(leiding?.attributes.ervaring ?? 1)
  const [selectedTakken, setSelectedTakken] = useState<string[]>(
    leiding?.attributes.taks?.data?.map(t => t.id) ?? []
  )
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    leiding?.attributes.foto?.data
      ? `${STRAPI_URL}${leiding.attributes.foto.data.attributes.url}`
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

  const toggleTak = (takId: string) => {
    setSelectedTakken(prev =>
      prev.includes(takId)
        ? prev.filter(id => id !== takId)
        : [...prev, takId]
    )
  }

  const handleSave = async () => {
    if (!naam.trim() || !totem.trim()) {
      setError('Naam en totem zijn verplicht')
      return
    }

    setSaving(true)
    setError('')

    try {
      let fotoId = leiding?.attributes.foto?.data?.id ?? null

      if (fotoFile) {
        fotoId = await uploadPhoto(fotoFile, token)
        if (!fotoId) {
          setError('Foto upload mislukt')
          setSaving(false)
          return
        }
      }

      const body = {
        data: {
          naam,
          totem,
          bijnaam: bijnaam || null,
          ervaring,
          taks: selectedTakken.map(id => parseInt(id)),
          ...(fotoId && { foto: fotoId }),
        }
      }

      const url = leiding
        ? `${STRAPI_URL}/api/leidingen/${leiding.id}`
        : `${STRAPI_URL}/api/leidingen`

      const res = await fetch(url, {
        method: leiding ? 'PUT' : 'POST',
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
        <label>Naam *</label>
        <input className={styles.input} value={naam} onChange={(e) => setNaam(e.target.value)} />
      </div>
      <div className={styles.formRow}>
        <label>Totem *</label>
        <input className={styles.input} value={totem} onChange={(e) => setTotem(e.target.value)} />
      </div>
      <div className={styles.formRow}>
        <label>Bijnaam</label>
        <input className={styles.input} value={bijnaam} onChange={(e) => setBijnaam(e.target.value)} />
      </div>
      <div className={styles.formRow}>
        <label>Jaar leiding *</label>
        <input
          className={styles.input}
          type="number"
          min={1}
          value={ervaring}
          onChange={(e) => setErvaring(parseInt(e.target.value))}
        />
      </div>

      <div className={styles.formRow}>
        <label>Takken</label>
        <div className={styles.takkenGrid}>
          {takken.map(tak => (
            <label key={tak.id} className={styles.takkenLabel}>
              <input
                type="checkbox"
                checked={selectedTakken.includes(tak.id)}
                onChange={() => toggleTak(tak.id)}
              />
              {tak.attributes.naam}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formRow}>
        <label>Foto</label>
        {fotoPreview && (
          <div className={styles.fotoPreview}>
            <Image
              src={fotoPreview}
              alt="Preview"
              width={100}
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
          {saving ? 'Opslaan...' : leiding ? 'Opslaan' : 'Toevoegen'}
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Annuleren
        </button>
      </div>
    </div>
  )
}

// --- Page ---
export default function LeidingBeheerPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [leidingen, setLeidingen] = useState<Leiding[]>([])
  const [takken, setTakken] = useState<Tak[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [leidingRes, takkenRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/leidingen?populate=foto,taks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${STRAPI_URL}/api/takken?sort=numberID:asc`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ])

      const leidingData = await leidingRes.json()
      const takkenData = await takkenRes.json()

      setLeidingen(leidingData.data ?? [])
      setTakken(takkenData.data ?? [])
    } catch {
      setError('Fout bij ophalen gegevens')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  const handleDelete = async (id: string) => {
    if (!confirm('Ben je zeker dat je deze leiding wil verwijderen?')) return

    try {
      const res = await fetch(`${STRAPI_URL}/api/leidingen/${id}`, {
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
      <h1>Leiding beheren</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.leidingList}>
        {leidingen
          .sort((a, b) => a.attributes.naam.localeCompare(b.attributes.naam))
          .map((leiding) => (
            <div key={leiding.id} className={styles.leidingItem}>
              {editingId === leiding.id ? (
                <LeidingForm
                  leiding={leiding}
                  takken={takken}
                  token={token!}
                  onSave={() => { setEditingId(null); fetchData() }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className={styles.leidingRow}>
                  <div className={styles.leidingLeft}>
                    {leiding.attributes.foto?.data && (
                      <Image
                        src={`${STRAPI_URL}${leiding.attributes.foto.data.attributes.url}`}
                        alt={leiding.attributes.naam}
                        width={60}
                        height={70}
                        style={{ objectFit: 'cover', borderRadius: '6px' }}
                      />
                    )}
                    <div className={styles.leidingInfo}>
                      <strong>{leiding.attributes.naam}</strong>
                      <span>{leiding.attributes.totem}</span>
                      {leiding.attributes.bijnaam && <span>Bijnaam: {leiding.attributes.bijnaam}</span>}
                      <span>{leiding.attributes.ervaring}{leiding.attributes.ervaring === 1 ? 'ste' : 'de'} jaar</span>
                      {leiding.attributes.taks?.data?.length > 0 && (
                        <span className={styles.takkenBadges}>
                          {leiding.attributes.taks.data.map(t => (
                            <span key={t.id} className={styles.badge}>{t.attributes.naam}</span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
                    <button className={styles.editBtn} onClick={() => setEditingId(leiding.id)}>✏️</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(leiding.id)}>🗑️</button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {showNew ? (
        <LeidingForm
          takken={takken}
          token={token!}
          onSave={() => { setShowNew(false); fetchData() }}
          onCancel={() => setShowNew(false)}
        />
      ) : (
        <button className={styles.addButton} onClick={() => setShowNew(true)}>
          + Nieuwe leiding toevoegen
        </button>
      )}

      <button className={styles.backButton} onClick={() => router.back()}>
        Terug
      </button>
    </div>
  )
}