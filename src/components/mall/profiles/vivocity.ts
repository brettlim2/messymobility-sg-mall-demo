import type { MallProfile } from '../types'
import { TEAL, TEAL_MID, DEEP, SES_RAMP } from '../palette'

// VIVOCITY — harbourfront destination mall (HarbourFront). Observed figures from
// the July 2026 Veraset bundle; the floor plan is a synthetic schematic and the
// indoor Wi-Fi hotspots are illustrative.
export const vivocity: MallProfile = {
  id: 'vivocity',
  name: 'VivoCity',
  archetype: 'Harbourfront destination',
  tagline: 'the island-wide day out',
  blurb: 'A real July 2026 mobility read of VivoCity—Singapore’s largest mall—shown on a synthetic layout, then extended into the zone-level decisions mall Wi‑Fi could unlock.',
  address: '1 HarbourFront Walk',
  planKind: 'schematic',
  planLabel: 'Schematic layout',
  planSourceLabel: 'Synthetic schematic · anchored to public campus geometry',

  kpis: [
    { label: 'Observed devices', value: '12,254', detail: 'July panel, not total visitors' },
    { label: 'Median dwell', value: '72.8 min', detail: '95% CI · 70.6–74.6' },
    { label: 'Repeat rate', value: '25.3%', detail: '95% CI · 22.4–27.5' },
    { label: 'Home within 3 km', value: '17.5%', detail: 'median home distance · 12.4 km' },
  ],
  meanDaily: '670',
  trend: [86.6,82.1,140.2,123.1,126.2,94.9,86.0,91.2,93.0,137.7,134.1,118.3,72.5,77.6,70.2,79.4,120.6,122.1,113.6,71.1,69.4,73.9,78.6,126.3,115.0,122.5,84.5,82.3,78.1,91.8,137.3],
  trendPeak: { index: 2, value: 140 },
  panelSensitive: false,

  mission: [
    { label: 'Browse', value: 47.4, note: 'multi-stop shopping pattern', color: TEAL },
    { label: 'Day out', value: 41.3, note: 'longer, broader activity pattern', color: TEAL_MID },
    { label: 'Grab & go', value: 11.3, note: 'short, focused visit pattern', color: DEEP },
  ],
  missionFacts: [
    { label: 'Near-transit share', value: '9.7%' },
    { label: 'Top behavioral peer', value: 'Plaza Sing · 0.48' },
  ],

  catchment: {
    bands: [
      { km: 2, label: '2 km', uw: 9.3, w: 9.2 },
      { km: 3, label: '3 km', uw: 16.6, w: 15.9 },
      { km: 5, label: '5 km', uw: 23.5, w: 20.9 },
      { km: 10, label: '10 km', uw: 39.4, w: 34.4 },
    ],
    medHome: '12.76 km', weightedVisitors: '17,287', ess: '16,340', markKm: 3, markLabel: '3 km · 16%',
  },
  rhythm: {
    weekday: [0.9,1.0,0.6,0.5,0.7,1.1,2.8,8.1,35.3,29.0,38.7,46.8,64.3,55.1,50.1,42.8,44.2,45.8,59.9,52.3,36.1,12.7,5.9,1.9],
    weekend: [3.4,1.8,0,0,0.6,1.5,3.4,6.8,61.8,50.8,53.6,81.8,87.8,84.4,86.8,77.5,87.3,88.1,87.9,76.8,56.6,25.3,9.3,6.4],
    weekdayPeakH: 12, weekendPeakH: 17,
    weekdayNote: 'Weekday · lunch peak', weekendNote: 'Weekend · all-afternoon plateau',
  },

  sesAuc: '0.69',
  ses: [
    { label: 'Q1', value: 9, tone: SES_RAMP[0], detail: 'lower propensity' },
    { label: 'Q2', value: 16, tone: SES_RAMP[1], detail: '' },
    { label: 'Q3', value: 24, tone: SES_RAMP[2], detail: '' },
    { label: 'Q4', value: 28, tone: SES_RAMP[3], detail: 'largest cohort' },
    { label: 'Q5', value: 23, tone: SES_RAMP[4], detail: 'higher propensity' },
  ],
  sesFacts: [
    { label: 'Bukit Merah', value: 'Q3 · 41% Q4/5' },
    { label: 'Queenstown', value: 'Q4 · 47% Q4/5' },
    { label: 'Central Area', value: 'Q4 · 52% Q4/5' },
  ],
  behaviorHeadline: 'A destination that pulls island-wide and visitor trips',
  behavior: [
    { label: 'Islandwide rover', value: 26.4, note: '2.61 legs · 38% multi-stop' },
    { label: 'Day-out visitor', value: 22.0, note: '2.44 legs · 41% multi-stop' },
    { label: 'Tourist / short-stay', value: 15.5, note: '2.70 legs · 44% multi-stop' },
    { label: 'Local resident', value: 12.8, note: '1.98 legs · 18% multi-stop' },
    { label: 'Town commuter', value: 10.0, note: '2.20 legs · 27% multi-stop' },
    { label: 'Other', value: 13.3, note: 'remaining July segments' },
  ],
  tripChains: [
    { label: 'Sentosa day out', share: '26%', segment: 'Day-out visitor', stops: ['Home', 'VivoCity', 'Sentosa', 'Home'] },
    { label: 'Harbourfront leisure', share: '22%', segment: 'Islandwide rover', stops: ['Home', 'VivoCity', 'Waterfront dining', 'Home'] },
    { label: 'Visitor circuit', share: '16%', segment: 'Tourist / short-stay', stops: ['Hotel', 'VivoCity', 'Sentosa', 'Hotel'] },
    { label: 'Cinema & dine', share: '12%', segment: 'Islandwide rover', stops: ['Work', 'VivoCity', 'GV cinema', 'Home'] },
  ],

  crossShop: [
    { mall: 'Plaza Singapura', share: 17.6, shared: 1596 },
    { mall: 'Bugis Junction', share: 16.1, shared: 1969 },
    { mall: 'Ngee Ann City', share: 14.4, shared: 1759 },
    { mall: 'Suntec City', share: 13.8, shared: 1363 },
    { mall: 'Jem', share: 13.7, shared: 1684 },
    { mall: 'ION Orchard', share: 13.5, shared: 1656 },
    { mall: 'Jewel Changi', share: 12.4, shared: 1425 },
    { mall: 'NEX', share: 11.0, shared: 1296 },
    { mall: 'Waterway Point', share: 10.6, shared: 965 },
    { mall: 'Tampines Mall', share: 8.7, shared: 1065 },
  ],
  peers: [
    { mall: 'Plaza Singapura', sim: 0.480 },
    { mall: 'Jem', sim: 0.457 },
    { mall: 'Jewel Changi', sim: 0.434 },
    { mall: 'ION Orchard', sim: 0.412 },
    { mall: 'Ngee Ann City', sim: 0.403 },
  ],
  peersNote: 'VivoCity behaves like the central/orchard destination malls—even though those visitors are drawn from a very different, island-wide catchment.',
  drift: {
    significant: false,
    headline: 'A stable island-wide audience',
    segments: [
      { segment: 'School-linked', delta: 14.1 },
      { segment: 'Works near home', delta: 1.7 },
      { segment: 'Islandwide rover', delta: -1.7 },
      { segment: 'Town commuter', delta: -6.9 },
      { segment: 'Local resident', delta: -8.1 },
    ],
    embedding: '0.007', embeddingCi: '1 − cosine · CI 0.006–0.009', matched: '0.010', newVisitor: '88.9%',
    window: 'June covers 7 days and July covers 31 days, with high panel turnover.',
  },

  floors: ['L1', 'L2'],
  floorLabel: (f) => (f === 'L1' ? 'Level 1' : 'Level 2'),
  defaultFloor: 'L1',
  defaultZoneId: (f) => (f === 'L1' ? 'vc-l1-mrt' : 'vc-l2-esc-core'),
  hotspots: {
    L1: [
      { id: 'vc-l1-mrt', name: 'HarbourFront MRT threshold', context: 'NE/CC line direct connection', x: 8, y: 46, presence: 100, dwell: 5, capture: 74, change: 9.8, opportunity: 'Separate rail commuters from mall visitors and Sentosa-bound pass-through with dwell rules.' },
      { id: 'vc-l1-mrt-court', name: 'MRT-to-court junction', context: 'First route choice from rail', x: 28, y: 48, presence: 92, dwell: 8, capture: 68, change: 7.2, opportunity: 'Quantify how many rail arrivals turn into the mall versus continuing straight to Sentosa.' },
      { id: 'vc-l1-atrium', name: 'Central Court atrium', context: 'Main event and circulation heart', x: 50, y: 50, presence: 96, dwell: 20, capture: 66, change: 6.1, opportunity: 'Score atrium activations against dwell and onward visitation, not just impressions.' },
      { id: 'vc-l1-fairprice', name: 'FairPrice Xtra frontage', context: 'North daily-needs anchor', x: 78, y: 24, presence: 84, dwell: 33, capture: 61, change: 4.5, opportunity: 'Measure whether the supermarket run creates onward retail visits or a single-stop mission.' },
      { id: 'vc-l1-tangs', name: 'Tangs frontage', context: 'South department anchor', x: 78, y: 72, presence: 71, dwell: 26, capture: 52, change: -1.8, opportunity: 'Diagnose why the south anchor under-captures relative to its footfall.' },
      { id: 'vc-l1-sentosa', name: 'Sentosa Gateway link', context: 'Boardwalk / express to Sentosa', x: 92, y: 48, presence: 88, dwell: 6, capture: 63, change: 11.2, opportunity: 'Measure Sentosa-bound pass-through and whether a stop can be captured on the way out.' },
      { id: 'vc-l1-waterfront', name: 'Waterfront dining', context: 'Promenade F&B frontage', x: 38, y: 82, presence: 79, dwell: 41, capture: 57, change: 8.4, opportunity: 'Compare promenade dwell with subsequent indoor capture by weather and event schedule.' },
      { id: 'vc-l1-waterfront-plaza', name: 'Waterfront Plaza entry', context: 'South promenade threshold', x: 30, y: 92, presence: 62, dwell: 7, capture: 55, change: 5.0, opportunity: 'Link waterfront arrival to first-zone choice and total mall dwell.' },
      { id: 'vc-l1-north-retail', name: 'North retail run', context: 'Daily-needs circulation', x: 40, y: 18, presence: 66, dwell: 14, capture: 49, change: -2.4, opportunity: 'Find where north-side circulation drops before reaching the atrium.' },
      { id: 'vc-l1-lift-w', name: 'West lift lobby', context: 'Vertical circulation cell', x: 40, y: 40, presence: 58, dwell: 9, capture: 46, change: -1.2, opportunity: 'Measure queueing and which floors are reached after lift use.' },
      { id: 'vc-l1-lift-e', name: 'East lift lobby', context: 'Anchor-side vertical core', x: 64, y: 50, presence: 55, dwell: 10, capture: 44, change: 1.5, opportunity: 'Compare floor-change demand against the west lift lobby.' },
    ],
    L2: [
      { id: 'vc-l2-esc-core', name: 'Escalator core', context: 'L1↔L2 arrival from the atrium', x: 50, y: 50, presence: 90, dwell: 12, capture: 62, change: 5.5, opportunity: 'Locate stopping and leakage as visitors arrive on the fashion floor.' },
      { id: 'vc-l2-uniqlo', name: 'UNIQLO frontage', context: 'West fashion anchor', x: 20, y: 26, presence: 85, dwell: 34, capture: 60, change: 7.8, opportunity: 'Reveal which arrival cohorts enter this anchor and where they go next.' },
      { id: 'vc-l2-zara', name: 'Zara frontage', context: 'West fashion cluster', x: 30, y: 30, presence: 74, dwell: 22, capture: 53, change: 3.1, opportunity: 'Separate storefront passers-by from shoppers entering the store.' },
      { id: 'vc-l2-hm', name: 'H&M frontage', context: 'East Inditex anchor', x: 80, y: 26, presence: 82, dwell: 30, capture: 58, change: 6.2, opportunity: 'Quantify frontage exposure, entry and post-visit paths separately.' },
      { id: 'vc-l2-inditex', name: 'Inditex cluster', context: 'East fashion run', x: 70, y: 30, presence: 70, dwell: 24, capture: 50, change: -1.3, opportunity: 'Identify where fashion-floor circulation bypasses smaller tenants.' },
      { id: 'vc-l2-playground', name: 'Kids playground', context: 'Family draw and dwell magnet', x: 20, y: 74, presence: 88, dwell: 47, capture: 64, change: 9.1, opportunity: 'Measure the family halo across neighbouring tenants and F&B.' },
      { id: 'vc-l2-foodstreet', name: 'Food street', context: 'South-east F&B cluster', x: 78, y: 76, presence: 91, dwell: 43, capture: 67, change: 8.0, opportunity: 'Connect F&B dwell to onward retail visits versus single-stop dining.' },
      { id: 'vc-l2-monorail', name: 'Sentosa Express link', context: 'Monorail station threshold', x: 92, y: 48, presence: 76, dwell: 6, capture: 55, change: 10.4, opportunity: 'Separate Sentosa-bound pass-through from shoppers with dwell thresholds.' },
      { id: 'vc-l2-atrium-n', name: 'North atrium edge', context: 'Upper void circulation', x: 50, y: 22, presence: 63, dwell: 13, capture: 47, change: -2.0, opportunity: 'Find the exact point where north-side upper circulation thins out.' },
      { id: 'vc-l2-lift-w', name: 'West lift lobby', context: 'Upper vertical core', x: 40, y: 42, presence: 57, dwell: 10, capture: 45, change: 1.1, opportunity: 'Measure floor destinations and queueing after lift use.' },
      { id: 'vc-l2-south-conn', name: 'South connector', context: 'Playground-to-food transition', x: 50, y: 82, presence: 66, dwell: 16, capture: 48, change: 2.6, opportunity: 'Quantify how family visitors move between the playground and food street.' },
    ],
  },
  floorplan: {
    type: 'schematic',
    schematic: {
      L1: {
        corridors: ['M14 48 H88', 'M50 20 V80', 'M28 30 H72'],
        blocks: [
          { x: 2, y: 40, w: 14, h: 18, label: 'HarbourFront MRT', kind: 'transit' },
          { x: 44, y: 42, w: 16, h: 18, label: 'Central Court', kind: 'atrium' },
          { x: 64, y: 12, w: 30, h: 22, label: 'FairPrice Xtra', kind: 'anchor' },
          { x: 64, y: 62, w: 30, h: 24, label: 'Tangs', kind: 'anchor' },
          { x: 20, y: 72, w: 34, h: 20, label: 'Waterfront dining', kind: 'food' },
          { x: 84, y: 40, w: 14, h: 18, label: 'Sentosa Gateway', kind: 'transit' },
        ],
        entrances: [
          { x: 4, y: 49, label: 'MRT', kind: 'transit' },
          { x: 30, y: 96, label: 'Waterfront Plaza', kind: 'street' },
          { x: 96, y: 49, label: 'Sentosa', kind: 'transit' },
          { x: 50, y: 6, label: 'Car park', kind: 'parking' },
        ],
        journeys: ['M6 48 C24 46 34 50 50 50 S74 50 92 48', 'M30 92 C34 80 44 72 50 66 S70 66 78 72'],
      },
      L2: {
        corridors: ['M14 50 H88', 'M50 22 V82', 'M28 30 H72'],
        blocks: [
          { x: 6, y: 16, w: 26, h: 22, label: 'UNIQLO · Zara', kind: 'anchor' },
          { x: 44, y: 42, w: 16, h: 18, label: 'Atrium void', kind: 'atrium' },
          { x: 68, y: 16, w: 26, h: 22, label: 'H&M · Inditex', kind: 'anchor' },
          { x: 6, y: 64, w: 26, h: 24, label: 'Kids playground', kind: 'retail' },
          { x: 62, y: 64, w: 32, h: 24, label: 'Food street', kind: 'food' },
          { x: 84, y: 40, w: 14, h: 18, label: 'Sentosa Express', kind: 'transit' },
        ],
        entrances: [
          { x: 50, y: 6, label: 'Sky bridge', kind: 'street' },
          { x: 96, y: 49, label: 'Monorail', kind: 'transit' },
        ],
        journeys: ['M20 26 C34 34 44 46 50 50 S74 40 92 48', 'M20 74 C34 70 46 62 50 60 S70 70 78 76'],
      },
    },
  },
}
