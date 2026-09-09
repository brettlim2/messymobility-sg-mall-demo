import { useEffect } from 'react'
import type { ApiCatalog, BehaviorGraph, Campaign, Corridor, DemoMeta, EvHourlyProfile, EvSessionDay, EvStation, FootfallDay, Narrative, SocialDay, Venue } from '../demo/types'
import { useAppStore } from '../store'

interface RawDemoBundle {
  meta: DemoMeta
  venues: Venue[]
  narratives: Narrative[]
  social_timeseries: SocialDay[]
  footfall_timeseries: FootfallDay[]
  campaigns: Campaign[]
  corridors: Corridor[]
  behavior_graph: BehaviorGraph
  api_catalog?: ApiCatalog
}

/** Fetch an optional JSON feed; degrade to a fallback if missing/unparseable. */
async function fetchOptional<T>(name: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}demo/${name}.json`)
    if (!r.ok) return fallback
    return (await r.json()) as T
  } catch {
    return fallback
  }
}

export function useDemoData() {
  const setDemoData = useAppStore((s) => s.setDemoData)
  const setDemoLoading = useAppStore((s) => s.setDemoLoading)
  const setDemoError = useAppStore((s) => s.setDemoError)
  const setSelectedCampaign = useAppStore((s) => s.setSelectedCampaign)
  const setSelectedCorridor = useAppStore((s) => s.setSelectedCorridor)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setDemoLoading(true)
      try {
        const files = [
          'meta',
          'venues',
          'narratives',
          'social_timeseries',
          'footfall_timeseries',
          'campaigns',
          'corridors',
          'behavior_graph',
          'api_catalog',
        ] as const

        const [responses, evStations, evSessions, evHourly] = await Promise.all([
          Promise.all(
            files.map((f) => fetch(`${import.meta.env.BASE_URL}demo/${f}.json`).then((r) => {
              if (!r.ok) throw new Error(`Failed to load ${f}.json`)
              return r.json()
            })),
          ),
          fetchOptional<EvStation[]>('ev_stations', []),
          fetchOptional<EvSessionDay[]>('ev_sessions', []),
          fetchOptional<EvHourlyProfile[]>('ev_hourly', []),
        ])

        if (cancelled) return

        const [
          meta,
          venues,
          narratives,
          socialTimeseries,
          footfallTimeseries,
          campaigns,
          corridors,
          behaviorGraph,
          apiCatalog,
        ] = responses as [
          DemoMeta,
          Venue[],
          Narrative[],
          SocialDay[],
          FootfallDay[],
          Campaign[],
          Corridor[],
          BehaviorGraph,
          ApiCatalog,
        ]

        const bundle: RawDemoBundle = {
          meta,
          venues,
          narratives,
          social_timeseries: socialTimeseries,
          footfall_timeseries: footfallTimeseries,
          campaigns,
          corridors,
          behavior_graph: behaviorGraph,
          api_catalog: apiCatalog,
        }

        setDemoData({
          meta: bundle.meta,
          venues: bundle.venues,
          narratives: bundle.narratives,
          socialTimeseries: bundle.social_timeseries,
          footfallTimeseries: bundle.footfall_timeseries,
          campaigns: bundle.campaigns,
          corridors: bundle.corridors,
          behaviorGraph: bundle.behavior_graph,
          apiCatalog: apiCatalog,
          evStations,
          evSessions,
          evHourly,
        })

        if (campaigns[0]) setSelectedCampaign(campaigns[0].id)
        const topCorridor = [...corridors].sort((a, b) => a.roiRank - b.roiRank)[0]
        if (topCorridor) setSelectedCorridor(topCorridor.id)
        setDemoError(null)
      } catch (err) {
        if (!cancelled) setDemoError(String(err))
      } finally {
        if (!cancelled) setDemoLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [setDemoData, setDemoError, setDemoLoading, setSelectedCampaign, setSelectedCorridor])
}
