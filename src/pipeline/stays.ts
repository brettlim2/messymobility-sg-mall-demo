import { haversineMeters, medoidIndex } from './geo'
import type { Ping, Stay } from './types'

interface ClusterPoint {
  lat: number
  lng: number
  h3: string
  city: string
  start: Date
  end: Date
  pingCount: number
}

/**
 * Section 4.1: Parse trajectories into stay locations.
 * Two-pass spatial clustering with dwell threshold, then agglomerate into unique locations.
 */
export function detectStaysForUser(pings: Ping[], dd: number, dt: number): Stay[] {
  if (pings.length === 0) return []

  const sequential = clusterSequential(pings, dd)
  const withDwell = sequential.filter((c) => {
    const durationMin = (c.end.getTime() - c.start.getTime()) / 60_000
    return durationMin >= dt
  })

  const locations = agglomerateLocations(withDwell, dd)
  return locations.map((loc, idx) => ({
    locationId: `${pings[0].adId}-loc-${idx}`,
    lat: loc.lat,
    lng: loc.lng,
    h3: loc.h3,
    city: loc.city,
    start: loc.start,
    end: loc.end,
    durationMin: (loc.end.getTime() - loc.start.getTime()) / 60_000,
    pingCount: loc.pingCount,
  }))
}

function clusterSequential(pings: Ping[], dd: number): ClusterPoint[] {
  const clusters: ClusterPoint[] = []
  let current: Ping[] = [pings[0]]

  const flush = () => {
    if (current.length === 0) return
    const med = medoidIndex(current)
    const rep = current[med]
    clusters.push({
      lat: rep.lat,
      lng: rep.lng,
      h3: rep.h3,
      city: rep.city,
      start: current[0].timestampUtc,
      end: current[current.length - 1].timestampUtc,
      pingCount: current.length,
    })
    current = []
  }

  for (let i = 1; i < pings.length; i++) {
    const prev = current[current.length - 1]
    const cur = pings[i]
    const dist = haversineMeters(prev.lat, prev.lng, cur.lat, cur.lng)
    if (dist <= dd) {
      current.push(cur)
    } else {
      flush()
      current = [cur]
    }
  }
  flush()
  return clusters
}

function agglomerateLocations(clusters: ClusterPoint[], dd: number): ClusterPoint[] {
  const merged: ClusterPoint[] = []

  for (const cluster of clusters) {
    let found = false
    for (const loc of merged) {
      if (haversineMeters(cluster.lat, cluster.lng, loc.lat, loc.lng) <= dd) {
        loc.lat = (loc.lat * loc.pingCount + cluster.lat * cluster.pingCount) / (loc.pingCount + cluster.pingCount)
        loc.lng = (loc.lng * loc.pingCount + cluster.lng * cluster.pingCount) / (loc.pingCount + cluster.pingCount)
        loc.start = loc.start < cluster.start ? loc.start : cluster.start
        loc.end = loc.end > cluster.end ? loc.end : cluster.end
        loc.pingCount += cluster.pingCount
        if (!loc.h3) loc.h3 = cluster.h3
        if (!loc.city) loc.city = cluster.city
        found = true
        break
      }
    }
    if (!found) merged.push({ ...cluster })
  }

  return merged
}

export function detectStaysForAllUsers(
  byUser: Map<string, Ping[]>,
  dd: number,
  dt: number,
): Record<string, Stay[]> {
  const result: Record<string, Stay[]> = {}
  for (const [adId, pings] of byUser) {
    result[adId] = detectStaysForUser(pings, dd, dt)
  }
  return result
}

/** Map a ping to nearest stay location within dd meters */
export function assignPingToStay(ping: Ping, stays: Stay[], dd: number): string | null {
  let best: Stay | null = null
  let bestDist = Infinity
  for (const stay of stays) {
    const d = haversineMeters(ping.lat, ping.lng, stay.lat, stay.lng)
    if (d <= dd && d < bestDist) {
      bestDist = d
      best = stay
    }
  }
  return best?.locationId ?? null
}

/** Build ordered stay sequence for a user-day from pings */
export function buildDayStaySequence(
  dayPings: Ping[],
  stays: Stay[],
  dd: number,
): string[] {
  const sequence: string[] = []
  let last: string | null = null
  for (const ping of dayPings) {
    const loc = assignPingToStay(ping, stays, dd)
    if (loc && loc !== last) {
      sequence.push(loc)
      last = loc
    }
  }
  return sequence
}
