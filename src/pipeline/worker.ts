import { loadPingsFromCsv } from './csv'
import { runPipeline } from './index'
import type { PipelineParams } from './types'

let cachedPings: Awaited<ReturnType<typeof loadPingsFromCsv>> | null = null

self.onmessage = async (e: MessageEvent<{ type: string; params?: PipelineParams; csvUrl?: string }>) => {
  const { type, params, csvUrl } = e.data

  if (type === 'init' && csvUrl) {
    try {
      cachedPings = await loadPingsFromCsv(csvUrl)
      self.postMessage({ type: 'ready', userCount: new Set(cachedPings.map((p) => p.adId)).size })
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err) })
    }
    return
  }

  if (type === 'run' && params && cachedPings) {
    try {
      const result = runPipeline(cachedPings, params)
      self.postMessage({ type: 'result', result })
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err) })
    }
  }
}

export {}
