import type { MallProfile } from '../types'
import { TEAL, TEAL_MID, DEEP, SES_RAMP } from '../palette'

// WATERWAY POINT — suburban heartland mall (Punggol). Observed figures from the
// July 2026 Veraset bundle; the floor plan is a synthetic schematic and the
// indoor Wi-Fi hotspots are illustrative.
export const waterwayPoint: MallProfile = {
  id: 'waterway_point',
  name: 'Waterway Point',
  archetype: 'Suburban heartland',
  tagline: 'the neighbourhood in one address',
  blurb: 'A real July 2026 mobility read of Waterway Point in Punggol, shown on a synthetic layout, then extended into the zone-level decisions mall Wi‑Fi could unlock.',
  address: '83 Punggol Central',
  planKind: 'schematic',
  planLabel: 'Schematic layout',
  planSourceLabel: 'Synthetic schematic · anchored to public campus geometry',

  kpis: [
    { label: 'Observed devices', value: '9,076', detail: 'July panel, not total visitors' },
    { label: 'Median dwell', value: '54.6 min', detail: '95% CI · 53.2–56.0' },
    { label: 'Repeat rate', value: '35.5%', detail: '95% CI · 31.8–38.5' },
    { label: 'Home within 3 km', value: '67.7%', detail: 'median home distance · 1.8 km' },
  ],
  meanDaily: '604',
  trend: [98.5,110.5,114.9,107.0,114.2,89.4,99.1,90.0,93.0,116.9,111.2,100.6,70.5,85.6,78.0,83.0,118.3,119.0,102.6,71.7,92.2,87.7,85.6,115.8,117.0,118.9,81.5,96.9,86.1,105.2,138.9],
  trendPeak: { index: 30, value: 139 },
  panelSensitive: false,

  mission: [
    { label: 'Browse', value: 56.7, note: 'multi-stop shopping pattern', color: TEAL },
    { label: 'Day out', value: 27.4, note: 'longer, broader activity pattern', color: TEAL_MID },
    { label: 'Grab & go', value: 15.9, note: 'short, focused visit pattern', color: DEEP },
  ],
  missionFacts: [
    { label: 'Near-transit share', value: '11.3%' },
    { label: 'Top behavioral peer', value: 'Jem · 0.41' },
  ],

  catchment: {
    bands: [
      { km: 2, label: '2 km', uw: 54.6, w: 58.7 },
      { km: 3, label: '3 km', uw: 66.2, w: 70.2 },
      { km: 5, label: '5 km', uw: 76.4, w: 79.8 },
      { km: 10, label: '10 km', uw: 91.5, w: 93.4 },
    ],
    medHome: '1.85 km', weightedVisitors: '13,595', ess: '13,274', markKm: 3, markLabel: '3 km · 70%',
  },
  rhythm: {
    weekday: [1.3,1.3,1.5,1.4,2.0,2.7,5.1,8.9,45.5,45.4,37.6,37.4,51.7,47.6,39.4,32.1,32.8,41.8,55.0,45.9,36.2,13.9,7.2,3.3],
    weekend: [3.0,0.9,1.8,0.6,2.8,2.6,4.8,10.3,96.5,61.0,66.0,62.8,63.4,68.9,53.4,50.0,54.5,55.6,61.6,46.3,49.0,20.4,8.8,6.8],
    weekdayPeakH: 18, weekendPeakH: 8,
    weekdayNote: 'Weekday · after-work peak', weekendNote: 'Weekend · morning market run',
  },

  sesAuc: '0.69',
  ses: [
    { label: 'Q1', value: 18, tone: SES_RAMP[0], detail: 'lower propensity' },
    { label: 'Q2', value: 26, tone: SES_RAMP[1], detail: '' },
    { label: 'Q3', value: 30, tone: SES_RAMP[2], detail: 'largest cohort' },
    { label: 'Q4', value: 17, tone: SES_RAMP[3], detail: '' },
    { label: 'Q5', value: 9, tone: SES_RAMP[4], detail: 'higher propensity' },
  ],
  sesFacts: [
    { label: 'Punggol', value: 'Q3 · 33% Q4/5' },
    { label: 'Sengkang', value: 'Q3 · 31% Q4/5' },
    { label: 'Hougang', value: 'Q3 · 28% Q4/5' },
  ],
  behaviorHeadline: 'A habitual, family-anchored heartland asset',
  behavior: [
    { label: 'Local resident', value: 41.0, note: '1.86 legs · 16% multi-stop' },
    { label: 'Homebody', value: 18.0, note: '1.62 legs · 11% multi-stop' },
    { label: 'School-linked', value: 14.5, note: '2.05 legs · 22% multi-stop' },
    { label: 'Works near home', value: 10.0, note: '2.18 legs · 26% multi-stop' },
    { label: 'Town commuter', value: 8.0, note: '2.24 legs · 28% multi-stop' },
    { label: 'Other', value: 8.5, note: 'remaining July segments' },
  ],
  tripChains: [
    { label: 'Family errand loop', share: '28%', segment: 'Local resident', stops: ['Home', 'Waterway Point', 'Supermarket', 'Home'] },
    { label: 'School pickup stop', share: '20%', segment: 'School-linked', stops: ['School', 'Waterway Point', 'Home'] },
    { label: 'Weekend family day', share: '18%', segment: 'Local resident', stops: ['Home', 'Waterway Point', 'Cinema / food', 'Home'] },
    { label: 'Commute top-up', share: '12%', segment: 'Town commuter', stops: ['Punggol MRT', 'Waterway Point', 'Home'] },
  ],

  crossShop: [
    { mall: 'NEX', share: 15.8, shared: 1434 },
    { mall: 'Bugis Junction', share: 10.7, shared: 973 },
    { mall: 'VivoCity', share: 10.6, shared: 965 },
    { mall: 'Jewel Changi', share: 10.5, shared: 950 },
    { mall: 'Tampines Mall', share: 10.2, shared: 922 },
    { mall: 'Plaza Singapura', share: 8.7, shared: 786 },
    { mall: 'Ngee Ann City', share: 7.7, shared: 695 },
    { mall: 'ION Orchard', share: 7.4, shared: 668 },
    { mall: 'Northpoint City', share: 7.2, shared: 654 },
    { mall: 'AMK Hub', share: 7.0, shared: 637 },
  ],
  peers: [
    { mall: 'Jem', sim: 0.408 },
    { mall: 'VivoCity', sim: 0.348 },
    { mall: 'Plaza Singapura', sim: 0.332 },
    { mall: 'NEX', sim: 0.261 },
    { mall: 'Bugis Junction', sim: 0.232 },
  ],
  peersNote: 'Its closest behavioral peer is Jem—both blend transit access with family and daily-need trips—despite sitting at opposite ends of the island.',
  drift: {
    significant: true,
    headline: 'Who the audience shifted toward',
    segments: [
      { segment: 'School-linked', delta: 13.8 },
      { segment: 'Works near home', delta: 2.8 },
      { segment: 'Homebody', delta: -3.0 },
      { segment: 'Local resident', delta: -6.9 },
      { segment: 'Town commuter', delta: -8.2 },
    ],
    embedding: '0.047', embeddingCi: '1 − cosine · CI 0.046–0.050', matched: '0.053', newVisitor: '84.8%',
    window: 'June covers 7 days and July covers 31 days, with high panel turnover.',
  },

  floors: ['L1', 'L2'],
  floorLabel: (f) => (f === 'L1' ? 'Level 1' : 'Level 2'),
  defaultFloor: 'L1',
  defaultZoneId: (f) => (f === 'L1' ? 'wp-l1-mrt' : 'wp-l2-esc-core'),
  hotspots: {
    L1: [
      { id: 'wp-l1-mrt', name: 'Punggol MRT/LRT link', context: 'Integrated transport hub', x: 8, y: 48, presence: 100, dwell: 6, capture: 72, change: 8.9, opportunity: 'Separate commuters passing through the interchange from genuine mall visitors with dwell rules.' },
      { id: 'wp-l1-mrt-atrium', name: 'MRT-to-West junction', context: 'First route choice from transit', x: 22, y: 48, presence: 90, dwell: 9, capture: 66, change: 6.4, opportunity: 'Quantify how commuter flow converts into the West Wing versus straight-through exits.' },
      { id: 'wp-l1-fairprice', name: 'FairPrice Finest frontage', context: 'Daily-needs anchor', x: 36, y: 22, presence: 94, dwell: 34, capture: 68, change: 7.1, opportunity: 'Measure whether the grocery run creates onward retail visits or a single-stop mission.' },
      { id: 'wp-l1-west-atrium', name: 'West Wing atrium', context: 'Main circulation heart', x: 33, y: 50, presence: 82, dwell: 16, capture: 58, change: 3.2, opportunity: 'Score atrium events against dwell and onward visitation across both wings.' },
      { id: 'wp-l1-boardwalk', name: 'The Boardwalk crossing', context: '24-hour wing-to-wing link', x: 50, y: 50, presence: 78, dwell: 7, capture: 55, change: 5.5, opportunity: 'Measure how much traffic actually crosses between wings versus staying in one.' },
      { id: 'wp-l1-east-atrium', name: 'East Wing atrium', context: 'Secondary circulation heart', x: 69, y: 50, presence: 74, dwell: 15, capture: 53, change: 2.0, opportunity: 'Identify where East Wing footfall thins relative to the West Wing.' },
      { id: 'wp-l1-waterfront', name: 'Waterfront F&B', context: 'Park-facing dining frontage', x: 74, y: 80, presence: 80, dwell: 38, capture: 57, change: 6.8, opportunity: 'Compare park-side dwell with subsequent indoor capture by weather and weekend.' },
      { id: 'wp-l1-specialty', name: 'Specialty retail', context: 'North small-format run', x: 78, y: 22, presence: 63, dwell: 18, capture: 47, change: -2.1, opportunity: 'Diagnose whether low capture is route visibility or tenant appeal.' },
      { id: 'wp-l1-north-entry', name: 'North Entrance', context: 'Punggol Central threshold', x: 50, y: 8, presence: 66, dwell: 6, capture: 52, change: 3.0, opportunity: 'Link street arrival to first-zone choice and total mall dwell.' },
      { id: 'wp-l1-park-link', name: 'Waterway Park link', context: 'Boardwalk to Punggol Waterway', x: 50, y: 92, presence: 58, dwell: 9, capture: 49, change: 4.2, opportunity: 'Measure park-linked footfall and whether it can be captured on entry.' },
      { id: 'wp-l1-lift-e', name: 'East lift lobby', context: 'Vertical circulation cell', x: 62, y: 52, presence: 52, dwell: 9, capture: 44, change: -1.0, opportunity: 'Measure queueing and which floors are reached after lift use.' },
    ],
    L2: [
      { id: 'wp-l2-esc-core', name: 'Escalator core', context: 'L1↔L2 arrival, West Wing', x: 33, y: 50, presence: 84, dwell: 12, capture: 60, change: 4.8, opportunity: 'Locate stopping and leakage as visitors arrive on the upper floor.' },
      { id: 'wp-l2-uniqlo', name: 'UNIQLO / fashion', context: 'West apparel anchor', x: 20, y: 26, presence: 80, dwell: 31, capture: 57, change: 6.0, opportunity: 'Reveal which arrival cohorts enter this anchor and where they go next.' },
      { id: 'wp-l2-foodcourt', name: 'Kopitiam food court', context: 'West F&B magnet', x: 20, y: 74, presence: 92, dwell: 41, capture: 66, change: 8.3, opportunity: 'Connect food-court dwell to onward retail versus single-stop dining.' },
      { id: 'wp-l2-cinema', name: 'Cinema frontage', context: 'East entertainment anchor', x: 78, y: 26, presence: 77, dwell: 44, capture: 55, change: 5.2, opportunity: 'Measure the cinema halo across neighbouring F&B before and after showtimes.' },
      { id: 'wp-l2-family', name: 'Family & enrichment', context: 'Kids retail and tuition cluster', x: 78, y: 76, presence: 85, dwell: 46, capture: 62, change: 9.4, opportunity: 'Quantify the family/enrichment halo and its recurring weekly rhythm.' },
      { id: 'wp-l2-boardwalk', name: 'Boardwalk L2 crossing', context: 'Upper wing-to-wing link', x: 50, y: 50, presence: 70, dwell: 8, capture: 52, change: 3.6, opportunity: 'Measure how much upper-level traffic crosses between wings.' },
      { id: 'wp-l2-east-atrium', name: 'East atrium', context: 'East Wing upper circulation', x: 66, y: 50, presence: 66, dwell: 14, capture: 49, change: 1.4, opportunity: 'Identify where East Wing upper footfall bypasses smaller tenants.' },
      { id: 'wp-l2-west-void', name: 'West atrium edge', context: 'Upper void circulation', x: 33, y: 30, presence: 60, dwell: 13, capture: 46, change: -1.6, opportunity: 'Find the exact point where upper West-side circulation thins out.' },
      { id: 'wp-l2-north-bridge', name: 'North bridge entry', context: 'Upper street connection', x: 50, y: 8, presence: 63, dwell: 6, capture: 50, change: 2.2, opportunity: 'Link upper-level street arrival to first-zone choice.' },
      { id: 'wp-l2-lift-w', name: 'West lift lobby', context: 'Upper vertical core', x: 40, y: 42, presence: 54, dwell: 10, capture: 44, change: -0.8, opportunity: 'Measure floor destinations and queueing after lift use.' },
      { id: 'wp-l2-south-conn', name: 'South family connector', context: 'Food-to-family transition', x: 50, y: 82, presence: 64, dwell: 17, capture: 47, change: 2.9, opportunity: 'Quantify how family visitors move between food court and enrichment.' },
    ],
  },
  floorplan: {
    type: 'schematic',
    schematic: {
      L1: {
        corridors: ['M14 50 H86', 'M33 22 V82', 'M69 22 V82'],
        blocks: [
          { x: 2, y: 42, w: 14, h: 16, label: 'Punggol MRT/LRT', kind: 'transit' },
          { x: 22, y: 12, w: 28, h: 20, label: 'FairPrice Finest', kind: 'anchor' },
          { x: 26, y: 42, w: 14, h: 18, label: 'West atrium', kind: 'atrium' },
          { x: 44, y: 44, w: 14, h: 12, label: 'The Boardwalk', kind: 'transit' },
          { x: 62, y: 42, w: 14, h: 18, label: 'East atrium', kind: 'atrium' },
          { x: 60, y: 70, w: 34, h: 20, label: 'Waterfront F&B', kind: 'food' },
          { x: 64, y: 12, w: 30, h: 20, label: 'Specialty retail', kind: 'retail' },
        ],
        entrances: [
          { x: 4, y: 50, label: 'MRT', kind: 'transit' },
          { x: 50, y: 6, label: 'North', kind: 'street' },
          { x: 88, y: 6, label: 'Car park', kind: 'parking' },
          { x: 50, y: 94, label: 'Waterway Park', kind: 'street' },
        ],
        journeys: ['M6 50 C24 48 40 50 50 50 S70 52 88 50', 'M36 22 C34 34 33 44 33 50 S60 66 74 78'],
      },
      L2: {
        corridors: ['M14 50 H86', 'M33 22 V82', 'M66 22 V82'],
        blocks: [
          { x: 8, y: 16, w: 26, h: 22, label: 'UNIQLO · fashion', kind: 'anchor' },
          { x: 30, y: 42, w: 12, h: 16, label: 'West void', kind: 'atrium' },
          { x: 44, y: 44, w: 14, h: 12, label: 'Boardwalk L2', kind: 'transit' },
          { x: 60, y: 42, w: 12, h: 16, label: 'East void', kind: 'atrium' },
          { x: 8, y: 64, w: 28, h: 24, label: 'Kopitiam · food court', kind: 'food' },
          { x: 64, y: 16, w: 30, h: 22, label: 'Cinema', kind: 'retail' },
          { x: 62, y: 64, w: 32, h: 24, label: 'Family & enrichment', kind: 'retail' },
        ],
        entrances: [
          { x: 50, y: 6, label: 'North bridge', kind: 'street' },
        ],
        journeys: ['M20 26 C30 34 33 44 33 50 S60 52 78 50', 'M20 74 C34 70 46 60 50 56 S70 70 78 76'],
      },
    },
  },
}
