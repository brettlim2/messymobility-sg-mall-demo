import { isNightHour } from './geo'
import { assignPingToStay } from './stays'
import type { Ping, Stay, UserHome } from './types'

/**
 * Section 4.2: Home = most frequent night-time location over study period.
 */
export function detectHomes(
  byUser: Map<string, Ping[]>,
  staysByUser: Record<string, Stay[]>,
  nightStartHour: number,
  nightEndHour: number,
  dd: number,
): Record<string, UserHome> {
  const homes: Record<string, UserHome> = {}

  for (const [adId, pings] of byUser) {
    const stays = staysByUser[adId] ?? []
    const nightCounts = new Map<string, { count: number; lat: number; lng: number; h3: string; city: string }>()

    for (const ping of pings) {
      if (!isNightHour(ping.hourPht, nightStartHour, nightEndHour)) continue
      const locId = assignPingToStay(ping, stays, dd)
      if (!locId) continue
      const stay = stays.find((s) => s.locationId === locId)
      if (!stay) continue
      const entry = nightCounts.get(locId) ?? {
        count: 0,
        lat: stay.lat,
        lng: stay.lng,
        h3: stay.h3,
        city: stay.city,
      }
      entry.count++
      nightCounts.set(locId, entry)
    }

    if (nightCounts.size === 0) {
      const fallback = fallbackHomeFromStays(stays)
      if (fallback) {
        homes[adId] = { adId, ...fallback, nightVisits: 0 }
      }
      continue
    }

    let bestId = ''
    let bestCount = -1
    let bestMeta = { lat: 0, lng: 0, h3: '', city: '' }
    for (const [locId, meta] of nightCounts) {
      if (meta.count > bestCount) {
        bestCount = meta.count
        bestId = locId
        bestMeta = meta
      }
    }

    homes[adId] = {
      adId,
      locationId: bestId,
      lat: bestMeta.lat,
      lng: bestMeta.lng,
      h3: bestMeta.h3,
      city: bestMeta.city,
      nightVisits: bestCount,
    }
  }

  return homes
}

function fallbackHomeFromStays(stays: Stay[]): Omit<UserHome, 'adId' | 'nightVisits'> | null {
  if (stays.length === 0) return null
  const longest = stays.reduce((a, b) => (a.durationMin > b.durationMin ? a : b))
  return {
    locationId: longest.locationId,
    lat: longest.lat,
    lng: longest.lng,
    h3: longest.h3,
    city: longest.city,
  }
}
