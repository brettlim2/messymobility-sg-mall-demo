import { useMemo } from 'react'
import { DeckGL } from '@deck.gl/react'
import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers'
import { Map as MapGL } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { MapCamera } from '../demo/types'
import { MODE_CAMERAS, STORY_CAMERAS, useAppStore } from '../store'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const INITIAL_VIEW: MapCamera = MODE_CAMERAS.story

function lqColor(lq: number): [number, number, number, number] {
  if (lq < 0.85) return [99, 102, 241, 180]
  if (lq < 1.05) return [34, 211, 238, 160]
  if (lq < 1.25) return [250, 204, 21, 200]
  return [244, 63, 94, 220]
}

function corridorColor(score: number, max: number): [number, number, number, number] {
  const t = Math.min(score / max, 1)
  return [Math.round(34 + t * 210), Math.round(211 - t * 100), Math.round(238 - t * 150), 200]
}

/** EV station utilization → green (low) → amber → red (saturated). */
function evUtilColor(util: number): [number, number, number, number] {
  const t = Math.max(0, Math.min(util / 0.85, 1))
  return [Math.round(45 + t * 200), Math.round(212 - t * 150), Math.round(120 - t * 90), 220]
}

export function MapView({ className = '' }: { className?: string }) {
  const result = useAppStore((s) => s.result)
  const layers = useAppStore((s) => s.layers)
  const selectedUserId = useAppStore((s) => s.params.selectedUserId)
  const selectedMotif = useAppStore((s) => s.selectedMotif)
  const appMode = useAppStore((s) => s.appMode)
  const storyStep = useAppStore((s) => s.storyStep)
  const demoData = useAppStore((s) => s.demoData)
  const demoLayers = useAppStore((s) => s.demoLayers)
  const selectedCorridor = useAppStore((s) => s.selectedCorridor)
  const mapCamera = useAppStore((s) => s.mapCamera)

  const targetView = useMemo(() => {
    const cam = mapCamera ?? (appMode === 'story' ? STORY_CAMERAS[storyStep] : MODE_CAMERAS[appMode])
    return { ...INITIAL_VIEW, ...cam }
  }, [mapCamera, appMode, storyStep])

  const isStory = appMode === 'story'

  const storyViewState = useMemo(
    () => ({ ...targetView, transitionDuration: 1200 }),
    [targetView],
  )

  const interactiveInitialView = useMemo(
    () => ({ ...targetView, transitionDuration: 1200 }),
    [targetView],
  )

  const deckLayers = useMemo(() => {
    const out = []
    const isAnalyst = appMode === 'analyst'

    if (result && isAnalyst) {
      const pings = selectedUserId
        ? result.pings.filter((p) => p.adId === selectedUserId)
        : result.pings

      if (layers.h3Density) {
        const h3Counts = new Map<string, number>()
        for (const p of pings) {
          if (!p.h3) continue
          h3Counts.set(p.h3, (h3Counts.get(p.h3) ?? 0) + 1)
        }
        out.push(
          new H3HexagonLayer({
            id: 'h3-density',
            data: [...h3Counts.entries()].map(([h3, count]) => ({ h3, count })),
            getHexagon: (d) => d.h3,
            getFillColor: (d) => {
              const t = Math.min(d.count / 80, 1)
              return [6 + t * 20, 182 - t * 80, 212, 120 + t * 100]
            },
            extruded: true,
            getElevation: (d) => Math.min(d.count * 80, 4000),
            elevationScale: 1,
            pickable: true,
          }),
        )
      }

      if (layers.lqChoropleth) {
        out.push(
          new H3HexagonLayer({
            id: 'lq-choropleth',
            data: result.zoneMetrics.filter((z) => z.zoneId.startsWith('8')),
            getHexagon: (d) => d.zoneId,
            getFillColor: (d) => lqColor(d.lqByMotif[selectedMotif] ?? 1),
            extruded: false,
            stroked: true,
            getLineColor: [148, 163, 184, 100],
            pickable: true,
          }),
        )
      }

      if (layers.trajectories) {
        const pathsByUser = new Map<string, [number, number][]>()
        for (const p of pings) {
          const path = pathsByUser.get(p.adId) ?? []
          path.push([p.lng, p.lat])
          pathsByUser.set(p.adId, path)
        }
        out.push(
          new PathLayer({
            id: 'trajectories',
            data: [...pathsByUser.entries()].map(([adId, path]) => ({ adId, path })),
            getPath: (d) => d.path,
            getColor: (d) =>
              d.adId === selectedUserId ? [34, 211, 238, 220] : [100, 116, 139, 80],
            getWidth: (d) => (d.adId === selectedUserId ? 4 : 1.5),
            widthMinPixels: 1,
            pickable: true,
          }),
        )
      }

      if (layers.stays) {
        const stays = selectedUserId
          ? (result.staysByUser[selectedUserId] ?? [])
          : Object.values(result.staysByUser).flat()
        out.push(
          new ScatterplotLayer({
            id: 'stays',
            data: stays,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: (d) => Math.min(d.durationMin * 8, 400),
            radiusMinPixels: 6,
            radiusMaxPixels: 28,
            getFillColor: [168, 85, 247, 180],
            pickable: true,
          }),
        )
      }

      if (layers.homes) {
        const homes = selectedUserId
          ? result.homes[selectedUserId]
            ? [result.homes[selectedUserId]]
            : []
          : Object.values(result.homes)
        out.push(
          new ScatterplotLayer({
            id: 'homes',
            data: homes,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: 120,
            radiusMinPixels: 10,
            radiusMaxPixels: 16,
            getFillColor: [251, 191, 36, 230],
            getLineColor: [255, 255, 255, 200],
            lineWidthMinPixels: 2,
            stroked: true,
            pickable: true,
          }),
        )
      }

      if (layers.pings) {
        out.push(
          new ScatterplotLayer({
            id: 'pings',
            data: pings.slice(0, 5000),
            getPosition: (d) => [d.lng, d.lat],
            getRadius: 30,
            radiusMinPixels: 2,
            radiusMaxPixels: 5,
            getFillColor: [34, 211, 238, 140],
            pickable: true,
          }),
        )
      }
    }

    if (demoData && !isAnalyst) {
      const maxScore = Math.max(...demoData.corridors.map((c) => c.forwardScore), 1)

      if (demoLayers.corridors) {
        out.push(
          new H3HexagonLayer({
            id: 'corridors',
            data: demoData.corridors,
            getHexagon: (d) => d.h3,
            getFillColor: (d) =>
              d.id === selectedCorridor
                ? [34, 211, 238, 220]
                : corridorColor(d.forwardScore, maxScore),
            extruded: true,
            getElevation: (d) => (d.id === selectedCorridor ? 8000 : d.forwardScore * 120),
            pickable: true,
          }),
        )
      }

      if (demoLayers.venues) {
        const retailVenues = demoData.venues.filter((v) => v.type !== 'candidate_site')
        out.push(
          new ScatterplotLayer({
            id: 'venues',
            data: retailVenues,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: 180,
            radiusMinPixels: 8,
            radiusMaxPixels: 20,
            getFillColor: (d) =>
              d.type === 'store' ? [167, 139, 250, 220] : [251, 191, 36, 180],
            getLineColor: [255, 255, 255, 180],
            lineWidthMinPixels: 2,
            stroked: true,
            pickable: true,
          }),
        )
      }

      if (demoLayers.footfallUplift) {
        const campaign = demoData.campaigns[0]
        if (campaign) {
          const targetIds = new Set(campaign.targetVenueIds)
          const recentFoot = demoData.footfallTimeseries.filter((f) => targetIds.has(f.venueId))
          const byVenue = new Map<string, number>()
          for (const f of recentFoot.slice(-14)) {
            const lift = f.baseline > 0 ? (f.footfall - f.baseline) / f.baseline : 0
            byVenue.set(f.venueId, (byVenue.get(f.venueId) ?? 0) + lift)
          }
          const upliftData = demoData.venues
            .filter((v) => targetIds.has(v.id))
            .map((v) => ({
              ...v,
              uplift: (byVenue.get(v.id) ?? 0) / 14,
            }))

          out.push(
            new ScatterplotLayer({
              id: 'footfall-uplift',
              data: upliftData,
              getPosition: (d) => [d.lng, d.lat],
              getRadius: (d) => 400 + Math.max(0, d.uplift) * 2000,
              radiusMinPixels: 20,
              radiusMaxPixels: 60,
              getFillColor: [34, 211, 238, 60],
              stroked: true,
              getLineColor: [34, 211, 238, 160],
              lineWidthMinPixels: 2,
              pickable: true,
            }),
          )
        }
      }

      if (demoLayers.socialOrigin) {
        const narrativeVenues = demoData.venues.filter((v) =>
          ['taguig', 'makati'].includes(v.city),
        )
        out.push(
          new ScatterplotLayer({
            id: 'social-origin',
            data: narrativeVenues,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: 250,
            radiusMinPixels: 12,
            radiusMaxPixels: 30,
            getFillColor: [244, 63, 94, 100],
            pickable: false,
          }),
        )
      }

      if (demoLayers.evStations) {
        // Recent (last-7-day) utilization per station for color coding
        const utilByStation = new Map<string, number>()
        const recentSessions = demoData.evSessions.slice(-15 * 7)
        for (const s of recentSessions) {
          const prev = utilByStation.get(s.stationId)
          utilByStation.set(s.stationId, prev === undefined ? s.utilization : (prev + s.utilization) / 2)
        }

        const liveStations = demoData.evStations.filter((s) => s.status === 'live')
        out.push(
          new ScatterplotLayer({
            id: 'ev-stations',
            data: liveStations,
            getPosition: (d) => [d.lng, d.lat],
            getRadius: (d) => 120 + d.connectors * 22,
            radiusMinPixels: 7,
            radiusMaxPixels: 24,
            getFillColor: (d) => evUtilColor(utilByStation.get(d.id) ?? 0.2),
            getLineColor: (d) => (d.type === 'dcfc' ? [255, 255, 255, 220] : [148, 163, 184, 180]),
            lineWidthMinPixels: 2,
            stroked: true,
            pickable: true,
          }),
        )

        // Candidate expansion sites — extruded by opportunity score
        const candidates = demoData.evStations.filter((s) => s.status === 'candidate')
        const maxOpp = Math.max(...candidates.map((c) => c.opportunityScore ?? 0), 1)
        out.push(
          new H3HexagonLayer({
            id: 'ev-opportunity',
            data: candidates,
            getHexagon: (d) => d.h3,
            getFillColor: (d) => corridorColor(d.opportunityScore ?? 0, maxOpp),
            extruded: true,
            getElevation: (d) => (d.opportunityScore ?? 0) * 90,
            pickable: true,
          }),
        )
      }
    }

    return out
  }, [
    result,
    layers,
    selectedUserId,
    selectedMotif,
    appMode,
    demoData,
    demoLayers,
    selectedCorridor,
  ])

  const showMobilityBadge = appMode === 'analyst'
  const showFusionBadge = appMode !== 'analyst'

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/[0.08] shadow-xl shadow-black/20 ${className}`}
    >
      <DeckGL
        {...(isStory
          ? { viewState: storyViewState, controller: false as const }
          : {
              key: `map-${appMode}-${selectedCorridor ?? 'all'}`,
              initialViewState: interactiveInitialView,
              controller: true as const,
            })}
        layers={deckLayers}
        getTooltip={({ object }) => {
          if (!object) return null
          if ('count' in object) return { text: `Pings: ${object.count}` }
          if ('durationMin' in object) return { text: `Stay: ${object.durationMin.toFixed(0)} min` }
          if ('nightVisits' in object) return { text: `Home (${object.city})` }
          if ('lqByMotif' in object)
            return { text: `LQ ${selectedMotif}: ${(object.lqByMotif[selectedMotif] ?? 0).toFixed(2)}` }
          if ('forwardScore' in object)
            return { text: `${object.name}\nScore: ${object.forwardScore} · #${object.roiRank}` }
          if ('name' in object && 'brand' in object)
            return { text: `${object.name} (${object.brand})` }
          if ('uplift' in object) return { text: `Footfall uplift halo` }
          return null
        }}
      >
        <MapGL mapStyle={MAP_STYLE} attributionControl={false} />
      </DeckGL>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/[0.08] bg-black/60 px-3 py-2 text-[11px] text-[var(--vm-muted)] backdrop-blur-md">
        {showMobilityBadge && 'Singapore · Veraset GPS · H3 res-10 · CARTO Dark'}
        {showFusionBadge && 'Consumer Behavior Graph · NCR + CALABARZON'}
      </div>
      {layers.lqChoropleth && appMode === 'analyst' && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-slate-900/90 px-3 py-2 text-xs backdrop-blur">
          <p className="mb-1 font-medium text-slate-300">LQ: {selectedMotif}</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-4 rounded bg-indigo-400" /> &lt;0.85
            <span className="h-2 w-4 rounded bg-cyan-400" /> ~1
            <span className="h-2 w-4 rounded bg-yellow-400" /> &gt;1.05
            <span className="h-2 w-4 rounded bg-rose-400" /> &gt;1.25
          </div>
        </div>
      )}
    </div>
  )
}
