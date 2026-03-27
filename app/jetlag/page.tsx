'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

const GameMap = dynamic(() => import('./GameMap'), { ssr: false, loading: () => <div className={styles.mapLoading}>Kaart laden...</div> })

interface Team {
  id: string
  attributes: {
    name: string
    color: string
    latitude: number | null
    longitude: number | null
  }
}

interface Sector {
  id: string
  attributes: {
    sectorId: number
    name: string
    task: string
    status: 'unclaimed' | 'claimed' | 'locked'
    bounds: [number, number][]
    jetlagteam: { data: Team | null | Team[] }
    lockedByTeam: { data: Team | null | Team[] }
  }
}

interface Submission {
  id: string
  attributes: {
    type: 'task' | 'steal'
    status: 'pending' | 'approved' | 'rejected'
    sector: { data: Sector | null }
    team: { data: Team | null }
  }
}

// Helper to safely get a single team from a relation that might return array or null
function getTeam(data: Team | null | Team[]): Team | null {
  if (!data) return null
  if (Array.isArray(data)) return data[0] ?? null
  return data
}

function LoginScreen({ onLogin }: { onLogin: (team: Team, token: string) => void }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${STRAPI_URL}/api/jetlagteams?populate=*`)
      const data = await res.json()
      const teams: Team[] = data.data ?? []
      const match = teams.find(
        t => t.attributes.name === name && (t.attributes as any).password === password
      )
      if (match) {
        onLogin(match, '')
      } else {
        setError('Ongeldig team of wachtwoord')
      }
    } catch {
      setError('Fout bij verbinden met server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginScreen}>
      <img src="/img/logo.png" alt="Scouts 121" className={styles.loginLogo} />
      <h1 className={styles.loginTitle}>Jetlag: The Game</h1>
      <div className={styles.loginCard}>
        <h2>Team Login</h2>
        <input
          className={styles.input}
          placeholder="Team naam"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Laden...' : 'Inloggen'}
        </button>
      </div>
    </div>
  )
}

export default function JetlagPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [message, setMessage] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [sectorsRes, teamsRes, subsRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/jetlagsectors?populate=*`),
        fetch(`${STRAPI_URL}/api/jetlagteams`),
        fetch(`${STRAPI_URL}/api/jetlagsubmissions?populate=*&filters[status][$eq]=pending`)
      ])
      const sectorsData = await sectorsRes.json()
      const teamsData = await teamsRes.json()
      const subsData = await subsRes.json()
      setSectors(sectorsData.data ?? [])
      setTeams(teamsData.data ?? [])
      setSubmissions(subsData.data ?? [])
    } catch {
      console.error('Fout bij ophalen data')
    }
  }, [])

  useEffect(() => {
    if (team) {
      fetchData()
      const interval = setInterval(fetchData, 10000)
      return () => clearInterval(interval)
    }
  }, [team, fetchData])

  const updateLocation = useCallback(async (lat: number, lng: number) => {
    if (!team) return
    setPosition([lat, lng])
    await fetch(`${STRAPI_URL}/api/jetlagteams/${team.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { latitude: lat, longitude: lng, lastSeen: new Date().toISOString() } })
    })
  }, [team])

  useEffect(() => {
    if (!team) return
    const watchId = navigator.geolocation.watchPosition(
      pos => updateLocation(pos.coords.latitude, pos.coords.longitude),
      err => console.error('GPS error:', err),
      { enableHighAccuracy: true, maximumAge: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [team, updateLocation])

  const isInsideSector = (pos: [number, number], bounds: [number, number][]) => {
    const [lat, lng] = pos
    let inside = false
    for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
      const [lngI, latI] = bounds[i]
      const [lngJ, latJ] = bounds[j]
      const intersect = ((latI > lat) !== (latJ > lat)) &&
        (lng < (lngJ - lngI) * (lat - latI) / (latJ - latI) + lngI)
      if (intersect) inside = !inside
    }
    return inside
  }

  const canClaim = selectedSector && position &&
    isInsideSector(position, selectedSector.attributes.bounds) &&
    selectedSector.attributes.status === 'unclaimed'

  const canAct = selectedSector && position &&
    isInsideSector(position, selectedSector.attributes.bounds) &&
    selectedSector.attributes.status === 'claimed'

  const myPendingSubmission = selectedSector
    ? submissions.find(s =>
        s.attributes.sector?.data?.id === selectedSector.id &&
        s.attributes.team?.data?.id === team?.id
      )
    : null

  const handleClaim = async () => {
    if (!selectedSector || !team) return
    try {
      await fetch(`${STRAPI_URL}/api/jetlagsectors/${selectedSector.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status: 'claimed', jetlagteam: parseInt(team.id) } })
      })
      setMessage(`Zone ${selectedSector.attributes.name} geclaimd!`)
      setSelectedSector(null)
      fetchData()
    } catch {
      setMessage('Fout bij claimen')
    }
  }

  const handleSubmitTask = async () => {
    if (!selectedSector || !team) return
    try {
      await fetch(`${STRAPI_URL}/api/jetlagsubmissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {
          type: 'task',
          status: 'pending',
          sector: parseInt(selectedSector.id),
          team: parseInt(team.id)
        }})
      })
      setMessage(`Bewijs ingediend voor ${selectedSector.attributes.name}! Stuur je bewijs via WhatsApp.`)
      fetchData()
    } catch {
      setMessage('Fout bij indienen')
    }
  }

  const handleSubmitSteal = async () => {
    if (!selectedSector || !team) return
    try {
      await fetch(`${STRAPI_URL}/api/jetlagsubmissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {
          type: 'steal',
          status: 'pending',
          sector: parseInt(selectedSector.id),
          team: parseInt(team.id)
        }})
      })
      setMessage(`Steelpoging ingediend voor ${selectedSector.attributes.name}! Stuur je bewijs via WhatsApp.`)
      fetchData()
    } catch {
      setMessage('Fout bij steelpoging')
    }
  }

  if (!team) return <LoginScreen onLogin={(t) => setTeam(t)} />

  const myColor = (team.attributes as any).color ?? '#e63946'

  return (
    <div className={styles.game}>
      <div className={styles.header} style={{ backgroundColor: myColor }}>
        <span className={styles.teamName}>{team.attributes.name}</span>
        <span className={styles.teamDot} style={{ backgroundColor: myColor }} />
        <button className={styles.refreshBtn} onClick={fetchData}>↻</button>
      </div>

      <div className={styles.mapWrapper}>
        <GameMap
          sectors={sectors}
          teams={teams}
          position={position}
          myTeam={team}
          onSectorClick={(sector) => setSelectedSector(sector)}
          
        />
      </div>

      {message && (
        <div className={styles.toast} onClick={() => setMessage('')}>
          {message}
        </div>
      )}

      {selectedSector && (() => {
        const ownerTeam = getTeam(selectedSector.attributes.jetlagteam.data)
        const lockedTeam = getTeam(selectedSector.attributes.lockedByTeam.data)
        const isOwner = ownerTeam?.id === team.id

        return (
          <div className={styles.sectorPanel}>
            <button className={styles.closeBtn} onClick={() => setSelectedSector(null)}>✕</button>
            <h2>{selectedSector.attributes.name}</h2>

            <div className={styles.statusBadge} data-status={selectedSector.attributes.status}>
              {selectedSector.attributes.status === 'unclaimed' && '🔵 Onbezet'}
              {selectedSector.attributes.status === 'claimed' && `🟡 Geclaimd door ${ownerTeam?.attributes.name ?? 'onbekend'}`}
              {selectedSector.attributes.status === 'locked' && `🔒 Vergrendeld door ${lockedTeam?.attributes.name ?? 'onbekend'}`}
            </div>

            {/* Unclaimed — claim button */}
            {selectedSector.attributes.status === 'unclaimed' && (
              <div className={styles.actionSection}>
                {canClaim ? (
                  <button className={styles.claimBtn} onClick={handleClaim}>🏴 Zone claimen</button>
                ) : (
                  <p className={styles.hint}>Je moet in de zone zijn om te claimen</p>
                )}
              </div>
            )}

            {/* Claimed — show task */}
            {selectedSector.attributes.status === 'claimed' && (
              <div className={styles.taskSection}>
                <h3>{isOwner ? 'Taak om te vergrendelen:' : '⚔️ Taak om zone te stelen:'}</h3>
                <p className={styles.taskText}>{selectedSector.attributes.task}</p>

                {myPendingSubmission ? (
                  <p className={styles.taskSent}>✅ Bewijs ingediend! Wacht op bevestiging van de admin.</p>
                ) : canAct ? (
                  <button
                    className={styles.taskBtn}
                    onClick={isOwner ? handleSubmitTask : handleSubmitSteal}
                  >
                    📤 Bewijs ingediend
                  </button>
                ) : (
                  <p className={styles.hint}>Je moet in de zone zijn om bewijs in te dienen</p>
                )}
              </div>
            )}

            {/* Locked */}
            {selectedSector.attributes.status === 'locked' && (
              <p className={styles.hint}>🔒 Deze zone is vergrendeld en kan niet meer worden gestolen.</p>
            )}
          </div>
        )
      })()}

      <div className={styles.legend}>
        <div className={styles.legendItem}><span className={styles.dot} style={{background:'#888'}} />Onbezet</div>
        <div className={styles.legendItem}><span className={styles.dot} style={{background:'#ffd700'}} />Geclaimd</div>
        <div className={styles.legendItem}><span className={styles.dot} style={{background:'#2d6a4f'}} />Vergrendeld</div>
      </div>
    </div>
  )
}