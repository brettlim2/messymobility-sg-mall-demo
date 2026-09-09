export interface Venue {
  id: string
  name: string
  brand: string
  type: 'mall' | 'store' | 'candidate_site'
  lat: number
  lng: number
  h3: string
  city: string
}

export interface NarrativePost {
  platform: string
  text: string
  sentiment: number
  date: string
}

export interface Narrative {
  id: string
  label: string
  brand: string
  sentimentTrend: 'rising' | 'stable' | 'declining'
  audienceSegment: string
  platformMix: Record<string, number>
  samplePosts: NarrativePost[]
}

export interface SocialDay {
  date: string
  narrativeId: string
  buzzVolume: number
  sentiment: number
  reach: number
}

export interface FootfallDay {
  date: string
  venueId: string
  footfall: number
  baseline: number
}

export interface Campaign {
  id: string
  brand: string
  narrativeId: string
  name: string
  startDate: string
  endDate: string
  targetVenueIds: string[]
  channels: string[]
  spendPhp: number
  liftPct: number
  causalLagDays: number
  confidence: number
  persona: string
  description: string
}

export interface Corridor {
  id: string
  name: string
  venueId: string
  city: string
  lat: number
  lng: number
  h3: string
  footTrafficGrowth: number
  socialGrowth: number
  mobilityTrend: number
  forwardScore: number
  roiRank: number
  status: 'hot' | 'warm' | 'watch'
}

export interface BehaviorGraphNode {
  id: string
  type: 'narrative' | 'audience' | 'venue'
  label: string
  brand: string
}

export interface BehaviorGraphEdge {
  source: string
  target: string
  weight: number
}

export interface BehaviorGraph {
  nodes: BehaviorGraphNode[]
  edges: BehaviorGraphEdge[]
}

export interface DemoMeta {
  generatedAt: string
  seed: number
  days: number
  startDate: string
  endDate: string
  headlineMetrics: {
    liftPct: number
    causalLagDays: number
    confidence: number
  }
  ev?: {
    liveStations: number
    candidateSites: number
    avgUtilization: number
    totalKwhPerDay: number
    sessionsPerDay: number
    topOpportunity: string | null
    topOpportunityScore: number | null
  }
}

export interface ApiEndpoint {
  id: string
  method: string
  path: string
  tier: string
  summary: string
  useCase: string
  queryParams: string[]
  sampleRequest: string
  sampleResponse: Record<string, unknown>
}

export interface ApiTier {
  id: string
  name: string
  price: string
  access: string[]
  description: string
}

export interface ClientFlowStep {
  step: number
  title: string
  description: string
}

export interface ApiCatalog {
  baseUrl: string
  auth: string
  tiers: ApiTier[]
  endpoints: ApiEndpoint[]
  clientFlow: ClientFlowStep[]
}

export interface EvStation {
  id: string
  name: string
  operator: string
  type: 'dcfc' | 'l2'
  pattern: 'commuter' | 'destination'
  status: 'live' | 'candidate'
  lat: number
  lng: number
  city: string
  h3: string
  connectors: number
  powerKw: number
  /** candidate-only opportunity fields */
  nearbyDemand?: number
  coverageGap?: number
  projectedSessionsDay?: number
  opportunityScore?: number
  roiRank?: number
}

export interface EvSessionDay {
  date: string
  stationId: string
  sessions: number
  energyKwh: number
  avgDwellMin: number
  utilization: number
  baseline: number
}

export interface EvHourlyProfile {
  stationId: string
  weekday: number[]
  weekend: number[]
}

export interface DemoData {
  meta: DemoMeta
  venues: Venue[]
  narratives: Narrative[]
  socialTimeseries: SocialDay[]
  footfallTimeseries: FootfallDay[]
  campaigns: Campaign[]
  corridors: Corridor[]
  behaviorGraph: BehaviorGraph
  apiCatalog: ApiCatalog
  evStations: EvStation[]
  evSessions: EvSessionDay[]
  evHourly: EvHourlyProfile[]
}

export type AppMode = 'story' | 'api' | 'attribution' | 'site' | 'mall' | 'analyst' | 'ev'

export interface DemoLayerVisibility {
  venues: boolean
  footfallUplift: boolean
  corridors: boolean
  socialOrigin: boolean
  evStations: boolean
}

export interface MapCamera {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}
