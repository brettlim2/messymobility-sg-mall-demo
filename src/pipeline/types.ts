export interface GeoFields {
  city: string
  region: string
  h3_res10: string
  h3_res12: string
  geohash: string
}

export interface QualityFields {
  ping_lat_precision?: string
  source_type?: string
  ping_long_precision?: string
  ping_near_replicate_matches?: string
  ping_sink_matches?: string
  ping_cell_tower?: string
  ping_circle_score?: string
}

export interface Ping {
  adId: string
  timestampUtc: Date
  timestampPht: Date
  lat: number
  lng: number
  accuracy: number
  city: string
  h3: string
  circleScore: number
  sourceType: string
  dayKey: string
  hourPht: number
  halfHourSlot: number
  isWeekend: boolean
}

export interface Stay {
  locationId: string
  lat: number
  lng: number
  h3: string
  city: string
  start: Date
  end: Date
  durationMin: number
  pingCount: number
}

export interface UserHome {
  adId: string
  locationId: string
  lat: number
  lng: number
  h3: string
  city: string
  nightVisits: number
}

export interface UserDayMotif {
  adId: string
  dayKey: string
  isWeekend: boolean
  homeLocationId: string
  staySequence: string[]
  tripCount: number
  nodeCount: number
  motifSignature: string
  motifLabel: string
  motifId: string
  edges: Array<[number, number]>
  expansionWeight: number
}

export interface PipelineParams {
  dd: number
  dt: number
  nightStartHour: number
  nightEndHour: number
  minHalfHourSlots: number
  weekdaysOnly: boolean
  maxAccuracy: number
  minCircleScore: number
  dateStart: string | null
  dateEnd: string | null
  selectedUserId: string | null
}

export interface DistributionPoint {
  label: string
  value: number
  pct: number
}

export interface ZoneMetric {
  zoneId: string
  city: string
  lat: number
  lng: number
  totalUsers: number
  motifCounts: Record<string, number>
  lqByMotif: Record<string, number>
  rlqByMotif: Record<string, number>
  populationEstimate: number
}

export interface PipelineResult {
  pings: Ping[]
  staysByUser: Record<string, Stay[]>
  homes: Record<string, UserHome>
  userDays: UserDayMotif[]
  motifDistribution: DistributionPoint[]
  tripsDistribution: DistributionPoint[]
  destinationsDistribution: DistributionPoint[]
  hourlyActivity: number[]
  zoneMetrics: ZoneMetric[]
  cityMetrics: ZoneMetric[]
  kpi: {
    totalUsers: number
    filteredUserDays: number
    avgTrips: number
    avgDestinations: number
    stayAtHomePct: number
    totalStays: number
  }
  users: string[]
  motifCatalog: Array<{
    id: string
    label: string
    nodeCount: number
    count: number
    pct: number
    edges: Array<[number, number]>
  }>
}

export const DEFAULT_PARAMS: PipelineParams = {
  dd: 300,
  dt: 10,
  nightStartHour: 19,
  nightEndHour: 7,
  minHalfHourSlots: 8,
  weekdaysOnly: true,
  maxAccuracy: 100,
  minCircleScore: 0,
  dateStart: null,
  dateEnd: null,
  selectedUserId: null,
}

/** Paper Fig 10 reference (Singapore CDR phone data) */
export const PAPER_MOTIF_REFERENCE: Record<string, number> = {
  '1-node': 13.5,
  '2-node': 33.0,
  '3-node': 30.0,
  '4-node': 14.0,
  '5-node': 5.5,
  '6-node': 2.1,
  '7+-node': 2.0,
}

export const PAPER_SURVEY_REFERENCE: Record<string, number> = {
  '1-node': 23.4,
  '2-node': 55.2,
  '3-node': 15.5,
  '4-node': 3.7,
  '5-node': 1.0,
  '6-node': 0.5,
  '7+-node': 0.7,
}

/** Illustrative Singapore zone populations for expansion (Section 4.5) */
export const SG_ZONE_POPULATION: Record<string, number> = {
  singapore: 5_900_000,
  'sg-zone-w21z': 320_000,
  'sg-zone-w23b': 280_000,
  'sg-zone-w21y': 260_000,
  'sg-zone-w21x': 240_000,
  'sg-zone-w21t': 220_000,
}
