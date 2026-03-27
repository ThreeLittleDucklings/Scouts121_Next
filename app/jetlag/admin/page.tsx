'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'
const ADMIN_PASSWORD = 'scouts121admin'

interface Team {
  id: string
  attributes: { name: string; color: string }
}

interface Sector {
  id: string
  attributes: {
    sectorId: number
    name: string
    task: string
    status: 'unclaimed' | 'claimed' | 'locked'
    jetlagteam: { data: Team | null }
    lockedByTeam: { data: Team | null }
  }
}

interface Submission {
  id: string
  attributes: {
    type: 'task' | 'steal'
    status: 'pending' | 'approved' | 'rejected'
    sector: { data: Sector | null }
    team: { data: Team | null }
    createdAt: string
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [sectors, setSectors] = useState<Sector[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    const [sRes, tRes, subRes] = await Promise.all([
      fetch(`${STRAPI_URL}/api/jetlagsectors?populate=*`),
      fetch(`${STRAPI_URL}/api/jetlagteams`),
      fetch(`${STRAPI_URL}/api/jetlagsubmissions?populate=*&filters[status][$eq]=pending&sort=createdAt:asc`)
    ])
    const sData = await sRes.json()
    const tData = await tRes.json()
    const subData = await subRes.json()
    setSectors(sData.data ?? [])
    setTeams(tData.data ?? [])
    setSubmissions(subData.data ?? [])
  }

  useEffect(() => {
    if (authed) fetchData()
  }, [authed])

  // Approve a task submission → lock zone for that team
  const handleApproveTask = async (sub: Submission) => {
    if (!sub.attributes.sector?.data || !sub.attributes.team?.data) return
    setLoading(true)
    try {
      await Promise.all([
        // Lock the sector
        fetch(`${STRAPI_URL}/api/jetlagsectors/${sub.attributes.sector.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: {
            status: 'locked',
            lockedByTeam: parseInt(sub.attributes.team.data.id)
          }})
        }),
        // Mark submission approved
        fetch(`${STRAPI_URL}/api/jetlagsubmissions/${sub.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { status: 'approved' }})
        }),
        // Reject all other pending submissions for this sector
        ...submissions
          .filter(s => s.attributes.sector?.data?.id === sub.attributes.sector?.data?.id && s.id !== sub.id)
          .map(s => fetch(`${STRAPI_URL}/api/jetlagsubmissions/${s.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { status: 'rejected' }})
          }))
      ])
      setMessage(`Zone ${sub.attributes.sector.data.attributes.name} vergrendeld voor ${sub.attributes.team.data.attributes.name}!`)
      fetchData()
    } catch {
      setMessage('Fout bij goedkeuren')
    } finally {
      setLoading(false)
    }
  }

  // Approve a steal submission → transfer claim AND lock for stealing team
  const handleApproveSteal = async (sub: Submission) => {
    if (!sub.attributes.sector?.data || !sub.attributes.team?.data) return
    setLoading(true)
    try {
      await Promise.all([
        // Transfer claim and lock in one go
        fetch(`${STRAPI_URL}/api/jetlagsectors/${sub.attributes.sector.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: {
            status: 'locked',
            jetlagteam: parseInt(sub.attributes.team.data.id),
            lockedByTeam: parseInt(sub.attributes.team.data.id)
          }})
        }),
        // Mark submission approved
        fetch(`${STRAPI_URL}/api/jetlagsubmissions/${sub.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { status: 'approved' }})
        }),
        // Reject all other pending submissions for this sector
        ...submissions
          .filter(s => s.attributes.sector?.data?.id === sub.attributes.sector?.data?.id && s.id !== sub.id)
          .map(s => fetch(`${STRAPI_URL}/api/jetlagsubmissions/${s.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { status: 'rejected' }})
          }))
      ])
      setMessage(`Zone ${sub.attributes.sector.data.attributes.name} gestolen en vergrendeld door ${sub.attributes.team.data.attributes.name}!`)
      fetchData()
    } catch {
      setMessage('Fout bij goedkeuren')
    } finally {
      setLoading(false)
    }
  }

  // Reject a submission — zone stays as-is
  const handleReject = async (sub: Submission) => {
    setLoading(true)
    try {
      await fetch(`${STRAPI_URL}/api/jetlagsubmissions/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status: 'rejected' }})
      })
      setMessage(`Inzending afgewezen voor zone ${sub.attributes.sector?.data?.attributes.name}`)
      fetchData()
    } catch {
      setMessage('Fout bij afwijzen')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (sector: Sector) => {
    if (!confirm(`Reset zone ${sector.attributes.name}?`)) return
    setLoading(true)
    try {
      await fetch(`${STRAPI_URL}/api/jetlagsectors/${sector.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status: 'unclaimed', jetlagteam: null, lockedByTeam: null } })
      })
      setMessage(`Zone ${sector.attributes.name} gereset`)
      fetchData()
    } catch {
      setMessage('Fout bij resetten')
    } finally {
      setLoading(false)
    }
  }

  const handleResetAll = async () => {
    if (!confirm('Reset ALLE zones? Dit kan niet ongedaan worden.')) return
    setLoading(true)
    try {
      await Promise.all(sectors.map(s =>
        fetch(`${STRAPI_URL}/api/jetlagsectors/${s.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { status: 'unclaimed', jetlagteam: null, lockedByTeam: null } })
        })
      ))
      setMessage('Alle zones gereset!')
      fetchData()
    } catch {
      setMessage('Fout bij resetten')
    } finally {
      setLoading(false)
    }
  }

  if (!authed) return (
    <div className={styles.login}>
      <h1>Admin Panel</h1>
      <input
        className={styles.input}
        type="password"
        placeholder="Admin wachtwoord"
        value={adminPass}
        onChange={e => setAdminPass(e.target.value)}
      />
      <button
        className={styles.button}
        onClick={() => adminPass === ADMIN_PASSWORD ? setAuthed(true) : alert('Verkeerd wachtwoord')}
      >
        Inloggen
      </button>
    </div>
  )

  const unclaimed = sectors.filter(s => s.attributes.status === 'unclaimed')
  const claimed = sectors.filter(s => s.attributes.status === 'claimed')
  const locked = sectors.filter(s => s.attributes.status === 'locked')
  const taskSubmissions = submissions.filter(s => s.attributes.type === 'task')
  const stealSubmissions = submissions.filter(s => s.attributes.type === 'steal')

  return (
    <div className={styles.admin}>
      <div className={styles.adminHeader}>
        <h1>🎮 Jetlag Admin</h1>
        <div className={styles.stats}>
          <span className={styles.stat}>🔵 {unclaimed.length}</span>
          <span className={styles.stat}>🟡 {claimed.length}</span>
          <span className={styles.stat}>⏳ {taskSubmissions.length}</span>
          <span className={styles.stat}>⚔️ {stealSubmissions.length}</span>
          <span className={styles.stat}>🔒 {locked.length}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={fetchData}>↻ Vernieuwen</button>
          <button className={styles.resetAllBtn} onClick={handleResetAll}>🗑️ Alles resetten</button>
        </div>
      </div>

      {message && <div className={styles.message} onClick={() => setMessage('')}>{message}</div>}

      {/* Teams overview */}
      <div className={styles.section}>
        <h2>Teams</h2>
        <div className={styles.teamGrid}>
          {teams.map(t => (
            <div key={t.id} className={styles.teamCard} style={{ borderColor: (t.attributes as any).color }}>
              <div className={styles.teamDot} style={{ background: (t.attributes as any).color }} />
              <span>{t.attributes.name}</span>
              <span className={styles.teamScore}>
                🔒 {locked.filter(s => s.attributes.lockedByTeam?.data?.id === t.id).length} zones
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Task submissions */}
      <div className={styles.section}>
        <h2>⏳ Taakinzendingen ({taskSubmissions.length})</h2>
        <p className={styles.hint}>Teams die bewijs hebben ingediend om hun zone te vergrendelen. Meerdere teams kunnen tegelijk bewijs indienen voor dezelfde zone.</p>
        {taskSubmissions.length === 0 && <p className={styles.empty}>Geen taakinzendingen</p>}
        {taskSubmissions.map(sub => (
          <div key={sub.id} className={styles.sectorCard} data-status="claimed">
            <div className={styles.sectorInfo}>
              <strong>Zone {sub.attributes.sector?.data?.attributes.name}</strong>
              <span>Team: <b style={{ color: sub.attributes.team?.data?.attributes.color }}>
                {sub.attributes.team?.data?.attributes.name ?? 'onbekend'}
              </b></span>
              <span className={styles.timestamp}>
                {new Date(sub.attributes.createdAt).toLocaleTimeString('nl-BE')}
              </span>
              <p className={styles.task}>{sub.attributes.sector?.data?.attributes.task}</p>
            </div>
            <div className={styles.sectorActions}>
              <button className={styles.lockBtn} onClick={() => handleApproveTask(sub)} disabled={loading}>🔒 Goedkeuren</button>
              <button className={styles.resetBtn} onClick={() => handleReject(sub)} disabled={loading}>❌ Afwijzen</button>
            </div>
          </div>
        ))}
      </div>

      {/* Steal submissions */}
      <div className={styles.section}>
        <h2>⚔️ Steelpogingen ({stealSubmissions.length})</h2>
        <p className={styles.hint}>Teams die een zone willen stelen. Goedkeuren draagt de zone over én vergrendelt hem meteen.</p>
        {stealSubmissions.length === 0 && <p className={styles.empty}>Geen steelpogingen</p>}
        {stealSubmissions.map(sub => (
          <div key={sub.id} className={styles.sectorCard} data-status="claimed">
            <div className={styles.sectorInfo}>
              <strong>Zone {sub.attributes.sector?.data?.attributes.name}</strong>
              <span>Huidig: <b style={{ color: sub.attributes.sector?.data?.attributes.jetlagteam?.data?.attributes.color }}>
                {sub.attributes.sector?.data?.attributes.jetlagteam?.data?.attributes.name ?? 'onbekend'}
              </b></span>
              <span>Steelt: <b style={{ color: sub.attributes.team?.data?.attributes.color }}>
                {sub.attributes.team?.data?.attributes.name ?? 'onbekend'}
              </b></span>
              <span className={styles.timestamp}>
                {new Date(sub.attributes.createdAt).toLocaleTimeString('nl-BE')}
              </span>
              <p className={styles.task}>{sub.attributes.sector?.data?.attributes.task}</p>
            </div>
            <div className={styles.sectorActions}>
              <button className={styles.lockBtn} onClick={() => handleApproveSteal(sub)} disabled={loading}>✅ Goedkeuren</button>
              <button className={styles.resetBtn} onClick={() => handleReject(sub)} disabled={loading}>❌ Afwijzen</button>
            </div>
          </div>
        ))}
      </div>

      {/* Claimed zones */}
      <div className={styles.section}>
        <h2>🟡 Geclaimde zones ({claimed.length})</h2>
        {claimed.length === 0 && <p className={styles.empty}>Geen geclaimde zones</p>}
        {claimed.map(sector => (
          <div key={sector.id} className={styles.sectorCard} data-status="claimed">
            <div className={styles.sectorInfo}>
              <strong>{sector.attributes.name}</strong>
              <span>Geclaimd door: <b style={{ color: sector.attributes.jetlagteam?.data?.attributes.color }}>
                {sector.attributes.jetlagteam?.data?.attributes.name ?? 'onbekend'}
              </b></span>
            </div>
            <button className={styles.resetBtn} onClick={() => handleReset(sector)} disabled={loading}>↩️ Reset</button>
          </div>
        ))}
      </div>

      {/* Locked zones */}
      <div className={styles.section}>
        <h2>🔒 Vergrendelde zones ({locked.length})</h2>
        {locked.length === 0 && <p className={styles.empty}>Nog geen vergrendelde zones</p>}
{locked.map(sector => (
  <div key={sector.id} className={styles.sectorCard} data-status="locked">
    <div className={styles.sectorInfo}>
      <strong>{sector.attributes.name}</strong>
      <span>Vergrendeld door: <b style={{ color: (sector.attributes.lockedByTeam?.data as any)?.attributes?.color ?? '#666' }}>
        {(sector.attributes.lockedByTeam?.data as any)?.attributes?.name ?? 'onbekend'}
      </b></span>
    </div>
    <button className={styles.resetBtn} onClick={() => handleReset(sector)} disabled={loading}>↩️ Reset</button>
  </div>
))}
      </div>

      {/* Unclaimed zones */}
      <div className={styles.section}>
        <h2>🔵 Onbezette zones ({unclaimed.length})</h2>
        {unclaimed.map(sector => (
          <div key={sector.id} className={styles.sectorCard} data-status="unclaimed">
            <div className={styles.sectorInfo}>
              <strong>{sector.attributes.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}