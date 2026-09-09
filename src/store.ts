import { create } from 'zustand'
import type { AppMode, DemoData, DemoLayerVisibility, MapCamera } from './demo/types'
import { DEFAULT_PARAMS, type PipelineParams, type PipelineResult } from './pipeline/types'

export interface LayerVisibility {
  pings: boolean
  trajectories: boolean
  stays: boolean
  homes: boolean
  h3Density: boolean
  lqChoropleth: boolean
}

export const DEFAULT_DEMO_LAYERS: DemoLayerVisibility = {
  venues: true,
  footfallUplift: true,
  corridors: false,
  socialOrigin: false,
  evStations: false,
}

export const MODE_CAMERAS: Record<AppMode, MapCamera> = {
  story: { longitude: 121.04, latitude: 14.58, zoom: 10.5, pitch: 45, bearing: -15 },
  api: { longitude: 121.04, latitude: 14.58, zoom: 10, pitch: 30, bearing: 0 },
  attribution: { longitude: 121.048, latitude: 14.548, zoom: 12.5, pitch: 50, bearing: -20 },
  site: { longitude: 121.02, latitude: 14.35, zoom: 9.8, pitch: 40, bearing: 0 },
  mall: { longitude: 121.04, latitude: 14.58, zoom: 14, pitch: 0, bearing: 0 },
  analyst: { longitude: 103.82, latitude: 1.35, zoom: 10.8, pitch: 45, bearing: -15 },
  ev: { longitude: 121.035, latitude: 14.57, zoom: 11, pitch: 50, bearing: -15 },
}

/** One camera preset per story beat (8 beats) */
export const STORY_CAMERAS: MapCamera[] = [
  { longitude: 121.04, latitude: 14.58, zoom: 10.5, pitch: 45, bearing: -15 }, // 01 hook
  { longitude: 121.04, latitude: 14.58, zoom: 10.5, pitch: 30, bearing: 0 }, // 02 gap
  { longitude: 121.04, latitude: 14.58, zoom: 10.5, pitch: 35, bearing: -10 }, // 03 dual
  { longitude: 121.04, latitude: 14.55, zoom: 11.2, pitch: 50, bearing: -20 }, // 04 fusion
  { longitude: 121.04, latitude: 14.58, zoom: 10, pitch: 25, bearing: 0 }, // 05 API
  { longitude: 121.048, latitude: 14.548, zoom: 12.5, pitch: 50, bearing: -20 }, // 06 attribution
  { longitude: 121.056, latitude: 14.23, zoom: 11.5, pitch: 50, bearing: 10 }, // 07 corridor
  { longitude: 121.035, latitude: 14.57, zoom: 11, pitch: 50, bearing: -15 }, // 08 EV network
  { longitude: 121.04, latitude: 14.58, zoom: 10, pitch: 35, bearing: 0 }, // 09 vision
]

interface AppState {
  params: PipelineParams
  result: PipelineResult | null
  loading: boolean
  ready: boolean
  error: string | null
  layers: LayerVisibility
  selectedMotif: string
  appMode: AppMode
  storyStep: number
  demoData: DemoData | null
  demoLoading: boolean
  demoError: string | null
  selectedCampaign: string | null
  selectedCorridor: string | null
  demoLayers: DemoLayerVisibility
  mapCamera: MapCamera | null
  setParam: <K extends keyof PipelineParams>(key: K, value: PipelineParams[K]) => void
  setParams: (partial: Partial<PipelineParams>) => void
  setResult: (result: PipelineResult | null) => void
  setLoading: (loading: boolean) => void
  setReady: (ready: boolean) => void
  setError: (error: string | null) => void
  toggleLayer: (layer: keyof LayerVisibility) => void
  setSelectedMotif: (motif: string) => void
  setAppMode: (mode: AppMode) => void
  setStoryStep: (step: number) => void
  setDemoData: (data: DemoData | null) => void
  setDemoLoading: (loading: boolean) => void
  setDemoError: (error: string | null) => void
  setSelectedCampaign: (id: string | null) => void
  setSelectedCorridor: (id: string | null) => void
  toggleDemoLayer: (layer: keyof DemoLayerVisibility) => void
  setDemoLayers: (layers: Partial<DemoLayerVisibility>) => void
  setMapCamera: (camera: MapCamera | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  params: { ...DEFAULT_PARAMS },
  result: null,
  loading: true,
  ready: false,
  error: null,
  layers: {
    pings: false,
    trajectories: true,
    stays: true,
    homes: true,
    h3Density: true,
    lqChoropleth: false,
  },
  selectedMotif: '2-node',
  appMode: 'mall',
  storyStep: 0,
  demoData: null,
  demoLoading: true,
  demoError: null,
  selectedCampaign: null,
  selectedCorridor: null,
  demoLayers: { ...DEFAULT_DEMO_LAYERS },
  mapCamera: STORY_CAMERAS[0],
  setParam: (key, value) => set((s) => ({ params: { ...s.params, [key]: value } })),
  setParams: (partial) => set((s) => ({ params: { ...s.params, ...partial } })),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setReady: (ready) => set({ ready }),
  setError: (error) => set({ error }),
  toggleLayer: (layer) =>
    set((s) => ({ layers: { ...s.layers, [layer]: !s.layers[layer] } })),
  setSelectedMotif: (motif) => set({ selectedMotif: motif }),
  setAppMode: (mode) =>
    set((s) => ({
      appMode: mode,
      mapCamera: MODE_CAMERAS[mode],
      demoLayers:
        mode === 'site'
          ? { venues: false, footfallUplift: false, corridors: true, socialOrigin: true, evStations: false }
          : mode === 'attribution'
            ? { venues: true, footfallUplift: true, corridors: false, socialOrigin: true, evStations: false }
            : mode === 'ev'
              ? { venues: false, footfallUplift: false, corridors: true, socialOrigin: false, evStations: true }
              : mode === 'analyst'
                ? s.demoLayers
                : s.demoLayers,
    })),
  setStoryStep: (step) =>
    set((s) => {
      const topCorridor = s.demoData?.corridors
        .slice()
        .sort((a, b) => a.roiRank - b.roiRank)[0]
      return {
        storyStep: step,
        mapCamera: STORY_CAMERAS[step] ?? STORY_CAMERAS[0],
        selectedCorridor:
          step === 6 ? (topCorridor?.id ?? s.selectedCorridor) : s.selectedCorridor,
        demoLayers:
          step < 3
            ? { venues: false, footfallUplift: false, corridors: false, socialOrigin: false, evStations: false }
            : step === 3
              ? { venues: true, footfallUplift: false, corridors: false, socialOrigin: true, evStations: false }
              : step === 4
                ? { venues: false, footfallUplift: false, corridors: false, socialOrigin: false, evStations: false }
                : step === 5
                  ? { venues: true, footfallUplift: true, corridors: false, socialOrigin: true, evStations: false }
                  : step === 6
                    ? { venues: false, footfallUplift: false, corridors: true, socialOrigin: true, evStations: false }
                    : step === 7
                      ? { venues: false, footfallUplift: false, corridors: true, socialOrigin: false, evStations: true }
                      : { venues: true, footfallUplift: true, corridors: true, socialOrigin: false, evStations: true },
      }
    }),
  setDemoData: (data) => set({ demoData: data }),
  setDemoLoading: (loading) => set({ demoLoading: loading }),
  setDemoError: (error) => set({ demoError: error }),
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
  setSelectedCorridor: (id) => set({ selectedCorridor: id }),
  toggleDemoLayer: (layer) =>
    set((s) => ({ demoLayers: { ...s.demoLayers, [layer]: !s.demoLayers[layer] } })),
  setDemoLayers: (layers) =>
    set((s) => ({ demoLayers: { ...s.demoLayers, ...layers } })),
  setMapCamera: (camera) => set({ mapCamera: camera }),
}))
