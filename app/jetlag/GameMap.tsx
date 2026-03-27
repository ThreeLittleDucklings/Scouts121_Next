'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://api.scouts121.be'

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

// Swap [lng, lat] to [lat, lng] for Leaflet
const swapCoords = (bounds: [number, number][]): [number, number][] =>
  bounds.map(([lng, lat]) => [lat, lng])

// Click on map to manually set location (for testing)

const lightenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) + Math.round(255 * percent)
  const g = ((num >> 8) & 0x00FF) + Math.round(255 * percent)
  const b = (num & 0x0000FF) + Math.round(255 * percent)

  return `#${(
    (1 << 24) +
    (Math.min(255, r) << 16) +
    (Math.min(255, g) << 8) +
    Math.min(255, b)
  )
    .toString(16)
    .slice(1)}`
}

const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) * (1 - percent)
  const g = ((num >> 8) & 0x00FF) * (1 - percent)
  const b = (num & 0x0000FF) * (1 - percent)

  return `#${(
    (1 << 24) +
    (Math.round(r) << 16) +
    (Math.round(g) << 8) +
    Math.round(b)
  )
    .toString(16)
    .slice(1)}`
}
// Center map on user position
function MapCenterer({ position }: { position: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 16)
  }, [position, map])
  return null
}

export default function GameMap({ sectors, teams, position, myTeam, onSectorClick}: {
  sectors: Sector[]
  teams: Team[]
  position: [number, number] | null
  myTeam: Team
  onSectorClick: (sector: Sector) => void
  
}) {
const getSectorColor = (sector: Sector) => {
  if (sector.attributes.status === 'locked') {
    const teamData = sector.attributes.lockedByTeam?.data
    const color = (Array.isArray(teamData) ? null : teamData)?.attributes?.color ?? '#888'
    return darkenColor(color, 0.35)
  }
  if (sector.attributes.status === 'claimed') {
    const teamData = sector.attributes.jetlagteam?.data
    const color = (Array.isArray(teamData) ? null : teamData)?.attributes?.color ?? '#ffd700'
    return color
  }
  return '#888'
}

const getSectorOpacity = (sector: Sector) => {
  if (sector.attributes.status === 'locked') return 0.85
  if (sector.attributes.status === 'claimed') return 0.45
  return 0.25
}

  return (
    <MapContainer
      center={[51.132, 4.565]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OSM'
      />

      {/* Manual location setter for testing — click map to move your position */}
    
      <MapCenterer position={position} />

      {/* Sectors */}
      {sectors.map(sector => (
        <Polygon
          key={sector.id}
          positions={swapCoords(sector.attributes.bounds)}
          pathOptions={{
            color: getSectorColor(sector),
            fillColor: getSectorColor(sector),
            fillOpacity: getSectorOpacity(sector),
            weight: 2,
          }}
          eventHandlers={{ click: () => onSectorClick(sector) }}
        />
      ))}

      {/* Your position */}
      {position && (
        <Marker
          position={position}
          icon={L.divIcon({
            className: '',
            html: `<div style="
              width:20px;height:20px;border-radius:50%;
              background:${(myTeam.attributes as any).color ?? '#e63946'};
              border:3px solid white;
              box-shadow:0 0 6px rgba(0,0,0,0.5)
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        />
      )}

      {/* Other teams' positions */}
      {teams
        .filter(t => t.id !== myTeam.id && t.attributes.latitude && t.attributes.longitude)
        .map(t => (
          <Marker
            key={t.id}
            position={[t.attributes.latitude!, t.attributes.longitude!]}
            icon={L.divIcon({
              className: '',
              html: `<div style="
                width:16px;height:16px;border-radius:50%;
                background:${(t.attributes as any).color ?? '#888'};
                border:2px solid white;
                box-shadow:0 0 4px rgba(0,0,0,0.4)
              "></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          />
        ))
      }
    </MapContainer>
  )
}