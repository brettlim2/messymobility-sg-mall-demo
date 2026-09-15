// Data model for the multi-mall spatial analytics demo.
// Observed fields are transcribed from the July 2026 Veraset bundle
// (data/analytics_out_july/mall_product.json + mall.json); SES, behaviour,
// trip-chains and the indoor Wi-Fi/movement layer are illustrative/synthetic.

export type EvidenceKind = 'observed' | 'modelled' | 'map' | 'scenario'

export interface Kpi { label: string; value: string; detail: string }
export interface MixItem { label: string; value: number; note: string; color?: string }
export interface SesItem { label: string; value: number; tone: string; detail: string }
export interface Fact { label: string; value: string }
export interface Band { km: number; label: string; uw: number; w: number }
export interface CrossShop { mall: string; share: number; shared: number }
export interface LeakDest { mall: string; leak: number; capture: number }
export interface SegmentLift { label: string; share: number; lift: number }
export interface TagLift { label: string; lift: number }
export interface Peer { mall: string; sim: number }
export interface DriftSeg { segment: string; delta: number }
export interface TripChain { label: string; share: string; segment: string; stops: string[] }

export interface Hotspot {
  id: string
  name: string
  context: string
  x: number // % across the floor plan
  y: number // % down the floor plan
  presence: number
  dwell: number
  capture: number
  change: number
  opportunity: string
}

// A stylised, self-drawn floor plan. All coordinates are in a square 0–100
// space (viewBox 0 0 100 100) so hotspot x/y percentages align with the plan.
// Purely synthetic — used where we do not have an official published plan.
export interface SchematicBlock { x: number; y: number; w: number; h: number; label: string; kind: 'anchor' | 'retail' | 'food' | 'atrium' | 'transit' }
export interface SchematicEntrance { x: number; y: number; label: string; kind: 'transit' | 'street' | 'parking' }
export interface SchematicFloor {
  outline?: string // optional SVG path; component draws a rounded rect if omitted
  corridors: string[] // SVG path "d" strings (0–100 space)
  blocks: SchematicBlock[]
  entrances: SchematicEntrance[]
  journeys: string[] // 1–2 flow paths (0–100 space)
}

export interface MallFloorplan {
  type: 'image' | 'schematic'
  images?: Record<string, string> // floor -> public asset path (type === 'image')
  sourceUrl?: Record<string, string>
  journeys?: Record<string, string[]> // floor -> flow paths (image plans; schematic carries its own)
  schematic?: Record<string, SchematicFloor> // floor -> spec (type === 'schematic')
}

export interface MallProfile {
  id: string
  name: string
  archetype: string
  tagline: string
  blurb: string
  address: string
  planKind: 'official' | 'schematic'
  planLabel: string // e.g. "Official Jem plan" / "Schematic layout"
  planSourceLabel: string
  planSourceUrl?: string

  kpis: Kpi[]
  meanDaily: string
  trend: number[]
  trendPeak: { index: number; value: number } // index into trend (0-based), display value
  panelSensitive: boolean

  mission: MixItem[]
  missionFacts: Fact[]

  catchment: { bands: Band[]; medHome: string; weightedVisitors: string; ess: string; markKm: number; markLabel: string }
  rhythm: { weekday: number[]; weekend: number[]; weekdayPeakH: number; weekendPeakH: number; weekdayNote: string; weekendNote: string }

  sesAuc: string
  ses: SesItem[]
  sesFacts: Fact[]
  behaviorHeadline: string
  behavior: MixItem[]
  tripChains: TripChain[]

  crossShop: CrossShop[]
  leakage: { base: string; note: string; dests: LeakDest[] }
  audience: { note: string; segments: SegmentLift[]; tags: TagLift[] }
  peers: Peer[]
  peersNote: string
  drift: {
    significant: boolean
    headline: string
    segments: DriftSeg[]
    embedding: string
    embeddingCi: string
    matched: string
    newVisitor: string
    window: string
  }

  floors: string[]
  floorLabel: (floor: string) => string
  defaultFloor: string
  defaultZoneId: (floor: string) => string
  hotspots: Record<string, Hotspot[]>
  floorplan: MallFloorplan
}
