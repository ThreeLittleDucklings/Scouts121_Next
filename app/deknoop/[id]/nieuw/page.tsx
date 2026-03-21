'use client'

import { useState } from 'react'
import { use } from 'react'
import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

// --- Helpers ---
const formatTime = (time: string) => `${time}:00.000`

const isValidTime = (t: string) => /^\d{2}:\d{2}$/.test(t)

// --- Time Picker ---
function TimePicker({ value, onChange, label }: {
  value: string
  onChange: (val: string) => void
  label: string
}) {
  const [hours, minutes] = value ? value.split(':') : ['', '']

  const handleHours = (h: string) => {
    onChange(`${h}:${minutes || '00'}`)
  }

  const handleMinutes = (m: string) => {
    onChange(`${hours || '00'}:${m}`)
  }

  return (
    <div>
      <label>{label} *</label>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <select
          className={styles.select}
          value={hours || ''}
          onChange={(e) => handleHours(e.target.value)}
        >
          <option value="">uur</option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={String(i).padStart(2, '0')}>
              {String(i).padStart(2, '0')}
            </option>
          ))}
        </select>
        <span>:</span>
        <select
          className={styles.select}
          value={minutes || ''}
          onChange={(e) => handleMinutes(e.target.value)}
        >
          <option value="">min</option>
          {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

// --- Component ---
export default function NieuwKnoopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { token } = useAuth()
  const router = useRouter()

  const [datum, setDatum] = useState('')
  const [startUur, setStartUur] = useState('')
  const [eindUur, setEindUur] = useState('')
  const [knoopEntry, setKnoopEntry] = useState('')
  const [weekendKamp, setWeekendKamp] = useState(false)
  const [einddatum, setEinddatum] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!token) {
      setError('Je bent niet ingelogd')
      return
    }

    if (!datum || !isValidTime(startUur) || !isValidTime(eindUur) || !knoopEntry) {
      setError('Vul alle verplichte velden in')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/knopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            datum,
            startUur: formatTime(startUur),
            eindUur: formatTime(eindUur),
            knoopEntry,
            weekend_kamp: weekendKamp,
            einddatum_nietinvullen: weekendKamp ? einddatum : null,
            tak: id,
          }
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message ?? 'Er is iets misgegaan')
        return
      }

      router.push(`/deknoop/${id}`)
    } catch {
      setError('Er is iets misgegaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="textelement">
      <h1>Nieuwe vergadering toevoegen</h1>
      <div className={styles.form}>
        <label>Datum *</label>
        <input
          className={styles.input}
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
        />

        <TimePicker
          label="Start uur"
          value={startUur}
          onChange={setStartUur}
        />

        <TimePicker
          label="Eind uur"
          value={eindUur}
          onChange={setEindUur}
        />

        <label>Activiteit *</label>
        <textarea
          className={styles.textarea}
          value={knoopEntry}
          onChange={(e) => setKnoopEntry(e.target.value)}
          rows={4}
          placeholder="Wat gaan jullie doen?"
        />

        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="weekendKamp"
            checked={weekendKamp}
            onChange={(e) => setWeekendKamp(e.target.checked)}
          />
          <label htmlFor="weekendKamp">Weekend of kamp</label>
        </div>

        {weekendKamp && (
          <>
            <label>Einddatum</label>
            <input
              className={styles.input}
              type="date"
              value={einddatum}
              onChange={(e) => setEinddatum(e.target.value)}
            />
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Opslaan...' : 'Opslaan'}
        </button>

        <button
          className={styles.cancelButton}
          onClick={() => router.push(`/deknoop/${id}`)}
        >
          Annuleren
        </button>
      </div>
    </div>
  )
}