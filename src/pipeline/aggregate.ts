import { cellToLatLng } from 'h3-js'
import type {
  DistributionPoint,
  Ping,
  PipelineResult,
  UserDayMotif,
  UserHome,
  ZoneMetric,
} from './types'
import { SG_ZONE_POPULATION as CITY_POP } from './types'

function toDistribution(counts: Map<string, number>, total: number): DistributionPoint[] {
  return [...counts.entries()]
    .sort((a, b) => {
      const na = Number(a[0].replace('+', ''))
      const nb = Number(b[0].replace('+', ''))
      return na - nb
    })
    .map(([label, value]) => ({
      label,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
    }))
}

export function computeExpansionWeights(
  userDays: UserDayMotif[],
  homes: Record<string, UserHome>,
): UserDayMotif[] {
  const usersPerCity = new Map<string, Set<string>>()
  const daysPerUser = new Map<string, number>()

  for (const ud of userDays) {
    daysPerUser.set(ud.adId, (daysPerUser.get(ud.adId) ?? 0) + 1)
    const city = homes[ud.adId]?.city ?? 'unknown'
    const set = usersPerCity.get(city) ?? new Set()
    set.add(ud.adId)
    usersPerCity.set(city, set)
  }

  return userDays.map((ud) => {
    const city = homes[ud.adId]?.city ?? 'unknown'
    const pop = CITY_POP[city] ?? 500_000
    const cityUsers = usersPerCity.get(city)?.size ?? 1
    const beta = pop / cityUsers
    const ki = daysPerUser.get(ud.adId) ?? 1
    return { ...ud, expansionWeight: beta / ki }
  })
}

export function aggregateResults(
  pings: Ping[],
  userDays: UserDayMotif[],
  homes: Record<string, UserHome>,
  staysByUser: Record<string, import('./types').Stay[]>,
): Pick<
  PipelineResult,
  | 'motifDistribution'
  | 'tripsDistribution'
  | 'destinationsDistribution'
  | 'hourlyActivity'
  | 'zoneMetrics'
  | 'cityMetrics'
  | 'kpi'
  | 'motifCatalog'
  | 'users'
> {
  const weighted = computeExpansionWeights(userDays, homes)
  const totalWeight = weighted.reduce((s, u) => s + u.expansionWeight, 0)

  const motifCounts = new Map<string, number>()
  const motifIdCounts = new Map<string, { label: string; nodeCount: number; count: number; edges: Array<[number, number]> }>()
  const tripCounts = new Map<number, number>()
  const destCounts = new Map<number, number>()
  const hourly = Array(24).fill(0)

  for (const ud of weighted) {
    const bucket =
      ud.nodeCount >= 7 ? '7+-node' : `${ud.nodeCount}-node`
    motifCounts.set(bucket, (motifCounts.get(bucket) ?? 0) + ud.expansionWeight)

    const existing = motifIdCounts.get(ud.motifId)
    if (existing) {
      existing.count += ud.expansionWeight
    } else {
      motifIdCounts.set(ud.motifId, {
        label: ud.motifLabel,
        nodeCount: ud.nodeCount,
        count: ud.expansionWeight,
        edges: ud.edges,
      })
    }

    tripCounts.set(ud.tripCount, (tripCounts.get(ud.tripCount) ?? 0) + ud.expansionWeight)
    destCounts.set(ud.nodeCount, (destCounts.get(ud.nodeCount) ?? 0) + ud.expansionWeight)
  }

  for (const ping of pings) {
    hourly[ping.hourPht]++
  }

  const zoneMetrics = computeZoneMetrics(weighted, homes, 'h3')
  const cityMetrics = computeZoneMetrics(weighted, homes, 'city')

  const stayAtHome = weighted
    .filter((u) => u.nodeCount <= 1)
    .reduce((s, u) => s + u.expansionWeight, 0)

  const avgTrips =
    totalWeight > 0
      ? weighted.reduce((s, u) => s + u.tripCount * u.expansionWeight, 0) / totalWeight
      : 0
  const avgDest =
    totalWeight > 0
      ? weighted.reduce((s, u) => s + u.nodeCount * u.expansionWeight, 0) / totalWeight
      : 0

  const totalStays = Object.values(staysByUser).reduce((s, arr) => s + arr.length, 0)

  const motifCatalog = [...motifIdCounts.entries()]
    .map(([id, meta]) => ({
      id,
      label: meta.label,
      nodeCount: meta.nodeCount,
      count: meta.count,
      pct: totalWeight > 0 ? (meta.count / totalWeight) * 100 : 0,
      edges: meta.edges,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    motifDistribution: toDistribution(motifCounts, totalWeight),
    tripsDistribution: toDistribution(
      new Map([...tripCounts.entries()].map(([k, v]) => [String(k), v])),
      totalWeight,
    ),
    destinationsDistribution: toDistribution(
      new Map([...destCounts.entries()].map(([k, v]) => [String(k), v])),
      totalWeight,
    ),
    hourlyActivity: hourly,
    zoneMetrics,
    cityMetrics,
    kpi: {
      totalUsers: new Set(weighted.map((u) => u.adId)).size,
      filteredUserDays: weighted.length,
      avgTrips,
      avgDestinations: avgDest,
      stayAtHomePct: totalWeight > 0 ? (stayAtHome / totalWeight) * 100 : 0,
      totalStays,
    },
    motifCatalog,
    users: [...new Set(pings.map((p) => p.adId))].sort(),
  }
}

function computeZoneMetrics(
  userDays: UserDayMotif[],
  homes: Record<string, UserHome>,
  mode: 'h3' | 'city',
): ZoneMetric[] {
  const zones = new Map<
    string,
    {
      city: string
      users: Set<string>
      motifCounts: Record<string, number>
      totalWeight: number
      lat: number
      lng: number
    }
  >()

  for (const ud of userDays) {
    const home = homes[ud.adId]
    if (!home) continue
    const zoneId = mode === 'h3' ? home.h3 || home.city : home.city
    if (!zoneId) continue

    let lat = home.lat
    let lng = home.lng
    if (mode === 'h3' && home.h3) {
      try {
        const [la, ln] = cellToLatLng(home.h3)
        lat = la
        lng = ln
      } catch {
        /* use home lat/lng */
      }
    }

    const z = zones.get(zoneId) ?? {
      city: home.city,
      users: new Set(),
      motifCounts: {},
      totalWeight: 0,
      lat,
      lng,
    }
    z.users.add(ud.adId)
    z.totalWeight += ud.expansionWeight
    const bucket = ud.nodeCount >= 7 ? '7+-node' : `${ud.nodeCount}-node`
    z.motifCounts[bucket] = (z.motifCounts[bucket] ?? 0) + ud.expansionWeight
    zones.set(zoneId, z)
  }

  const metroMotifTotals: Record<string, number> = {}
  let metroTotal = 0
  for (const z of zones.values()) {
    metroTotal += z.totalWeight
    for (const [m, c] of Object.entries(z.motifCounts)) {
      metroMotifTotals[m] = (metroMotifTotals[m] ?? 0) + c
    }
  }

  return [...zones.entries()].map(([zoneId, z]) => {
    const lqByMotif: Record<string, number> = {}
    const rlqByMotif: Record<string, number> = {}

    for (const [motif, count] of Object.entries(z.motifCounts)) {
      const zoneShare = z.totalWeight > 0 ? count / z.totalWeight : 0
      const metroShare = metroTotal > 0 ? (metroMotifTotals[motif] ?? 0) / metroTotal : 0
      lqByMotif[motif] = metroShare > 0 ? zoneShare / metroShare : 0
    }

    const lq2 = lqByMotif['2-node'] ?? 0
    for (const motif of Object.keys(lqByMotif)) {
      rlqByMotif[motif] = motif === '2-node' ? 1 : lq2 > 0 ? lqByMotif[motif] / lq2 : lqByMotif[motif]
    }

    const pop = CITY_POP[z.city] ?? 500_000

    return {
      zoneId,
      city: z.city,
      lat: z.lat,
      lng: z.lng,
      totalUsers: z.users.size,
      motifCounts: z.motifCounts,
      lqByMotif,
      rlqByMotif,
      populationEstimate: pop,
    }
  })
}
